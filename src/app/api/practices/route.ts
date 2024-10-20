// src/app/api/practices/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole } from '@/types';
import { getPaginationParams, getPaginationData } from '@/lib/pagination';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== UserRole.BAND_MEMBER && session.user.role !== UserRole.MANAGER)) {
      throw new UnauthorizedError('Only band members and managers can view practices');
    }

    const { page, limit } = getPaginationParams(req);

    const [practices, total] = await Promise.all([
      prisma.practice.findMany({
        include: { bandMember: { include: { user: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      prisma.practice.count(),
    ]);

    const paginationData = getPaginationData(total, page, limit);

    return NextResponse.json({ practices, pagination: paginationData });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error fetching practices', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.BAND_MEMBER) {
      throw new UnauthorizedError('Only band members can schedule practices');
    }

    const { date, duration, notes } = await req.json();

    if (!date || !duration) {
      throw new BadRequestError('Missing required fields');
    }

    const bandMember = await prisma.bandMember.findUnique({
      where: { userId: parseInt(session.user.id) },
    });

    if (!bandMember) {
      throw new BadRequestError('Band member profile not found');
    }

    const practice = await prisma.practice.create({
      data: {
        bandMemberId: bandMember.id,
        date: new Date(date),
        duration,
        notes,
      },
    });

    logger.info('Practice scheduled', { practiceId: practice.id, bandMemberId: bandMember.id });
    return NextResponse.json(practice, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error scheduling practice', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}