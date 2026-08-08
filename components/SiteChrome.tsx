'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { FORMATS } from '@/lib/data';
import IntakeModal from '@/components/IntakeModal';
import AgentPanel from '@/components/AgentPanel';
import AgentFab from '@/components/AgentFab';

/* The three pieces of state that cross section boundaries:

   - `formatIndex` is picked in the hero but read by the hero CTA and stamped
     onto every intake record.
   - `modal` is opened from ~16 buttons spread across five sections.
   - `agentOpen` is toggled from the header, the hero, the agent band and the
     floating launcher.

   Everything else stays local to its component. Keeping this provider at the
   root means the sections themselves can remain server components — only the
   buttons that call into it are client code. */

type SiteChromeValue = {
  formatIndex: number;
  formatName: string;
  setFormatIndex: (i: number) => void;
  openModal: (title: string) => void;
  closeModal: () => void;
  openAgent: () => void;
  closeAgent: () => void;
  closeAll: () => void;
  modal: string | null;
  agentOpen: boolean;
};

const SiteChromeContext = createContext<SiteChromeValue | null>(null);

export function useSiteChrome() {
  const ctx = useContext(SiteChromeContext);
  if (!ctx) throw new Error('useSiteChrome must be used inside <SiteChromeProvider>');
  return ctx;
}

export default function SiteChromeProvider({ children }: { children: ReactNode }) {
  const [formatIndex, setFormatIndex] = useState(0);
  const [modal, setModal] = useState<string | null>(null);
  const [agentOpen, setAgentOpen] = useState(false);

  // The modal and the agent panel are mutually exclusive — opening one closes
  // the other, matching the original design's behaviour.
  const openModal = useCallback((title: string) => {
    setModal(title);
    setAgentOpen(false);
  }, []);
  const closeModal = useCallback(() => setModal(null), []);
  const openAgent = useCallback(() => {
    setAgentOpen(true);
    setModal(null);
  }, []);
  const closeAgent = useCallback(() => setAgentOpen(false), []);
  const closeAll = useCallback(() => {
    setModal(null);
    setAgentOpen(false);
  }, []);

  const value = useMemo<SiteChromeValue>(
    () => ({
      formatIndex,
      formatName: FORMATS[formatIndex].name,
      setFormatIndex,
      openModal,
      closeModal,
      openAgent,
      closeAgent,
      closeAll,
      modal,
      agentOpen,
    }),
    [formatIndex, modal, agentOpen, openModal, closeModal, openAgent, closeAgent, closeAll],
  );

  return (
    <SiteChromeContext.Provider value={value}>
      {children}
      <AgentFab />
      <IntakeModal />
      <AgentPanel />
    </SiteChromeContext.Provider>
  );
}
