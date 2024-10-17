// src/app/api/subscriptions/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError, ConflictError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole, SubscriptionTier } from '@/types';
import { makePurchase, PurchaseItem } from '@/lib/purchaseUtils';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError('You must be logged in to subscribe');
    }

    const { tier } = await req.json();

    if (!tier || !Object.values(SubscriptionTier).includes(tier)) {
      throw new BadRequestError('Invalid subscription tier');
    }

    const existingSubscription = await prisma.subscription.findFirst({
      where: { userId: parseInt(session.user.id) },
    });

    if (existingSubscription) {
      throw new ConflictError('You already have an active subscription');
    }

    const purchaseItem: PurchaseItem = {
      id: 0, // Subscription doesn't have a specific item ID
      price: getTierPrice(tier), // Implement this function to get the price for each tier
      type: 'subscription',
      tier: tier,
    };

    const result = await makePurchase(parseInt(session.user.id), purchaseItem);

    logger.info('Subscription created', { subscriptionId: result.purchaseId, userId: session.user.id, tier });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError || error instanceof ConflictError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error creating subscription', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError('You must be logged in to view your subscription');
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId: parseInt(session.user.id) },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error fetching subscription', { error });
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