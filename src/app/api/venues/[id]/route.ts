// src/app/api/venues/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, NotFoundError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole } from '@/types';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const venue = await prisma.venue.findUnique({
      where: { id: parseInt(params.id) },
      include: { events: true },
    });

    if (!venue) {
      throw new NotFoundError('Venue not found');
    }

    return NextResponse.json(venue);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error fetching venue', { error, venueId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.MANAGER) {
      throw new UnauthorizedError('Only managers can update venues');
    }

    const { name, address, capacity, layout } = await req.json();

    if (!name || !address || !capacity || !layout) {
      throw new BadRequestError('Missing required fields');
    }

    const venue = await prisma.venue.update({
      where: { id: parseInt(params.id) },
      data: {
        name,
        address,
        capacity,
        layout,
      },
    });

    logger.info('Venue updated', { venueId: venue.id, managerId: session.user.id });
    return NextResponse.json(venue);
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof NotFoundError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error updating venue', { error, venueId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.MANAGER) {
      throw new UnauthorizedError('Only managers can delete venues');
    }

    const venue = await prisma.venue.delete({
      where: { id: parseInt(params.id) },
    });

    logger.info('Venue deleted', { venueId: venue.id, managerId: session.user.id });
    return NextResponse.json({ message: 'Venue deleted successfully' });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error deleting venue', { error, venueId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}