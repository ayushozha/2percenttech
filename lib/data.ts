/* Site content shared by the landing page and the prospectus.

   Bilingual strings carry zh + en; language-neutral strings (event names,
   URLs, dates) are plain. Event data is pulled from the public Luma profile,
   August 2026 — keep the counts here and the headline figures in STATS in
   step, they are quoted against each other on the page.

   Logo art comes from lib/logo-assets.json — the public path plus the
   background colour sampled from each mark — regenerated together with
   public/logos/ by `npm run prepare-assets`. */
import logoAssets from './logo-assets.json';

export type Bi = { zh: string; en: string };

export const LUMA_PROFILE = 'https://luma.com/user/usr-imLXdlHS1TlvX7X';

export const CONTACT = {
  email: 'team@2percenttech.com',
  // Still unconfirmed — rendered with .tbd until they're settled.
  wechat: { zh: '待补', en: 'TBC' },
  calendar: 'calendly / luma —',
};

/* ---- companies ---------------------------------------------------------
   Past attendance, not sponsors — the disclaimer next to the wall says so
   and must stay. Same id scheme as ./logos so the art is shared. */

export type Company = { id: string; name: string; url: string; desc: Bi };

export const COMPANIES: Company[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    url: 'https://openai.com',
    desc: {
      zh: '通用人工智能研究与部署，GPT 系列模型及其 API 的开发方。',
      en: 'Researches and ships general-purpose AI, including the GPT model family and its API.',
    },
  },
  {
    id: 'nvidia',
    name: 'NVIDIA',
    url: 'https://www.nvidia.com',
    desc: {
      zh: 'AI 训练与推理的底层算力供应方，GPU 与 CUDA 生态。',
      en: 'Supplies the GPUs and CUDA stack that most AI training and inference runs on.',
    },
  },
  {
    id: 'google',
    name: 'Google',
    url: 'https://ai.google',
    desc: { zh: '搜索、云服务与 Gemini 模型系列。', en: 'Search, cloud, and the Gemini model family.' },
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    url: 'https://www.microsoft.com',
    desc: { zh: 'Azure 云平台与 Copilot 产品线。', en: 'The Azure cloud platform and the Copilot product line.' },
  },
  {
    id: 'meta',
    name: 'Meta',
    url: 'https://ai.meta.com',
    desc: { zh: 'Llama 开放权重模型系列的发布方。', en: 'Publishes the Llama family of open-weight models.' },
  },
  {
    id: 'aws',
    name: 'AWS',
    url: 'https://aws.amazon.com',
    desc: {
      zh: '全球最大云服务商，覆盖算力、存储与托管模型推理。也是我们常用场地 Builder Loft 的方。',
      en: 'The largest cloud provider, covering compute, storage and managed model inference. Also hosts our Builder Loft venue.',
    },
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    url: 'https://mistral.ai',
    desc: {
      zh: '欧洲前沿模型公司，提供开放权重模型与托管推理平台。',
      en: 'European frontier lab shipping open-weight models and a hosted inference platform.',
    },
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    url: 'https://www.coinbase.com',
    desc: { zh: '加密货币交易所与链上开发者基础设施。', en: 'Crypto exchange and onchain developer infrastructure.' },
  },
  {
    id: 'circle',
    name: 'Circle',
    url: 'https://www.circle.com',
    desc: {
      zh: 'USDC 稳定币发行方与支付基础设施。',
      en: 'Issuer of USDC and the stablecoin payment infrastructure around it.',
    },
  },
  {
    id: 'snyk',
    name: 'Snyk',
    url: 'https://snyk.io',
    desc: {
      zh: '面向开发者的安全平台，覆盖代码、依赖与容器。',
      en: 'Developer-first security across code, dependencies and containers.',
    },
  },
  {
    id: 'gmi',
    name: 'GMI Cloud',
    url: 'https://www.gmicloud.ai',
    desc: { zh: 'GPU 云平台，为 AI 训练与推理提供算力。', en: 'GPU cloud providing compute for AI training and inference.' },
  },
  {
    id: 'nebius',
    name: 'Nebius',
    url: 'https://nebius.com',
    desc: {
      zh: '全栈 AI 云基础设施，面向开发者、初创与研究团队提供训练与推理平台。',
      en: 'Full-stack AI cloud infrastructure for training and inference, for developers, startups and research teams.',
    },
  },
];

/** id -> { src, tile }. A mark whose art is missing simply falls back to a
    white tile and no image, rather than breaking the wall. */
