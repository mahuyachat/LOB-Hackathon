# MVP Feedback Intelligence — Claude Code Instructions

> Full context: read `INSTRUCTIONS.md`. This file is the quick-reference for Claude Code CLI.

## What this is

HTML/CSS/React prototype for **NiCE CXone Feedback Intelligence** — an AI-first post-interaction survey platform. Initiative CXFM-2, MVP target August 2026.

**No build step.** Open `Feedback Intelligence (29th May Update 2).html` directly in a browser. React + Babel load from CDN. Edit files, hard-refresh to see changes.

---

## File map

```
lyra/colors_and_type.css   ← ALL CSS tokens (edit nothing here — only read)
lyra/shell.css             ← App shell layout (topbar 56px, nav 256px/60px, pane)
lyra/styles.css            ← FI-specific component styles ← ADD new CSS here
lyra/app.jsx               ← Root App() router + nav config
lyra/shell.jsx             ← Topbar, left nav, app-switcher React components
lyra/campaigns.jsx         ← Survey Campaigns screen
lyra/designs.jsx           ← Survey Templates screen
lyra/ontology.jsx          ← VU Score Model screen
lyra/lyra-tokens.json      ← Design token definitions (reference only)
```

---

## Non-negotiable rules

1. **Lyra tokens only.** No hardcoded hex/rgba values. Use CSS custom properties from `colors_and_type.css`.
2. **Inter font only.** Weights: 400 (Regular), 500 (Medium), 600 (Semi Bold). No other typeface.
3. **Never touch `colors_and_type.css`.** It's the token source — read it, never edit it.
4. **FI CSS goes in `lyra/styles.css`.** Shell/layout changes go in `lyra/shell.css`.
5. **No new CSS custom properties.** Only use tokens already defined.

---

## Key tokens (most-used)

```css
/* Text */
--color-fg-default        /* rgba(0,0,0,0.80) — primary text */
--color-fg-secondary      /* rgba(0,0,0,0.64) — muted text */
--color-fg-action         /* brand-600 — links, actions */

/* Backgrounds */
--color-bg-primary        /* brand-600 — primary button */
--color-bg-primary-hover  /* brand-700 */
--color-bg-active-subtle  /* brand-50 — selected row bg */
--color-bg-ai             /* #f4eefb — AI surface lavender */
--color-bg-state-hover    /* rgba(0,0,0,0.04) — row hover */

/* Borders */
--color-border-soft       /* rgba(0,0,0,0.16) — card borders */
--color-border-active     /* brand-600 — focus/selected */

/* Spacing: --space-1(4px) --space-2(8px) --space-3(12px) --space-4(16px)
            --space-5(20px) --space-6(24px) --space-8(32px) --space-10(40px) */

/* Radius: --radius-xs(4) --radius-sm(6) --radius-md(8) --radius-lg(12) --radius-round(9999px) */

/* Shadows: --shadow-sm  --shadow-md  --shadow-lg */

/* Font: --font-sans (Inter stack) */
```

---

## Typography — corrected from Figma (2026-05-31)

```css
/* Figma is authoritative — these override the JSON token file where they differ */
heading-xl:  24px / 600 / 28px lh / -0.02rem ls
heading-lg:  20px / 600 / 24px lh / -0.01rem ls
heading-md:  16px / 500 / 20px lh / -0.01rem ls
heading-sm:  14px / 500 / 18px lh / 0 ls
heading-xs:  12px / 500 / 16px lh / +0.01rem ls  UPPERCASE
body-lg:     16px / 400 / 28px lh / -0.01rem ls
body-md:     14px / 400 / 24px lh / 0 ls          ← DEFAULT
body-sm:     12px / 400 / 20px lh / +0.01rem ls
label:       14px / 500 / 20px lh / 0 ls

/* body-md shorthand */
font: 400 14px/24px var(--font-sans);
```

---

## Shell layout

```
grid: 56px topbar / 256px nav + 1fr main (or 60px collapsed)
Canvas bg: rgb(243, 245, 246)  ← topbar + nav + outer, all one surface
.pane = white card floating on canvas
```

---

## Adding a new screen

1. Create `lyra/newscreen.jsx`
2. Add `<script src="lyra/newscreen.jsx" type="text/babel">` in HTML `<head>`
3. Add route key to `FI_NAV` in `app.jsx`
4. Handle route in `App()` in `app.jsx`

---

## Git

```bash
# Commit format
git commit -m "[FI] short description"

# Remote
origin = https://github.com/Advait-UX/MVP-Feedback-Intelligence--30th-May.git
branch = main
```

---

## FI-specific patterns

**VU score colours:**
- High (76–100): `--lyra-green-500 / --lyra-green-700`
- Medium (50–75): `--lyra-orange-500`
- Low (0–49): `--lyra-red-500`
- No data: `--lyra-slate-400`

**AI surfaces:** bg `--color-bg-ai` (#f4eefb), text `--color-fg-ai` (purple-700), include "AI" chip

**Status pills:** `.fi-pill.active` / `.paused` / `.draft` / `.ended` — defined in `styles.css`

**Campaign states:** `Draft → Active → Paused → Ended` — can have a Working Copy alongside Published

---

## Figma MCP access (Claude Cowork only)

File key: `qyCq4jUOrpYcpHhpNCdgA5`  
Key nodes: Colors `14840:18536` · Typography `16788:14400` · Shell `20266:61976` · Forms `16926:20792`  
Full node ID list: see `INSTRUCTIONS.md §8`

---

## Product context (brief)

**VU Score** = Σ(topic_weight × sentiment_multiplier) + modifiers → 0–100 urgency score  
**Channels (MVP):** Digital Chat, Social DM, AI Agent (Cognigy) — Voice is future scope  
**Screens:** Survey Campaigns · Survey Templates · VU Score Model  
**Confluence HLD:** https://nice-ce-cxone-prod.atlassian.net/wiki/spaces/CXFM/pages/3682403609
