/* Content for the 2% Tech landing page.
   Everything the page renders that isn't structural lives here, so copy edits
   never require touching a component. */

export type Format = {
  name: string;
  glyph: string;
  desc: string;
  cta: string;
};

/* The order of this list is the order of the hero picker, and the index is what
   the intake record stores as `picks`. */
export const FORMATS: Format[] = [
  {
    name: 'Hackathon',
    glyph: '⌁',
    desc: 'Recruit builders, validate use cases, and create product momentum.',
    cta: 'Start a hackathon ↗',
  },
  {
    name: 'Workshop',
    glyph: '↗',
    desc: 'Showcase your product, educate users, and accelerate adoption.',
    cta: 'Start a workshop ↗',
  },
  {
    name: 'Panel',
    glyph: '◌',
    desc: 'Build category authority and reach a high-signal audience.',
    cta: 'Start a panel ↗',
  },
  {
    name: 'Keynote / Launch',
    glyph: '✦',
    desc: 'Launch your product, sharpen the narrative, and attract attention.',
    cta: 'Start a launch ↗',
  },
  {
    name: 'Demo Day',
    glyph: '△',
    desc: 'Meet customers, investors, partners, and the wider ecosystem.',
    cta: 'Start a demo day ↗',
  },
];

export const NAV_LINKS = [
  { href: '#host', label: 'Host an Event' },
  { href: '#network', label: 'Join the Network' },
  { href: '#upcoming', label: 'Upcoming Events' },
  { href: '#distribution', label: 'Distribution' },
  { href: '#global', label: 'Global Scale' },
];

/* Marquee logos are white-on-transparent artwork sized for the dark band.
   `height` is the rendered height; `width`/`intrinsicHeight` are the file's own
   dimensions and must stay accurate — the browser derives each image's aspect
   ratio from them, and a wrong ratio collapses the row. */
export type MarqueeLogo = {
  slug: string;
  name: string;
  height: number;
  width: number;
  intrinsicHeight: number;
};

export const MARQUEE_LOGOS: MarqueeLogo[] = [
  { slug: 'openai', name: 'OpenAI', height: 26, width: 460, intrinsicHeight: 116 },
  { slug: 'aws', name: 'AWS', height: 30, width: 343, intrinsicHeight: 200 },
  { slug: 'gmi', name: 'GMI Cloud', height: 24, width: 366, intrinsicHeight: 109 },
  { slug: 'snyk', name: 'Snyk', height: 26, width: 294, intrinsicHeight: 200 },
  { slug: 'nebius', name: 'Nebius', height: 24, width: 450, intrinsicHeight: 124 },
  { slug: 'mistral', name: 'Mistral', height: 26, width: 310, intrinsicHeight: 200 },
  { slug: 'google', name: 'Google', height: 26, width: 195, intrinsicHeight: 200 },
  { slug: 'nvidia', name: 'NVIDIA', height: 24, width: 257, intrinsicHeight: 200 },
  { slug: 'microsoft', name: 'Microsoft', height: 24, width: 460, intrinsicHeight: 106 },
  { slug: 'meta', name: 'Meta', height: 24, width: 392, intrinsicHeight: 86 },
  { slug: 'coinbase', name: 'Coinbase', height: 24, width: 205, intrinsicHeight: 200 },
  { slug: 'circle', name: 'Circle', height: 24, width: 460, intrinsicHeight: 193 },
];

export type JoinCard = {
  num: string;
  title: string;
  desc: string;
  cta: string;
  modal: string;
  accent?: boolean;
};

export const JOIN_CARDS: JoinCard[] = [
  {
    num: '01',
    title: 'Apply to Speak',
    desc: 'Share a strong technical, product or market perspective.',
    cta: 'Apply now ↗',
    modal: 'Apply as a Speaker',
  },
  {
    num: '02',
    title: 'Apply as a Judge',
    desc: 'Support hackathons, demos and technical reviews.',
    cta: 'Apply now ↗',
    modal: 'Apply as a Judge',
  },
  {
    num: '03',
    title: 'Join as an Investor',
    desc: 'Discover founders, builders and emerging categories early.',
    cta: 'Join now ↗',
    modal: 'Join as an Investor',
  },
  {
    num: '04',
    title: 'Become a Sponsor',
    desc: 'Back high-signal programs and gain targeted visibility.',
    cta: 'Sponsor a program ↗',
    modal: 'Become a Sponsor',
  },
  {
    num: '05',
    title: 'Technology Partner',
    desc: 'Contribute models, APIs, credits, tools or technical support.',
    cta: 'Partner with us ↗',
    modal: 'Become a Technology Partner',
  },
  {
    num: '06',
    title: 'Community Partner',
    desc: 'Co-host online or local satellite events and expand global reach.',
    cta: 'Apply as partner ↗',
    modal: 'Become a Community Partner',
    accent: true,
  },
];

export type EventTag = { label: string; accent?: boolean };

export type SiteEvent = {
  date: string;
  live?: boolean;
  kind: string;
  title: string;
  desc: string;
  tags: EventTag[];
  photo: { src: string; alt: string };
  link?: { href: string; label: string };
  partnerModal?: string;
};

