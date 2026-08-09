# Saved-seat logo QA

- Source visual truth: Browser Comments 1–2 attachments, 1159 x 801 screenshots of the homepage saved-seat and contact sections.
- Implementation evidence: `/tmp/2percenttech-logos-english.png`, `/tmp/2percenttech-logos-chinese.png`, `/tmp/2percenttech-discord-footer.png`, and `/tmp/2percenttech-logos-mobile.png`.
- Viewports: 1159 x 801 desktop and 390 x 844 mobile, device scale factor 1; captured content areas are 1144 x 791 and 375 x 812.
- State: English and Chinese homepage modes, saved-seat section visible; English footer contact visible.
- Source and implementation density: device scale factor 1; no density normalization required.

## Full-view comparison

The existing section hierarchy, six-column desktop grid, yellow open-seat CTA, spacing, card borders, and disclaimer remain aligned with the source. Each placeholder now uses a real brand symbol plus a vector wordmark. English mode uses English lockups, including Tencent Cloud and Z.ai; Chinese mode uses the available Chinese Alibaba Cloud, Tencent Cloud, and Zhipu wordmarks.

## Focused region comparison

The saved-seat cards were inspected directly because logo fidelity is the requested change. All eight lockups render sharply, stay within the card bounds, and share a consistent optical height. Desktop preserves the source grid; mobile collapses cleanly to one card per row without clipping or horizontal overflow. The footer now displays Discord with no WeChat or TBC placeholder.

## Required fidelity surfaces

- Fonts and typography: existing typography is unchanged; brand names now use the brands' vector wordmarks.
- Spacing and layout rhythm: existing card dimensions and grid rhythm are preserved.
- Colors and visual tokens: existing paper, ink, border, and accent tokens are unchanged; official brand colors are retained in the marks.
- Image quality and asset fidelity: all eight entries use local vector marks and localized vector wordmarks with descriptive alt text; no text or CSS logo placeholders remain.
- Copy and content: heading, supporting copy, open-seat CTA, and relationship disclaimer are unchanged; WeChat/TBC is replaced by Discord.

## Interaction and runtime checks

- The “Your logo” card navigates to `/sponsor/apply/` and the sponsorship request page renders.
- The language toggle switches between English and Chinese lockups.
- The contact row contains Discord and no longer contains WeChat or TBC.
- No Next.js error overlay was present.
- Browser console warnings/errors: none.
- Automated tests, TypeScript check, and production build passed.

## Findings and comparison history

- Initial P1: all eight reserved cards showed text instead of real logos.
- Fix: added normalized local SVG marks and localized wordmarks, rendered them with accessible locale-specific alt text, and replaced the contact placeholder with Discord.
- Post-fix evidence: English, Chinese, footer, and mobile captures show all assets loaded with no clipping or horizontal overflow.

No actionable P0, P1, or P2 differences remain for the requested section.

final result: passed
