# 2% Tech — Landing (v4)

Next.js implementation of the `2pct Landing v4` Claude Design file. Neo-brutalist
system: ink rules, hard offset shadows, Anton display type over Space Grotesk and
Space Mono.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → ./out
npm run typecheck
```

## Layout

```
app/
  layout.tsx        next/font (Anton, Space Grotesk, Space Mono) + metadata
  page.tsx          section composition
  globals.css       the whole design system, one file
components/
  SiteChrome.tsx    client provider: selected format, modal, agent panel
  ui/ActionButton   thin client wrappers so sections stay server components
  …                 one component per section
lib/data.ts         all copy, event records, photo mappings
public/             photos, marquee logos, favicon
design/             the original Claude Design export, for reference
```

`output: 'export'` in `next.config.mjs` — the page has no server-side work, so
the build produces plain files that any static host serves.

## State

Three things cross section boundaries and live in `SiteChrome`:

- **selected format** — picked in the hero, read by the hero CTA, stamped onto
  every intake record as `picks`
- **modal** — opened from ~16 buttons across five sections
- **agent panel** — toggled from the header, hero, agent band and floating launcher

Everything else is local. Sections are server components; only the buttons that
call into the provider are client code.

The intake form appends to `localStorage['2pct-host-requests']`:

```jsonc
{
  "kind": "host",
  "context": "Become a Sponsor",   // which button opened the modal
  "email": "…", "name": "…", "company": "…", "message": "…",
  "picks": ["Keynote / Launch"],   // format selected in the hero
  "ts": "2026-08-07T…Z",
  "status": "new"
}
```

Wiring this to a real endpoint means replacing the `try` block in
`components/IntakeModal.tsx`.

## Photography

Event photos come from the `2percenttech` project (`public/photos/*.webp`,
1200×900). They are mapped in `lib/data.ts`, not hard-coded in components:

| Slot | Photo |
| --- | --- |
| Frontier Signals #01 | `01` — AWS Builder Loft |
| Secure AI Builders | `07` — hands-on workshop |
| World Models | `03` — panel session |
| Global AI Hackathon | `04` — Bay Builders Hackathon |
| AI Go-to-Market | `14` — founder room |
| Live Broadcast card | `02` |
| Post-Event Content card | `16` |
| Gallery band | `09 11 10 08 15 06` |

Gallery tiles use a fixed `grid-auto-rows` height rather than per-tile
`aspect-ratio` — combined with `height: 100%` on a stretched grid item, an
aspect ratio derives the *width* from the row height and pushes wide tiles past
their column.

## Notes

- Marquee logos are white-on-transparent artwork sized for the dark band. The
  `width`/`intrinsicHeight` in `MARQUEE_LOGOS` must match the files: the browser
  derives each image's aspect ratio from them, and wrong values collapse the row.
- The footer wordmark is set in Anton rather than an image — the source
  `2pct-wordmark.png` could not be retrieved intact from the design project.