export const EVENTS: SiteEvent[] = [
  {
    date: 'Aug 10 · San Francisco',
    live: true,
    kind: 'AWS Builder Loft',
    title: 'Frontier Signals #01 — Infrastructure Behind Physical AI',
    desc: 'A flagship event featuring leading voices across physical AI, infrastructure, deployment and market adoption.',
    tags: [
      { label: 'OpenAI' },
      { label: 'Physical AI' },
      { label: 'Registration Open', accent: true },
      { label: 'Community Partners Welcome' },
      { label: 'Livestream Distribution' },
    ],
    photo: { src: '/photos/01.webp', alt: 'Builders working at tables during a 2% Tech event at the AWS Builder Loft' },
    link: { href: 'https://luma.com/ckpqzfae', label: 'View Event ↗' },
    partnerModal: 'Partner with Frontier Signals #01',
  },
  {
    date: 'Coming soon',
    kind: 'Developer Workshop',
    title: 'Secure AI Builders — From Prompt to Production',
    desc: 'A hands-on workshop for developer platforms, product teams and AI builders focused on secure deployment.',
    tags: [
      { label: 'Snyk' },
      { label: 'Developer Platforms' },
      { label: 'Speaker Applications', accent: true },
    ],
    photo: { src: '/photos/07.webp', alt: 'Developers pair-programming on laptops during a hands-on 2% Tech workshop' },
  },
  {
    date: 'Coming soon',
    kind: 'Model Builders Session',
    title: 'World Models and Multimodal Systems',
    desc: 'An expert session around world models, multimodal AI, spatial reasoning and next-generation interfaces.',
    tags: [
      { label: 'Mistral' },
      { label: 'World Models' },
      { label: 'Technology Partners Welcome', accent: true },
    ],
    photo: { src: '/photos/03.webp', alt: 'Five panelists on stage during a 2% Tech expert session' },
  },
  {
    date: 'Coming soon',
    kind: 'Hybrid Hackathon',
    title: 'Global AI Hackathon — Silicon Valley + Local Chapters',
    desc: 'An online-offline hybrid format designed to scale beyond a single venue and bring global builder communities into one program.',
    tags: [
      { label: 'Hybrid' },
      { label: 'Local Hosts Needed', accent: true },
      { label: 'Judges & Mentors' },
    ],
    photo: { src: '/photos/04.webp', alt: 'Opening talk in front of a Bay Builders Hackathon screen overlooking the city' },
  },
  {
    date: 'Coming soon',
    kind: 'Founder Event',
    title: 'AI Go-to-Market in Silicon Valley',
    desc: 'A founder-focused event on positioning, distribution, partnerships and scaling market access for AI startups.',
    tags: [
      { label: 'Founders' },
      { label: 'Investors' },
      { label: 'Partner Applications', accent: true },
    ],
    photo: { src: '/photos/14.webp', alt: 'A full room of founders and investors seated at a 2% Tech founder event' },
  },
];

export const TAKEAWAYS = [
  'Reliable distribution matters as much as the physical room.',
  'Livestreaming and clips help sponsors get more than on-site exposure.',
  'Hybrid hackathons are a major lever for global scale.',
  'Strong brand names and relevant speakers increase conversion.',
];

export const REGIONS = [
  { label: 'North America', className: 'orbit__pin--na' },
  { label: 'Europe', className: 'orbit__pin--eu' },
  { label: 'India', className: 'orbit__pin--in' },
  { label: 'Southeast Asia', className: 'orbit__pin--sea' },
  { label: 'Latin America', className: 'orbit__pin--latam' },
  { label: 'University & Local Communities', className: 'orbit__pin--uni' },
];

/* The gallery band between Distribution and the agent CTA. `wide` items span
   two columns so the strip reads as a composed layout rather than a uniform
   grid of thumbnails. The order is deliberate: 2 + 1 + 1 on the first row and
   1 + 1 + 2 on the second tiles the four-column grid exactly. */
export type GalleryShot = { src: string; alt: string; caption: string; wide?: boolean };

export const GALLERY: GalleryShot[] = [
  {
    src: '/photos/09.webp',
    alt: 'A tiered lecture hall filled with participants working on laptops',
    caption: 'Hackathon floor · Stanford',
    wide: true,
  },
  {
    src: '/photos/11.webp',
    alt: 'A panel session with speaker headshots displayed on a yellow screen',
    caption: 'Panel · Speaker line-up',
  },
  {
    src: '/photos/10.webp',
    alt: 'A packed auditorium during a panel on AI agents in crypto finance',
    caption: 'Keynote · Full house',
  },
  {
    src: '/photos/08.webp',
    alt: 'Participants gathered for a group photo in front of the event screen',
    caption: 'Community · Demo day wrap',
  },
  {
    src: '/photos/15.webp',
    alt: 'Two builders reviewing work together on a laptop',
    caption: 'Mentors · 1:1 feedback',
  },
  {
    src: '/photos/06.webp',
    alt: 'Attendees seated on amphitheatre steps during an event session',
    caption: 'Demo day · Open seating',
    wide: true,
  },
];

export const FOOTER_COLUMNS = [
  {
    title: 'Explore',
    links: [
      { href: '#host', label: 'Host an Event' },
      { href: '#upcoming', label: 'Upcoming Events' },
      { href: '#distribution', label: 'Livestream & Content' },
    ],
  },
  {
    title: 'Join',
    links: [
      { href: '#network', label: 'Speaker / Judge' },
      { href: '#network', label: 'Investor / Sponsor' },
      { href: '#global', label: 'Community Partner' },
    ],
  },
];

export const CONTACT_EMAIL = 'lanwangmba@gmail.com';

export const AGENT_GREETING = [
  'Hi — tell me what you want to accomplish. I can help you start an event, apply to join, or identify the best partnership path.',
  'For example: “We are launching an AI platform, want a Silicon Valley workshop, and also need livestream distribution plus community partner support.”',
];

export const AGENT_REPLY =
  'Thanks — I would organize this into objective, audience, timing, distribution needs, ' +
  'and partner requirements. Next I can help you choose the right format and prepare it ' +
  'for human review.';
