'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import B from './B';
import { useLang } from './LangProvider';
import { EVENT_PRODUCTS } from '@/lib/blueprint';
import { createHostRequest } from '@/lib/store';
import {
  ATTENDANCE_BANDS,
  BUDGET_BANDS,
  HOST_ACCESS,
  HOST_GOALS,
  HOST_MEDIA,
  HOST_NEEDS,
} from '@/lib/types';

/** "Host an event in Silicon Valley" — the full brief.

    Field set comes straight from blueprint §3: company and contact, goals and
    target audience, preferred dates / attendance / budget, venue-speaker-
    livestream requirements, promotion and media requirements, and developer /
    customer / investor access.

    Only company, contact, email and one event type are required. Everything
    else is optional — the blueprint expects an agent to "identify missing
    information and send follow-up questions", so an incomplete brief is a
    working lead, not a rejected one. The form says so rather than gating. */

type ErrKey = 'company' | 'contact' | 'email' | 'picks';
type Errors = Partial<Record<ErrKey, { zh: string; en: string }>>;

function ChipRow({
  options,
  selected,
  onToggle,
  small,
}: {
  options: { id: string; zh: string; en: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  small?: boolean;
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
            style={small ? { padding: '9px 16px', fontSize: 13.5 } : undefined}
          >
            {on ? '✓ ' : ''}
            <B zh={o.zh} en={o.en} />
          </button>
        );
      })}
    </div>
  );
}

