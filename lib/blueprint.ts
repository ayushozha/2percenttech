/* Content derived from the 2%Tech Scale-Up Blueprint (working strategy
   document, August 2026).

   Two rules were applied translating that document into public copy:

   1. The blueprint is a plan. Anything it describes as future capability —
      the builder network, the content hub, the agent workflow — is presented
      here as roadmap (see ROADMAP), clearly labelled as not yet live. We do
      not advertise a job board that does not exist.
   2. Past cases reference real events from lib/data.ts with their real
      registration counts. No case study is invented. */

import type { Bi } from './data';

/* ---- §1 vision --------------------------------------------------------- */

export const POSITIONING: Bi = {
  zh: '活动基础设施 + AI Agent + 内容分发 + Builder 网络 + 人才与项目流',
  en: 'Event infrastructure + AI agents + content distribution + builder network + talent and deal flow',
};

/** The three groups the platform serves. */
export const AUDIENCES: { key: string; h: Bi; p: Bi }[] = [
  {
    key: 'founders',
    h: { zh: '创始人', en: 'Founders' },
    p: {
      zh: '进入硅谷、办活动、建立品牌、见客户、招 Builder、对接投资人。',
      en: 'Enter Silicon Valley, host events, build your brand, meet customers, recruit builders and connect with investors.',
    },
  },
  {
    key: 'builders',
    h: { zh: 'Builder', en: 'Builders' },
    p: {
      zh: '发现项目、参加黑客松、展示能力、对接初创公司、找到理想的工作。',
      en: 'Discover projects, join hackathons, demonstrate your skills, connect with startups and find the job you want.',
    },
  },
  {
    key: 'vcs',
    h: { zh: '投资人', en: 'VCs' },
    p: {
      zh: '发现有潜力的 Builder、团队与早期公司。',
      en: 'Discover promising builders, teams and early-stage companies.',
    },
  },
];

/* ---- §3 / §4.2 event products ------------------------------------------
   The four standardised products the landing page leads with. `caseIds`
   index real events by name in lib/data.ts — see PastCases in the product
   page, which resolves them rather than restating numbers here. */

export type EventProduct = {
  id: string;
  name: Bi;
  tagline: Bi;
  /** Ideal customer */
  forWho: Bi;
  objectives: Bi[];
  included: Bi[];
  /** The standard run of show, stage by stage */
  workflow: { t: Bi; d: Bi }[];
  /** Optional promotion / add-ons */
  addons: Bi[];
  /** Names must match entries in UPCOMING or PAST in lib/data.ts */
  caseNames: string[];
};

