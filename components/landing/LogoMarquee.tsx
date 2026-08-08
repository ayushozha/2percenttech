import { MARQUEE_LOGOS } from '@/lib/landing-data';

/* The track holds two identical copies of the row and slides by exactly -50%,
   so the loop is seamless. The second copy is decorative — screen readers read
   the first one only. */
function Group({ hidden }: { hidden?: boolean }) {
  return (
    <span className="marquee__group" aria-hidden={hidden || undefined}>
      {MARQUEE_LOGOS.map((logo) => (
        <img
          src={`/logos/mq-${logo.slug}.png`}
          alt={hidden ? '' : logo.name}
          width={logo.width}
          height={logo.intrinsicHeight}
          loading="lazy"
          decoding="async"
          style={{ ['--h' as string]: `${logo.height}px` }}
          key={logo.slug}
        />
      ))}
    </span>
  );
}

export default function LogoMarquee() {
  return (
    <section className="marquee">
      <div className="shell">
        <p className="marquee__label">Recent collaborators &amp; speakers</p>
      </div>
      <div className="marquee__viewport" aria-label="Selected partner and ecosystem logos">
        <div className="marquee__track">
          <Group />
          <Group hidden />
        </div>
      </div>
    </section>
  );
}
