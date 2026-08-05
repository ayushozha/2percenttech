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
  title: 'Sponsor a hackathon · 2% Tech',
  description:
    'Apply to sponsor a 2% Tech hackathon — pick a package, tell us what you are measured on, and we come back with a proposal. 申请赞助 2% Tech 黑客松。',
};

export default function SponsorApply() {
  return (
    <div id="top">
      <SiteNav variant="sponsor" />

      <section style={{ position: 'relative', overflow: 'hidden', padding: '48px 28px 24px' }}>
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
          <p className="lead" style={{ margin: '16px 0 0', maxWidth: '54ch' }}>
            <B
              zh="填一次，我们带着套餐建议、当天流程与档期回来。两个工作日内回复。"
              en="Fill this once and we come back with a package recommendation, the day's funnel and available dates. Reply within two working days."
            />
          </p>
          <p className="small" style={{ marginTop: 12 }}>
            <B zh="还没看过方案？" en="Haven't read the prospectus yet? " />
            <Link href="/sponsor" style={{ fontWeight: 600 }}>
              <B zh="先看赞助方案 →" en="Read it first →" />
            </Link>
          </p>
        </div>
      </section>

      <section className="section" style={{ borderTop: 0, paddingTop: 24 }}>
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
            <div className="card" style={{ borderRadius: 20 }}>
              <p className="mono-label" style={{ fontSize: 10 }}>
                <B zh="套餐一览" en="The packages" />
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                {PACKAGES.map((p) => (
                  <div key={p.id}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>
                      <B zh={p.name.zh} en={p.name.en} />
                    </span>
                    <span className="fine" style={{ display: 'block', marginTop: 2, lineHeight: 1.45 }}>
                      <B zh={p.for.zh} en={p.for.en} />
                    </span>
                  </div>
                ))}
              </div>
              <p className="fine" style={{ marginTop: 14 }}>
                <B
                  zh="价格不在页面上——我们按你想要的结果算给你听。"
                  en="Pricing isn't posted — we price it against the outcome you're after."
                />
              </p>
            </div>

            <div className="card" style={{ borderRadius: 20 }}>
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

            <div className="card" style={{ borderRadius: 20 }}>
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
                  zh="累计数据，非单场规模。本场斯坦福单日，预计 150–200 人。"
                  en="Cumulative, not one event. Stanford is a single day — 150–200 expected."
                />
              </p>
            </div>

            <div className="card" style={{ borderRadius: 20 }}>
              <p className="mono-label" style={{ fontSize: 10 }}>
                <B zh="更想直接联系？" en="Rather just email?" />
              </p>
              <p style={{ marginTop: 10, fontSize: 13.5 }}>
                <span className="tbd">{CONTACT.email}</span>
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
