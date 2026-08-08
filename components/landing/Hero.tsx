import FormatPicker from '@/components/landing/FormatPicker';
import HeroCtas from '@/components/landing/HeroCtas';

export default function Hero() {
  return (
    <section className="hero" id="host">
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__inner shell">
        <p className="eyebrow-badge">
          <span className="eyebrow-badge__dot" aria-hidden="true" />
          The operating platform for the AI ecosystem
        </p>

        <h1 className="hero__title">
          Host an event in <span className="mark">Silicon&nbsp;Valley</span>
        </h1>

        <p className="hero__lead">
          Where AI companies, builders, investors, experts, and communities connect through
          high-impact events.
        </p>

        <FormatPicker />
        <HeroCtas />
      </div>
    </section>
  );
}
