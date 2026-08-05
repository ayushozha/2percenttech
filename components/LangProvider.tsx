'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'zh' | 'en';

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
});

export const useLang = () => useContext(LangCtx);

/** Owns the zh/en state for the whole site.

    All bilingual copy is rendered as paired spans (see B.tsx) and CSS on
    #page[data-lang] shows one and hides the other. That means the copy is in
    the served HTML in both languages and the toggle is a single attribute
    flip — no re-render of the tree, and it still reads correctly if JS never
    runs. English is the default; the choice persists across pages so moving
    from the landing page to the prospectus doesn't reset it. */
export default function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  // Read the stored choice after mount rather than during render: the export
  // build prerenders this HTML, so reading localStorage in the initial state
  // would produce a server/client mismatch.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('2pct-lang');
      if (saved === 'zh' || saved === 'en') setLang(saved);
    } catch {
      /* private mode / storage disabled — English default is fine */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
    try {
      localStorage.setItem('2pct-lang', lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  return (
    <LangCtx.Provider value={{ lang, setLang }}>
      <div id="page" data-lang={lang}>
        {children}
      </div>
    </LangCtx.Provider>
  );
}
