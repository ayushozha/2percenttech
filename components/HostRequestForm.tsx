'use client';

import { useState } from 'react';
import B from './B';
import { useLang } from './LangProvider';
import { EVENT_TYPES } from '@/lib/data';
import { createHostRequest } from '@/lib/store';

/** "What do you want to host?" — the landing page's primary conversion.

    Submissions land in the same store the dashboard reads, so a request made
    here shows up under Sponsor queries for an admin or organizer. */
export default function HostRequestForm() {
  const { lang } = useLang();
  const zh = lang === 'zh';

  const [picks, setPicks] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggle = (id: string) => {
    setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
    setError('');
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const em = email.trim();
    if (!picks.length) {
      setError(zh ? '请先选择至少一种活动类型。' : 'Pick at least one event type first.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) {
      setError(zh ? '请输入有效邮箱。' : 'Please enter a valid email.');
      return;
    }
    setBusy(true);
    await createHostRequest({ email: em, picks });
    setBusy(false);
    setDone(true);
    setError('');
  }

  if (done) {
    const labels = EVENT_TYPES.filter((t) => picks.includes(t.id)).map((t) => (zh ? t.zh : t.en));
    return (
      <div className="glass" style={{ marginTop: 30 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, padding: '6px 2px' }}>
          <div
            aria-hidden="true"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              fontSize: 20,
              fontWeight: 700,
              background: 'linear-gradient(120deg,oklch(0.55 0.2 300),oklch(0.62 0.19 25))',
            }}
          >
            ✓
          </div>
          <h3 style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 700, letterSpacing: '-.01em' }}>
            <B zh="已收到！" en="Request received." />
          </h3>
          <p style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink-2)' }}>
            {labels.join(' + ')} · {email}
          </p>
          <p className="small">
            <B
              zh="我们会在两个工作日内联系你，带着形式建议、场地与档期。"
              en="We'll be back within two working days with a format, a venue and dates."
            />
          </p>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 4 }}
            onClick={() => {
              setDone(false);
              setPicks([]);
              setEmail('');
            }}
          >
            <B zh="再提一个" en="Submit another" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="glass" style={{ marginTop: 30 }} onSubmit={onSubmit}>
      <p className="eyebrow eyebrow-muted" style={{ margin: '0 0 12px', letterSpacing: '.18em' }}>
        <B zh="你想办什么活动？" en="What do you want to host?" />
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {EVENT_TYPES.map((t) => {
          const on = picks.includes(t.id);
          return (
            <button
              key={t.id}
              type="button"
              className={`chip${on ? ' on' : ''}`}
              aria-pressed={on}
              onClick={() => toggle(t.id)}
            >
              {on ? '✓ ' : ''}
              <B zh={t.zh} en={t.en} />
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
        <input
          type="email"
          className="input input-pill"
          style={{ flex: '1 1 200px', minWidth: 0, width: 'auto' }}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder={zh ? '你的工作邮箱' : 'Your work email'}
          aria-label={zh ? '你的工作邮箱' : 'Your work email'}
        />
        <button type="submit" className="btn btn-dark" style={{ flex: '0 0 auto' }} disabled={busy}>
          <B zh="提交申请 →" en="Request to host →" />
        </button>
      </div>

      {error && (
        <p className="err" style={{ marginTop: 10 }} role="alert">
          {error}
        </p>
      )}

      <p className="fine" style={{ marginTop: 12, fontSize: 12.5, color: 'var(--ink-5)' }}>
        <B
          zh="可多选。不需要介绍人——我们会带着形式建议、场地、档期与推广方案回复你。"
          en="Multiple picks welcome. No introduction needed — we come back with the format, a venue, dates and how we'd promote it."
        />
      </p>
    </form>
  );
}
