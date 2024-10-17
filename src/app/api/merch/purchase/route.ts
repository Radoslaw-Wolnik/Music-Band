// src/app/api/merch/purchase/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';
import { makePurchase, PurchaseItem } from '@/lib/purchaseUtils';
import { updateStock } from '@/lib/stockUtils';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError('You must be logged in to purchase merch');
    }

    const { itemId, quantity } = await req.json();

    if (!itemId || !quantity) {
      throw new BadRequestError('Missing required fields');
    }

    const item = await prisma.merchItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundError('Invalid item');
    }

    // Update stock first
    await updateStock(itemId, quantity);

    const purchaseItem: PurchaseItem = {
      id: item.id,
      price: item.price,
      type: 'merch',
    };

    const result = await makePurchase(parseInt(session.user.id), purchaseItem, quantity);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error purchasing merch item', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}