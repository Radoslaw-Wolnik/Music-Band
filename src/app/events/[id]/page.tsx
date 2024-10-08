// src/app/events/[id]/page.tsx

import React from 'react';
import { notFound } from 'next/navigation';
import Layout from '@/components/Layout';
import TicketPurchaseForm from '@/components/TicketPurchaseForm';
import { getEvent } from '@/lib/api';

interface EventPageProps {
  params: { id: string };
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEvent(parseInt(params.id));

  if (!event) {
    notFound();
  }

  return (
    <Layout title={`${event.name} | Music Band`}>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {event.defaultPhoto && (
          <img src={event.defaultPhoto} alt={event.name} className="w-full h-64 object-cover" />
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
          <p className="text-gray-600 mb-4">{event.description}</p>
          <p className="text-sm text-gray-500 mb-2">
            {new Date(event.date).toLocaleString()} at {event.venue.name}
          </p>
          <p className="text-sm text-gray-500 mb-4">{event.venue.address}</p>
          <h2 className="text-xl font-semibold mb-2">Event Plan</h2>
          <ul className="list-disc list-inside mb-4">
            {event.eventPlan.map((item, index) => (
              <li key={index}>
                {new Date(item.time).toLocaleTimeString()}: {item.name}
              </li>
            ))}
          </ul>
          <TicketPurchaseForm event={event} />
        </div>
      </div>
    </Layout>
  );
}