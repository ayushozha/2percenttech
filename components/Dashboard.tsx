'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import B from './B';
import { LangToggle } from './SiteNav';
import { useLang } from './LangProvider';
import { useSession } from '@/lib/useSession';
import { UPCOMING, type Bi } from '@/lib/data';
import {
  averageScore,
  cycleQueryStatus,
  listQueries,
  listSubmissions,
  listUsers,
  setScore as persistScore,
  signOut,
  submitProject,
} from '@/lib/store';
import type { HostRequest, QueryStatus, Role, Session, Submission, User } from '@/lib/types';

/* ---- tabs --------------------------------------------------------------
   Which tabs a role sees. The prototype hardcoded `const role = 'admin'`,
   so only the admin set was ever reachable and the judge/organizer/
   participant views were dead code. This reads the role off the session, so
   all four sets work. */

type TabId = 'overview' | 'queries' | 'users' | 'events' | 'judging' | 'myhack';

const TAB_LABELS: Record<TabId, Bi> = {
  overview: { zh: '总览', en: 'Overview' },
  queries: { zh: '赞助咨询', en: 'Sponsor queries' },
  users: { zh: '用户', en: 'Users' },
  events: { zh: '活动', en: 'Events' },
  judging: { zh: '评审队列', en: 'Judging' },
  myhack: { zh: '我的黑客松', en: 'My hackathon' },
};

const TABS_BY_ROLE: Record<Role, TabId[]> = {
  admin: ['overview', 'queries', 'users', 'events'],
  organizer: ['events', 'queries'],
  judge: ['judging'],
  participant: ['events', 'myhack'],
};

const SUBLINE: Record<Role, Bi> = {
  admin: { zh: '活动、人员与赞助管线的全貌。', en: 'Everything across events, people and sponsor pipeline.' },
  organizer: { zh: '你的活动与赞助管线。', en: 'Your events and the sponsor pipeline.' },
  judge: { zh: '等待你打分的项目。', en: 'Projects waiting on your score.' },
  participant: { zh: '即将举行的活动与你的参赛项目。', en: 'Upcoming events and your hackathon entry.' },
};

const STATUS_LABEL: Record<QueryStatus, Bi> = {
  new: { zh: '新', en: 'new' },
  contacted: { zh: '已联系', en: 'contacted' },
  closed: { zh: '已关闭', en: 'closed' },
};

const bi = (v: Bi) => <B zh={v.zh} en={v.en} />;

function initials(name: string) {
  return (name || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function picksLabel(picks: string[]) {
  return picks.map((p) => p[0].toUpperCase() + p.slice(1)).join(' · ');
}

function shortDate(ts: string) {
  if (!ts) return '—';
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ---- gate -------------------------------------------------------------- */

function Gate() {
  return (
    <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '40px 28px' }}>
      <div className="tintbox" style={{ textAlign: 'center', maxWidth: 380, padding: '44px 36px' }}>
        <img src="/mark.svg" alt="" aria-hidden="true" width={44} height={44} style={{ borderRadius: 11, marginBottom: 16 }} />
        <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, letterSpacing: '-.02em' }}>
          <B zh="后台仅限成员访问" en="Backstage is members-only" />
        </h1>
        <p className="body" style={{ margin: '0 0 22px', fontSize: 14.5 }}>
          <B
            zh="登录后可查看你的活动、评审队列或赞助咨询。"
            en="Sign in to see your events, judging queue or sponsor queries."
          />
        </p>
        <Link href="/signin" className="btn btn-dark">
          <B zh="前往登录 →" en="Go to sign in →" />
        </Link>
      </div>
    </div>
  );
}

/* ---- dashboard --------------------------------------------------------- */

