# Saved-seat logo QA

- Source visual truth: Browser Comment 1 attachment, 1280 x 900 screenshot of the homepage saved-seat section.
- Implementation evidence: `/tmp/2percenttech-saved-seats-desktop.png` and `/tmp/2percenttech-saved-seats-mobile.png`.
- Viewports: 1280 x 900 desktop and 390 x 844 mobile, device scale factor 1.
- State: English homepage, saved-seat section visible; mobile uses the same content in its responsive single-column grid.
- Source and implementation density: source 1280 x 900 pixels; desktop implementation 1280 x 900 pixels; no density normalization required.

## Full-view comparison

The existing section hierarchy, six-column desktop grid, yellow open-seat CTA, spacing, card borders, and disclaimer remain aligned with the source. The requested change replaces each text-only company placeholder with its real wordmark while retaining the reserved-seat treatment.

## Focused region comparison

The saved-seat cards were inspected directly because logo fidelity is the requested change. All eight wordmarks render sharply, stay within the card bounds, and share a consistent optical height. Desktop preserves the source grid; mobile collapses cleanly to one card per row without clipping or horizontal overflow.

## Required fidelity surfaces

- Fonts and typography: existing typography is unchanged; brand names now use the brands' vector wordmarks.
- Spacing and layout rhythm: existing card dimensions and grid rhythm are preserved.
- Colors and visual tokens: existing paper, ink, border, and accent tokens are unchanged; monochrome brand marks match the section's visual language.
- Image quality and asset fidelity: all eight entries use local vector brand assets with descriptive alt text; no text or CSS placeholders remain.
- Copy and content: heading, supporting copy, open-seat CTA, and relationship disclaimer are unchanged.

## Interaction and runtime checks

- The “Your logo” card navigates to `/sponsor/apply/` and the sponsorship request page renders.
- No Next.js error overlay was present.
- Browser console warnings/errors: none.
- Automated tests, TypeScript check, and production build passed.

## Findings and comparison history

- Initial P1: all eight reserved cards showed text instead of real logos.
- Fix: added normalized local SVG wordmarks and rendered them with accessible alt text.
- Post-fix evidence: desktop and mobile captures show all logos loaded with no clipping or overflow.

No actionable P0, P1, or P2 differences remain for the requested section.

final result: passed
