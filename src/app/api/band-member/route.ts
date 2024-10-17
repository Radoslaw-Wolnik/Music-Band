// src/app/api/band-members/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole } from '@/types';


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bandMember = await prisma.bandMember.findUnique({
      where: { id: parseInt(params.id) },
      include: { user: true },
    });

    if (!bandMember) {
      throw new NotFoundError('Band member not found');
    }

    return NextResponse.json(bandMember);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error fetching band member', { error, bandMemberId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.BAND_MEMBER) {
      throw new UnauthorizedError('Only band members can update their profiles');
    }

    const { instrument, bio } = await req.json();

    const updatedBandMember = await prisma.bandMember.update({
      where: { id: parseInt(params.id), userId: parseInt(session.user.id) },
      data: { instrument, bio },
    });

    logger.info('Band member profile updated', { bandMemberId: updatedBandMember.id, userId: session.user.id });
    return NextResponse.json(updatedBandMember);
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error updating band member profile', { error, bandMemberId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}