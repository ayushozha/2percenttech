import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Figtree, Instrument_Serif, IBM_Plex_Mono, Noto_Sans_SC, Noto_Serif_SC, Space_Grotesk } from 'next/font/google';
import LangProvider from '@/components/LangProvider';
import PlanningConciergeProvider from '@/components/PlanningConciergeProvider';
import BrightConcierge from '@/components/BrightConcierge';
import { ATTENDEE_NETWORK_DISPLAY, EVENT_COUNT_DISPLAY, MONTHLY_EVENT_PLAN_DISPLAY } from '@/lib/site-metrics';
import './globals.css';

/* The design specifies these five faces. next/font downloads and self-hosts
   them at build time, so the exported site makes no request to Google at
   runtime. The page is no longer request-free in general — it calls the 2% Tech
   API and loads the analytics tracker below — but fonts staying local keeps
   text rendering independent of any third party. */

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-figtree',
  display: 'swap',
});

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

// Only used by the homepage's bright theme scope (see .page-bright in
// globals.css) — every other route (/host, /sponsor, /dashboard, auth)
// stays on Figtree. Self-hosted like the others so the homepage doesn't add
// a runtime request to Google either.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

// The CJK faces replace the old site's ZCOOL. They ship as many unicode-range
// subsets, and English is the default language, so `preload: false` keeps them
// out of the critical path — the browser fetches only the ranges it actually
// paints, and only once the reader switches to 中文.
const notoSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sc',
  display: 'swap',
  preload: false,
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-noto-serif-sc',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://2percenttech.com'),
  title: '2%Tech · Bay Area AI Hackathons & Developer Community · 湾区 AI 黑客松',
  description:
    `2%Tech runs high-signal AI hackathons, workshops and demo days across the SF Bay Area. ${EVENT_COUNT_DISPLAY} events and a ${ATTENDEE_NETWORK_DISPLAY} attendee network since January 2025. 湾区高质量 AI 黑客松与开发者社区。`,
  openGraph: {
    title: '2%Tech · Bay Area AI Hackathons 湾区 AI 黑客松',
    description: `${EVENT_COUNT_DISPLAY} events · ${ATTENDEE_NETWORK_DISPLAY} attendee network · ${MONTHLY_EVENT_PLAN_DISPLAY} events planned monthly.`,
    type: 'website',
  },
  icons: { icon: '/mark.svg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const fonts = [figtree, instrument, plexMono, notoSC, notoSerifSC, spaceGrotesk].map((f) => f.variable).join(' ');
  return (
    <html lang="en" className={fonts}>
      <body>
        <LangProvider>
          <PlanningConciergeProvider>
            {children}
            <BrightConcierge />
          </PlanningConciergeProvider>
        </LangProvider>
        {/* Pageview tracking on the project's own Pulse instance. The ingest
            key is publishable by design — it can only write, and only for this
            project. `defer` keeps it off the critical path. */}
        <script
          defer
          src="https://analytics.2percenttech.com/api/script.js"
          data-api="https://analytics.2percenttech.com"
          data-key="pa_live__ozATLMeaGC_qJfNO2qR871-"
        />
      </body>
    </html>
  );
}
