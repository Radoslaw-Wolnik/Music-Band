// File: src/app/api/events/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import logger from '@/lib/logger';
import { UnauthorizedError, BadRequestError, InternalServerError } from '@/lib/errors';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: { venue: true },
    });
    return NextResponse.json(events);
  } catch (error) {
    logger.error(error, 'Failed to fetch events');
    throw new InternalServerError('Failed to fetch events');
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'MANAGER') {
      throw new UnauthorizedError('Only managers can create events');
    }

    const data = await req.json();

    if (!data.name || !data.description || !data.date || !data.ticketPrices || !data.venueId) {
      throw new BadRequestError('Missing required fields');
    }

    const event = await prisma.event.create({
      data: {
        name: data.name,
        description: data.description,
        date: new Date(data.date),
        ticketPrices: data.ticketPrices,
        venueId: data.venueId,
      },
    });

    logger.info({ eventId: event.id }, 'Event created successfully');
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error(error, 'Failed to create event');
    throw new InternalServerError('Failed to create event');
  }
}