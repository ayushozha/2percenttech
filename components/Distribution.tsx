import { TAKEAWAYS } from '@/lib/data';

export default function Distribution() {
  return (
    <section className="section" id="distribution">
      <div className="shell">
        <div className="section__head section__head--tight">
          <div>
            <p className="eyebrow">Livestream, clips and searchable content</p>
            <h2 className="section__title section__title--md">
              Every event should keep working after it ends.
            </h2>
          </div>
        </div>
        <p className="section__lead">
          2% Tech does more than host events. It captures live sessions, clips them,
          distributes them, and turns each event into searchable content that keeps
          delivering reach.
        </p>

        <div className="dist-grid">
          <article className="stat stat--accent">
            <strong className="stat__value">100%</strong>
            <span className="stat__label">livestream-first event approach</span>
          </article>

          <article className="stat">
            <strong className="stat__value">150K+</strong>
            <span className="stat__label">
              reachable founder, builder and ecosystem network
            </span>
          </article>

          <article className="dist-card">
            <div className="dist-card__media">
              <img
                src="/photos/02.webp"
                alt="A full room watching a panel session at a 2% Tech event"
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
              />
              <span className="dist-card__play" aria-hidden="true">
                ▶
              </span>
              <span className="dist-card__badge">Full livestream</span>
            </div>
            <div className="dist-card__body">
              <h3 className="dist-card__title">Live Broadcast</h3>
              <p className="dist-card__desc">
                Multi-channel livestreaming expands beyond the venue and creates durable
                assets.
              </p>
            </div>
          </article>

          <article className="dist-card">
            <div className="dist-card__media">
              <img
                src="/photos/16.webp"
                alt="A speaker presenting against a wall-sized LED screen"
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
              />
              <span className="dist-card__badge">Clipped &amp; captioned</span>
            </div>
            <div className="dist-card__body">
              <ul className="chips">
                <li className="chip">Short Clips</li>
                <li className="chip">Recap</li>
                <li className="chip">Takeaways</li>
              </ul>
              <h3 className="dist-card__title">Post-Event Content</h3>
              <p className="dist-card__desc">
                Short clips, plain-language summaries and transcripts make the event reusable
                and searchable.
              </p>
            </div>
          </article>

          <article className="takeaways">
            <h3 className="takeaways__title">Latest Event Takeaways</h3>
            <ol className="takeaways__list">
              {TAKEAWAYS.map((text, i) => (
                <li key={text}>
                  <span className="takeaways__num" aria-hidden="true">
                    {i + 1}
                  </span>
                  {text}
                </li>
              ))}
            </ol>
          </article>
        </div>
      </div>
    </section>
  );
}
