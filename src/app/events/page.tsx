// File: src/app/(public)/events/page.tsx

import React from 'react';
import EventCard from '@/components/EventCard';
import prisma from '@/lib/prisma';

export default async function Events() {
  const events = await prisma.event.findMany({
    include: { venue: true },
    orderBy: { date: 'asc' },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}