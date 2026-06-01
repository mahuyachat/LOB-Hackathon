/* Lyra Shell (React port) — topbar + left nav + app-switcher dropdown. */

/* Lyra brand mark — the official "Union" smile from Lyra Foundations.
   Renders Figma's PNG asset first (pixel-perfect to the design); falls back to
   a hand-drawn asymmetric SVG approximation if the asset URL doesn't load. */
const LYRA_SMILE_URL = "https://www.figma.com/api/mcp/asset/23309042-4af8-493a-abdb-6b9c4cd978d6";

function LyraSmile() {
  const [errored, setErrored] = React.useState(false);
  if (!errored) {
    return (
      <img src={LYRA_SMILE_URL} alt="" width="24" height="24"
        style={{ display: "block" }}
        onError={() => setErrored(true)}/>
    );
  }
  /* Fallback: asymmetric Lyra smile — two close-together eyes upper-left,
     one continuous curve flowing down and curling up to the right. */
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="currentColor">
      <circle cx="5" cy="6" r="2.2"/>
      <circle cx="10.5" cy="6" r="2.2"/>
      <path d="M2.5 11 C 4 17.5, 10 20.5, 16 18 C 19.5 16.5, 22 13, 22.5 9"
        fill="none" stroke="currentColor" strokeWidth="2.8"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* Backward-compat: existing code references SMILE_SVG */
const SMILE_SVG = <LyraSmile/>;

function Chev({ rot = 0 }) {
  return (
    <svg className="chev" viewBox="0 0 16 16" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M3.5 6 8 10.5 12.5 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Topbar({ product, productAccent, onProductClick, onAppSwitcherClick }) {
  return (
    <div className="topbar">
      {/* Lyra _shellbar/app name (node 20232:24572): one unified pill containing
          smile + product name + chevron — the whole thing is the click target. */}
      <div className={`app-title ${productAccent || ""}`} onClick={onProductClick}>
        <div className="brand-mark" style={{ color: "var(--lyra-brand-500)" }}>{SMILE_SVG}</div>
        <span>{product}</span>
        {productAccent === "fi" ? <span className="fi-chip">AI</span> : null}
        <Chev/>
      </div>
      {/* Lyra Utilities slot2 (node 17643:44156): 3 service icons grouped tight, then 8px gap to profile */}
      <div className="topbar-utilities">
        <div className="hdr-icon-group">
          <div className="hdr-icon" title="Help">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2 2.2-2.5 3.2"/><circle cx="12" cy="16.5" r=".6" fill="currentColor"/></svg>
          </div>
          <div className="hdr-icon" title="App switcher" onClick={onAppSwitcherClick}>
            <svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="6" height="6" rx="1"/><rect x="14.5" y="3.5" width="6" height="6" rx="1"/><rect x="3.5" y="14.5" width="6" height="6" rx="1"/><rect x="14.5" y="14.5" width="6" height="6" rx="1"/></svg>
          </div>
          <div className="hdr-icon" title="Notifications">
            <svg viewBox="0 0 24 24"><path d="M6 9a6 6 0 0 1 12 0c0 5 2.5 7 2.5 7H3.5S6 14 6 9z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>
            <span className="dot-badge">3</span>
          </div>
        </div>
        <div className="hdr-avatar">
          <div className="ava">MC</div>
          <Chev/>
        </div>
      </div>
    </div>
  );
}

const NAV_ICONS = {
  campaigns: <path d="M3 11l18-7v16l-18-7v-2z M7 13v5"/>,
  insights:  <path d="M3 17l4-4 4 4 6-7 4 4 M14 10h4v4"/>,
  topics:    <path d="M21 12a8 8 0 1 1-3-6.2L21 4v6h-6"/>,
  responses: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M8 9h8 M8 13h5"/>,
  alerts:    <path d="M6 9a6 6 0 0 1 12 0c0 5 2.5 7 2.5 7H3.5S6 14 6 9z M10 20a2 2 0 0 0 4 0"/>,
  settings:  <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M19 12a7 7 0 0 0-.1-1.2l2.1-1.6-2-3.5-2.5 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.5a7 7 0 0 0-2 1.2l-2.5-1-2 3.5L5.1 10.8A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2.1 1.6 2 3.5 2.5-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.5a7 7 0 0 0 2-1.2l2.5 1 2-3.5-2.1-1.6c.1-.4.1-.8.1-1.2z"/>,
};

function NavIcon({ name }) {
  return (
    <svg className="ico" viewBox="0 0 24 24">
      {NAV_ICONS[name] || NAV_ICONS.campaigns}
    </svg>
  );
}

function LeftNav({ items, onLeafClick, minimized = false, onToggleMinimized }) {
  const [collapsed, setCollapsed] = React.useState({});
  return (
    <div className={`nav${minimized ? " minimized" : ""}`}>
      <div className="nav-collapse" title={minimized ? "Expand" : "Collapse"}
        onClick={onToggleMinimized}>
        <svg viewBox="0 0 24 24" style={{ transform: minimized ? "rotate(180deg)" : "none" }}>
          <polyline points="15 18 9 12 15 6"
            stroke="currentColor" strokeWidth="1.8" fill="none"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="nav-scroll">
        {items.map((it, i) => {
          if (it.type === "group") {
            const isCol = collapsed[i] ?? !it.expanded;
            return (
              <React.Fragment key={i}>
                <div className={`nav-item ${isCol ? "collapsed" : ""}`}
                  title={minimized ? it.label : undefined}
                  onClick={() => setCollapsed({ ...collapsed, [i]: !isCol })}>
                  <NavIcon name={it.icon}/>
                  <span className="nav-label">{it.label}</span>
                  <Chev/>
                </div>
                <div className={`nav-children ${isCol ? "hidden" : ""}`}>
                  {(it.children || []).map((c, j) => (
                    <div key={j}
                      className={`nav-leaf ${c.active ? "active" : ""}`}
                      title={minimized ? c.label : undefined}
                      onClick={() => onLeafClick && onLeafClick(c)}>
                      <span className="nav-label">{c.label}</span>
                      {c.isNew ? <span className="nav-new-dot" title="New"/> : null}
                    </div>
                  ))}
                </div>
              </React.Fragment>
            );
          }
          return (
            <div key={i}
              className={`nav-item ${it.active ? "active" : ""}`}
              title={minimized ? it.label : undefined}
              onClick={() => onLeafClick && onLeafClick(it)}>
              <NavIcon name={it.icon}/>
              <span className="nav-label">{it.label}</span>
              {it.isNew ? <span className="nav-new-dot" title="New"/> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Lyra-styled "Feedback Intelligence" product icon: a chat bubble with a sparkle.
function FIProductIcon({ size = 18 }) {
  return (
    <svg className="ico" viewBox="0 0 24 24" width={size} height={size}>
      <defs>
        <linearGradient id="fiGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--fi-accent)"/>
          <stop offset="1" stopColor="var(--lyra-purple-500)"/>
        </linearGradient>
      </defs>
      <path d="M4 5h13a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-5l-5 4v-4H4a0 0 0 0 1 0 0V8a3 3 0 0 1 3-3z"
        stroke="url(#fiGrad)" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
      <path d="M13.5 8.5 14.4 10.6 16.5 11.5 14.4 12.4 13.5 14.5 12.6 12.4 10.5 11.5 12.6 10.6Z"
        fill="url(#fiGrad)"/>
    </svg>
  );
}

/* ─── App-menu glyphs — Lyra stroke icons (1.7 stroke, round caps, 24 viewBox) ─── */
const APP_ICON_PATHS = {
  // Admin & Setup
  "Admin":              "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M19 12c0-.4 0-.8-.1-1.2l2.1-1.6-2-3.5-2.5 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.5a7 7 0 0 0-2 1.2l-2.5-1-2 3.5L5.1 10.8C5 11.2 5 11.6 5 12s0 .8.1 1.2l-2.1 1.6 2 3.5 2.5-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.5a7 7 0 0 0 2-1.2l2.5 1 2-3.5-2.1-1.6c.1-.4.1-.8.1-1.2z",
  "Supervisor":         "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  "Message Center":     "M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z M3.5 6.5 12 13l8.5-6.5",
  "AI Studio":          "M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8L16.5 18.5l1.8-.7z",
  // Conversational AI
  "Cognigy AI":         "M6 8h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z M12 4v4 M9 13v.01 M15 13v.01 M2 12h2 M20 12h2",
  "Agent Integration":  "M14 4a2 2 0 0 1 2 2v3h3a2 2 0 1 1 0 4h-3v3a2 2 0 1 1-4 0v-3H9a2 2 0 1 1 0-4h3V6a2 2 0 0 1 2-2z M6 11a2 2 0 1 0 0 4",
  "WFI":                "M4 14a1 1 0 0 1-1-1v-1a9 9 0 0 1 18 0v1a1 1 0 0 1-1 1h-1v4a2 2 0 0 1-2 2h-2 M4 14v3a2 2 0 0 0 2 2h1v-7a1 1 0 0 0-1-1H4z",
  "Neva Studio":        "M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z",
  // Routing & Agent
  "ACD":                "M3 6h11l3 3-3 3H3z M21 12v6a2 2 0 0 1-2 2H7l-4 4V14",
  "Agent":              "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0",
  "MAX":                "M3 5h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z M8 21h8 M12 17v4",
  "Studio":             "M14 2 4 12l-1 5 5-1L18 6z M13 3l4 4",
  "Studio Authentication": "M8 11V8a4 4 0 1 1 8 0v3 M6 11h12v9H6z M12 15v2",
  // Workforce Engagement
  "Workforce Management": "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M2 21a7 7 0 0 1 14 0 M17 8a3 3 0 1 0 0 6 M22 19a5 5 0 0 0-5-5",
  "Enhanced Strategic Planner": "M5 4h14a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M3 9h18 M8 2v4 M16 2v4 M9 14l2 2 4-4",
  "Quality Management": "M12 3 4 6v6c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9V6z M8.5 12l2.5 2.5L15.5 10",
  "Feedback Intelligence": "M4 5h13a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-5l-5 4v-4H4a0 0 0 0 1 0 0V8a3 3 0 0 1 3-3z M13.5 8.5 14.4 10.6 16.5 11.5 14.4 12.4 13.5 14.5 12.6 12.4 10.5 11.5 12.6 10.6Z",
  "Performance Management": "M3 17l6-6 4 4 8-8 M14 7h7v7",
  "Coaching":           "M22 9 12 4 2 9l10 5 10-5z M6 11v6c0 1 3 3 6 3s6-2 6-3v-6 M22 10v6",
  "Interaction Hub":    "M21 11.5a8 8 0 0 1-3.7 6.7l1 2.8-3-1.5a9 9 0 0 1-13.3-7.9A8 8 0 1 1 21 11.5z M8 12h.01 M12 12h.01 M16 12h.01",
  "My Zone":            "M3 11.5 12 4l9 7.5 M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9",
  "Desktop Discovery":  "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14z M16 16l5 5",
  // Analytics & Reporting
  "Actions":            "M13 2 3 14h7l-1 8 10-12h-7z",
  "Dashboard":          "M4 4h6v8H4z M14 4h6v5h-6z M14 13h6v7h-6z M4 16h6v4H4z",
  "Analytics":          "M4 20V10 M10 20V4 M16 20v-7 M20 20h-2",
  "Reporting":          "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M14 3v6h6 M9 13h6 M9 17h4",
  "Metric":             "M21 12h-4l-3 8-6-16-3 8H1",
  "Self-Service Analytics": "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14z M16 16l5 5 M8 12h6 M11 9v6",
  "Enlighten XO":       "M9 18h6 M10 22h4 M12 2a7 7 0 0 0-4 12.7c.9.7 1.5 1.7 1.5 2.8V18h5v-.5c0-1.1.6-2.1 1.5-2.8A7 7 0 0 0 12 2z",
  // Other
  "Performance Mgt.":   "M3 17l6-6 4 4 8-8 M14 7h7v7",
  "Feedback Management": "M21 11.5a8 8 0 0 1-3.7 6.7l1 2.8-3-1.5a9 9 0 0 1-13.3-7.9A8 8 0 1 1 21 11.5z M8 11l3 3 5-5",
  "Digital":            "M3 5h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z M9 19h8 M19 9h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z",
  "Adapters":           "M9 2v4 M15 2v4 M7 6h10v4a5 5 0 0 1-5 5v0a5 5 0 0 1-5-5z M12 15v3a3 3 0 0 0 3 3",
  "Connections Hub":    "M9 14a5 5 0 0 0 7.1 0l2.8-2.8a5 5 0 1 0-7.1-7.1L10 6 M15 10a5 5 0 0 0-7.1 0L5.1 12.8a5 5 0 1 0 7.1 7.1L14 18",
  "Guide":              "M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z M20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z",
};

function AppGlyph({ label }) {
  const path = APP_ICON_PATHS[label];
  if (!path) return null;
  return (
    <svg viewBox="0 0 24 24" width="20" height="20"
      fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path}/>
    </svg>
  );
}

/* ─── Lyra App Menu — Figma node 20360:75452 ─────────────────────────────── */
/* Icon URLs are hosted on Figma's MCP asset CDN. They render fine in any
   browser. Asset URLs are short-lived (~7 days) — refresh from Figma when needed. */
const FIG = "https://www.figma.com/api/mcp/asset/";
const ICO = {
  admin:               FIG + "1f377869-d417-4dbd-8c7a-b1108d1200bb",
  supervisor:          FIG + "b789cfcc-179e-43b7-8959-c267d2929495",
  messageCenter:       FIG + "a13fbf83-1c2b-4188-b851-602553acc1c8",
  aiStudio:            FIG + "928f5931-ad86-428a-86ed-fdbcc7b82382",
  cognigyAi:           FIG + "8a99aa57-ba52-496c-a4b3-d023e1fb8636",
  agentIntegration:    FIG + "9743e421-2201-4fcc-b753-b0d88d0b3855",
  wfi:                 FIG + "4e6a8333-34ae-4376-9720-cffc85c6e5ad",
  nevaStudio:          FIG + "66a0be22-23d8-46a6-b3b0-26b235b29cb8",
  acd:                 FIG + "a4c427e1-28d9-4c42-9cfe-78bf2167fff0",
  agent:               FIG + "7bf3c4b1-1829-485b-8844-cc31327961f1",
  studio:              FIG + "78d05422-f88b-4325-8999-92b0a05d983c",
  studioAuth:          FIG + "7f14ff56-b8be-4733-ada9-620ce3c180bc",
  workforceManagement: FIG + "5d041be9-9d46-47bd-9cf2-b54a3cfeabdc",
  esp:                 FIG + "cee36ab0-263a-4fc3-bdcc-2daaa3026b59",
  qualityManagement:   FIG + "771c10d8-c9ac-47e5-8037-68ecc94f6b7b",
  performanceMgt:      FIG + "8b9151c8-abe0-4e45-886b-4908c5fd5917",
  coaching:            FIG + "30f12e41-23c3-4ab8-b4cb-17f09f52edf5",
  interactionHub:      FIG + "21c2755d-18ae-4356-98e2-592c18a36e36",
  myZone:              FIG + "ee2ce384-4c1d-42db-a412-e3f9f3c653ac",
  desktopDiscovery:    FIG + "7decc1ae-6ced-4110-827d-1c6342f5120a",
  actions:             FIG + "d4c6d2ab-edb2-42ba-8428-c5cea0c844f8",
  dashboard:           FIG + "819cc89b-2a22-433e-a094-23c9ed35ebac",
  analytics:           FIG + "274e46f0-032b-421e-b9f8-02c090fd4bd4",
  reporting:           FIG + "b2111b53-923c-48db-985d-08c1f0ef0d75",
  metric:              FIG + "e4532d34-eeae-442e-b4b4-47582da29e86",
  ssa:                 FIG + "ee464f7f-2ed2-42ab-aecf-6feb23aa6501",
  enlightenXo:         FIG + "bdc6f683-62fd-4f7b-afb5-cc9645f193ed",
  pmLegacy:            FIG + "fa1bdad3-421f-406e-ae3e-5db0e5c81ddb",
  feedbackManagement:  FIG + "43bb03af-5ac3-4c40-93bf-aabc8b2a0606",
  digital:             FIG + "73c4e26e-cf79-4c48-83fe-79fcc839c116",
  adapters:            FIG + "41def149-bc4c-4541-8000-3a1e576f18bd",
  connectionsHub:      FIG + "b36b6d30-3b63-4abf-b944-419e34c2d647",
  guide:               FIG + "f1ecd98e-9c55-4b35-b51e-ac2b06521595",
  cxoneWordmark:       FIG + "18845e63-6165-43b6-bdf2-f732f0663deb",
};

/* Six app groups, each with its 50%-opacity tinted icon background
   (Figma values: teal #8ed6ee, purple #ab9ced, orange #ffcd83,
    green #95dd9b, red #fbb6b6, slate #c6cdd1). */
const APP_MENU_GROUPS = [
  {
    bg: "rgba(142,214,238,0.5)",
    apps: [
      { label: "Admin",          icon: ICO.admin },
      { label: "Supervisor",     icon: ICO.supervisor },
      { label: "Message Center", icon: ICO.messageCenter },
      { label: "AI Studio",      icon: ICO.aiStudio },
    ]
  },
  {
    bg: "rgba(171,156,237,0.5)",
    apps: [
      { label: "Cognigy AI",         icon: ICO.cognigyAi },
      { label: "Agent Integration",  icon: ICO.agentIntegration },
      { label: "WFI",                icon: ICO.wfi },
      { label: "Neva Studio",        icon: ICO.nevaStudio },
    ]
  },
  {
    bg: "rgba(255,205,131,0.5)",
    apps: [
      { label: "ACD",                   icon: ICO.acd },
      { label: "Agent",                 icon: ICO.agent },
      { label: "MAX",                   icon: ICO.agent },
      { label: "Studio",                icon: ICO.studio },
      { label: "Studio Authentication", icon: ICO.studioAuth },
    ]
  },
  {
    bg: "rgba(149,221,155,0.5)",
    apps: [
      { label: "Workforce Management",       icon: ICO.workforceManagement, key: "wfm" },
      { label: "Enhanced Strategic Planner", icon: ICO.esp },
      { label: "Quality Management",         icon: ICO.qualityManagement },
      { label: "Feedback Intelligence",      icon: null, key: "fi", isNew: true },
      { label: "Performance Management",     icon: ICO.performanceMgt },
      { label: "Coaching",                   icon: ICO.coaching },
      { label: "Interaction Hub",            icon: ICO.interactionHub },
      { label: "My Zone",                    icon: ICO.myZone },
      { label: "Desktop Discovery",          icon: ICO.desktopDiscovery },
    ]
  },
  {
    bg: "rgba(251,182,182,0.5)",
    apps: [
      { label: "Actions",                icon: ICO.actions },
      { label: "Dashboard",              icon: ICO.dashboard },
      { label: "Analytics",              icon: ICO.analytics },
      { label: "Reporting",              icon: ICO.reporting },
      { label: "Metric",                 icon: ICO.metric },
      { label: "Self-Service Analytics", icon: ICO.ssa },
      { label: "Enlighten XO",           icon: ICO.enlightenXo },
    ]
  },
  {
    bg: "rgba(198,205,209,0.5)",
    apps: [
      { label: "Performance Management (legacy)", icon: ICO.pmLegacy },
      { label: "Digital",                         icon: ICO.digital },
      { label: "Adapters",                        icon: ICO.adapters },
      { label: "Connections Hub",                 icon: ICO.connectionsHub },
      { label: "Guide",                           icon: ICO.guide },
    ]
  },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className="app-menu-check">
      <polyline points="3 8.5 6.5 12 13 5"
        stroke="currentColor" strokeWidth="1.8"
        fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* FI sparkle icon — no Figma asset for Feedback Intelligence yet, so this
   renders as a green chat-bubble-with-sparkle that matches the WEM group. */
function FISparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
      stroke="var(--lyra-green-700)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5h13a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-5l-5 4v-4H4z"/>
      <path d="M13.5 8.5 14.4 10.6 16.5 11.5 14.4 12.4 13.5 14.5 12.6 12.4 10.5 11.5 12.6 10.6Z"
        fill="var(--lyra-green-700)"/>
    </svg>
  );
}

/* Renders an app icon: tries the Figma asset URL first, falls back to a
   local SVG glyph if the image fails to load (URLs are auth-gated CDN). */
function AppIcon({ src, label, accent }) {
  const [errored, setErrored] = React.useState(false);
  if (errored || !src) {
    return <AppGlyph label={label}/>;
  }
  return (
    <img src={src} alt="" width="20" height="20"
      onError={() => setErrored(true)}/>
  );
}

function AppSwitcher({ onNavigate, onClose, currentProduct }) {
  return (
    <>
      <div className="app-menu-scrim" onClick={onClose}/>
      <div className="app-menu">
        <div className="app-menu-scroll">
          {APP_MENU_GROUPS.map((group, gi) => (
            <React.Fragment key={gi}>
              {gi > 0 && <div className="app-menu-gap" aria-hidden="true"/>}
              {group.apps.map((app, ai) => {
                const isActive =
                  (app.key === "fi"  && currentProduct === "FI") ||
                  (app.key === "wfm" && currentProduct === "WFM");
                const isClickable = !!app.key;
                return (
                  <div key={ai}
                    className={`app-menu-row${isActive ? " active" : ""}${isClickable ? " clickable" : ""}`}
                    onClick={isClickable ? () => onNavigate(app.key) : undefined}>
                    <div className="app-menu-icon" style={{ background: group.bg }}>
                      {app.key === "fi"
                        ? <FISparkleIcon/>
                        : <AppIcon src={app.icon} label={app.label}/>}
                    </div>
                    <span className="app-menu-label">{app.label}</span>
                    {app.isNew && <span className="app-menu-badge-new">NEW</span>}
                    {isActive && <CheckIcon/>}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div className="app-menu-footer">
          <img src={ICO.cxoneWordmark} alt="NiCE CXone" className="app-menu-cxone"/>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { Topbar, LeftNav, AppSwitcher, FIProductIcon, Chev, SMILE_SVG, NavIcon });
