import React from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Card>
      {event.defaultPhoto && (
        <img src={event.defaultPhoto} alt={event.name} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
        <p className="text-gray-600 mb-4">{event.description.slice(0, 100)}...</p>
        <p className="text-sm text-gray-500 mb-2">
          {new Date(event.date).toLocaleDateString()} at {event.venue.name}
        </p>
        <Link href={`/events/${event.id}`} passHref>
          <Button as="a">View Details</Button>
        </Link>
      </div>
    </Card>
  );
};

export default EventCard;