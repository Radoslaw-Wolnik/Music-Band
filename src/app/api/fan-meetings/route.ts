// src/app/api/fan-meetings/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole, SubscriptionTier } from '@/types';
import { getPaginationParams, getPaginationData } from '@/lib/pagination';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.PATRON) {
      throw new UnauthorizedError('Only patrons can view fan meetings');
    }

    const { page, limit } = getPaginationParams(req);
    const skip = (page - 1) * limit;

    const [fanMeetings, total] = await Promise.all([
      prisma.fanMeeting.findMany({
        skip,
        take: limit,
        orderBy: { date: 'asc' },
      }),
      prisma.fanMeeting.count(),
    ]);

    const paginationData = getPaginationData(total, page, limit);

    return NextResponse.json({
      fanMeetings,
      pagination: paginationData,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error fetching fan meetings', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.MANAGER) {
      throw new UnauthorizedError('Only managers can create fan meetings');
    }

    const { date, description, maxAttendees } = await req.json();

    if (!date || !description || !maxAttendees) {
      throw new BadRequestError('Missing required fields');
    }

    const fanMeeting = await prisma.fanMeeting.create({
      data: {
        date: new Date(date),
        description,
        maxAttendees,
      },
    });

    logger.info('Fan meeting created', { fanMeetingId: fanMeeting.id, managerId: session.user.id });
    return NextResponse.json(fanMeeting, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error creating fan meeting', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}