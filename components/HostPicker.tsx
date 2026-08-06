'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import B from './B';
import { EVENT_PRODUCTS } from '@/lib/blueprint';

/** The first thing on the site: pick an event product, go straight to the
    brief.

    The blueprint (§3) is explicit that nobody should need an introduction or
    a DM to work with us — the landing page presents the standardised
    products and the request form does the qualifying. So this deliberately
    has no quick-email shortcut: one intake path, not two competing ones. */
export default function HostPicker() {
  const router = useRouter();
  const [picked, setPicked] = useState<string | null>(null);

  const go = (id: string | null) => router.push(id ? `/host/apply?type=${id}` : '/host/apply');

  return (
    <div className="glass" style={{ marginTop: 30 }}>
      <p className="eyebrow eyebrow-muted" style={{ margin: '0 0 12px', letterSpacing: '.18em' }}>
        <B zh="你想办什么活动？" en="What do you want to host?" />
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 8 }}>
        {EVENT_PRODUCTS.map((p) => {
          const on = picked === p.id;
          return (
            <button
              key={p.id}
              type="button"
              className={`chip${on ? ' on' : ''}`}
              aria-pressed={on}
              onClick={() => setPicked(p.id)}
              onDoubleClick={() => go(p.id)}
              style={{ textAlign: 'left', padding: '12px 16px' }}
            >
              {on ? '✓ ' : ''}
              <B zh={p.name.zh} en={p.name.en} />
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="btn btn-dark" onClick={() => go(picked)}>
          {picked ? <B zh="继续填写需求 →" en="Continue to the brief →" /> : <B zh="开始填写需求 →" en="Start your brief →" />}
        </button>
        {picked && (
          <Link href={`/host/${picked}`} className="btn btn-ghost btn-sm">
            <B zh="先了解这个产品" en="See what's included" />
          </Link>
        )}
      </div>

      <p className="fine" style={{ marginTop: 12, fontSize: 12.5, color: 'var(--ink-5)' }}>
        <B
          zh="不需要介绍人，也不需要私聊——填完表单，我们带着方案、场地与档期回来。"
          en="No introduction and no DM needed — fill the brief and we come back with a proposal, a venue and dates."
        />
      </p>
    </div>
  );
}
