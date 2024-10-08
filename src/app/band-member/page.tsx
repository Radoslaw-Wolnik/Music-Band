// src/app/band-member/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import { getBandMemberProfile, updateBandMemberProfile, getPractices, createPractice } from '@/lib/api';
import { BandMember, Practice } from '@/types';

export default function BandMemberDashboard() {
  const { data: session } = useSession();
  const [bandMember, setBandMember] = useState<BandMember | null>(null);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [instrument, setInstrument] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberData = await getBandMemberProfile();
        setBandMember(memberData);
        setInstrument(memberData.instrument || '');
        setBio(memberData.bio || '');

        const practiceData = await getPractices();
        setPractices(practiceData);
      } catch (error) {
        setError('Failed to load band member data');
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const updatedMember = await updateBandMemberProfile({ instrument, bio });
      setBandMember(updatedMember);
      setSuccess('Profile updated successfully');
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const handlePracticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const form = e.target as HTMLFormElement;
    const date = form.date.value;
    const duration = parseInt(form.duration.value);
    const notes = form.notes.value;

    try {
      const newPractice = await createPractice({ date, duration, notes });
      setPractices([...practices, newPractice]);
      form.reset();
      setSuccess('Practice scheduled successfully');
    } catch (error) {
      setError('Failed to schedule practice');
    }
  };

  if (!bandMember) {
    return <Layout title="Band Member Dashboard | Music Band">Loading...</Layout>;
  }

  return (
    <Layout title="Band Member Dashboard | Music Band">
      <h1 className="text-3xl font-bold mb-6">Band Member Dashboard</h1>
      {error && <p className="text-error-500 mb-4">{error}</p>}
      {success && <p className="text-success-500 mb-4">{success}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label htmlFor="instrument" className="block text-sm font-medium text-gray-700">Instrument</label>
              <input
                type="text"
                id="instrument"
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
            >
              Update Profile
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Schedule Practice</h2>
          <form onSubmit={handlePracticeSubmit} className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date and Time</label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200"
              />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200"
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded"
            >
              Schedule Practice
            </button>
          </form>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Practices</h2>
        {practices.length > 0 ? (
          <ul className="space-y-2">
            {practices.map((practice) => (
              <li key={practice.id} className="bg-white shadow rounded-lg p-4">
                <p className="font-semibold">{new Date(practice.date).toLocaleString()}</p>
                <p>Duration: {practice.duration} minutes</p>
                {practice.notes && <p>Notes: {practice.notes}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming practices scheduled.</p>
        )}
      </div>
    </Layout>
  );
}