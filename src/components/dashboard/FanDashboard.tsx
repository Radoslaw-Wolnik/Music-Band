// File: src/components/FanDashboard.tsx

import React from 'react';
import Link from 'next/link';

const FanDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Fan Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/events" className="btn-primary text-center">
          View Upcoming Events
        </Link>
        <Link href="/merch" className="btn-primary text-center">
          Shop Merchandise
        </Link>
      </div>
    </div>
  );
};

export default FanDashboard;