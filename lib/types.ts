export type Role = 'admin' | 'organizer' | 'judge' | 'participant';

export const ROLES: Role[] = ['admin', 'organizer', 'judge', 'participant'];

/** Roles a person may pick for themselves at signup. `admin` is deliberately
    absent — it is only ever granted to a seeded account. */
export const SELECTABLE_ROLES: { id: Role; zh: string; en: string }[] = [
  { id: 'participant', en: 'Participant', zh: '参赛者' },
  { id: 'judge', en: 'Judge', zh: '评委' },
  { id: 'organizer', en: 'Organizer', zh: '主办' },
];

export type User = {
  name: string;
  email: string;
  /** Demo only, stored in the clear. See the warning at the top of store.ts. */
  pass: string;
  role: Role;
};

export type Session = { name: string; email: string; role: Role };

export type QueryStatus = 'new' | 'contacted' | 'closed';

export const QUERY_STATUSES: QueryStatus[] = ['new', 'contacted', 'closed'];

/** A "want to host" enquiry submitted from the landing page form. */
export type HostRequest = {
  id: string;
  email: string;
  picks: string[];
  ts: string;
  status: QueryStatus;
};

export type Submission = {
  id: string;
  team: string;
  project: string;
  track: string;
  desc: string;
  /** judge email -> score 1..10 */
  scores: Record<string, number>;
  /** set when a participant entered it themselves */
  owner?: string;
};
