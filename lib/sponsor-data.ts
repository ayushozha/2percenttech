/* Prospectus content — the sponsorship pitch for the one-day Stanford
   hackathon. Carried over verbatim from the previous sponsor.html.

   Several of the disclaimers here are load-bearing and were written
   deliberately: the lineup is a bench from past partner events and nobody on
   it has agreed to this one, and the company wall is past attendance rather
   than sponsorship. Do not soften either without a decision from the team. */
import type { Bi } from './data';

export const EVENT_META: { label: Bi; value: Bi | string; tbd?: boolean }[] = [
  { label: { zh: '日期', en: 'Date' }, value: { zh: '待定', en: 'TBC' }, tbd: true },
  { label: { zh: '时间', en: 'Time' }, value: '09:00 – 18:30' },
  { label: { zh: '地点', en: 'Venue' }, value: 'Stanford University' },
  { label: { zh: '形式', en: 'Format' }, value: { zh: '单日黑客松', en: 'One-day hackathon' } },
];

/** Cumulative across the whole 2%Tech network — NOT this event's numbers.
    The caption underneath says so, and has to keep saying so. */
export const NETWORK_STATS: { display: string; label: Bi }[] = [
  { display: '150,000+', label: { zh: 'Builder 社区触达', en: 'Builder community reach' } },
  { display: '10,000+', label: { zh: '参与过的 Hacker', en: 'Hackers reached' } },
  { display: '200+', label: { zh: '评委与导师', en: 'Judges & mentors' } },
  { display: '50+', label: { zh: '到场公司', en: 'Companies' } },
];

/* ---- the day ----------------------------------------------------------- */

export type FunnelRow = {
  t: Bi | string;
  text: Bi;
  /** Who takes part, and under which package. */
  who?: Bi;
  /** Marks the conversion / retention beats. */
  pt?: Bi;
  /** Sponsor is directly involved — these rows are highlighted. */
  sp?: boolean;
};

export const FUNNEL: { phase: Bi; sub: Bi | string; rows: FunnelRow[] }[] = [
  {
    phase: { zh: '赛前', en: 'Before' },
    sub: { zh: '两周', en: 'two weeks out' },
    rows: [
      {
        t: 'T-14',
        sp: true,
        text: {
          zh: '报名开放 · 你的赛题与产品介绍进报名页 · 参赛者提前领取 credits',
          en: 'Registration opens · your challenge and product brief go on the signup page · participants get credits early',
        },
      },
      {
        t: 'T-3',
        sp: true,
        text: { zh: '线上 onboarding', en: 'Online onboarding' },
        who: {
          zh: '加购项 · 由你的 DevRel 主讲，我们负责组织与拉人',
          en: 'Add-on · your DevRel teaches it, we organise and fill the room',
        },
      },
    ],
  },
  {
    phase: { zh: '当天', en: 'Event day' },
    sub: '09:00 – 18:30 · Stanford',
    rows: [
      { t: '09:00', text: { zh: '签到与早餐', en: 'Check-in & breakfast' } },
      {
        t: '09:30',
        sp: true,
        text: { zh: '开场：怎么用你的产品', en: 'Opening: how to build on your product' },
        who: { zh: '独家与旗舰专场 · 讲文档，不讲愿景', en: 'Exclusive & Flagship · docs, not vision' },
      },
      {
        t: '10:00',
        sp: true,
        text: { zh: '动手接入 · 现场激活', en: 'Hands-on integration · keys activated in the room' },
        pt: { zh: '转化点', en: 'conversion' },
        who: { zh: '全部套餐 · 赛题发布后直接开做', en: 'All packages · the brief goes out, building starts' },
      },
      { t: '10:40', text: { zh: '赛题说明与组队', en: 'Challenges & team forming' } },
      {
        t: '11:00 – 16:00',
        sp: true,
        text: { zh: '编码冲刺 · DevRel 全天坐诊', en: 'Hacking sprint · your DevRel on call all day' },
        pt: { zh: '留存点', en: 'retention' },
        who: {
          zh: '全部套餐 · 派驻你自己的工程师解集成阻塞',
          en: 'All packages · your own engineers unblock integrations',
        },
      },
      {
        t: '16:00',
        text: {
          zh: '提交截止 · 提交表自报所用工具与 repo 链接',
          en: 'Submissions close · teams declare tools used and repo links',
        },
      },
      {
        t: '16:30',
        sp: true,
        text: { zh: 'Demo 与评审 · 项目跑在你的产品上', en: 'Demos & judging · projects running on your stack' },
        who: { zh: '全部套餐 · 评委席', en: 'All packages · judge seats' },
      },
      {
        t: '17:45',
        sp: true,
        text: { zh: '颁奖 · 冠名奖由设奖方上台颁发', en: 'Awards · prize sponsors present on stage' },
      },
      {
        t: { zh: '全天', en: 'All day' },
        sp: true,
        text: {
          zh: '全程直播 · 赞助方在直播间标题、画面角标与开场口播中露出',
          en: 'Livestreamed throughout · sponsors in the stream title, on-screen bug and opening mention',
        },
      },
    ],
  },
  {
    phase: { zh: '赛后', en: 'After' },
    sub: { zh: '全部来自表单导出', en: 'all exported from forms' },
    rows: [
      {
        t: 'T+',
        sp: true,
        text: {
          zh: 'Recap 邮件与公开页面：到场画像、项目清单与 repo 链接、直播回放、opt-in 名单',
          en: 'Recap email and public page: attendee mix, project list with repo links, stream replay, opt-in contacts',
        },
      },
      {
        t: 'T+',
        sp: true,
        text: { zh: '社媒精彩片段发布，赞助方在其中露出', en: 'Highlight clips published to social, sponsors featured' },
      },
    ],
  },
];