function Step({ n, title, hint, children }: { n: string; title: React.ReactNode; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
      <legend className="mono-label" style={{ padding: 0, marginBottom: 4 }}>
        {n} · {title}
      </legend>
      {hint && (
        <p className="fine" style={{ margin: '0 0 12px' }}>
          {hint}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
    </fieldset>
  );
}

export default function HostApplyForm() {
  const { lang } = useLang();
  const zh = lang === 'zh';

  const params = useSearchParams();
  const typeParam = params.get('type');
  const validType = typeParam && EVENT_PRODUCTS.some((p) => p.id === typeParam) ? typeParam : null;

  // §3 · company and contact
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  // §3 · event type
  const [picks, setPicks] = useState<string[]>(validType ? [validType] : []);
  // §3 · goals and target audience
  const [goals, setGoals] = useState<string[]>([]);
  const [audience, setAudience] = useState('');
  // §3 · dates, attendance, budget
  const [dates, setDates] = useState('');
  const [attendance, setAttendance] = useState('');
  const [budget, setBudget] = useState('');
  // §3 · venue / speaker / livestream, media, access
  const [needs, setNeeds] = useState<string[]>([]);
  const [media, setMedia] = useState<string[]>([]);
  const [access, setAccess] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const mk = (list: string[], set: (v: string[]) => void) => (id: string) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!company.trim()) next.company = { zh: '请填写公司名称。', en: 'Please enter your company.' };
    if (!contact.trim()) next.contact = { zh: '请填写联系人姓名。', en: 'Please enter your name.' };
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()))
      next.email = { zh: '请输入有效的工作邮箱。', en: 'Please enter a valid work email.' };
    if (!picks.length) next.picks = { zh: '请至少选择一种活动形式。', en: 'Pick at least one event type.' };

    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    await createHostRequest({
      email,
      picks,
      company,
      contact,
      goals,
      audience,
      dates,
      attendance,
      budget,
      needs,
      media,
      access,
      message,
    });
    setBusy(false);
    setDone(true);
  }

  const err = (k: ErrKey) =>
    errors[k] ? (
      <span className="err" role="alert">
        <B zh={errors[k]!.zh} en={errors[k]!.en} />
      </span>
    ) : null;

  if (done) {
    const chosen = EVENT_PRODUCTS.filter((p) => picks.includes(p.id)).map((p) => (zh ? p.name.zh : p.name.en));
    return (
      <div className="tintbox" style={{ padding: '44px 36px', maxWidth: 640 }}>
        <div
          aria-hidden="true"
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            fontSize: 22,
            fontWeight: 700,
            background: 'linear-gradient(120deg,var(--violet),var(--orange))',
            marginBottom: 16,
          }}
        >
          ✓
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em' }}>
          <B zh="需求已收到。" en="Brief received." />
        </h2>
        <p className="body" style={{ margin: '10px 0 16px' }}>
          <B
            zh="我们会先确认信息是否完整，缺什么会直接问你，然后带着初步方案、场地与档期回来——两个工作日内。"
            en="We'll check the brief, come back with any questions on what's missing, and send an initial proposal with format, venue and dates — within two working days."
          />
        </p>
        <p style={{ fontWeight: 600, fontSize: 14.5 }}>
          {company} · {chosen.join(' + ')}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
          <Link href="/" className="btn btn-ghost btn-sm">
            <B zh="回到首页" en="Back to the site" />
          </Link>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDone(false)}>
            <B zh="再提一份" en="Submit another" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 28 }} noValidate>
      <Step n="01" title={<B zh="你是谁" en="Who you are" />}>
        <label className="field">
          <B zh="公司名称" en="Company" />
          <input
            className="input"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              setErrors((x) => ({ ...x, company: undefined }));
            }}
            placeholder="Northstar AI"
            autoComplete="organization"
          />
          {err('company')}
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
          <label className="field">
            <B zh="联系人姓名" en="Your name" />
            <input
              className="input"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                setErrors((x) => ({ ...x, contact: undefined }));
              }}
              placeholder="Priya Raman"
              autoComplete="name"
            />
            {err('contact')}
          </label>
          <label className="field">
            <B zh="工作邮箱" en="Work email" />
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((x) => ({ ...x, email: undefined }));
              }}
              placeholder="you@company.com"
              autoComplete="email"
            />
            {err('email')}
          </label>
        </div>
      </Step>

      <Step n="02" title={<B zh="活动形式" en="Event type" />} hint={<B zh="可多选。" en="Multiple welcome." />}>
        <ChipRow options={EVENT_PRODUCTS.map((p) => ({ id: p.id, zh: p.name.zh, en: p.name.en }))} selected={picks} onToggle={mk(picks, setPicks)} />
        {err('picks')}
      </Step>

      <Step
        n="03"
        title={<B zh="目标与目标受众" en="Goals and target audience" />}
        hint={<B zh="这是我们倒推方案的起点。" en="This is what we work the proposal backwards from." />}
      >
        <ChipRow options={HOST_GOALS} selected={goals} onToggle={mk(goals, setGoals)} small />
        <label className="field">
          <B zh="你想让谁到场？" en="Who do you want in the room?" />
          <input
            className="input"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder={zh ? '例如：做 agent 的后端工程师、早期创始人' : 'e.g. backend engineers building agents, early-stage founders'}
          />
        </label>
      </Step>

      <Step n="04" title={<B zh="档期、规模与预算" en="Dates, attendance and budget" />}>
        <label className="field">
          <B zh="期望档期" en="Preferred dates" />
          <input
            className="input"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
            placeholder={zh ? '例如：10 月下旬，或某个具体日期' : 'e.g. late October, or a specific date'}
          />
        </label>
        <div>
          <span className="field" style={{ marginBottom: 8, display: 'block' }}>
            <B zh="预期到场人数" en="Expected attendance" />
          </span>
          <ChipRow
            options={ATTENDANCE_BANDS}
            selected={attendance ? [attendance] : []}
            onToggle={(id) => setAttendance(attendance === id ? '' : id)}
            small
          />
        </div>
        <div>
          <span className="field" style={{ marginBottom: 8, display: 'block' }}>
            <B zh="预算区间" en="Budget range" />
          </span>
          <ChipRow options={BUDGET_BANDS} selected={budget ? [budget] : []} onToggle={(id) => setBudget(budget === id ? '' : id)} small />
        </div>
      </Step>

      <Step
        n="05"
        title={<B zh="场地、嘉宾与直播" en="Venue, speakers and livestream" />}
        hint={<B zh="勾选需要我们负责的部分。" en="Tick whatever you want us to own." />}
      >
        <ChipRow options={HOST_NEEDS} selected={needs} onToggle={mk(needs, setNeeds)} small />
      </Step>

      <Step
        n="06"
        title={<B zh="推广、短视频与媒体" en="Promotion, video and media" />}
        hint={
          <B
            zh="线下只能触达 100–200 人；这部分决定活动之外的覆盖。"
            en="The room holds 100–200 people; this is what determines the reach beyond it."
          />
        }
      >
        <ChipRow options={HOST_MEDIA} selected={media} onToggle={mk(media, setMedia)} small />
      </Step>

      <Step n="07" title={<B zh="开发者、客户与投资人" en="Developers, customers and investors" />}>
        <ChipRow options={HOST_ACCESS} selected={access} onToggle={mk(access, setAccess)} small />
      </Step>

      <Step n="08" title={<B zh="还有什么想让我们知道" en="Anything else" />}>
        <label className="field">
          <span className="fine" style={{ fontWeight: 400 }}>
            <B zh="可选" en="Optional" />
          </span>
          <textarea
            className="input"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={zh ? '背景、限制条件、已经确定的事项…' : 'Context, constraints, anything already decided…'}
            style={{ resize: 'vertical', fontFamily: 'var(--font-sans)', lineHeight: 1.55 }}
          />
        </label>
      </Step>

      <div>
        <button type="submit" className="btn btn-dark" disabled={busy}>
          <B zh="提交需求 →" en="Send the brief →" />
        </button>
        <p className="fine" style={{ marginTop: 12, lineHeight: 1.5 }}>
          <B
            zh="只有公司、联系人、邮箱与活动形式是必填。其余留空也没关系——缺什么我们会直接问你。这是演示站点，内容只保存在你的浏览器里，不会真的发送。"
            en="Only company, contact, email and event type are required. Leave the rest blank if you don't know yet — we'll follow up on what's missing. This is a demo site: the brief is stored in your browser and is not actually sent."
          />
        </p>
      </div>
    </form>
  );
}
