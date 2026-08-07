/* Content for the v4 landing page, ported from the Claude Design project
   "2pct Landing v4.dc.html".

   Kept out of the component for the same reason lib/data.ts and
   lib/blueprint.ts are: the page is long, and a copy change should not mean
   reading JSX. Structure and wording follow the prototype; where the
   prototype hardcoded something the repo already knows — the Frontier Signals
   Luma link, the company roster — this file defers to lib/data.ts instead so
   there is one source for it.

   This page is English-only, unlike the rest of the site. See the note in
   README under "Bilingual". */

import { LUMA_PROFILE, UPCOMING } from './data';

/* ---- the five event formats (hero picker) ------------------------------ */

export type Format = {
  id: string;
  /* Typographic glyph rather than an icon font — one character, no asset. */
  glyph: string;
  name: string;
  blurb: string;
  cta: string;
};

export const FORMATS: Format[] = [
  {
    id: 'hackathon',
    glyph: '⌁',
    name: 'Hackathon',
    blurb: 'Recruit builders, validate use cases, and create product momentum.',
    cta: 'START A HACKATHON',
  },
  {
    id: 'workshop',
    glyph: '↗',
    name: 'Workshop',
    blurb: 'Showcase your product, educate users, and accelerate adoption.',
    cta: 'START A WORKSHOP',
  },
  {
    id: 'panel',
    glyph: '◌',
    name: 'Panel',
    blurb: 'Build category authority and reach a high-signal audience.',
    cta: 'START A PANEL',
  },
  {
    id: 'keynote',
    glyph: '✦',
    name: 'Keynote / Launch',
    blurb: 'Launch your product, sharpen the narrative, and attract attention.',
    cta: 'START A LAUNCH',
  },
  {
    id: 'demoday',
    glyph: '△',
    name: 'Demo Day',
    blurb: 'Meet customers, investors, partners, and the wider ecosystem.',
    cta: 'START A DEMO DAY',
  },
];

/* ---- the marquee ------------------------------------------------------- */

/** Company ids, in the prototype's order. Art resolves through LOGOS in
    lib/data.ts, whose `mq` entry is the flat white marquee variant. */
export const MARQUEE_IDS = [
  'openai', 'aws', 'gmi', 'snyk', 'nebius', 'mistral',
  'google', 'nvidia', 'microsoft', 'meta', 'coinbase', 'circle',
];

/* ---- join the network -------------------------------------------------- */

export type JoinCard = { n: string; title: string; blurb: string; cta: string; feature?: boolean };

export const JOIN_CARDS: JoinCard[] = [
  { n: '01', title: 'Apply to Speak', blurb: 'Share a strong technical, product or market perspective.', cta: 'APPLY NOW' },
  { n: '02', title: 'Apply as a Judge', blurb: 'Support hackathons, demos and technical reviews.', cta: 'APPLY NOW' },
  { n: '03', title: 'Join as an Investor', blurb: 'Discover founders, builders and emerging categories early.', cta: 'JOIN NOW' },
  { n: '04', title: 'Become a Sponsor', blurb: 'Back high-signal programs and gain targeted visibility.', cta: 'SPONSOR A PROGRAM' },
  { n: '05', title: 'Technology Partner', blurb: 'Contribute models, APIs, credits, tools or technical support.', cta: 'PARTNER WITH US' },
  { n: '06', title: 'Community Partner', blurb: 'Co-host online or local satellite events and expand global reach.', cta: 'APPLY AS PARTNER', feature: true },
];

/* ---- upcoming events ---------------------------------------------------
   The first is a real, dated, open event; its Luma link is resolved out of
   UPCOMING rather than restated, so the calendar and this page cannot drift.
   The other four are explicitly labelled COMING SOON — they are the shapes we
   are actively looking for partners on, not scheduled events. Do not remove
   that label until one has a date and a registration page. */

export type UpcomingCard = {
  badge: string;
  /** Yellow fill on the date chip — only for something you can register for. */
  live?: boolean;
  kicker: string;
  title: string;
  blurb: string;
  tags: { label: string; hot?: boolean }[];
  url?: string;
  partnerCta?: string;
};

const frontierSignals = UPCOMING.find((e) => e.name.startsWith('Frontier Signals'));

