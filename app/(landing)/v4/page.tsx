import type { Metadata } from 'next';
import SiteHeader from '@/components/landing/SiteHeader';
import Hero from '@/components/landing/Hero';
import LogoMarquee from '@/components/landing/LogoMarquee';
import JoinNetwork from '@/components/landing/JoinNetwork';
import UpcomingEvents from '@/components/landing/UpcomingEvents';
import GlobalScale from '@/components/landing/GlobalScale';
import Distribution from '@/components/landing/Distribution';
import EventGallery from '@/components/landing/EventGallery';
import AgentBand from '@/components/landing/AgentBand';
import FinalCta from '@/components/landing/FinalCta';
import SiteFooter from '@/components/landing/SiteFooter';

// The neo-brutalist landing that shipped as the homepage 2026-08-07, archived
// here when the Bright design took over `/`. Kept out of search results.
export const metadata: Metadata = {
  title: '2% Tech — v4 landing (archived)',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="page">
      <a className="skip-link" href="#top">
        Skip to content
      </a>

      <SiteHeader />

      <main id="top">
        <Hero />
        <LogoMarquee />
        <JoinNetwork />
        <UpcomingEvents />
        <GlobalScale />
        <Distribution />
        <EventGallery />
        <AgentBand />
        <FinalCta />
      </main>

      <SiteFooter />
    </div>
  );
}
