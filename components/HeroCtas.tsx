'use client';

import { useSiteChrome } from '@/components/SiteChrome';

export default function HeroCtas() {
  const { formatName, openModal, openAgent } = useSiteChrome();

  return (
    <div className="hero__ctas">
      <button
        type="button"
        className="btn btn--yellow btn--lg"
        onClick={() => openModal(`Host a ${formatName}`)}
      >
        Start your {formatName} ↗
      </button>

      <button type="button" className="agent-card" onClick={openAgent}>
        <span className="agent-card__avatar" aria-hidden="true">
          2%
        </span>
        <span className="agent-card__body">
          <strong>Talk to the 2% Tech Agent</strong>
          <span>Not sure which format? Ask.</span>
        </span>
      </button>

      <p className="hero__stamp">Built in Silicon Valley. Distributed globally.</p>
    </div>
  );
}