export const UPCOMING_CARDS: UpcomingCard[] = [
  {
    badge: 'AUG 10 · SAN FRANCISCO',
    live: true,
    kicker: 'AWS BUILDER LOFT',
    title: 'Frontier Signals #01 — Infrastructure Behind Physical AI',
    blurb:
      'A flagship event featuring leading voices across physical AI, infrastructure, deployment and market adoption.',
    tags: [
      { label: 'OpenAI' },
      { label: 'Physical AI' },
      { label: 'Registration Open', hot: true },
      { label: 'Community Partners Welcome' },
      { label: 'Livestream Distribution' },
    ],
    url: frontierSignals?.url ?? LUMA_PROFILE,
    partnerCta: 'Partner with this Event',
  },
  {
    badge: 'COMING SOON',
    kicker: 'DEVELOPER WORKSHOP',
    title: 'Secure AI Builders — From Prompt to Production',
    blurb:
      'A hands-on workshop for developer platforms, product teams and AI builders focused on secure deployment.',
    tags: [{ label: 'Snyk' }, { label: 'Developer Platforms' }, { label: 'Speaker Applications', hot: true }],
  },
  {
    badge: 'COMING SOON',
    kicker: 'MODEL BUILDERS SESSION',
    title: 'World Models and Multimodal Systems',
    blurb:
      'An expert session around world models, multimodal AI, spatial reasoning and next-generation interfaces.',
    tags: [{ label: 'Mistral' }, { label: 'World Models' }, { label: 'Technology Partners Welcome', hot: true }],
  },
  {
    badge: 'COMING SOON',
    kicker: 'HYBRID HACKATHON',
    title: 'Global AI Hackathon — Silicon Valley + Local Chapters',
    blurb:
      'An online-offline hybrid format designed to scale beyond a single venue and bring global builder communities into one program.',
    tags: [{ label: 'Hybrid' }, { label: 'Local Hosts Needed', hot: true }, { label: 'Judges & Mentors' }],
  },
  {
    badge: 'COMING SOON',
    kicker: 'FOUNDER EVENT',
    title: 'AI Go-to-Market in Silicon Valley',
    blurb:
      'A founder-focused event on positioning, distribution, partnerships and scaling market access for AI startups.',
    tags: [{ label: 'Founders' }, { label: 'Investors' }, { label: 'Partner Applications', hot: true }],
  },
];

export const ASIDE_ACTIONS = [
  'Join as a Speaker',
  'Join as an Investor',
  'Join as a Judge',
  'Partner with an Event',
];

export const ASIDE_KEYWORDS =
  'OpenAI, Mistral, Physical AI, World Models, Developer Platforms, Global Builder Communities.';

/* ---- global scale ------------------------------------------------------ */

export const GLOBAL_COPY =
  '2% Tech is not just an event listing site. It is a scalable distribution system: Silicon Valley execution, livestreaming, content repackaging, satellite communities, and online-offline hackathon formats that expand reach far beyond a 100–200 person venue.';

/** Positioned round the orbit diagram. `accent` is the one highlighted node. */
export const REGIONS: { label: string; top?: string; left?: string; right?: string; bottom?: string; accent?: boolean }[] = [
  { label: 'North America', top: '4%', left: '16%' },
  { label: 'Europe', top: '16%', right: '2%' },
  { label: 'India', bottom: '26%', right: '0' },
  { label: 'Southeast Asia', bottom: '6%', left: '34%' },
  { label: 'Latin America', bottom: '22%', left: '2%' },
  { label: 'University & Local Communities', top: '34%', left: '0', accent: true },
];

/* ---- distribution ------------------------------------------------------ */

export const DISTRIBUTION_COPY =
  '2% Tech does more than host events. It captures live sessions, clips them, distributes them, and turns each event into searchable content that keeps delivering reach.';

export const TAKEAWAYS = [
  'Reliable distribution matters as much as the physical room.',
  'Livestreaming and clips help sponsors get more than on-site exposure.',
  'Hybrid hackathons are a major lever for global scale.',
  'Strong brand names and relevant speakers increase conversion.',
];

/* ---- footer ------------------------------------------------------------ */

export const FOOTER_BLURB =
  'The operating platform for the AI ecosystem — connecting companies, builders, investors, experts, and communities through events, content, and opportunities.';

export const FOOTER_COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: 'EXPLORE',
    links: [
      { label: 'Host an Event', href: '#host' },
      { label: 'Upcoming Events', href: '#upcoming' },
      { label: 'Livestream & Content', href: '#distribution' },
    ],
  },
  {
    heading: 'JOIN',
    links: [
      { label: 'Speaker / Judge', href: '#network' },
      { label: 'Investor / Sponsor', href: '#network' },
      { label: 'Community Partner', href: '#global' },
    ],
  },
];

export const NAV_LINKS = [
  { label: 'Host an Event', href: '#host' },
  { label: 'Join the Network', href: '#network' },
  { label: 'Upcoming Events', href: '#upcoming' },
  { label: 'Distribution', href: '#distribution' },
  { label: 'Global Scale', href: '#global' },
];

/* ---- the agent --------------------------------------------------------- */

export const AGENT_OPENERS = [
  'Hi — tell me what you want to accomplish. I can help you start an event, apply to join, or identify the best partnership path.',
  'For example: "We are launching an AI platform, want a Silicon Valley workshop, and also need livestream distribution plus community partner support."',
];

export const AGENT_REPLY =
  'Thanks — I would organize this into objective, audience, timing, distribution needs, and partner requirements. Next I can help you choose the right format and prepare it for human review.';
