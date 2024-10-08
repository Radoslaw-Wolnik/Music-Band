// File: src/components/EventCard.tsx

import React from 'react';
import Link from 'next/link';
import { Event } from '@prisma/client';

interface EventCardProps {
  event: Event & { venue: { name: string } };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <p className="text-sm text-gray-500 mb-2">
          {new Date(event.date).toLocaleDateString()} at {event.venue.name}
        </p>
        <Link href={`/events/${event.id}`} className="btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;