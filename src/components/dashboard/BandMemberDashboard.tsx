// File: src/components/BandMemberDashboard.tsx

import React from 'react';
import Link from 'next/link';

const BandMemberDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Band Member Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/profile" className="btn-primary text-center">
          Edit Profile
        </Link>
        <Link href="/dashboard/practices" className="btn-primary text-center">
          Schedule Practice
        </Link>
        <Link href="/dashboard/content/create" className="btn-primary text-center">
          Create Content
        </Link>
      </div>
    </div>
  );
};

export default BandMemberDashboard;