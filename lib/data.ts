// Site content. Bilingual strings carry zh + en; language-neutral strings are plain.
// Logo tiles (background colours sampled from each mark) come from lib/logo-tiles.json,
// regenerated together with public/logos/ by `npm run prepare-assets`.
import tiles from './logo-tiles.json';

export const LUMA_PROFILE = 'https://luma.com/user/usr-imLXdlHS1TlvX7X';

export type Company = { id: string; name: string; url: string };

// Same id scheme as sponsor.html so both surfaces share the logo art in ./logos.
export const COMPANIES: Company[] = [
  { id: 'openai', name: 'OpenAI', url: 'https://openai.com' },
  { id: 'nvidia', name: 'NVIDIA', url: 'https://www.nvidia.com' },
  { id: 'google', name: 'Google', url: 'https://ai.google' },
  { id: 'microsoft', name: 'Microsoft', url: 'https://www.microsoft.com' },
  { id: 'meta', name: 'Meta', url: 'https://ai.meta.com' },
  { id: 'aws', name: 'AWS', url: 'https://aws.amazon.com' },
  { id: 'mistral', name: 'Mistral AI', url: 'https://mistral.ai' },
  { id: 'coinbase', name: 'Coinbase', url: 'https://www.coinbase.com' },
  { id: 'circle', name: 'Circle', url: 'https://www.circle.com' },
  { id: 'snyk', name: 'Snyk', url: 'https://snyk.io' },
  { id: 'gmi', name: 'GMI Cloud', url: 'https://www.gmicloud.ai' },
];

export const LOGO_TILES: Record<string, string> = tiles;

// Target sponsors — a wish list, clearly disclaimed on the page. Edit freely.
export type Seat = { zh: string; en: string } | { name: string };
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

// Event data pulled from the public Luma profile, August 2026.
export type EventRow = {
  date: string;
  name: string;
  url?: string;
  registered?: number;
  note?: { zh: string; en: string };
};

export const UPCOMING: EventRow[] = [
  { date: '8/10', name: 'Frontier Signals #01: Infrastructure Behind Physical AI', url: 'https://luma.com/ckpqzfae', note: { zh: '· 已 280+ 人报名', en: '· 280+ registered' } },
  { date: '8/13', name: 'The Agentic World #2', url: 'https://luma.com/wlw3or8l' },
  { date: '8/31', name: 'Beyond RAG: Skill Function', url: 'https://luma.com/9yyasy4z' },
  { date: '10/19', name: 'Universal Celebration Hackathon', url: 'https://luma.com/m9h5vo7a' },
  { date: '11/7', name: "Festiverse 2026: The World's Biggest Festival Hackathon", url: 'https://luma.com/lsa8mrp7', note: { zh: '· $300K+ 奖金池', en: '· $300K+ in prizes' } },
];

export const PAST: EventRow[] = [
  { date: '6/5', name: 'Agentic AI Hackathon — SF', registered: 1144 },
  { date: '7/13', name: 'Bay Builders Hackathon', registered: 535 },
  { date: '7/11', name: 'AI Agents in Real-World Business + Demo Day', registered: 456 },
  { date: '6/28', name: 'Wizard Hackathon', registered: 428 },
  { date: '25/1/31', name: 'AI for Good Pitch Night + Networking', registered: 330 },
  { date: '7/24', name: 'Prompt to Production: Secure Code & Agent Skills Workshop', registered: 231 },
  { date: '7/25', name: 'Build your AI Organization Workshop', registered: 228 },
  { date: '7/20', name: 'Design & Deploy Workshop', registered: 182 },
];

export const STATS = [
  { n: 24, display: '24', zh: '已办活动', en: 'Events run' },
  { n: 5700, suffix: '+', display: '5,700+', zh: '累计报名', en: 'Registrations' },
  { n: 5, display: '5', zh: '已排期场次', en: 'More scheduled' },
];
