// src/app/api/venues/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole } from '@/types';

export async function GET(req: Request) {
  try {
    const venues = await prisma.venue.findMany();
    return NextResponse.json(venues);
  } catch (error) {
    logger.error('Error fetching venues', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.MANAGER) {
      throw new UnauthorizedError('Only managers can create venues');
    }

    const { name, address, capacity, layout } = await req.json();

    if (!name || !address || !capacity || !layout) {
      throw new BadRequestError('Missing required fields');
    }

    const venue = await prisma.venue.create({
      data: {
        name,
        address,
        capacity,
        layout,
      },
    });

    logger.info('Venue created', { venueId: venue.id, managerId: session.user.id });
    return NextResponse.json(venue, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error creating venue', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}