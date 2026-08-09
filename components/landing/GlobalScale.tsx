import { REGIONS } from '@/lib/landing-data';
import { ModalButton } from '@/components/landing/ui/ActionButton';

export default function GlobalScale() {
  return (
    <section className="global" id="global">
      <div className="shell global__inner">
        <div className="global__copy">
          <p className="eyebrow eyebrow--accent">
            Built in Silicon Valley. Distributed globally.
          </p>
          <h2 className="global__title">
            Scale beyond <span className="global__title-accent">the room.</span>
          </h2>
          <p className="global__lead">
            2% Tech is not just an event listing site. It is a scalable distribution system:
            Silicon Valley execution, livestreaming, content repackaging, satellite
            communities, and online-offline hackathon formats that expand reach far beyond a
            100–200 person venue.
          </p>
          <div className="global__ctas">
            <ModalButton
              modal="Become a Global Community Partner"
              className="btn btn--yellow-on-dark"
            >
              Become a Global Partner ↗
            </ModalButton>
            <ModalButton modal="Host a Satellite Event" className="btn btn--ghost-on-dark">
              Host a Satellite Event
            </ModalButton>
          </div>
        </div>

        <div
          className="orbit"
          role="img"
          aria-label="Illustration of a global community network radiating from Silicon Valley to North America, Europe, India, Southeast Asia, Latin America, and university and local communities"
        >
          <span className="orbit__ring orbit__ring--1" aria-hidden="true" />
          <span className="orbit__ring orbit__ring--2" aria-hidden="true" />
          <span className="orbit__ring orbit__ring--3" aria-hidden="true" />
          <span className="orbit__core" aria-hidden="true">
            <strong>2%</strong>
            <span>Silicon Valley</span>
          </span>
          {REGIONS.map((region) => (
            <span
              className={`orbit__pin ${region.className}`}
              aria-hidden="true"
              key={region.label}
            >
              {region.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
