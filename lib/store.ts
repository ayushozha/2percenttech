/* ============================================================================
   DEMO PERSISTENCE — NOT A SECURITY BOUNDARY.

   Everything here lives in the browser's localStorage. That means:

     · Passwords are stored in the clear and compared in the clear.
     · Anyone can open devtools and rewrite their own role to "admin".
     · Data is per-browser; it is not shared, backed up or authoritative.

   This is a working prototype of the flows, not access control. Do not put
   anything real behind it and do not treat a `role` from here as trusted.

   The seam: every function below is async and returns plain data, so the
   localStorage bodies can be replaced with `fetch('/api/…')` without any
   caller changing. When that happens, drop `output: 'export'` from
   next.config.mjs, move the role checks server-side, and hash the passwords.
   ========================================================================= */

import type { Lead, QueryStatus, Session, Submission, User } from './types';
import { QUERY_STATUSES } from './types';

const K = {
  users: '2pct-users',
  session: '2pct-session',
  leads: '2pct-leads',
  submissions: '2pct-submissions',
} as const;

/** Pre-`kind` key. Entries there were all host requests; migrated on first read. */
const LEGACY_REQUESTS_KEY = '2pct-host-requests';

/* ---- raw localStorage helpers ------------------------------------------
   All reads are defensive: storage can be disabled (private mode, embedded
   webviews) and the contents can be hand-edited into nonsense. A bad read
   degrades to the seed rather than throwing through a render. */

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or disabled storage — the in-memory result still renders */
  }
}

/* ---- seed --------------------------------------------------------------
   Demo content so every screen has something to show on a fresh browser.
   Seeding is additive and idempotent: it never overwrites a key that
   already has content, so a signed-up account survives a reload. */

const DEMO_PASSWORD = 'demo2026';

const SEED_USERS: User[] = [
  { name: 'Ava Admin', email: 'admin@2pct.tech', pass: DEMO_PASSWORD, role: 'admin' },
  { name: 'Owen Organizer', email: 'organizer@2pct.tech', pass: DEMO_PASSWORD, role: 'organizer' },
  { name: 'Jia Judge', email: 'judge@2pct.tech', pass: DEMO_PASSWORD, role: 'judge' },
  { name: 'Ben Builder', email: 'builder@2pct.tech', pass: DEMO_PASSWORD, role: 'participant' },
];

export const DEMO_ACCOUNTS = SEED_USERS.map((u) => ({ email: u.email, role: u.role }));
export const DEMO_PASSWORD_LABEL = DEMO_PASSWORD;

const SEED_SUBMISSIONS: Submission[] = [
  {
    id: 's1',
    team: 'Latent Labs',
    project: 'VenueScout',
    track: 'Agentic AI',
    desc: 'An agent that scouts, negotiates and books Bay Area event venues end-to-end.',
    scores: {},
  },
  {
    id: 's2',
    team: 'Fork & Merge',
    project: 'PatchPilot',
    track: 'Dev Tools',
    desc: 'Auto-triages CI failures and opens ranked fix PRs before standup.',
    scores: {},
  },
  {
    id: 's3',
    team: 'Golden Gate Grads',
    project: 'SponsorMatch',
    track: 'Agentic AI',
    desc: 'Matches hackathons with sponsor briefs using event history and audience data.',
    scores: {},
  },
  {
    id: 's4',
    team: 'Null Island',
    project: 'CrowdCam',
    track: 'Physical AI',
    desc: 'Real-time crowd flow analytics for event ops from a single door camera.',
    scores: {},
  },
];

const SEED_LEADS: Lead[] = [
  {
    id: 'q1',
    kind: 'host',
    email: 'devrel@vectorbase.ai',
    picks: ['workshop', 'hackathon'],
    ts: '2026-08-01T18:20:00Z',
    status: 'new',
  },
  { id: 'q2', kind: 'host', email: 'events@cloudpeak.io', picks: ['keynote'], ts: '2026-07-28T02:11:00Z', status: 'contacted' },
  {
    id: 'q3',
    kind: 'host',
    email: 'maya@agentforge.dev',
    picks: ['panel', 'workshop'],
    ts: '2026-07-21T21:47:00Z',
    status: 'new',
  },
  {
    id: 'q4',
    kind: 'sponsor',
    email: 'partnerships@northstar.ai',
    company: 'Northstar AI',
    contact: 'Priya Raman',
    packages: ['exclusive'],
    goals: ['adoption', 'feedback'],
    budget: '50-100',
    message: 'Want our inference API in front of builders before the Q4 launch.',
    ts: '2026-08-02T16:05:00Z',
    status: 'new',
  },
  {
    id: 'q5',
    kind: 'sponsor',
    email: 'community@ridgeline.dev',
    company: 'Ridgeline',
    contact: 'Tom Okafor',
    packages: ['cohosted', 'unsure'],
    goals: ['awareness', 'hiring'],
    budget: 'under25',
    message: '',
    ts: '2026-07-30T09:40:00Z',
    status: 'contacted',
  },
];

let seeded = false;

