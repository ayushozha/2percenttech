'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import B from './B';
import { ATTENDEE_NETWORK_DISPLAY, EVENT_COUNT_DISPLAY } from '@/lib/site-metrics';
import { LangToggle } from './SiteNav';
import { PHOTOS } from '@/lib/data';
import { signIn, signUp, type AuthResult } from '@/lib/store';
import { SELECTABLE_ROLES, type Role } from '@/lib/types';

const ERRORS: Record<Exclude<AuthResult & { ok: false }, never>['error'], { zh: string; en: string }> = {
  email: { zh: '请输入有效邮箱。', en: 'Please enter a valid email.' },
  name: { zh: '请输入你的姓名。', en: 'Please enter your name.' },
  /* Covers every way the auth service rejects a password: too short, too
     common, or containing your own name or email. */
  short: {
    zh: '密码至少需要 8 位，且不能包含你的姓名或邮箱。',
    en: 'Password needs at least 8 characters and must not contain your name or email.',
  },
  taken: { zh: '该邮箱已注册，请直接登录。', en: 'That email already has an account. Sign in instead.' },
  nomatch: { zh: '邮箱或密码不匹配。', en: 'No match. Check the email and password.' },
  /* Rate limits, an unreachable API, a bad gateway — anything that isn't the
     person's fault. Saying so beats blaming their password. */
  unavailable: {
    zh: '暂时无法登录，请稍后再试。',
    en: "We couldn't sign you in just now. Please try again in a moment.",
  },
};

