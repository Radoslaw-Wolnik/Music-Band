// src/app/api/venues/[id]/layout/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole } from '@/types';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.MANAGER) {
      throw new UnauthorizedError('Only managers can update venue layouts');
    }

    const { layout } = await req.json();

    if (!layout) {
      throw new BadRequestError('Layout is required');
    }

    const updatedVenue = await prisma.venue.update({
      where: { id: parseInt(params.id) },
      data: { layout },
    });

    logger.info('Venue layout updated', { venueId: updatedVenue.id, managerId: session.user.id });
    return NextResponse.json(updatedVenue);
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error updating venue layout', { error, venueId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}