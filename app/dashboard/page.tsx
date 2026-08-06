import type { Metadata } from 'next';
import DashboardView from '@/components/Dashboard';

export const metadata: Metadata = {
  title: 'Backstage · 2%Tech',
  description: 'Events, judging queue, sponsor queries and hackathon submissions.',
  robots: { index: false, follow: false },
};

export default function Dashboard() {
  return <DashboardView />;
}
