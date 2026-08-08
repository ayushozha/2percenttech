import { GALLERY } from '@/lib/data';

/* A photographic break between the distribution grid and the agent CTA — the
   page is otherwise almost entirely type and rules, and the room shots are the
   proof behind the numbers above. */
export default function EventGallery() {
  return (
    <section className="section gallery-section">
      <div className="shell">
        <div className="section__head">
          <div>
            <p className="eyebrow">From recent events</p>
            <h2 className="section__title section__title--md">
              This is what the room looks like.
            </h2>
          </div>
          <p className="section__aside">
            Hackathons, workshops, panels and demo days across the Bay Area — every one of
            them livestreamed and clipped.
          </p>
        </div>

        <ul className="gallery">
          {GALLERY.map((shot) => (
            <li className={`gallery__item${shot.wide ? ' gallery__item--wide' : ''}`} key={shot.src}>
              <figure className="gallery__figure">
                <img
                  src={shot.src}
                  alt={shot.alt}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="gallery__caption">{shot.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
