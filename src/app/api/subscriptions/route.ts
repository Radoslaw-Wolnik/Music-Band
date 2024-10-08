// src/app/api/subscriptions/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError, ConflictError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole, SubscriptionTier } from '@/types';

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

    const subscription = await prisma.subscription.create({
      data: {
        userId: parseInt(session.user.id),
        tier,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    // Update user role to PATRON if subscribing
    if (tier !== SubscriptionTier.FREE) {
      await prisma.user.update({
        where: { id: parseInt(session.user.id) },
        data: { role: UserRole.PATRON },
      });
    }

    logger.info('Subscription created', { subscriptionId: subscription.id, userId: session.user.id, tier });
    return NextResponse.json(subscription, { status: 201 });
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