// src/app/api/notifications/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { getPaginationParams, getPaginationData } from '@/lib/pagination';
import { UserRole } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new UnauthorizedError('You must be logged in to view notifications');
    }

    const { page, limit } = getPaginationParams(req);

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: parseInt(session.user.id) },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where: { userId: parseInt(session.user.id) } }),
    ]);

    const paginationData = getPaginationData(total, page, limit);

    logger.info('Notifications fetched', { userId: session.user.id });
    return NextResponse.json({ notifications, pagination: paginationData });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error fetching notifications', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.MANAGER) {
      throw new UnauthorizedError('Only managers can create notifications');
    }

    const { message, userIds } = await req.json();

    if (!message || !userIds || !Array.isArray(userIds)) {
      throw new BadRequestError('Invalid input');
    }

    const notifications = await prisma.notification.createMany({
      data: userIds.map((userId: number) => ({
        userId,
        message,
      })),
    });

    logger.info('Notifications created', { count: notifications.count, managerId: session.user.id });
    return NextResponse.json({ message: `${notifications.count} notifications created` }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error creating notifications', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}