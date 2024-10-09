import React from 'react';
import { UserRole } from '@/types';
import Dashboard from './Dashboard';

const ManagerDashboard: React.FC = () => {
  const actions = [
    { label: 'Create Event', href: '/dashboard/events/create' },
    { label: 'Create Venue', href: '/dashboard/venues/create' },
    { label: 'Add Merchandise', href: '/dashboard/merch/create' },
    { label: 'Create Content', href: '/dashboard/content/create' },
  ];

  return <Dashboard role={UserRole.MANAGER} actions={actions} />;
};

export default ManagerDashboard;