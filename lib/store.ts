/* ============================================================================
   The data layer. Everything here is a call to api.2percenttech.com, which
   stores it in Postgres.

   This used to be localStorage, and the difference is not cosmetic: an enquiry
   submitted here is now something 2% Tech can actually read, and a `role` is
   something the server decides rather than something the browser claims. Role
   checks are enforced per request by the API — `TABS_BY_ROLE` in the dashboard
   only decides what to draw.

   Every function is async and returns plain data, which is what let the swap
   from localStorage happen without any caller changing shape.
   ========================================================================= */

import { api, ApiError } from './api';
import type { Lead, Session, Submission, User } from './types';

/* ---- session ------------------------------------------------------------ */

/** `null` when signed out — which is an ordinary answer, not an error, so the
    API returns 200 with a null body and the dashboard renders its gate. */
export async function getSession(): Promise<Session | null> {
  try {
    return await api<Session | null>('/api/auth/me');
  } catch {
    /* A session probe that fails for any reason means "not signed in" as far
       as the UI is concerned; it must never break the page render. */
    return null;
  }
}

export async function signOut(): Promise<void> {
  try {
    await api<{ ok: boolean }>('/api/auth/logout', { method: 'POST' });
  } catch {
    /* The cookies are cleared server-side on a best-effort basis; if the call
       fails the caller still navigates away. */
  }
}

/** The error codes the auth forms render messages for. */
export type AuthResult =
  | { ok: true; session: Session }
  | { ok: false; error: 'email' | 'name' | 'short' | 'taken' | 'nomatch' | 'unavailable' };

/* The API returns these codes directly; anything unrecognised (a rate limit, a
   bad gateway, the network) becomes `unavailable` so the form can say something
   true rather than blaming the user's credentials. */
const AUTH_CODES = new Set(['email', 'name', 'short', 'taken', 'nomatch']);

function authFailure(err: unknown): AuthResult {
  const code = err instanceof ApiError ? err.code : '';
  return { ok: false, error: AUTH_CODES.has(code) ? (code as 'email') : 'unavailable' };
}

export async function signIn(email: string, pass: string): Promise<AuthResult> {
  try {
    const session = await api<Session>('/api/auth/login', {
      method: 'POST',
      body: { email: email.trim().toLowerCase(), password: pass },
    });
    return { ok: true, session };
  } catch (err) {
    return authFailure(err);
  }
}

export async function signUp(
  name: string,
  email: string,
  pass: string,
  role: Session['role'],
): Promise<AuthResult> {
  try {
    const session = await api<Session>('/api/auth/signup', {
      method: 'POST',
      body: { name: name.trim(), email: email.trim().toLowerCase(), password: pass, role },
    });
    return { ok: true, session };
  } catch (err) {
    return authFailure(err);
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  await api('/api/auth/forgot-password', {
    method: 'POST',
    body: { email: email.trim().toLowerCase() },
  });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await api('/api/auth/reset-password', {
    method: 'POST',
    body: { token, new_password: newPassword },
  });
}

/** Admin only — the API returns 403 for anyone else. */
export async function listUsers(): Promise<User[]> {
  return api<User[]>('/api/users');
}

/* ---- leads (host requests + sponsor applications) ---------------------- */

export type HostRequestInput = {
  email: string;
  picks: string[];
  company?: string;
  contact?: string;
  goals?: string[];
  audience?: string;
  dates?: string;
  attendance?: string;
  budget?: string;
  needs?: string[];
  media?: string[];
  access?: string[];
  message?: string;
};

/** "Host an event in Silicon Valley" — from the landing page form. */
export async function createHostRequest(input: HostRequestInput): Promise<void> {
  await api<Lead>('/api/leads', { method: 'POST', body: { kind: 'host', ...input } });
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
  await api<Lead>('/api/leads', { method: 'POST', body: { kind: 'sponsor', ...app } });
}

/** Newest first, both kinds. Admin and organizer only. */
export async function listLeads(): Promise<Lead[]> {
  return api<Lead[]>('/api/leads');
}

/** Advances new → contacted → closed → new and returns the updated lead.
    The rotation happens in SQL so two dashboards working the same inbox cannot
    both read `new` and both write `contacted`. */
export async function cycleQueryStatus(id: string): Promise<Lead> {
  return api<Lead>(`/api/leads/${encodeURIComponent(id)}/status`, { method: 'PATCH' });
}

/* ---- hackathon submissions --------------------------------------------- */

export async function listSubmissions(): Promise<Submission[]> {
  return api<Submission[]>('/api/submissions');
}

/** Judges only. Returns nothing useful — callers re-read the list. */
export async function setScore(id: string, _judgeEmail: string, score: number): Promise<void> {
  await api(`/api/submissions/${encodeURIComponent(id)}/score`, { method: 'PUT', body: { score } });
}

/** Participants only. The owner is taken from the session server-side. */
export async function submitProject(
  _owner: string,
  team: string,
  project: string,
  desc: string,
): Promise<Submission> {
  return api<Submission>('/api/submissions', {
    method: 'POST',
    body: { team, project, desc },
  });
}

/** Mean of a submission's scores, or null when nobody has scored it.
    Pure — no storage, no network. */
export function averageScore(s: Submission): string | null {
  const v = Object.values(s.scores ?? {});
  if (!v.length) return null;
  return (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1);
}
