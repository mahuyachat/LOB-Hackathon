---
title: Cognigy Design System Tokens
source: https://storybook.cognigy.ai
extracted: 2026-05-05
tags: [competitive-intelligence, design-system, cognigy, tokens]
---

# Cognigy Design System Tokens

Design tokens extracted from the Cognigy Storybook on 2026-05-05. Useful as a reference when comparing visual language and design system choices against [[lyra]].

Related: [[lyra]]

## Source
- Storybook: https://storybook.cognigy.ai
- Raw file: [[cognigy-tokens.json]]

## Summary

### Colors
- **Primary (blue scale)**: `#ecf5fe` (25) → `#0b233d` (900), with `#126bce` as the 500 step
- **Neutral**: `#f9fafb` (25) → `#000000` (900)
- **Accent ramps**: yellow (`#ffb110`), blue (`#3b439f`), magenta (`#b7337a`), teal (`#00bfa6`)
- **Status**: success `#208337`, warning `#ffb800`, error/danger `#e32926`
- **Semantic tokens**: background `#f9fafb`, foreground `#111827`, ring `#126bce`

### Chart Colors
1. `#6e56cf` (purple)
2. `#556cd6` (blue)
3. `#208337` (green)
4. `#ffb800` (yellow)
5. `#e32926` (red)

### Spacing
4px base scale: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 px

### Shadows
Base color `#1f2937`, six steps from `xs` to `2xl`

### Border Radius
xs `0.25rem` → xl `1rem`, plus `full` (9999px)

### Typography
- **Sans**: Geist
- **Mono**: DM Mono
- **Sizes**: micro `0.625rem` → 5xl `3rem`
- **Weights**: 400, 500, 600, 700
- **Presets**: body-lg, body, body-sm, label, label-micro

## Notes
- Heavy reliance on shadcn-style semantic tokens (card, popover, muted, accent, ring)
- Tailwind-aligned spacing and radius scales
- Compare token coverage and naming conventions against [[lyra]] when assessing parity
