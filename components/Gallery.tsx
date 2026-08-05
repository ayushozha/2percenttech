'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import B from './B';

/** Photo grid with a lightbox.

    Ported from the previous sponsor.html. The first `visible` photos are
    always shown and the rest sit inside a <details> — which matters for
    print, because a collapsed <details> isn't rendered at all and would
    silently vanish from the PDF. SponsorPrint force-opens them first. */
export default function Gallery({ photos, visible = 8 }: { photos: string[]; visible?: number }) {
  const [open, setOpen] = useState<number | null>(null);
  // Restores focus to the thumbnail that opened the lightbox.
  const opener = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
    opener.current = null;
  }, []);

  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? null : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);

    // Stop the page scrolling behind the overlay.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  const thumb = (src: string, i: number) => (
    <button
      key={src}
      type="button"
      onClick={(e) => {
        opener.current = e.currentTarget;
        setOpen(i);
      }}
      aria-label={`Open photo ${i + 1} of ${photos.length}`}
    >
      <img src={src} alt="" loading="lazy" />
    </button>
  );

  const head = photos.slice(0, visible);
  const tail = photos.slice(visible);

  return (
    <>
      <div className="gal">{head.map((p, i) => thumb(p, i))}</div>

      {tail.length > 0 && (
        <details className="more">
          <summary>
            <B zh={`展开其余 ${tail.length} 张`} en={`View the other ${tail.length}`} />
          </summary>
          <div className="gal" style={{ marginTop: 12 }}>
            {tail.map((p, i) => thumb(p, i + visible))}
          </div>
        </details>
      )}

      {open !== null && (
        <div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label="Event photo"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <figure className="lb-fig" style={{ margin: 0 }}>
            <img src={photos[open]} alt={`Event photo ${open + 1}`} />
            <div className="lb-bar">
              <span>
                {open + 1} / {photos.length}
              </span>
              <div>
                <button type="button" onClick={() => step(-1)} aria-label="Previous photo">
                  ←
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Next photo">
                  →
                </button>
                <button type="button" onClick={close} autoFocus>
                  <B zh="关闭" en="Close" />
                </button>
              </div>
            </div>
          </figure>
        </div>
      )}
    </>
  );
}
