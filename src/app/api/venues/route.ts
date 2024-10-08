// File: src/app/api/venues/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import logger from '@/lib/logger';
import { UnauthorizedError, BadRequestError, InternalServerError } from '@/lib/errors';

export async function GET() {
  try {
    const venues = await prisma.venue.findMany();
    return NextResponse.json(venues);
  } catch (error) {
    logger.error(error, 'Failed to fetch venues');
    throw new InternalServerError('Failed to fetch venues');
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'MANAGER') {
      throw new UnauthorizedError('Only managers can create venues');
    }

    const data = await req.json();

    if (!data.name || !data.address || !data.capacity || !data.layout) {
      throw new BadRequestError('Missing required fields');
    }

    const venue = await prisma.venue.create({
      data: {
        name: data.name,
        address: data.address,
        capacity: data.capacity,
        layout: data.layout,
      },
    });

    logger.info({ venueId: venue.id }, 'Venue created successfully');
    return NextResponse.json(venue, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error(error, 'Failed to create venue');
    throw new InternalServerError('Failed to create venue');
  }
}