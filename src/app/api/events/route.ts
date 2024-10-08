// src/app/api/events/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { Event, UserRole } from '@/types';

export async function GET(req: Request) {
  try {
    const events = await prisma.event.findMany({
      include: { venue: true, eventPlan: true },
    });
    return NextResponse.json(events);
  } catch (error) {
    logger.error('Error fetching events', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.MANAGER) {
      throw new UnauthorizedError('Only managers can create events');
    }

    const data = await req.json();
    const { name, description, date, endDate, venueId, ticketPrices, eventPlan, defaultPhoto, isPatronOnly } = data;

    if (!name || !description || !date || !endDate || !venueId || !ticketPrices) {
      throw new BadRequestError('Missing required fields');
    }

    const event = await prisma.event.create({
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
          create: eventPlan.map((item: { time: string; name: string }) => ({
            time: new Date(item.time),
            name: item.name,
          })),
        },
      },
      include: { eventPlan: true },
    });

    logger.info('Event created', { eventId: event.id, managerId: session.user.id });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error creating event', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}