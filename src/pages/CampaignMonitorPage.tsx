import { useState, useMemo } from 'react'
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  X,
  ChevronDown,
} from 'lucide-react'
import type { Campaign } from '@/lib/campaigns'

/* ============================================================
 * Campaign Operations — Level 3 operational drill-down for a campaign
 * Funnel · suppression · VU tier mix · per-question landing
 * Reached from the FI Dashboard's "View campaign operations" link.
 * ============================================================ */
export function CampaignMonitorPage({
  campaign,
  onBack,
}: {
  campaign?: Campaign
  onBack: () => void
}) {
  const [showInsights, setShowInsights] = useState(true)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header
        campaign={campaign}
        onBack={onBack}
        showInsights={showInsights}
        onToggleInsights={() => setShowInsights(v => !v)}
      />
      <div className="p-6 lg:px-8 space-y-6 flex-1">
        <FilterRow />
        <HeroKpis />

        <SectionHeader
          eyebrow="Section 1"
          title="Delivery & funnel health"
          subtitle="Is the campaign reaching the customers it should be reaching, on the channels it should be reaching them on?"
        />
        <div className="grid grid-cols-3 gap-4">
          <FunnelCard className="col-span-2" />
          <SuppressionCard />
        </div>
        <ChannelHealthCard />
        {showInsights && (
          <InsightBlock
            headline="AI Agent handoff is leaking opens — Cognigy template likely falling silent"
            bullets={[
              'Delivered-to-opened drop on AI Agent channel is 44% — 25pp worse than SMS (82%) and WhatsApp (78%)',
              'No other channel shows this pattern; the gap is isolated to Cognigy handoff',
              'Likely cause: survey lands in the chat session as a message without a prompt to act',
            ]}
            impact={[
              'Restoring AI Agent opens to channel parity would recover ~290 responses per week',
              'Closes a silent failure mode that won\'t show up in any agent-level QA metric',
            ]}
            action="Inspect Cognigy handoff template — add a prompt/cue when the survey link is sent"
          />
        )}

        <SectionHeader
          eyebrow="Section 2"
          title="VU & topic signal quality"
          subtitle="Are we surveying interactions worth surveying, or is the campaign drifting toward low-urgency noise?"
        />
        <div className="grid grid-cols-3 gap-4">
          <VuTierMixCard className="col-span-2" />
          <TopTopicsCard />
        </div>
        <VuDriftCard />
        {showInsights && (
          <InsightBlock
            headline="Call transfer impact is up 24% — it wasn't in the original campaign brief"
            bullets={[
              'Call transfer impact now generates ~210/week at avg VU 33',
              'Topic was not a primary trigger when the campaign was launched 14 days ago',
              'It is currently firing because transferred-call interactions are tagged with Flight Disruption upstream',
            ]}
            impact={[
              'Promoting transfer impact to a primary trigger could yield a more focused survey question set',
              'Alternatively, splitting it into its own campaign isolates the signal for routing improvements',
            ]}
            action="Promote 'Call transfer impact' to a primary trigger, or split into its own campaign"
          />
        )}

        <SectionHeader
          eyebrow="Section 3"
          title="Response & question performance"
          subtitle="Once the survey lands, do customers engage with it — and are the AI-generated questions doing their job?"
        />
        <ResponseCompletionCard />
        <QuestionLandingCard />
        {showInsights && (
          <InsightBlock
            headline='"Was the compensation offered reasonable?" is killing completion'
            bullets={[
              '26% of respondents abandon at this question — 2–3× the rate of every other question in this campaign',
              'Answer rate (52%) and validation alignment (64%) are also the lowest in the survey',
              'Phrasing implies an accusatory frame; respondents who feel under-compensated drop rather than respond',
            ]}
            impact={[
              'Softer phrasing variants in similar campaigns recover 12–18pp on completion',
              'Improved validation alignment means more usable signal per completed survey',
            ]}
            action='Test softer variant: "How fairly were you compensated for the disruption?"'
          />
        )}
      </div>
    </div>
  )
}

