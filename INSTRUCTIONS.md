# MVP Feedback Intelligence — Project Instructions

> **Owner:** Advait Patil (advait.patil@nice.com)  
> **Product:** NiCE CXone · Feedback Intelligence  
> **Initiative:** CXFM-2 — MVP target v2.1.0, August 2026  
> **GitHub:** https://github.com/Advait-UX/MVP-Feedback-Intelligence--30th-May.git  
> **Last updated:** 2026-05-31

---

## For AI Assistants

This file is the single source of truth for both **Claude Cowork** and **Claude Code**.

| Tool | How to use this file |
|---|---|
| **Claude Cowork** | Read this file at the start of every session. All design, HTML, and CSS decisions must reference the rules here. |
| **Claude Code** | `CLAUDE.md` (also at project root) is the quick-reference version optimised for the CLI. This file has the full context. |

> **Figma MCP access:** Claude has live access to the Lyra Figma file via the Figma MCP. File key: `qyCq4jUOrpYcpHhpNCdgA5`. Use `get_metadata` or `get_screenshot` to verify any design decision against the source file. Key page node IDs are listed in §8.

---

## 1. What This Project Is

**CXone Feedback Intelligence** is an AI-first follow-up survey system for contact centre interactions. It replaces blunt post-interaction surveys with:

- **Ontology-driven VU (Urgency) Scoring** — composite score built from Topic Weights × Sentiment Multipliers × Strategic Modifiers
- **LLM-powered contextual question generation** — questions tailored to what actually happened in the interaction
- **Campaign management** — create, activate, pause, and version-control survey campaigns across digital channels (Chat, Social, AI agent/Cognigy)

MVP scope: Chat / Social / AI Agent channels, ~45 K interactions/month.

### Key product surfaces (what exists in the prototype)
| Screen | Description |
|---|---|
| Survey Campaigns | List view + Create/Edit campaign flow (6-step wizard) |
| Survey Templates | Design library for survey question sets |
| VU Score Model | Admin UI for Topics, Weights, Modifiers, Sentiment multipliers |

---

## 2. File Structure

```
MVP-Feedback-Intelligence-GIT/
├── INSTRUCTIONS.md                          ← this file
├── Feedback Intelligence (29th May Update 2).html   ← single-file prototype (entry point)
├── lyra/                                    ← Lyra design system + app components
│   ├── colors_and_type.css                  ← ALL CSS custom properties (tokens)
│   ├── shell.css                            ← App shell layout (topbar, nav, pane)
│   ├── styles.css                           ← FI-specific component styles
│   ├── shell.jsx                            ← Topbar, nav, app switcher (React)
│   ├── app.jsx                              ← Root router + App component
│   ├── campaigns.jsx                        ← Survey Campaigns screen
│   ├── designs.jsx                          ← Survey Templates screen
│   ├── ontology.jsx                         ← VU Score Model screen
│   ├── tweaks-panel.jsx                     ← Dev-mode tweaks panel
│   ├── lyra-tokens.json                     ← Lyra design tokens (source of truth)
│   └── assets/                              ← Icons, images
├── uploads/                                 ← Uploaded reference files (xlsx, png)
└── Figma lyra reference/                    ← Lyra Foundations .fig file
```

### How the prototype loads
The HTML file uses `<script type="text/babel">` and CDN React + Babel. Each `.jsx` file is loaded as a `<script src="...">` tag. CSS files are linked in `<head>`. No build step required — open the HTML directly in a browser.

---

## 3. Lyra Design System — Rules

> **All UI work MUST follow Lyra.** Never introduce custom colours, spacing, or type scales outside of Lyra tokens.

### 3.1 Token source files
- **JSON tokens:** `lyra/lyra-tokens.json` (canonical definitions, also at `../Lyra JSON Token/lyra-tokens.json`)
- **CSS custom properties:** `lyra/colors_and_type.css` — this is what the HTML actually consumes

### 3.2 Colour tokens (CSS custom properties)

