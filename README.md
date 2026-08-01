# 2% Tech — Sponsor Page

Sponsorship prospectus for the 2% Tech one-day hackathon at Stanford (August 2026).
Bilingual (中文 / EN), self-contained, print-friendly.

**Status: draft.** Several fields are unconfirmed and are marked in the page with a
yellow highlight (`class="tbd"`). See [Unfinished](#unfinished) before sending it anywhere.

---

## Two ways to use this

**Just need a page to host?** Take `sponsor.built.html` and drop it in. It's a single
344 KB file with fonts, logos and scripts all inlined — no build step, no external
requests, no dependencies. It works opened straight from disk.

**Merging into the main site?** Work from `sponsor.html`. The structure, styles and copy
all live there; `sponsor.built.html` is generated output and should never be edited by
hand — it gets overwritten on every build.

## Build

```bash
python3 build.py     # sponsor.html -> sponsor.built.html
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
3. **Substitutes** everything into the `/*__BAKED__*/` style placeholders in
   `sponsor.html` and writes `sponsor.built.html`.

Everything is inlined because the page has to survive being emailed around as a single
file and printed to PDF, and because the host it was first published on blocks external
requests via CSP.

## Files

| Path | What it is |
|---|---|
| `sponsor.html` | Source. Edit this. Fonts load from local `.ttf` files; logos use `/*__BAKED__*/` placeholders resolved at build time. |
| `sponsor.built.html` | Generated. Deployable single file. Do not edit. |
| `build.py` | The build described above. |
| `logos/` | Company logo source images, one per company id. |
| `*.ttf` | Font sources (see [Fonts](#fonts)). |

## Editing

### Companies

The wall under "Who's in the room" renders from the `COMPANIES` array near the bottom of
`sponsor.html`:

```js
{id:"openai", name:"OpenAI", url:"https://openai.com", logo:"",
 zh:"...", en:"..."}
```

- Add a logo by dropping a file into `logos/` named after the `id` — `openai.png`,
  `nvidia.svg`, whatever. Matching ignores case, spaces and punctuation, so
  `Openai.png` and `mistral AI.png` both work. Outright misspellings go in the
  `ALIASES` map in `build.py` (there's one there now for a file named `NVDIA.png`).
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

Highlighted in yellow on the page:

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
