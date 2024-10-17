// src/app/api/tickets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole, TicketStatus, Event, TicketPrices } from '@/types';
import { makePurchase, PurchaseItem } from '@/lib/purchaseUtils';
import { getPaginationParams, getPaginationData } from '@/lib/pagination';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError('You must be logged in to purchase tickets');
    }

    const { eventId, seat, quantity } = await req.json();

    if (!eventId || !seat || !quantity) {
      throw new BadRequestError('Missing required fields');
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    }) as Event | null;

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    const ticketPrices = event.ticketPrices as TicketPrices;
    const ticketPrice = ticketPrices[seat];

    if (ticketPrice === undefined) {
      throw new BadRequestError('Invalid seat/zone');
    }

    const purchaseItem: PurchaseItem = {
      id: event.id,
      price: ticketPrice,
      type: 'ticket',
    };

    const result = await makePurchase(parseInt(session.user.id), purchaseItem, quantity);

    logger.info('Tickets purchased', { eventId, userId: session.user.id, quantity });
    return NextResponse.json({ message: `${quantity} ticket(s) purchased successfully`, purchaseId: result.purchaseId }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error purchasing tickets', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError('You must be logged in to view tickets');
    }

    const { page, limit } = getPaginationParams(req);

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where: { userId: parseInt(session.user.id) },
        include: { event: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { purchasedAt: 'desc' },
      }),
      prisma.ticket.count({ where: { userId: parseInt(session.user.id) } }),
    ]);

    const paginationData = getPaginationData(total, page, limit);

    return NextResponse.json({ tickets, pagination: paginationData });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error fetching tickets', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}