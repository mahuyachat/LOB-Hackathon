---
title: Cognigy Theme CSS
source: https://storybook.cognigy.ai
saved: 2026-05-10
tags: [competitive-intelligence, design-system, cognigy, css, theme]
---

# Cognigy Theme CSS

Full CSS implementation of the Cognigy Design System tokens — CSS custom properties (`:root`), Tailwind v4 `@theme inline` mapping, and base layer styles. Useful as a reference when comparing visual implementation choices against [[lyra]].

Related: [[lyra]] · [[Cognigy-Design-Tokens]] · [[cognigy-tokens.json]]

## Source
- Storybook: https://storybook.cognigy.ai
- Raw file: [[cognigy-theme.css]]

## Structure

### `:root` custom properties
- **Primary scale** (`--primary-0` through `--primary-900`) plus semantic aliases (`--primary-default`, `--primary-disabled`, etc.)
- **Neutral scale** (`--neutral-0` through `--neutral-900`)
- **Accent ramps**: yellow, blue, magenta, teal (each 25 to 500)
- **Status tokens**: success, warning, error, danger (default, border, bg, hover, disabled, foreground)
- **Typography**: font families, weights, sizes (`--text-micro` to `--text-5xl`), tracking, leading, presets
- **Spacing**: 4px base scale (`--space-0` to `--space-24`)
- **Shadows**: `--shadow-xs` through `--shadow-2xl`
- **Border radius**: `--rounded-xs` to `--rounded-xl`, plus `--rounded-full`
- **shadcn semantic tokens**: background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring
- **Sidebar tokens**: dedicated set mirroring the semantic palette
- **Chart colors**: 5 categorical colors mapped to existing tokens

### `@theme inline` (Tailwind v4)
Maps every token above to Tailwind utility variables (`--color-*`, `--radius-*`, `--font-family-*`, `--spacing-*`, `--shadow-*`, `--leading-*`).

### `@layer base`
- Global resets with `border-border` and `outline-ring/50`
- Body uses `--font-sans` with antialiased rendering
- Heading scale (h1 to h4) with semibold/medium weights
- Label, button, input typography presets
- Scrollbar utilities: `.scrollbar-hide` and `.scrollbar-thin`
- One-shot `column-glow` keyframe animation

## Notes
- Built for Tailwind v4 with `@theme inline` — direct shadow and leading values (no nested `var()`) to avoid circular references
- shadcn-compatible: exposes `--radius`, `--background`, `--foreground`, `--ring`, etc.
- Chart palette repurposes status and brand colors rather than introducing new ones
- Compare the token-to-utility mapping approach against [[lyra]] when assessing parity
