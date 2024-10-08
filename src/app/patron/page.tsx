// src/app/patron/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import { getPatronProfile, getExclusiveContent, getFanMeetings } from '@/lib/api';
import { Patron, BlogPost, FanMeeting } from '@/types';

export default function PatronDashboard() {
  const { data: session } = useSession();
  const [patron, setPatron] = useState<Patron | null>(null);
  const [exclusiveContent, setExclusiveContent] = useState<BlogPost[]>([]);
  const [fanMeetings, setFanMeetings] = useState<FanMeeting[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patronData = await getPatronProfile();
        setPatron(patronData);

        const contentData = await getExclusiveContent();
        setExclusiveContent(contentData);

        const meetingsData = await getFanMeetings();
        setFanMeetings(meetingsData);
      } catch (error) {
        setError('Failed to load patron data');
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  if (!patron) {
    return <Layout title="Patron Dashboard | Music Band">Loading...</Layout>;
  }

  return (
    <Layout title="Patron Dashboard | Music Band">
      <h1 className="text-3xl font-bold mb-6">Patron Dashboard</h1>
      {error && <p className="text-error-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Patron Status</h2>
          <div className="bg-white shadow rounded-lg p-4">
            <p>Subscription Tier: {patron.subscription.tier}</p>
            <p>Subscription End Date: {new Date(patron.subscription.endDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Exclusive Content</h2>
          {exclusiveContent.length > 0 ? (
            <ul className="space-y-4">
              {exclusiveContent.map((post) => (
                <li key={post.id} className="bg-white shadow rounded-lg p-4">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-gray-600">{post.content.slice(0, 100)}...</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Posted on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No exclusive content available at the moment.</p>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Fan Meetings</h2>
        {fanMeetings.length > 0 ? (
          <ul className="space-y-4">
            {fanMeetings.map((meeting) => (
              <li key={meeting.id} className="bg-white shadow rounded-lg p-4">
                <h3 className="font-semibold text-lg">Fan Meeting</h3>
                <p>Date: {new Date(meeting.date).toLocaleString()}</p>
                <p>Description: {meeting.description}</p>
                <p>Max Attendees: {meeting.maxAttendees}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming fan meetings scheduled.</p>
        )}
      </div>
    </Layout>
  );
}