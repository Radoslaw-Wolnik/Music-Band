// src/app/api/tickets/group-purchase/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError('You must be logged in to purchase tickets');
    }

    const { eventId, seat, quantity } = await req.json();

    if (!eventId || !seat || !quantity) {
      throw new BadRequestError('Missing required fields');
    }

    if (quantity > 20) {
      throw new BadRequestError('Maximum 20 tickets per purchase');
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new BadRequestError('Event not found');
    }

    const ticketPrice = event.ticketPrices[seat];

    if (!ticketPrice) {
      throw new BadRequestError('Invalid seat/zone');
    }

    const tickets = await prisma.ticket.createMany({
      data: Array(quantity).fill({
        eventId,
        userId: parseInt(session.user.id),
        seat,
        price: ticketPrice,
      }),
    });

    logger.info('Group tickets purchased', { eventId, userId: session.user.id, quantity });
    return NextResponse.json({ message: `${quantity} ticket(s) purchased successfully` }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error purchasing group tickets', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}