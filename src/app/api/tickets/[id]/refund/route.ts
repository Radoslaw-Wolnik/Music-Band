// src/app/api/tickets/[id]/refund/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, NotFoundError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { TicketStatus } from '@/types';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError('You must be logged in to refund tickets');
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(params.id) },
      include: { event: true },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    if (ticket.userId !== parseInt(session.user.id)) {
      throw new UnauthorizedError('You can only refund your own tickets');
    }

    if (ticket.status !== TicketStatus.ACTIVE) {
      throw new BadRequestError('This ticket has already been refunded or used');
    }

    // You might want to add a check here to ensure the event hasn't started yet

    const refundedTicket = await prisma.ticket.update({
      where: { id: parseInt(params.id) },
      data: { status: TicketStatus.REFUNDED },
    });

    logger.info('Ticket refunded', { ticketId: refundedTicket.id, userId: session.user.id });
    return NextResponse.json({ message: 'Ticket refunded successfully' });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof NotFoundError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error refunding ticket', { error, ticketId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}