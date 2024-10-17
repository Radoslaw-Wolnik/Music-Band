// src/app/api/events/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole } from '@/types';
import { eventSchema } from '@/lib/validationSchemas';
import { getPaginationData, getPaginationParams } from '@/lib/pagination';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.MANAGER) {
      throw new UnauthorizedError('Only managers can create events');
    }

    const body = await req.json();
    const validatedData = eventSchema.parse(body);

    const { name, description, date, endDate, venueId, ticketPrices, eventPlan, defaultPhoto, isPatronOnly } = validatedData;

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
          create: eventPlan?.map((item: { time: string; name: string }) => ({
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

export async function GET(req: NextRequest) {
  try {
    const { page, limit } = getPaginationParams(req);
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search');
    const venueId = searchParams.get('venueId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (venueId) {
      where.venueId = parseInt(venueId, 10);
    }

    if (startDate) {
      where.date = { ...where.date, gte: new Date(startDate) };
    }

    if (endDate) {
      where.date = { ...where.date, lte: new Date(endDate) };
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: { venue: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'asc' },
      }),
      prisma.event.count({ where }),
    ]);

    const paginationData = getPaginationData(total, page, limit);

    return NextResponse.json({
      events,
      pagination: paginationData,
    });
  } catch (error) {
    logger.error('Error fetching events', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