export const EVENT_PRODUCTS: EventProduct[] = [
  {
    id: 'hackathon',
    name: { zh: '黑客松', en: 'Hackathon' },
    tagline: {
      zh: '线上 + 线下混合制。我们最核心、也最可规模化的产品。',
      en: 'Online + offline hybrid. Our core product, and the most scalable one we run.',
    },
    forWho: {
      zh: '希望开发者真正把产品用起来的品牌——不是看一眼 logo，而是当天就写代码接进去。',
      en: 'Brands that want developers actually building on their product — not glancing at a logo, but shipping on it that day.',
    },
    objectives: [
      { zh: '让开发者在当天完成一次真实接入', en: 'Get developers through a real integration, on the day' },
      { zh: '建立比小组讨论更深、更长期的 Builder 关系', en: 'Build deeper, longer-lasting builder relationships than a panel can' },
      { zh: '产出可长期复用的项目与内容资产', en: 'Produce projects and content that keep working afterwards' },
      { zh: '沉淀一批可招聘、可投资的团队', en: 'Surface teams worth hiring or investing in' },
    ],
    included: [
      { zh: '专属落地页与全球报名', en: 'Dedicated landing page and global registration' },
      { zh: '赞助方赛题与独立赛道', en: 'Sponsor challenges and dedicated tracks' },
      { zh: '规则与评审标准设计', en: 'Rules and judging criteria' },
      { zh: '参赛者 onboarding 与组队匹配', en: 'Participant onboarding and team matching' },
      { zh: 'Discord 或同类线上社区', en: 'Discord or equivalent online community' },
      { zh: '导师坐诊与技术工作坊', en: 'Mentor office hours and technical workshops' },
      { zh: '提交入口与项目主页', en: 'Submission portal and project profiles' },
      { zh: '评审流程、线上 Demo Day 与直播', en: 'Judging workflow, online demo day and livestream' },
      { zh: '现场执行：开场、组队、Demo、颁奖', en: 'Onsite: opening, team formation, demos, awards' },
      { zh: '赛后招聘对接与项目介绍', en: 'Post-event recruiting and project introductions' },
    ],
    workflow: [
      { t: { zh: 'T-4 周', en: 'T-4 weeks' }, d: { zh: '赛题与赛道确认，落地页上线，全球报名开放', en: 'Challenge and tracks locked, landing page live, global registration opens' } },
      { t: { zh: 'T-2 周', en: 'T-2 weeks' }, d: { zh: '线上社区开放，组队匹配启动，参赛者提前领取 credits', en: 'Online community opens, team matching starts, participants get credits early' } },
      { t: { zh: 'T-3 天', en: 'T-3 days' }, d: { zh: '技术 onboarding 与导师坐诊', en: 'Technical onboarding and mentor office hours' } },
      { t: { zh: '当天', en: 'Event day' }, d: { zh: '开场、组队、编码冲刺、Demo、评审、颁奖，全程直播', en: 'Opening, team formation, sprint, demos, judging, awards — livestreamed throughout' } },
      { t: { zh: '赛后', en: 'After' }, d: { zh: '切片分发、项目清单、赞助效果报告、招聘对接', en: 'Clip distribution, project list, sponsor report, recruiting introductions' } },
    ],
    addons: [
      { zh: '短视频内容与社媒分发', en: 'Short-form content and social distribution' },
      { zh: '创始人或高管专访', en: 'Founder or executive interview' },
      { zh: '卫星场次（由社区伙伴在本地承办）', en: 'Satellite events hosted locally by community partners' },
    ],
    caseNames: ['Agentic AI Hackathon — SF', 'Bay Builders Hackathon', 'Wizard Hackathon'],
  },
  {
    id: 'workshop',
    name: { zh: '工作坊', en: 'Workshop' },
    tagline: {
      zh: '两到三小时，让一屋子工程师把你的文档跑通。',
      en: 'Two to three hours getting a room of engineers through your docs.',
    },
    forWho: {
      zh: '有具体产品要教、且教得会的团队——DevRel 讲文档，不讲愿景。',
      en: 'Teams with something specific to teach and someone who can teach it — DevRel on docs, not vision.',
    },
    objectives: [
      { zh: '让参与者当场完成第一次成功调用', en: 'Get every attendee to a first successful call in the room' },
      { zh: '收集真实的产品与文档反馈', en: 'Collect real product and documentation feedback' },
      { zh: '建立一批会用你产品的工程师', en: 'Leave behind engineers who know how to use your product' },
    ],
    included: [
      { zh: '活动页面与报名系统', en: 'Event page and registration' },
      { zh: '面向目标人群的定向招募', en: 'Targeted recruitment of the right attendees' },
      { zh: '场地协调与现场执行', en: 'Venue coordination and onsite execution' },
      { zh: '录播或直播', en: 'Recording or livestream' },
      { zh: '赛后 recap 与 opt-in 名单', en: 'Recap and opt-in contact list' },
    ],
    workflow: [
      { t: { zh: 'T-3 周', en: 'T-3 weeks' }, d: { zh: '主题与大纲确认，页面上线', en: 'Topic and outline locked, page live' } },
      { t: { zh: 'T-1 周', en: 'T-1 week' }, d: { zh: '定向推广与提醒，环境与账号预发', en: 'Targeted promotion and reminders, accounts and environments issued' } },
      { t: { zh: '当天', en: 'Event day' }, d: { zh: '教学、动手环节、答疑，全程录制', en: 'Teaching, hands-on section, Q&A — recorded throughout' } },
      { t: { zh: '赛后', en: 'After' }, d: { zh: '回放、切片、反馈汇总与名单交付', en: 'Replay, clips, feedback summary and contact list' } },
    ],
    addons: [
      { zh: '线上同步场次，覆盖非湾区开发者', en: 'A simultaneous online session for developers outside the Bay Area' },
      { zh: '内容二次剪辑为教学系列', en: 'Recut into an evergreen tutorial series' },
    ],
    caseNames: [
      'Prompt to Production: Secure Code & Agent Skills Workshop',
      'Build your AI Organization Workshop',
      'Design & Deploy Workshop',
    ],
  },
  {
    id: 'panel',
    name: { zh: '圆桌论坛', en: 'Panel' },
    tagline: {
      zh: '把该在一个房间里的人放进一个房间，然后录下来。',
      en: 'Put the people who should be in one room in one room, and film it.',
    },
    forWho: {
      zh: '想在某个议题上建立话语权、并需要内容素材的品牌与基金。',
      en: 'Brands and funds building authority on a topic — and needing the content to prove it.',
    },
    objectives: [
      { zh: '在目标议题上建立可信度', en: 'Establish credibility on a specific topic' },
      { zh: '产出可持续分发的长视频与切片', en: 'Produce long-form video and clips worth distributing' },
      { zh: '把高价值嘉宾聚到同一张桌子', en: 'Get high-value guests around one table' },
    ],
    included: [
      { zh: '议题设计与问题清单', en: 'Topic design and the question list' },
      { zh: '嘉宾邀约与档期协调', en: 'Speaker outreach and scheduling' },
      { zh: '主持与控场', en: 'Host and moderator' },
      { zh: '直播与多平台分发', en: 'Livestream and multi-platform distribution' },
      { zh: '嘉宾专属切片交付', en: 'Per-speaker clips delivered to each guest' },
    ],
    workflow: [
      { t: { zh: 'T-4 周', en: 'T-4 weeks' }, d: { zh: '议题确认，嘉宾邀约启动', en: 'Topic locked, speaker outreach starts' } },
      { t: { zh: 'T-2 周', en: 'T-2 weeks' }, d: { zh: '嘉宾公布、物料发布、定向邀请', en: 'Speaker announcements, graphics, targeted invitations' } },
      { t: { zh: '当天', en: 'Event day' }, d: { zh: '圆桌、问答、networking，全程直播', en: 'Panel, audience Q&A, networking — livestreamed' } },
      { t: { zh: '赛后', en: 'After' }, d: { zh: '完整回放、逐人切片、图文纪要', en: 'Full replay, per-speaker clips, written recap' } },
    ],
    addons: [
      { zh: '嘉宾一对一专访', en: 'One-on-one speaker interviews' },
      { zh: '社区伙伴同步转播', en: 'Partner communities redistributing the stream' },
    ],
    caseNames: ['The Agentic World #1', 'AI Founders x VCs: Conversation + Networking'],
  },
  {
    id: 'keynote',
    name: { zh: '主题演讲 / 新品发布', en: 'Keynote / Founder Launch' },
    tagline: {
      zh: '一场为你的发布而设计的晚间专场。',
      en: 'An evening built around your announcement.',
    },
    forWho: {
      zh: '有明确发布节点的创始人——新产品、新融资、新市场。',
      en: 'Founders with something to announce — a launch, a raise, a new market.',
    },
    objectives: [
      { zh: '让发布在正确的人面前发生', en: 'Make the announcement in front of the right room' },
      { zh: '当场获得反馈与首批用户', en: 'Walk out with feedback and first users' },
      { zh: '产出可用于后续传播的发布素材', en: 'Leave with launch assets you can keep using' },
    ],
    included: [
      { zh: '发布叙事与流程设计', en: 'Launch narrative and run of show' },
      { zh: 'VIP 创始人与投资人邀约', en: 'VIP founder and investor invitations' },
      { zh: '场地、直播与摄制', en: 'Venue, livestream and filming' },
      { zh: '发布后内容分发', en: 'Post-launch content distribution' },
    ],
    workflow: [
      { t: { zh: 'T-4 周', en: 'T-4 weeks' }, d: { zh: '发布叙事与嘉宾名单确认', en: 'Narrative and guest list locked' } },
      { t: { zh: 'T-1 周', en: 'T-1 week' }, d: { zh: '预热内容、媒体与定向邀请', en: 'Teasers, media and targeted invitations' } },
      { t: { zh: '当天', en: 'Event day' }, d: { zh: '演讲、Demo、问答、networking', en: 'Keynote, demo, Q&A, networking' } },
      { t: { zh: '赛后', en: 'After' }, d: { zh: '发布回放、切片、报道汇总', en: 'Replay, clips and coverage summary' } },
    ],
    addons: [
      { zh: '媒体与技术媒体对接', en: 'Media and technical-press outreach' },
      { zh: '中文市场同步发布', en: 'Simultaneous launch into the Chinese-speaking market' },
    ],
    caseNames: ['Skills & Agents — YC Founder Night', 'AI Agents in Real-World Business + Demo Day'],
  },
];

