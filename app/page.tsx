import B from '@/components/B';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import HeroThree from '@/components/HeroThree';
import LogoMarquee from '@/components/LogoMarquee';
import HostRequestForm from '@/components/HostRequestForm';
import {
  COHOSTS,
  CONTACT,
  FEATURED_PHOTOS,
  LUMA_PROFILE,
  PAST_HIGHLIGHTS,
  SEATS,
  STATS,
  UPCOMING,
  type EventRow,
} from '@/lib/data';

function Row({ e }: { e: EventRow }) {
  if (e.highlight) {
    // The Stanford hackathon: still undated, still unsold, so it gets pulled
    // out of the list rather than sitting as one line among many.
    return (
      <div className="tl-hi">
        <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr', gap: 12, alignItems: 'start' }}>
          <span className="tbd" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <B zh="8月底" en="LATE AUG" />
          </span>
          <span style={{ fontSize: 14.5, lineHeight: 1.5 }}>
            <strong>{e.name}</strong>
            <br />
            <span className="small" style={{ fontSize: 13 }}>
              {e.note && <B zh={e.note.zh} en={e.note.en} />}{' '}
              <a href="#top" style={{ fontWeight: 600 }}>
                ↑ <B zh="来聊聊" en="Talk to us" />
              </a>
            </span>
          </span>
        </div>
      </div>
    );
  }

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
        {e.registered != null && (
          <span className="tl-reg">
            {' '}
            <B zh={`· ${e.registered.toLocaleString('en-US')} 人报名`} en={`· ${e.registered.toLocaleString('en-US')} registered`} />
          </span>
        )}
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

export default function Landing() {
  return (
    <div id="top">
      <SiteNav />

      {/* ---- hero ---- */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '64px 28px 84px' }}>
        <div
          className="blob"
          style={{
            width: 560,
            height: 560,
            background: 'radial-gradient(circle,oklch(0.9 0.09 310),transparent 65%)',
            top: -160,
            left: -120,
            opacity: 0.65,
          }}
        />
        <div
          className="blob"
          style={{
            width: 520,
            height: 520,
            background: 'radial-gradient(circle,oklch(0.93 0.08 55),transparent 65%)',
            top: '22%',
            right: -140,
            opacity: 0.6,
            animationDuration: '34s',
            animationDirection: 'reverse',
          }}
        />
        <div
          className="blob"
          style={{
            width: 540,
            height: 540,
            background: 'radial-gradient(circle,oklch(0.92 0.07 235),transparent 65%)',
            bottom: -200,
            left: '26%',
            opacity: 0.55,
            animationDuration: '40s',
            filter: 'blur(70px)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 'var(--wrap)',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))',
            gap: 44,
            alignItems: 'center',
          }}
        >
          <div>
            <p className="eyebrow" style={{ marginBottom: 18 }}>
              <B
                zh="AI BUILDER 社区 · 创始人 · BUILDER · 投资人"
                en="AI builder community · founders · builders · investors"
              />
            </p>

            {/* The blueprint's first message on the site, verbatim. */}
            <h1 className="h-hero">
              <span className="en">
                Host an event in
                <br />
                <em className="serif grad" style={{ letterSpacing: 0, fontSize: '1.08em' }}>
                  Silicon Valley
                </em>
              </span>
              <span className="zh zh-display">
                把你的活动
                <br />
                <em className="grad" style={{ fontStyle: 'normal' }}>
                  办进硅谷
                </em>
              </span>
            </h1>

            <p style={{ margin: '20px 0 0', fontSize: 17, lineHeight: 1.65, color: 'var(--ink-3)', maxWidth: '47ch' }}>
              <B
                zh="我们把湾区的创始人、Builder 与投资人放进同一个房间——自 2025 年 1 月以来 25 场活动、6,300+ 报名。你带主题来，房间、内容与后续传播我们来。"
                en="We put the Bay Area's founders, builders and investors in one room — 25 events and 6,300+ registrations since January 2025. Bring the subject; we bring the room, the content and everything that runs after it."
              />
            </p>

            <HostRequestForm />
          </div>

          <div style={{ position: 'relative', height: 540, minWidth: 0 }}>
            <HeroThree />
            <div className="floaty" style={{ top: 36, right: 8 }}>
              6,300+{' '}
              <span style={{ color: 'var(--ink-5)', fontWeight: 500 }}>
                <B zh="报名人次" en="registrations" />
              </span>
            </div>
            <div className="floaty" style={{ bottom: 54, left: 4, animationDelay: '-3s', animationDuration: '8s' }}>
              25{' '}
              <span style={{ color: 'var(--ink-5)', fontWeight: 500 }}>
                <B zh="场活动 · 自 2025.1" en="events since Jan 2025" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- logo wall ---- */}
      <section className="section-flush section-first" style={{ padding: '26px 0 56px' }}>
        <div className="wrap">
          <p className="eyebrow">
            <B zh="到场记录" en="The room" />
          </p>
          <h2 className="h-sec">
            <B zh="谁来过我们的活动" en="Who shows up" />
          </h2>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--ink-5)' }}>
            <B
              zh="往期 2% Tech 活动到场人员所属公司（每场不同）。我们的目标是把这些人持续留在同一个网络里。"
              en="Companies whose people attended past 2% Tech events — varies by event. Our goal is to keep those people in one network, not just one room."
            />
          </p>
        </div>

        <LogoMarquee />

        <div className="wrap" style={{ marginTop: 16 }}>
          <p className="fine">
            <B
              zh="以上为往期到场公司名录，不代表其对 2% Tech 或任何单场活动的赞助或背书。"
              en="Historical attendance roster — not sponsorship or endorsement of 2% Tech or any event."
            />
          </p>
          <p style={{ margin: '10px 0 0', fontSize: 13.5, color: 'var(--ink-4)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>
              <B zh="共办社区与场地：" en="Co-host communities & venues:" />
            </strong>{' '}
            {COHOSTS}
          </p>
        </div>
      </section>

      {/* ---- saved seats ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow">
            <B zh="虚位以待" en="Saved seats" />
          </p>
          <h2 className="h-sec">
            <B zh="我们想请进房间的下一批" en="Who we want in the room next" />
          </h2>
          <p className="body" style={{ margin: '10px 0 24px', maxWidth: '64ch' }}>
            <B
              zh="斯坦福黑客松的评审席、独立赛道与冠名档，我们正在为下面这些团队留位置。在名单上看到自己？位子是你的。"
              en="Judge chairs, tracks and the title slot at the Stanford hackathon — we're saving seats for the teams below. See your logo? The seat's yours."
            />
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: 12 }}>
            {SEATS.map((s, i) => (
              <div
                key={i}
                style={{
                  border: '1.5px dashed rgba(23,22,28,.25)',
                  borderRadius: 16,
                  minHeight: 96,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                  padding: '16px 12px',
                  textAlign: 'center',
                  background: 'rgba(255,255,255,.6)',
                }}
              >
                <span className="mono-label" style={{ fontSize: 10, letterSpacing: '.2em' }}>
                  <B zh="预留" en="Reserved" />
                </span>
                <span style={{ fontWeight: 700, fontSize: 15.5, letterSpacing: '-.01em' }}>
                  {'name' in s ? s.name : <B zh={s.zh} en={s.en} />}
                </span>
              </div>
            ))}

            <a
              href="/sponsor/apply"
              style={{
                border: '1.5px solid var(--ink)',
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
                background: 'linear-gradient(120deg,var(--tint-violet),var(--tint-amber))',
                boxShadow: '0 14px 34px -16px rgba(96,72,150,.4)',
              }}
            >
              <span className="mono-label" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--flag-ink)' }}>
                <B zh="这一格是空的" en="This one's open" />
              </span>
              <span style={{ fontWeight: 800, fontSize: 15.5, letterSpacing: '-.01em' }}>
                <B zh="你的品牌 →" en="Your logo →" />
              </span>
            </a>
          </div>

          <p className="fine" style={{ marginTop: 14 }}>
            <B
              zh="这是我们的目标名单，非已确认赞助方。名单上的公司与 2% Tech 尚无合作关系。"
              en="This is our target list, not confirmed sponsors. Companies named here have no existing relationship with 2% Tech."
            />
          </p>
        </div>
      </section>

      {/* ---- stats + photos ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
            {STATS.map((s) => (
              <div key={s.display} style={{ borderLeft: '1px solid var(--line-3)', paddingLeft: 22 }}>
                <span className="serif-num" style={{ fontSize: 64 }}>
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
              Since January 2025 — pulled from our public{' '}
              <a href={LUMA_PROFILE} target="_blank" rel="noopener noreferrer">
                Luma profile
              </a>
              , click through and check.
            </span>
            <span className="zh">
              自 2025 年 1 月起——数据来自公开{' '}
              <a href={LUMA_PROFILE} target="_blank" rel="noopener noreferrer">
                Luma 主页
              </a>
              ，欢迎点进去核验。
            </span>
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 26, justifyContent: 'center', marginTop: 44 }}>
            {FEATURED_PHOTOS.map((p, i) => (
              <div
                key={p.src}
                style={{
                  flex: '0 1 340px',
                  transform: ['rotate(-2deg)', 'rotate(1.6deg) translateY(14px)', 'rotate(-1.2deg)'][i],
                  background: '#fff',
                  border: '1px solid var(--line-2)',
                  borderRadius: 18,
                  padding: '10px 10px 12px',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div style={{ width: '100%', height: 230 }}>
                  <img
                    src={p.src}
                    alt={p.alt}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10, display: 'block' }}
                  />
                </div>
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
          <p className="eyebrow">
            <B zh="活动" en="Calendar" />
          </p>
          <h2 className="h-sec" style={{ marginBottom: 28 }}>
            <B zh="接下来 & 刚办完" en="Coming up & just wrapped" />
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 44 }}>
            <div>
              <p className="tl-head">
                <B zh="接下来" en="Upcoming" />
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {UPCOMING.map((e) => (
                  <Row key={`${e.date}-${e.name}`} e={e} />
                ))}
              </div>
            </div>

            <div>
              <p className="tl-head">
                <B zh="过往精选 · 2026 年（另有标注）" en="Recent highlights · 2026 unless noted" />
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {PAST_HIGHLIGHTS.map((e) => (
                  <Row key={`${e.date}-${e.name}-${e.registered}`} e={e} />
                ))}
              </div>
            </div>
          </div>

          <p className="fine" style={{ marginTop: 22, fontSize: 12.5 }}>
            <span className="en">
              All 25 events are on our{' '}
              <a href={LUMA_PROFILE} target="_blank" rel="noopener noreferrer">
                Luma profile
              </a>
              .
            </span>
            <span className="zh">
              全部 25 场记录都在{' '}
              <a href={LUMA_PROFILE} target="_blank" rel="noopener noreferrer">
                Luma 主页
              </a>
              。
            </span>
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
            border: '1px solid var(--line-2)',
            background: 'linear-gradient(120deg,var(--tint-violet),var(--tint-amber) 50%,var(--tint-blue))',
            padding: '56px 32px',
            textAlign: 'center',
          }}
        >
          <p className="eyebrow" style={{ marginBottom: 10 }}>
            <B zh="下一步" en="Next step" />
          </p>

          <h2 style={{ margin: '0 auto', maxWidth: '22ch', fontSize: 'clamp(28px,3.6vw,40px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1 }}>
            <span className="en">
              Next stop: <em className="serif">Stanford.</em> The title seat is still open.
            </span>
            <span className="zh zh-display">下一站斯坦福，冠名席还空着。</span>
          </h2>

          <p className="lead" style={{ margin: '16px auto 0', maxWidth: '52ch' }}>
            <B
              zh="8 月底的单日黑客松。告诉我们你想办什么——我们带方案、场地、当天流程，以及活动之后持续数周的内容与分发一起来。"
              en="A one-day hackathon in late August. Tell us what you want to host — we'll come back with the plan, the room, the day's funnel, and the weeks of content and distribution that follow it."
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
              <span className="mono-label" style={{ fontSize: 11, letterSpacing: '.14em' }}>
                Email
              </span>{' '}
              <span className="tbd">{CONTACT.email}</span>
            </span>
            <span>
              <span className="mono-label" style={{ fontSize: 11, letterSpacing: '.14em' }}>
                WeChat
              </span>{' '}
              <span className="tbd">
                <B zh={CONTACT.wechat.zh} en={CONTACT.wechat.en} />
              </span>
            </span>
            <span>
              <span className="mono-label" style={{ fontSize: 11, letterSpacing: '.14em' }}>
                Luma
              </span>{' '}
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
