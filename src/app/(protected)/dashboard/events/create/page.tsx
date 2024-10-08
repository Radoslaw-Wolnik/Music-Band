// File: src/app/(protected)/dashboard/events/create/page.tsx

import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import EventForm from '@/components/EventForm';

export default async function CreateEvent() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'MANAGER') {
    redirect('/dashboard');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>
      <EventForm />
    </div>
  );
}