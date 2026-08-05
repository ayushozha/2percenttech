import { COMPANIES, logoOf } from '@/lib/data';

/** Continuously scrolling logo wall.

    The track holds the company list twice and translates by exactly -50%, so
    the second copy is in the first's position when the animation loops and
    the seam is invisible. The duplicate is aria-hidden so screen readers and
    tab order see each company once.

    Each tile carries its own sampled background colour (LOGO_TILES) rather
    than one shared white field — a black mark and a lime one need different
    grounds to stay legible. */
export default function LogoMarquee({ seconds = 28 }: { seconds?: number }) {
  const tile = (c: (typeof COMPANIES)[number], copy: number) => {
    const art = logoOf(c.id);
    return (
      <a
        key={`${copy}-${c.id}`}
        className="logo-tile"
        href={c.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={copy === 1 ? c.name : undefined}
        aria-hidden={copy === 2 || undefined}
        tabIndex={copy === 2 ? -1 : undefined}
        style={{ background: art.tile }}
      >
        {art.src ? (
          <img src={art.src} alt={copy === 1 ? c.name : ''} loading="lazy" />
        ) : (
          <span style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</span>
        )}
      </a>
    );
  };

  return (
    <div className="marquee-mask" style={{ marginTop: 24 }}>
      <div className="marquee-track" style={{ ['--marquee-s' as string]: `${seconds}s` }}>
        {COMPANIES.map((c) => tile(c, 1))}
        {COMPANIES.map((c) => tile(c, 2))}
      </div>
    </div>
  );
}
