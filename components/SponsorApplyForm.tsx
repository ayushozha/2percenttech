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

    The prospectus sells; this is where someone acts on it. It asks for the
    minimum needed to come back with a real proposal (who, which package, what
    they're measured on, rough budget) and nothing else — every extra required
    field costs completions.

    Submissions land in the same inbox as the landing page's host requests,
    so whoever works the pipeline sees one list. */

type Errors = Partial<Record<'company' | 'contact' | 'email' | 'packages', { zh: string; en: string }>>;

const T = {
  company: { zh: '公司名称', en: 'Company' },
  contact: { zh: '联系人姓名', en: 'Your name' },
  email: { zh: '工作邮箱', en: 'Work email' },
  budgetNone: { zh: '暂不透露', en: 'Rather not say' },
};

export default function SponsorApplyForm() {
  const { lang } = useLang();
  const zh = lang === 'zh';

  // Each package card on the prospectus deep-links here with its own id, so
  // arriving from "Apply for this package" starts with that one ticked.
  const params = useSearchParams();
  const preselect = params.get('package');
  const valid = preselect && (PACKAGES.some((p) => p.id === preselect) || preselect === 'unsure') ? preselect : null;

  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [packages, setPackages] = useState<string[]>(valid ? [valid] : []);
  const [goals, setGoals] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const toggle = (list: string[], set: (v: string[]) => void, id: string) => {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
    setErrors((e) => ({ ...e, packages: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const next: Errors = {};
    if (!company.trim()) next.company = { zh: '请填写公司名称。', en: 'Please enter your company.' };
    if (!contact.trim()) next.contact = { zh: '请填写联系人姓名。', en: 'Please enter your name.' };
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()))
      next.email = { zh: '请输入有效的工作邮箱。', en: 'Please enter a valid work email.' };
    if (!packages.length)
      next.packages = { zh: '请至少选择一个套餐（不确定也可以）。', en: 'Pick at least one — "Not sure yet" is fine.' };

    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    await createSponsorApplication({ company, contact, email, packages, goals, budget, message });
    setBusy(false);
    setDone(true);
  }

  if (done) {
    const chosen = PACKAGES.filter((p) => packages.includes(p.id)).map((p) => (zh ? p.name.zh : p.name.en));
    if (packages.includes('unsure')) chosen.push(zh ? '还不确定' : 'Not sure yet');

    return (
      <div className="tintbox" style={{ padding: '44px 36px', maxWidth: 620 }}>
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
            zh="我们会在两个工作日内回复，带上适合你的套餐建议、当天流程与档期。"
            en="We'll come back within two working days with a package recommendation, the day's funnel and available dates."
          />
        </p>

        <dl style={{ margin: 0, display: 'grid', gap: 10 }}>
          <div>
            <dt className="mono-label" style={{ fontSize: 10 }}>
              <B zh="公司" en="Company" />
            </dt>
            <dd style={{ margin: '2px 0 0', fontWeight: 600 }}>
              {company} — {contact} · {email}
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

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <span className="err" role="alert">
        <B zh={errors[k]!.zh} en={errors[k]!.en} />
      </span>
    ) : null;

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 620, display: 'flex', flexDirection: 'column', gap: 26 }} noValidate>
      {/* ---- who ---- */}
      <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <legend className="mono-label" style={{ padding: 0, marginBottom: 4 }}>
          <B zh="01 · 你是谁" en="01 · Who you are" />
        </legend>

        <label className="field">
          <B zh={T.company.zh} en={T.company.en} />
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
            <B zh={T.contact.zh} en={T.contact.en} />
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
            <B zh={T.email.zh} en={T.email.en} />
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
      </fieldset>

      {/* ---- package ---- */}
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="mono-label" style={{ padding: 0, marginBottom: 4 }}>
          <B zh="02 · 你想要哪种合作" en="02 · Which package" />
        </legend>
        <p className="fine" style={{ margin: '0 0 12px' }}>
          <B zh="可多选。不确定也没关系——我们会给建议。" en="Multiple welcome. Not sure is fine — we'll advise." />
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PACKAGES.map((p) => {
            const on = packages.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                className={`chip${on ? ' on' : ''}`}
                aria-pressed={on}
                onClick={() => toggle(packages, setPackages, p.id)}
              >
                {on ? '✓ ' : ''}
                <B zh={p.name.zh} en={p.name.en} />
              </button>
            );
          })}
          <button
            type="button"
            className={`chip${packages.includes('unsure') ? ' on' : ''}`}
            aria-pressed={packages.includes('unsure')}
            onClick={() => toggle(packages, setPackages, 'unsure')}
          >
            {packages.includes('unsure') ? '✓ ' : ''}
            <B zh="还不确定" en="Not sure yet" />
          </button>
        </div>
        <div style={{ marginTop: 8 }}>{err('packages')}</div>
      </fieldset>

      {/* ---- goals ---- */}
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="mono-label" style={{ padding: 0, marginBottom: 4 }}>
          <B zh="03 · 你今年的指标是什么" en="03 · What you're measured on" />
        </legend>
        <p className="fine" style={{ margin: '0 0 12px' }}>
          <B zh="可选，但填了我们能倒推该给你哪个方案。" en="Optional — but it's what we work backwards from." />
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SPONSOR_GOALS.map((g) => {
            const on = goals.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                className={`chip${on ? ' on' : ''}`}
                aria-pressed={on}
                style={{ padding: '9px 16px', fontSize: 13.5 }}
                onClick={() => toggle(goals, setGoals, g.id)}
              >
                {on ? '✓ ' : ''}
                <B zh={g.zh} en={g.en} />
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* ---- budget ---- */}
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="mono-label" style={{ padding: 0, marginBottom: 4 }}>
          <B zh="04 · 预算区间" en="04 · Budget range" />
        </legend>
        <p className="fine" style={{ margin: '0 0 12px' }}>
          <B
            zh="可选。给个区间就够了，不是报价——奖金与餐饮另计。"
            en="Optional, and not a quote — a band is enough. Prize money and catering are billed separately."
          />
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {BUDGET_BANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`chip${budget === b.id ? ' on' : ''}`}
              aria-pressed={budget === b.id}
              style={{ padding: '9px 16px', fontSize: 13.5 }}
              onClick={() => setBudget(budget === b.id ? '' : b.id)}
            >
              <B zh={b.zh} en={b.en} />
            </button>
          ))}
        </div>
      </fieldset>

      {/* ---- message ---- */}
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="mono-label" style={{ padding: 0, marginBottom: 4 }}>
          <B zh="05 · 还有什么想让我们知道" en="05 · Anything else" />
        </legend>
        <label className="field" style={{ marginTop: 12 }}>
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
      </fieldset>

      <div>
        <button type="submit" className="btn btn-dark" disabled={busy}>
          <B zh="提交赞助申请 →" en="Send sponsorship request →" />
        </button>
        <p className="fine" style={{ marginTop: 12, lineHeight: 1.5 }}>
          <B
            zh="提交后我们会在两个工作日内回复。这是演示站点，内容只保存在你的浏览器里，不会真的发送。"
            en="We reply within two working days. This is a demo site — the request is stored in your browser and is not actually sent."
          />
        </p>
      </div>
    </form>
  );
}
