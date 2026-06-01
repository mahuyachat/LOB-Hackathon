/* Feedback Intelligence — Survey Templates admin page.
   Survey templates are reusable presets separated from campaigns, so multiple
   campaigns can share the same question set, display style, and delivery rules.
   (Internal field names like `surveyDesignId` are kept for backward compatibility.) */

const SEED_DESIGNS = [
  { id: "csat-quick",     name: "Standard CSAT — Quick Reply",     description: "Default 1–5 star CSAT for digital channels. Quick-reply bubbles, AI questions on.", channel: "Digital", surveyType: "CSAT (1–5 star)", displayStyle: "Quick Reply", listPickerLabel: "", aiQuestions: true, maxQuestions: 2, freeText: "Conditional", welcomeMode: "with-optout", welcomeMessage: "{{First Name}}, we'd love to hear about your experience today. We have just a few quick questions, just two minutes of your time.", buttonToStart: "Get started", buttonToOptOut: "Not today", defaultScaleQuestion: "On a scale of 1 to 5, how would you rate your experience today?", defaultCommentQuestion: "What could we have done better?", expiryMinutes: 2880, realtimeAlerts: true, usedBy: 3, updated: "May 02, 2026", owner: "Maria Cohen" },
  { id: "csat-list",      name: "CSAT — List Picker",              description: "Same questions as Standard CSAT, but renders as a list picker for desktop chat.",   channel: "Digital", surveyType: "CSAT (1–5 star)", displayStyle: "List Picker",  listPickerLabel: "Rate your experience", aiQuestions: true, maxQuestions: 2, freeText: "Conditional", welcomeMode: "without-optout", welcomeMessage: "{{First Name}}, we'd love your quick feedback. Just two minutes of your time.", buttonToStart: "Get started", buttonToOptOut: "Not today", defaultScaleQuestion: "On a scale of 1 to 5, how would you rate your experience today?", defaultCommentQuestion: "What could we have done better?", expiryMinutes: 2880, realtimeAlerts: true, usedBy: 1, updated: "Apr 28, 2026", owner: "Maria Cohen" },
  { id: "bot-simple",     name: "Bot Handoff — 1 Question",         description: "Minimal one-question survey for AI bot deflection audits. No AI questions, no welcome.", channel: "Digital", surveyType: "Like / Dislike", displayStyle: "Quick Reply", listPickerLabel: "", aiQuestions: false, maxQuestions: 1, freeText: "Always off", welcomeMode: "none", welcomeMessage: "", buttonToStart: "Get started", buttonToOptOut: "Not today", defaultScaleQuestion: "Did the assistant solve your problem?", defaultCommentQuestion: "Anything we should know?", expiryMinutes: 1440, realtimeAlerts: false, usedBy: 1, updated: "Mar 30, 2026", owner: "Tomás Reyes" },
  { id: "vip-followup",   name: "VIP Escalation Follow-Up",         description: "Longer survey for high-value customer escalations. Comment always on, no expiry pressure.", channel: "Both", surveyType: "Both",            displayStyle: "List Picker",  listPickerLabel: "How are we doing?", aiQuestions: true, maxQuestions: 3, freeText: "Always on", welcomeMode: "with-optout", welcomeMessage: "{{First Name}}, thank you for your patience. Your feedback shapes how we serve our VIP customers.", buttonToStart: "Share feedback", buttonToOptOut: "Maybe later", defaultScaleQuestion: "Overall, how would you rate your experience?", defaultCommentQuestion: "Tell us what went well — and what didn't.", expiryMinutes: 4320, realtimeAlerts: true, usedBy: 1, updated: "May 06, 2026", owner: "Maria Cohen" },
  { id: "brand-pulse",    name: "Brand Health Pulse",               description: "Two-question brand-affinity survey for social DMs. Like/dislike + open comment.",       channel: "Digital", surveyType: "Like / Dislike", displayStyle: "Quick Reply", listPickerLabel: "", aiQuestions: false, maxQuestions: 2, freeText: "Always on", welcomeMode: "without-optout", welcomeMessage: "Quick pulse check — how are we doing?", buttonToStart: "Tell us", buttonToOptOut: "Not today", defaultScaleQuestion: "How do you feel about us today?", defaultCommentQuestion: "Tell us why in a few words.", expiryMinutes: 4320, realtimeAlerts: false, usedBy: 1, updated: "Apr 12, 2026", owner: "Aisha Khan" },
];

