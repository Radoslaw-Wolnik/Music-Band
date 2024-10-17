// src/app/api/subscriptions/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, NotFoundError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole, SubscriptionTier } from '@/types';
import { makePurchase, PurchaseItem } from '@/lib/purchaseUtils';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError('You must be logged in to update your subscription');
    }

    const { tier } = await req.json();

    if (!tier || !Object.values(SubscriptionTier).includes(tier)) {
      throw new BadRequestError('Invalid subscription tier');
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: parseInt(params.id), userId: parseInt(session.user.id) },
    });

    if (!subscription) {
      throw new NotFoundError('Subscription not found');
    }

    const purchaseItem: PurchaseItem = {
      id: subscription.id,
      price: getTierPrice(tier as SubscriptionTier),
      type: 'subscription',
      tier: tier as SubscriptionTier,
    };

    const result = await makePurchase(parseInt(session.user.id), purchaseItem);

    logger.info('Subscription updated', { subscriptionId: result.purchaseId, userId: session.user.id, tier });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof NotFoundError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error updating subscription', { error, subscriptionId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError('You must be logged in to cancel your subscription');
    }

    const subscription = await prisma.subscription.delete({
      where: { id: parseInt(params.id), userId: parseInt(session.user.id) },
    });

    // Update user role to FAN
    await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: { role: UserRole.FAN },
    });

    logger.info('Subscription cancelled', { subscriptionId: subscription.id, userId: session.user.id });
    return NextResponse.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error cancelling subscription', { error, subscriptionId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getTierPrice(tier: SubscriptionTier): number {
  // Implement pricing logic here
  switch (tier) {
    case SubscriptionTier.BASIC:
      return 9.99;
    case SubscriptionTier.PREMIUM:
      return 19.99;
    default:
      return 0;
  }
}