/* ---------- Header ---------- */
function Header({
  campaign,
  onBack,
  showInsights,
  onToggleInsights,
}: {
  campaign?: Campaign
  onBack: () => void
  showInsights: boolean
  onToggleInsights: () => void
}) {
  // Defaults preserve the demo story if no campaign is wired through
  const name = campaign?.name ?? 'Flight Disruption Recovery'
  const version = campaign?.version ?? 'v2.1'
  const statusLabel =
    campaign?.status === 'paused'
      ? 'Paused'
      : campaign?.status === 'draft'
      ? 'Draft'
      : campaign?.status === 'ended'
      ? 'Ended'
      : 'Active'
  const statusBg =
    campaign?.status === 'paused'
      ? '#fef3c7'
      : campaign?.status === 'draft'
      ? '#e2e8f0'
      : campaign?.status === 'ended'
      ? '#f1f5f9'
      : '#dcfce7'
  const statusText =
    campaign?.status === 'paused'
      ? '#b45309'
      : campaign?.status === 'draft'
      ? '#475569'
      : campaign?.status === 'ended'
      ? '#64748b'
      : '#15803d'
  const days = campaign?.daysRunning ?? 14
  const channels = campaign?.channels?.join(' · ') ?? 'SMS · WhatsApp · AI Agent (Cognigy)'
  const trigger = campaign?.trigger ?? 'Flight Disruption OR Baggage Claim, VU ≥ 32'

  return (
    <div className="bg-white border-b border-[#e2e8f0] px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="mt-1 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors outline-none focus:outline-none"
            title="Back to campaign dashboard"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to dashboard
          </button>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6366f1] mb-1">
              Campaign operations
            </div>
            <h1 className="text-[24px] font-semibold text-[#0f172a] leading-tight">
              {name} <span className="text-[#94a3b8] font-medium">{version}</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{ backgroundColor: statusBg, color: statusText }}
              >
                {statusLabel}
              </span>
              <span className="text-[12px] text-[#64748b]">·</span>
              <span className="text-[12px] text-[#64748b]">{days} days running</span>
              <span className="text-[12px] text-[#64748b]">·</span>
              <span className="text-[12px] text-[#64748b]">{channels}</span>
              <span className="text-[12px] text-[#64748b]">·</span>
              <span className="text-[12px] text-[#64748b]">Trigger: {trigger}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onToggleInsights}
          className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors outline-none focus:outline-none ${
            showInsights
              ? 'bg-[#eef2ff] border-[#c7d2fe] text-[#4f46e5]'
              : 'bg-white border-[#e2e8f0] text-[#64748b] hover:text-[#0f172a]'
          }`}
          title={showInsights ? 'Hide AI insights' : 'Reveal AI insights'}
        >
          <Sparkles className="h-3.5 w-3.5" fill={showInsights ? '#6366f1' : 'none'} />
          {showInsights ? 'Insights on' : 'Insights off'}
        </button>
      </div>
    </div>
  )
}

/* ---------- Filter row ---------- */
function FilterRow() {
  const filters = ['Last 14 days', 'All channels', 'Compare: prior period']
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {filters.map(label => (
          <select
            key={label}
            className="h-[32px] px-3 bg-white border border-[#e2e8f0] rounded-[8px] text-[12px] text-[#0f172a] font-medium hover:border-[#cbd5e1] focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%2210%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M6%208L2%204h8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[center_right_10px] pr-8"
          >
            <option>{label}</option>
          </select>
        ))}
      </div>
      <div className="text-[12px] text-[#94a3b8]">Jun 1, 2026 · 09:14 · Auto-refresh 5m</div>
    </div>
  )
}

/* ---------- Section header ---------- */
function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="pt-2">
      <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6366f1] mb-1">{eyebrow}</div>
      <h2 className="text-[18px] font-semibold text-[#0f172a] leading-tight">{title}</h2>
      <p className="text-[13px] text-[#64748b] mt-1 max-w-2xl leading-snug">{subtitle}</p>
    </div>
  )
}

/* ---------- Hero KPIs ---------- */
type HeroKpi = {
  label: string
  value: string
  delta: { arrow: '↑' | '↓' | '→'; text: string; tone: 'up' | 'down' | 'flat' }
  note: string
  emphasis?: 'positive' | 'caution'
}

const HERO_KPIS: HeroKpi[] = [
  {
    label: 'Eligible interactions',
    value: '4,820',
    delta: { arrow: '↑', text: '+12%', tone: 'up' },
    note: 'Top of funnel — trigger rules are firing',
  },
  {
    label: 'Surveys sent',
    value: '1,810',
    delta: { arrow: '↑', text: '+8%', tone: 'up' },
    note: 'Net of suppression + 50% B-tier sampling',
  },
  {
    label: 'Response rate',
    value: '67%',
    delta: { arrow: '↑', text: '+6pp', tone: 'up' },
    note: '11.6pp above org baseline (55.4%)',
    emphasis: 'positive',
  },
  {
    label: 'Avg VU of triggered',
    value: '38',
    delta: { arrow: '↓', text: '−4', tone: 'down' },
    note: 'Drift — sampling lower-urgency interactions',
    emphasis: 'caution',
  },
]

function HeroKpis() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {HERO_KPIS.map(k => (
        <HeroKpiCard key={k.label} kpi={k} />
      ))}
    </div>
  )
}

function HeroKpiCard({ kpi }: { kpi: HeroKpi }) {
  const valueColor =
    kpi.emphasis === 'positive' ? '#3b82f6' : kpi.emphasis === 'caution' ? '#8b5cf6' : '#0f172a'
  const deltaColor = kpi.delta.tone === 'up' ? '#16a34a' : kpi.delta.tone === 'down' ? '#dc2626' : '#64748b'

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-4">
      <div className="text-[10px] font-medium text-[#94a3b8] uppercase tracking-[0.5px] mb-2 leading-none">
        {kpi.label}
      </div>
      <div className="flex items-baseline gap-3 mb-2">
        <div className="text-[32px] font-bold leading-[1] tracking-[-0.02em]" style={{ color: valueColor }}>
          {kpi.value}
        </div>
        <div className="flex items-center gap-1 text-[12px] font-semibold leading-none" style={{ color: deltaColor }}>
          <span>{kpi.delta.arrow}</span>
          <span>{kpi.delta.text}</span>
        </div>
      </div>
      <div className="text-[11px] text-[#64748b] leading-snug">{kpi.note}</div>
    </div>
  )
}

/* ---------- Funnel card (Section 1) ---------- */
type FunnelStage = {
  label: string
  count: number
  // Conversion from previous stage; null for the top stage
  conv?: number
  // 'expected' = intended drop (e.g. sampling), 'leak' = unintended drop, 'healthy' = small drop
  tone?: 'expected' | 'leak' | 'healthy'
  // Hover hint about which rule caused the drop
  rule?: string
}

const FUNNEL_STAGES: FunnelStage[] = [
  { label: 'Eligible', count: 4820, tone: 'healthy', rule: 'Matched trigger rules' },
  { label: 'Not suppressed', count: 4723, conv: 0.98, tone: 'healthy', rule: 'Passed all 4 suppression rules' },
  { label: 'Sampled', count: 2361, conv: 0.5, tone: 'expected', rule: 'Sampling: 100% A+/A · 50% B · 0% C/D' },
  { label: 'Sent', count: 1810, conv: 0.77, tone: 'healthy', rule: 'Delivery throttling + channel capacity' },
  { label: 'Delivered', count: 1612, conv: 0.89, tone: 'healthy', rule: 'Provider delivery confirmation' },
  { label: 'Opened', count: 1210, conv: 0.75, tone: 'leak', rule: 'Open tracking · pixel / link click' },
  { label: 'Started', count: 1114, conv: 0.92, tone: 'healthy', rule: 'Any question answered' },
  { label: 'Completed', count: 780, conv: 0.7, tone: 'healthy', rule: 'All required questions answered' },
]

function FunnelCard({ className = '' }: { className?: string }) {
  const top = FUNNEL_STAGES[0].count
  return (
    <div className={`bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-[#e2e8f0]">
        <h3 className="text-[14px] font-semibold text-[#0f172a] leading-tight">End-to-end funnel</h3>
        <p className="text-[12px] text-[#94a3b8] leading-tight mt-0.5">
          Each stage shows count and conversion from the previous stage
        </p>
      </div>
      <div className="p-4 space-y-2.5">
        {FUNNEL_STAGES.map(stage => {
          const widthPct = (stage.count / top) * 100
          const barColor =
            stage.tone === 'leak' ? '#fde68a' : stage.tone === 'expected' ? '#c7d2fe' : '#bfdbfe'
          const barAccent =
            stage.tone === 'leak' ? '#f59e0b' : stage.tone === 'expected' ? '#6366f1' : '#3b82f6'
          const convColor =
            stage.tone === 'leak' ? '#b45309' : stage.tone === 'expected' ? '#4338ca' : '#15803d'

          return (
            <div key={stage.label} className="group">
              <div className="flex items-baseline justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[#0f172a]">{stage.label}</span>
                  {stage.tone === 'leak' && (
                    <span className="inline-flex items-center rounded-full bg-[#fef3c7] px-1.5 py-0.5 text-[10px] font-semibold text-[#b45309]">
                      leak
                    </span>
                  )}
                  {stage.tone === 'expected' && (
                    <span className="inline-flex items-center rounded-full bg-[#eef2ff] px-1.5 py-0.5 text-[10px] font-semibold text-[#4338ca]">
                      by rule
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[12px]">
                  <span className="text-[#0f172a] font-semibold tabular-nums">{stage.count.toLocaleString()}</span>
                  {stage.conv !== undefined && (
                    <span className="font-semibold tabular-nums" style={{ color: convColor }}>
                      {Math.round(stage.conv * 100)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="relative h-6 bg-[#f1f5f9] rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-500"
                  style={{ width: `${widthPct}%`, backgroundColor: barColor }}
                />
                <div
                  className="absolute top-0 left-0 h-full w-[3px]"
                  style={{ backgroundColor: barAccent }}
                />
              </div>
              <div className="text-[11px] text-[#94a3b8] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {stage.rule}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- Suppression breakdown (Section 1) ---------- */
const SUPPRESSION_ROWS = [
  { reason: 'Opt-out recency', count: 51, color: '#6366f1', rule: 'Customer surveyed in last 30 days' },
  { reason: 'Open complaint', count: 28, color: '#8b5cf6', rule: 'Active case in CXone' },
  { reason: 'Recency window', count: 12, color: '#a78bfa', rule: 'Customer opted out in last 60 days' },
  { reason: 'Internal interaction', count: 6, color: '#c4b5fd', rule: 'Agent-to-agent transfer' },
]

function SuppressionCard() {
  const total = SUPPRESSION_ROWS.reduce((sum, r) => sum + r.count, 0)
  const radius = 56
  const stroke = 18
  const circumference = 2 * Math.PI * radius

  let offset = 0
  const arcs = SUPPRESSION_ROWS.map(r => {
    const pct = r.count / total
    const dash = pct * circumference
    const arc = { dash, gap: circumference - dash, offset, color: r.color }
    offset -= dash
    return arc
  })

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#e2e8f0]">
        <h3 className="text-[14px] font-semibold text-[#0f172a] leading-tight">Suppression breakdown</h3>
        <p className="text-[12px] text-[#94a3b8] leading-tight mt-0.5">
          Why {total} eligible interactions were dropped
        </p>
      </div>
      <div className="p-4 flex flex-col items-center gap-4">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
          {arcs.map((a, i) => (
            <circle
              key={i}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={a.color}
              strokeWidth={stroke}
              strokeDasharray={`${a.dash} ${a.gap}`}
              strokeDashoffset={a.offset}
              transform="rotate(-90 80 80)"
              strokeLinecap="butt"
            />
          ))}
          <text x="80" y="76" textAnchor="middle" fontSize="22" fontWeight="600" fill="#0f172a">
            {total}
          </text>
          <text x="80" y="92" textAnchor="middle" fontSize="10" fill="#94a3b8" letterSpacing="0.5">
            SUPPRESSED
          </text>
        </svg>
        <div className="w-full space-y-2">
          {SUPPRESSION_ROWS.map(r => (
            <div key={r.reason} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
              <span className="text-[12px] text-[#0f172a] flex-1 truncate">{r.reason}</span>
              <span className="text-[12px] font-semibold text-[#0f172a] tabular-nums">{r.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- Channel health (Section 1) ---------- */
type ChannelHealth = {
  channel: string
  sent: number
  delivered: number
  opened: number
  completed: number
  flag?: 'open-leak'
}

const CHANNELS: ChannelHealth[] = [
  { channel: 'SMS', sent: 920, delivered: 870, opened: 712, completed: 478 },
  { channel: 'WhatsApp', sent: 540, delivered: 522, opened: 408, completed: 264 },
  { channel: 'AI Agent (Cognigy)', sent: 350, delivered: 220, opened: 90, completed: 38, flag: 'open-leak' },
]

function ChannelHealthCard() {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#e2e8f0]">
        <h3 className="text-[14px] font-semibold text-[#0f172a] leading-tight">Send health by channel</h3>
        <p className="text-[12px] text-[#94a3b8] leading-tight mt-0.5">
          Funnel performance per delivery channel · flags isolate where opens are leaking
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 p-4">
        {CHANNELS.map(c => {
          const openRate = c.opened / c.delivered
          const completionRate = c.completed / c.opened
          const isLeak = c.flag === 'open-leak'
          return (
            <div
              key={c.channel}
              className={`rounded-[10px] border p-3 ${
                isLeak ? 'border-[#fde68a] bg-[#fffbeb]' : 'border-[#e2e8f0] bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-[#0f172a]">{c.channel}</span>
                {isLeak && (
                  <span className="inline-flex items-center rounded-full bg-[#fef3c7] px-1.5 py-0.5 text-[10px] font-semibold text-[#b45309]">
                    open leak
                  </span>
                )}
              </div>
              <ChannelBar label="Sent" value={c.sent} max={c.sent} color="#bfdbfe" />
              <ChannelBar label="Delivered" value={c.delivered} max={c.sent} color="#93c5fd" />
              <ChannelBar
                label="Opened"
                value={c.opened}
                max={c.sent}
                color={isLeak ? '#f59e0b' : '#3b82f6'}
                rateLabel={`${Math.round(openRate * 100)}% of delivered`}
              />
              <ChannelBar
                label="Completed"
                value={c.completed}
                max={c.sent}
                color="#1d4ed8"
                rateLabel={`${Math.round(completionRate * 100)}% of opened`}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChannelBar({
  label,
  value,
  max,
  color,
  rateLabel,
}: {
  label: string
  value: number
  max: number
  color: string
  rateLabel?: string
}) {
  const pct = (value / max) * 100
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex items-baseline justify-between mb-0.5">
        <span className="text-[11px] text-[#64748b]">{label}</span>
        <div className="flex items-baseline gap-2">
          {rateLabel && <span className="text-[10px] text-[#94a3b8]">{rateLabel}</span>}
          <span className="text-[12px] font-semibold text-[#0f172a] tabular-nums">{value}</span>
        </div>
      </div>
      <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

/* ---------- VU tier mix (Section 2) ---------- */
const VU_TIERS = [
  { tier: 'A+', label: 'Critical', range: '≥ 50', pct: 18, count: 868, color: '#1d4ed8' },
  { tier: 'A', label: 'High', range: '35–49', pct: 34, count: 1639, color: '#3b82f6' },
  { tier: 'B', label: 'Medium', range: '25–34', pct: 41, count: 1976, color: '#60a5fa' },
  { tier: 'C', label: 'Standard', range: '20–24', pct: 6, count: 289, color: '#bfdbfe' },
  { tier: 'D', label: 'Low', range: '< 20', pct: 1, count: 48, color: '#dbeafe' },
]

function VuTierMixCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-[#0f172a] leading-tight">VU grade-tier mix</h3>
          <p className="text-[12px] text-[#94a3b8] leading-tight mt-0.5">
            How the 4,820 triggered interactions split across urgency tiers
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef2ff] border border-[#c7d2fe] px-2.5 py-1 text-[11px] font-semibold text-[#4f46e5]">
          Sampling: A+/A 100% · B 50% · C/D 0%
        </span>
      </div>
      <div className="p-4">
        <div className="flex h-9 rounded-md overflow-hidden mb-4">
          {VU_TIERS.map(t => (
            <div
              key={t.tier}
              className="flex items-center justify-center text-[11px] font-semibold text-white"
              style={{ width: `${t.pct}%`, backgroundColor: t.color }}
              title={`${t.tier} (${t.label}) — ${t.count.toLocaleString()} interactions`}
            >
              {t.pct >= 6 ? `${t.pct}%` : ''}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {VU_TIERS.map(t => (
            <div key={t.tier} className="rounded-md bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                <span className="text-[12px] font-semibold text-[#0f172a]">{t.tier}</span>
                <span className="text-[10px] text-[#94a3b8]">{t.range}</span>
              </div>
              <div className="text-[11px] text-[#64748b] mt-0.5">{t.label}</div>
              <div className="text-[14px] font-semibold text-[#0f172a] mt-1 tabular-nums">
                {t.count.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- Top topics (Section 2) ---------- */
type TopicRow = {
  topic: string
  volume: number
  avgVu: number
  delta: { tone: 'up' | 'flat' | 'down'; text: string }
  flag?: 'rising'
}

const TOPICS: TopicRow[] = [
  { topic: 'Refund processing', volume: 412, avgVu: 41, delta: { tone: 'up', text: '+18%' } },
  { topic: 'Baggage claim', volume: 388, avgVu: 39, delta: { tone: 'flat', text: '→' } },
  { topic: 'Flight disruption', volume: 360, avgVu: 44, delta: { tone: 'down', text: '−6%' } },
  { topic: 'Call transfer impact', volume: 210, avgVu: 33, delta: { tone: 'up', text: '+24%' }, flag: 'rising' },
  { topic: 'Booking change', volume: 180, avgVu: 28, delta: { tone: 'down', text: '−9%' } },
  { topic: 'Payment gateway timeout', volume: 95, avgVu: 36, delta: { tone: 'flat', text: '→' } },
]

function TopTopicsCard() {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#e2e8f0]">
        <h3 className="text-[14px] font-semibold text-[#0f172a] leading-tight">Top topics surfacing</h3>
        <p className="text-[12px] text-[#94a3b8] leading-tight mt-0.5">
          Topics firing the trigger · ranked by volume
        </p>
      </div>
      <div className="divide-y divide-[#f1f5f9]">
        {TOPICS.map(t => {
          const deltaColor =
            t.delta.tone === 'up' ? '#16a34a' : t.delta.tone === 'down' ? '#dc2626' : '#94a3b8'
          const Icon = t.delta.tone === 'up' ? TrendingUp : t.delta.tone === 'down' ? TrendingDown : Minus
          return (
            <div key={t.topic} className="px-4 py-2.5 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-medium text-[#0f172a] truncate">{t.topic}</span>
                  {t.flag === 'rising' && (
                    <span className="inline-flex items-center rounded-full bg-[#dcfce7] px-1.5 py-0.5 text-[9px] font-semibold text-[#15803d] uppercase tracking-[0.05em]">
                      not in brief
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#64748b] mt-0.5 tabular-nums">
                  {t.volume.toLocaleString()} · avg VU {t.avgVu}
                </div>
              </div>
              <div className="flex items-center gap-1" style={{ color: deltaColor }}>
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[12px] font-semibold tabular-nums">{t.delta.text}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- VU drift line (Section 2) ---------- */
const VU_DRIFT: number[] = [42, 41, 42, 40, 41, 39, 40, 39, 38, 37, 38, 37, 36, 38]

function VuDriftCard() {
  const width = 800
  const height = 140
  const padding = { top: 12, right: 16, bottom: 24, left: 32 }
  const cw = width - padding.left - padding.right
  const ch = height - padding.top - padding.bottom
  const min = 30
  const max = 50
  const xs = (i: number) => padding.left + (i / (VU_DRIFT.length - 1)) * cw
  const ys = (v: number) => padding.top + ch - ((v - min) / (max - min)) * ch

  const linePath = useMemo(() => {
    const pts = VU_DRIFT.map((v, i) => ({ x: xs(i), y: ys(v) }))
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
  }, [])

  const yTicks = [30, 40, 50]

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-[#0f172a] leading-tight">Average VU over campaign</h3>
          <p className="text-[12px] text-[#94a3b8] leading-tight mt-0.5">
            Drift signal — declining trend = campaign sampling lower-urgency interactions
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#94a3b8]">
          <span>14 days</span>
          <span>·</span>
          <span className="text-[#dc2626] font-semibold">−4 net</span>
        </div>
      </div>
      <div className="p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient id="vu-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
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
              />
              <text x={padding.left - 8} y={ys(t) + 4} textAnchor="end" fill="#cbd5e1" fontSize="10">
                {t}
              </text>
            </g>
          ))}
          <path
            d={`${linePath} L ${xs(VU_DRIFT.length - 1)} ${ys(min)} L ${xs(0)} ${ys(min)} Z`}
            fill="url(#vu-area)"
          />
          <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
          {VU_DRIFT.map((v, i) => (
            <circle key={i} cx={xs(i)} cy={ys(v)} r="2.5" fill="#8b5cf6" />
          ))}
          {[0, 6, 13].map(i => (
            <text key={i} x={xs(i)} y={height - 6} textAnchor="middle" fill="#94a3b8" fontSize="10">
              {i === 0 ? 'Day 1' : i === 13 ? 'Today' : 'Day 7'}
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}

/* ---------- Response & completion funnel (Section 3) ---------- */
function ResponseCompletionCard() {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#e2e8f0]">
        <h3 className="text-[14px] font-semibold text-[#0f172a] leading-tight">Response & completion</h3>
        <p className="text-[12px] text-[#94a3b8] leading-tight mt-0.5">
          From survey delivery to a fully completed response
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4 p-4">
        <ResponseStat label="Opens" value="1,210" rate="75%" of="of delivered" />
        <ResponseStat label="Started" value="1,114" rate="92%" of="of opened" />
        <ResponseStat label="Completed" value="780" rate="70%" of="of started" />
        <ResponseStat label="Avg time to complete" value="1m 42s" rate="" of="" />
      </div>
    </div>
  )
}

function ResponseStat({ label, value, rate, of }: { label: string; value: string; rate: string; of: string }) {
  return (
    <div className="rounded-md bg-[#f8fafc] border border-[#e2e8f0] px-3 py-3">
      <div className="text-[11px] text-[#64748b] mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-[22px] font-bold text-[#0f172a] tabular-nums">{value}</span>
        {rate && <span className="text-[13px] font-semibold text-[#3b82f6]">{rate}</span>}
      </div>
      {of && <div className="text-[11px] text-[#94a3b8] mt-0.5">{of}</div>}
    </div>
  )
}

/* ---------- Per-question landing (Section 3) ---------- */
type QuestionRow = {
  question: string
  uses: number
  answerRate: number
  avgLength: string
  abandon: number
  validation: number | null
  flag?: 'kill-step'
}

const QUESTIONS: QuestionRow[] = [
  {
    question: 'How frustrating was the rebooking process for you?',
    uses: 612,
    answerRate: 88,
    avgLength: '24 words',
    abandon: 4,
    validation: 91,
  },
  {
    question: 'Did the agent acknowledge the disruption upfront?',
    uses: 588,
    answerRate: 84,
    avgLength: '12 words',
    abandon: 6,
    validation: 86,
  },
  {
    question: 'What would have made the resolution easier?',
    uses: 502,
    answerRate: 71,
    avgLength: '41 words',
    abandon: 9,
    validation: null,
  },
  {
    question: 'How likely are you to fly with us again?',
    uses: 480,
    answerRate: 79,
    avgLength: '1 (rating)',
    abandon: 2,
    validation: 82,
  },
  {
    question: 'Was the compensation offered reasonable?',
    uses: 145,
    answerRate: 52,
    avgLength: '8 words',
    abandon: 26,
    validation: 64,
    flag: 'kill-step',
  },
]

function QuestionLandingCard() {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-[#0f172a] leading-tight">
            Per-question landing
          </h3>
          <p className="text-[12px] text-[#94a3b8] leading-tight mt-0.5">
            AI-generated question variants clustered semantically · top 5 by usage
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef2ff] border border-[#c7d2fe] px-2.5 py-1 text-[11px] font-semibold text-[#4f46e5]">
          <Sparkles className="h-3 w-3" fill="#6366f1" />
          AI-generated per interaction
        </span>
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-[#f1f5f9] bg-[#fafbfc]">
            <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748b]">
              Question variant
            </th>
            <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748b]">
              Used in
            </th>
            <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748b]">
              Answer rate
            </th>
            <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748b]">
              Avg length
            </th>
            <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748b]">
              Abandon
            </th>
            <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748b]">
              Validation alignment
            </th>
          </tr>
        </thead>
        <tbody>
          {QUESTIONS.map(q => {
            const isKill = q.flag === 'kill-step'
            return (
              <tr
                key={q.question}
                className={`border-b border-[#f1f5f9] last:border-b-0 ${isKill ? 'bg-[#fffbeb]' : ''}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-[#0f172a]">"{q.question}"</span>
                    {isKill && (
                      <span className="inline-flex items-center rounded-full bg-[#fef3c7] px-1.5 py-0.5 text-[10px] font-semibold text-[#b45309]">
                        kill step
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-[#0f172a] tabular-nums">{q.uses}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  <span className={q.answerRate < 70 ? 'text-[#dc2626] font-semibold' : 'text-[#0f172a]'}>
                    {q.answerRate}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-[#64748b] tabular-nums">{q.avgLength}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  <span className={q.abandon >= 15 ? 'text-[#dc2626] font-semibold' : 'text-[#0f172a]'}>
                    {q.abandon}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {q.validation === null ? (
                    <span className="text-[#94a3b8]">n/a (open)</span>
                  ) : (
                    <span className={q.validation < 75 ? 'text-[#dc2626] font-semibold' : 'text-[#0f172a]'}>
                      {q.validation}%
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ---------- Reusable AI insight block ---------- */
type Status = 'pending' | 'done' | 'dismissed'
const TODAY = 'Jun 1'

function InsightBlock({
  headline,
  bullets,
  impact,
  action,
}: {
  headline: string
  bullets: string[]
  impact: string[]
  action: string
}) {
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState<Status>('pending')

  if (status === 'done') {
    return (
      <div className="rounded-[10px] bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-2 flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-[#16a34a] flex items-center justify-center flex-shrink-0">
          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#16a34a]">Done · {TODAY}</span>
        <span className="text-[12px] text-[#166534] flex-1 truncate">· {action}</span>
        <button
          onClick={() => setStatus('pending')}
          className="text-[11px] font-medium text-[#16a34a] hover:underline"
        >
          Undo
        </button>
      </div>
    )
  }
  if (status === 'dismissed') {
    return (
      <div className="rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0] px-3 py-2 flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-[#94a3b8] flex items-center justify-center flex-shrink-0">
          <X className="h-2.5 w-2.5 text-white" strokeWidth={3} />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8] flex-1">
          Dismissed · {TODAY}
        </span>
        <button
          onClick={() => setStatus('pending')}
          className="text-[11px] font-medium text-[#64748b] hover:underline"
        >
          Undo
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-[10px] bg-[#eff6ff] border border-[#dbeafe] overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full px-3 py-2.5 flex items-start gap-2 text-left hover:bg-[#e0ecfe] transition-colors outline-none focus:outline-none"
      >
        <Sparkles className="h-3.5 w-3.5 text-[#6366f1] flex-shrink-0 mt-0.5" fill="#6366f1" />
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-[#1e3a8a] leading-snug">{headline}</p>
          <span className="text-[11px] font-medium text-[#6366f1] inline-flex items-center gap-1 mt-1">
            <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? '' : '-rotate-90'}`} strokeWidth={2.5} />
            {expanded ? 'Hide insight & action' : 'See insight & action'}
          </span>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-[#dbeafe] px-3 py-3 space-y-3">
          <ul className="space-y-1">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[12px] text-[#1e3a8a] leading-snug">
                <span className="text-[#6366f1] font-bold flex-shrink-0">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2 border-t border-[#dbeafe]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#64748b] mb-1">
              Expected impact
            </div>
            <ul className="space-y-1">
              {impact.map((b, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px] text-[#0f172a] leading-snug">
                  <span className="text-[#16a34a] font-bold flex-shrink-0">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-2 border-t border-[#dbeafe]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6366f1] mb-1.5">
              Recommended action
            </div>
            <p className="text-[12px] text-[#1e3a8a] mb-2 leading-snug">{action}</p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setStatus('done')}
                className="text-[11px] font-semibold text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-[4px] px-2.5 py-1 transition-colors outline-none focus:outline-none"
              >
                Approve
              </button>
              <button
                onClick={() => setStatus('dismissed')}
                className="text-[11px] font-semibold text-[#64748b] bg-white border border-[#c7d2fe] hover:bg-[#f8fafc] hover:text-[#0f172a] rounded-[4px] px-2.5 py-1 transition-colors outline-none focus:outline-none"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
