// src/app/api/events/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, NotFoundError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole } from '@/types';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(params.id) },
      include: { venue: true, eventPlan: true, tickets: true },
    });

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    return NextResponse.json(event);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error fetching event', { error, eventId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.MANAGER) {
      throw new UnauthorizedError('Only managers can update events');
    }

    const data = await req.json();
    const { name, description, date, endDate, venueId, ticketPrices, eventPlan, defaultPhoto, isPatronOnly } = data;

    const event = await prisma.event.update({
      where: { id: parseInt(params.id) },
      data: {
        name,
        description,
        date: new Date(date),
        endDate: new Date(endDate),
        venueId,
        ticketPrices,
        defaultPhoto,
        isPatronOnly,
        eventPlan: {
          deleteMany: {},
          create: eventPlan.map((item: { time: string; name: string }) => ({
            time: new Date(item.time),
            name: item.name,
          })),
        },
      },
      include: { eventPlan: true },
    });

    logger.info('Event updated', { eventId: event.id, managerId: session.user.id });
    return NextResponse.json(event);
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error updating event', { error, eventId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.MANAGER) {
      throw new UnauthorizedError('Only managers can delete events');
    }

    const event = await prisma.event.delete({
      where: { id: parseInt(params.id) },
    });

    logger.info('Event deleted', { eventId: event.id, managerId: session.user.id });
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error deleting event', { error, eventId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}