import type { Metadata } from 'next';
import Link from 'next/link';
import B from '@/components/B';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import Gallery from '@/components/Gallery';
import DraftBanner from '@/components/DraftBanner';
import SponsorPrint from '@/components/SponsorPrint';
import { COMPANIES, CONTACT, LUMA_PROFILE, PAST, PHOTOS, UPCOMING, logoOf, type Bi } from '@/lib/data';
import { CAMPAIGN, CAMPAIGN_ARGUMENT, CAMPAIGN_HEADLINE } from '@/lib/blueprint';
import {
  DELIVERABLES,
  EVENT_META,
  FAQ,
  FUNNEL,
  LINEUP,
  LINEUP_MORE,
  NETWORK_STATS,
  PACKAGES,
  PACKAGE_NOTES,
  PRIZES,
  VENUES,
} from '@/lib/sponsor-data';

export const metadata: Metadata = {
  title: 'Sponsorship · Hackathon @ Stanford — 2% Tech',
  description:
    'One day. One room. Sponsorship packages for the 2% Tech one-day hackathon at Stanford, August 2026. 斯坦福单日黑客松赞助方案。',
};

const bi = (v: Bi | string) => (typeof v === 'string' ? v : <B zh={v.zh} en={v.en} />);

/** The 10 most recent past events are always shown; the other 15 sit in a
    <details>, which SponsorPrint force-opens before printing. */
const PAST_HEAD = PAST.slice(0, 10);
const PAST_TAIL = PAST.slice(10);

function EventLine({ e }: { e: (typeof PAST)[number] }) {
  return (
    <div className="tl-row">
      <span className="tl-d">{e.date}</span>
      <span className="tl-n">
        {e.url ? (
          <a href={e.url} target="_blank" rel="noopener noreferrer">
            {e.name}
          </a>
        ) : (
          <strong>{e.name}</strong>
        )}
        {e.registered != null && <span className="tl-reg"> · {e.registered.toLocaleString('en-US')}</span>}
        {e.note && (
          <span className="tl-reg">
            {' '}
            <B zh={e.note.zh} en={e.note.en} />
          </span>
        )}
      </span>
    </div>
  );
}

