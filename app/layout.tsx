import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Figtree, Instrument_Serif, IBM_Plex_Mono, Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google';
import LangProvider from '@/components/LangProvider';
import './globals.css';

/* The design specifies these five faces. next/font downloads and self-hosts
   them at build time, so the exported site makes no request to Google at
   runtime — which keeps the old site's "no external requests" property that
   the deploy host's CSP depends on. */

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
    '2%Tech runs high-signal AI hackathons, workshops and demo days across the SF Bay Area. 25 events, 6,300+ registrations since January 2025. 湾区高质量 AI 黑客松与开发者社区。',
  openGraph: {
    title: '2%Tech · Bay Area AI Hackathons 湾区 AI 黑客松',
    description: '25 events · 6,300+ registrations since Jan 2025. Next stop: Hackathon @ Stanford.',
    type: 'website',
  },
  icons: { icon: '/mark.svg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const fonts = [figtree, instrument, plexMono, notoSC, notoSerifSC].map((f) => f.variable).join(' ');
  return (
    <html lang="en" className={fonts}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
