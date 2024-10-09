// src/components/EventCard.tsx

import React from 'react';
import Link from 'next/link';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {event.defaultPhoto && (
        <img src={event.defaultPhoto} alt={event.name} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
        <p className="text-gray-600 mb-4">{event.description.slice(0, 100)}...</p>
        <p className="text-sm text-gray-500 mb-2">
          {new Date(event.date).toLocaleDateString()} at {event.venue.name}
        </p>
        <Link href={`/events/${event.id}`} className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded inline-block">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;