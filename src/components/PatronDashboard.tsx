// File: src/components/PatronDashboard.tsx

import React from 'react';
import Link from 'next/link';

const PatronDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Patron Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/exclusive-content" className="btn-primary text-center">
          View Exclusive Content
        </Link>
        <Link href="/dashboard/fan-meetings" className="btn-primary text-center">
          Fan Meetings
        </Link>
      </div>
    </div>
  );
};

export default PatronDashboard;