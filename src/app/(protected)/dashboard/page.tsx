// File: src/app/(protected)/dashboard/page.tsx

import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ManagerDashboard from '@/components/ManagerDashboard';
import BandMemberDashboard from '@/components/BandMemberDashboard';
import PatronDashboard from '@/components/PatronDashboard';
import FanDashboard from '@/components/FanDashboard';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const renderDashboard = () => {
    switch (session.user.role) {
      case 'MANAGER':
        return <ManagerDashboard />;
      case 'BAND_MEMBER':
        return <BandMemberDashboard />;
      case 'PATRON':
        return <PatronDashboard />;
      default:
        return <FanDashboard />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {renderDashboard()}
    </div>
  );
}