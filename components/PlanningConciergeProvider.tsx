'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { buildPlannerOpening } from '@/lib/host-planning';
import { useLang } from './LangProvider';

type PlannerContext = {
  formatLabels?: string[];
  custom?: boolean;
};

type PlanningConciergeValue = {
  open: boolean;
  openingText: string;
  sessionKey: number;
  openPlanner: (context?: PlannerContext) => void;
  closePlanner: () => void;
};

const PlanningConciergeContext = createContext<PlanningConciergeValue | null>(null);

export function usePlanningConcierge(): PlanningConciergeValue {
  const value = useContext(PlanningConciergeContext);
  if (!value) throw new Error('usePlanningConcierge must be used within PlanningConciergeProvider');
  return value;
}

export default function PlanningConciergeProvider({ children }: { children: ReactNode }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<PlannerContext>({});
  const [sessionKey, setSessionKey] = useState(0);

  const value = useMemo<PlanningConciergeValue>(
    () => ({
      open,
      openingText: buildPlannerOpening(context.formatLabels ?? [], lang, context.custom),
      sessionKey,
      openPlanner(next = {}) {
        setContext(next);
        setSessionKey((key) => key + 1);
        setOpen(true);
      },
      closePlanner() {
        setOpen(false);
      },
    }),
    [context, lang, open, sessionKey],
  );

  return <PlanningConciergeContext.Provider value={value}>{children}</PlanningConciergeContext.Provider>;
}
