// src/app/admin/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import { getAnalytics, getEvents, createEvent } from '@/lib/api';
import { Analytics, Event } from '@/types';

export default function ManagerDashboard() {
  const { data: session } = useSession();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsData = await getAnalytics();
        setAnalytics(analyticsData);

        const eventsData = await getEvents();
        setEvents(eventsData);
      } catch (error) {
        setError('Failed to load dashboard data');
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const form = e.target as HTMLFormElement;
    const eventData = {
      name: form.name.value,
      description: form.description.value,
      date: form.date.value,
      endDate: form.endDate.value,
      venueId: parseInt(form.venueId.value),
      ticketPrices: JSON.parse(form.ticketPrices.value),
      defaultPhoto: form.defaultPhoto.value,
      isPatronOnly: form.isPatronOnly.checked,
    };

    try {
      const newEvent = await createEvent(eventData);
      setEvents([...events, newEvent]);
      form.reset();
      setSuccess('Event created successfully');
    } catch (error) {
      setError('Failed to create event');
    }
  };

  return (
    <Layout title="Manager Dashboard | Music Band">
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>
      {error && <p className="text-error-500 mb-4">{error}</p>}
      {success && <p className="text-success-500 mb-4">{success}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          {analytics ? (
            <div className="bg-white shadow rounded-lg p-4 space-y-4">
              <div>
                <h3 className="font-semibold">Ticket Sales</h3>
                <p>Total Revenue: ${analytics.ticketSales.totalRevenue}</p>
                <p>Total Sold: {analytics.ticketSales.totalSold}</p>
              </div>
              <div>
                <h3 className="font-semibold">Merchandise Sales</h3>
                <p>Total Revenue: ${analytics.merchSales.totalRevenue}</p>
                <p>Total Sold: {analytics.merchSales.totalSold}</p>
              </div>
              <div>
                <h3 className="font-semibold">Subscriber Growth</h3>
                {Object.entries(analytics.subscriberGrowth).map(([tier, count]) => (
                  <p key={tier}>{tier}: {count}</p>
                ))}
              </div>
            </div>
          ) : (
            <p>Loading analytics...</p>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Create Event</h2>
          <form onSubmit={handleEventSubmit} className="space-y-4">
          <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200"
              ></textarea>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Start Date and Time</label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date and Time</label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200"
              />
            </div>
            <div>
              <label htmlFor="venueId" className="block text-sm font-medium text-gray-700">Venue ID</label>
              <input
                type="number"
                id="venueId"
                name="venueId"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200"
              />
            </div>
            <div>
              <label htmlFor="ticketPrices" className="block text-sm font-medium text-gray-700">Ticket Prices (JSON)</label>
              <textarea
                id="ticketPrices"
                name="ticketPrices"
                required
                rows={3}
                placeholder='{"VIP": 100, "General": 50}'
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200"
              ></textarea>
            </div>
            <div>
              <label htmlFor="defaultPhoto" className="block text-sm font-medium text-gray-700">Default Photo URL</label>
              <input
                type="text"
                id="defaultPhoto"
                name="defaultPhoto"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPatronOnly"
                name="isPatronOnly"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isPatronOnly" className="ml-2 block text-sm text-gray-900">
                Patron-only Event
              </label>
            </div>
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
            >
              Create Event
            </button>
          </form>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        {events.length > 0 ? (
          <ul className="space-y-4">
            {events.map((event) => (
              <li key={event.id} className="bg-white shadow rounded-lg p-4">
                <h3 className="font-semibold text-lg">{event.name}</h3>
                <p>{new Date(event.date).toLocaleString()} - {new Date(event.endDate).toLocaleString()}</p>
                <p>{event.description}</p>
                <p>Venue ID: {event.venueId}</p>
                <p>Patron-only: {event.isPatronOnly ? 'Yes' : 'No'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming events.</p>
        )}
      </div>
    </Layout>
  );
}