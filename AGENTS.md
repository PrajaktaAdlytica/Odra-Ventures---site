# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Approved prototype feedback

- Use the supplied interactive D3 wireframe/dotted globe in the homepage “What we're building” section instead of the previous static globe icon.
- The globe may use the finalized Odra Venture palette, while the surrounding section content and metric cards remain unchanged.
- Use the approved image system from `exec-a9624c3d-dc83-4e47-93a9-bc31104f1a21.png`: pale technical global-network maps, monochrome blue-black founder collaboration photography, and soft abstract editorial artwork in yellow, lavender, and mint.
- Homepage hero imagery should use the map/message/founder mosaic. Newsroom imagery should rotate through the coordinated pastel editorial asset family. Keep these assets local and preserve Odra's existing content.
- Portfolio cards must use verified captures of each company's real website, retain the existing company name and sector, link to the verified live domain, and reveal the website image on hover and keyboard focus. Avoid generic letter-only portfolio cards.
