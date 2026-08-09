# 2%Tech — Site

A Next.js app, bilingual (中文 / EN) throughout, exported to static files.

| Route | What it is |
|---|---|
| `/` | The "Bright" homepage — hero with the host-request form, company wall, "what we host" formats, stats + photos, calendar, saved seats, sponsor CTA. Its chat concierge talks to `agent/` — see that service's README. Landed here after a preview period at `/bright`; a different (neo-brutalist "v4") design was the homepage before this — see git history if that's ever worth revisiting. |
| `/host/[type]` | One page per event product: `hackathon`, `workshop`, `panel`, `keynote`. Ideal customer, objectives, scope, run of show, past cases. |
| `/host/apply` | The event brief. Accepts `?type=<id>` to arrive pre-ticked. |
| `/sponsor` | Sponsorship prospectus for the one-day hackathon at Stanford (August 2026). Print-friendly. |
| `/sponsor/apply` | The sponsorship request form — package, goals, budget band. Accepts `?package=<id>` to arrive pre-ticked. |
| `/signin`, `/signup` | Backstage account — demo auth, see [Auth](#auth-is-a-demo). |
| `/dashboard` | Backstage — enquiries, users, events, judging queue, hackathon entry. Role-driven. |

**Status: draft.** Several fields are unconfirmed and marked in the page with a
yellow highlight (`.tbd`). See [Unfinished](#unfinished) before sending it anywhere.

---

## Run it

```bash
npm install
npm run dev            # http://localhost:3000
```

```bash
npm run build          # static export -> out/
npm start              # serve out/ locally
npm run typecheck
```

`output: 'export'` in `next.config.mjs` means the build produces plain files with
no server. `docker build . && docker run -p 8080:80 <image>` builds the export
with Node and serves `out/` from nginx; the runtime image contains no Node and no
application code.

## Auth is a demo

**`lib/store.ts` is not a security boundary.** Everything — accounts, sessions,
sponsor queries, submissions and scores — lives in the browser's
`localStorage`. That means passwords are stored in the clear, anyone can open
devtools and rewrite their own role to `admin`, and data is per-browser rather
than shared or authoritative. The sign-in page says so on screen.

It is structured so that this can be replaced without touching any caller: every
function in `lib/store.ts` is already `async` and returns plain data, so the
localStorage bodies swap for `fetch('/api/…')` directly. Making it real means:

1. drop `output: 'export'` from `next.config.mjs` (you need a Node runtime),
2. move the role checks server-side — `TABS_BY_ROLE` in `components/Dashboard.tsx`
   is presentation, not authorisation,
3. hash the passwords and issue an httpOnly session cookie,
4. rewrite `Dockerfile` and `nginx.conf`, which currently assume static files.

Seeded demo accounts, password `demo2026`: `admin@`, `organizer@`, `judge@`,
`builder@` `2pct.tech` — one per role.

## Structure

| Path | What it is |
|---|---|
| `app/` | Routes. One `page.tsx` per URL above, plus `layout.tsx` and `globals.css`. |
| `app/globals.css` | The whole design system — tokens, then component classes. Start here for any visual change. |
| `components/` | Shared UI. `B.tsx` and `LangProvider.tsx` carry the bilingual mechanism. |
| `lib/blueprint.ts` | Content derived from the Scale-Up Blueprint — see [Blueprint](#the-blueprint). |
| `lib/data.ts` | Landing + shared content: companies, seats, events, stats, photos. |
| `lib/sponsor-data.ts` | Prospectus content: packages, funnel, lineup, prizes, FAQ. |
| `lib/store.ts` | The persistence seam described above. |
| `lib/types.ts` | Roles, lead shapes, and the sponsor goal / budget-band vocabularies. |
| `logos/`, `photos/` | Source art. Not served directly. |
| `public/` | Generated art (`npm run prepare-assets`) plus `mark.svg`. |
| `tools/prepare_assets.py` | Processes `logos/` and `photos/` into `public/`. |
| `api/` | The Go application API — enquiries, roles, auth proxy. Separate service, separate README. |
| `agent/` | The Python AI concierge microservice behind `/bright`'s chat widget. Separate service, separate README. |

This is three independently deployed services sharing one repo, not a
monorepo build — the site is a static export, `api/` and `agent/` each build
from their own subdirectory (Coolify's "base directory" per app), and none of
them import code from either of the others. See each one's own README for
what it owns and how to run it.

## The blueprint

The site's structure follows the **2%Tech Scale-Up Blueprint** (working
strategy document, August 2026). `lib/blueprint.ts` holds the content derived
from it, section by section:

| Blueprint | On the site |
|---|---|
| §1 vision, three user groups | "Three groups, one network" on the landing page |
| §3 agent-powered intake | `/host/apply` — the whole field set comes from here |
| §4.1 clear landing page | Hero leads with the four products, straight into the brief |
| §4.2 event product pages | `/host/[type]` ×4 |
| §5 global campaign | Before / during / after, on the landing page *and* the prospectus |
| §7 hybrid hackathons | The hackathon product page |
| §8 partner network | "Community partners" on the landing page |
| §4.4, §4.5 content hub + builder network | `ROADMAP` — see below |

Two rules were applied turning a strategy document into public copy, and they
should hold for future edits:

1. **Anything not built yet goes in `ROADMAP`** and renders under "What we're
   building", explicitly labelled *Planned*. The blueprint describes a builder
   network, a content hub and an agent workflow — none exist. We do not
   advertise a job board that isn't there.
2. **Past cases are real events.** `EVENT_PRODUCTS[].caseNames` reference
   entries in `lib/data.ts` by name and the product page resolves them, so
   registration counts have one source and no case study is invented.

Sections 2, 6, 9 and 10 (venue workflow, livestream equipment, team division,
the sellable-company thesis) are internal strategy and deliberately have no
public page.

## Inbound enquiries

Two forms feed one inbox — the **Enquiries** tab in the dashboard, visible to
`admin` and `organizer`:

| Form | Lead `kind` | Captures |
|---|---|---|
| Landing page, "what do you want to host?" | `host` | email + event formats |
| `/sponsor/apply` | `sponsor` | company, contact, package(s), goals, budget band, message |

They're one `Lead` type with a discriminator rather than two lists, because
they're the same pipeline to whoever works it: one status cycle
(new → contacted → closed), one sort, one place to look.

Only `company`, `contact`, `email` and at least one package are required on the
sponsorship form — goals, budget and message are optional, since every extra
required field costs completions. `"Not sure yet"` is a valid package answer.

Package ids (`cohosted`, `exclusive`, `flagship`) are stored on the lead, so
**don't rename them** — historical leads resolve their labels through those ids.
Each package card on the prospectus deep-links to
`/sponsor/apply?package=<id>`, which arrives with that package ticked.

Leads written before the `kind` field existed (storage key
`2pct-host-requests`) are migrated to `2pct-leads` on first read and tagged
`host`. The migration only runs when the new key is empty, so it can't clobber
newer data.

## Editing

### Copy

Every string exists twice, as `zh` and `en` on the `<B>` component:

```tsx
<B zh="赞助咨询" en="Sponsor queries" />
```

CSS on `#page[data-lang]` shows one and hides the other, so both halves are in
the served HTML and the toggle is a single attribute flip. **Any new copy needs
both** — a missing half renders as a gap when the reader switches language.

### Companies

`COMPANIES` in `lib/data.ts`. Add a logo by dropping a file into `logos/` named
after the `id` — matching ignores case, spaces and punctuation, so `Openai.png`
and `mistral AI.png` both work. Outright misspellings go in `ALIASES` in
`tools/prepare_assets.py` (there's one there for a file named `NVDIA.png`).
Then:

```bash
npm run prepare-assets     # needs: pip3 install pillow
```

**Prefer SVG.** Vectors are copied untouched — sharp at any size and usually a
fraction of the weight. If both an `.svg` and a raster are present the vector
wins, so dropping an `.svg` beside an old `.png` upgrades it.

Rasters are trimmed to their content, their background colour is sampled, and
they're downscaled to what the tile actually renders at. That sampled colour
becomes the tile background, so a black mark and a lime one each sit on their
own field. Everything lands in `lib/logo-assets.json`.

### Photos

Drop files in `photos/` and rerun `prepare-assets`; they're renumbered in
filename order. `PHOTOS` in `lib/data.ts` expects 16 — update the length there if
you change the count. These dominate page weight, so keep the count deliberate.

**Renumbering moves pictures between pages.** `FEATURED_PHOTOS` in `lib/data.ts`
and `EVENT_PRODUCTS[].shots` in `lib/blueprint.ts` both index into `PHOTOS` by
position, and the product shots are picked so each format shows itself — the
workshop page shows a workshop, not a 300-seat auditorium. Adding a file in the
middle shifts every index after it, so re-check both lists against the images
afterwards. The `alt` text is the quickest way to tell what a slot should be.

### Placeholders

`className="tbd"` renders as a yellow highlight with a dashed underline. Use it
for anything not yet confirmed, and grep for it to find everything outstanding.

## Print

Sponsors circulate the prospectus as a PDF, so printing is a supported output:
dark UI chrome is dropped, cards are kept from splitting across pages, and
external links expand to show their URLs.

`components/SponsorPrint.tsx` force-opens every `<details>` on `beforeprint`.
Without it the collapsed half of the lineup, the other 15 events and all the FAQ
answers silently vanish from the PDF — a collapsed `<details>` isn't rendered at
all. **If you restructure that page, keep it working.**

## Design notes

Ported from the Claude Design project *2%Tech Landing Page Redesign*
(`2pct Landing.dc.html`, `Auth.dc.html`, `Dashboard.dc.html`). Deliberate
differences from the prototypes:

- **Fonts are self-hosted.** The prototypes link Google Fonts at runtime;
  `next/font/google` downloads Figtree, Instrument Serif, IBM Plex Mono and the
  two Noto SC faces at build time instead, so the export makes no external
  request — the property the old single-file build existed to preserve.
- **No `support.js`.** The prototypes run on the Claude Design React runtime
  (`x-dc` / `DCLogic`). That's replaced with ordinary React components.
- **`three` is a dependency**, not a jsdelivr import, for the same reason.
- **The dashboard reads its role from the session.** The prototype hardcoded
  `const role = 'admin'`, so the judge, organizer and participant views were
  unreachable. All four tab sets work.
- **Light-only.** The previous site had a dark mode; the redesign commits to a
  warm paper ground with oklch gradient accents and has no dark variant.
- **The prospectus is bilingual and English-first**, matching the rest of the
  site; the prototypes for auth and dashboard were English-only, so that Chinese
  copy was written for this port and has not been reviewed by a native speaker.

## Unfinished

Highlighted in yellow on the pages:

- **Stanford hackathon date** — "late August", exact day not set. No Luma event
  page exists for it yet; once it does, link the calendar row to it.
- **WeChat** in the landing CTA. (The contact email is confirmed:
  `team@2percenttech.com`, in `CONTACT` in `lib/data.ts`.)
- **Booking link** in the prospectus CTA.
- **Collateral deadline** in the first FAQ answer.
- **Pricing** — deliberately absent. Tiers route to a conversation instead.

Not marked on the page, but needing a decision:

- **The lineup is not confirmed.** All 29 people listed judged, hosted or
  volunteered at recent partner events — they have not agreed to attend this one.
  The section says so, twice. Do not remove that wording until individuals have
  actually confirmed.
- **The company wall is past attendance**, not sponsors or endorsers, and carries
  a disclaimer to that effect. Same rule.
- **The "Saved seats" target list** (Alibaba Cloud, Tencent Cloud, TRAE/ByteDance,
  DeepSeek, Moonshot, Zhipu, MiniMax, Anthropic) is a starting suggestion —
  confirm or edit it before publishing. It is labelled as a target list.
- **Two logo sources should be replaced** when better art is available:
  `mistral.svg` and `snyk.svg` came from marketing pages rather than brand kits.
