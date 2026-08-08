'use client';

import { useState } from 'react';
import { NAV_LINKS } from '@/lib/landing-data';
import { useSiteChrome } from '@/components/landing/SiteChrome';

export default function SiteHeader() {
  const { openAgent, openModal, closeAll } = useSiteChrome();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a
          className="brand"
          href="#top"
          onClick={() => {
            closeAll();
            setNavOpen(false);
          }}
        >
          <span className="brand__mark">2%TECH</span>
          <span className="sr-only">2% Tech — back to top</span>
        </a>

        <nav
          className={`site-nav${navOpen ? ' is-open' : ''}`}
          id="site-nav"
          aria-label="Primary"
          onClick={(e) => {
            if ((e.target as HTMLElement).tagName === 'A') setNavOpen(false);
          }}
        >
          {NAV_LINKS.map((link) => (
            <a href={link.href} key={link.href + link.label}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <button type="button" className="link-btn" onClick={openAgent}>
            Talk to Agent
          </button>
          <button
            type="button"
            className="btn btn--dark btn--sm"
            onClick={() => openModal('Host an Event')}
          >
            Start an Event
          </button>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={navOpen}
            aria-controls="site-nav"
            onClick={() => setNavOpen((v) => !v)}
          >
            <span className="nav-toggle__bars" aria-hidden="true" />
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