export default function Dashboard() {
  const session = useSession();
  const { lang } = useLang();

  const [tab, setTab] = useState<TabId | null>(null);
  const [queries, setQueries] = useState<HostRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);

  // Greeting depends on the local clock, so it is computed after mount —
  // deriving it during render would disagree with the prerendered HTML.
  const [greeting, setGreeting] = useState<Bi | null>(null);
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(
      h < 12
        ? { zh: '早上好，', en: 'Good morning,' }
        : h < 18
          ? { zh: '下午好，', en: 'Good afternoon,' }
          : { zh: '晚上好，', en: 'Good evening,' },
    );
  }, []);

  useEffect(() => {
    if (!session) return;
    let live = true;
    Promise.all([listQueries(), listUsers(), listSubmissions()]).then(([q, u, s]) => {
      if (!live) return;
      setQueries(q);
      setUsers(u);
      setSubs(s);
    });
    return () => {
      live = false;
    };
  }, [session]);

  const role = session?.role ?? 'participant';
  const tabs = TABS_BY_ROLE[role] ?? ['events'];
  // Fall back to the first allowed tab whenever the current one isn't in this
  // role's set — including right after sign-in as a different role.
  const active: TabId = tab && tabs.includes(tab) ? tab : tabs[0];

  const onCycle = useCallback(async (id: string) => setQueries(await cycleQueryStatus(id)), []);

  const onScore = useCallback(
    async (id: string, value: number, email: string) => {
      // Update locally first so the slider tracks the drag without waiting.
      setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, scores: { ...s.scores, [email]: value } } : s)));
      setSubs(await persistScore(id, email, value));
    },
    [],
  );

  if (session === undefined) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <p className="mono-label">
          <B zh="载入中…" en="Loading…" />
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="nav">
        <div className="nav-in">
          <Link href="/" className="brand">
            <img src="/mark.svg" alt="2% Tech mark" width={28} height={28} />
            <span>
              2% Tech <span className="brand-sub">· <B zh="后台" en="Backstage" /></span>
            </span>
          </Link>
          <div className="nav-actions">
            <LangToggle />
            {session && (
              <>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{session.name}</span>
                <span className={`badge badge-${session.role}`}>{session.role}</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={async () => {
                    await signOut();
                    window.location.href = '/signin/';
                  }}
                >
                  <B zh="退出登录" en="Sign out" />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {!session ? (
        <Gate />
      ) : (
        <div className="wrap" style={{ padding: '36px 28px 64px' }}>
          <h1 style={{ fontSize: 'clamp(28px,3.4vw,40px)', fontWeight: 800, letterSpacing: '-.03em' }}>
            {greeting ? bi(greeting) : null}{' '}
            <em className="serif grad-2">{(session.name || '').split(' ')[0]}.</em>
          </h1>
          <p style={{ margin: '8px 0 26px', fontSize: 14.5, color: 'var(--ink-5)' }}>{bi(SUBLINE[role])}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                className={`chip${t === active ? ' on' : ''}`}
                aria-pressed={t === active}
                style={{ fontSize: 13.5 }}
                onClick={() => setTab(t)}
              >
                {bi(TAB_LABELS[t])}
              </button>
            ))}
          </div>

          {active === 'overview' && (
            <Overview queries={queries} users={users} subs={subs} onCycle={onCycle} />
          )}
          {active === 'queries' && <Queries queries={queries} onCycle={onCycle} />}
          {active === 'users' && <Users users={users} />}
          {active === 'events' && <Events role={role} />}
          {active === 'judging' && <Judging subs={subs} session={session} onScore={onScore} />}
          {active === 'myhack' && <MyHack session={session} subs={subs} setSubs={setSubs} lang={lang} />}
        </div>
      )}
    </div>
  );
}

/* ---- panels ------------------------------------------------------------ */

function QueryRow({ q, onCycle }: { q: HostRequest; onCycle: (id: string) => void }) {
  return (
    <div className="row">
      <div style={{ flex: '1 1 220px', minWidth: 0 }}>
        <span style={{ display: 'block', fontWeight: 600, fontSize: 14.5, overflowWrap: 'anywhere' }}>{q.email}</span>
        <span className="small" style={{ display: 'block', marginTop: 2, fontSize: 12.5 }}>
          {picksLabel(q.picks)}
        </span>
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-6)' }}>{shortDate(q.ts)}</span>
      <button
        type="button"
        className={`badge badge-${q.status}`}
        onClick={() => onCycle(q.id)}
        title="Click to change status"
      >
        {bi(STATUS_LABEL[q.status])}
      </button>
    </div>
  );
}

