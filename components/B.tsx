import type { ReactNode } from 'react';

/** Bilingual text pair — CSS on #page[data-lang] shows one and hides the other.
    Both halves are always in the DOM, so the served HTML carries the full
    copy in both languages regardless of which one is displayed. */
export default function B({ zh, en }: { zh: ReactNode; en: ReactNode }) {
  return (
    <>
      <span className="zh">{zh}</span>
      <span className="en">{en}</span>
    </>
  );
}
