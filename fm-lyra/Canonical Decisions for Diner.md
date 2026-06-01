---
created: 2026-05-10T16:22
updated: 2026-05-10T16:25
tags: [canonical-decisions, design-system, tech-stack]
---

Related: [[lyra]]

## Design System

| Date       | Decision                                                                                                                                                                                                                                             | Rationale                                                                                                 | Projects |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------- |
| 2026-04-09 | **C26 - Cognigy's Design System** is the single source of truth for all colors, typography, spacing, and component tokens                                                                                                                            | Ensures consistency across the NICE/Cognigy AI product suite; all projects share the same visual language | All      |
| 2026-05-05 | **Brand primary: blue** (`#126bce`, step 500 of the C26 primary scale) — supersedes purple (`#6e56cf`)                                                                                                                                               | C26 updated upstream after NICE acquired Cognigy; all projects follow C26 as the canonical source         | All      |
| 2026-04-20 | **Light (regular) mode** — `class="dark"` never applied; page background from C26 `--neutral-25` (off-white)                                                                                                                                         | Aligns with the NICE AI product suite; dark mode was explored and rejected (April 2026)                   | All      |
| 2026-04-20 | **Background depth hierarchy**: body (`neutral-50`) → working area (`neutral-25`) → cards/panels (`neutral-0` / white)                                                                                                                               | Creates perceptible depth using neutral steps without custom colors; matches C26 regular mode intent      | All      |
| 2026-04-09 | **Figma C26 source** ([C26 - Design System ⭐️ (Tali)](https://www.figma.com/design/Ga2WCPmnL73jIUnMxgqOTd/C26---Design-System-%E2%AD%90%EF%B8%8F--Tali-?m=auto&t=LijcpSOqFLAmuO97-6)) is the visual spec reference for all component implementations | Figma source reflects the latest C26 variants, states, and interaction specs ahead of documentation       | All      |

---

## Tech Stack

| Date | Decision | Rationale | Projects |
|------|----------|-----------|---------|
| 2026-04-19 | **React + Vite + TypeScript** as the standard project scaffold | React/Vite is the established production standard; TypeScript prevents class of runtime errors common in UI-heavy projects | All |
| 2026-04-19 | **shadcn/ui** as the component library (`components.json` configured for `src/components/ui/`) | Headless primitives compose cleanly with C26 tokens; `npx shadcn add <component>` is the standard way to add new primitives | All |
| 2026-04-19 | **Tailwind CSS v4** for utility styling; no raw color utilities — only C26 semantic tokens (`text-primary-500`, `bg-error-bg`, etc.) | Keeps color usage consistent with the design system; prevents one-off values that drift from C26 | All |
| 2026-04-10 | **No inline `style={{}}`** for static values — use Tailwind classes or CSS custom properties | Eliminates design-system drift; dynamic/runtime-computed values (positions, percentages) are the only exception and use callback refs | All |

---