#### Primitive palette
| Token prefix | Scale | Use |
|---|---|---|
| `--lyra-brand-{50–950}` | CXone blue | Interactive, primary actions |
| `--lyra-slate-{50–950}` | Blue-grey neutral | Text, surfaces, borders |
| `--lyra-gray-{50–900}` | True neutral | Dividers, placeholders |
| `--lyra-red-{50–900}` | Red | Destructive, error |
| `--lyra-orange-{50–700}` | Orange | Warning |
| `--lyra-yellow-{50–700}` | Yellow | Caution |
| `--lyra-green-{50–700}` | Green | Success |
| `--lyra-purple-{300–700}` | Purple | AI surfaces |

#### Semantic tokens (prefer these over primitives)
| Token | Value | Use |
|---|---|---|
| `--color-bg-surface-base` | `#ffffff` | Primary page background |
| `--color-bg-surface-canvas` | `--lyra-slate-50` | App shell canvas |
| `--color-bg-surface-shell` | `--lyra-slate-100` | Shell sidebar + topbar |
| `--color-bg-primary` | `--lyra-brand-600` | Primary button fill |
| `--color-bg-primary-hover` | `--lyra-brand-700` | Primary button hover |
| `--color-bg-ai` | `#f4eefb` | AI/LLM feature surfaces (lavender) |
| `--color-bg-active-subtle` | `--lyra-brand-50` | Selected/active item background |
| `--color-bg-state-hover` | `rgba(0,0,0,0.04)` | Row / item hover |
| `--color-fg-default` | `rgba(0,0,0,0.80)` | Primary text & icons |
| `--color-fg-secondary` | `rgba(0,0,0,0.64)` | Muted / supporting text |
| `--color-fg-action` | `--lyra-brand-600` | Links, action text |
| `--color-fg-disabled` | `rgba(0,0,0,0.36)` | Disabled text |
| `--color-fg-ai` | `--lyra-purple-700` | AI feature text |
| `--color-border-subtle` | `rgba(0,0,0,0.10)` | Light dividers |
| `--color-border-soft` | `rgba(0,0,0,0.16)` | Card borders |
| `--color-border-active` | `--lyra-brand-600` | Focused / selected border |

### 3.3 Spacing scale
Base unit: **4px**

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |

### 3.4 Border radius
| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 4px | Chips, small badges |
| `--radius-sm` | 6px | Inputs, small controls |
| `--radius-md` | 8px | Cards, buttons, banners |
| `--radius-lg` | 12px | Panels, dropdowns |
| `--radius-xl` | 16px | Large modals |
| `--radius-round` | 9999px | Pills, avatars |

### 3.5 Typography (Inter only)
All text uses **Inter**. No other typeface. Figma file is the authoritative source.

> **⚠️ Figma correction:** The Lyra Figma file (verified 2026-05-31) shows `Body MD` line height as **24px** and `Heading SM` line height as **18px**. The JSON token file differs on these — Figma wins.

| Scale | Size / Weight / Line Height | Letter Spacing | Use |
|---|---|---|---|
| `heading-xl` | 24px / Semi-bold (600) / 28px | -0.02rem | Page titles |
| `heading-lg` | 20px / Semi-bold (600) / 24px | -0.01rem | Section headers |
| `heading-md` | 16px / Medium (500) / 20px | -0.01rem | Card titles, nav labels |
| `heading-sm` | 14px / Medium (500) / 18px | 0 | Sub-labels |
| `heading-xs` | 12px / Medium (500) / 16px | +0.01rem, UPPERCASE | Column headers, overlines |
| `body-lg` | 16px / Regular (400) / 28px | -0.01rem | Long-form text |
| `body-lg-emphasized` | 16px / Medium (500) / 28px | -0.01rem | Emphasized body |
| `body-md` | 14px / Regular (400) / 24px | 0 | **Default body — use this most** |
| `body-md-emphasized` | 14px / Medium (500) / 24px | 0 | Emphasized body (bold within paragraphs) |
| `body-sm` | 12px / Regular (400) / 20px | +0.01rem | Captions, helper text |
| `body-sm-emphasis` | 12px / Medium (500) / 20px | +0.01rem | Small emphasized text |
| `label` | 14px / Medium (500) / 20px | 0 | Form labels, table headers |

CSS shorthand: `font: 400 14px/24px var(--font-sans)` (body-md default)

> **Inter weight names in CSS/Figma:** Use numeric weights — `400` (Regular), `500` (Medium), `600` (Semi Bold). In Figma font picker the style is `"Semi Bold"` (with space), not `"SemiBold"`.

