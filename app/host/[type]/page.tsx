import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import B from '@/components/B';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { EVENT_PRODUCTS, productById } from '@/lib/blueprint';
import { PAST, UPCOMING, LUMA_PROFILE, type Bi } from '@/lib/data';

/** One page per standardised event product (blueprint §4.2): ideal customer,
    objectives, included services, standard workflow, optional promotion, past
    cases and the submission button. */

export function generateStaticParams() {
  return EVENT_PRODUCTS.map((p) => ({ type: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const p = productById(type);
  if (!p) return { title: 'Not found · 2% Tech' };
  return {
    title: `${p.name.en} · Host an event in Silicon Valley — 2% Tech`,
    description: p.tagline.en,
  };
}

const bi = (v: Bi) => <B zh={v.zh} en={v.en} />;

/** Past cases resolve against the real event list rather than restating
    numbers, so a corrected registration count only changes in one place. */
function casesFor(names: string[]) {
  const all = [...PAST, ...UPCOMING];
  return names.map((n) => all.find((e) => e.name === n)).filter((e): e is NonNullable<typeof e> => Boolean(e));
}

export default async function HostProduct({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const p = productById(type);
  if (!p) notFound();

  const cases = casesFor(p.caseNames);
  const others = EVENT_PRODUCTS.filter((x) => x.id !== p.id);

  return (
    <div id="top">
      <SiteNav />

      {/* ---- hero ---- */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '48px 28px 40px' }}>
        <div
          className="blob"
          style={{
            width: 520,
            height: 520,
            background: 'radial-gradient(circle,oklch(0.9 0.09 310),transparent 65%)',
            top: -190,
            left: -130,
            opacity: 0.55,
          }}
        />
        <div className="wrap" style={{ position: 'relative', zIndex: 1, padding: 0 }}>
          <p className="eyebrow">
            <B zh="活动产品" en="Event product" />
          </p>
          <h1 className="h-page" style={{ maxWidth: '18ch' }}>
            <span className="en">
              <em className="serif grad">{p.name.en}</em>
            </span>
            <span className="zh zh-display grad">{p.name.zh}</span>
          </h1>
          <p className="lead" style={{ margin: '14px 0 0', maxWidth: '52ch' }}>
            {bi(p.tagline)}
          </p>

          <div className="card" style={{ marginTop: 26, maxWidth: 640, borderRadius: 20 }}>
            <p className="mono-label" style={{ fontSize: 10 }}>
              <B zh="适合谁" en="Ideal customer" />
            </p>
            <p className="body" style={{ marginTop: 8, fontSize: 15 }}>
              {bi(p.forWho)}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
            <Link href={`/host/apply?type=${p.id}`} className="btn btn-dark">
              <B zh="提交需求 →" en="Send a brief →" />
            </Link>
            <Link href="/sponsor" className="btn btn-ghost">
              <B zh="我想赞助" en="I'd rather sponsor" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- objectives ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow">
            <B zh="目标" en="Objectives" />
          </p>
          <h2 className="h-sec" style={{ marginBottom: 20 }}>
            <B zh="这场活动要达成什么" en="What this is for" />
          </h2>
          <div className="grid-auto">
            {p.objectives.map((o, i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: 10 }}>
                <span className="serif-num" style={{ fontSize: 24, display: 'inline', color: 'var(--violet-deep)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 14.5, lineHeight: 1.5 }}>{bi(o)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- included ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow">
            <B zh="包含服务" en="Included" />
          </p>
          <h2 className="h-sec" style={{ marginBottom: 20 }}>
            <B zh="套餐里有什么" en="What you get" />
          </h2>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
              gap: 10,
            }}
          >
            {p.included.map((it, i) => (
              <li key={i} className="card-sm" style={{ background: '#fff', border: '1px solid var(--line-2)', display: 'flex', gap: 10 }}>
                <span aria-hidden="true" style={{ color: 'var(--violet-deep)' }}>
                  ✓
                </span>
                <span style={{ fontSize: 14, lineHeight: 1.5 }}>{bi(it)}</span>
              </li>
            ))}
          </ul>

          {p.addons.length > 0 && (
            <>
              <p className="mono-label" style={{ marginTop: 26, marginBottom: 10 }}>
                <B zh="可选加购" en="Optional add-ons" />
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {p.addons.map((a, i) => (
                  <span
                    key={i}
                    className="badge"
                    style={{
                      background: 'linear-gradient(120deg,var(--tint-violet-soft),var(--tint-amber-soft))',
                      color: 'var(--ink-2)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 13,
                      letterSpacing: 0,
                      textTransform: 'none',
                      padding: '8px 14px',
                      border: '1px solid var(--line-2)',
                    }}
                  >
                    {bi(a)}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ---- workflow ---- */}
      <section className="section">
        <div className="wrap" style={{ padding: 0 }}>
          <p className="eyebrow">
            <B zh="标准流程" en="Standard workflow" />
          </p>
          <h2 className="h-sec" style={{ marginBottom: 20 }}>
            <B zh="从签约到交付" en="From signed to delivered" />
          </h2>
          <div className="stack" style={{ gap: 8 }}>
            {p.workflow.map((w, i) => (
              <div
                key={i}
                className="card-sm"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(90px,120px) 1fr',
                  gap: 14,
                  alignItems: 'start',
                  background: '#fff',
                  border: '1px solid var(--line-2)',
                }}
              >
                <span className="tl-d">{bi(w.t)}</span>
                <span style={{ fontSize: 14.5, lineHeight: 1.5 }}>{bi(w.d)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- past cases ---- */}
      {cases.length > 0 && (
        <section className="section">
          <div className="wrap" style={{ padding: 0 }}>
            <p className="eyebrow">
              <B zh="往期案例" en="Past cases" />
            </p>
            <h2 className="h-sec" style={{ marginBottom: 20 }}>
              <B zh="我们办过的这类活动" en="Ones we've run" />
            </h2>
            <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
              {cases.map((c) => (
                <div key={c.name} className="card">
                  <span className="mono-label" style={{ fontSize: 10 }}>
                    {c.date}
                  </span>
                  <h3 style={{ marginTop: 8, fontSize: 15.5, fontWeight: 700, lineHeight: 1.35 }}>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        {c.name}
                      </a>
                    ) : (
                      c.name
                    )}
                  </h3>
                  {c.registered != null && (
                    <span className="small" style={{ display: 'block', marginTop: 8 }}>
                      <B
                        zh={`${c.registered.toLocaleString('en-US')} 人报名`}
                        en={`${c.registered.toLocaleString('en-US')} registered`}
                      />
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="fine" style={{ marginTop: 14 }}>
              <span className="en">
                Every event is on our{' '}
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
      )}

      {/* ---- CTA + other products ---- */}
      <section style={{ padding: '26px 28px 64px' }}>
        <div
          style={{
            maxWidth: 'var(--wrap)',
            margin: '0 auto',
            borderRadius: 28,
            border: '1px solid var(--line-2)',
            background: 'linear-gradient(120deg,var(--tint-violet),var(--tint-amber) 50%,var(--tint-blue))',
            padding: '48px 32px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ margin: '0 auto', maxWidth: '22ch', fontSize: 'clamp(24px,3vw,34px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.15 }}>
            <B zh="把需求发给我们，两个工作日内回复。" en="Send the brief. We reply within two working days." />
          </h2>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
            <Link href={`/host/apply?type=${p.id}`} className="btn btn-dark">
              <B zh="提交需求 →" en="Send a brief →" />
            </Link>
          </div>

          <p className="mono-label" style={{ marginTop: 34, fontSize: 10 }}>
            <B zh="其他形式" en="Other formats" />
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 }}>
            {others.map((o) => (
              <Link key={o.id} href={`/host/${o.id}`} className="btn btn-ghost btn-sm">
                {bi(o.name)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
