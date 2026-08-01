# 2% Tech — Site

A Next.js site plus a single-file sponsorship prospectus, both bilingual (中文 / EN):

- **Homepage** (Next.js App Router: `app/`, `components/`, `lib/`) — who 2% Tech is:
  track record pulled from the [Luma profile](https://luma.com/user/usr-imLXdlHS1TlvX7X),
  the company wall, the sponsor target list, and upcoming events. Statically exported
  (`output: 'export'`), so it deploys as plain files to Vercel, GitHub Pages, or any host.
- **Sponsorship prospectus** (`sponsor.html` → `public/sponsor.built.html`) — the pitch
  for the one-day hackathon at Stanford (August 2026). Deliberately *not* a React page:
  it stays a self-contained single HTML file (fonts and logos inlined as data URIs) so it
  can be emailed around and printed to PDF. Served by the site at `/sponsor.built.html`.

**Status: draft.** Several fields are unconfirmed and are marked in the page with a
yellow highlight (`class="tbd"`). See [Unfinished](#unfinished) before sending it anywhere.

---

## Run

```bash
npm install
npm run dev          # dev server at http://localhost:3000
npm run build        # static export -> out/
```

Serve `out/` with any static file server, or deploy the repo to Vercel as-is.

## Asset pipeline (Python)

Two generated asset sets are committed so `npm run build` needs no Python. Regenerate
them when copy or logos change (requires `pip3 install fonttools brotli pillow`):

```bash
npm run prepare-assets    # -> public/fonts/*.woff2, public/logos/*.webp, lib/logo-tiles.json
npm run build:prospectus  # -> public/sponsor.built.html (single-file build)
```

- **Fonts** are subset to the glyphs the site uses — the Chinese face (ZCOOL) ships
  8.1 MB of glyphs and the site needs ~124 KB of them. Latin faces carry the full
  printable-ASCII set, so English copy edits never need a regeneration; **adding new
  Chinese characters does** — rerun `prepare-assets` after zh copy changes.
- **Logos** are trimmed to content, downscaled to tile size, and their sampled
  background colour lands in `lib/logo-tiles.json` so each mark sits on its own field.
- **The prospectus build** (`build.py`) additionally inlines everything as data URIs,
  because that file has to survive being emailed as one attachment and printed to PDF.

## Files

| Path | What it is |
|---|---|
| `app/`, `components/`, `lib/` | The Next.js homepage. `lib/data.ts` holds all content (companies, target seats, events, stats). |
| `sponsor.html` | Prospectus source. Edit this. Fonts load from local `.ttf` files; logos use `/*__BAKED__*/` placeholders resolved at build time. |
| `public/sponsor.built.html` | Generated prospectus. Deployable single file. Do not edit. |
| `public/fonts/`, `public/logos/`, `lib/logo-tiles.json` | Generated assets for the homepage. Do not edit — rerun `npm run prepare-assets`. |
| `build.py` | Prospectus build. |
| `tools/prepare_assets.py` | Homepage asset pipeline (font subsetting + logo processing). |
| `logos/` | Company logo source images, one per company id. |
| `*.ttf` | Font sources (see [Fonts](#fonts)). |

## Editing

### Companies

The homepage wall renders from `COMPANIES` in `lib/data.ts`; the prospectus wall from
the `COMPANIES` array near the bottom of `sponsor.html` (which also carries per-company
descriptions). Keep the `id`s in sync so both surfaces share the same logo art.

- Add a logo by dropping a file into `logos/` named after the `id` — `openai.png`,
  `nvidia.svg`, whatever. Matching ignores case, spaces and punctuation, so
  `Openai.png` and `mistral AI.png` both work. Outright misspellings go in the
  `ALIASES` map in `build.py` and `tools/prepare_assets.py` (there's one there now for
  a file named `NVDIA.png`). Then rerun `npm run prepare-assets`.
- On the prospectus, add `more:1` to an entry to move it behind the "view more" toggle.

### Judges and hosts

Plain markup in the Lineup section. The first twelve are always visible; the rest sit
inside `<details class="more">`. Move people between the two grids to re-rank them.

### Language

Every string exists twice. On the homepage use the `<B zh="…" en="…" />` component
(`components/B.tsx`); in `sponsor.html` write paired `<span class="zh">`/`<span
class="en">` spans. CSS on `#page[data-lang]` shows one and hides the other. **Any new
copy needs both** — a missing `en` half just renders as a gap when the reader toggles.
After adding new Chinese characters anywhere on the homepage, rerun
`npm run prepare-assets` so the subset font contains their glyphs.

### Placeholders

`class="tbd"` renders as a yellow highlight with a dashed underline. Use it for anything
not yet confirmed, and search for it to find everything outstanding.

## Print (prospectus)

Sponsors circulate the prospectus internally as a PDF, so printing is a supported
output, not an afterthought:

- Dark mode is forced back to white/black, the draft banner and nav are dropped, tier
  cards and table rows are kept from splitting across pages, and external links expand
  to show their URLs.
- A `beforeprint` handler opens every `<details>` first. Without it the collapsed half of
  the lineup and all the FAQ answers silently vanish from the PDF — a collapsed
  `<details>` isn't rendered at all.

If you restructure the page, keep both of those working.

## Fonts

| Face | Role | Licence |
|---|---|---|
| Anton | Latin display | SIL Open Font License 1.1 |
| IBM Plex Sans (400/600) | Body | SIL Open Font License 1.1 |
| ZCOOL QingKe HuangYou 站酷庆科黄油体 | Chinese display | SIL Open Font License 1.1 |

All three are redistributable under the OFL, which is why the `.ttf` sources are
committed — the asset pipeline won't run without them. They are only ever shipped
subset (as static WOFF2 for the homepage, inlined data URIs for the prospectus),
never as the full font files.

## Unfinished

On the homepage (`app/page.tsx` / `lib/data.ts`), highlighted in yellow:

- **Stanford hackathon date** — "late August", exact day not set. No Luma event page
  exists for it yet either; once it does, link the timeline row to it.
- **Contact email and WeChat** in the closing CTA.
- **The "Saved seats" target list** (Alibaba Cloud, Tencent Cloud, TRAE/ByteDance,
  DeepSeek, Moonshot, Zhipu, MiniMax, Anthropic) is a starting suggestion — confirm
  or edit it before publishing. It is labelled as a target list, not as sponsors.

On the prospectus, highlighted in yellow:

- **Event date** — "late August", exact day not set.
- **Expected headcount** for this event. (The 10,000 / 200 / 50 figures above it are
  cumulative across all past 2% Tech events, and are labelled as such — they are not
  this event's numbers.)
- **Pricing** — deliberately absent. Tiers route to a conversation instead.
- **Team pass counts** per tier.
- **Contact email and booking link** in the closing CTA.

Two things that are not marked on the page but need a decision:

- **The lineup is not confirmed.** All 29 people listed judged, hosted or volunteered at
  recent partner events — they have not agreed to attend this one. The section says so,
  twice. Do not remove that wording until individuals have actually confirmed.
- **The company wall is past attendance**, not sponsors or endorsers of this event, and
  carries a disclaimer to that effect. Same rule.

Two logo files should be replaced when better sources are available: `mistral AI.png`
carries a watermark grid, and `snyk.png` is a marketing banner with a tagline rather than
a mark.
