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

// src/app/api/merch/[id]/route.ts

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.MANAGER) {
      throw new UnauthorizedError('Only managers can update merch items');
    }

    const { name, description, price, stock, image } = await req.json();

    const updatedItem = await prisma.merchItem.update({
      where: { id: parseInt(params.id) },
      data: {
        name,
        description,
        price,
        stock,
        image,
      },
    });

    logger.info('Merch item updated', { merchItemId: updatedItem.id, managerId: session.user.id });
    return NextResponse.json(updatedItem);
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error updating merch item', { error, itemId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.MANAGER) {
      throw new UnauthorizedError('Only managers can delete merch items');
    }

    await prisma.merchItem.delete({
      where: { id: parseInt(params.id) },
    });

    logger.info('Merch item deleted', { merchItemId: params.id, managerId: session.user.id });
    return NextResponse.json({ message: 'Merch item deleted successfully' });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error deleting merch item', { error, itemId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// src/app/api/merch/purchase/route.ts

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
      throw new BadRequestError('Invalid item');
    }

    if (item.stock < quantity) {
      throw new BadRequestError('Not enough stock');
    }

    // Here you would typically integrate with a payment processor
    // For now, we'll just update the stock

    await prisma.merchItem.update({
      where: { id: itemId },
      data: { stock: item.stock - quantity },
    });

    logger.info('Merch item purchased', { itemId, quantity, userId: session.user.id });
    return NextResponse.json({ message: 'Purchase successful' }, { status: 200 });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error purchasing merch item', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}