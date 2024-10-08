// File: src/app/api/merch/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import logger from '@/lib/logger';
import { UnauthorizedError, BadRequestError, InternalServerError } from '@/lib/errors';

export async function GET() {
  try {
    const merchItems = await prisma.merchItem.findMany();
    return NextResponse.json(merchItems);
  } catch (error) {
    logger.error(error, 'Failed to fetch merch items');
    throw new InternalServerError('Failed to fetch merch items');
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'MANAGER') {
      throw new UnauthorizedError('Only managers can create merch items');
    }

    const data = await req.json();

    if (!data.name || !data.description || !data.price || !data.stock) {
      throw new BadRequestError('Missing required fields');
    }

    const merchItem = await prisma.merchItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        image: data.image,
      },
    });

    logger.info({ merchItemId: merchItem.id }, 'Merch item created successfully');
    return NextResponse.json(merchItem, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error(error, 'Failed to create merch item');
    throw new InternalServerError('Failed to create merch item');
  }
}