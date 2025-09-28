'use client';

import Layout from '@/components/Layout';
import DashboardOverview from '@/components/DashboardOverview';
import DatabaseTest from '@/components/DatabaseTest';

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="mb-6">
          <DatabaseTest />
        </div>
        <DashboardOverview />
      </div>
    </Layout>
  );
}
