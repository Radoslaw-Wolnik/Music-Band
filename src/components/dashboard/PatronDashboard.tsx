import React from 'react';
import { UserRole } from '@/types';
import Dashboard from './Dashboard';

const PatronDashboard: React.FC = () => {
  const actions = [
    { label: 'View Exclusive Content', href: '/dashboard/exclusive-content' },
    { label: 'Fan Meetings', href: '/dashboard/fan-meetings' },
  ];

  return <Dashboard role={UserRole.PATRON} actions={actions} />;
};

export default PatronDashboard;