export const productById = (id: string) => EVENT_PRODUCTS.find((p) => p.id === id);

/* ---- §5 the campaign system -------------------------------------------- */

export const CAMPAIGN_HEADLINE: Bi = {
  zh: '一场硅谷活动 + 一套全球内容与分发系统',
  en: 'One Silicon Valley event + a global content and distribution system',
};

export const CAMPAIGN_ARGUMENT: Bi = {
  zh: '单场线下活动只能触达 100–200 人，所以线下聚会不可能是产品的全部。赞助方买的不该是三小时的线下活动，而是一场持续数周的品牌、内容与获客战役。',
  en: 'An onsite event reaches 100 to 200 people, so the physical gathering cannot be the whole product. Sponsors should not be buying a three-hour event — they should be buying a multi-week brand, content and customer-acquisition campaign.',
};

export const CAMPAIGN: { phase: Bi; sub: Bi; items: Bi[] }[] = [
  {
    phase: { zh: '赛前', en: 'Before' },
    sub: { zh: '建立预期', en: 'build anticipation' },
    items: [
      { zh: '嘉宾公布', en: 'Speaker announcements' },
      { zh: '嘉宾专属物料与预热视频', en: 'Speaker graphics and teaser videos' },
      { zh: '创始人专访', en: 'Founder interviews' },
      { zh: 'Newsletter', en: 'Newsletters' },
      { zh: 'X、LinkedIn、Reddit 内容', en: 'Content for X, LinkedIn and Reddit' },
      { zh: '社区伙伴同步分发', en: 'Community partner distribution' },
      { zh: '可直接转发的社媒素材包', en: 'Ready-to-share social kits' },
      { zh: '面向 Builder、客户与投资人的定向邀请', en: 'Targeted invitations to builders, customers and investors' },
    ],
  },
  {
    phase: { zh: '当天', en: 'During' },
    sub: { zh: '远超现场的触达', en: 'reach beyond the room' },
    items: [
      { zh: '多平台同步直播', en: 'Simultaneous livestream to major platforms' },
      { zh: '开放社区伙伴转播', en: 'Partner communities redistribute the stream' },
      { zh: '收集线上观众信息', en: 'Collect online audience information' },
      { zh: '接收线上提问', en: 'Take questions from the online audience' },
      { zh: '直播回放托管在 2%Tech 站点', en: 'Stream hosted on the 2%Tech site' },
      { zh: '通过二维码与表单捕获线索', en: 'Capture leads through QR codes and forms' },
    ],
  },
  {
    phase: { zh: '赛后', en: 'After' },
    sub: { zh: '交付与复盘', en: 'deliver and report' },
    items: [
      { zh: '自动剪辑短视频切片', en: 'Short clips edited automatically' },
      { zh: '向每位嘉宾交付其专属切片', en: 'Each speaker sent their own clips' },
      { zh: '附可直接发布的文案', en: 'Ready-to-post captions supplied' },
      { zh: '发布活动 recap', en: 'Event recap published' },
      { zh: '完整视频二次加工为主题内容', en: 'Full video repurposed into topic-based content' },
      { zh: '赞助效果报告', en: 'Sponsor performance report' },
      { zh: '播放量、报名、互动、到场与线索数据', en: 'Views, registrations, engagement, attendance and leads' },
    ],
  },
];

