// src/app/api/merch/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole } from '@/types';

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
    if (error instanceof UnauthorizedError || error instanceof BadRequestError || error instanceof NotFoundError) {
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
    if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error deleting merch item', { error, itemId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}