import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import B from '@/components/B';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { CONTACT, LUMA_PROFILE } from '@/lib/data';
import { EVENT_PRODUCTS, casesFor, productById, type EventProduct } from '@/lib/blueprint';

/** One page per event product — blueprint §4.2.

    Everything on the page comes from EVENT_PRODUCTS, so the four pages differ
    only in content and a copy change lands in one place. The past cases are
    resolved out of the real calendar by casesFor(), which is what keeps the
    registration counts honest: there is no number on this page that isn't also
    on the Luma profile it links to. */

type Params = { type: string };

/** The only four routes that exist. `dynamicParams = false` matters for the
    static export — without it, an unlisted /host/anything would be a route
    the build has no file for. */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return EVENT_PRODUCTS.map((p) => ({ type: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { type } = await params;
  const p = productById(type);
  if (!p) return {};

  return {
    title: `${p.name.en} · 2%Tech`,
    description: `${p.tagline.en} ${p.forWho.en} 在硅谷办一场${p.name.zh}。`,
  };
}

function Section({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="section">
      <div className="wrap" style={{ padding: 0 }}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h-sec">{title}</h2>
        {intro && (
          <p className="body" style={{ margin: '10px 0 0', maxWidth: '64ch' }}>
            {intro}
          </p>
        )}
        <div style={{ marginTop: 26 }}>{children}</div>
      </div>
    </section>
  );
}

/** The other three products, so a page that turns out to be the wrong format
    is a sideways step rather than a dead end. */
function OtherProducts({ current }: { current: EventProduct }) {
  const rest = EVENT_PRODUCTS.filter((p) => p.id !== current.id);

  return (
    <Section
      eyebrow={<B zh="其他形式" en="Other formats" />}
      title={<B zh="不是你要的形式？" en="Not the format you had in mind?" />}
    >
      <div className="grid-auto">
        {rest.map((p) => (
          <Link
            key={p.id}
            href={`/host/${p.id}`}
            className="card"
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <img
              src={p.shots[0].src}
              alt={p.shots[0].alt}
              loading="lazy"
              style={{
                width: '100%',
                height: 120,
                objectFit: 'cover',
                borderRadius: 12,
                display: 'block',
                marginBottom: 14,
              }}
            />
            <h3 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-.01em' }}>
              <B zh={p.name.zh} en={p.name.en} />
            </h3>
            <p className="small" style={{ marginTop: 6 }}>
              <B zh={p.tagline.zh} en={p.tagline.en} />
            </p>
            <p className="mono-label" style={{ fontSize: 10, marginTop: 12 }}>
              <B zh="查看 →" en="Read it →" />
            </p>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export default async function HostProduct({ params }: { params: Promise<Params> }) {
  const { type } = await params;
  const p = productById(type);
  if (!p) notFound();

  const cases = casesFor(p);
  const brief = `/host/apply?type=${p.id}`;

  return (
    <div id="top">
      <SiteNav variant="host" />

      {/* ---- hero ---- */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '48px 28px 8px' }}>
        <div
          className="blob"
          style={{
            width: 540,
            height: 540,
            background: 'radial-gradient(circle,oklch(0.9 0.09 310),transparent 65%)',
            top: -190,
            left: -130,
            opacity: 0.6,
          }}
        />
        <div
          className="blob"
          style={{
            width: 480,
            height: 480,
            background: 'radial-gradient(circle,oklch(0.93 0.08 55),transparent 65%)',
            top: '10%',
            right: -150,
            opacity: 0.55,
            animationDuration: '34s',
            animationDirection: 'reverse',
          }}
        />

        <div
          className="wrap"
          style={{
            position: 'relative',
            zIndex: 1,
            padding: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
            gap: 40,
            alignItems: 'center',
          }}
        >
          <div>
            <p className="eyebrow">
              <B zh="活动形式" en="Event product" />
            </p>
            <h1 className="h-page" style={{ maxWidth: '16ch' }}>
              <span className="en">
                <em className="serif grad">{p.name.en}</em>
              </span>
              <span className="zh zh-display">
                <em className="grad" style={{ fontStyle: 'normal' }}>
                  {p.name.zh}
                </em>
              </span>
            </h1>
            <p className="lead" style={{ margin: '16px 0 0', maxWidth: '48ch' }}>
              <B zh={p.tagline.zh} en={p.tagline.en} />
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
              <Link href={brief} className="btn btn-dark">
                <B zh={`申请办一场${p.name.zh} →`} en={`Brief us on a ${p.name.en.toLowerCase()} →`} />
              </Link>
              <a href={`mailto:${CONTACT.email}`} className="btn btn-ghost">
                <B zh="直接发邮件" en="Email us instead" />
              </a>
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            <img
              src={p.shots[0].src}
              alt={p.shots[0].alt}
              style={{
                width: '100%',
                height: 340,
                objectFit: 'cover',
                borderRadius: 22,
                display: 'block',
                border: '1px solid var(--line-2)',
                boxShadow: 'var(--shadow-card)',
              }}
            />
          </div>
        </div>
      </section>

      {/* ---- ideal customer ---- */}
      <Section
        eyebrow={<B zh="适合谁" en="Who it's for" />}
        title={<B zh="这个形式为谁而设" en="Who this format is built for" />}
      >
        <div className="tintbox" style={{ padding: '28px 30px' }}>
          <p style={{ fontSize: 18, lineHeight: 1.6, maxWidth: '58ch', fontWeight: 500 }}>
            <B zh={p.forWho.zh} en={p.forWho.en} />
          </p>
        </div>

        <div className="grid-auto" style={{ marginTop: 22 }}>
          {p.objectives.map((o) => (
            <div key={o.en} className="card">
              <span aria-hidden="true" style={{ color: 'var(--violet-deep)', fontWeight: 700 }}>
                ✓
              </span>
              <p style={{ marginTop: 8, fontSize: 14.5, lineHeight: 1.55, fontWeight: 500 }}>
                <B zh={o.zh} en={o.en} />
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- scope ---- */}
      <Section
        eyebrow={<B zh="服务范围" en="Scope" />}
        title={<B zh="我们负责的部分" en="What we run" />}
        intro={
          <B
            zh="以下都包含在内。你带主题、产品与想见的人，其余交给我们。"
            en="All of it is included. You bring the subject, the product and the people you want in the room; the rest is ours."
          />
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 10 }}>
          {p.included.map((it) => (
            <div key={it.en} className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
              <span aria-hidden="true" style={{ color: 'var(--violet-deep)', fontWeight: 700 }}>
                ✓
              </span>
              <span style={{ fontSize: 14, lineHeight: 1.5 }}>
                <B zh={it.zh} en={it.en} />
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- run of show ---- */}
      <Section
        eyebrow={<B zh="执行流程" en="Run of show" />}
        title={<B zh="从确认到复盘" en="From locked to reported" />}
        intro={
          <B
            zh="标准节奏。档期紧张时可以压缩，但每个阶段都不会跳过。"
            en="The standard rhythm. It compresses when the calendar is tight, but no stage gets skipped."
          />
        }
      >
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {p.workflow.map((w, i) => (
            <li
              key={w.t.en}
              className="card"
              style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', gap: 18, alignItems: 'start' }}
            >
              <div style={{ minWidth: 92 }}>
                <span className="step-n" style={{ marginRight: 0 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mono-label" style={{ fontSize: 11, marginTop: 6 }}>
                  <B zh={w.t.zh} en={w.t.en} />
                </p>
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>
                <B zh={w.d.zh} en={w.d.en} />
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ---- add-ons ---- */}
      <Section
        eyebrow={<B zh="可选加项" en="Add-ons" />}
        title={<B zh="可以再加的部分" en="Things you can bolt on" />}
        intro={
          <B
            zh="不在标准范围内，单独计价。"
            en="Outside the standard scope, and priced separately."
          />
        }
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {p.addons.map((a) => (
            <span key={a.en} className="chip" style={{ cursor: 'default' }}>
              <B zh={a.zh} en={a.en} />
            </span>
          ))}
        </div>
      </Section>

      {/* ---- past cases ----
          Real events with their real registration counts, resolved out of the
          calendar. Every row links to the Luma page it came from. */}
      {cases.length > 0 && (
        <Section
          eyebrow={<B zh="过往案例" en="Past cases" />}
          title={<B zh="我们办过的" en="Ones we've run" />}
          intro={
            <B
              zh="真实场次与真实报名数，数据来自公开 Luma 页面，点进去可以核验。"
              en="Real events, real registration counts, straight from the public Luma pages. Click through and check."
            />
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {cases.map((e) => (
              <div key={`${e.date}-${e.name}`} className="tl-row">
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
                      <B
                        zh={`· ${e.registered.toLocaleString('en-US')} 人报名`}
                        en={`· ${e.registered.toLocaleString('en-US')} registered`}
                      />
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>

          <p className="fine" style={{ marginTop: 18, fontSize: 12.5 }}>
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
        </Section>
      )}

      {/* ---- photos ---- */}
      <Section
        eyebrow={<B zh="现场" en="In the room" />}
        title={<B zh="实际是什么样子" en="What it actually looks like" />}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
          {p.shots.map((s) => (
            <figure key={s.src} style={{ margin: 0 }}>
              <img
                src={s.src}
                alt={s.alt}
                loading="lazy"
                style={{
                  width: '100%',
                  height: 200,
                  objectFit: 'cover',
                  borderRadius: 16,
                  display: 'block',
                  border: '1px solid var(--line-2)',
                }}
              />
            </figure>
          ))}
        </div>
      </Section>

      <OtherProducts current={p} />

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
          <h2
            style={{
              margin: '0 auto',
              maxWidth: '24ch',
              fontSize: 'clamp(26px,3.4vw,38px)',
              fontWeight: 800,
              letterSpacing: '-.03em',
              lineHeight: 1.12,
            }}
          >
            <span className="en">
              Tell us what you want to run. We come back with a <em className="serif">plan.</em>
            </span>
            <span className="zh zh-display">告诉我们你想办什么，我们带方案回来。</span>
          </h2>
          <p className="lead" style={{ margin: '16px auto 0', maxWidth: '50ch' }}>
            <B
              zh="大约三分钟的活动简报。填完我们会带着形式建议、场地、档期与推广方案回复，两个工作日内。"
              en="A three-minute brief. We come back with the format, a venue, dates and how we'd promote it, within two working days."
            />
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 26 }}>
            <Link href={brief} className="btn btn-dark">
              <B zh="填写活动简报 →" en="Start the brief →" />
            </Link>
            <Link href="/sponsor" className="btn btn-ghost">
              <B zh="我想赞助，不是主办" en="I'd rather sponsor one" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
