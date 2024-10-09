import React from 'react';
import { Event } from '@/types';
import List from '@/components/common/List';
import EventCard from '@/components/events/EventCard';

interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <List
      items={events}
      renderItem={(event) => <EventCard event={event} />}
      keyExtractor={(event) => event.id}
      emptyMessage="No events found"
    />
  );
};

export default EventList;