function Overview({
  queries,
  users,
  subs,
  onCycle,
}: {
  queries: HostRequest[];
  users: User[];
  subs: Submission[];
  onCycle: (id: string) => void;
}) {
  const cards: { n: string; l: Bi }[] = [
    { n: String(users.length), l: { zh: '用户', en: 'Users' } },
    { n: String(queries.length), l: { zh: '赞助咨询', en: 'Sponsor queries' } },
    { n: String(subs.length), l: { zh: '参赛项目', en: 'Hackathon entries' } },
    { n: String(UPCOMING.length), l: { zh: '即将举行', en: 'Upcoming events' } },
  ];

  return (
    <>
      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', marginBottom: 36 }}>
        {cards.map((c) => (
          <div key={c.l.en} className="card">
            <span className="serif-num" style={{ fontSize: 44 }}>
              {c.n}
            </span>
            <span className="mono-label" style={{ display: 'block', marginTop: 8, fontSize: 10.5, letterSpacing: '.16em' }}>
              {bi(c.l)}
            </span>
          </div>
        ))}
      </div>

      <h2 className="h-sub" style={{ marginBottom: 14 }}>
        <B zh="最新赞助咨询" en="Latest sponsor queries" />
      </h2>
      <div className="stack">
        {queries.slice(0, 3).map((q) => (
          <QueryRow key={q.id} q={q} onCycle={onCycle} />
        ))}
        {!queries.length && (
          <p className="small">
            <B zh="暂无咨询。" en="No queries yet." />
          </p>
        )}
      </div>
    </>
  );
}

function Queries({ queries, onCycle }: { queries: HostRequest[]; onCycle: (id: string) => void }) {
  const fresh = queries.filter((q) => q.status === 'new').length;
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
        <h2 className="h-sub">
          <B zh="赞助咨询" en="Sponsor queries" />
        </h2>
        <span style={{ fontSize: 13, color: 'var(--ink-5)' }}>
          <B zh={`${fresh} 条新 / 共 ${queries.length} 条`} en={`${fresh} new of ${queries.length}`} />
        </span>
      </div>
      <div className="stack">
        {queries.map((q) => (
          <QueryRow key={q.id} q={q} onCycle={onCycle} />
        ))}
        {!queries.length && (
          <p className="small">
            <B zh="暂无咨询。" en="No queries yet." />
          </p>
        )}
      </div>
      <p className="fine" style={{ marginTop: 14, fontSize: 12.5 }}>
        <B
          zh="咨询由落地页表单实时写入。点击状态标签可在 新 → 已联系 → 已关闭 之间切换。"
          en="Queries land here live from the landing-page form. Click a status chip to move it new → contacted → closed."
        />
      </p>
    </>
  );
}

