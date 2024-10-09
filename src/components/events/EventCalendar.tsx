import React from 'react';
import Calendar from '@/components/common/Calendar';
import { Event } from '@/types';

interface EventCalendarProps {
  events: Event[];
  month: number;
  year: number;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events, month, year }) => {
  const getEventsForDay = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
  };

  const renderDay = (day: number, dayEvents: Event[]) => (
    <div key={day} className="h-24 border border-gray-200 p-1">
      <div className="font-semibold">{day}</div>
      {dayEvents.map((event) => (
        <div key={event.id} className="text-xs bg-primary-100 rounded p-1 mt-1">
          {event.name}
        </div>
      ))}
    </div>
  );

  return (
    <Calendar
      month={month}
      year={year}
      renderDay={renderDay}
      getEventsForDay={getEventsForDay}
    />
  );
};

export default EventCalendar;