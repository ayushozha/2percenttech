'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import B from './B';
import { useLang } from './LangProvider';
import { createSponsorApplication } from '@/lib/store';
import { PACKAGES } from '@/lib/sponsor-data';
import { BUDGET_BANDS, SPONSOR_GOALS } from '@/lib/types';

/** "Sponsor a hackathon" — the actual application.

    Flow is decision first: the package cards are the selector, so the thing
    someone came to compare is also the thing they click. An earlier version
    listed the packages twice (chips in the form, cards in a sidebar), which
    made the page longer without making the choice easier.

    Only company, contact, email and one package are required. Goals, budget
    and message are optional, because every extra required field costs
    completions, and "Not sure yet" is a valid answer. */

type ErrKey = 'company' | 'contact' | 'email' | 'packages';
type Errors = Partial<Record<ErrKey, { zh: string; en: string }>>;

function Step({
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

function ChipRow({
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

export default function SponsorApplyForm() {
  const { lang } = useLang();
  const zh = lang === 'zh';

  const params = useSearchParams();
  const pre = params.get('package');
  const valid = pre && (PACKAGES.some((p) => p.id === pre) || pre === 'unsure') ? pre : null;

  const [packages, setPackages] = useState<string[]>(valid ? [valid] : []);
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const togglePackage = (id: string) => {
    setPackages((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
    setErrors((e) => ({ ...e, packages: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!packages.length) next.packages = { zh: '请先选择一个套餐。不确定也可以选「还不确定」。', en: 'Choose a package first. "Not sure yet" counts.' };
    if (!company.trim()) next.company = { zh: '请填写公司名称。', en: 'Please enter your company.' };
    if (!contact.trim()) next.contact = { zh: '请填写联系人姓名。', en: 'Please enter your name.' };
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()))
      next.email = { zh: '请输入有效的工作邮箱。', en: 'Please enter a valid work email.' };

    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    await createSponsorApplication({ company, contact, email, packages, goals, budget, message });
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
    const chosen = PACKAGES.filter((p) => packages.includes(p.id)).map((p) => (zh ? p.name.zh : p.name.en));
    if (packages.includes('unsure')) chosen.push(zh ? '还不确定' : 'Not sure yet');

    return (
      <div className="tintbox" style={{ padding: '44px 36px', maxWidth: 640, margin: '0 auto' }}>
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
          <B zh="申请已收到。" en="Application received." />
        </h2>
        <p className="body" style={{ margin: '10px 0 18px' }}>
          <B
            zh="我们会在两个工作日内回复，带上套餐建议、当天流程与可选档期。"
            en="We reply within two working days with a package recommendation, the day's funnel and available dates."
          />
        </p>

        <dl style={{ margin: 0, display: 'grid', gap: 10 }}>
          <div>
            <dt className="mono-label" style={{ fontSize: 10 }}>
              <B zh="公司" en="Company" />
            </dt>
            <dd style={{ margin: '2px 0 0', fontWeight: 600 }}>
              {company}, {contact}, {email}
            </dd>
          </div>
          <div>
            <dt className="mono-label" style={{ fontSize: 10 }}>
              <B zh="意向套餐" en="Interested in" />
            </dt>
            <dd style={{ margin: '2px 0 0', fontWeight: 600 }}>{chosen.join(' + ')}</dd>
          </div>
        </dl>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
          <Link href="/sponsor" className="btn btn-ghost btn-sm">
            <B zh="回到赞助方案" en="Back to the prospectus" />
          </Link>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDone(false)}>
            <B zh="再提一份" en="Submit another" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
      {/* ---- 01 · the decision, made on the packages themselves ---- */}
      <Step
        n="01"
        title={<B zh="选择套餐" en="Choose your package" />}
        hint={<B zh="可多选。不确定就选「还不确定」，我们会给建议。" en="Pick one or more. If you're not sure, say so and we'll advise." />}
      >
        <div className="pkg-grid">
          {PACKAGES.map((p) => {
            const on = packages.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => togglePackage(p.id)}
                className={`pkg-pick${on ? ' on' : ''}`}
              >
                <span className="pkg-pick-head">
                  <span className="pkg-pick-name">
                    <B zh={p.name.zh} en={p.name.en} />
                  </span>
                  {p.flag && (
                    <span className="badge badge-new" style={{ fontSize: 9.5, padding: '3px 9px' }}>
                      <B zh={p.flag.zh} en={p.flag.en} />
                    </span>
                  )}
                  <span className="pkg-tick" aria-hidden="true">
                    {on ? '✓' : ''}
                  </span>
                </span>

                <span className="pkg-pick-for">
                  <B zh={p.for.zh} en={p.for.en} />
                </span>

                {/* Full scope lives in the panel alongside, so the selector
                    stays short enough to compare all three at a glance. */}
                <span className="mono-label pkg-pick-fmt">
                  <B zh={p.format.zh} en={p.format.en} />
                  {' · '}
                  <B zh={`${p.items.length} 项服务`} en={`${p.items.length} included`} />
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <button
            type="button"
            className={`chip${packages.includes('unsure') ? ' on' : ''}`}
            aria-pressed={packages.includes('unsure')}
            onClick={() => togglePackage('unsure')}
            style={{ padding: '9px 16px', fontSize: 13.5 }}
          >
            {packages.includes('unsure') ? '✓ ' : ''}
            <B zh="还不确定，请给建议" en="Not sure yet, advise me" />
          </button>
          <span className="fine">
            <B zh="奖金、餐饮与付费场地另行计费。" en="Prize money, catering and paid venue costs are billed separately." />
          </span>
        </div>
        {err('packages')}
      </Step>

      {/* ---- 02 · who's asking ---- */}
      <Step n="02" title={<B zh="你是谁" en="About you" />}>
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

      {/* ---- 03 · what success looks like ---- */}
      <Step
        n="03"
        title={<B zh="你想要什么结果" en="What you're after" />}
        hint={<B zh="可选，但这是我们倒推方案的起点。" en="Optional, but it's what we shape the proposal around." />}
      >
        <div>
          <span className="field" style={{ marginBottom: 8, display: 'block' }}>
            <B zh="今年你被考核的指标" en="What you're measured on" />
          </span>
          <ChipRow
            options={SPONSOR_GOALS}
            selected={goals}
            onToggle={(id) => setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]))}
          />
        </div>

        <div>
          <span className="field" style={{ marginBottom: 8, display: 'block' }}>
            <B zh="预算区间" en="Budget range" />
          </span>
          <ChipRow
            options={BUDGET_BANDS}
            selected={budget ? [budget] : []}
            onToggle={(id) => setBudget(budget === id ? '' : id)}
          />
          <p className="fine" style={{ marginTop: 8 }}>
            <B zh="给个区间就够了，不是报价。" en="A band is enough. It isn't a commitment." />
          </p>
        </div>
      </Step>

      {/* ---- 04 · free text ---- */}
      <Step n="04" title={<B zh="还有什么想让我们知道" en="Anything else" />}>
        <label className="field">
          <span className="fine" style={{ fontWeight: 400 }}>
            <B zh="可选" en="Optional" />
          </span>
          <textarea
            className="input"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              zh ? '例如：想在 Q4 发布前，让开发者用上我们的推理 API。' : 'e.g. we want builders on our inference API before the Q4 launch.'
            }
            style={{ resize: 'vertical', fontFamily: 'var(--font-sans)', lineHeight: 1.55 }}
          />
        </label>
      </Step>

      <div>
        <button type="submit" className="btn btn-dark" disabled={busy}>
          <B zh="提交赞助申请 →" en="Send sponsorship request →" />
        </button>
        <p className="fine" style={{ marginTop: 12, lineHeight: 1.5, maxWidth: '60ch' }}>
          <B
            zh="我们在两个工作日内回复。这是演示站点，申请只保存在你的浏览器里，不会真的发送。"
            en="We reply within two working days. This is a demo site, so the request is stored in your browser and is not actually sent."
          />
        </p>
      </div>
    </form>
  );
}
