import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import LangShell from '@/components/LangShell';
import './globals.css';

export const metadata: Metadata = {
  title: '2% Tech — Bay Area AI Hackathons & Developer Community',
  description:
    '2% Tech runs high-signal AI hackathons, workshops and demo days across the SF Bay Area. 24 events, 5,700+ registrations since January 2025.',
  openGraph: {
    title: '2% Tech — Bay Area AI Hackathons',
    description: '24 events · 5,700+ registrations since Jan 2025. Next stop: Hackathon @ Stanford.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LangShell>{children}</LangShell>
      </body>
    </html>
  );
}
