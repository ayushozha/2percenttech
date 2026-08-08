import { EVENTS } from '@/lib/landing-data';
import { ModalButton } from '@/components/landing/ui/ActionButton';

export default function UpcomingEvents() {
  return (
    <section className="section section--white" id="upcoming">
      <div className="shell">
        <div className="section__head">
          <div>
            <p className="eyebrow">Upcoming events</p>
            <h2 className="section__title section__title--md">
              Join the next event or partner with one already in motion.
            </h2>
          </div>
        </div>

        <div className="upcoming">
          <div className="upcoming__list" aria-label="Upcoming events list">
            {EVENTS.map((event) => (
              <article
                className={`event${event.live ? ' event--live' : ''}`}
                key={event.title}
              >
                <div className="event__media">
                  <img
                    src={event.photo.src}
                    alt={event.photo.alt}
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="event__body">
                  <div className="event__meta">
                    <span className={`event__date${event.live ? ' event__date--live' : ''}`}>
                      {event.date}
                    </span>
                    <span className="event__kind">{event.kind}</span>
                  </div>

                  <h3 className="event__title">{event.title}</h3>
                  <p className="event__desc">{event.desc}</p>

                  <ul className="tags">
                    {event.tags.map((tag) => (
                      <li className={`tag${tag.accent ? ' tag--accent' : ''}`} key={tag.label}>
                        {tag.label}
                      </li>
                    ))}
                  </ul>

                  {(event.link || event.partnerModal) && (
                    <div className="event__actions">
                      {event.link && (
                        <a
                          className="btn btn--dark btn--xs"
                          href={event.link.href}
                          target="_blank"
                          rel="noopener"
                        >
                          {event.link.label}
                        </a>
                      )}
                      {event.partnerModal && (
                        <ModalButton modal={event.partnerModal} className="link-btn">
                          Partner with this Event
                        </ModalButton>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          <aside className="join-panel">
            <p className="eyebrow">Join or partner</p>
            <h3 className="join-panel__title">Want to join the next event?</h3>
            <div className="join-panel__actions">
              <ModalButton modal="Join as a Speaker" className="btn btn--dark btn--block">
                Join as a Speaker
              </ModalButton>
              <ModalButton modal="Join as an Investor" className="btn btn--paper btn--block">
                Join as an Investor
              </ModalButton>
              <ModalButton modal="Join as a Judge" className="btn btn--paper btn--block">
                Join as a Judge
              </ModalButton>
              <ModalButton
                modal="Partner with an Upcoming Event"
                className="btn btn--paper btn--block"
              >
                Partner with an Event
              </ModalButton>
            </div>
            <p className="join-panel__note">
              <strong>Suggested event keywords:</strong>{' '}
              <span>
                OpenAI, Mistral, Physical AI, World Models, Developer Platforms, Global
                Builder Communities.
              </span>
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
