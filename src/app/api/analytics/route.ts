// src/app/api/analytics/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.MANAGER) {
      throw new UnauthorizedError('Only managers can access analytics');
    }

    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(0);
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date();

    const [ticketSales, merchSales, subscriberGrowth] = await Promise.all([
      prisma.ticket.aggregate({
        where: {
          purchasedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: {
          price: true,
        },
        _count: true,
      }),
      prisma.merchItem.aggregate({
        where: {
          purchases: {
            some: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
        _sum: {
          price: true,
        },
        _count: true,
      }),
      prisma.subscription.groupBy({
        by: ['tier'],
        where: {
          startDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        _count: true,
      }),
    ]);

    const analytics = {
      ticketSales: {
        totalRevenue: ticketSales._sum.price || 0,
        totalSold: ticketSales._count,
      },
      merchSales: {
        totalRevenue: merchSales._sum.price || 0,
        totalSold: merchSales._count,
      },
      subscriberGrowth: Object.fromEntries(
        subscriberGrowth.map(({ tier, _count }) => [tier, _count])
      ),
    };

    logger.info('Analytics fetched', { managerId: session.user.id });
    return NextResponse.json(analytics);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error fetching analytics', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}