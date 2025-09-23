'use client';

import Layout from '@/components/Layout';
import DashboardOverview from '@/components/DashboardOverview';
import DatabaseTest from '@/components/DatabaseTest';
import PasswordTest from '@/components/PasswordTest';

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        <DatabaseTest />
        <DashboardOverview />
      </div>
    </Layout>
  );
}
