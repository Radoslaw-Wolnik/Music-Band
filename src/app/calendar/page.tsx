// src/app/calendar/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Calendar from '@/components/Calendar';
import { getEvents } from '@/lib/api';
import { Event } from '@/types';

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData);
      } catch (error) {
        setError('Failed to load events');
      }
    };

    fetchEvents();
  }, []);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <Layout title="Event Calendar | Music Band">
      <h1 className="text-3xl font-bold mb-6">Event Calendar</h1>
      {error && <p className="text-error-500 mb-4">{error}</p>}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
        >
          Previous Month
        </button>
        <button
          onClick={handleNextMonth}
          className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
        >
          Next Month
        </button>
      </div>
      <Calendar events={events} month={month} year={year} />
    </Layout>
  );
}