// src/lib/purchaseUtils.ts

import prisma from './prisma';
import { BadRequestError } from './errors';
import logger from './logger';
import { SubscriptionTier, UserRole } from '@/types';

export type PurchaseItem = {
  id: number;
  price: number;
  type: 'merch' | 'ticket' | 'subscription';
  tier?: SubscriptionTier;
};

export type PurchaseResult = {
  success: boolean;
  message: string;
  purchaseId?: number;
};

async function processPayment(amount: number): Promise<boolean> {
  // Mock implementation
  // In a real-world scenario, this would integrate with a payment gateway
  return true;
}

export async function makePurchase(
  userId: number,
  item: PurchaseItem,
  quantity: number = 1
): Promise<PurchaseResult> {
  const totalPrice = item.price * quantity;

  // Start a transaction
  return prisma.$transaction(async (prisma) => {
    // Process payment
    const paymentSuccessful = await processPayment(totalPrice);
    if (!paymentSuccessful) {
      throw new BadRequestError('Payment failed');
    }

    let purchaseId: number;
    switch (item.type) {
      case 'merch':
        const merchPurchase = await prisma.merchPurchase.create({
          data: {
            merchItemId: item.id,
            userId,
            quantity,
            totalPrice,
          },
        });
        purchaseId = merchPurchase.id;
        break;

      case 'ticket':
        const ticket = await prisma.ticket.create({
          data: {
            eventId: item.id,
            userId,
            price: item.price,
            // Add other necessary ticket fields here
          },
        });
        purchaseId = ticket.id;
        break;

      case 'subscription':
        if (!item.tier) {
          throw new BadRequestError('Subscription tier is required');
        }
        const subscription = await prisma.subscription.create({
          data: {
            userId,
            tier: item.tier,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          },
        });
        await prisma.user.update({
          where: { id: userId },
          data: { role: UserRole.PATRON },
        });
        purchaseId = subscription.id;
        break;

      default:
        throw new BadRequestError('Invalid purchase type');
    }

    logger.info(`${item.type} purchased`, { userId, itemId: item.id, quantity, totalPrice });

    return {
      success: true,
      message: 'Purchase successful',
      purchaseId,
    };
  });
}