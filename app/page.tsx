import SiteHeader from '@/components/SiteHeader';
import Hero from '@/components/Hero';
import LogoMarquee from '@/components/LogoMarquee';
import JoinNetwork from '@/components/JoinNetwork';
import UpcomingEvents from '@/components/UpcomingEvents';
import GlobalScale from '@/components/GlobalScale';
import Distribution from '@/components/Distribution';
import EventGallery from '@/components/EventGallery';
import AgentBand from '@/components/AgentBand';
import FinalCta from '@/components/FinalCta';
import SiteFooter from '@/components/SiteFooter';

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
