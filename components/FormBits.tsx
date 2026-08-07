'use client';

import B from './B';

/** The two pieces both application forms are built out of — the sponsorship
    request and the event brief. They were written twice before /host/apply
    existed; a chip that looks different on one form than the other is the
    thing this file prevents. */

export function Step({
  n,
  title,
  hint,
  children,
}: {
  n: string;
  title: React.ReactNode;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <span className="step-n">{n}</span>
        <h2 className="h-sub" style={{ display: 'inline', fontSize: 19 }}>
          {title}
        </h2>
        {hint && (
          <p className="fine" style={{ marginTop: 6 }}>
            {hint}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

export function ChipRow({
  options,
  selected,
  onToggle,
}: {
  options: { id: string; zh: string; en: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => {
        const on = selected.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            className={`chip${on ? ' on' : ''}`}
            aria-pressed={on}
            onClick={() => onToggle(o.id)}
            style={{ padding: '9px 16px', fontSize: 13.5 }}
          >
            {on ? '✓ ' : ''}
            <B zh={o.zh} en={o.en} />
          </button>
        );
      })}
    </div>
  );
}

/** A labelled group of chips. Multi-select unless `single` is set, in which
    case picking a second option replaces the first and picking the current one
    clears it — there is no chip group anywhere that can't be un-answered. */
export function ChipField({
  label,
  hint,
  options,
  value,
  onChange,
  single = false,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  options: { id: string; zh: string; en: string }[];
  value: string[];
  onChange: (next: string[]) => void;
  single?: boolean;
}) {
  const toggle = (id: string) => {
    if (single) onChange(value.includes(id) ? [] : [id]);
    else onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  };

  return (
    <div>
      <span className="field" style={{ marginBottom: 8, display: 'block' }}>
        {label}
      </span>
      <ChipRow options={options} selected={value} onToggle={toggle} />
      {hint && (
        <p className="fine" style={{ marginTop: 8 }}>
          {hint}
        </p>
      )}
    </div>
  );
}
