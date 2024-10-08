// src/app/api/practices/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, NotFoundError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole } from '@/types';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.BAND_MEMBER) {
      throw new UnauthorizedError('Only band members can update practices');
    }

    const { date, duration, notes } = await req.json();

    if (!date || !duration) {
      throw new BadRequestError('Missing required fields');
    }

    const practice = await prisma.practice.update({
      where: { 
        id: parseInt(params.id),
        bandMember: { userId: parseInt(session.user.id) }
      },
      data: {
        date: new Date(date),
        duration,
        notes,
      },
    });

    logger.info('Practice updated', { practiceId: practice.id, bandMemberId: practice.bandMemberId });
    return NextResponse.json(practice);
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof NotFoundError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error updating practice', { error, practiceId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.BAND_MEMBER) {
      throw new UnauthorizedError('Only band members can delete practices');
    }

    const practice = await prisma.practice.delete({
      where: { 
        id: parseInt(params.id),
        bandMember: { userId: parseInt(session.user.id) }
      },
    });

    logger.info('Practice deleted', { practiceId: practice.id, bandMemberId: practice.bandMemberId });
    return NextResponse.json({ message: 'Practice deleted successfully' });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error deleting practice', { error, practiceId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}