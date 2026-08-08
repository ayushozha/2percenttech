'use client';

import { useRef } from 'react';
import { FORMATS } from '@/lib/data';
import { useSiteChrome } from '@/components/SiteChrome';

/* A radiogroup rather than a row of buttons: only the selected option is in the
   tab order, and the arrow keys move between options the way a native radio
   group does. */
export default function FormatPicker() {
  const { formatIndex, setFormatIndex } = useSiteChrome();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function move(to: number) {
    const next = (to + FORMATS.length) % FORMATS.length;
    setFormatIndex(next);
    refs.current[next]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        move(i + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        move(i - 1);
        break;
      case 'Home':
        e.preventDefault();
        move(0);
        break;
      case 'End':
        e.preventDefault();
        move(FORMATS.length - 1);
        break;
    }
  }

  return (
    <div className="formats" role="radiogroup" aria-label="Choose an event format">
      {FORMATS.map((format, i) => (
        <button
          type="button"
          className="format"
          role="radio"
          aria-checked={formatIndex === i}
          tabIndex={formatIndex === i ? 0 : -1}
          key={format.name}
          ref={(el) => {
            refs.current[i] = el;
          }}
          onClick={() => setFormatIndex(i)}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          <span className="format__glyph" aria-hidden="true">
            {format.glyph}
          </span>
          <strong className="format__name">{format.name}</strong>
          <small className="format__desc">{format.desc}</small>
          <span className="format__cta">{format.cta}</span>
        </button>
      ))}
    </div>
  );
}