/* ---- packages ---------------------------------------------------------- */

export type Package = {
  /** Stable id — referenced by sponsor applications, so don't rename these. */
  id: string;
  name: Bi;
  for: Bi;
  items: Bi[];
  format: Bi;
  feature?: boolean;
  flag?: Bi;
};

export const PACKAGES: Package[] = [
  {
    id: 'cohosted',
    name: { zh: '联合主办', en: 'Co-Hosted Hackathon' },
    for: {
      zh: '想让开发者用上你的产品，但不需要独占整场活动。与其他合作方共享场地与观众，你出自己的赛题。',
      en: 'Get builders onto your product without owning the whole event. You share the venue and the audience with other partners, and bring your own challenge.',
    },
    items: [
      { zh: '与其他主要合作方共同主办', en: 'Co-hosted with other major partners' },
      { zh: '共享场地与观众', en: 'Shared venue and shared audience' },
      { zh: '一个品牌赛题或主题', en: 'One branded challenge or theme' },
      { zh: '活动页面与报名系统支持', en: 'Event page and registration support' },
      { zh: '通过我们的社区渠道推广', en: 'Promotion through our community channels' },
      { zh: '评委与导师协调', en: 'Judge and mentor coordination' },
      { zh: '现场执行与基础复盘', en: 'Onsite execution and basic wrap-up' },
    ],
    format: { zh: '共享形式', en: 'Shared format' },
  },
  {
    id: 'exclusive',
    name: { zh: '品牌独家专场', en: 'Exclusive Brand Hackathon' },
    for: {
      zh: '整场活动只属于你：一个品牌、一个赛题，全程没有同品类竞品。主题、规则与议程由你参与设计。',
      en: 'The whole room is yours: one brand, one challenge, no competing sponsor in the building. You help design the theme, the rules and the agenda.',
    },
    feature: true,
    flag: { zh: '最受欢迎', en: 'Most popular' },
    items: [
      { zh: '专属品牌活动', en: 'Dedicated branded event' },
      { zh: '同品类竞品不得参与', en: 'No same-category competing sponsor' },
      { zh: '主题、赛题、规则与议程设计', en: 'Theme, challenge, rules and agenda design' },
      { zh: '落地页与报名系统', en: 'Landing page and registration system' },
      { zh: '3–4 周推广与参赛者招募', en: '3–4 weeks of promotion and participant outreach' },
      { zh: '场地协调与统筹', en: 'Venue coordination and planning' },
      { zh: '4–6 位高质量评委或导师', en: '4–6 high-quality judges or mentors' },
      { zh: '完整流程设计与现场管理', en: 'Full run of show and onsite management' },
      { zh: '基础活动摄影与赛后报告', en: 'Basic event photography and post-event report' },
    ],
    format: { zh: '专属形式', en: 'Dedicated format' },
  },
  {
    id: 'flagship',
    name: { zh: '旗舰专场 + 内容', en: 'Flagship Hackathon + Media' },
    for: {
      zh: '内容和活动本身同等重要。包含独家专场的一切，再加上专访、直播、短视频与赛后效果报告。',
      en: 'For when the content matters as much as the day. Everything in Exclusive, plus interviews, livestream, short-form video and an impact report.',
    },
    items: [
      { zh: '包含独家专场全部内容', en: 'Everything in the Exclusive package' },
      { zh: '更强的品牌叙事与视觉包装', en: 'Stronger brand storytelling and visual packaging' },
      { zh: '6–8 位精选评委、导师或嘉宾', en: '6–8 curated judges, mentors or guests' },
      { zh: 'VIP 创始人与投资人邀约', en: 'VIP founder / investor invitations' },
      { zh: '创始人或高管专访', en: 'Founder or executive interview' },
      { zh: '活动直播或录播', en: 'Event livestream or recorded coverage' },
      { zh: '短视频内容与社媒分发', en: 'Short-form content and social distribution' },
      { zh: '赞助效果报告', en: 'Sponsor impact report' },
      { zh: '可选的赛后商务对接', en: 'Optional post-event business follow-up' },
    ],
    format: { zh: '旗舰形式', en: 'Signature format' },
  },
];

