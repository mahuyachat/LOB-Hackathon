---
created: 2026-04-09
tags:
  - design-system
  - cognigy
  - cx-expert
  - "#c26"
status: active
updated: 2026-05-07T07:57
---

# C26 - Cognigy's Design System

Canonical design system reference for all AI-related products in Nice.

**Official Storybook:** [https://storybook.cognigy.ai](https://storybook.cognigy.ai)
**Figma Source:** [C26 - Design System ⭐️ (Tali)](https://www.figma.com/design/Ga2WCPmnL73jIUnMxgqOTd/C26---Design-System-%E2%AD%90%EF%B8%8F--Tali-?m=auto&t=LijcpSOqFLAmuO97-6) — canonical UX/UI component design source
**CSS:** '~/C26/theme.css'
**Tokens:** '~/C26/cognigy-tokens.json'

---

## Primary Colors (Blue)

| Step | Hex | CSS Var |
|------|-----|---------|
| 0 | #ffffff | --primary-0 |
| 25 | #ecf5fe | --primary-25 |
| 50 | #e5f2ff | --primary-50 |
| 100 | #d2e7fe | --primary-100 |
| 200 | #a7d0fe | --primary-200 |
| 300 | #5ea9fd | --primary-300 |
| 400 | #308ff8 | --primary-400 |
| **500** | **#126bce** | **--primary-500 ← brand** |
| 600 | #17569b | --primary-600 |
| 700 | #164479 | --primary-700 |
| 800 | #0e2d4e | --primary-800 |
| 900 | #0b233d | --primary-900 |

**Semantic aliases**

| Alias | Value | Notes |
|-------|-------|-------|
| --primary-default | #126bce | = primary-500 |
| --primary-secondary | #e5f2ff | = primary-50 |
| --primary-disabled | rgba(18, 107, 206, 0.5) | |
| --primary-secondary-disabled | rgba(229, 242, 255, 0.5) | |

## Neutral Colors

| Step | Hex     |
| ---- | ------- |
| 0    | #ffffff |
| 25   | #f9fafb |
| 50   | #f3f4f6 |
| 100  | #e5e7eb |
| 200  | #d1d5db |
| 300  | #9ca3af |
| 400  | #6b7280 |
| 500  | #4b5563 |
| 600  | #374151 |
| 700  | #1f2937 |
| 800  | #111827 |
| 900  | #000000 |

## Accent Palettes (25–500)

**Yellow:** #fff8e6 → #ffedbf → #ffe299 → #ffd366 → #ffc857 → #ffbe37 → #ffb110
**Blue:** #e9ecfb → #c7d0f8 → #a3b1f2 → #7f91ed → #556cd6 → #4855bb → #3b439f
**Magenta:** #fbe6f2 → #f4bfe6 → #ee99db → #e666c9 → #e754a8 → #cf3a8f → #b7337a
**Teal:** #e6fbf8 → #bff4ec → #99e8df → #66dccf → #00bfa6 → #009e8f → #008070

## Status Colors

| State | Default | Border | Background | Hover | Foreground |
|-------|---------|--------|------------|-------|------------|
| Success | #208337 | #24943e | #effbf1 | #1c7330 | #ffffff |
| Warning | #ffb800 | #a37a00 | #fff6e0 | #ffbf00 | #1f2937 |
| Error | #e32926 | #e53935 | #fdeaea | #c71d1a | — |
| Danger | #e32926 | — | — | — | #ffffff |

> `--danger` is an alias for `--error-default`, used by Shadcn's destructive variant.

## Typography

**Font families**
- Sans: Geist → system-ui → sans-serif (`--font-sans`)
- Mono: DM Mono → ui-monospace (`--font-mono`)

**Font sizes**

| Token | Size | px |
|-------|------|----|
| --text-micro | 0.625rem | 10px |
| --text-xs | 0.75rem | 12px |
| --text-sm | 0.875rem | 14px |
| --text-md / --text-base | 1rem | 16px |
| --text-lg | 1.125rem | 18px |
| --text-xl | 1.25rem | 20px |
| --text-2xl | 1.5rem | 24px |
| --text-3xl | 1.875rem | 30px |
| --text-4xl | 2.25rem | 36px |
| --text-5xl | 3rem | 48px |

**Font weights:** normal=400, medium=500, semibold=600, bold=700

**Letter spacing**

| Token | Value |
|-------|-------|
| --tracking-tight | -0.025em |
| --tracking-normal | 0em |
| --tracking-wide | 0.025em |

**Typography Presets**

| Preset | Size | Line Height |
|--------|------|-------------|
| body-lg | 1.125rem (18px) | 1.75rem (28px) |
| body | 1rem (16px) | 1.5rem (24px) |
| body-sm | 0.875rem (14px) | 1.25rem (20px) |
| label | 0.75rem (12px) | 1rem (16px) |
| label-micro | 0.625rem (10px) | 0.875rem (14px) |

## Spacing (4px base unit)

| Token | rem | px |
|-------|-----|----|
| --space-0 | 0 | 0 |
| --space-0-5 | 0.125rem | 2px |
| --space-1 | 0.25rem | 4px |
| --space-2 | 0.5rem | 8px |
| --space-3 | 0.75rem | 12px |
| --space-4 | 1rem | 16px |
| --space-5 | 1.25rem | 20px |
| --space-6 | 1.5rem | 24px |
| --space-7 | 2rem | 32px |
| --space-10 | 2.5rem | 40px |
| --space-12 | 3rem | 48px |
| --space-16 | 4rem | 64px |
| --space-20 | 5rem | 80px |
| --space-24 | 6rem | 96px |

## Chart Colors

Sourced directly from Storybook. Used for categorical data visualization.

| Token | Hex | Color |
|-------|-----|-------|
| --chart-1 | #126bce | primary-500 (blue) |
| --chart-2 | #556cd6 | blue-300 |
| --chart-3 | #208337 | success-default (green) |
| --chart-4 | #ffb800 | warning-default (yellow) |
| --chart-5 | #e32926 | error-default (red) |

## Shadows

Base color: `#1f2937` (neutral-700)

| Token | Value | Opacity |
|-------|-------|---------|
| --shadow-xs | 0 1px 2px #1f29370f | 6% |
| --shadow-sm | 0 1px 3px #1f29371a | 10% |
| --shadow-md | 0 4px 6px #1f29371f | 12% |
| --shadow-lg | 0 10px 15px #1f293724 | 14% |
| --shadow-xl | 0 20px 25px #1f293729 | 16% |
| --shadow-2xl | 0 25px 50px #1f29372e | 18% |

## Border Radius

| Token | rem | px |
|-------|-----|----|
| --rounded-xs | 0.25rem | 4px |
| --rounded-sm | 0.375rem | 6px |
| --rounded-md | 0.5rem | 8px |
| --rounded-lg | 0.75rem | 12px |
| --rounded-xl | 1rem | 16px |
| --rounded-full | 9999px | circle |

---

## Usage Guidelines

- **Primary actions, links, brand elements** → `--primary-500` (#126bce)
- **Hover states** → `--primary-600` (#17569b)
- **Subtle backgrounds / chips** → `--primary-50` (#e5f2ff)
- **Body text** → `--neutral-800` (#111827)
- **Secondary text / labels** → `--neutral-400` (#6b7280)
- **Page background** → `--neutral-25` (#f9fafb)
- **Card/surface background** → `--neutral-0` (#ffffff)
- **Borders** → `--neutral-100` (#e5e7eb)
- **Input borders** → `--input` (#e5e7eb, same as `--neutral-100`)
- **Success/Warning/Error** → use semantic status tokens; pair `*-default` with matching `*-bg` for alert banners
- **Chart / categorical colors** → use `--chart-1` through `--chart-5` (blue → indigo → green → yellow → red)
- **Accent palettes** (yellow/blue/magenta/teal) → use for tags, status badges, avatar colors
