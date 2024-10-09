// File: src/components/ManagerDashboard.tsx

import React from 'react';
import Link from 'next/link';

const ManagerDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manager Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/events/create" className="btn-primary text-center">
          Create Event
        </Link>
        <Link href="/dashboard/venues/create" className="btn-primary text-center">
          Create Venue
        </Link>
        <Link href="/dashboard/merch/create" className="btn-primary text-center">
          Add Merchandise
        </Link>
        <Link href="/dashboard/content/create" className="btn-primary text-center">
          Create Content
        </Link>
      </div>
    </div>
  );
};

export default ManagerDashboard;