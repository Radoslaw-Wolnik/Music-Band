// src/app/api/tickets/group-purchase/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole, Event, TicketPrices } from '@/types';
import { makePurchase, PurchaseItem } from '@/lib/purchaseUtils';
import { groupTicketPurchaseSchema } from '@/lib/validationSchemas';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError('You must be logged in to purchase tickets');
    }

    const body = await req.json();
    const validatedData = groupTicketPurchaseSchema.parse(body);

    const { eventId, purchases } = validatedData;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    }) as Event | null;

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    const ticketPrices = event.ticketPrices as TicketPrices;

    let totalQuantity = 0;
    let totalPrice = 0;

    for (const purchase of purchases) {
      const { seat, quantity } = purchase;
      const ticketPrice = ticketPrices[seat];

      if (ticketPrice === undefined) {
        throw new BadRequestError(`Invalid seat/zone: ${seat}`);
      }

      totalQuantity += quantity;
      totalPrice += ticketPrice * quantity;
    }

    if (totalQuantity > 20) {
      throw new BadRequestError('Maximum 20 tickets per group purchase');
    }

    const purchaseItem: PurchaseItem = {
      id: event.id,
      price: totalPrice,
      type: 'ticket',
    };

    const result = await makePurchase(parseInt(session.user.id), purchaseItem, totalQuantity);

    // Create individual tickets
    await prisma.ticket.createMany({
      data: purchases.flatMap(purchase => 
        Array(purchase.quantity).fill({
          eventId: event.id,
          userId: parseInt(session.user.id),
          seat: purchase.seat,
          price: ticketPrices[purchase.seat],
          purchasedAt: new Date(),
        })
      ),
    });

    logger.info('Group tickets purchased', { eventId, userId: session.user.id, totalQuantity });
    return NextResponse.json({ 
      message: `${totalQuantity} ticket(s) purchased successfully`, 
      purchaseId: result.purchaseId 
    }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error purchasing group tickets', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}