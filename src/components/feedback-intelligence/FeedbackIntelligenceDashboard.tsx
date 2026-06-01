import { useState, useMemo, useEffect, useRef, createContext, useContext } from 'react'
import { Sparkles, Check, X, Pencil, ChevronDown } from 'lucide-react'

/* Shared visibility flag for all AI insight / recommendation blocks.
   Default false = dashboard shows data only. A transparent top-right
   toggle flips it to reveal every insight at once. */
const InsightsVisibleContext = createContext(false)

/* ============================================================
 * Feedback Intelligence Dashboard — pixel-matched to reference
 * ============================================================ */
export function FeedbackIntelligenceDashboard() {
  const [showInsights, setShowInsights] = useState(false)

  // Staggered entry — cards first, then the chart card, then the chart
  // line draws inside (handled in ResponseRateChart), then the bottom row.
  const enter = (delayMs: number): React.CSSProperties => ({
    animation: 'fadeUp 0.5s ease both',
    animationDelay: `${delayMs}ms`,
  })

  return (
    <InsightsVisibleContext.Provider value={showInsights}>
      <div className="relative space-y-4">
        {/* Transparent toggle — almost unseen, top-right. Reveals/hides every
            AI recommendation across the dashboard. */}
        <button
          onClick={() => setShowInsights(v => !v)}
          title={showInsights ? 'Hide AI recommendations' : 'Reveal AI recommendations'}
          aria-label="Toggle AI recommendations"
          className={`absolute -top-1 right-0 z-30 flex h-6 w-6 items-center justify-center rounded-md transition-opacity outline-none focus:outline-none ${
            showInsights ? 'opacity-60 hover:opacity-100' : 'opacity-20 hover:opacity-100'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-[#6366f1]" fill={showInsights ? '#6366f1' : 'none'} />
        </button>

        {/* Filter row appears with the cards (no delay) */}
        <div style={enter(0)}>
          <FilterRow />
        </div>

        {/* 1. KPI cards first */}
        <div style={enter(0)}>
          <KpiCards />
        </div>

        {/* 2. Chart card next (line inside draws at +400ms — see ResponseRateChart) */}
        <div style={enter(300)}>
          <ResponseRateOverTimeCard />
        </div>

        {/* 3. Lower components last — after the chart line has drawn (~1.6s) */}
        <div style={enter(1600)}>
          <BottomInsightsRow />
        </div>
      </div>
    </InsightsVisibleContext.Provider>
  )
}

function BottomInsightsRow() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const toggle = (i: number) => () => setOpenIndex(openIndex === i ? null : i)
  return (
    <div className="grid grid-cols-3 gap-4 items-stretch">
      <ByIntentPanel       expanded={openIndex === 0} onToggle={toggle(0)} />
      <ByCustomerTypePanel expanded={openIndex === 1} onToggle={toggle(1)} />
      <ByChannelPanel      expanded={openIndex === 2} onToggle={toggle(2)} />
    </div>
  )
}

/* ---------- Reusable AI insight sub-card ---------- */
type InsightStatus = 'pending' | 'done' | 'dismissed'
const TODAY = 'May 14'

function AIInsight({
  children,
  size = 'sm',
  action,
  header,
}: {
  children: React.ReactNode
  size?: 'xs' | 'sm'
  action?: string
  header?: string
}) {
  const [status, setStatus] = useState<InsightStatus>('pending')
  const [actionText, setActionText] = useState(action ?? '')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(actionText)
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const text = size === 'xs' ? 'text-[11px]' : 'text-[12px]'
  const iconSize = size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5'

  /* -------- COLLAPSED: Done -------- */
  if (status === 'done') {
    return (
      <div className="group rounded-[8px] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-1.5 flex items-center gap-1.5">
        <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-[#16a34a] flex items-center justify-center">
          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#16a34a] leading-none">Done · {TODAY}</span>
        <span className="text-[11px] text-[#166534] leading-tight flex-1 min-w-0 truncate">· {actionText}</span>
        <button
          onClick={() => setStatus('pending')}
          className="text-[10px] font-medium text-[#16a34a] hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          title="Undo"
        >
          Undo
        </button>
      </div>
    )
  }

  /* -------- COLLAPSED: Dismissed -------- */
  if (status === 'dismissed') {
    return (
      <div className="group rounded-[8px] bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-1.5 flex items-center gap-1.5">
        <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-[#94a3b8] flex items-center justify-center">
          <X className="h-2.5 w-2.5 text-white" strokeWidth={3} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8] leading-none flex-1">Dismissed · {TODAY}</span>
        <button
          onClick={() => setStatus('pending')}
          className="text-[10px] font-medium text-[#64748b] hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          title="Undo"
        >
          Undo
        </button>
      </div>
    )
  }

  /* -------- PENDING -------- */
  const startEdit = () => {
    setDraft(actionText)
    setEditing(true)
  }
  const saveEdit = () => {
    setActionText(draft.trim() || actionText)
    setEditing(false)
  }
  const cancelEdit = () => setEditing(false)

  return (
    <div className="rounded-[8px] bg-[#eff6ff] border border-[#dbeafe] px-2.5 py-2 flex flex-col gap-1.5">
      {/* Body */}
      <div className="flex items-start gap-1.5">
        <Sparkles className={`${iconSize} text-[#6366f1] flex-shrink-0 mt-px`} fill="#6366f1" />
        <p className={`${text} text-[#1e3a8a] leading-[1.45] flex-1 min-w-0`}>
          {header && <strong>{header} · </strong>}
          {children}
        </p>
      </div>

      {/* Accordion: Recommended action */}
      {action && (
        <div className="pt-1.5 border-t border-[#dbeafe] flex flex-col gap-1.5">
          {/* Accordion trigger */}
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1 text-left outline-none focus:outline-none group"
          >
            <ChevronDown
              className={`h-3 w-3 text-[#6366f1] flex-shrink-0 transition-transform duration-200 ${
                expanded ? 'rotate-0' : '-rotate-90'
              }`}
              strokeWidth={2.5}
            />
            <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#6366f1] leading-none group-hover:text-[#4f46e5] transition-colors">
              Recommended action
            </span>
          </button>

          {/* Accordion content */}
          {expanded && (
            <div className="flex flex-col gap-1.5 pl-4">
              {editing ? (
                <div className="flex items-center gap-1">
                  <input
                    ref={inputRef}
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit()
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    className="flex-1 min-w-0 text-[11px] text-[#1e3a8a] bg-white border border-[#c7d2fe] rounded-[4px] px-1.5 py-1 outline-none focus:border-[#6366f1]"
                  />
                  <button
                    onClick={saveEdit}
                    title="Save"
                    className="h-5 w-5 flex-shrink-0 rounded-[4px] bg-[#6366f1] hover:bg-[#4f46e5] flex items-center justify-center transition-colors outline-none focus:outline-none"
                  >
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    title="Cancel"
                    className="h-5 w-5 flex-shrink-0 rounded-[4px] bg-white border border-[#c7d2fe] hover:border-[#94a3b8] flex items-center justify-center transition-colors outline-none focus:outline-none"
                  >
                    <X className="h-2.5 w-2.5 text-[#64748b]" strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <div className="flex items-start gap-1.5">
                  <p className="text-[11px] text-[#1e3a8a] leading-snug flex-1">{actionText}</p>
                  <button
                    onClick={startEdit}
                    title="Edit action"
                    className="text-[#6366f1] hover:text-[#4f46e5] transition-colors outline-none focus:outline-none flex-shrink-0 mt-px"
                  >
                    <Pencil className="h-2.5 w-2.5" />
                  </button>
                </div>
              )}

              {!editing && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setStatus('done')}
                    className="text-[10px] font-semibold text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-[4px] px-2 py-1 transition-colors outline-none focus:outline-none"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setStatus('dismissed')}
                    className="text-[10px] font-semibold text-[#64748b] bg-white border border-[#c7d2fe] hover:bg-[#f8fafc] hover:text-[#0f172a] rounded-[4px] px-2 py-1 transition-colors outline-none focus:outline-none"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ---------- 1. Filter row ---------- */
function FilterRow() {
  const filters = ['Last 60 days', 'All Intents', 'All Customer Types', 'All Channels']
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {filters.map(label => (
          <select
            key={label}
            className="h-[32px] px-3 bg-white border border-[#e2e8f0] rounded-[8px] text-[12px] text-[#0f172a] font-medium hover:border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%2210%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M6%208L2%204h8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[center_right_10px] pr-8"
          >
            <option>{label}</option>
          </select>
        ))}
      </div>
      <div className="text-[12px] text-[#94a3b8]">May 14, 2026 · 09:14</div>
    </div>
  )
}

/* ---------- 2. KPI cards ---------- */
type KpiKind = 'positive' | 'negative' | 'highlight' | 'default'
type Kpi = {
  label: string
  value: string
  delta?: { arrow?: '↑' | '↓'; text: string; suffix?: string }
  subtitle?: string
  /** Small muted note rendered below the value row (replaces subtitle when both apply). */
  note?: string
  /** Optional secondary metric shown inline with the value (e.g. CSAT trend). */
  csat?: { current: string; target: string }
  headline: React.ReactNode
  insightBullets: string[]
  expectedImpact: string[]
  action: string
  kind: KpiKind
}

const KPIS: Kpi[] = [
  {
    label: 'Overall Response Rate',
    value: '55.4%',
    delta: { arrow: '↑', text: '+3.2pp', suffix: 'vs. prior period' },
    headline: '44.6% of travelers not responding — A/B test opportunity',
    insightBullets: [
      '44.6% of travelers are not responding after their journey',
      'Group A: survey immediately post-call · Group B: 24hrs later via SMS',
      'Alert fires if daily response rate drops below 48%',
    ],
    expectedImpact: [
      '+6–10pp projected lift in response rate within 30 days',
      'Early alert catches delivery failures before they affect weekly averages',
    ],
    action: 'Launch A/B test · Set response rate alert',
    kind: 'default',
  },
  {
    label: 'Surveys Sent',
    value: '18,420',
    delta: { arrow: '↑', text: '+1,240', suffix: 'vs. prior period' },
    headline: '3 agents with 0% send rate detected',
    insightBullets: [
      '3 agents had 0% survey send rate last period',
      'Silently pulling the team average down week over week',
      'Agent-level alert notifies you same day',
      '0 surveys handed off to AI Agent — the AI Agent handoff is not firing. This is likely a broken step in the campaign setup, not an agent behavior issue',
    ],
    expectedImpact: [
      'Recover an estimated 300–400 missing surveys per month',
      'Closes blind spots in agent performance coverage',
      'Fixing the AI Agent handoff in campaign setup could immediately restore automated survey delivery across all eligible interactions',
    ],
    action: 'Go to Admin → Campaign Setup → inspect AI Agent handoff step · verify trigger and handoff settings · Set agent send-rate alert',
    kind: 'default',
  },
  {
    label: 'Outliers Detected',
    value: '3',
    csat: { current: '87', target: '60' },
    note: 'driven by 2 SLA breaches · billing queue routing failure',
    headline: (
      <>
        2 SLA breaches · 1 campaign spike to replicate
        <span className="text-[#94A3B8] mx-1">|</span>
        <span className="text-[#94A3B8]">CSAT </span>
        <span className="text-[#3b82f6] font-semibold">87</span>
        <span className="text-[#94A3B8]"> → </span>
        <span className="text-[#8b5cf6] font-semibold">60</span>
      </>
    ),
    insightBullets: [
      '2 response rate drops linked to billing queue routing failure — SLA breached on both',
      'Apr 22 spike tied to post-disruption campaign — pattern is repeatable',
      'Each SLA breach correlates with a 5–8 point CSAT drop within 24 hours',
    ],
    expectedImpact: [
      'Resolving routing failure projected to recover CSAT from 60 → 80+ within 2 weeks',
      'A/B test on campaign A4542 could replicate the Apr 22 87% response spike',
    ],
    action: 'Fix billing queue routing · A/B test Apr 22 campaign',
    kind: 'default',
  },
  {
    label: 'Top Intent Response Rate',
    value: '81%',
    subtitle: 'Flight Disruption',
    headline: 'Flight Disruption is your richest feedback cohort',
    insightBullets: [
      'Flight Disruption generates the highest response rate at 81%',
      'Personalized survey sent within 2hrs of resolution',
      'A/B test: SMS delivery vs. email to find the top channel',
    ],
    expectedImpact: [
      'Disruption campaign could add 400+ high-quality responses per month',
      'Channel winner from A/B test applies across all future disruption surveys',
    ],
    action: 'Launch disruption campaign · A/B test SMS vs. email',
    kind: 'positive',
  },
]

function KpiCards() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <div className="grid grid-cols-4 gap-4">
      {KPIS.map((k, i) => (
        <KpiCard
          key={k.label}
          kpi={k}
          expanded={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  )
}

function KpiCard({ kpi, expanded, onToggle }: { kpi: Kpi; expanded: boolean; onToggle: () => void }) {
  const insightsVisible = useContext(InsightsVisibleContext)
  // Match the chart palette: low outliers = purple, spike = blue
  const valueColor =
    kpi.kind === 'negative' ? '#8b5cf6' :
    kpi.kind === 'positive' ? '#3b82f6' :
    '#0f172a'

  const subtitleColor =
    kpi.kind === 'negative' ? '#8b5cf6' :
    kpi.kind === 'positive' ? '#0f172a' :
    '#0f172a'

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-4">
      <div className="text-[10px] font-medium text-[#94a3b8] uppercase tracking-[0.5px] mb-2 leading-none">
        {kpi.label}
      </div>

      {/* Value row — optionally extended with a secondary metric (CSAT) */}
      <div className="flex items-center gap-4 mb-2">
        <div
          className="text-[32px] font-bold leading-[1] tracking-[-0.02em]"
          style={{ color: valueColor }}
        >
          {kpi.value}
        </div>
        {kpi.csat && (
          <>
            <div className="w-px h-7 bg-[#E2E8F0]" />
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#64748B]">CSAT</span>
              <span className="text-[32px] font-bold leading-[1] tracking-[-0.02em] text-[#3b82f6]">{kpi.csat.current}</span>
              <span className="text-[#94A3B8] text-base">→</span>
              <span className="text-[32px] font-bold leading-[1] tracking-[-0.02em] text-[#8b5cf6]">{kpi.csat.target}</span>
            </div>
          </>
        )}
      </div>

      {kpi.delta && (
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#16a34a] mb-2 leading-none">
          {kpi.delta.arrow && <span>{kpi.delta.arrow}</span>}
          <span>{kpi.delta.text}</span>
          {kpi.delta.suffix && <span className="font-normal text-[#64748b]">{kpi.delta.suffix}</span>}
        </div>
      )}
      {kpi.subtitle && (
        <div
          className="text-[12px] font-semibold mb-2 leading-none"
          style={{ color: subtitleColor }}
        >
          {kpi.subtitle}
        </div>
      )}
      {kpi.note && (
        <div className="text-[11px] text-[#64748B] mb-2 leading-snug">
          {kpi.note}
        </div>
      )}

      {/* Outer accordion — only present once AI recommendations are revealed */}
      {insightsVisible && (
        <div className="rounded-[8px] bg-[#eff6ff] border border-[#dbeafe] overflow-hidden transition-all duration-200">
          {/* Always-visible headline + toggle */}
          <button
            onClick={onToggle}
            className="flex items-start gap-1.5 w-full px-2.5 py-2 text-left outline-none focus:outline-none hover:bg-[#e0ecfe] transition-colors"
          >
            <Sparkles className="h-3 w-3 text-[#6366f1] flex-shrink-0 mt-0.5" fill="#6366f1" />
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <p className="text-[11px] font-semibold text-[#1e3a8a] leading-snug line-clamp-1">{kpi.headline}</p>
              <span className="text-[10px] font-medium text-[#6366f1] hover:text-[#4f46e5] transition-colors">
                {expanded ? '▾ Hide insight & action' : '▸ See insight & action'}
              </span>
            </div>
          </button>

          {/* Expanded content */}
          <div
            className="overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out"
            style={{
              maxHeight: expanded ? '600px' : '0px',
              opacity: expanded ? 1 : 0,
            }}
          >
            <div className="px-2.5 pb-2 pt-1 border-t border-[#dbeafe]">
              <KpiInsightBody
                insightBullets={kpi.insightBullets}
                expectedImpact={kpi.expectedImpact}
                action={kpi.action}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* Body shown inside the expanded KPI accordion.
   Uses the full Recommend → Approve/Dismiss machinery from AIInsight,
   but inlined (and starts with the recommended-action block open). */
function KpiInsightBody({
  insightBullets,
  expectedImpact,
  action,
}: {
  insightBullets: string[]
  expectedImpact: string[]
  action: string
}) {
  const [status, setStatus] = useState<InsightStatus>('pending')
  const [actionText, setActionText] = useState(action)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(actionText)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  if (status === 'done') {
    return (
      <div className="group rounded-[6px] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-1.5 flex items-center gap-1.5">
        <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-[#16a34a] flex items-center justify-center">
          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#16a34a] leading-none">Done · {TODAY}</span>
        <span className="text-[11px] text-[#166534] leading-tight flex-1 min-w-0 truncate">· {actionText}</span>
        <button onClick={() => setStatus('pending')} className="text-[10px] font-medium text-[#16a34a] hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">Undo</button>
      </div>
    )
  }
  if (status === 'dismissed') {
    return (
      <div className="group rounded-[6px] bg-[#f8fafc] border border-[#e2e8f0] px-2 py-1.5 flex items-center gap-1.5">
        <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-[#94a3b8] flex items-center justify-center">
          <X className="h-2.5 w-2.5 text-white" strokeWidth={3} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8] leading-none flex-1">Dismissed · {TODAY}</span>
        <button onClick={() => setStatus('pending')} className="text-[10px] font-medium text-[#64748b] hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">Undo</button>
      </div>
    )
  }

  const startEdit = () => { setDraft(actionText); setEditing(true) }
  const saveEdit = () => { setActionText(draft.trim() || actionText); setEditing(false) }
  const cancelEdit = () => setEditing(false)

  return (
    <div className="flex flex-col gap-2">
      {/* Insight bullets */}
      <ul className="flex flex-col gap-1 list-none">
        {insightBullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11px] text-[#1e3a8a] leading-[1.45]">
            <span className="text-[#6366f1] font-bold flex-shrink-0 mt-px">•</span>
            <span className="flex-1 min-w-0">{bullet}</span>
          </li>
        ))}
      </ul>

      {/* Expected Impact */}
      <div className="pt-1.5 border-t border-[#dbeafe] flex flex-col gap-1">
        <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#64748b] leading-none">Expected Impact</span>
        <ul className="flex flex-col gap-1 list-none">
          {expectedImpact.map((bullet, i) => (
            <li key={i} className="flex items-start gap-1.5 text-[11px] text-[#0f172a] leading-[1.45]">
              <span className="text-[#16a34a] font-bold flex-shrink-0 mt-px">•</span>
              <span className="flex-1 min-w-0">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-1.5 border-t border-[#dbeafe] flex flex-col gap-1.5">
        <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#6366f1] leading-none">Recommended action</span>

        {editing ? (
          <div className="flex items-center gap-1">
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') saveEdit()
                if (e.key === 'Escape') cancelEdit()
              }}
              className="flex-1 min-w-0 text-[11px] text-[#1e3a8a] bg-white border border-[#c7d2fe] rounded-[4px] px-1.5 py-1 outline-none focus:border-[#6366f1]"
            />
            <button onClick={saveEdit} title="Save" className="h-5 w-5 flex-shrink-0 rounded-[4px] bg-[#6366f1] hover:bg-[#4f46e5] flex items-center justify-center transition-colors outline-none focus:outline-none">
              <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
            </button>
            <button onClick={cancelEdit} title="Cancel" className="h-5 w-5 flex-shrink-0 rounded-[4px] bg-white border border-[#c7d2fe] hover:border-[#94a3b8] flex items-center justify-center transition-colors outline-none focus:outline-none">
              <X className="h-2.5 w-2.5 text-[#64748b]" strokeWidth={3} />
            </button>
          </div>
        ) : (
          <div className="flex items-start gap-1.5">
            <p className="text-[11px] text-[#1e3a8a] leading-snug flex-1">{actionText}</p>
            <button onClick={startEdit} title="Edit action" className="text-[#6366f1] hover:text-[#4f46e5] transition-colors outline-none focus:outline-none flex-shrink-0 mt-px">
              <Pencil className="h-2.5 w-2.5" />
            </button>
          </div>
        )}

        {!editing && (
          <div className="flex items-center gap-1.5">
            <button onClick={() => setStatus('done')} className="text-[10px] font-semibold text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-[4px] px-2 py-1 transition-colors outline-none focus:outline-none">
              Approve
            </button>
            <button onClick={() => setStatus('dismissed')} className="text-[10px] font-semibold text-[#64748b] bg-white border border-[#c7d2fe] hover:bg-[#f8fafc] hover:text-[#0f172a] rounded-[4px] px-2 py-1 transition-colors outline-none focus:outline-none">
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- 3. Response-Rate-Over-Time card ---------- */
function ResponseRateOverTimeCard() {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#e2e8f0]">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-[14px] font-semibold text-[#0f172a] mb-0.5 leading-tight">
              Response Rate Over Time
            </h3>
            <p className="text-[11px] text-[#94a3b8] leading-tight">
              Mar 15 – May 14, 2026 · Weekends shaded · Outliers flagged
            </p>
          </div>
          <div className="flex items-center gap-3 pt-1 px-2.5 py-1.5 rounded-full bg-[#f8fafc] border border-[#e2e8f0]">
            <LegendDot label="Weekend" swatch={<span className="w-3 h-3 bg-[#f1f5f9] border border-[#e2e8f0] rounded-[2px] inline-block" />} />
            <span className="w-px h-3 bg-[#e2e8f0]" />
            <LegendDot label="Low outlier" swatch={<span className="w-2 h-2 bg-[#8b5cf6] rounded-full inline-block" />} />
            <span className="w-px h-3 bg-[#e2e8f0]" />
            <LegendDot label="Spike" swatch={<span className="w-2 h-2 bg-[#3b82f6] rounded-full inline-block" />} />
          </div>
        </div>
      </div>

      {/* 3 outlier annotation accordions */}
      <OutlierAnnotationRail />

      {/* Chart */}
      <div className="px-4 py-3">
        <ResponseRateChart />
      </div>
    </div>
  )
}

function LegendDot({ label, swatch }: { label: string; swatch: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      {swatch}
      <span className="text-[11px] text-[#64748b]">{label}</span>
    </div>
  )
}

/* ---------- Shared panel insight accordion ---------- */
function PanelInsightAccordion({
  collapsed,
  insightBullets,
  expectedImpact,
  action,
  expanded,
  onToggle,
}: {
  collapsed: React.ReactNode
  insightBullets: string[]
  expectedImpact: string[]
  action: string
  expanded: boolean
  onToggle: () => void
}) {
  const insightsVisible = useContext(InsightsVisibleContext)
  if (!insightsVisible) return null
  return (
    <div className="px-4 py-3 border-b border-[#e2e8f0]">
    <div className="rounded-[8px] bg-[#eff6ff] border border-[#dbeafe] overflow-hidden transition-all duration-200">
      <button
        onClick={onToggle}
        className="flex items-start gap-1.5 w-full px-2.5 py-2 text-left outline-none focus:outline-none hover:bg-[#e0ecfe] transition-colors"
      >
        <Sparkles className="h-3 w-3 text-[#6366f1] flex-shrink-0 mt-0.5" fill="#6366f1" />
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <p className="text-[11px] text-[#1e3a8a] leading-[1.45]">{collapsed}</p>
          <span className="text-[10px] font-medium text-[#6366f1] hover:text-[#4f46e5] transition-colors">
            {expanded ? '▾ Hide insight & action' : '▸ See insight & action'}
          </span>
        </div>
      </button>

      <div
        className="overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out"
        style={{ maxHeight: expanded ? '600px' : '0px', opacity: expanded ? 1 : 0 }}
      >
        <div className="px-2.5 pb-2 pt-1 border-t border-[#dbeafe]">
          <KpiInsightBody
            insightBullets={insightBullets}
            expectedImpact={expectedImpact}
            action={action}
          />
        </div>
      </div>
    </div>
    </div>
  )
}

/* ---------- Outlier annotation accordion (mirrors KPI accordion pattern) ---------- */
type OutlierAnnotation = {
  id: string
  date: string
  summary: string
  insightBullets: string[]
  expectedImpact: string[]
  action: string
}

const OUTLIER_ANNOTATIONS: OutlierAnnotation[] = [
  {
    id: 'apr-12',
    date: 'Apr 12 — 19%',
    summary: 'Storm-related mass cancellation (6 hrs). 2,100 surveys undelivered.',
    insightBullets: [
      'Storm-related mass cancellation caused a 6-hour survey delivery failure',
      '2,100 surveys went undelivered with no ops alert triggered',
      'SLA was breached with no notification until manual review',
    ],
    expectedImpact: [
      'Alert rule reduces breach detection from hours to under 1 hour',
      'Prevents future silent delivery failures from distorting monthly averages',
    ],
    action: 'Set SLA alert — trigger ops notification if response rate falls below 30% within 1 hour',
  },
  {
    id: 'apr-22',
    date: 'Apr 22 — 87%',
    summary: 'Post-disruption recovery campaign drove 3× engagement. Flight disruption cohort over-represented.',
    insightBullets: [
      'Post-disruption recovery campaign drove 3× the normal engagement',
      'Flight disruption cohort was over-represented — signal is strong but skewed',
      'This campaign pattern has not been tested against standard outreach',
    ],
    expectedImpact: [
      'A/B test on campaign A4542 could make the 87% spike repeatable',
      'Isolating the cohort removes the skew and gives a clean performance read',
    ],
    action: 'Launch A/B test in campaign A4542',
  },
  {
    id: 'may-7',
    date: 'May 7 — 22%',
    summary: 'Survey link broken in Web Widget after app update. Resolved in 4 hrs. Ticket CXQM-55892.',
    insightBullets: [
      'Survey link broken in Web Widget after an app update',
      'Issue went undetected for 4 hours before manual escalation',
      'Ticket CXQM-55892 resolved but no automated prevention in place',
    ],
    expectedImpact: [
      'Health alert catches Web Widget failures within 1 hour of deployment',
      'Prevents future app updates from silently breaking survey delivery',
    ],
    action: 'Set Web Widget health alert — notify within 1 hour of delivery failure',
  },
]

function OutlierAnnotationRail() {
  const insightsVisible = useContext(InsightsVisibleContext)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  if (!insightsVisible) return null
  return (
    <div className="px-4 py-3 border-b border-[#e2e8f0]">
      <div className="grid grid-cols-3 gap-2 items-stretch">
        {OUTLIER_ANNOTATIONS.map((ann, i) => (
          <OutlierAnnotationCard
            key={ann.id}
            ann={ann}
            expanded={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  )
}

function OutlierAnnotationCard({
  ann,
  expanded,
  onToggle,
}: {
  ann: OutlierAnnotation
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="rounded-[8px] bg-[#eff6ff] border border-[#dbeafe] overflow-hidden transition-all duration-200 h-full flex flex-col">
      {/* Always-visible one-liner + toggle */}
      <button
        onClick={onToggle}
        className="flex items-start gap-1.5 w-full px-2.5 py-2 text-left outline-none focus:outline-none hover:bg-[#e0ecfe] transition-colors flex-1"
      >
        <Sparkles className="h-3 w-3 text-[#6366f1] flex-shrink-0 mt-0.5" fill="#6366f1" />
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <p className="text-[11px] text-[#1e3a8a] leading-[1.4]">
            <strong>{ann.date}</strong> · {ann.summary}
          </p>
          <span className="text-[10px] font-medium text-[#6366f1] hover:text-[#4f46e5] transition-colors">
            {expanded ? '▾ Hide insight & action' : '▸ See insight & action'}
          </span>
        </div>
      </button>

      {/* Expanded content */}
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out"
        style={{ maxHeight: expanded ? '600px' : '0px', opacity: expanded ? 1 : 0 }}
      >
        <div className="px-2.5 pb-2 pt-1 border-t border-[#dbeafe]">
          <KpiInsightBody
            insightBullets={ann.insightBullets}
            expectedImpact={ann.expectedImpact}
            action={ann.action}
          />
        </div>
      </div>
    </div>
  )
}

/* ---------- 3a. Chart (SVG) ---------- */
type ChartPoint = {
  i: number
  y: number
  date: string         // "Mar 15"
  fullDate: string     // "Sun, March 15"
  isWeekend: boolean
  outlier?: 'low' | 'high'
}

// Hand-tuned values to mirror the reference line
const CHART_VALUES: number[] = [
  32, 58, 60, 63, 67, 58, 30, 33, 58, 62, 68, 70, 62, 30, 28,
  55, 58, 62, 64, 58, 38, 42, 55, 58, 62, 70, 55, 33, 19, 50,
  58, 62, 65, 60, 38, 40, 55, 60, 87, 70, 62, 40, 38, 55, 58,
  62, 61, 58, 38, 42, 58, 65, 72, 22, 40, 30, 32, 55, 60, 53,
]

const OUTLIERS: Record<number, 'low' | 'high'> = {
  28: 'low',  // Apr 12
  38: 'high', // Apr 22
  53: 'low',  // May 7
}

function ResponseRateChart() {
  const [hovered, setHovered] = useState<number | null>(null)

  const data = useMemo<ChartPoint[]>(() => {
    const start = new Date('2026-03-15T00:00:00')
    return CHART_VALUES.map((v, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const day = d.getDay()
      return {
        i,
        y: v,
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' }),
        isWeekend: day === 0 || day === 6,
        outlier: OUTLIERS[i],
      }
    })
  }, [])

  // Geometry — wider viewBox keeps the chart short when stretched to 100%
  const width = 1200
  const height = 240
  const padding = { top: 20, right: 20, bottom: 32, left: 44 }
  const cw = width - padding.left - padding.right
  const ch = height - padding.top - padding.bottom
  const xs = (i: number) => padding.left + (i / (CHART_VALUES.length - 1)) * cw
  const ys = (y: number) => padding.top + ch - (y / 100) * ch

  // Smooth catmull-rom spline
  const linePath = useMemo(() => {
    const pts = data.map(p => ({ x: xs(p.i), y: ys(p.y) }))
    let path = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = pts[Math.min(pts.length - 1, i + 2)]
      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
    }
    return path
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  // Area path (line + close to baseline) for gradient fill
  const areaPath = useMemo(
    () => `${linePath} L ${xs(data.length - 1)} ${ys(0)} L ${xs(0)} ${ys(0)} Z`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [linePath]
  )

  const bandWidth = cw / (data.length - 1)
  const yTicks = [0, 25, 50, 75, 100] // sparser, modern

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          {/* Area gradient — deep electric blue fading down */}
          <linearGradient id="fi-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.28" />
            <stop offset="55%"  stopColor="#3b82f6" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>

          {/* Line gradient — subtle hue shift along the curve */}
          <linearGradient id="fi-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#6366f1" />
            <stop offset="50%"  stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Soft glow under the line for depth */}
          <filter id="fi-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Weekend bands — nearly invisible */}
        {data.map(d => d.isWeekend && (
          <rect
            key={`wk-${d.i}`}
            x={xs(d.i) - bandWidth / 2}
            y={padding.top}
            width={bandWidth}
            height={ch}
            fill="#f1f5f9"
            opacity={0.5}
          />
        ))}

        {/* Y grid (dashed) + labels */}
        {yTicks.map(t => (
          <g key={t}>
            <line
              x1={padding.left}
              y1={ys(t)}
              x2={width - padding.right}
              y2={ys(t)}
              stroke="#e2e8f0"
              strokeDasharray="3 5"
              strokeWidth="1"
              opacity={t === 0 ? 1 : 0.7}
            />
            <text
              x={padding.left - 12}
              y={ys(t) + 4}
              textAnchor="end"
              fill="#cbd5e1"
              fontSize="10"
              fontWeight="500"
              letterSpacing="0.5"
            >
              {t}%
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#fi-area)" />

        {/* Line + soft glow (animated draw on mount) */}
        <path
          d={linePath}
          pathLength={1}
          fill="none"
          stroke="url(#fi-line)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 1,
            animation: 'drawLine 1.2s ease-out 0.4s both',
          }}
        />

        {/* Outliers — purple for low, blue for spike */}
        {data.map(d => {
          if (!d.outlier) return null
          const color = d.outlier === 'low' ? '#8b5cf6' : '#3b82f6'
          return (
            <g key={`out-${d.i}`}>
              {/* Outer halo */}
              <circle cx={xs(d.i)} cy={ys(d.y)} r={12} fill={color} opacity={0.15} />
              {/* Inner ring */}
              <circle cx={xs(d.i)} cy={ys(d.y)} r={6} fill="white" stroke={color} strokeWidth={2.5} />
              <circle cx={xs(d.i)} cy={ys(d.y)} r={2.5} fill={color} />
            </g>
          )
        })}

        {/* Hover hitboxes */}
        {data.map(d => (
          <rect
            key={`h-${d.i}`}
            x={xs(d.i) - bandWidth / 2}
            y={padding.top}
            width={bandWidth}
            height={ch}
            fill="transparent"
            onMouseEnter={() => setHovered(d.i)}
            style={{ cursor: 'crosshair' }}
          />
        ))}

        {/* Hover indicator — dashed crosshair + ringed marker */}
        {hovered !== null && (
          <g>
            <line
              x1={xs(hovered)}
              y1={padding.top}
              x2={xs(hovered)}
              y2={padding.top + ch}
              stroke="#3b82f6"
              strokeOpacity={0.35}
              strokeDasharray="3 4"
            />
            <circle cx={xs(hovered)} cy={ys(data[hovered].y)} r={9} fill="#3b82f6" opacity={0.18} />
            <circle cx={xs(hovered)} cy={ys(data[hovered].y)} r={5} fill="white" stroke="#3b82f6" strokeWidth={2.5} />
          </g>
        )}

        {/* X labels — every 6 days */}
        {data.filter((_, i) => i % 6 === 0).map(d => (
          <text
            key={`xl-${d.i}`}
            x={xs(d.i)}
            y={height - 14}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="11"
            fontWeight="500"
            letterSpacing="0.3"
          >
            {d.date}
          </text>
        ))}
      </svg>

      {/* Tooltip — glass card, modern */}
      {hovered !== null && (
        <div
          className="absolute pointer-events-none z-10 transition-opacity duration-150"
          style={{
            left: `${(xs(hovered) / width) * 100}%`,
            top: `${(ys(data[hovered].y) / height) * 100}%`,
            transform: 'translate(-50%, -140%)',
          }}
        >
          <div
            className="rounded-xl px-3.5 py-2.5 whitespace-nowrap border border-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.96))',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 12px 32px -8px rgba(15,23,42,0.45), 0 2px 8px rgba(15,23,42,0.25)',
            }}
          >
            <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-white/60 leading-none">
              {data[hovered].fullDate}
            </div>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-[20px] font-semibold text-white leading-none tabular-nums">{data[hovered].y}%</span>
              <span className="text-[10px] text-white/50 uppercase tracking-wider">response rate</span>
            </div>
            {data[hovered].outlier && (
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: data[hovered].outlier === 'low' ? '#8b5cf6' : '#3b82f6' }}
                />
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: data[hovered].outlier === 'low' ? '#c4b5fd' : '#93c5fd' }}
                >
                  {data[hovered].outlier === 'low' ? 'Low outlier' : 'Spike detected'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- 4. By Intent panel ---------- */
type IntentRow = { name: string; pct: number; delta: string; tone: 'up' | 'flat' | 'down' }

const INTENT_ROWS: IntentRow[] = [
  { name: 'Flight Disruption',     pct: 81, delta: '+26pp', tone: 'up' },
  { name: 'Billing Dispute',       pct: 74, delta: '+19pp', tone: 'up' },
  { name: 'Baggage Claim',         pct: 68, delta: '+13pp', tone: 'up' },
  { name: 'Booking Change',        pct: 56, delta: '+1pp',  tone: 'flat' },
  { name: 'Seat Upgrade Request',  pct: 44, delta: '-11pp', tone: 'down' },
  { name: 'General Inquiry',       pct: 38, delta: '-17pp', tone: 'down' },
]

function ByIntentPanel({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#e2e8f0]">
        <h3 className="text-[14px] font-semibold text-[#0f172a] mb-0.5 leading-tight">By Intent</h3>
        <p className="text-[12px] text-[#94a3b8] leading-tight">Response rate per AI-detected topic</p>
      </div>

      {/* AI insight accordion (renders only when insights are revealed) */}
      <PanelInsightAccordion
        expanded={expanded}
        onToggle={onToggle}
        collapsed="High-stakes intents respond 2× more than routine calls"
        insightBullets={[
          'Flight Disruption and Baggage Claim drive the highest response — passengers are emotionally invested',
          'Booking Change and Seat Upgrade requests show near-zero engagement delta',
          'General Inquiry sits 17pp below baseline — lowest motivation to respond',
        ]}
        expectedImpact={[
          'Prioritizing survey campaigns on disruption intents could add 400+ responses/month',
          'Reducing survey noise on low-intent calls frees up QM review capacity',
        ]}
        action="Launch targeted post-disruption survey campaign · Suppress surveys on General Inquiry calls"
      />

      <div className="p-4 flex-1">
        {/* Rows */}
        <div className="space-y-4">
          {INTENT_ROWS.map(r => <IntentRow key={r.name} row={r} />)}
        </div>
      </div>
    </div>
  )
}

function IntentRow({ row }: { row: IntentRow }) {
  const barColor = row.tone === 'up' ? '#3b82f6' : row.tone === 'flat' ? '#93c5fd' : '#bfdbfe'
  const deltaColor = row.tone === 'up' ? '#16a34a' : row.tone === 'flat' ? '#64748b' : '#dc2626'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] text-[#0f172a] font-medium leading-none truncate">{row.name}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[13px] font-semibold text-[#0f172a] leading-none">{row.pct}%</span>
          <span className="text-[12px] font-semibold leading-none" style={{ color: deltaColor }}>{row.delta}</span>
        </div>
      </div>
      <div className="h-[6px] bg-[#f1f5f9] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${row.pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  )
}

/* ---------- 5. By Customer Type panel ---------- */
type CustomerRow = { name: string; pct: number; vs: string; trend: '↑' | '→' | '↓'; tone: 'up' | 'flat' | 'down' }

const CUSTOMER_ROWS: CustomerRow[] = [
  { name: 'Business Frequent Flyer', pct: 73, vs: '+18pp', trend: '↑', tone: 'up' },
  { name: 'Leisure Repeat Traveler', pct: 61, vs: '+6pp',  trend: '→', tone: 'flat' },
  { name: 'First-Time Traveler',     pct: 47, vs: '-8pp',  trend: '↓', tone: 'down' },
  { name: 'Group Booking',           pct: 31, vs: '-24pp', trend: '→', tone: 'down' },
]

function ByCustomerTypePanel({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-[#e2e8f0] flex items-center justify-between gap-2">
        <div>
          <h3 className="text-[14px] font-semibold text-[#0f172a] mb-0.5 leading-tight">By Customer Type</h3>
          <p className="text-[12px] text-[#94a3b8] leading-tight">Segment response rate vs. 55.4% baseline</p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#eef2ff] border border-[#c7d2fe] rounded-full text-[11px] font-semibold text-[#6366f1]">
          <Sparkles className="h-3 w-3" fill="#6366f1" />
          AI segment pattern
        </div>
      </div>

      {/* AI insight accordion (renders only when insights are revealed) */}
      <PanelInsightAccordion
        expanded={expanded}
        onToggle={onToggle}
        collapsed="Business Frequent Flyers lead — Group Bookings are a structural outlier"
        insightBullets={[
          'Business Frequent Flyers respond 18pp above baseline — consistent across all weeks and channels',
          'Group Bookings are a structural outlier — survey reaches the organizer, not the individual traveler',
          'First-Time Travelers at 47% — one bad experience determines their entire brand perception',
        ]}
        expectedImpact={[
          'Redirecting Group Booking surveys to individual travelers could recover 8pp response rate',
          'Targeted re-engagement campaign for First-Time Travelers within 24hrs of journey could lift retention',
        ]}
        action="Fix Group Booking survey routing · A/B test First-Time Traveler re-engagement campaign"
      />

      <div className="p-4 flex-1">
        <div className="space-y-4">
          {CUSTOMER_ROWS.map(r => <CustomerTypeRow key={r.name} row={r} />)}
        </div>
      </div>
    </div>
  )
}

function CustomerTypeRow({ row }: { row: CustomerRow }) {
  const dotColor = row.tone === 'up' ? '#6366f1' : row.tone === 'flat' ? '#3b82f6' : row.name === 'First-Time Traveler' ? '#93c5fd' : '#bfdbfe'
  const deltaColor = row.tone === 'up' ? '#16a34a' : row.tone === 'flat' ? '#64748b' : '#dc2626'
  const trendColor = row.tone === 'up' ? '#6366f1' : row.tone === 'flat' ? '#64748b' : '#94a3b8'

  return (
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
      <div className="flex-1 text-[13px] text-[#0f172a] font-medium leading-none">{row.name}</div>
      <div className="text-[13px] font-semibold text-[#0f172a] leading-none">{row.pct}%</div>
      <div className="w-[42px] text-right text-[12px] font-semibold leading-none" style={{ color: deltaColor }}>
        {row.vs}
      </div>
      <div className="w-[24px] text-center text-[18px] leading-none" style={{ color: trendColor }}>
        {row.trend}
      </div>
    </div>
  )
}

/* ---------- 6. By Channel panel ---------- */
type ChannelRow = { name: string; pct: number; delta: string; tone: 'up' | 'flat' | 'down' }

const CHANNEL_ROWS: ChannelRow[] = [
  { name: 'SMS',        pct: 71, delta: '+16pp', tone: 'up' },
  { name: 'WhatsApp',   pct: 68, delta: '+13pp', tone: 'up' },
  { name: 'Email',      pct: 64, delta: '+9pp',  tone: 'up' },
  { name: 'Voice IVR',  pct: 52, delta: '-3pp',  tone: 'flat' },
  { name: 'Web Widget', pct: 45, delta: '-10pp', tone: 'down' },
]

function ByChannelPanel({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-[#e2e8f0]">
        <h3 className="text-[14px] font-semibold text-[#0f172a] mb-0.5 leading-tight">By Channel</h3>
        <p className="text-[12px] text-[#94a3b8] leading-tight">Response rate per survey delivery method</p>
      </div>

      {/* AI insight accordion (renders only when insights are revealed) */}
      <PanelInsightAccordion
        expanded={expanded}
        onToggle={onToggle}
        collapsed="SMS leads weekdays · WhatsApp wins on Sundays"
        insightBullets={[
          'SMS leads at 71% but drops to 28% on Sundays — leisure travel day',
          'Web Widget is the lowest performer across every day of the week',
          'WhatsApp at 68% shows strong potential and no weekend drop pattern',
        ]}
        expectedImpact={[
          'Shifting Sunday surveys from SMS to WhatsApp could recover 30–40pp on weekend response rate',
          'Removing Web Widget as a primary survey channel reduces delivery failure risk',
        ]}
        action="A/B test WhatsApp vs. SMS on Sundays · Deprioritize Web Widget survey delivery"
      />

      <div className="p-4">
        <div className="space-y-4">
          {CHANNEL_ROWS.map(r => <ChannelRowItem key={r.name} row={r} />)}
        </div>
      </div>
    </div>
  )
}

function ChannelRowItem({ row }: { row: ChannelRow }) {
  const barColor = row.tone === 'up' ? '#3b82f6' : row.tone === 'flat' ? '#93c5fd' : '#bfdbfe'
  const deltaColor = row.tone === 'up' ? '#16a34a' : row.tone === 'flat' ? '#64748b' : '#dc2626'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] text-[#0f172a] font-medium leading-none truncate">{row.name}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[13px] font-semibold text-[#0f172a] leading-none">{row.pct}%</span>
          <span className="text-[12px] font-semibold leading-none" style={{ color: deltaColor }}>{row.delta}</span>
        </div>
      </div>
      <div className="h-[6px] bg-[#f1f5f9] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${row.pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  )
}
