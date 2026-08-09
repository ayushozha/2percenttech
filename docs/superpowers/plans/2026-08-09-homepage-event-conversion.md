# Homepage Event Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the Bright homepage metrics and conversion flow, then extend the existing host-product system to six detail pages with a shared planning concierge.

**Architecture:** Keep server pages and the existing Go APIs unchanged. Add a small client planning provider around the site, use shared pure helpers for form validation and concierge context, extend the existing product data model, and reuse the current dynamic route for all six formats.

**Tech Stack:** Next.js 16 App Router static export, React 19, TypeScript 6, Node 26 test runner, existing Go API and Python concierge service.

## Global Constraints

- Use `52` events since Jan 2025, `150K+` attendee email network, and `3–5` events planned monthly.
- Never describe `150K+` as registrations, impressions, or single-event attendance.
- Persist the lead before opening the concierge; never forward the captured email to the model.
- Preserve the current Bright visual system and bilingual behavior.
- Keep `dynamicParams = false` and generate exactly six host-product routes.

---

### Task 1: Shared planning behavior and provider

**Files:**
- Create: `lib/host-planning.ts`
- Create: `components/PlanningConciergeProvider.tsx`
- Modify: `components/BrightConcierge.tsx`
- Modify: `components/HostRequestForm.tsx`
- Modify: `app/(site)/layout.tsx`
- Test: `tests/host-planning.test.ts`

**Interfaces:**
- Produces `validateHostRequest(picks: string[], email: string): HostValidationError | null`.
- Produces `buildPlannerOpening(labels: string[], lang: Lang): string` without accepting email.
- Produces `usePlanningConcierge().openPlanner({ formatIds, formatLabels })`.

- [ ] Write failing Node tests for validation, trimmed valid email, and format-only concierge context.
- [ ] Run `node --test tests/host-planning.test.ts` and confirm the missing module failure.
- [ ] Implement the pure helpers and rerun until green.
- [ ] Add the provider, move the shared concierge into the site layout, and connect form success only after `createHostRequest` resolves.
- [ ] Run the focused test and `npm run typecheck`.

### Task 2: Metrics, hero, and responsive form

**Files:**
- Modify: `lib/data.ts`
- Modify: `app/(site)/layout.tsx`
- Modify: `app/(site)/page.tsx`
- Modify: `app/(site)/globals.css`
- Test: `tests/site-data.test.ts`

**Interfaces:**
- `STATS` exposes the approved three bilingual headline metrics.

- [ ] Write a failing data-contract test for the three approved metrics.
- [ ] Run it and confirm the old values fail.
- [ ] Update shared data, metadata, hero copy, image badges, generic downstream claims, and form class names.
- [ ] Add breakpoint rules that keep the form and concierge within 884x801 and mobile viewports.
- [ ] Run focused tests and typecheck.

### Task 3: Six format pages and homepage links

**Files:**
- Modify: `lib/blueprint.ts`
- Modify: `app/(site)/page.tsx`
- Modify: `app/(site)/host/[type]/page.tsx`
- Modify: `app/(site)/host/apply/page.tsx`
- Create: `components/PlanEventButton.tsx`
- Modify: `app/(site)/globals.css`
- Test: `tests/event-products.test.ts`

**Interfaces:**
- `EVENT_PRODUCTS` contains exactly `hackathon`, `workshop`, `panel`, `keynote`, `private-dinner`, and `watch-party`.
- `PlanEventButton` opens the shared concierge with the current product context.

- [ ] Write failing tests for the six IDs and product lookup behavior.
- [ ] Run the tests and confirm the two missing products fail.
- [ ] Add complete Private Dinner and Watch Party / Social content using existing event photos and supported cases only.
- [ ] Add explicit “View details” links to all homepage cards and the custom-event CTA below them.
- [ ] Add inquiry and agent CTAs to every generated host page, reconcile generic old metrics, and update cross-format copy from four to six.
- [ ] Run focused tests, typecheck, and the static-export build.

### Task 4: Browser and final verification

**Files:**
- Modify only files required by observed regressions.

- [ ] Run `node --test tests/*.test.ts`, `npm run typecheck`, `npm run build`, and `go test ./...` inside `api`.
- [ ] Use the in-app browser to inspect the homepage at 884x801, desktop, and mobile widths.
- [ ] Verify invalid email, missing format, saved-lead-to-open-agent ordering, direct planner opening, all six detail links, and the custom-format action.
- [ ] Capture the final homepage screenshot and inspect it alongside the supplied browser evidence.
- [ ] Write the fidelity ledger, remove temporary artifacts, inspect `git diff --check`, and report exact verification evidence.
