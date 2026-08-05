'use client';

import { useState } from 'react';
import B from './B';

/** The prospectus is still a draft: several fields are unconfirmed and marked
    with .tbd. This banner says so until someone dismisses it. Search the page
    for `tbd` to find everything outstanding. */
export default function DraftBanner() {
  const [gone, setGone] = useState(false);
  if (gone) return null;

  return (
    <div
      className="no-print"
      style={{ background: 'var(--flag-bg)', color: 'var(--flag-ink)', borderBottom: '1px solid var(--flag-rule)' }}
    >
      <div
        className="wrap"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '10px 28px', flexWrap: 'wrap' }}
      >
        <span style={{ fontSize: 13, fontWeight: 600 }}>
          <B
            zh="草稿 — 黄色高亮处为待你确认的信息，确认前请勿外发。"
            en="DRAFT — highlighted fields are unconfirmed. Do not send externally yet."
          />
        </span>
        <button
          type="button"
          onClick={() => setGone(true)}
          style={{
            background: 'transparent',
            border: '1px solid var(--flag-rule)',
            color: 'var(--flag-ink)',
            borderRadius: 999,
            padding: '6px 14px',
            font: '600 12.5px var(--font-sans)',
            cursor: 'pointer',
          }}
        >
          <B zh="确认无误，移除此条" en="Confirmed — remove" />
        </button>
      </div>
    </div>
  );
}
