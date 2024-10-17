// src/lib/stockUtils.ts

import prisma from './prisma';
import { BadRequestError } from './errors';
import logger from './logger';

export async function updateStock(itemId: number, quantity: number): Promise<void> {
  const item = await prisma.merchItem.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    throw new BadRequestError('Item not found');
  }

  if (item.stock < quantity) {
    throw new BadRequestError('Not enough stock');
  }

  await prisma.merchItem.update({
    where: { id: itemId },
    data: { stock: item.stock - quantity },
  });

  logger.info('Stock updated', { itemId, newStock: item.stock - quantity });
}