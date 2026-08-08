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
