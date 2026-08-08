import { ModalButton } from '@/components/ui/ActionButton';

export default function FinalCta() {
  return (
    <section className="section final-cta">
      <div className="shell">
        <p className="eyebrow">Ready to build within the Silicon Valley AI ecosystem?</p>
        <h2 className="final-cta__title">
          Bring your company, event or community into a{' '}
          <span className="mark mark--sm">higher-signal</span> network.
        </h2>
        <div className="final-cta__actions">
          <ModalButton modal="Host an Event" className="btn btn--dark btn--lg">
            Host an Event ↗
          </ModalButton>
          <ModalButton modal="Become a Community Partner" className="btn btn--paper btn--lg">
            Become a Community Partner
          </ModalButton>
        </div>
      </div>
    </section>
  );
}