/** Idempotent. Safe to call from every page that reads the store. */
export function seed(): void {
  if (seeded || typeof window === 'undefined') return;
  seeded = true;

  const users = read<User[]>(K.users, []);
  let changed = false;
  for (const demo of SEED_USERS) {
    if (!users.some((u) => u.email === demo.email)) {
      users.push(demo);
      changed = true;
    }
  }
  if (changed) write(K.users, users);

  if (!read<Submission[]>(K.submissions, []).length) write(K.submissions, SEED_SUBMISSIONS);

  // Migrate anything written before leads gained a `kind`, then seed only if
  // there is still nothing — so a browser with real enquiries keeps them.
  if (!read<Lead[]>(K.leads, []).length) {
    const legacy = read<Partial<Lead>[]>(LEGACY_REQUESTS_KEY, []);
    if (legacy.length) {
      write(
        K.leads,
        legacy.map((q, i) => ({
          id: q.id ?? `legacy-${i}`,
          kind: 'host' as const,
          email: q.email ?? '',
          picks: q.picks ?? [],
          ts: q.ts ?? '',
          status: (q.status ?? 'new') as QueryStatus,
        })),
      );
    } else {
      write(K.leads, SEED_LEADS);
    }
  }
}

/* ---- session ----------------------------------------------------------- */

export async function getSession(): Promise<Session | null> {
  seed();
  return read<Session | null>(K.session, null);
}

export async function signOut(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(K.session);
  } catch {
    /* ignore */
  }
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type AuthResult = { ok: true; session: Session } | { ok: false; error: 'email' | 'name' | 'short' | 'taken' | 'nomatch' };

export async function signIn(email: string, pass: string): Promise<AuthResult> {
  seed();
  const em = email.trim().toLowerCase();
  if (!EMAIL_RE.test(em)) return { ok: false, error: 'email' };

  const user = read<User[]>(K.users, []).find((u) => u.email === em && u.pass === pass);
  if (!user) return { ok: false, error: 'nomatch' };

  const session: Session = { name: user.name, email: user.email, role: user.role };
  write(K.session, session);
  return { ok: true, session };
}

export async function signUp(
  name: string,
  email: string,
  pass: string,
  role: Session['role'],
): Promise<AuthResult> {
  seed();
  const em = email.trim().toLowerCase();
  if (!EMAIL_RE.test(em)) return { ok: false, error: 'email' };
  if (!name.trim()) return { ok: false, error: 'name' };
  if (pass.length < 6) return { ok: false, error: 'short' };

  const users = read<User[]>(K.users, []);
  if (users.some((u) => u.email === em)) return { ok: false, error: 'taken' };

  const user: User = { name: name.trim(), email: em, pass, role };
  users.push(user);
  write(K.users, users);

  const session: Session = { name: user.name, email: user.email, role: user.role };
  write(K.session, session);
  return { ok: true, session };
}

export async function listUsers(): Promise<User[]> {
  seed();
  return read<User[]>(K.users, []);
}

/* ---- leads (host requests + sponsor applications) ---------------------- */

/** From the landing page: "what do you want to host?" */
export async function createHostRequest(email: string, picks: string[]): Promise<void> {
  seed();
  const all = read<Lead[]>(K.leads, []);
  all.push({
    id: `r-${Date.now()}`,
    kind: 'host',
    email: email.trim().toLowerCase(),
    picks,
    ts: new Date().toISOString(),
    status: 'new',
  });
  write(K.leads, all);
}

export type SponsorApplication = {
  company: string;
  contact: string;
  email: string;
  packages: string[];
  goals: string[];
  budget: string;
  message: string;
};

/** From /sponsor/apply. */
export async function createSponsorApplication(app: SponsorApplication): Promise<void> {
  seed();
  const all = read<Lead[]>(K.leads, []);
  all.push({
    id: `s-${Date.now()}`,
    kind: 'sponsor',
    email: app.email.trim().toLowerCase(),
    company: app.company.trim(),
    contact: app.contact.trim(),
    packages: app.packages,
    goals: app.goals,
    budget: app.budget,
    message: app.message.trim(),
    ts: new Date().toISOString(),
    status: 'new',
  });
  write(K.leads, all);
}

/** Newest first. Both kinds — the dashboard filters if it wants one. */
export async function listLeads(): Promise<Lead[]> {
  seed();
  return read<Lead[]>(K.leads, [])
    .slice()
    .sort((a, b) => (b.ts || '').localeCompare(a.ts || ''));
}

/** Advances new → contacted → closed → new. Returns the updated list. */
export async function cycleQueryStatus(id: string): Promise<Lead[]> {
  const all = read<Lead[]>(K.leads, []);
  const row = all.find((q) => q.id === id);
  if (row) {
    const i = QUERY_STATUSES.indexOf(row.status ?? 'new');
    row.status = QUERY_STATUSES[(i + 1) % QUERY_STATUSES.length] as QueryStatus;
    write(K.leads, all);
  }
  return listLeads();
}

/* ---- hackathon submissions --------------------------------------------- */

export async function listSubmissions(): Promise<Submission[]> {
  seed();
  return read<Submission[]>(K.submissions, []);
}

export async function setScore(id: string, judgeEmail: string, score: number): Promise<Submission[]> {
  const all = read<Submission[]>(K.submissions, []);
  const row = all.find((s) => s.id === id);
  if (row) {
    row.scores = { ...(row.scores ?? {}), [judgeEmail]: score };
    write(K.submissions, all);
  }
  return all;
}

export async function submitProject(
  owner: string,
  team: string,
  project: string,
  desc: string,
): Promise<Submission[]> {
  const all = read<Submission[]>(K.submissions, []);
  all.push({
    id: `u-${Date.now()}`,
    team: team.trim(),
    project: project.trim(),
    track: 'Open',
    desc: desc.trim(),
    scores: {},
    owner,
  });
  write(K.submissions, all);
  return all;
}

/** Mean of a submission's scores, or null when nobody has scored it. */
export function averageScore(s: Submission): string | null {
  const v = Object.values(s.scores ?? {});
  if (!v.length) return null;
  return (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1);
}
