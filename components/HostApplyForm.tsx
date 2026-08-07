'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import B from './B';
import { ChipField, Step } from './FormBits';
import { useLang } from './LangProvider';
import { createHostRequest } from '@/lib/store';
import { EVENT_TYPES } from '@/lib/data';
import { EVENT_PRODUCTS } from '@/lib/blueprint';
import {
  ATTENDANCE_BANDS,
  BUDGET_BANDS,
  HOST_ACCESS,
  HOST_GOALS,
  HOST_MEDIA,
  HOST_NEEDS,
} from '@/lib/types';

/** The event brief — blueprint §3, the whole qualification set in one pass.

    Only the format and an email are required. Everything else is optional on
    purpose: the blueprint asks these questions so the proposal that comes back
    is specific, not so the form can refuse to submit. A brief with one format
    and an address is still a lead worth working, and the fields left blank are
    the first things we ask about on the call.

    Arrives pre-ticked from /host/[type] via ?type=<id>. */

type ErrKey = 'picks' | 'email' | 'submit';
type Errors = Partial<Record<ErrKey, { zh: string; en: string }>>;

export default function HostApplyForm() {
  const { lang } = useLang();
  const zh = lang === 'zh';

  const params = useSearchParams();
  const pre = params.get('type');
  const valid = pre && EVENT_TYPES.some((t) => t.id === pre) ? pre : null;

  const [picks, setPicks] = useState<string[]>(valid ? [valid] : []);
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [audience, setAudience] = useState('');
  const [dates, setDates] = useState('');
  const [attendance, setAttendance] = useState<string[]>([]);
  const [budget, setBudget] = useState<string[]>([]);
  const [needs, setNeeds] = useState<string[]>([]);
  const [media, setMedia] = useState<string[]>([]);
  const [access, setAccess] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const togglePick = (id: string) => {
    setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
    setErrors((e) => ({ ...e, picks: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const next: Errors = {};
    if (!picks.length)
      next.picks = {
        zh: '请先选择至少一种活动形式。',
        en: 'Pick at least one format first.',
      };
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()))
      next.email = { zh: '请输入有效的工作邮箱。', en: 'Please enter a valid work email.' };

    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      await createHostRequest({
        email: email.trim(),
        picks,
        company: company.trim(),
        contact: contact.trim(),
        goals,
        audience: audience.trim(),
        dates: dates.trim(),
        attendance: attendance[0] ?? '',
        budget: budget[0] ?? '',
        needs,
        media,
        access,
        message: message.trim(),
      });
      setDone(true);
    } catch {
      /* A real network call, so it can genuinely fail. Keep everything they
         typed and say so — someone who thinks they briefed us and hasn't is
         the worst outcome this form has. */
      setErrors({
        submit: {
          zh: '提交失败，请稍后重试，或直接发邮件给我们。',
          en: "That didn't go through. Please try again, or email us directly.",
        },
      });
    } finally {
      setBusy(false);
    }
  }

  const err = (k: ErrKey) =>
    errors[k] ? (
      <span className="err" role="alert">
        <B zh={errors[k]!.zh} en={errors[k]!.en} />
      </span>
    ) : null;

  if (done) {
    const chosen = EVENT_TYPES.filter((t) => picks.includes(t.id));
    const first = EVENT_PRODUCTS.find((p) => p.id === picks[0]);

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
          <B zh="简报已收到。" en="Brief received." />
        </h2>
        <p className="body" style={{ margin: '10px 0 18px' }}>
          <B
            zh="我们会在两个工作日内回复，带上形式建议、场地、可选档期与推广方案。"
            en="We reply within two working days with a format recommendation, a venue, available dates and how we'd promote it."
          />
        </p>

        <dl style={{ margin: 0, display: 'grid', gap: 10 }}>
          <div>
            <dt className="mono-label" style={{ fontSize: 10 }}>
              <B zh="活动形式" en="Format" />
            </dt>
            <dd style={{ margin: '2px 0 0', fontWeight: 600 }}>
              {chosen.map((t) => (zh ? t.zh : t.en)).join(' + ')}
            </dd>
          </div>
          <div>
            <dt className="mono-label" style={{ fontSize: 10 }}>
              <B zh="联系方式" en="Contact" />
            </dt>
            <dd style={{ margin: '2px 0 0', fontWeight: 600 }}>
              {[company, contact, email].filter(Boolean).join(', ')}
            </dd>
          </div>
        </dl>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
          {first && (
            <Link href={`/host/${first.id}`} className="btn btn-ghost btn-sm">
              <B zh={`了解${first.name.zh}`} en={`Read up on the ${first.name.en.toLowerCase()}`} />
            </Link>
          )}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDone(false)}>
            <B zh="再提一份" en="Submit another" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
      {/* ---- 01 · the format, picked on the products themselves ---- */}
      <Step
        n="01"
        title={<B zh="你想办什么" en="What you want to run" />}
        hint={
          <B
            zh="可多选。不确定就多选几个，我们会给建议。"
            en="Pick one or more. If you're torn, tick both and we'll advise."
          />
        }
      >
        <div className="pkg-grid">
          {EVENT_PRODUCTS.map((p) => {
            const on = picks.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => togglePick(p.id)}
                className={`pkg-pick${on ? ' on' : ''}`}
              >
                <span className="pkg-pick-head">
                  <span className="pkg-pick-name">
                    <B zh={p.name.zh} en={p.name.en} />
                  </span>
                  <span className="pkg-tick" aria-hidden="true">
                    {on ? '✓' : ''}
                  </span>
                </span>
                <span className="pkg-pick-for">
                  <B zh={p.tagline.zh} en={p.tagline.en} />
                </span>
              </button>
            );
          })}
        </div>
        {err('picks')}
      </Step>

      {/* ---- 02 · who's asking ----
          Only the email is required; a brief from someone who won't name their
          company yet is still one we want. */}
      <Step n="02" title={<B zh="你是谁" en="About you" />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
          <label className="field">
            <B zh="公司名称" en="Company" />
            <span className="fine" style={{ fontWeight: 400 }}>
              <B zh="可选" en="Optional" />
            </span>
            <input
              className="input"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Northstar AI"
              autoComplete="organization"
            />
          </label>

          <label className="field">
            <B zh="联系人姓名" en="Your name" />
            <span className="fine" style={{ fontWeight: 400 }}>
              <B zh="可选" en="Optional" />
            </span>
            <input
              className="input"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Priya Raman"
              autoComplete="name"
            />
          </label>
        </div>

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
      </Step>

      {/* ---- 03 · what success looks like ---- */}
      <Step
        n="03"
        title={<B zh="你想要什么结果" en="What you're after" />}
        hint={
          <B
            zh="可选，但这是我们倒推方案的起点。"
            en="Optional, but it's what we shape the proposal around."
          />
        }
      >
        <ChipField
          label={<B zh="这场活动要达成什么" en="What this event is for" />}
          options={HOST_GOALS}
          value={goals}
          onChange={setGoals}
        />

        <label className="field">
          <B zh="你希望房间里是谁" en="Who should be in the room" />
          <input
            className="input"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder={
              zh ? '例如：做 agent 的后端工程师、AI 初创 CTO' : 'e.g. backend engineers building agents, CTOs at AI startups'
            }
          />
        </label>
      </Step>

      {/* ---- 04 · shape of the day ---- */}
      <Step
        n="04"
        title={<B zh="规模与时间" en="Size and timing" />}
        hint={
          <B
            zh="给个大概就够了，都不是承诺。"
            en="Rough answers are fine. None of this is a commitment."
          />
        }
      >
        <label className="field">
          <B zh="期望档期" en="When you're thinking" />
          <input
            className="input"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
            placeholder={zh ? '例如：10 月中，或 Q4 任意时间' : 'e.g. mid-October, or anytime in Q4'}
          />
        </label>

        <ChipField
          label={<B zh="预期到场人数" en="Expected attendance" />}
          options={ATTENDANCE_BANDS}
          value={attendance}
          onChange={setAttendance}
          single
        />

        <ChipField
          label={<B zh="预算区间" en="Budget range" />}
          options={BUDGET_BANDS}
          value={budget}
          onChange={setBudget}
          single
          hint={<B zh="给个区间就够了，不是报价。" en="A band is enough. It isn't a quote." />}
        />
      </Step>

      {/* ---- 05 · what we're on the hook for ---- */}
      <Step
        n="05"
        title={<B zh="你需要我们做什么" en="What you need from us" />}
        hint={
          <B
            zh="勾掉的部分我们会假设你自己有安排。"
            en="Anything left unticked, we'll assume you've got covered."
          />
        }
      >
        <ChipField
          label={<B zh="场地、嘉宾与现场" en="Venue, speakers and the day itself" />}
          options={HOST_NEEDS}
          value={needs}
          onChange={setNeeds}
        />

        <ChipField
          label={<B zh="推广与内容" en="Promotion and content" />}
          options={HOST_MEDIA}
          value={media}
          onChange={setMedia}
        />

        <ChipField
          label={<B zh="到场人群" en="Who we bring" />}
          options={HOST_ACCESS}
          value={access}
          onChange={setAccess}
        />
      </Step>

      {/* ---- 06 · free text ---- */}
      <Step n="06" title={<B zh="还有什么想让我们知道" en="Anything else" />}>
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
              zh
                ? '例如：想在 Q4 发布前，让湾区开发者用上我们的推理 API。'
                : 'e.g. we want Bay Area developers on our inference API before the Q4 launch.'
            }
            style={{ resize: 'vertical', fontFamily: 'var(--font-sans)', lineHeight: 1.55 }}
          />
        </label>
      </Step>

      <div>
        <button type="submit" className="btn btn-dark" disabled={busy}>
          <B zh="提交活动简报 →" en="Send the brief →" />
        </button>
        {err('submit')}
        <p className="fine" style={{ marginTop: 12, lineHeight: 1.5, maxWidth: '60ch' }}>
          <B zh="我们在两个工作日内回复。" en="We reply within two working days." />
        </p>
      </div>
    </form>
  );
}