export default function Sponsor() {
  return (
    <div id="top">
      <DraftBanner />
      <SiteNav variant="sponsor" />
      <SponsorPrint />

      {/* ---- hero ---- */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '56px 28px 48px' }}>
        <div
          className="blob"
          style={{ width: 520, height: 520, background: 'radial-gradient(circle,oklch(0.9 0.09 310),transparent 65%)', top: -180, left: -120, opacity: 0.6 }}
        />
        <div
          className="blob"
          style={{ width: 480, height: 480, background: 'radial-gradient(circle,oklch(0.93 0.08 55),transparent 65%)', top: '10%', right: -160, opacity: 0.55, animationDuration: '34s' }}
        />

        <div className="wrap" style={{ position: 'relative', zIndex: 1, padding: 0 }}>
          <p className="eyebrow">
            <B zh="2% TECH · 赞助方案" en="2% Tech · Sponsorship Prospectus" />
          </p>

          <h1 className="h-page" style={{ maxWidth: '18ch' }}>
            Hackathon{' '}
            <em className="serif grad" style={{ fontSize: '1.06em' }}>
              @ Stanford
            </em>
          </h1>
          <p className="mono-label" style={{ marginTop: 12 }}>
            2% Tech · August 2026
          </p>

          <div className="grid-auto" style={{ marginTop: 30 }}>
            {EVENT_META.map((m, i) => (
              <div key={i} style={{ borderLeft: '1px solid var(--line-3)', paddingLeft: 18 }}>
                <span className="mono-label" style={{ display: 'block', fontSize: 10 }}>
                  {bi(m.label)}
                </span>
                <span style={{ display: 'block', marginTop: 6, fontWeight: 600, fontSize: 15 }}>
                  {m.tbd ? <span className="tbd">{bi(m.value)}</span> : bi(m.value)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 30 }}>
            <Link href="/sponsor/apply" className="btn btn-dark">
              <B zh="申请赞助 →" en="Apply to sponsor →" />
            </Link>
            <a href="#tiers" className="btn btn-ghost">
              <B zh="查看合作套餐" en="See the packages" />
            </a>
          </div>
        </div>
      </section>

      {/* ---- the pitch ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow">
            <B zh="这场活动" en="The pitch" />
          </p>
          <h2 className="h-sec">
            <B zh="一天，一个房间，湾区最难约到的那批人" en="One day. One room. The people you can't get a meeting with." />
          </h2>
          <div className="prose" style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="lead">
              <B
                zh="2% Tech 在湾区做 AI 社区活动——创始人、工程师、研究员、投资人，同一个房间。"
                en="2% Tech runs AI community events across the Bay Area — founders, engineers, researchers and investors, one room."
              />
            </p>
            <p className="body">
              <B
                zh="赞助这场不是买 logo 位，是买六个小时——一屋子 builder 当天就要决定，用谁的模型、谁的 API 把东西跑起来。"
                en="Sponsoring this isn't a logo slot. It's six hours with a room of builders deciding, that day, whose model and whose API they ship on."
              />
            </p>
            <p className="body">
              {bi(CAMPAIGN_ARGUMENT)}
            </p>
          </div>
        </div>
      </section>

      {/* ---- the campaign, not the room (blueprint §5) ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow">
            <B zh="你买的是什么" en="What you're buying" />
          </p>
          <h2 className="h-sec" style={{ maxWidth: '26ch' }}>
            {bi(CAMPAIGN_HEADLINE)}
          </h2>
          <p className="body prose" style={{ margin: '12px 0 26px' }}>
            <B
              zh="现场只有一天，但围绕它的内容与分发会持续数周。下面是三个阶段各自交付的东西。"
              en="The room lasts a day; the content and distribution around it run for weeks. Here is what each phase delivers."
            />
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
            {CAMPAIGN.map((c) => (
              <div key={c.phase.en} className="card" style={{ borderRadius: 22 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span className="mono-label" style={{ fontSize: 11, color: 'var(--violet-deep)' }}>
                    {bi(c.phase)}
                  </span>
                  <em className="fine" style={{ fontStyle: 'normal' }}>
                    {bi(c.sub)}
                  </em>
                </div>
                <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {c.items.map((it, i) => (
                    <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13.5, lineHeight: 1.5 }}>
                      <span aria-hidden="true" style={{ color: 'var(--violet-deep)' }}>
                        ✓
                      </span>
                      <span>{bi(it)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- who's in the room ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow">
            <B zh="谁在场" en="The room" />
          </p>
          <h2 className="h-sec">
            <B zh="谁在场" en="Who's in the room" />
          </h2>
          <p className="mono-label" style={{ marginTop: 16 }}>
            <B zh="2% Tech 社区累计" en="Across the 2% Tech network to date" />
          </p>

          <div className="grid-auto" style={{ marginTop: 14 }}>
            {NETWORK_STATS.map((s) => (
              <div key={s.display} style={{ borderLeft: '1px solid var(--line-3)', paddingLeft: 20 }}>
                <span className="serif-num" style={{ fontSize: 48 }}>
                  {s.display}
                </span>
                <span className="mono-label" style={{ display: 'block', marginTop: 8 }}>
                  <B zh={s.label.zh} en={s.label.en} />
                </span>
              </div>
            ))}
          </div>

          {/* Cumulative-vs-this-event distinction. Keep it adjacent to the numbers. */}
          <p className="small" style={{ margin: '16px 0 32px' }}>
            <span className="zh">
              以上为 2% Tech 社区累计数据，非单场规模。<strong>本场为斯坦福单日制，预计参赛规模 150–200 人。</strong>
            </span>
            <span className="en">
              Figures above are cumulative across the 2% Tech community, not a single event.{' '}
              <strong>This one is a single day at Stanford — 150–200 expected.</strong>
            </span>
          </p>

          <p className="body" style={{ marginBottom: 16 }}>
            <B
              zh="往期 2% Tech 活动中出现过的公司（每场不同）："
              en="Companies represented at past 2% Tech events (varies by event):"
            />
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
            {COMPANIES.map((c) => (
              <a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}
              >
                <span
                  style={{
                    background: logoOf(c.id).tile,
                    borderRadius: 12,
                    border: '1px solid var(--line-2)',
                    height: 62,
                    display: 'grid',
                    placeItems: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {logoOf(c.id).src && (
                    <img
                      src={logoOf(c.id).src}
                      alt={`${c.name} logo`}
                      loading="lazy"
                      style={{ maxWidth: '58%', maxHeight: 30, objectFit: 'contain' }}
                    />
                  )}
                </span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</span>
                <span className="small" style={{ fontSize: 12.5, lineHeight: 1.55 }}>
                  <B zh={c.desc.zh} en={c.desc.en} />
                </span>
              </a>
            ))}
          </div>

          <p className="fine" style={{ marginTop: 14 }}>
            <B
              zh="以上为往期到场公司名录，非本场确认参与方，亦不代表其对本场活动的赞助或背书。本场阵容确认后替换。"
              en="Above is the historical attendance roster. These companies are not confirmed participants in this event and this does not imply sponsorship or endorsement. To be replaced once this event's lineup is locked."
            />
          </p>
        </div>
      </section>

      {/* ---- the funnel ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow">
            <B zh="转化路径" en="The funnel" />
          </p>
          <h2 className="h-sec">
            <B zh="你的产品这一天怎么被用起来" en="How your product gets used that day" />
          </h2>
          <p className="body prose" style={{ margin: '10px 0 24px' }}>
            <B
              zh="高亮行是赞助方直接参与的节点。这不是 logo 版位图，是一条从「领到 key」到「跑出项目」的路径。当天流程为拟定版。"
              en="Highlighted rows are where sponsors take part. This isn't a logo placement map — it's the path from handing out a key to shipping a project on it. Day schedule is a draft."
            />
          </p>

          <div className="stack">
            {FUNNEL.map((phase, pi) => (
              <div key={pi} style={{ marginTop: pi ? 18 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
                  <span className="mono-label" style={{ color: 'var(--violet-deep)', fontSize: 11 }}>
                    {bi(phase.phase)}
                  </span>
                  <em className="fine" style={{ fontStyle: 'normal' }}>
                    {bi(phase.sub)}
                  </em>
                </div>

                <div className="stack" style={{ gap: 6 }}>
                  {phase.rows.map((r, ri) => (
                    <div
                      key={ri}
                      className="card-sm"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(84px,110px) 1fr',
                        gap: 14,
                        alignItems: 'start',
                        background: r.sp ? 'linear-gradient(120deg,var(--tint-violet-soft),var(--tint-amber-soft))' : '#fff',
                        border: `1px solid ${r.sp ? 'oklch(0.88 0.05 300)' : 'var(--line-2)'}`,
                      }}
                    >
                      <span className="tl-d" style={{ paddingTop: 2 }}>
                        {bi(r.t)}
                      </span>
                      <span>
                        <span style={{ fontSize: 14.5, fontWeight: r.sp ? 600 : 400, lineHeight: 1.5 }}>{bi(r.text)}</span>
                        {r.pt && (
                          <span
                            className="badge badge-contacted"
                            style={{ marginLeft: 8, fontSize: 10, padding: '3px 9px', verticalAlign: 'middle' }}
                          >
                            {bi(r.pt)}
                          </span>
                        )}
                        {r.who && (
                          <span className="fine" style={{ display: 'block', marginTop: 5, fontSize: 12.5 }}>
                            {bi(r.who)}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- packages ---- */}
      <section className="section" id="tiers">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow">
            <B zh="合作套餐" en="Packages" />
          </p>
          <h2 className="h-sec">
            <B zh="黑客松合作套餐" en="Hackathon partnership packages" />
          </h2>
          <p className="body prose" style={{ margin: '10px 0 26px' }}>
            <B
              zh="三种参与方式，从加入一场更大的社区活动，到办一场完全属于你的专场。奖池由品牌方单独出资，餐饮与付费场地另行计费。"
              en="Three ways in, from joining a larger community event to running one built entirely around your brand. The prize pool is funded separately by you; catering and paid venue costs are billed separately."
            />
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 16, alignItems: 'start' }}>
            {PACKAGES.map((p) => (
              <div
                key={p.name.en}
                className="pkg card"
                style={{
                  position: 'relative',
                  borderRadius: 24,
                  padding: 24,
                  border: p.feature ? '1.5px solid var(--ink)' : '1px solid var(--line-2)',
                  background: p.feature ? 'linear-gradient(150deg,var(--tint-violet-soft),var(--tint-amber-soft))' : '#fff',
                  boxShadow: p.feature ? '0 20px 50px -26px rgba(96,72,150,.5)' : 'none',
                }}
              >
                {p.flag && (
                  <span className="badge badge-new" style={{ position: 'absolute', top: -11, left: 20 }}>
                    {bi(p.flag)}
                  </span>
                )}
                <h3 style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-.01em' }}>{bi(p.name)}</h3>
                <p className="small" style={{ margin: '8px 0 16px', fontSize: 13 }}>
                  {bi(p.for)}
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.items.map((it, i) => (
                    <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13.5, lineHeight: 1.5 }}>
                      <span aria-hidden="true" style={{ color: 'var(--violet-deep)' }}>
                        ✓
                      </span>
                      <span>{bi(it)}</span>
                    </li>
                  ))}
                </ul>
                <span className="mono-label" style={{ display: 'block', marginTop: 18, fontSize: 10 }}>
                  {bi(p.format)}
                </span>
                {/* Deep-links with this package already ticked on the form. */}
                <Link
                  href={`/sponsor/apply?package=${p.id}`}
                  className={`btn btn-sm ${p.feature ? 'btn-dark' : 'btn-ghost'}`}
                  style={{ marginTop: 14, width: '100%' }}
                >
                  <B zh="申请这个套餐 →" en="Apply for this →" />
                </Link>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: 24, borderRadius: 20 }}>
            <h3 className="h-sub" style={{ fontSize: 16 }}>
              <B zh="重要说明" en="Important notes" />
            </h3>
            <ul style={{ margin: '12px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {PACKAGE_NOTES.map((n, i) => (
                <li key={i} className="small" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                  {bi(n)}
                </li>
              ))}
            </ul>
          </div>

          <p className="fine" style={{ marginTop: 14 }}>
            <B
              zh="价格不在此页，我们当面谈——套餐与加购的组合差别很大。"
              en="Pricing isn't on this page — we'd rather talk it through, since package and add-on combinations vary a lot."
            />
          </p>
        </div>
      </section>

      {/* ---- what you get back ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow">
            <B zh="赛后" en="Afterwards" />
          </p>
          <h2 className="h-sec">
            <B zh="你会拿到什么" en="What you actually get back" />
          </h2>
          <p className="body prose" style={{ margin: '10px 0 22px' }}>
            <B
              zh="每个套餐都含一封 recap 邮件加一个公开页面，内容全部来自报名表与提交表的导出，不需要额外生产。更深的效果报告、专访与内容分发是旗舰专场额外提供的部分。"
              en="Every package includes a recap email and a public page, all of it exported straight from the signup and submission forms — nothing has to be produced from scratch. Deeper impact reporting, interviews and content distribution are what the Flagship package adds on top."
            />
          </p>
          <div className="grid-auto">
            {DELIVERABLES.map((d) => (
              <div key={d.h.en} className="card">
                <h3 style={{ fontSize: 15.5, fontWeight: 700 }}>{bi(d.h)}</h3>
                <p className="small" style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.55 }}>
                  {bi(d.p)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- prizes ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow">
            <B zh="奖项" en="Prizes" />
          </p>
          <h2 className="h-sec">
            <B zh="冠名奖项怎么运作" en="How named prizes work" />
          </h2>
          <p className="body prose" style={{ margin: '10px 0 22px' }}>
            <B
              zh="奖项以你的产品命名，由你的人上台颁发，获奖项目当天就是用你的东西搭的。奖金与额度由设奖方自定。"
              en="The prize carries your product's name, your team presents it on stage, and the winning project was built on your stack that day. Amounts are set by the sponsor."
            />
          </p>
          <div className="grid-auto">
            {PRIZES.map((p) => (
              <div key={p.h.en} className="card">
                <h3 style={{ fontSize: 15.5, fontWeight: 700 }}>{bi(p.h)}</h3>
                <p className="small" style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.55 }}>
                  {bi(p.p)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- track record ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow">
            <B zh="过往记录" en="Track record" />
          </p>
          <h2 className="h-sec">
            <B zh="我们的办活动节奏" en="We run these constantly" />
          </h2>
          <p className="body prose" style={{ margin: '10px 0 24px' }}>
            <B zh="共 31 场：6 场即将举行，25 场已结束。" en="31 events in total — 6 upcoming, 25 already run." />
          </p>

          <p className="tl-head">
            <B zh="即将举行 · 6 场 · 由近及远" en="Upcoming · 6 · soonest first" />
          </p>
          <div>
            {UPCOMING.map((e) =>
              e.highlight ? (
                <div key={e.name} className="tl-hi">
                  <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr', gap: 12, alignItems: 'start' }}>
                    <span className="tbd" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                      <B zh="8月底" en="Late Aug" />
                    </span>
                    <span style={{ fontSize: 14.5, lineHeight: 1.5 }}>
                      <strong>
                        <B zh="本场 · Hackathon @ Stanford" en="This event · Hackathon @ Stanford" />
                      </strong>
                      <span className="tl-reg">
                        {' '}
                        <B zh="· 招商中" en="· sponsorship open" />
                      </span>
                    </span>
                  </div>
                </div>
              ) : (
                <EventLine key={`${e.date}-${e.name}`} e={e} />
              ),
            )}
          </div>

          <p className="tl-head" style={{ marginTop: 30 }}>
            <B zh="已结束 · 25 场 · 按报名人数排序" en="Already run · 25 · by registrations" />
          </p>
          <div>
            {PAST_HEAD.map((e) => (
              <EventLine key={`${e.date}-${e.name}-${e.registered}`} e={e} />
            ))}
          </div>

          <details className="more">
            <summary>
              <B zh={`展开其余 ${PAST_TAIL.length} 场`} en={`View the other ${PAST_TAIL.length}`} />
            </summary>
            <div>
              {PAST_TAIL.map((e) => (
                <EventLine key={`${e.date}-${e.name}-${e.registered}`} e={e} />
              ))}
            </div>
          </details>

          <p className="small" style={{ marginTop: 18 }}>
            {bi(VENUES)}
          </p>
          <p className="fine" style={{ marginTop: 10 }}>
            <span className="en">
              Every one of them is on our{' '}
              <a href={LUMA_PROFILE} target="_blank" rel="noopener noreferrer">
                Luma profile
              </a>
              ; registration counts come straight from Luma.
            </span>
            <span className="zh">
              每一场都在{' '}
              <a href={LUMA_PROFILE} target="_blank" rel="noopener noreferrer">
                Luma 主页
              </a>
              ，报名人数为 Luma 实时数据。
            </span>
          </p>
        </div>
      </section>

      {/* ---- lineup ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow">
            <B zh="阵容" en="Lineup" />
          </p>
          <h2 className="h-sec">
            <B zh="坐在评审席上的是这批人" en="The people who sit on the judging table" />
          </h2>
          <p className="body prose" style={{ margin: '10px 0 22px' }}>
            <span className="zh">
              以下为近期合作活动的评委与导师班底。<strong>本场阵容确认中</strong>，确认后替换为本场名单。
            </span>
            <span className="en">
              Below is the judging and mentoring bench from recent events across our network.{' '}
              <strong>This event&apos;s lineup is being confirmed</strong> and will replace it once locked.
            </span>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
            {LINEUP.map((p) => (
              <div key={p.name} className="card" style={{ padding: 16 }}>
                <span className="mono-label" style={{ fontSize: 10, color: 'var(--violet-deep)' }}>
                  {bi(p.slot)}
                </span>
                <span style={{ display: 'block', marginTop: 6, fontWeight: 700, fontSize: 15 }}>{p.name}</span>
                <span className="small" style={{ display: 'block', marginTop: 3, fontSize: 12.5 }}>
                  {p.role}
                </span>
              </div>
            ))}
          </div>

          <details className="more">
            <summary>
              <B
                zh={`展开其余 ${LINEUP_MORE.length} 位评委、主办与志愿者`}
                en={`View the other ${LINEUP_MORE.length} judges, hosts and volunteers`}
              />
            </summary>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12, marginTop: 12 }}>
              {LINEUP_MORE.map((p) => (
                <div key={p.name} className="card" style={{ padding: 16 }}>
                  <span className="mono-label" style={{ fontSize: 10, color: 'var(--violet-deep)' }}>
                    {bi(p.slot)}
                  </span>
                  <span style={{ display: 'block', marginTop: 6, fontWeight: 700, fontSize: 15 }}>{p.name}</span>
                  <span className="small" style={{ display: 'block', marginTop: 3, fontSize: 12.5 }}>
                    {p.role}
                  </span>
                </div>
              ))}
            </div>
          </details>

          {/* Load-bearing disclaimer — see the note at the top of sponsor-data.ts. */}
          <p className="fine" style={{ marginTop: 14 }}>
            <B
              zh={`名单取自近期合作场次的实际评委、主办与志愿者阵容，共 ${LINEUP.length + LINEUP_MORE.length} 位，非本场已确认出席人员。本场名单确认后更新。`}
              en={`The full roster of ${LINEUP.length + LINEUP_MORE.length} judges, hosts and volunteers from recent partner events. Not a confirmed attendance list for this event; it will be updated once this event's lineup is set.`}
            />
          </p>
        </div>
      </section>

      {/* ---- gallery ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow">
            <B zh="现场" en="On the ground" />
          </p>
          <h2 className="h-sec">
            <B zh="房间实际长什么样" en="What the room actually looks like" />
          </h2>
          <p className="body prose" style={{ margin: '10px 0 22px' }}>
            <B
              zh="往期活动现场，摄于 AWS Builder Loft、Frontier Tower 及湾区其他场地。"
              en="From past events at AWS Builder Loft, Frontier Tower and other Bay Area venues."
            />
          </p>
          <Gallery photos={PHOTOS} visible={8} />
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow">FAQ</p>
          <h2 className="h-sec" style={{ marginBottom: 18 }}>
            <B zh="常见问题" en="Questions we always get" />
          </h2>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q.en}>
                <summary>{bi(f.q)}</summary>
                <p>
                  {bi(f.a)}
                  {f.tbd && <span className="tbd">{bi(f.tbd)}</span>}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---- closing CTA ---- */}
      <section id="contact" style={{ padding: '26px 28px 64px' }}>
        <div
          style={{
            maxWidth: 'var(--wrap)',
            margin: '0 auto',
            borderRadius: 28,
            border: '1px solid var(--line-2)',
            background: 'linear-gradient(120deg,var(--tint-violet),var(--tint-amber) 50%,var(--tint-blue))',
            padding: '52px 32px',
            textAlign: 'center',
          }}
        >
          <p className="eyebrow" style={{ marginBottom: 10 }}>
            <B zh="下一步" en="Next step" />
          </p>
          <h2 style={{ margin: '0 auto', maxWidth: '24ch', fontSize: 'clamp(26px,3.4vw,38px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.12 }}>
            <span className="en">
              There is one <em className="serif">Exclusive</em> slot per event
            </span>
            <span className="zh zh-display">独家专场每场只有一个名额</span>
          </h2>
          <p className="lead" style={{ margin: '16px auto 0', maxWidth: '54ch' }}>
            <B
              zh="价格我们当面谈。15 分钟，告诉我们你今年的指标是什么，我们按结果倒推该选哪个套餐。"
              en="We talk pricing in person. Give us 15 minutes, tell us what you're measured on this year, and we'll work backwards to the package that gets you there."
            />
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 26 }}>
            <Link href="/sponsor/apply" className="btn btn-dark">
              <B zh="申请赞助 →" en="Apply to sponsor →" />
            </Link>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 36px', justifyContent: 'center', marginTop: 30, fontSize: 13.5 }}>
            <span>
              <span className="mono-label" style={{ fontSize: 11, letterSpacing: '.14em' }}>
                <B zh="邮箱" en="Email" />
              </span>{' '}
              <span className="tbd">{CONTACT.email}</span>
            </span>
            <span>
              <span className="mono-label" style={{ fontSize: 11, letterSpacing: '.14em' }}>
                <B zh="约 call" en="Calendar" />
              </span>{' '}
              <span className="tbd">{CONTACT.calendar}</span>
            </span>
            <span>
              <span className="mono-label" style={{ fontSize: 11, letterSpacing: '.14em' }}>
                <B zh="主办" en="Organizer" />
              </span>{' '}
              <strong>2% Tech</strong>
            </span>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