function designById(id) {
  return SEED_DESIGNS.find(d => d.id === id) || SEED_DESIGNS[0];
}

function SurveyDesignsGrid({ onCreate, onOpen }) {
  const [search, setSearch] = React.useState("");
  const [channelFilter, setChannelFilter] = React.useState(null);
  const [typeFilter, setTypeFilter] = React.useState(null);
  const [ownerFilter, setOwnerFilter] = React.useState(null);

  /* Filter options derived from the data so they stay in sync. */
  const channelOptions = Array.from(new Set(SEED_DESIGNS.map(d => d.channel))).sort();
  const typeOptions = Array.from(new Set(SEED_DESIGNS.map(d => d.surveyType))).sort();
  const ownerOptions = Array.from(new Set(SEED_DESIGNS.map(d => d.owner))).sort();
  const hasAnyFilter = !!(search || channelFilter || typeFilter || ownerFilter);
  const clearAllFilters = () => {
    setSearch(""); setChannelFilter(null); setTypeFilter(null); setOwnerFilter(null);
  };

  const rows = SEED_DESIGNS.filter(d => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (channelFilter && d.channel !== channelFilter) return false;
    if (typeFilter && d.surveyType !== typeFilter) return false;
    if (ownerFilter && d.owner !== ownerFilter) return false;
    return true;
  });

  /* Same Lyra badge pattern as StatusPill — soft bg + tinted border + 500 12/16 letter-spacing 0.01rem */
  const channelBadgeStyle = (channel) => ({
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "4px 10px",
    borderRadius: 9999,
    border: "1px solid",
    fontFamily: "var(--font-sans)",
    fontSize: 12, fontWeight: 500, lineHeight: "16px", letterSpacing: "0.01rem",
    background: channel === "IVR" ? "var(--fi-amber-bg)" : channel === "Both" ? "var(--fi-purple-bg)" : "var(--fi-accent-bg)",
    color: channel === "IVR" ? "var(--fi-amber)" : channel === "Both" ? "var(--fi-purple)" : "var(--fi-accent-strong)",
    borderColor: channel === "IVR" ? "rgba(166,79,0,0.20)" : channel === "Both" ? "rgba(120,86,186,0.20)" : "rgba(13,138,138,0.20)",
  });

  return (
    <div className="pane">
      <div className="pane-head">
        <h1>Survey Templates</h1>
        <div className="head-actions">
          <button className="btn primary" onClick={() => onCreate()}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Survey Template
          </button>
        </div>
      </div>

      {/* Lyra filter bar — search on the left + Channel / Type / Owner filter chips */}
      <div className="toolbar" style={{ paddingTop: 14 }}>
        <div className="search">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input placeholder="Search survey templates"
            value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <window.FilterChip label="Channel" value={channelFilter} options={channelOptions}
          onSelect={setChannelFilter} onClear={() => setChannelFilter(null)}/>
        <window.FilterChip label="Type" value={typeFilter} options={typeOptions}
          onSelect={setTypeFilter} onClear={() => setTypeFilter(null)}/>
        <window.FilterChip label="Owner" value={ownerFilter} options={ownerOptions}
          onSelect={setOwnerFilter} onClear={() => setOwnerFilter(null)}/>
        {hasAnyFilter && (
          <button className="clear-link" onClick={clearAllFilters}>Clear</button>
        )}
      </div>

      {/* Lyra info banner — placed after filters, just above the table */}
      <div className="info-banner">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span>Reusable templates that define a survey's questions, display style, and delivery rules. Map one template to many campaigns — change the template once and every linked campaign picks it up.</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Survey template</th>
              <th>Channel</th>
              <th>Type</th>
              <th>Digital style</th>
              <th>AI questions</th>
              <th>Max Qs</th>
              <th>Used by</th>
              <th>Owner</th>
              <th>Last updated</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(d => (
              <tr key={d.id}>
                <td style={{ maxWidth: 360 }}>
                  <a className="agent-link" href="#" onClick={e => { e.preventDefault(); onOpen(d); }}>
                    {d.name}
                  </a>
                  {/* Lyra Body SM secondary text — Inter Regular 12/16 letter-spacing 0.01rem */}
                  <div style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12, fontWeight: 400, lineHeight: "16px", letterSpacing: "0.01rem",
                    color: "var(--color-fg-secondary)",
                    marginTop: 4, whiteSpace: "normal", maxWidth: 340,
                  }}>
                    {d.description}
                  </div>
                </td>
                <td>
                  <span style={channelBadgeStyle(d.channel)}>{d.channel || "Digital"}</span>
                </td>
                <td>{d.surveyType}</td>
                <td>
                  {(d.channel === "Digital" || d.channel === "Both") ? (
                    <>
                      {d.displayStyle}
                      {d.displayStyle === "List Picker" && d.listPickerLabel ? (
                        <div style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: 12, fontWeight: 400, lineHeight: "16px", letterSpacing: "0.01rem",
                          color: "var(--color-fg-secondary)", marginTop: 4,
                        }}>"{d.listPickerLabel}"</div>
                      ) : null}
                    </>
                  ) : <span style={{ color: "var(--lyra-slate-400)" }}>—</span>}
                </td>
                <td>
                  {/* Lyra-style On/Off badge — matches StatusPill treatment */}
                  <span className={`fi-pill ${d.aiQuestions ? "active" : "ended"}`}>
                    <span className="dot"/>{d.aiQuestions ? "On" : "Off"}
                  </span>
                </td>
                <td>{d.maxQuestions}</td>
                <td>
                  <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 14, fontWeight: 400, lineHeight: "20px", letterSpacing: 0,
                    color: d.usedBy === 0 ? "var(--lyra-slate-400)" : "var(--color-fg-default)",
                  }}>
                    {d.usedBy} {d.usedBy === 1 ? "campaign" : "campaigns"}
                  </span>
                </td>
                <td>{d.owner}</td>
                <td>{d.updated}</td>
                <td>
                  <div className="kebab">
                    <svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const DEFAULT_DESIGN = {
  name: "",
  description: "",
  channel: "Digital",
  surveyType: "CSAT (1–5 Star)",
  displayStyle: "Quick Reply",
  listPickerLabel: "Rate your experience",
  welcomeMode: "with-optout",
  welcomeMessage: "{{First Name}}, we'd love to hear about your experience today. We have just a few quick questions, just two minutes of your time.",
  buttonToStart: "Get started",
  buttonToOptOut: "Not today",
  aiQuestions: true,
  defaultScaleQuestion: "On a scale of 1 to 5, how would you rate your experience today?",
  defaultCommentQuestion: "What could we have done better?",
  maxQuestions: 2,
  freeText: "Conditional",
  expiryMinutes: 2880,
  realtimeAlerts: true,
};

