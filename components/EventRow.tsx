import B from './B';
import type { EventRow } from '@/lib/data';

/** One line in the landing calendar's upcoming/past lists. The Stanford
    hackathon (`highlight: true`) — still undated, still unsold — gets pulled
    out into its own callout instead of sitting as one line among many.
    Shared by the Bright homepage and the archived /v4 landing so both read
    from the same calendar rendering. */
export default function Row({ e }: { e: EventRow }) {
  if (e.highlight) {
    return (
      <div className="tl-hi">
        <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr', gap: 12, alignItems: 'start' }}>
          <span className="tbd" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <B zh="8月底" en="LATE AUG" />
          </span>
          <span style={{ fontSize: 14.5, lineHeight: 1.5 }}>
            <strong>{e.name}</strong>
            <br />
            <span className="small" style={{ fontSize: 13 }}>
              {e.note && <B zh={e.note.zh} en={e.note.en} />}{' '}
              <a href="#top" style={{ fontWeight: 600 }}>
                ↑ <B zh="来聊聊" en="Talk to us" />
              </a>
            </span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="tl-row">
      <span className="tl-d">{e.date}</span>
      <span className="tl-n">
        {e.url ? (
          <a href={e.url} target="_blank" rel="noopener noreferrer">
            {e.name}
          </a>
        ) : (
          <strong>{e.name}</strong>
        )}
        {e.registered != null && (
          <span className="tl-reg">
            {' '}
            <B zh={`· ${e.registered.toLocaleString('en-US')} 人报名`} en={`· ${e.registered.toLocaleString('en-US')} registered`} />
          </span>
        )}
        {e.note && (
          <span className="tl-reg">
            {' '}
            <B zh={e.note.zh} en={e.note.en} />
          </span>
        )}
      </span>
    </div>
  );
}