export const LOGOS: Record<string, { src: string; tile: string }> = logoAssets;

export const logoOf = (id: string) => LOGOS[id] ?? { src: '', tile: '#ffffff' };

/* ---- saved seats -------------------------------------------------------
   A target list, clearly disclaimed on the page. None of these have any
   existing relationship with 2%Tech — do not reword that disclaimer. */

export type Seat = { name: string } | Bi;

export const SEATS: Seat[] = [
  { zh: '阿里云', en: 'Alibaba Cloud' },
  { zh: '腾讯云', en: 'Tencent Cloud' },
  { name: 'TRAE · ByteDance' },
  { name: 'DeepSeek' },
  { zh: '月之暗面', en: 'Moonshot AI' },
  { zh: '智谱 AI', en: 'Zhipu AI' },
  { name: 'MiniMax' },
  { name: 'Anthropic' },
];

export const COHOSTS =
  'AWS Builder Loft · Frontier Tower SF · FinChip.AI · Crewbase Collective · Devnovate · AI House · Bay AI Circle · Startup Universe';

/* ---- headline figures --------------------------------------------------
   Cumulative since January 2025, quoted from the Luma profile. */

export const STATS: { display: string; zh: string; en: string }[] = [
  { display: '25', zh: '已办活动', en: 'Events run' },
  { display: '6,300+', zh: '累计报名', en: 'Registrations' },
  { display: '5', zh: '已排期场次', en: 'More scheduled' },
];

/* ---- events ------------------------------------------------------------ */

export type EventRow = {
  date: string;
  name: string;
  url?: string;
  registered?: number;
  note?: Bi;
  /** The Stanford hackathon — highlighted, and its date is still unconfirmed. */
  highlight?: boolean;
};

export const UPCOMING: EventRow[] = [
  {
    date: '8/10',
    name: 'Frontier Signals #01: Infrastructure Behind Physical AI',
    url: 'https://luma.com/ckpqzfae',
    note: { zh: '· 已 280+ 人报名', en: '· 280+ registered' },
  },
  { date: '8/13', name: 'The Agentic World #2', url: 'https://luma.com/wlw3or8l' },
  {
    date: 'LATE AUG',
    name: 'Hackathon @ Stanford',
    note: { zh: '赞助洽谈中，冠名席还空着。', en: 'Sponsorship open. The title seat is still open.' },
    highlight: true,
  },
  { date: '8/31', name: 'Beyond RAG: Skill Function', url: 'https://luma.com/9yyasy4z' },
  { date: '10/19', name: 'Universal Celebration Hackathon', url: 'https://luma.com/m9h5vo7a' },
  {
    date: '11/7',
    name: "Festiverse 2026: The World's Biggest Festival Hackathon",
    url: 'https://luma.com/lsa8mrp7',
    note: { zh: '· $300K+ 奖金池', en: '· $300K+ in prizes' },
  },
];

/** All 25 events run so far, by registrations. 2026 unless the date says
    otherwise — 1/30/25 is the one 2025 entry. */
