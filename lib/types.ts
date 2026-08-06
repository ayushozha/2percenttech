export type Role = 'admin' | 'organizer' | 'judge' | 'participant';

export const ROLES: Role[] = ['admin', 'organizer', 'judge', 'participant'];

/** Roles a person may pick for themselves at signup. `admin` is deliberately
    absent — it is only ever granted to a seeded account. */
export const SELECTABLE_ROLES: { id: Role; zh: string; en: string }[] = [
  { id: 'participant', en: 'Participant', zh: '参赛者' },
  { id: 'judge', en: 'Judge', zh: '评委' },
  { id: 'organizer', en: 'Organizer', zh: '主办' },
];

export type User = {
  name: string;
  email: string;
  /** Demo only, stored in the clear. See the warning at the top of store.ts. */
  pass: string;
  role: Role;
};

export type Session = { name: string; email: string; role: Role };

export type QueryStatus = 'new' | 'contacted' | 'closed';

export const QUERY_STATUSES: QueryStatus[] = ['new', 'contacted', 'closed'];

/** Inbound enquiries. Both kinds share one inbox and one status workflow —
    they are the same pipeline to whoever works it — so they're one type with
    a discriminator rather than two parallel lists.

    `host`   — "I want to run an event with you", from the landing page form.
    `sponsor` — "I want to sponsor one", from /sponsor/apply. */
export type LeadKind = 'host' | 'sponsor';

export type Lead = {
  id: string;
  kind: LeadKind;
  email: string;
  ts: string;
  status: QueryStatus;

  /** host: which event formats they're after */
  picks?: string[];
  /** host: the qualification set the blueprint (§3) asks for. All optional —
      a lead with only an email is still a lead worth working. */
  audience?: string;
  dates?: string;
  attendance?: string;
  needs?: string[];
  media?: string[];
  access?: string[];

  /** sponsor: who is asking */
  company?: string;
  contact?: string;
  /** sponsor: package ids from PACKAGES, or 'unsure' */
  packages?: string[];
  /** sponsor: what they're measured on */
  goals?: string[];
  budget?: string;
  message?: string;
};

/** What a sponsor is trying to get out of it. Drives the brief we come back
    with, so it's a first-class field rather than free text. */
export const SPONSOR_GOALS: { id: string; zh: string; en: string }[] = [
  { id: 'adoption', zh: '开发者采用', en: 'Developer adoption' },
  { id: 'awareness', zh: '品牌认知', en: 'Brand awareness' },
  { id: 'feedback', zh: '产品反馈', en: 'Product feedback' },
  { id: 'hiring', zh: '招聘', en: 'Hiring' },
  { id: 'pipeline', zh: '商机管线', en: 'Sales pipeline' },
];

/* ---- host-request vocabularies (blueprint §3) --------------------------- */

export const HOST_GOALS: { id: string; zh: string; en: string }[] = [
  { id: 'adoption', zh: '开发者采用', en: 'Developer adoption' },
  { id: 'launch', zh: '产品发布', en: 'Product launch' },
  { id: 'awareness', zh: '品牌认知', en: 'Brand awareness' },
  { id: 'recruiting', zh: '招聘', en: 'Recruiting' },
  { id: 'customers', zh: '获客', en: 'Customer acquisition' },
  { id: 'investors', zh: '对接投资人', en: 'Investor access' },
];

/** Venue / speaker / livestream requirements. */
export const HOST_NEEDS: { id: string; zh: string; en: string }[] = [
  { id: 'venue', zh: '需要我们找场地', en: 'You find the venue' },
  { id: 'speakers', zh: '需要我们邀约嘉宾', en: 'You source the speakers' },
  { id: 'livestream', zh: '需要直播', en: 'Livestream it' },
  { id: 'filming', zh: '需要摄制', en: 'Film it' },
  { id: 'catering', zh: '需要餐饮', en: 'Catering' },
];

/** Online promotion, short-form video and media requirements. */
export const HOST_MEDIA: { id: string; zh: string; en: string }[] = [
  { id: 'promotion', zh: '线上推广', en: 'Online promotion' },
  { id: 'shortform', zh: '短视频内容', en: 'Short-form video' },
  { id: 'newsletter', zh: 'Newsletter 与社媒', en: 'Newsletter and social' },
  { id: 'press', zh: '媒体对接', en: 'Media outreach' },
  { id: 'partners', zh: '社区伙伴分发', en: 'Partner distribution' },
];

/** Developer recruitment, customer invitations and investor access. */
export const HOST_ACCESS: { id: string; zh: string; en: string }[] = [
  { id: 'developers', zh: '招募开发者到场', en: 'Recruit developers to attend' },
  { id: 'customers', zh: '邀请目标客户', en: 'Invite target customers' },
  { id: 'investors', zh: '邀请投资人', en: 'Bring investors' },
];

export const ATTENDANCE_BANDS: { id: string; zh: string; en: string }[] = [
  { id: 'u50', zh: '50 人以内', en: 'Under 50' },
  { id: '50-150', zh: '50–150 人', en: '50–150' },
  { id: '150-300', zh: '150–300 人', en: '150–300' },
  { id: '300plus', zh: '300 人以上', en: '300+' },
  { id: 'unsure', zh: '还不确定', en: 'Not sure yet' },
];

/** Bands rather than a number: it sets expectations without asking anyone to
    commit to a figure before a conversation. */
export const BUDGET_BANDS: { id: string; zh: string; en: string }[] = [
  { id: 'exploring', zh: '还在了解', en: 'Just exploring' },
  { id: 'under25', zh: '$25K 以下', en: 'Under $25K' },
  { id: '25-50', zh: '$25K–50K', en: '$25K–50K' },
  { id: '50-100', zh: '$50K–100K', en: '$50K–100K' },
  { id: 'over100', zh: '$100K 以上', en: '$100K+' },
];

export type Submission = {
  id: string;
  team: string;
  project: string;
  track: string;
  desc: string;
  /** judge email -> score 1..10 */
  scores: Record<string, number>;
  /** set when a participant entered it themselves */
  owner?: string;
};
