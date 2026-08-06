'use client';

import Link from 'next/link';
import B from './B';
import { useLang } from './LangProvider';
import { LUMA_PROFILE } from '@/lib/data';

/** Language switch, shared by every page. */
export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="pillbar" role="group" aria-label="Language / 语言">
      <button type="button" aria-pressed={lang === 'en'} className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
        EN
      </button>
      <button type="button" aria-pressed={lang === 'zh'} className={lang === 'zh' ? 'on' : ''} onClick={() => setLang('zh')}>
        中文
      </button>
    </div>
  );
}

/** Public site nav — landing page and prospectus. */
export default function SiteNav({ variant = 'landing' }: { variant?: 'landing' | 'sponsor' }) {
  return (
    <nav className="nav">
      <div className="nav-in">
        <Link href="/" className="brand">
          <img src="/mark.svg" alt="2% Tech mark" width={28} height={28} />
          <span>2% Tech</span>
        </Link>
        <div className="nav-actions">
          <LangToggle />
          {variant === 'landing' ? (
            <Link href="/sponsor" className="btn btn-ghost btn-sm">
              <B zh="赞助方案" en="Sponsor" />
            </Link>
          ) : (
            <button type="button" className="btn btn-ghost btn-sm no-print" onClick={() => window.print()}>
              <B zh="存成 PDF" en="Save PDF" />
            </button>
          )}
          {/* The blueprint is explicit that "Host an Event in Silicon Valley"
              is the first message on the site, so it's the primary action in
              the nav too — except on the prospectus, where the reader is
              already there to sponsor. */}
          {variant === 'sponsor' ? (
            <Link href="/sponsor/apply" className="btn btn-dark btn-sm">
              <B zh="申请赞助" en="Sponsor us" />
            </Link>
          ) : (
            <Link href="/host/apply" className="btn btn-dark btn-sm">
              <B zh="办活动" en="Host an event" />
            </Link>
          )}
          <Link href="/signin" className="btn btn-ghost btn-sm">
            <B zh="登录" en="Sign in" />
          </Link>
          <a className="btn btn-ghost btn-sm" href={LUMA_PROFILE} target="_blank" rel="noopener noreferrer">
            Luma ↗
          </a>
        </div>
      </div>
    </nav>
  );
}
