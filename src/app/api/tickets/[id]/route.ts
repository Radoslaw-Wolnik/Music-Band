// src/app/api/tickets/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole, TicketStatus } from '@/types';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError('You must be logged in to view ticket details');
    }

    const ticketId = parseInt(params.id);

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        event: {
          include: {
            venue: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    // Check if the user is authorized to view this ticket
    if (ticket.userId !== parseInt(session.user.id) && session.user.role !== UserRole.MANAGER) {
      throw new UnauthorizedError('You are not authorized to view this ticket');
    }

    // Format the response
    const formattedTicket = {
      id: ticket.id,
      eventName: ticket.event.name,
      eventDate: ticket.event.date,
      eventEndDate: ticket.event.endDate,
      venue: {
        name: ticket.event.venue.name,
        address: ticket.event.venue.address,
      },
      seat: ticket.seat,
      price: ticket.price,
      purchasedAt: ticket.purchasedAt,
      status: ticket.status,
      user: ticket.user,
    };

    logger.info('Ticket details fetched', { ticketId, userId: session.user.id });
    return NextResponse.json(formattedTicket);
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error fetching ticket details', { error, ticketId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}