import React from 'react';
import Link from 'next/link';
import { UserRole } from '@/types';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

interface DashboardAction {
  label: string;
  href: string;
}

interface DashboardProps {
  role: UserRole;
  actions: DashboardAction[];
}

const Dashboard: React.FC<DashboardProps> = ({ role, actions }) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{role} Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link key={index} href={action.href} passHref>
            <Button as="a" className="w-full text-center">{action.label}</Button>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default Dashboard;