import { CONTACT_EMAIL, FOOTER_COLUMNS } from '@/lib/landing-data';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="wordmark" role="img" aria-label="2% Tech">
          <span className="wordmark__text" aria-hidden="true">
            2%TECH
          </span>
        </div>

        <div className="footer-grid">
          <div>
            <strong className="footer-brand">2% Tech</strong>
            <p className="footer-blurb">
              The operating platform for the AI ecosystem—connecting companies, builders,
              investors, experts, and communities through events, content, and opportunities.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav className="footer-col" aria-label={column.title} key={column.title}>
              <strong className="footer-col__title">{column.title}</strong>
              {column.links.map((link) => (
                <a href={link.href} key={link.label}>
                  {link.label}
                </a>
              ))}
            </nav>
          ))}

          <div className="footer-col">
            <strong className="footer-col__title">Contact</strong>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <span className="footer-col__muted">San Francisco Bay Area</span>
          </div>
        </div>

        <div className="footer-bar">
          <span>© 2026 2% Tech</span>
          <span>Built in Silicon Valley. Distributed globally.</span>
        </div>
      </div>
    </footer>
  );
}
