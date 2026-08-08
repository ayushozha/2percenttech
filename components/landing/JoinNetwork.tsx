import { JOIN_CARDS } from '@/lib/landing-data';
import { ModalButton } from '@/components/landing/ui/ActionButton';

export default function JoinNetwork() {
  return (
    <section className="section" id="network">
      <div className="shell">
        <div className="section__head">
          <div>
            <p className="eyebrow">Join the global builder network</p>
            <h2 className="section__title">Choose how to join.</h2>
          </div>
          <p className="section__aside">
            Speaker, judge, investor, sponsor, technology partner, or community partner.
          </p>
        </div>

        <div className="join-grid">
          {JOIN_CARDS.map((card) => (
            <ModalButton
              modal={card.modal}
              className={`join-card${card.accent ? ' join-card--accent' : ''}`}
              key={card.num}
            >
              <span className="join-card__num">{card.num}</span>
              <h3 className="join-card__title">{card.title}</h3>
              <p className="join-card__desc">{card.desc}</p>
              <span className="join-card__cta">{card.cta}</span>
            </ModalButton>
          ))}
        </div>
      </div>
    </section>
  );
}