### 3.6 Elevation / Shadows
| Token | Use |
|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.08)` — inline cards |
| `--shadow-md` | `0 4px 8px rgba(0,0,0,0.08)` — floating panels |
| `--shadow-lg` | `0 12px 24px rgba(0,0,0,0.08)` — modals, dropdowns |

### 3.7 Component patterns

#### Buttons
```css
/* Primary */
.btn.primary { background: var(--color-bg-primary); color: white; border-radius: var(--radius-md); }
.btn.primary:hover { background: var(--color-bg-primary-hover); }

/* Secondary / ghost */
.btn { background: var(--color-bg-surface-base); border: 1px solid var(--color-border-soft); border-radius: var(--radius-md); }
```

#### Form inputs
- Background: `var(--color-bg-field, white)`
- Border: `1px solid var(--color-border-soft)`
- Border-radius: `var(--radius-sm)` (6px)
- Focus ring: `0 0 0 2px white, 0 0 0 4px var(--lyra-brand-500)`
- Height: 32px (sm), 36px (md), 40px (lg)

#### Info banners
```css
.info-banner {
  background: var(--color-bg-active-subtle);
  border: 1px solid rgba(24,91,164,0.20);
  border-radius: var(--radius-md);
  /* body-md type, 12px/16px padding */
}
```

#### Status pills
```css
.fi-pill          { border-radius: var(--radius-round); font: 500 11px/16px var(--font-sans); }
.fi-pill.active   { background: #e6f7e8; color: var(--lyra-green-700); }
.fi-pill.paused   { background: #fff2e2; color: var(--lyra-orange-700); }
.fi-pill.draft    { background: var(--lyra-slate-100); color: var(--lyra-slate-600); }
.fi-pill.ended    { background: var(--lyra-slate-200); color: var(--lyra-slate-500); }
```

---

## 4. Shell Layout

```
┌─────────────────────────────────────────────────────┐
│  TOPBAR (56px)   — logo · product name · utilities  │
├──────────────┬──────────────────────────────────────┤
│  LEFT NAV    │  MAIN CONTENT                        │
│  (256px)     │  .pane (white card, fills remaining) │
│  expanded    │                                       │
│  or          │                                       │
│  (60px)      │                                       │
│  collapsed   │                                       │
└──────────────┴──────────────────────────────────────┘
```

Grid: `grid-template-columns: 256px 1fr` (expanded) or `60px 1fr` (collapsed)  
Canvas background: `rgb(243, 245, 246)` — topbar, sidebar, and outer area are the same surface. The white `.pane` floats on top.

---

## 5. FI-Specific Design Rules

### VU Score colour coding
- **76–100 (High):** `--lyra-green-500` / `--lyra-green-700`
- **50–75 (Medium):** `--lyra-orange-500`
- **0–49 (Low):** `--lyra-red-500`
- **Null / no data:** `--lyra-slate-400`

### AI surface treatment
Any feature powered by LLM or Topic AI should use:
- Background: `--color-bg-ai` (`#f4eefb`, lavender wash)
- Text/icons: `--color-fg-ai` (`--lyra-purple-700`)
- Label: include an "AI" chip (`--lyra-purple-500` background, white text)

### Channel icons
- Digital (chat/social): speech bubble SVG icon
- Voice: phone SVG icon
- Cognigy / AI agent: bot SVG icon

### Working Copy pattern
Campaigns with unpublished edits show a `Working Copy` chip alongside the status pill. The published version number is always visible.

---

## 6. Workflow & Conventions

### Editing the prototype
1. **Open** `Feedback Intelligence (29th May Update 2).html` in a browser (no build step)
2. **Edit** `.jsx` and `.css` files in the `lyra/` folder using VS Code or Claude Code
3. **Hard-refresh** the browser to see changes (Cmd+Shift+R / Ctrl+Shift+R)
4. The HTML file loads all scripts/styles via relative paths — keep file structure intact

### Adding a new screen
1. Create `lyra/newscreen.jsx`
2. Add a `<script src="lyra/newscreen.jsx" type="text/babel">` tag in the HTML `<head>`
3. Add the route key to `FI_NAV` in `app.jsx`
4. Handle the route in `App()` in `app.jsx`

### Adding new CSS
- FI-specific styles → `lyra/styles.css`
- Shell/layout changes → `lyra/shell.css`
- Never add new CSS custom properties (tokens) — use only what's defined in `colors_and_type.css`
- Never use hex/rgba values directly — always reference a Lyra token

### Git workflow
- Branch: work on `main` for now (MVP prototype, single contributor)
- Commit message format: `[FI] short description of change`
- Push to: `https://github.com/Advait-UX/MVP-Feedback-Intelligence--30th-May.git`

### Naming the HTML file
When saving an updated prototype version:
- Format: `Feedback Intelligence (DD Month Update N).html`
- Keep old versions for reference

---

## 7. Product Context & Key Concepts

### VU Score
**VU (Urgency) Score** = composite 0–100 measure of how urgently a customer's feedback needs attention.

Formula: `base_score = Σ(topic_weight × sentiment_multiplier) + Σ(modifiers)`

Components:
- **Topics** — dimensions FI scores (Resolution, Empathy, Effort, Wait Time, etc.)
- **Topic Weights** — how much each topic contributes (must sum to 100)
- **Sentiment Multipliers** — scale the topic score based on interaction sentiment polarity
- **Strategic Modifiers** — additive/multiplicative rules (e.g. escalation penalty ×0.75, FCR bonus ×1.15)

### Campaign lifecycle
`Draft → Active → Paused → Ended`

A campaign can have a **Working Copy** (unpublished edits) alongside a live **Published version**.

### Channels (MVP scope)
- Digital Chat
- Social DM
- AI Agent (Cognigy)

Voice is out of scope for MVP (planned v2.2.0 Q4 2026).

---

## 8. Key References

### Confluence
| Resource | Link |
|---|---|
| Space overview | https://nice-ce-cxone-prod.atlassian.net/wiki/spaces/CXFM/overview |
| Initiative HLD (CXFM-2) | https://nice-ce-cxone-prod.atlassian.net/wiki/spaces/CXFM/pages/3682403609 |
| VU Algorithm & Scoring | https://nice-ce-cxone-prod.atlassian.net/wiki/spaces/CXFM/pages/3747283023 |
| VU Algorithm (Topic AI v1.0) | https://nice-ce-cxone-prod.atlassian.net/wiki/spaces/CXFM/pages/3746759056 |
| Campaign Config & Eligibility | https://nice-ce-cxone-prod.atlassian.net/wiki/spaces/CXFM/pages/3682403644 |
| FI HLD (full) | https://nice-ce-cxone-prod.atlassian.net/wiki/spaces/CXFM/pages/3690693677 |

### Code & Design
| Resource | Link / Path |
|---|---|
| GitHub repo | https://github.com/Advait-UX/MVP-Feedback-Intelligence--30th-May.git |
| Lyra Figma file | https://www.figma.com/design/qyCq4jUOrpYcpHhpNCdgA5/Lyra-Foundations--V1- |
| Lyra JSON tokens | `lyra/lyra-tokens.json` |
| CSS tokens file | `lyra/colors_and_type.css` |

### Lyra Figma — Key Page Node IDs
Use these with the Figma MCP (`get_metadata`, `get_screenshot`) to inspect live design specs.

| Page | Node ID | Contents |
|---|---|---|
| Base Colors | `14840:18536` | Full colour palette swatches |
| Semantic Tokens | `17289:41052` | Semantic token reference |
| Typography | `16788:14400` | Full type scale table |
| Sizes / Spacing | `16807:13894` | Spacing + size tokens |
| Shadows | `17432:301870` | Elevation + shadow styles |
| Suite Shell (Top Bar) | `20266:61976` | Topbar component specs |
| Suite Shell (Nav) | `21450:137846` | Left nav component specs |
| Suite Shell (Full) | `20269:73060` | Full shell layout |
| Forms & Inputs | `16926:20792` | Input, select, checkbox, radio |
| Navigation | `16950:30982` | Nav patterns |
| Containers | `17022:34658` | Cards, panels |
| Data Display | `17074:36763` | Tables, lists |
| Overlays | `17015:32476` | Modals, drawers, tooltips |
| Messaging | `17022:33876` | Banners, toasts, alerts |
| AI Indicators | `17897:9473` | AI chip, loading states |

> **Figma MCP file key:** `qyCq4jUOrpYcpHhpNCdgA5` — pass this as `fileKey` to any Figma MCP tool call.
