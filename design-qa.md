# Design QA — Investment Focus

## Inputs

- Reference state: `/Users/prajaktagaikwad/Desktop/Screenshot 2026-08-15 at 00.04.46.png`
- Implementation captures:
  - `qa/investment-focus-premium-final.jpg`
  - `qa/investment-focus-premium-energy.jpg`
  - `qa/investment-focus-comparison.jpg` (side-by-side before/after review)
- Verified viewport: 1280 × 720 in the local browser.

## Intentional redesign

The reference was treated as the section to improve, not a pixel-perfect target. Its illustrated dashboard, orbit lines, glossy sphere, and floating nodes were intentionally removed. The section now uses the approved Odra architectural/editorial imagery, restrained pastel surfaces, a compact metadata row, and one consistent external-link affordance.

## QA results

- Content: all four investment categories, percentages, descriptions, and tags are unchanged.
- Hierarchy: category rows remain the primary selector; the visual panel is clearly secondary and no longer competes with the copy.
- Typography: section labels, category headings, descriptions, percentage badge, and chips retain the established site type system.
- Spacing: row rhythm and the two-column layout are preserved; the visual panel has a consistent 10px image inset and balanced copy padding.
- Interaction: mouse hover, keyboard focus, click, Enter, and Space continue to update the active category. Active state and image change were verified for Technology Platforms and Energy & CleanTech.
- Motion: image zoom and arrow movement are subtle and disabled under `prefers-reduced-motion`.
- Image quality: approved local brand assets are used at full cover resolution; no external screenshot dependency remains.
- Build: `npm run build` passes.
- Packaging: `npm run test:sites` passes all 4 tests.

## Final status

Passed. The section now aligns with the premium editorial direction and the finalized pastel brand system.

---

# Design QA — Newsroom Card Rhythm

## Inputs

- Reference issue: `/Users/prajaktagaikwad/Desktop/Screenshot 2026-08-15 at 00.11.12.png`
- Implementation captures:
  - `qa/newsroom-spacing-final.jpg`
  - `qa/newsroom-spacing-comparison.jpg` (side-by-side before/after review)
- Verified viewport: 1280 × 720 in the local browser.

## Corrections

- Removed the forced 570px card height and grid-row stretching that made each update feel oversized.
- Added a consistent 34–48px row gap and 20–30px column gap.
- Reduced image depth, heading scale, body spacing, metadata spacing, and footer-link spacing as one coordinated system.
- Constrained the editorial grid and heading to the same 1360px content width.
- Preserved the two-column structure, content, pastel artwork, hover state, and existing GSAP/Lenis reveal behavior.
- Added a compact mobile override so the oversized minimum height cannot return below 640px.

## Verification

- Cards now size to their content instead of stretching to the tallest row.
- Both columns align cleanly and each row has visible breathing room.
- The sticky navigation remains opaque and legible while the compact cards pass beneath it.
- `npm run build` passes.
- `npm run test:sites` passes all 4 tests.

## Final status

Passed. The Newsroom grid now has a compact, premium editorial rhythm with consistent margins and spacing.
