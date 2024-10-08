// src/app/api/calendar/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import logger from '@/lib/logger';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!month || !year) {
      return NextResponse.json({ error: "Month and year are required" }, { status: 400 });
    }

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        venue: true,
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    logger.error('Error fetching calendar events', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}