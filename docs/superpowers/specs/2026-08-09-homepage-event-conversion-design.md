# Homepage Event Conversion Design

Date: 2026-08-09
Status: Approved design, pending written-spec review

## Objective

Turn the Bright homepage into a clearer event-hosting conversion path. The page should lead with current operating scale, capture a qualified host lead, move that person directly into the existing planning concierge, and give every supported event format a useful detail page.

## Scope

This change covers:

- The homepage hero copy and proof metrics.
- The compact event-type and work-email form in the hero.
- The handoff from a successful host request to the existing AI concierge.
- The six cards in the “What we host” section.
- Six statically generated `/host/[type]` pages.
- Clear inquiry and agent CTAs on each format page.
- A custom-format CTA below the six format cards.
- Responsive behavior for the hero form, cards, concierge, and detail pages.

Deployment, API infrastructure replacement, authentication changes, sponsorship flows, and changes to the archived `/v4` page are outside this scope.

## Public Claims and Copy

The approved headline metrics are:

1. `52` — Events since Jan 2025
2. `150K+` — Builders in our attendee network
3. `3–5` — Events planned monthly

The `150K+` figure refers to the first-party email network assembled from people who attended 2%Tech events. It must not be described as registrations, social reach, impressions, or the attendance of a single event.

The English hero supporting copy will be:

> 52 events since Jan 2025. A 150K+ attendee network of founders, builders and investors. You bring the idea; we build the room and the run of show.

The hero image proof badges will read:

- `150K+ attendee network`
- `52 events since Jan 2025`

Chinese copy will convey the same claims without changing their meaning or time period.

Any remaining homepage or host-page references to the old `25 events`, `6,300+ registrations`, or `5 more scheduled` headline set will be reconciled with the approved metrics. Event-specific registration counts may remain when they refer to a named event and are supported by the existing event record.

## Homepage Hero and Form

The existing Bright visual system remains the source of truth: warm white background, black type, yellow accent, current navigation, current hero photography, rounded form surface, and floating proof badges.

The hero retains its two-column desktop composition. The supporting paragraph becomes shorter so the form and its primary action remain visible within a typical laptop homepage viewport. The form must not overflow, clip, or extend beneath the next section at the current 884-by-801 browser viewport or at common mobile widths.

The form requires:

- At least one selected event format.
- A syntactically valid work email.

The submit control remains unavailable while a request is being sent and must not create duplicate submissions. Invalid or failed submissions keep the entered values and show an inline, accessible error.

On a successful request:

1. The existing `POST /api/leads` host-lead flow stores the email and selected formats.
2. The form shows a brief saved/transition state.
3. The existing Bright concierge opens automatically.
4. The concierge acknowledges the selected format or formats and begins qualification with the most useful next question, such as the desired outcome, audience, budget, date, or expected attendance.

The email remains in the lead system and is not included in the conversation sent to the model. The selected event formats are supplied as planning context.

The floating “Plan my event” button continues to open the concierge directly for visitors who do not use the form.

## Event Formats

The supported format set is:

1. Hackathon
2. Workshop
3. Panel
4. Keynote / Founder Launch
5. Private Dinner
6. Watch Party / Social

Each homepage format card includes a bilingual “View details” action implemented with Next.js `Link`. Only that explicit action is interactive, keeping keyboard and screen-reader behavior unambiguous.

The format content model in `lib/blueprint.ts` will remain the single source for names, positioning, intended audience, included services, workflow, add-ons, photos, and cases. The existing four products will be extended with Private Dinner and Watch Party / Social instead of creating a second format registry.

## Dedicated Format Pages

The existing static `/host/[type]` route will generate all six approved paths through `generateStaticParams`, with `dynamicParams = false` retained for static export safety.

Each format page includes:

- A format-specific hero and real event photography.
- Who the format is for.
- Outcomes and included services.
- A practical run of show.
- Optional add-ons.
- Relevant real past cases when available.
- A clear host-inquiry CTA.
- A clear “Plan with our agent” CTA that opens the same concierge with the current format preselected.
- Links to other formats.

