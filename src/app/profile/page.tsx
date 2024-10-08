// src/app/profile/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import { getUserProfile, updateUserProfile } from '@/lib/api';
import { User } from '@/types';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
        setName(userData.name || '');
        setProfilePicture(userData.profilePicture || '');
      } catch (error) {
        setError('Failed to load profile');
      }
    };

    if (session) {
      fetchProfile();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const updatedUser = await updateUserProfile({ name, profilePicture });
      setUser(updatedUser);
      setSuccess('Profile updated successfully');
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  if (!user) {
    return <Layout title="Profile | Music Band">Loading...</Layout>;
  }

  return (
    <Layout title="Profile | Music Band">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      {error && <p className="text-error-500 mb-4">{error}</p>}
      {success && <p className="text-success-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200"
          />
        </div>
        <div>
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
          <input
            type="text"
            id="profilePicture"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200"
          />
        </div>
        <button
          type="submit"
          className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
        >
          Update Profile
        </button>
      </form>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Tickets</h2>
        {user.tickets && user.tickets.length > 0 ? (
          <ul className="space-y-2">
            {user.tickets.map((ticket) => (
              <li key={ticket.id} className="bg-white shadow rounded-lg p-4">
                <p className="font-semibold">{ticket.event.name}</p>
                <p>{new Date(ticket.event.date).toLocaleString()}</p>
                <p>Seat: {ticket.seat}</p>
                <p>Price: ${ticket.price}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't purchased any tickets yet.</p>
        )}
      </div>
    </Layout>
  );
}