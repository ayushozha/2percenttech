'use client';

import { useState, type ReactNode } from 'react';
import B from './B';

/** Owns the zh/en state. All bilingual copy is server-rendered as paired
    spans; this only flips the data-lang attribute that CSS keys off. */
export default function LangShell({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  return (
    <div id="page" data-lang={lang}>
      <header className="top">
        <div className="wrap">
          <a href="#top" className="mark">2%</a>
          <div className="tools">
            <button
              type="button"
              aria-label="切换语言 / Switch language"
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            >
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
            <a className="tool" href="/sponsor.built.html">
              <B zh="赞助方案" en="Sponsor" />
            </a>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
