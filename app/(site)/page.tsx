import type { Metadata } from 'next';
import Link from 'next/link';
import B from '@/components/B';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import LogoMarquee from '@/components/LogoMarquee';
import HostRequestForm from '@/components/HostRequestForm';
import PlanEventButton from '@/components/PlanEventButton';
import Row from '@/components/EventRow';
import {
  BRIGHT_EVENT_TYPES,
  COHOSTS,
  CONTACT,
  FORMATS,
  LUMA_PROFILE,
  PAST_HIGHLIGHTS,
  PHOTOS,
  SEATS,
  STATS,
  UPCOMING,
} from '@/lib/data';
import { ATTENDEE_NETWORK_DISPLAY, EVENT_COUNT_DISPLAY, MONTHLY_EVENT_PLAN_DISPLAY } from '@/lib/site-metrics';

// The homepage. Originally "Bright mode minimal landing page" from Claude
// Design, promoted here after a preview period at /bright. The previous
// neo-brutalist landing is archived at /v4 (noindexed) rather than deleted,
// in case it's ever worth switching back to.
export const metadata: Metadata = {
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
};

const STAT_BORDER = ['#14141A', '#FFD100', '#14141A'];

// The stats+photos trio the design features — different frames than the
// live page's FEATURED_PHOTOS, so kept local rather than reused.
const STAT_PHOTOS: { src: string; alt: string; caption: { zh: string; en: string } }[] = [
  { src: PHOTOS[2], alt: 'Workshop', caption: { zh: 'Workshop · Prompt to Production 等', en: 'Workshops · Prompt to Production & more' } },
  { src: PHOTOS[4], alt: 'Panel discussion', caption: { zh: 'Founders × VCs · 对谈与社交', en: 'Founders × VCs · conversation + networking' } },
  { src: PHOTOS[7], alt: 'Hackathon judging', caption: { zh: '评审 Demo · Bay Builders Hackathon', en: 'Judged demos · Bay Builders Hackathon' } },
];