Private Dinner and Watch Party / Social pages will use the same component architecture and quality level as the existing four pages. Claims without a supporting event record will remain qualitative; invented attendance or conversion figures are prohibited.

## Custom Event Path

Below the six format cards, add a compact custom-format invitation using this English direction:

> Not seeing your event? Bring us the idea—we’ll design the room.

Its primary action opens the concierge with a custom-event context. A visually quieter secondary link leads to the full host brief.

## Component and Data Architecture

The implementation will reuse the current React, Next.js App Router, static export, Go lead API, and concierge API.

Responsibilities will be separated as follows:

- `lib/data.ts`: site-wide headline metrics and the six homepage format labels.
- `lib/blueprint.ts`: full detail-page data for all six event products.
- `HostRequestForm`: field state, validation, submission, and success transition.
- `BrightConcierge`: conversation UI, agent calls, format-aware opening context, and fallback behavior.
- A narrowly scoped React planning-concierge provider: transfers selected formats from a successful form submission or format-page CTA into the concierge without forwarding the captured email.
- Homepage and format pages: server-rendered composition and links.

The provider will expose an explicit `openPlanner(context)` client API and render the shared concierge once within the site layout. This keeps homepage and host-detail pages server-rendered while avoiding a global browser-event protocol.

## Error Handling

- Missing format: show an inline bilingual error and do not submit.
- Invalid email: show an inline bilingual error and do not submit.
- Lead API failure: preserve all input and allow retry; do not open the concierge.
- Concierge API failure after a saved lead: keep the saved state and show the existing email/form fallback inside the open concierge.
- Rate limiting: use the existing concierge failure path and do not lose the saved lead.
- Unknown format route: return the existing not-found behavior.

## Accessibility and Responsive Requirements

- All form controls keep explicit accessible names.
- Selected chips expose `aria-pressed`.
- Submission and agent errors use an announced status or alert region.
- Automatic concierge opening moves focus to a useful control or heading without trapping keyboard users.
- All CTAs have visible focus states.
- Cards do not rely on color alone to communicate clickability.
- At mobile widths, chips wrap cleanly, the email and submit button become a stable vertical stack, and the concierge fits within the viewport.
- At the current 884-by-801 viewport, the hero form remains fully usable and the page has no horizontal overflow.

## Testing Strategy

Implementation will follow test-driven development for behavior changes.

Automated coverage will protect:

- Rejection of an empty event selection.
- Rejection of an invalid email.
- A successful lead submission before concierge opening.
- No concierge opening when lead capture fails.
- Format context reaching the concierge while email does not.
- All six format IDs resolving to generated detail pages.
- Unknown format IDs remaining unavailable.
- Metric labels and downstream consumers receiving the approved values through the shared data model.

The project currently has no frontend test script, so the implementation plan will choose the smallest compatible test setup before production edits. Go API tests will be added only if backend behavior changes; the approved flow can reuse the existing API contract.

Verification will include:

- Type checking.
- Production static-export build.
- Relevant automated tests.
- Browser walkthrough of invalid, failed, and successful form paths.
- Concierge opening with seeded format context.
- Navigation through all six format cards and detail pages.
- Desktop, the current 884-by-801 viewport, and a mobile viewport.
- Screenshot comparison against the supplied Bright homepage evidence, with a written fidelity ledger.

## Acceptance Criteria

The work is complete when:

1. The hero and shared metric blocks use `52`, `150K+`, and `3–5` with the approved meanings.
2. Old headline metrics are not left in equivalent homepage or generic host-page claims.
3. The hero supporting copy is short and the form fits the homepage at desktop and mobile widths.
4. The host request cannot submit without a selected format and valid email.
5. A successful submission is stored through the current lead API before the concierge opens.
6. The captured email is not forwarded to the model conversation.
7. All six cards expose a clear detail action.
8. All six static detail routes build and contain format-specific content and conversion CTAs.
9. The custom-format CTA opens the planning concierge.
10. Automated checks, type checking, build, and browser verification pass, or any environment blocker is reported precisely rather than treated as a pass.
