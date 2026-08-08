'use client';

import type { ReactNode } from 'react';
import { useSiteChrome } from '@/components/SiteChrome';

/* Thin client wrappers so the sections around them can stay server components.
   Each one is just a <button> whose click reaches into SiteChrome. */

export function ModalButton({
  modal,
  className,
  children,
}: {
  modal: string;
  className: string;
  children: ReactNode;
}) {
  const { openModal } = useSiteChrome();
  return (
    <button type="button" className={className} onClick={() => openModal(modal)}>
      {children}
    </button>
  );
}

export function AgentButton({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const { openAgent } = useSiteChrome();
  return (
    <button type="button" className={className} onClick={openAgent}>
      {children}
    </button>
  );
}
