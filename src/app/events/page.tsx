// src/app/events/page.tsx

import React from 'react';
import Layout from '@/components/Layout';
import EventList from '@/components/EventList';
import { getEvents } from '@/lib/api';

export default async function Events() {
  const events = await getEvents();

  return (
    <Layout title="Events | Music Band">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <EventList events={events} />
    </Layout>
  );
}