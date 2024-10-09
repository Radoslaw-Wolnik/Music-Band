import React from 'react';
import { UserRole } from '@/types';
import Dashboard from './Dashboard';

const BandMemberDashboard: React.FC = () => {
  const actions = [
    { label: 'Edit Profile', href: '/dashboard/profile' },
    { label: 'Schedule Practice', href: '/dashboard/practices' },
    { label: 'Create Content', href: '/dashboard/content/create' },
  ];

  return <Dashboard role={UserRole.BAND_MEMBER} actions={actions} />;
};

export default BandMemberDashboard;