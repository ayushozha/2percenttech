'use client';

import { useEffect, useRef } from 'react';
import { STATS } from '@/lib/data';
import B from './B';

/** Final figures are server-rendered, so no-JS and reduced-motion show the
    real numbers. This only animates them once when scrolled into view. */
export default function Stats() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const els = Array.from(container.querySelectorAll<HTMLElement>('.stat-n[data-count]'));
    const run = (el: HTMLElement, delay: number) => {
      const target = Number(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') ?? '';
      const dur = 1500;
      let t0: number | null = null;
      el.textContent = `0${suffix}`;
      const step = (ts: number) => {
        if (t0 === null) t0 = ts;
        const p = Math.min((ts - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      setTimeout(() => requestAnimationFrame(step), delay);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          run(e.target as HTMLElement, els.indexOf(e.target as HTMLElement) * 140);
        }
      },
      { threshold: 0.45 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="stats" ref={root}>
      {STATS.map((s) => (
        <div key={s.display}>
          <span className="stat-n" data-count={s.n} data-suffix={s.suffix ?? ''}>
            {s.display}
          </span>
          <span className="stat-l">
            <B zh={s.zh} en={s.en} />
          </span>
        </div>
      ))}
    </div>
  );
}