function Users({ users }: { users: User[] }) {
  return (
    <>
      <h2 className="h-sub" style={{ marginBottom: 14 }}>
        <B zh="用户" en="Users" />
      </h2>
      <div className="stack" style={{ gap: 8 }}>
        {users.map((u) => (
          <div key={u.email} className="row row-tight">
            <span className="avatar" aria-hidden="true">
              {initials(u.name)}
            </span>
            <span style={{ fontWeight: 600, fontSize: 14, flex: '1 1 160px' }}>{u.name}</span>
            <span className="small" style={{ flex: '1 1 200px', overflowWrap: 'anywhere' }}>
              {u.email}
            </span>
            <span className={`badge badge-${u.role}`}>{u.role}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function Events({ role }: { role: Role }) {
  return (
    <>
      <h2 className="h-sub" style={{ marginBottom: 14 }}>
        <B zh="即将举行的活动" en="Upcoming events" />
      </h2>
      <div className="stack">
        {UPCOMING.map((e) => (
          <div key={`${e.date}-${e.name}`} className="row" style={{ gap: 14, padding: '16px 18px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 500, width: 70, flex: '0 0 auto' }}>
              {e.highlight ? <B zh="8月底" en="Late Aug" /> : e.date}
            </span>
            <span style={{ fontWeight: 600, fontSize: 14.5, flex: '1 1 260px' }}>{e.name}</span>
            {e.note && (
              <span className="small" style={{ fontSize: 12.5, color: 'var(--ink-5)' }}>
                <B zh={e.note.zh} en={e.note.en} />
              </span>
            )}
            {e.url && (
              <a
                href={e.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
                style={{ background: 'transparent' }}
              >
                {role === 'participant' ? <B zh="报名 ↗" en="Register ↗" /> : <>Luma ↗</>}
              </a>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function Judging({
  subs,
  session,
  onScore,
}: {
  subs: Submission[];
  session: Session;
  onScore: (id: string, v: number, email: string) => void;
}) {
  const scored = subs.filter((s) => s.scores?.[session.email] != null).length;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
        <h2 className="h-sub">
          <B zh="评审队列 · Hackathon @ Stanford" en="Judging queue · Hackathon @ Stanford" />
        </h2>
        <span style={{ fontSize: 13, color: 'var(--ink-5)' }}>
          <B zh={`已评 ${scored} / ${subs.length}`} en={`${scored} of ${subs.length} scored`} />
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
        {subs.map((s) => {
          const mine = s.scores?.[session.email];
          const avg = averageScore(s);
          return (
            <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-.01em' }}>{s.project}</span>
                <span className="mono-label" style={{ fontSize: 10.5, letterSpacing: '.14em', color: 'var(--violet-deep)' }}>
                  {s.track}
                </span>
              </div>
              <span className="small">
                <B zh={`团队：${s.team}`} en={`by ${s.team}`} />
              </span>
              <p className="body" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
                {s.desc}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={mine ?? 5}
                  aria-label={`Score ${s.project} out of 10`}
                  onChange={(e) => onScore(s.id, Number(e.target.value), session.email)}
                  style={{ flex: 1, accentColor: 'var(--ink)' }}
                />
                <span className="serif-num" style={{ fontSize: 26, width: 34, textAlign: 'right' }}>
                  {mine ?? '—'}
                </span>
              </div>
              <span className="fine">
                {avg ? (
                  <B
                    zh={`评审均分：${avg} · ${Object.keys(s.scores).length} 位评委`}
                    en={`Panel average: ${avg} · ${Object.keys(s.scores).length} judge(s)`}
                  />
                ) : (
                  <B zh="暂无评分" en="No scores yet" />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function MyHack({
  session,
  subs,
  setSubs,
  lang,
}: {
  session: Session;
  subs: Submission[];
  setSubs: (s: Submission[]) => void;
  lang: 'zh' | 'en';
}) {
  const mine = useMemo(() => subs.find((s) => s.owner === session.email), [subs, session.email]);

  const [team, setTeam] = useState('');
  const [project, setProject] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!team.trim() || !project.trim() || !desc.trim()) {
      setError(lang === 'zh' ? '三项均为必填。' : 'All three fields are required.');
      return;
    }
    setSubs(await submitProject(session.email, team, project, desc));
    setError('');
  }

  return (
    <>
      <h2 className="h-sub" style={{ marginBottom: 14 }}>
        <B zh="我的黑客松 · 斯坦福，8 月底" en="My hackathon · Stanford, late August" />
      </h2>

      {mine ? (
        <div className="tintbox" style={{ maxWidth: 560, padding: 24 }}>
          <span className="mono-label" style={{ fontSize: 10.5, letterSpacing: '.18em', color: 'var(--flag-ink)' }}>
            <B zh="已提交 ✓" en="Submitted ✓" />
          </span>
          <h3 style={{ margin: '8px 0 2px', fontSize: 22, fontWeight: 800, letterSpacing: '-.01em' }}>{mine.project}</h3>
          <p className="small" style={{ margin: '0 0 6px', fontSize: 13.5 }}>
            <B zh={`团队：${mine.team}`} en={`by ${mine.team}`} />
          </p>
          <p style={{ margin: '0 0 14px', fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)' }}>{mine.desc}</p>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)' }}>
            {averageScore(mine) ? (
              <B zh={`当前评审均分：${averageScore(mine)} / 10`} en={`Panel average so far: ${averageScore(mine)} / 10`} />
            ) : (
              <B zh="评审开始后，分数会显示在这里。" en="Scores land here once judging opens." />
            )}
          </span>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="card" style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 14, padding: 24 }}>
          <p className="small" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
            <B
              zh="登记你的队伍与项目——评委会在他们的队列中看到它。"
              en="Register your team and project — judges will see it in their queue."
            />
          </p>

          <label className="field">
            <B zh="队伍名称" en="Team name" />
            <input
              className="input"
              value={team}
              onChange={(e) => {
                setTeam(e.target.value);
                setError('');
              }}
              placeholder="Latent Labs"
            />
          </label>

          <label className="field">
            <B zh="项目名称" en="Project name" />
            <input
              className="input"
              value={project}
              onChange={(e) => {
                setProject(e.target.value);
                setError('');
              }}
              placeholder={lang === 'zh' ? '你在做什么？' : 'What are you building?'}
            />
          </label>

          <label className="field">
            <B zh="一句话介绍" en="One-liner" />
            <input
              className="input"
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
                setError('');
              }}
              placeholder={lang === 'zh' ? '它为谁解决了什么问题' : 'It does X for Y so that Z'}
            />
          </label>

          {error && (
            <p className="err" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-dark" style={{ alignSelf: 'flex-start' }}>
            <B zh="提交项目 →" en="Submit project →" />
          </button>
        </form>
      )}
    </>
  );
}