export const PAST: EventRow[] = [
  { date: '6/5', name: 'Agentic AI Hackathon — SF', url: 'https://luma.com/zemh10km', registered: 1144 },
  { date: '6/24', name: 'Skills & Agents — YC Founder Night', url: 'https://luma.com/krrq1vw9', registered: 617 },
  { date: '7/13', name: 'Bay Builders Hackathon', url: 'https://luma.com/9zhqvqc7', registered: 535 },
  {
    date: '7/11',
    name: 'AI Agents in Real-World Business + Demo Day',
    url: 'https://luma.com/ai-agents-are-moving-beyond-chat-interfa',
    registered: 456,
  },
  { date: '6/28', name: 'Wizard Hackathon', url: 'https://luma.com/nyixzul3', registered: 428 },
  { date: '7/1', name: 'USA WorldCup Knockout Watch Party', url: 'https://luma.com/sf-w4fo', registered: 359 },
  { date: '1/30/25', name: 'AI for Good Pitch Night + Networking', url: 'https://luma.com/u27y941o', registered: 330 },
  {
    date: '7/8',
    name: 'AI Founders x VCs: Conversation + Networking',
    url: 'https://luma.com/finchip-y4w3',
    registered: 254,
  },
  {
    date: '7/23',
    name: 'Prompt to Production: Secure Code & Agent Skills Workshop',
    url: 'https://luma.com/w60dlf9f',
    registered: 230,
  },
  { date: '7/24', name: 'Build your AI Organization Workshop', url: 'https://luma.com/guides-g0nw', registered: 227 },
  { date: '7/6', name: 'Find your Co-Founder', url: 'https://luma.com/ruthht0e', registered: 219 },
  { date: '7/13', name: 'Sports World Cup Hackathon', url: 'https://luma.com/ai-pq8b', registered: 186 },
  { date: '7/19', name: 'Design & Deploy Workshop', url: 'https://luma.com/vs5ybrec', registered: 182 },
  { date: '6/25', name: 'WorldCup USA vs Turkey Watch Party', url: 'https://luma.com/sf-i68n', registered: 178 },
  { date: '7/14', name: 'Applied Frontier #1: Loop Engineering', url: 'https://luma.com/ga59rkpa', registered: 154 },
  { date: '6/23', name: 'The Agentic World #1', url: 'https://luma.com/m09eyhhh', registered: 145 },
  {
    date: '7/13',
    name: 'Bay Builders Hackathon',
    url: 'https://luma.com/qk34mnuv',
    registered: 144,
    note: { zh: '· 第二个报名页', en: '· second listing' },
  },
  {
    date: '7/30',
    name: 'Solve It Once: Turn Expert Work into an Agent Skill',
    url: 'https://luma.com/6fg7hube',
    registered: 124,
  },
  { date: '7/18', name: 'AGI Summit 2026 Hackathon', url: 'https://luma.com/genaihackathon', registered: 119 },
  {
    date: '7/28',
    name: 'Agents You Love 2 Hackathon',
    url: 'https://luma.com/agents-you-love-2-hackathon',
    registered: 102,
  },
  { date: '7/16', name: 'Speed Dating', url: 'https://luma.com/bx4pqhoj', registered: 102 },
  {
    date: '7/14',
    name: 'Silicon Valley World Cup Semi-Finals Watch Party',
    url: 'https://luma.com/venture-0y3b',
    registered: 95,
  },
  { date: '6/17', name: 'Break My Product', url: 'https://luma.com/94sy18r3', registered: 13 },
  { date: '6/26', name: 'Find Your Co-Founder Meetup', url: 'https://luma.com/78suh3xb', registered: 11 },
  { date: '7/7', name: 'HackwithBay 3.0', url: 'https://luma.com/sv61aqlg' },
];

/** The nine highest-signal past events, shown on the landing calendar. The
    prospectus lists all 25. */
export const PAST_HIGHLIGHTS = PAST.slice(0, 9);

/* ---- photos ------------------------------------------------------------
   Files in public/photos, produced from ./photos by `npm run prepare-assets`.
   Captions are only written for the three the landing page features. */

export const PHOTOS: string[] = Array.from(
  { length: 16 },
  (_, i) => `/photos/${String(i + 1).padStart(2, '0')}.webp`,
);

/** The three the landing page features, indexed into PHOTOS so the extension
    can never drift from what prepare-assets emits. */
export const FEATURED_PHOTOS: { src: string; alt: string; caption: Bi }[] = [
  {
    src: PHOTOS[0],
    alt: 'Hackathon crowd',
    caption: {
      zh: 'Agentic AI Hackathon — SF · 1,144 人报名',
      en: 'Agentic AI Hackathon — SF · 1,144 registered',
    },
  },
  {
    src: PHOTOS[1],
    alt: 'Demo day stage',
    caption: {
      zh: 'Demo Day · AI Agents in Real-World Business',
      en: 'Demo day · AI Agents in Real-World Business',
    },
  },
  {
    src: PHOTOS[2],
    alt: 'Workshop',
    caption: { zh: 'Workshop · Prompt to Production 等', en: 'Workshops · Prompt to Production & more' },
  },
];

/* ---- host request form ------------------------------------------------- */

export type EventType = { id: string; zh: string; en: string };

/** The four standardised products, in the blueprint's own order and naming.
    Hackathons lead because they build the deepest builder relationships and
    are the most scalable thing we run. */
export const EVENT_TYPES: EventType[] = [
  { id: 'hackathon', en: 'Hackathon', zh: '黑客松' },
  { id: 'workshop', en: 'Workshop', zh: '工作坊' },
  { id: 'panel', en: 'Panel', zh: '圆桌论坛' },
  { id: 'keynote', en: 'Keynote / Founder Launch', zh: '主题演讲 / 新品发布' },
];
