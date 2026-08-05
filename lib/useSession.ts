'use client';

import { useEffect, useState } from 'react';
import { getSession } from './store';
import type { Session } from './types';

/** `undefined` = still reading storage, `null` = signed out.

    The distinction matters: the dashboard must not flash its members-only
    gate while the session is still being read, and the export build
    prerenders this HTML with no storage available at all. */
export function useSession(): Session | null | undefined {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    let live = true;
    getSession().then((s) => {
      if (live) setSession(s);
    });
    return () => {
      live = false;
    };
  }, []);

  return session;
}