/* ---- §8 partner network ------------------------------------------------ */

export const PARTNER_TYPES: Bi[] = [
  { zh: 'AI 社区', en: 'AI communities' },
  { zh: '高校社团', en: 'University clubs' },
  { zh: '开发者组织', en: 'Developer groups' },
  { zh: '加速器', en: 'Accelerators' },
  { zh: '联合办公空间', en: 'Coworking spaces' },
  { zh: '创业生态', en: 'Startup ecosystems' },
  { zh: '技术媒体', en: 'Technical media' },
  { zh: '本地活动主办方', en: 'Local event organisers' },
];

export const PARTNER_OFFER: Bi[] = [
  { zh: '推广全球黑客松', en: 'Promote global hackathons' },
  { zh: '推荐本地 Builder', en: 'Refer local builders' },
  { zh: '承办卫星场次', en: 'Host satellite events' },
  { zh: '分发赞助方资源', en: 'Distribute sponsor resources' },
];

/* ---- §4.4 / §4.5 roadmap ----------------------------------------------
   Explicitly not live. Rendered under a "what we're building" heading so
   nobody reads it as an available feature. */

export const ROADMAP: { h: Bi; p: Bi }[] = [
  {
    h: { zh: '直播与内容中心', en: 'Livestream and content hub' },
    p: {
      zh: '每场活动都成为长期内容资产：完整直播、圆桌视频、嘉宾单独片段、切片、要点摘要与可检索的主题内容。',
      en: 'Every event becomes a lasting content asset: full livestream, panel video, per-speaker segments, clips, key insights and searchable topic content.',
    },
  },
  {
    h: { zh: 'Builder 社区', en: 'Builder network' },
    p: {
      zh: 'Builder 主页、项目展示、黑客松组队匹配、初创岗位、创始人招聘、投资人发现与导师网络。',
      en: 'Builder profiles, project showcases, hackathon team matching, startup jobs, founder recruiting, VC discovery and a mentor network.',
    },
  },
  {
    h: { zh: 'Agent 驱动的活动流程', en: 'Agent-powered event workflow' },
    p: {
      zh: '场地检索与申请、嘉宾邀约与跟进、资料收集、提案生成与 CRM 建单，由 agent 承担；邀请谁、报价多少、是否接这个项目，仍由人决定。',
      en: 'Venue search and applications, speaker outreach and follow-up, information collection, proposal drafting and CRM records handled by agents. Who to invite, what to charge and whether to take a project stay human decisions.',
    },
  },
];
