// src/app/api/merch/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole } from '@/types';

export async function GET(req: Request) {
  try {
    const merchItems = await prisma.merchItem.findMany();
    return NextResponse.json(merchItems);
  } catch (error) {
    logger.error('Error fetching merch items', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.MANAGER) {
      throw new UnauthorizedError('Only managers can add merch items');
    }

    const { name, description, price, stock, image } = await req.json();

    if (!name || !description || !price || !stock) {
      throw new BadRequestError('Missing required fields');
    }

    const merchItem = await prisma.merchItem.create({
      data: {
        name,
        description,
        price,
        stock,
        image,
      },
    });

    logger.info('Merch item created', { merchItemId: merchItem.id, managerId: session.user.id });
    return NextResponse.json(merchItem, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error creating merch item', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}