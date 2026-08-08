import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Anton, Space_Grotesk, Space_Mono } from 'next/font/google';
import SiteChromeProvider from '@/components/SiteChrome';
import './globals.css';

/* next/font downloads and self-hosts these at build time, so the exported site
   makes no request to Google at runtime and there is no flash of fallback type
   on a face as distinctive as Anton. */

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://2percenttech.com'),
  title: '2% Tech — Host an Event in Silicon Valley',
  description:
    'The operating platform for the AI ecosystem — where AI companies, builders, investors, experts, and communities connect through high-impact events in Silicon Valley, distributed globally.',
  openGraph: {
    type: 'website',
    title: '2% Tech — Host an Event in Silicon Valley',
    description:
      'Where AI companies, builders, investors, experts, and communities connect through high-impact events.',
    images: ['/photos/02.webp'],
  },
  icons: { icon: '/mark.svg' },
};

export const viewport: Viewport = {
  themeColor: '#fffdf4',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const fonts = [anton, spaceGrotesk, spaceMono].map((f) => f.variable).join(' ');
  return (
    <html lang="en" className={fonts}>
      <body>
        <SiteChromeProvider>{children}</SiteChromeProvider>
      </body>
    </html>
  );
}