export default function AuthForm({ mode }: { mode: 'signin' | 'signup' }) {
  const router = useRouter();
  const isSignup = mode === 'signup';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [role, setRole] = useState<Role>('participant');
  const [error, setError] = useState<{ zh: string; en: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = isSignup ? await signUp(name, email, pass, role) : await signIn(email, pass);
    setBusy(false);

    if (res.ok) router.push('/dashboard');
    else setError(ERRORS[res.error]);
  }

  const clear = () => setError(null);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))' }}>
      {/* ---- left: the pitch ---- */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(150deg,var(--tint-violet),var(--tint-amber) 55%,var(--tint-blue))',
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 40,
        }}
      >
        <div
          className="blob"
          style={{
            width: 420,
            height: 420,
            background: 'radial-gradient(circle,rgba(255,255,255,.9),transparent 65%)',
            top: -120,
            right: -100,
            filter: 'blur(40px)',
            animationDuration: '22s',
          }}
        />

        <Link href="/" className="brand" style={{ position: 'relative', width: 'max-content', fontSize: 18 }}>
          <img src="/mark.svg" alt="2%Tech mark" width={30} height={30} style={{ borderRadius: 8 }} />
          <span>2%Tech</span>
        </Link>

        <div style={{ position: 'relative' }}>
          <h1 className="h-page">
            <span className="en">
              The room,
              <br />
              <em className="serif grad-2">backstage.</em>
            </span>
            <span className="zh zh-display">
              活动的
              <br />
              <em className="grad-2" style={{ fontStyle: 'normal' }}>
                后台。
              </em>
            </span>
          </h1>
          <p className="body" style={{ margin: '16px 0 0', fontSize: 15.5, maxWidth: '44ch' }}>
            <B
              zh="一个账号，管理 2%Tech 活动的所有幕后工作：黑客松运营、评审、赞助咨询，以及你自己的参赛项目。"
              en="One account for everything behind 2%Tech events: hackathon ops, judging, sponsor queries and your own submissions."
            />
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            {PHOTOS.slice(3, 6).map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                style={{
                  width: 120,
                  height: 88,
                  objectFit: 'cover',
                  borderRadius: 14,
                  transform: ['rotate(-2deg)', 'rotate(1.5deg) translateY(8px)', 'rotate(-1deg)'][i],
                  boxShadow: '0 16px 36px -16px rgba(96,72,150,.45)',
                }}
              />
            ))}
          </div>
        </div>

        <p className="mono-label" style={{ position: 'relative', fontSize: 11, letterSpacing: '.16em', color: 'var(--ink-4)' }}>
          <B
            zh={`${EVENT_COUNT_DISPLAY} 场活动 · ${ATTENDEE_NETWORK_DISPLAY} 到场者网络 · 旧金山湾区`}
            en={`${EVENT_COUNT_DISPLAY} events · ${ATTENDEE_NETWORK_DISPLAY} attendee network · SF Bay Area`}
          />
        </p>
      </div>

      {/* ---- right: the form ---- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 28px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 26, flexWrap: 'wrap' }}>
            {/* Two real routes rather than a client-side tab, so each state is
                linkable and the back button behaves. */}
            <div className="pillbar" style={{ background: '#fff' }}>
              <Link
                href="/signin"
                className={!isSignup ? 'on' : ''}
                style={{
                  padding: '8px 18px',
                  borderRadius: 999,
                  textDecoration: 'none',
                  font: '600 13.5px var(--font-sans)',
                  background: !isSignup ? 'var(--ink)' : 'transparent',
                  color: !isSignup ? 'var(--paper)' : 'var(--ink-4)',
                }}
              >
                <B zh="登录" en="Sign in" />
              </Link>
              <Link
                href="/signup"
                className={isSignup ? 'on' : ''}
                style={{
                  padding: '8px 18px',
                  borderRadius: 999,
                  textDecoration: 'none',
                  font: '600 13.5px var(--font-sans)',
                  background: isSignup ? 'var(--ink)' : 'transparent',
                  color: isSignup ? 'var(--paper)' : 'var(--ink-4)',
                }}
              >
                <B zh="注册" en="Create account" />
              </Link>
            </div>
            <LangToggle />
          </div>

          <h2 style={{ margin: '0 0 22px', fontSize: 28, fontWeight: 800, letterSpacing: '-.02em' }}>
            {isSignup ? <B zh="加入我们" en="Join the crew" /> : <B zh="欢迎回来" en="Welcome back" />}
          </h2>

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {isSignup && (
              <label className="field">
                <B zh="姓名" en="Full name" />
                <input
                  className="input"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clear();
                  }}
                  placeholder="Ada Lin"
                />
              </label>
            )}

            <label className="field">
              <B zh="邮箱" en="Email" />
              <input
                className="input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clear();
                }}
                placeholder="you@company.com"
              />
            </label>

            <label className="field">
              <B zh="密码" en="Password" />
              <input
                className="input"
                type="password"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                value={pass}
                onChange={(e) => {
                  setPass(e.target.value);
                  clear();
                }}
                placeholder="••••••••"
              />
            </label>

            {isSignup && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>
                  <B zh="我的身份是…" en="I am a…" />
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SELECTABLE_ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`chip${role === r.id ? ' on' : ''}`}
                      aria-pressed={role === r.id}
                      style={{ padding: '9px 16px', fontSize: 13.5 }}
                      onClick={() => setRole(r.id)}
                    >
                      <B zh={r.zh} en={r.en} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="err" role="alert">
                <B zh={error.zh} en={error.en} />
              </p>
            )}

            <button type="submit" className="btn btn-dark" style={{ marginTop: 6 }} disabled={busy}>
              {isSignup ? <B zh="注册 →" en="Create account →" /> : <B zh="登录 →" en="Sign in →" />}
            </button>
          </form>

          <p className="fine" style={{ marginTop: 20, lineHeight: 1.5 }}>
            <B
              zh="账号由 2%Tech 认证服务托管，密码经加密存储，登录状态保存在 httpOnly cookie 中。"
              en="Accounts are held by the 2% Tech authentication service. Passwords are hashed, and your session lives in an httpOnly cookie."
            />
          </p>
        </div>
      </div>
    </div>
  );
}
