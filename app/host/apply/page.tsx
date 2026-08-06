import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import B from '@/components/B';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import HostApplyForm from '@/components/HostApplyForm';
import { EVENT_PRODUCTS } from '@/lib/blueprint';
import { CONTACT, LUMA_PROFILE, STATS } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Host an event in Silicon Valley · 2% Tech',
  description:
    'Tell us what you want to host — hackathon, workshop, panel or launch — and we come back with a proposal, a venue and dates. 把你的活动办进硅谷。',
};

export default function HostApply() {
  return (
    <div id="top">
      <SiteNav />

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
            <B zh="活动需求" en="Event brief" />
          </p>
          <h1 className="h-page" style={{ maxWidth: '20ch' }}>
            <span className="en">
              Host an event in <em className="serif grad">Silicon Valley</em>
            </span>
            <span className="zh zh-display">
              把你的活动<em className="grad" style={{ fontStyle: 'normal' }}>办进硅谷</em>
            </span>
          </h1>
          <p className="lead" style={{ margin: '16px 0 0', maxWidth: '56ch' }}>
            <B
              zh="不需要介绍人，也不需要私聊。填完这份需求，我们会确认信息、补齐缺口，然后带着初步方案、形式建议、场地与档期回来。"
              en="No introduction and no DM required. Fill this in and we'll qualify it, follow up on anything missing, and come back with an initial proposal — format, venue, dates and budget."
            />
          </p>
        </div>
      </section>

      <section className="section" style={{ borderTop: 0, paddingTop: 24 }}>
        <div className="wrap apply-grid" style={{ padding: 0 }}>
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
            <div className="card" style={{ borderRadius: 20 }}>
              <p className="mono-label" style={{ fontSize: 10 }}>
                <B zh="活动产品" en="The products" />
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                {EVENT_PRODUCTS.map((p) => (
                  <div key={p.id}>
                    <Link href={`/host/${p.id}`} style={{ fontWeight: 700, fontSize: 14 }}>
                      <B zh={p.name.zh} en={p.name.en} /> →
                    </Link>
                    <span className="fine" style={{ display: 'block', marginTop: 2, lineHeight: 1.45 }}>
                      <B zh={p.tagline.zh} en={p.tagline.en} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ borderRadius: 20 }}>
              <p className="mono-label" style={{ fontSize: 10 }}>
                <B zh="接下来会发生什么" en="What happens next" />
              </p>
              <ol style={{ margin: '12px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  { zh: '我们确认需求并补齐缺失信息', en: 'We qualify the brief and fill the gaps' },
                  { zh: '给出初步方案与形式建议', en: 'You get an initial proposal and format' },
                  { zh: '推荐场地、档期与预算', en: 'We recommend venue, dates and budget' },
                  { zh: '团队确认后进入执行', en: 'We confirm and start executing' },
                ].map((s, i) => (
                  <li key={i} className="small" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                    <B zh={s.zh} en={s.en} />
                  </li>
                ))}
              </ol>
            </div>

            <div className="card" style={{ borderRadius: 20 }}>
              <p className="mono-label" style={{ fontSize: 10 }}>
                <B zh="我们的记录" en="Track record" />
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