function CreateSurveyDesign({ onCancel, onSave, initial }) {
  const [d, setD] = React.useState(initial || DEFAULT_DESIGN);
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));
  const isEdit = !!initial;
  const [activeStep, setActiveStep] = React.useState(1);

  // Linked campaigns: seed from any campaign whose surveyDesignId matches this design's id.
  const initialLinkedIds = React.useMemo(() => {
    if (!initial || !window.CAMPAIGNS) return [];
    return window.CAMPAIGNS.filter(c => c.surveyDesignId === initial.id).map(c => c.id);
  }, [initial]);
  const [linkedIds, setLinkedIds] = React.useState(initialLinkedIds);
  const toggleLink = (id) => setLinkedIds(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const STEPS = [
    { n: 1, label: "Identity",         id: "dsec-1", done: !!d.name },
    { n: 2, label: "Survey Content",   id: "dsec-2", done: !!d.defaultScaleQuestion },
    { n: 3, label: "Delivery",         id: "dsec-3", done: true },
    { n: 4, label: "Linked Campaigns", id: "dsec-4", done: linkedIds.length > 0 },
  ];

  function TemplateFloatingSummary() {
    const rows = [
      {
        icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="1.5" width="10" height="13" rx="1.5"/><line x1="6" y1="5" x2="10" y2="5"/><line x1="6" y1="8" x2="10" y2="8"/><line x1="6" y1="11" x2="8.5" y2="11"/></svg>,
        label: "Name",
        value: d.name || <span style={{ color: "var(--color-fg-disabled)", fontStyle: "italic" }}>Not set</span>,
      },
      {
        icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 11.5C2 9.5 3.5 8 5.5 8h5C12.5 8 14 9.5 14 11.5"/><circle cx="8" cy="4.5" r="2.5"/></svg>,
        label: "Channel",
        value: d.channel || "Digital",
      },
      {
        icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 4v4l3 2"/></svg>,
        label: "Survey type",
        value: d.surveyType || "—",
      },
    ];

    return (
      <div className="summary-card">
        <div className="summary-card-head">Template Summary</div>
        <div className="summary-card-rows">
          {rows.map((r, i) => (
            <div className="summary-card-row" key={i}>
              <div className="summary-card-icon">{r.icon}</div>
              <div className="summary-card-row-body">
                <div className="summary-card-label">{r.label}</div>
                <div className="summary-card-value">{r.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pane" style={{ overflow: "hidden" }}>
      <div className="crumbs">
        <a href="#" onClick={e => { e.preventDefault(); onCancel(); }}>Feedback Intelligence</a>
        <span className="sep">/</span>
        <a href="#" onClick={e => { e.preventDefault(); onCancel(); }}>Survey Templates</a>
        <span className="sep">/</span>
        <span className="last">{isEdit ? d.name : "New Survey Template"}</span>
      </div>

      <div className="pane-head" style={{ paddingTop: 6 }}>
        <h1>{isEdit ? d.name : "New Survey Template"}</h1>
        <div className="head-actions">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn primary" disabled={!d.name}
            onClick={() => onSave(d)}>
            <svg viewBox="0 0 24 24"><polyline points="4 13 10 19 20 5"/></svg>
            {isEdit ? "Save changes" : "Save template"}
          </button>
        </div>
      </div>

      <div className="create-grid">
        {/* Side TOC */}
        <nav className="form-toc">
          {STEPS.map(s => (
            <div key={s.n}
              className={`toc-item ${activeStep === s.n ? "on" : ""} ${s.done ? "done" : ""}`}
              onClick={() => {
                setActiveStep(s.n);
                document.getElementById(s.id)?.scrollIntoView({ block: "start", behavior: "smooth" });
              }}>
              <span className="num">{s.n}</span>
              {s.label}
            </div>
          ))}
        </nav>

        {/* Form pane */}
        <div className="form-pane">

        <FormSection num={1} title="Identity"
          sub="Name this template so your team knows when to use it."
          id="dsec-1" complete={!!d.name}>
          <FieldRow label="Name" req hint="Use a name your team will recognise, e.g. 'Post-Chat CSAT'.">
            <input className="fi-input" placeholder="Type here"
              value={d.name} onChange={e => set("name", e.target.value)}/>
          </FieldRow>
          <FieldRow label="Description" hint="What this template is for and which campaigns should use it.">
            <textarea className="fi-input"
              placeholder="Type here"
              value={d.description} onChange={e => set("description", e.target.value)}/>
          </FieldRow>
        </FormSection>

        <FormSection num={2} title="Survey Content"
          sub="Set the questions customers will see and how they will answer."
          id="dsec-2" complete={!!d.defaultScaleQuestion}>

          {/* Survey Channel */}
          <FieldRow label="Survey channel" req
            tooltip="Choose where this survey will be delivered. This affects which display options are available below."
            hint={
              d.channel === "Digital" ? "Survey will be delivered on digital channels like: chat, AI sessions, social & email." :
              d.channel === "IVR"     ? "Survey will be sent after a phone call. Customers respond using their keypad." :
                                        "Survey will be delivered on both phone and digital channels."
            }>
            <Segmented options={["Digital", "IVR", "Both"]}
              value={d.channel} onChange={v => set("channel", v)}/>
          </FieldRow>

          {/* Welcome Message */}
          <FieldRow label={`Welcome Message (the first thing customer ${d.channel === "IVR" ? "hear" : "see"} before the survey starts)`} req
            tooltip="The opening screen before question 1. Offering an opt-out is recommended — customers who choose to respond give more honest feedback.">
            <div className="welcome-mode-radio">
              {(d.channel === "IVR" ? [
                { v: "with-optout",    label: "Invitation with Opt Out",    desc: "After hearing the message, the customer can press 1 to decline." },
                { v: "without-optout", label: "Invitation without Opt Out", desc: "The customer hears the message, then goes to the survey." },
                { v: "none",           label: "None",                       desc: "Survey starts immediately with no introduction." },
              ] : [
                { v: "with-optout",    label: "Invitation with Opt Out",    desc: "Customer can read the invitation & choose to decline it." },
                { v: "without-optout", label: "Invitation without Opt Out", desc: "Customer see the invitation & start button only." },
                { v: "none",           label: "None",                       desc: "Survey starts immediately with no introduction." },
              ]).map(opt => (
                <label key={opt.v} className={`welcome-mode-option ${d.welcomeMode === opt.v ? "on" : ""}`}>
                  <input type="radio" name="welcomeMode" value={opt.v}
                    checked={d.welcomeMode === opt.v}
                    onChange={() => set("welcomeMode", opt.v)}/>
                  <span className="dot"/>
                  <span className="body">
                    <span className="title">{opt.label}</span>
                    <span className="desc">{opt.desc}</span>
                  </span>
                </label>
              ))}
            </div>

            {d.welcomeMode !== "none" ? (
              <div style={{ marginTop: 12, padding: 16, borderRadius: 8, background: "var(--lyra-slate-100)", border: "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div className="kicker">Invitation Text</div>
                  <span style={{ font: "400 12px/16px var(--font-sans)", color: (d.welcomeMessage || "").length > 220 ? "var(--fi-amber)" : "var(--lyra-slate-400)" }}>
                    {(d.welcomeMessage || "").length}/240
                  </span>
                </div>
                <textarea className="fi-input" rows={3} maxLength={240}
                  style={{ resize: "vertical", minHeight: 72, font: "400 14px/20px Inter", background: "var(--lyra-white)" }}
                  placeholder={`"{{First Name}}", we'd love to hear about your experience today. We have just a few quick questions, just two minutes of your time.`}
                  value={d.welcomeMessage}
                  onChange={e => set("welcomeMessage", e.target.value)}/>
                <div className="help" style={{ marginTop: 6 }}>
                  Use <code style={{ background: "var(--lyra-white)", padding: "1px 5px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 3, font: "500 12px/16px Inter", color: "var(--lyra-slate-700)" }}>{"{{First Name}}"}</code> to personalise.
                </div>

                {/* Button labels — shown for Digital/Both */}
                {(d.channel === "Digital" || d.channel === "Both") ? (
                  <div style={{ display: "grid", gridTemplateColumns: d.welcomeMode === "with-optout" ? "1fr 1fr" : "1fr", gap: 12, marginTop: 14 }}>
                    <div>
                      <div className="kicker" style={{ marginBottom: 4 }}>Button label to get started with survey</div>
                      <input className="fi-input" disabled readOnly value={d.buttonToStart}
                        style={{ background: "var(--lyra-slate-200)", color: "var(--lyra-slate-600)", cursor: "not-allowed" }}/>
                    </div>
                    {d.welcomeMode === "with-optout" ? (
                      <div>
                        <div className="kicker" style={{ marginBottom: 4 }}>Button label to opt out / decline the survey</div>
                        <input className="fi-input" disabled readOnly value={d.buttonToOptOut}
                          style={{ background: "var(--lyra-slate-200)", color: "var(--lyra-slate-600)", cursor: "not-allowed" }}/>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {/* IVR note */}
                {d.channel === "IVR" ? (
                  <div className="help" style={{ marginTop: 10, padding: "8px 10px", borderRadius: 4, background: "rgba(0,0,0,0.03)" }}>
                    On phone surveys, this message is read aloud. The customer presses 1 to start or hangs up to skip.
                  </div>
                ) : null}
              </div>
            ) : null}
          </FieldRow>

          {/* Survey Type */}
          <FieldRow label="Survey type" req>
            <Segmented options={["CSAT (1–5 Star)", "Like / Dislike", "Both"]}
              value={d.surveyType} onChange={v => set("surveyType", v)}/>
          </FieldRow>

          {/* Digital Display Style — only for Digital/Both */}
          {(d.channel === "Digital" || d.channel === "Both") ? (
            <>
              <FieldRow label="Digital display style" req
                tooltip="Controls how the rating options appear to the customer in the chat window."
                hint={
                  d.displayStyle === "Quick Reply"
                    ? "Inline tappable bubbles below the question. Fastest to answer, best for ≤ 5 options on mobile."
                    : "Rating options appear as a list the customer can scroll through. Good for desktop and longer scales."
                }>
                <Segmented options={["Quick Reply", "List Picker"]}
                  value={d.displayStyle} onChange={v => set("displayStyle", v)}/>
              </FieldRow>
              {d.displayStyle === "List Picker" ? (
                <FieldRow label="List picker label" req
                  hint="Short heading shown above the dropdown, e.g. 'Rate your experience'.">
                  <input className="fi-input" maxLength={48}
                    placeholder="Rate your experience"
                    value={d.listPickerLabel}
                    onChange={e => set("listPickerLabel", e.target.value)}/>
                  <div className="help">{(d.listPickerLabel || "").length}/48 characters</div>
                </FieldRow>
              ) : null}
            </>
          ) : null}

          {/* AI-Generated Contextual Questions */}
          <FieldRow label="AI-Generated Contextual Questions">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label className="switch" style={{ flexShrink: 0 }}>
                <input type="checkbox" checked={d.aiQuestions} onChange={e => set("aiQuestions", e.target.checked)}/>
                <span className="slider" style={{ background: d.aiQuestions ? "var(--lyra-brand-600)" : undefined }}/>
              </label>
              <span style={{ font: "500 14px/20px var(--font-sans)", color: d.aiQuestions ? "var(--lyra-brand-600)" : "var(--color-fg-secondary)" }}>
                {d.aiQuestions ? "On - Question Adapts To Each Interaction" : "Off - Same questions for every customer"}
              </span>
            </div>
            <span className="hint">
              When on, the AI writes questions based on what happened in each call or chat. When off, every customer gets the same fixed questions.
            </span>
            {d.aiQuestions ? (
              <div style={{ padding: "12px 14px", borderRadius: 8, background: "var(--lyra-slate-100)", border: "1px solid rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { dot: "var(--fi-green)",       text: "If configured category is found, then AI writes questions specific to that category." },
                  { dot: "var(--fi-purple)",       text: "If unmatched category is found, then AI still writes questions, but the new category is flagged for your review." },
                  { dot: "var(--lyra-slate-400)",  text: "If no category is identified, then it falls back to the default questions you set below." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: item.dot, flexShrink: 0, marginTop: 7 }}/>
                    <span style={{ font: "400 13px/20px var(--font-sans)", color: "var(--color-fg-default)" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </FieldRow>

          {/* Default Fallback / Preconfigured Questions */}
          <FieldRow label={d.aiQuestions ? "Default Fallback Questions" : "Preconfigured Questions"} req>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ font: "500 12px/16px var(--font-sans)", color: "var(--color-fg-secondary)", marginBottom: 6 }}>Scale: Rating Question</div>
                <input className="fi-input" maxLength={120}
                  placeholder="On a scale of 1 to 5, how would you rate your experience today?"
                  value={d.defaultScaleQuestion}
                  onChange={e => set("defaultScaleQuestion", e.target.value)}/>
              </div>
              <div>
                <div style={{ font: "500 12px/16px var(--font-sans)", color: "var(--color-fg-secondary)", marginBottom: 6 }}>Text: Comment Question</div>
                <input className="fi-input" maxLength={120}
                  placeholder="What could we have done better?"
                  value={d.defaultCommentQuestion}
                  onChange={e => set("defaultCommentQuestion", e.target.value)}/>
              </div>
              <span className="hint">
                {d.aiQuestions
                  ? "This is sent when AI can't match the interaction to a topic. Keep these broad so they work for any conversation."
                  : "Every customer will receive these questions. Update them to reflect what your team wants to learn."}
              </span>
            </div>
          </FieldRow>

          {/* Free Text Comment Box */}
          <FieldRow label="Free Text Comment Box"
            hint={
              d.freeText === "Always On"  ? "Let customers write their own feedback in addition to the rating." :
              d.freeText === "Conditional" ? "Free text only appears when the rating is ≤ 2 stars." :
              null
            }>
            <Segmented options={["Always On", "Conditional", "Always Off"]}
              value={d.freeText}
              onChange={v => set("freeText", v)}/>
          </FieldRow>
        </FormSection>

        <FormSection num={3} title="Delivery"
          sub="Set how long the survey stays open and who gets notified on a poor score."
          id="dsec-3" complete>

          {/* Real-time Alerting */}
          <FieldRow label="Real time response alerting"
            hint="Notify a supervisor straight away when a customer gives 1 or 2 stars.">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label className="switch" style={{ flexShrink: 0 }}>
                <input type="checkbox" checked={d.realtimeAlerts} onChange={e => set("realtimeAlerts", e.target.checked)}/>
                <span className="slider" style={{ background: d.realtimeAlerts ? "var(--lyra-brand-600)" : undefined }}/>
              </label>
              <span style={{ font: "500 14px/20px var(--font-sans)", color: d.realtimeAlerts ? "var(--lyra-brand-600)" : "var(--color-fg-secondary)" }}>
                {d.realtimeAlerts
                  ? "On - Alert supervisor immediately on low ratings (1–2 stars)"
                  : "Off — supervisors are not notified on low ratings"}
              </span>
            </div>
          </FieldRow>
        </FormSection>

        <FormSection num={4} title="Linked Campaigns"
          sub="Choose which campaigns use this template. Any edits you make here will automatically apply to all linked campaigns."
          id="dsec-4" complete>
          <LinkedCampaignsTable
            linkedIds={linkedIds}
            currentDesignId={initial?.id}
            onToggle={toggleLink}
          />
        </FormSection>

        </div>

        {/* Right-rail summary */}
        <aside className="summary-pane">
          <TemplateFloatingSummary/>
        </aside>
      </div>
    </div>
  );
}

function LinkedCampaignsTable({ linkedIds, currentDesignId, onToggle }) {
  const [search, setSearch] = React.useState("");
  const [hideOtherMapped, setHideOtherMapped] = React.useState(false);
  const all = window.CAMPAIGNS || [];
  const rows = all.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (hideOtherMapped && c.surveyDesignId && c.surveyDesignId !== currentDesignId && !linkedIds.includes(c.id)) return false;
    return true;
  });
  const linkedCount = linkedIds.length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
        <div className="search" style={{ flex: "0 0 260px" }}>
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input placeholder="Search campaigns"
            value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "400 14px/20px Inter", color: "var(--lyra-slate-600)", cursor: "pointer" }}>
          <input type="checkbox" checked={hideOtherMapped} onChange={e => setHideOtherMapped(e.target.checked)}/>
          Hide campaigns mapped to another template
        </label>
        <span style={{ flex: 1 }}/>
        <span style={{
          font: "500 12px/16px Inter",
          color: linkedCount > 0 ? "var(--fi-accent-strong)" : "var(--lyra-slate-500)",
          background: linkedCount > 0 ? "var(--fi-accent-bg)" : "rgba(0,0,0,0.04)",
          padding: "var(--space-1) 10px", borderRadius: 999,
        }}>
          {linkedCount} {linkedCount === 1 ? "campaign" : "campaigns"} mapped
        </span>
      </div>

      <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", font: "400 14px/20px Inter" }}>
          <thead>
            <tr>
              <th style={{ width: 40, padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.06)", background: "var(--lyra-white)" }}/>
              <th style={{ textAlign: "left", padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.06)", font: "500 var(--space-3)/var(--space-4) Inter", color: "var(--lyra-slate-600)", background: "var(--lyra-white)" }}>Campaign</th>
              <th style={{ textAlign: "left", padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.06)", font: "500 var(--space-3)/var(--space-4) Inter", color: "var(--lyra-slate-600)", background: "var(--lyra-white)" }}>Status</th>
              <th style={{ textAlign: "left", padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.06)", font: "500 var(--space-3)/var(--space-4) Inter", color: "var(--lyra-slate-600)", background: "var(--lyra-white)" }}>Channels</th>
              <th style={{ textAlign: "left", padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.06)", font: "500 var(--space-3)/var(--space-4) Inter", color: "var(--lyra-slate-600)", background: "var(--lyra-white)" }}>Owner</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(c => {
              const isLinked = linkedIds.includes(c.id);
              const isMappedElsewhere = c.surveyDesignId && c.surveyDesignId !== currentDesignId;
              return (
                <tr key={c.id} style={{ background: isLinked ? "rgba(13,138,138,0.04)" : "transparent" }}>
                  <td style={{ padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <input type="checkbox" checked={isLinked}
                      onChange={() => onToggle(c.id)}/>
                  </td>
                  <td style={{ padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <div style={{ font: "500 14px/20px Inter", color: "var(--lyra-slate-900)" }}>{c.name}</div>
                    {c.hasWorkingCopy ? (
                      <div style={{ marginTop: 4 }}>
                        <WorkingCopyChip/>
                      </div>
                    ) : null}
                  </td>
                  <td style={{ padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <StatusPill s={c.status}/>
                  </td>
                  <td style={{ padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <div className="channel-stack">
                      {c.channels.map(k => <ChannelChip key={k} kind={k}/>)}
                    </div>
                  </td>
                  <td style={{ padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.05)", color: "var(--lyra-slate-600)" }}>{c.owner}</td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--lyra-slate-400)", font: "400 14px/20px Inter" }}>
                  No campaigns match the current filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {linkedIds.some(id => {
        const c = (window.CAMPAIGNS || []).find(x => x.id === id);
        return c && c.surveyDesignId && c.surveyDesignId !== currentDesignId;
      }) ? (
        <div style={{
          marginTop: 10, padding: "10px var(--space-3)", borderRadius: 6,
          background: "var(--fi-amber-bg, rgba(166,79,0,0.08))",
          border: "1px solid rgba(166,79,0,0.20)",
          color: "var(--fi-amber)",
          font: "400 12px/18px Inter",
          display: "flex", alignItems: "flex-start", gap: 8,
        }}>
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}>
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r=".8" fill="currentColor"/>
          </svg>
          <span>
            One or more selected campaigns are currently mapped to a different template. Saving will remap them — future surveys will use this template instead.
          </span>
        </div>
      ) : null}
    </div>
  );
}

Object.assign(window, { SEED_DESIGNS, designById, SurveyDesignsGrid, CreateSurveyDesign, DEFAULT_DESIGN, LinkedCampaignsTable });
