import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import B from '@/components/B';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import HostApplyForm from '@/components/HostApplyForm';
import { CONTACT, LUMA_PROFILE, STATS } from '@/lib/data';
import { EVENT_PRODUCTS } from '@/lib/blueprint';

export const metadata: Metadata = {
  title: 'Host an event · 2%Tech',
  description:
    'Brief us on the event you want to run in Silicon Valley. Hackathon, workshop, panel or keynote — we come back with a format, a venue and dates. 把你的活动办进硅谷。',
};

/** What happens after someone submits. Four beats, so the wait is understood
    rather than silent. */
const NEXT_STEPS = [
  { zh: '我们确认需求，缺什么直接问你', en: 'We qualify the brief and ask about anything missing' },
  { zh: '给出形式建议与当天流程', en: 'You get a format recommendation and the run of show' },
  { zh: '确认场地、档期与报价', en: 'We confirm venue, dates and the quote' },
  { zh: '签约后进入执行', en: 'We sign and start building it' },
];

export default function HostApply() {
  return (
    <div id="top">
      <SiteNav variant="host" />

      {/* ---- hero ---- */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '48px 28px 8px' }}>
        <div
          className="blob"
          style={{
            width: 520,
            height: 520,
            background: 'radial-gradient(circle,oklch(0.9 0.09 310),transparent 65%)',
            top: -200,
            right: -140,
            opacity: 0.55,
          }}
        />
        <div className="wrap" style={{ position: 'relative', zIndex: 1, padding: 0 }}>
          <p className="eyebrow">
            <B zh="活动简报" en="Event brief" />
          </p>
          <h1 className="h-page" style={{ maxWidth: '20ch' }}>
            <span className="en">
              Host an event in <em className="serif grad">Silicon Valley.</em>
            </span>
            <span className="zh zh-display">
              把你的活动，
              <em className="grad" style={{ fontStyle: 'normal' }}>
                办进硅谷
              </em>
              。
            </span>
          </h1>
          <p className="lead" style={{ margin: '16px 0 0', maxWidth: '56ch' }}>
            <B
              zh="六步，大约三分钟。只有活动形式和邮箱是必填的，其余留空也能提交，我们会在电话里问。"
              en="Six steps, about three minutes. Only the format and your email are required; leave the rest blank and we'll ask on the call."
            />
          </p>
          <p className="small" style={{ marginTop: 12 }}>
            <B zh="还没决定办哪种？" en="Not sure which format yet? " />
            <Link href="/#products" style={{ fontWeight: 600 }}>
              <B zh="先看六种形式 →" en="Compare the six →" />
            </Link>
          </p>
        </div>
      </section>

      {/* ---- form left, reference right ---- */}
      <section className="section" style={{ borderTop: 0, paddingTop: 40 }}>
        <div className="wrap apply-grid" style={{ padding: 0 }}>
          {/* useSearchParams needs a boundary for the export build to prerender. */}
          <Suspense
            fallback={
              <p className="mono-label">
                <B zh="载入表单…" en="Loading form…" />
              </p>
            }
          >
            <HostApplyForm />
          </Suspense>

          <aside className="apply-aside">
            {/* The six products in full, so the selector on the left can stay
                compact and still be an informed choice. */}
            {EVENT_PRODUCTS.map((p) => (
              <div key={p.id} className="card" style={{ borderRadius: 22 }}>
                <h2 style={{ fontSize: 15.5, fontWeight: 800, letterSpacing: '-.01em' }}>
                  <B zh={p.name.zh} en={p.name.en} />
                </h2>
                <p className="small" style={{ marginTop: 6 }}>
                  <B zh={p.tagline.zh} en={p.tagline.en} />
                </p>
                <ul
                  style={{
                    margin: '12px 0 0',
                    padding: 0,
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  {p.included.slice(0, 4).map((it) => (
                    <li key={it.en} style={{ display: 'flex', gap: 8, fontSize: 12.5, lineHeight: 1.45 }}>
                      <span aria-hidden="true" style={{ color: 'var(--violet-deep)' }}>
                        ✓
                      </span>
                      <span>
                        <B zh={it.zh} en={it.en} />
                      </span>
                    </li>
                  ))}
                </ul>
                <p style={{ marginTop: 12 }}>
                  <Link href={`/host/${p.id}`} className="small" style={{ fontWeight: 600 }}>
                    <B
                      zh={`全部 ${p.included.length} 项与执行流程 →`}
                      en={`All ${p.included.length} and the run of show →`}
                    />
                  </Link>
                </p>
              </div>
            ))}

            <div className="card" style={{ borderRadius: 22 }}>
              <p className="mono-label" style={{ fontSize: 10 }}>
                <B zh="接下来会发生什么" en="What happens next" />
              </p>
              <ol style={{ margin: '12px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {NEXT_STEPS.map((s) => (
                  <li key={s.en} className="small" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                    <B zh={s.zh} en={s.en} />
                  </li>
                ))}
              </ol>
            </div>

            <div className="card" style={{ borderRadius: 22 }}>
              <p className="mono-label" style={{ fontSize: 10 }}>
                <B zh="到目前为止" en="Track record" />
              </p>
              <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
                {STATS.map((s) => (
                  <div key={s.display} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span className="serif-num" style={{ fontSize: 26, display: 'inline' }}>
                      {s.display}
                    </span>
                    <span className="fine">
                      <B zh={s.zh} en={s.en} />
                    </span>
                  </div>
                ))}
              </div>
              <p className="fine" style={{ marginTop: 12 }}>
                <span className="en">
                  Since January 2025, all of it on our{' '}
                  <a href={LUMA_PROFILE} target="_blank" rel="noopener noreferrer">
                    Luma profile
                  </a>
                  .
                </span>
                <span className="zh">
                  自 2025 年 1 月起，全部记录都在{' '}
                  <a href={LUMA_PROFILE} target="_blank" rel="noopener noreferrer">
                    Luma 主页
                  </a>
                  。
                </span>
              </p>
            </div>

            <div className="card" style={{ borderRadius: 22 }}>
              <p className="mono-label" style={{ fontSize: 10 }}>
                <B zh="更想直接联系？" en="Rather just email?" />
              </p>
              <p style={{ marginTop: 10, fontSize: 13.5 }}>
                <a href={`mailto:${CONTACT.email}`} style={{ fontWeight: 600 }}>
                  {CONTACT.email}
                </a>
              </p>
              <p style={{ marginTop: 8, fontSize: 13.5 }}>
                <Link href="/sponsor" style={{ fontWeight: 600 }}>
                  <B zh="我想赞助，不是主办 →" en="I'd rather sponsor one →" />
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