export default function Landing() {
  return (
    <div className="page-bright" id="top">
      <SiteNav />

      {/* ---- hero ---- */}
      <section style={{ padding: '72px 28px 76px' }}>
        <div
          className="hero-grid"
          style={{
            maxWidth: 'var(--wrap)',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(360px,1fr))',
            gap: 52,
            alignItems: 'center',
          }}
        >
          <div>
            <p className="eyebrow" style={{ marginBottom: 18 }}>
              <B zh="AI BUILDER 社区 · 创始人 · BUILDER · 投资人" en="AI builder community · founders · builders · investors" />
            </p>

            <h1 style={{ margin: 0, fontSize: 'clamp(46px,5.6vw,74px)', fontWeight: 700, letterSpacing: '-.035em', lineHeight: 1.02, textWrap: 'balance' }}>
              <span className="en">
                Host an event in
                <br />
                <em
                  style={{
                    fontStyle: 'normal',
                    background: 'linear-gradient(180deg,transparent 60%,var(--accent) 60%)',
                    padding: '0 6px',
                    margin: '0 -6px',
                  }}
                >
                  Silicon Valley
                </em>
              </span>
              <span className="zh zh-display" style={{ fontWeight: 900, letterSpacing: '.01em' }}>
                把你的活动
                <br />
                <em
                  style={{
                    fontStyle: 'normal',
                    background: 'linear-gradient(180deg,transparent 60%,var(--accent) 60%)',
                    padding: '0 6px',
                    margin: '0 -6px',
                  }}
                >
                  办进硅谷
                </em>
              </span>
            </h1>

            <p style={{ margin: '22px 0 0', fontSize: 17, lineHeight: 1.65, color: 'var(--ink-3)', maxWidth: '47ch' }}>
              <B
                zh={`自 2025 年 1 月以来已办 ${EVENT_COUNT_DISPLAY} 场活动，连接 ${ATTENDEE_NETWORK_DISPLAY} 到场者网络。你带想法来，我们把房间与流程搭起来。`}
                en={`${EVENT_COUNT_DISPLAY} events since Jan 2025. A ${ATTENDEE_NETWORK_DISPLAY} attendee network of founders, builders and investors. You bring the idea; we build the room and the run of show.`}
              />
            </p>

            <HostRequestForm eventTypes={BRIGHT_EVENT_TYPES} />
          </div>

          <div className="hero-collage">
            <div className="hero-collage-main">
              <div className="hero-collage-frame">
                <img
                  src={PHOTOS[0]}
                  alt="Agentic AI Hackathon crowd"
                  style={{ width: '100%', height: 340, objectFit: 'cover', borderRadius: 12, display: 'block' }}
                />
                {/* Overlaps the image itself, not the caption below — see the
                    .hero-collage-frame/-sub comment in globals.css. */}
                <div className="hero-collage-sub">
                  <img src={PHOTOS[1]} alt="Demo day stage" style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 10, display: 'block' }} />
                </div>
              </div>
              <p style={{ margin: '52px 4px 0', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-5)' }}>
                <B zh={`自 2025 年 1 月以来 · ${EVENT_COUNT_DISPLAY} 场活动`} en={`${EVENT_COUNT_DISPLAY} events since Jan 2025`} />
              </p>
            </div>
            <div className="floaty" style={{ top: 26, right: 2, background: 'var(--accent)', borderColor: 'var(--accent-ink)' }}>
              {ATTENDEE_NETWORK_DISPLAY} <span style={{ fontWeight: 500 }}><B zh="到场者网络" en="attendee network" /></span>
            </div>
            <div className="floaty" style={{ bottom: 34, right: '10%', animationDelay: '-3s', animationDuration: '8s' }}>
              {MONTHLY_EVENT_PLAN_DISPLAY} <span style={{ fontWeight: 500, color: 'var(--ink-4)' }}><B zh="每月计划活动" en="events planned monthly" /></span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- logo wall ---- */}
      <section className="section-flush section-first" style={{ padding: '40px 0 56px', borderTop: '1px solid var(--line)' }}>
        <div className="wrap">
          <p className="eyebrow"><B zh="到场记录" en="The room" /></p>
          <h2 className="h-sec"><B zh="谁来过我们的活动" en="Who shows up" /></h2>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--ink-5)', maxWidth: '70ch' }}>
            <B
              zh="往期 2%Tech 活动到场人员所属公司（每场不同）。我们的目标是把这些人持续留在同一个网络里。"
              en="Companies whose people attended past 2%Tech events, and it varies by event. Our goal is to keep those people in one network, not just one room."
            />
          </p>
        </div>

        <LogoMarquee />

        <div className="wrap" style={{ marginTop: 16 }}>
          <p className="fine">
            <B zh="以上为往期到场公司名录，不代表其对 2%Tech 或任何单场活动的赞助或背书。" en="Historical attendance roster. This is not sponsorship or endorsement of 2%Tech or any event." />
          </p>
          <p style={{ margin: '10px 0 0', fontSize: 13.5, color: 'var(--ink-4)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--ink)', fontWeight: 600 }}><B zh="共办社区与场地：" en="Co-host communities & venues:" /></strong> {COHOSTS}
          </p>
        </div>
      </section>

      {/* ---- what we host ---- */}
      <section className="section" id="products">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow"><B zh="我们承办的形式" en="What we host" /></p>
          <h2 className="h-sec" style={{ marginBottom: 26 }}><B zh="从黑客松到私享晚宴" en="From hackathons to private dinners" /></h2>

          <div className="format-grid">
            {FORMATS.map((f, i) => (
              <div key={f.id} className={`format-card${i === 0 ? ' featured' : ''}`}>
                <span className="format-card-n">{String(i + 1).padStart(2, '0')}</span>
                <h3><B zh={f.zh} en={f.en} /></h3>
                <p><B zh={f.desc.zh} en={f.desc.en} /></p>
                <Link href={`/host/${f.id}`} className="format-card-link">
                  <B zh="查看详情 →" en="View details →" />
                </Link>
              </div>
            ))}
          </div>

          <div className="custom-event-cta">
            <div>
              <p className="eyebrow"><B zh="不止这六种" en="Beyond the list" /></p>
              <h3><B zh="没看到你的活动？把想法带来，我们来设计这个房间。" en="Not seeing your event? Bring us the idea—we’ll design the room." /></h3>
            </div>
            <div className="custom-event-actions">
              <PlanEventButton
                custom
                className="btn btn-dark"
                label={{ zh: '规划自定义活动', en: 'Plan a custom event' }}
              />
              <Link href="/host/apply" className="btn btn-ghost">
                <B zh="填写完整简报" en="Start the full brief" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- stats + photos ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
            {STATS.map((s, i) => (
              <div key={s.display} style={{ borderTop: `3px solid ${STAT_BORDER[i % STAT_BORDER.length]}`, paddingTop: 18 }}>
                <span className="serif-num" style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '-.04em', fontSize: 64 }}>
                  {s.display}
                </span>
                <span className="mono-label" style={{ display: 'block', marginTop: 8 }}>
                  <B zh={s.zh} en={s.en} />
                </span>
              </div>
            ))}
          </div>

          <p className="fine" style={{ marginTop: 18, fontSize: 12.5 }}>
            <span className="en">
              Operating figures since January 2025. Browse the public event archive on our{' '}
              <a href={LUMA_PROFILE} target="_blank" rel="noopener noreferrer">Luma profile</a>.
            </span>
            <span className="zh">
              自 2025 年 1 月以来的运营数据。活动记录可在公开{' '}
              <a href={LUMA_PROFILE} target="_blank" rel="noopener noreferrer">Luma 主页</a>查看。
            </span>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14, marginTop: 40 }}>
            {STAT_PHOTOS.map((p) => (
              <div key={p.src} style={{ background: 'var(--white)', border: '1px solid var(--line-3)', borderRadius: 18, padding: '10px 10px 12px' }}>
                <img src={p.src} alt={p.alt} loading="lazy" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 10, display: 'block' }} />
                <p style={{ margin: '10px 4px 0', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-5)' }}>
                  <B zh={p.caption.zh} en={p.caption.en} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- calendar ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow"><B zh="活动" en="Calendar" /></p>
          <h2 className="h-sec" style={{ marginBottom: 28 }}><B zh="接下来 & 刚办完" en="Coming up & just wrapped" /></h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 44 }}>
            <div>
              <p className="tl-head"><B zh="接下来" en="Upcoming" /></p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {UPCOMING.map((e) => (
                  <Row key={`${e.date}-${e.name}`} e={e} />
                ))}
              </div>
            </div>

            <div>
              <p className="tl-head"><B zh="过往精选 · 2026 年（另有标注）" en="Recent highlights · 2026 unless noted" /></p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {PAST_HIGHLIGHTS.map((e) => (
                  <Row key={`${e.date}-${e.name}-${e.registered}`} e={e} />
                ))}
              </div>
            </div>
          </div>

          <p className="fine" style={{ marginTop: 22, fontSize: 12.5 }}>
            <span className="en">
              Browse our public event archive on <a href={LUMA_PROFILE} target="_blank" rel="noopener noreferrer">Luma</a>.
            </span>
            <span className="zh">
              在 <a href={LUMA_PROFILE} target="_blank" rel="noopener noreferrer">Luma 主页</a>查看公开活动记录。
            </span>
          </p>
        </div>
      </section>

      {/* ---- saved seats ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow"><B zh="虚位以待" en="Saved seats" /></p>
          <h2 className="h-sec"><B zh="我们想请进房间的下一批" en="Who we want in the room next" /></h2>
          <p className="body" style={{ margin: '10px 0 24px', maxWidth: '64ch' }}>
            <B
              zh="斯坦福黑客松的评审席、独立赛道与冠名档，我们正在为下面这些团队留位置。在名单上看到自己？位子是你的。"
              en="Judge chairs, tracks and the title slot at the Stanford hackathon. We're saving seats for the teams below. See your logo? The seat's yours."
            />
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: 12 }}>
            {SEATS.map((s, i) => (
              <div
                key={i}
                style={{
                  border: '1.5px dashed var(--line-5)',
                  borderRadius: 16,
                  minHeight: 96,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                  padding: '16px 12px',
                  textAlign: 'center',
                  background: 'var(--white)',
                }}
              >
                <span className="mono-label" style={{ fontSize: 10, letterSpacing: '.2em' }}><B zh="预留" en="Reserved" /></span>
                <span style={{ fontWeight: 700, fontSize: 15.5, letterSpacing: '-.01em' }}>
                  {'name' in s ? s.name : <B zh={s.zh} en={s.en} />}
                </span>
              </div>
            ))}

            <a
              href="/sponsor/apply"
              style={{
                border: '1.5px solid var(--accent-ink)',
                borderRadius: 16,
                minHeight: 96,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                padding: '16px 12px',
                textAlign: 'center',
                textDecoration: 'none',
                background: 'var(--accent)',
                boxShadow: '0 14px 34px -16px rgba(20,20,26,.4)',
              }}
            >
              <span className="mono-label" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--accent-ink)' }}><B zh="这一格是空的" en="This one's open" /></span>
              <span style={{ fontWeight: 800, fontSize: 15.5, letterSpacing: '-.01em', color: 'var(--accent-ink)' }}><B zh="你的品牌 →" en="Your logo →" /></span>
            </a>
          </div>

          <p className="fine" style={{ marginTop: 14 }}>
            <B zh="这是我们的目标名单，非已确认赞助方。名单上的公司与 2%Tech 尚无合作关系。" en="This is our target list, not confirmed sponsors. Companies named here have no existing relationship with 2%Tech." />
          </p>
        </div>
      </section>

      {/* ---- closing CTA ---- */}
      <section style={{ padding: '26px 28px 64px' }}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            maxWidth: 'var(--wrap)',
            margin: '0 auto',
            borderRadius: 28,
            border: '1px solid var(--accent-ink)',
            background: 'var(--accent)',
            padding: '56px 32px',
            textAlign: 'center',
          }}
        >
          <p className="eyebrow" style={{ marginBottom: 10, color: 'var(--accent-ink)' }}><B zh="赞助" en="Sponsor" /></p>

          <h2 style={{ margin: '0 auto', maxWidth: '26ch', fontSize: 'clamp(28px,3.6vw,42px)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.1, textWrap: 'balance' }}>
            <span className="en">Put your brand in the room where builders build.</span>
            <span className="zh" style={{ fontWeight: 900, letterSpacing: '.01em' }}>把你的品牌放进 Builder 的房间。</span>
          </h2>

          <p style={{ margin: '16px auto 0', maxWidth: '58ch', fontSize: 15.5, lineHeight: 1.65, color: 'var(--ink-2)' }}>
            <B
              zh={`冠名、评审席、独立赛道与 Demo 展位——覆盖黑客松、工作坊、圆桌与私享晚宴。自 2025 年 1 月以来已办 ${EVENT_COUNT_DISPLAY} 场活动，并连接 ${ATTENDEE_NETWORK_DISPLAY} 到场者网络。`}
              en={`Title slots, judge chairs, tracks and demo tables across hackathons, workshops, panels and private dinners. Since January 2025: ${EVENT_COUNT_DISPLAY} events and a ${ATTENDEE_NETWORK_DISPLAY} attendee network.`}
            />
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 26 }}>
            <a href="/sponsor/apply" className="btn btn-dark">
              <B zh="申请赞助 →" en="Apply to sponsor →" />
            </a>
            <a href="/sponsor" className="btn btn-ghost">
              <B zh="看赞助方案" en="Read the prospectus" />
            </a>
            <a href="#top" className="btn btn-ghost">
              <B zh="我想办活动 ↑" en="I want to host ↑" />
            </a>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 36px', justifyContent: 'center', marginTop: 34, fontSize: 13.5 }}>
            <span>
              <span className="mono-label" style={{ fontSize: 11, letterSpacing: '.14em', color: 'var(--accent-ink)' }}>Email</span>{' '}
              <a href={`mailto:${CONTACT.email}`} style={{ fontWeight: 600 }}>{CONTACT.email}</a>
            </span>
            <span>
              <span className="mono-label" style={{ fontSize: 11, letterSpacing: '.14em', color: 'var(--accent-ink)' }}>WeChat</span>{' '}
              <span className="tbd"><B zh={CONTACT.wechat.zh} en={CONTACT.wechat.en} /></span>
            </span>
            <span>
              <span className="mono-label" style={{ fontSize: 11, letterSpacing: '.14em', color: 'var(--accent-ink)' }}>Luma</span>{' '}
              <a href={LUMA_PROFILE} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                luma.com/user/usr-imLXdlHS1TlvX7X
              </a>
            </span>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
