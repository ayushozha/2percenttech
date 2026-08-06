import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import B from '@/components/B';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import SponsorApplyForm from '@/components/SponsorApplyForm';
import { CONTACT, LUMA_PROFILE } from '@/lib/data';
import { DELIVERABLES, NETWORK_STATS, PACKAGES } from '@/lib/sponsor-data';

export const metadata: Metadata = {
  title: 'Sponsor a hackathon · 2%Tech',
  description:
    'Apply to sponsor a 2%Tech hackathon. Pick a package, tell us what you are measured on, and we come back with a proposal. 申请赞助 2%Tech 黑客松。',
};

/** What happens after someone submits. Four beats, so the wait is understood
    rather than silent. */
const NEXT_STEPS = [
  { zh: '我们确认需求，缺什么直接问你', en: 'We qualify the request and ask about anything missing' },
  { zh: '给出套餐建议与当天流程', en: 'You get a package recommendation and the day plan' },
  { zh: '确认场地、档期与报价', en: 'We confirm venue, dates and the quote' },
  { zh: '签约后进入执行', en: 'We sign and start building it' },
];

export default function SponsorApply() {
  return (
    <div id="top">
      <SiteNav variant="sponsor" />

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
            <B zh="赞助申请" en="Sponsorship request" />
          </p>
          <h1 className="h-page" style={{ maxWidth: '20ch' }}>
            <span className="en">
              Put your product in the <em className="serif grad">room.</em>
            </span>
            <span className="zh zh-display">
              把你的产品，放进<em className="grad" style={{ fontStyle: 'normal' }}>房间里</em>。
            </span>
          </h1>
          <p className="lead" style={{ margin: '16px 0 0', maxWidth: '56ch' }}>
            <B
              zh="四步，大约两分钟。填完我们会带着套餐建议、当天流程与可选档期回来，两个工作日内回复。"
              en="Four steps, about two minutes. We come back with a package recommendation, the day's funnel and available dates, within two working days."
            />
          </p>
          <p className="small" style={{ marginTop: 12 }}>
            <B zh="还没看过完整方案？" en="Haven't read the full prospectus? " />
            <Link href="/sponsor" style={{ fontWeight: 600 }}>
              <B zh="先看赞助方案 →" en="Read it first →" />
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
            <SponsorApplyForm />
          </Suspense>

          <aside className="apply-aside">
            {/* Full scope of each package, so the selector on the left can stay
                compact and still be an informed choice. */}
            {PACKAGES.map((p) => (
              <div
                key={p.id}
                className="card"
                style={{
                  borderRadius: 22,
                  border: p.feature ? '1.5px solid var(--ink)' : '1px solid var(--line-2)',
                  background: p.feature ? 'linear-gradient(150deg,var(--tint-violet-soft),var(--tint-amber-soft))' : '#fff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: 15.5, fontWeight: 800, letterSpacing: '-.01em' }}>
                    <B zh={p.name.zh} en={p.name.en} />
                  </h2>
                  {p.flag && (
                    <span className="badge badge-new" style={{ fontSize: 9.5, padding: '3px 9px' }}>
                      <B zh={p.flag.zh} en={p.flag.en} />
                    </span>
                  )}
                </div>
                <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {p.items.map((it, i) => (
                    <li key={i} style={{ display: 'flex', gap: 8, fontSize: 12.5, lineHeight: 1.45 }}>
                      <span aria-hidden="true" style={{ color: 'var(--violet-deep)' }}>
                        ✓
                      </span>
                      <span>
                        <B zh={it.zh} en={it.en} />
                      </span>
                    </li>
                  ))}
                </ul>
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
              <B zh="赛后你会拿到" en="What you get back" />
            </p>
            <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {DELIVERABLES.map((d) => (
                <li key={d.h.en} style={{ display: 'flex', gap: 8, fontSize: 13.5 }}>
                  <span aria-hidden="true" style={{ color: 'var(--violet-deep)' }}>
                    ✓
                  </span>
                  <B zh={d.h.zh} en={d.h.en} />
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ borderRadius: 22 }}>
            <p className="mono-label" style={{ fontSize: 10 }}>
              <B zh="社区累计" en="The network" />
            </p>
            <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
              {NETWORK_STATS.map((s) => (
                <div key={s.display} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span className="serif-num" style={{ fontSize: 26, display: 'inline' }}>
                    {s.display}
                  </span>
                  <span className="fine">
                    <B zh={s.label.zh} en={s.label.en} />
                  </span>
                </div>
              ))}
            </div>
            <p className="fine" style={{ marginTop: 12 }}>
              <B
                zh="累计数据，非单场规模。斯坦福为单日场次，预计 150 至 200 人。"
                en="Cumulative, not one event. Stanford is a single day, with 150 to 200 expected."
              />
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
              <a href={LUMA_PROFILE} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                Luma ↗
              </a>
            </p>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