export const PACKAGE_NOTES: Bi[] = [
  { zh: '奖金不包含在任何套餐内。', en: 'Prize money is not included in any package.' },
  { zh: '两餐餐饮按最终到场人数另行计费。', en: 'Two-meal catering is billed separately, based on final attendance.' },
  {
    zh: '讲者、评委与特邀嘉宾以最终确认与档期为准。',
    en: 'Speakers, judges and featured guests are subject to availability and confirmation.',
  },
  { zh: '报名与到场人数不作保证。', en: 'Registration and attendance numbers are not guaranteed.' },
  {
    zh: '额外制作、直播或定制品牌内容可另行报价。',
    en: 'Additional production, livestream or custom branding can be quoted separately.',
  },
];

/* ---- what you get back ------------------------------------------------- */

export const DELIVERABLES: { h: Bi; p: Bi }[] = [
  {
    h: { zh: '到场画像', en: 'Who showed up' },
    p: { zh: '人数与职位、公司、阶段构成。', en: 'Headcount plus the mix of roles, companies and stages.' },
  },
  {
    h: { zh: '项目清单', en: 'Project list' },
    p: {
      zh: '全部提交项目，含 repo 与 demo 链接，各队自报用了哪些赞助方工具。',
      en: "Every submission with repo and demo links, and each team's own declaration of which sponsor tools they used.",
    },
  },
  {
    h: { zh: '直播与切片', en: 'Stream & clips' },
    p: {
      zh: '全场直播回放，以及发布到社媒的精彩片段链接。',
      en: 'The full stream replay, plus links to the highlight clips published on social.',
    },
  },
  {
    h: { zh: 'opt-in 名单', en: 'Opt-in contacts' },
    p: {
      zh: '报名时明确勾选同意被赞助方联系的参会者名单。',
      en: 'Attendees who explicitly ticked the box agreeing to be contacted by sponsors.',
    },
  },
];

