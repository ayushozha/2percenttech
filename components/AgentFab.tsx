'use client';

import { useSiteChrome } from '@/components/SiteChrome';

/* The floating launcher hides while the agent panel is open — they occupy the
   same corner. */
export default function AgentFab() {
  const { agentOpen, openAgent } = useSiteChrome();
  if (agentOpen) return null;

  return (
    <button type="button" className="agent-fab" onClick={openAgent}>
      <span className="agent-fab__avatar" aria-hidden="true">
        2%
      </span>
      <span>Talk to the 2% Tech Agent</span>
    </button>
  );
}
