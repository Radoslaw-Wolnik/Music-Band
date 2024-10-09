import React from 'react';

interface CalendarProps {
  month: number;
  year: number;
  renderDay: (day: number, events: any[]) => React.ReactNode;
  getEventsForDay: (day: number) => any[];
}

const Calendar: React.FC<CalendarProps> = ({ month, year, renderDay, getEventsForDay }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

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
        {days.map((day) => renderDay(day, getEventsForDay(day)))}
      </div>
    </div>
  );
};

export default Calendar;