export const PRIZES: { h: Bi; p: Bi }[] = [
  {
    h: { zh: '主奖', en: 'Grand prize' },
    p: { zh: '独家与旗舰专场专属，全场最高奖。', en: 'Title sponsor only. Top award of the event.' },
  },
  {
    h: { zh: '最佳 [你的产品] 应用', en: 'Best use of [your product]' },
    p: { zh: '三个套餐都可设，奖金额度由设奖方自定。', en: 'Available under any package, funded at your discretion.' },
  },
  {
    h: { zh: '额度类奖励', en: 'Credits award' },
    p: { zh: '以算力或 API 额度发放，数额由你决定。', en: 'Paid in compute or API credits, at a level you set.' },
  },
  {
    h: { zh: '特别奖', en: 'Special prize' },
    p: {
      zh: '任意套餐可设，如工位、设备、社群权益。',
      en: 'Available under any package: desks, hardware, community perks.',
    },
  },
];

/* ---- lineup ------------------------------------------------------------
   29 people who judged, hosted or volunteered at recent partner events.
   NOT confirmed attendees of this event — the note under the grid says so
   twice and must stay until individuals actually confirm. */

export type Person = { slot: Bi; name: string; role: string };

const JUDGE: Bi = { zh: '评委', en: 'Judge' };
const HOST: Bi = { zh: '主办', en: 'Host' };
const VOLUNTEER: Bi = { zh: '志愿者', en: 'Volunteer' };

export const LINEUP: Person[] = [
  { slot: JUDGE, name: 'Vince Kohli', role: 'Strategic Advisor @ Google DeepMind' },
  { slot: JUDGE, name: 'Dhruvil Darji', role: 'Senior Software Engineer @ NVIDIA' },
  { slot: JUDGE, name: 'Apurva Jain', role: 'Software Engineer @ Meta' },
  { slot: JUDGE, name: 'Ann Cai', role: 'Product Designer @ Microsoft' },
  { slot: JUDGE, name: 'Gunjan Ramateke', role: 'Strategic Partnerships Development Manager @ Amazon' },
  { slot: JUDGE, name: 'Gary Qi', role: 'DevRel @ TRAE (ByteDance)' },
  { slot: JUDGE, name: 'Anna Zakowska', role: 'Investor & Managing Partner @ Dragons and Angels Fund' },
  { slot: JUDGE, name: 'Colin Lowenberg', role: 'DevRel @ Nebius' },
  { slot: JUDGE, name: 'Mariane Bekker', role: 'Head of Developer Relationships @ You.com' },
  { slot: JUDGE, name: 'Shouvik Sharma', role: 'Software Engineer @ Chime' },
  { slot: JUDGE, name: 'Katherine Brough', role: 'Founder @ NuPath AI' },
  { slot: HOST, name: 'Chelsey Huang', role: 'Co-Founder @ Finchip AI' },
];

export const LINEUP_MORE: Person[] = [
  { slot: JUDGE, name: 'Tony Chwang', role: 'Co-Founder @ InsForge' },
  { slot: JUDGE, name: 'Madison Lee', role: 'Founding Partnerships Lead @ You.com' },
  { slot: JUDGE, name: 'Amina Ebrahim', role: 'Chief Operating Officer @ Growing Pies' },
  { slot: JUDGE, name: 'Gary Yang', role: 'Founding Partner @ Finchip AI' },
  { slot: JUDGE, name: 'Abhi Vasanth', role: 'Senior Data Engineer @ Pacific Gas and Electric Company' },
  { slot: JUDGE, name: 'Mahek Pervez', role: 'Tech Content Creator @ Instagram' },
  { slot: JUDGE, name: 'Amitabh Das', role: 'Founder @ Agent OS' },
  { slot: JUDGE, name: 'Wei Dou', role: 'Software Developer @ InsForge' },
  { slot: JUDGE, name: 'Can Lyu', role: 'Software Developer @ InsForge' },
  { slot: JUDGE, name: 'Ayush Ojha', role: 'Software Engineer @ HiJenny' },
  { slot: JUDGE, name: 'Kolliakal Rupesh', role: 'Applied AI Engineer @ WayLine' },
  { slot: JUDGE, name: 'Merve Isler', role: 'Ecosystem Builder @ AI Builders' },
  { slot: JUDGE, name: 'Anya Ozmen', role: 'Founder @ Gameer' },
  { slot: HOST, name: 'Saurabh Khire', role: 'Founder @ Crewbase Collective' },
  { slot: HOST, name: 'Coco Wang', role: 'GTM @ Finchip AI' },
  { slot: HOST, name: 'Aviral Bharadwaj', role: 'Founder @ Devnovate' },
  { slot: VOLUNTEER, name: 'Wendy Wang', role: 'Computer Teaching Assistant @ Wellesley College' },
];

