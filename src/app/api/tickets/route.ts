// File: src/app/api/tickets/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import logger from '@/lib/logger';
import { UnauthorizedError, BadRequestError, InternalServerError } from '@/lib/errors';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError('You must be logged in to purchase tickets');
    }

    const data = await req.json();

    if (!data.eventId || !data.zone || !data.quantity) {
      throw new BadRequestError('Missing required fields');
    }

    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
    });

    if (!event) {
      throw new BadRequestError('Event not found');
    }

    const ticketPrice = event.ticketPrices[data.zone];

    if (!ticketPrice) {
      throw new BadRequestError('Invalid ticket zone');
    }

    const ticket = await prisma.ticket.create({
      data: {
        eventId: data.eventId,
        userId: parseInt(session.user.id),
        seat: data.zone,
        price: ticketPrice,
        quantity: data.quantity,
      },
    });

    logger.info({ ticketId: ticket.id }, 'Ticket purchased successfully');
    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error(error, 'Failed to purchase ticket');
    throw new InternalServerError('Failed to purchase ticket');
  }
}