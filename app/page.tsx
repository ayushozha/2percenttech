import type { Metadata } from 'next';
import LandingV4 from '@/components/LandingV4';

/* The landing page, from the Claude Design project "2pct Landing v4.dc.html".

   The whole page is interactive — a format picker that drives the primary CTA,
   an intake modal reachable from fourteen places, and the agent panel — so it
   is one client component rather than a server shell with islands. There is no
   server-rendered content here it would save. */

export const metadata: Metadata = {
  title: '2% Tech — Host an Event in Silicon Valley',
  description:
    'The operating platform for the AI ecosystem. Hackathons, workshops, panels, launches and demo days in Silicon Valley, distributed globally through livestream and content.',
  openGraph: {
    title: '2% Tech — Host an Event in Silicon Valley',
    description:
      'Where AI companies, builders, investors, experts and communities connect through high-impact events.',
    type: 'website',
  },
};

export default function Landing() {
  return <LandingV4 />;
}