/* ---- FAQ ---------------------------------------------------------------
   `tbdInA` marks an answer that still contains an unconfirmed field. */

export const FAQ: { q: Bi; a: Bi; tbd?: Bi }[] = [
  {
    q: { zh: '截止时间是什么时候？', en: "What's the deadline?" },
    a: {
      zh: '主视觉与印刷物料需在活动前两周定稿，logo 与冠名信息须在此之前确认。确切日期：',
      en: 'Key art and printed collateral lock two weeks before the event; logos and naming must be confirmed by then. Exact date: ',
    },
    tbd: { zh: '待定', en: 'TBC' },
  },
  {
    q: { zh: '能拿到参会者名单吗？', en: 'Do we get the attendee list?' },
    a: {
      zh: '三个套餐都拿到 opt-in 名单，即报名时明确勾选同意被赞助方联系的那部分参会者。我们不提供全量名单，任何套餐都不提供。',
      en: "All three packages include the opt-in list, meaning attendees who ticked the box agreeing to be contacted. We don't hand over the full list, under any package.",
    },
  },
  {
    q: { zh: '我们可以自己出赛题吗？', en: 'Can we set our own challenge?' },
    a: {
      zh: '可以，三个套餐都能出题。联合主办含一个品牌赛题；独家与旗舰专场的主题、赛题、规则与议程整套由你参与设计。你定题目和评判标准，我们把它写进参赛规则。这正是你花的钱买到的东西：不是希望有人用你的产品，是规则要求他们用。',
      en: "Yes, under all three packages. Co-Hosted includes one branded challenge; Exclusive and Flagship cover the whole theme, challenge, rules and agenda. You write the brief and the judging criteria, and we put it in the rules. That's the thing you're actually paying for: not hoping someone uses your product, but a rule that requires it.",
    },
  },
  {
    q: { zh: '价格怎么算？', en: 'How does pricing work?' },
    a: {
      zh: '我们按你想要的结果来定价：套餐、加购与规模确定后给出报价。告诉我们今年你被考核的指标是什么，15 分钟就能算清楚。付款方式与开票在同一次沟通里确认。',
      en: "We price against the outcome you're after: the package, the add-ons and the scale settle the number. Tell us what you're measured on this year and fifteen minutes is enough to work it out. Payment terms and invoicing are settled in the same conversation.",
    },
  },
  {
    q: { zh: '排他性具体怎么算？', en: 'How does exclusivity actually work?' },
    a: {
      zh: '按品类划分，写进合同。品牌独家专场与旗舰专场全程不出现同品类竞品；联合主办为共享形式，不含排他。品类边界在签约前双方书面确认，避免事后扯皮。',
      en: "By category, written into the contract. The Exclusive Brand and Flagship packages carry no same-category competing sponsor; Co-Hosted is a shared format and carries no exclusivity. We agree the category boundary in writing before signing, so there's nothing to argue about later.",
    },
  },
  {
    q: { zh: '活动之后有什么？', en: 'What happens after the event?' },
    a: {
      zh: '活动全程有摄制，剪辑成片会在我们的社媒渠道发布，赞助方在片中露出。往期活动的现场素材可按需提供。',
      en: 'The event is filmed and edited into content published on our channels, with sponsors featured. Footage from past events is available on request.',
    },
  },
];

export const VENUES: Bi = {
  zh: '常用场地：AWS Builder Loft（旧金山，AWS 官方技术社区场地）、Frontier Tower（旧金山前沿 AI 与深科技聚集地）、以及斯坦福、伯克利与 Palo Alto / Menlo Park 一带的 VC 办公室生态。',
  en: "Regular venues: AWS Builder Loft (San Francisco, AWS's official venue for technical communities), Frontier Tower (SF hub for frontier AI and deep-tech), plus the Stanford, Berkeley and Palo Alto / Menlo Park VC ecosystem.",
};
