// src/components/Calendar.tsx

import React from 'react';
import { Event } from '@/types';

interface CalendarProps {
  events: Event[];
  month: number;
  year: number;
}

const Calendar: React.FC<CalendarProps> = ({ events, month, year }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">
        {new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h2>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {paddingDays.map((_, index) => (
          <div key={`padding-${index}`} className="h-24"></div>
        ))}
        {days.map((day) => (
          <div key={day} className="h-24 border border-gray-200 p-1">
            <div className="font-semibold">{day}</div>
            {getEventsForDay(day).map((event) => (
              <div key={event.id} className="text-xs bg-primary-100 rounded p-1 mt-1">
                {event.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;