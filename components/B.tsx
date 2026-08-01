import type { ReactNode } from 'react';

/** Bilingual text pair — CSS on #page[data-lang] shows one and hides the other. */
export default function B({ zh, en }: { zh: ReactNode; en: ReactNode }) {
  return (
    <>
      <span className="zh">{zh}</span>
      <span className="en">{en}</span>
    </>
  );
}
