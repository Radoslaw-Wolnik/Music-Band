// File: src/app/(public)/events/[id]/page.tsx

import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import TicketPurchaseForm from '@/components/TicketPurchaseForm';

interface EventPageProps {
  params: { id: string };
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await prisma.event.findUnique({
    where: { id: parseInt(params.id) },
    include: { venue: true },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{event.name}</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p className="text-gray-600 mb-4">{event.description}</p>
        <p className="text-sm text-gray-500 mb-2">
          {new Date(event.date).toLocaleDateString()} at {event.venue.name}
        </p>
        <p className="text-sm text-gray-500">{event.venue.address}</p>
      </div>
      <TicketPurchaseForm event={event} />
    </div>
  );
}