'use client';

import { useEffect } from 'react';

/** Sponsors circulate the prospectus internally as a PDF, so printing is a
    supported output rather than an afterthought.

    A collapsed <details> isn't rendered at all, so without this the hidden
    half of the lineup, the other 15 events and every FAQ answer silently
    vanish from the PDF. Open them all before the print snapshot is taken,
    and restore whatever was open afterwards so the screen view is unchanged.

    If you restructure this page, keep this working. */
export default function SponsorPrint() {
  useEffect(() => {
    // Elements this component opened, so afterprint only closes those.
    let opened: HTMLDetailsElement[] = [];

    const before = () => {
      opened = Array.from(document.querySelectorAll<HTMLDetailsElement>('details')).filter((d) => !d.open);
      for (const d of opened) d.open = true;
    };
    const after = () => {
      for (const d of opened) d.open = false;
      opened = [];
    };

    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => {
      window.removeEventListener('beforeprint', before);
      window.removeEventListener('afterprint', after);
    };
  }, []);

  return null;
}
