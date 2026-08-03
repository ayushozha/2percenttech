# 2% Tech — Site

Two pages, both bilingual (中文 / EN) and self-contained:

- **Homepage** (`home.html` → `docs/index.html`) — who 2% Tech is: track record
  pulled from the [Luma profile](https://luma.com/user/usr-imLXdlHS1TlvX7X), the
  company wall, the sponsor target list, and upcoming events.
- **Sponsorship prospectus** (`sponsor.html` → `docs/sponsor.built.html`) — the pitch
  for the one-day hackathon at Stanford (August 2026). Print-friendly.

`docs/` is the deployable site root — point GitHub Pages (or any static host) at it.

**Status: draft.** Several fields are unconfirmed and are marked in the page with a
yellow highlight (`class="tbd"`). See [Unfinished](#unfinished) before sending it anywhere.

---

## Two ways to use this

**Just need pages to host?** Serve the `docs/` folder — `docs/index.html` (homepage)
and `docs/sponsor.built.html` (prospectus). Each is a single file with fonts, logos
and scripts all inlined — no build step, no external requests, no dependencies. They
work opened straight from disk.

**Editing?** Work from `home.html` and `sponsor.html`. The structure, styles and copy
all live there; everything in `docs/` is generated output and should never be edited
by hand — it gets overwritten on every build.

## Build

```bash
python3 build.py     # sponsor.html -> docs/sponsor.built.html, home.html -> docs/index.html
```

Requires `fonttools`, `brotli` and `Pillow`:

```bash
pip3 install fonttools brotli pillow
```

The build does three things:

1. **Subsets the fonts** to only the characters the page actually uses, converts them to
   WOFF2, and inlines them as data URIs. This matters a lot for the Chinese face —
   ZCOOL ships 8.1 MB of glyphs and the page needs about 105 KB of them.
2. **Processes `logos/`** — trims each image to its content, samples its background
   colour, downscales it to what the tile actually renders at, and picks whichever of
   WebP or PNG comes out smaller. 1.2 MB of source art becomes ~80 KB.
3. **Substitutes** everything into the `/*__BAKED__*/` style placeholders and writes
   the built file. Both pages go through the same pipeline; fonts are subset per page,
   so the homepage (fewer glyphs) comes out smaller.

Everything is inlined because the page has to survive being emailed around as a single
file and printed to PDF, and because the host it was first published on blocks external
requests via CSP.

## Files

| Path | What it is |
|---|---|
| `home.html` | Homepage source. Edit this. Fonts load from local `.ttf` files; logos use `/*__BAKED__*/` placeholders resolved at build time. |
| `sponsor.html` | Prospectus source. Edit this. Same conventions as `home.html`. |
| `docs/index.html` | Generated homepage. Deployable single file. Do not edit. |
| `docs/sponsor.built.html` | Generated prospectus. Deployable single file. Do not edit. |
| `build.py` | The build described above. |
| `logos/` | Company logo source images, one per company id. |
| `*.ttf` | Font sources (see [Fonts](#fonts)). |

## Editing

### Companies

The walls on both pages render from the `COMPANIES` array near the bottom of each
source file (`sponsor.html` carries per-company descriptions; `home.html` is logos
only — keep the `id`s in sync so both pages share the same art):

```js
{id:"openai", name:"OpenAI", url:"https://openai.com", logo:"",
 zh:"...", en:"..."}
```

- Add a logo by dropping a file into `logos/` named after the `id` — `openai.png`,
  `nvidia.svg`, whatever. Matching ignores case, spaces and punctuation, so
  `Openai.png` and `mistral AI.png` both work. Outright misspellings go in the
  `ALIASES` map in `build.py` (there's one there now for a file named `NVDIA.png`).
- **Prefer SVG.** Vectors are inlined untouched — no trimming, no downscaling, sharp at
  any size, and usually a fraction of the weight (Google, Mistral and Snyk together come
  to 4.3 KB). If both an `.svg` and a raster of the same company are present, the vector
  wins, so dropping an `.svg` beside an old `.png` is enough to upgrade it.
- Raster sources with transparency are composited onto white before processing, since
  that's what the tile sits on.
- Add `more:1` to an entry to move it behind the "view more" toggle. The toggle counts
  its own contents and hides itself entirely when empty, so nothing else needs changing.

### Judges and hosts

Plain markup in the Lineup section. The first twelve are always visible; the rest sit
inside `<details class="more">`. Move people between the two grids to re-rank them.

### Language

Every string exists twice, as `<span class="zh">` and `<span class="en">`. CSS on
`#page[data-lang]` shows one and hides the other. **Any new copy needs both** — a missing
`.en` span just renders as a gap when the reader toggles.

### Placeholders

`class="tbd"` renders as a yellow highlight with a dashed underline. Use it for anything
not yet confirmed, and search for it to find everything outstanding.

## Print

Sponsors circulate this internally as a PDF, so printing is a supported output, not an
afterthought:

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
committed — the build won't run without them. They are only ever shipped subset and
inlined, never served as standalone font files.

## Unfinished

On the homepage (`home.html`), highlighted in yellow:

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
