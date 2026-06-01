import { Fragment } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

/* ============================================================
 * Monitoring dashboard — campaign performance + topic intent/action
 * Native React, nice_world styling (matches FeedbackIntelligenceDashboard)
 * ============================================================ */
export function MonitoringDashboard() {
  return (
    <div className="space-y-5">
      <FilterRow />

      {/* Campaign performance */}
      <section className="space-y-3">
        <SectionHeading title="Campaign Performance" note="Live across active campaigns · last 30 days" />
        <KpiRow />
        <CampaignTable />
      </section>

      {/* Topic intent / action monitoring */}
      <section className="space-y-3">
        <SectionHeading title="Topic Intent / Action Monitoring" note="VU ≥ 32 confirmed · color = signal intensity" />
        <IntentActionHeatmap />
      </section>
    </div>
  )
}

/* ---------- Shared bits ---------- */
function SectionHeading({ title, note }: { title: string; note: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[15px] font-semibold text-[#0f172a]">{title}</h2>
      <span className="text-[12px] text-[#94a3b8]">{note}</span>
    </div>
  )
}

function FilterRow() {
  const filters = ['Last 30 days', 'All Campaigns', 'All Channels', 'All Segments']
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

/* ---------- KPI row ---------- */
type Kpi = { label: string; value: string; delta?: string; deltaTone?: 'pos' | 'neg'; sub?: string }
const KPIS: Kpi[] = [
  { label: 'Active Campaigns', value: '18', sub: '3 launched this week' },
  { label: 'Avg Response Rate', value: '55.4%', delta: '↑ +3.2pp', deltaTone: 'pos', sub: 'vs. prior period' },
  { label: 'Total Responses', value: '10,204', delta: '↑ +1,240', deltaTone: 'pos', sub: 'last 30 days' },
  { label: 'Avg VU Score', value: '31', delta: '↓ -2', deltaTone: 'neg', sub: 'just below 32 threshold' },
]

function KpiRow() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {KPIS.map(k => (
        <div key={k.label} className="bg-white border border-[#e2e8f0] rounded-[12px] p-4">
          <div className="text-[10px] font-medium text-[#94a3b8] uppercase tracking-[0.5px] mb-2 leading-none">{k.label}</div>
          <div className="text-[32px] font-bold leading-[1] tracking-[-0.02em] text-[#0f172a] mb-2">{k.value}</div>
          {k.delta && (
            <div className="flex items-center gap-1.5 text-[12px] font-semibold mb-1 leading-none" style={{ color: k.deltaTone === 'neg' ? '#dc2626' : '#16a34a' }}>
              <span>{k.delta}</span>
              {k.sub && <span className="font-normal text-[#64748b]">{k.sub}</span>}
            </div>
          )}
          {!k.delta && k.sub && <div className="text-[12px] text-[#64748b] leading-none">{k.sub}</div>}
        </div>
      ))}
    </div>
  )
}

/* ---------- Campaign table ---------- */
type Trend = 'up' | 'down' | 'flat'
type Campaign = {
  name: string
  status: 'Active' | 'Paused' | 'Inactive'
  responseRate: number
  responses: string
  vu: number
  topIntent: string
  channel: string
  segment: string
  trend: Trend
}

const CAMPAIGNS: Campaign[] = [
  { name: 'Complaint Resolution Follow-Up',        status: 'Active',   responseRate: 62, responses: '1,240', vu: 34, topIntent: 'Billing Dispute',   channel: 'SMS',       segment: 'Enterprise',         trend: 'up' },
  { name: 'Cognigy AI Session — Bot Handoff Audit', status: 'Active',   responseRate: 70, responses: '890',   vu: 29, topIntent: 'Flight Disruption', channel: 'WhatsApp',  segment: 'Business Frequent',  trend: 'up' },
  { name: 'Negative Sentiment Catcher — All Digital', status: 'Active', responseRate: 58, responses: '2,100', vu: 33, topIntent: 'Baggage Claim',     channel: 'Email',     segment: 'Mid-Market',         trend: 'flat' },
  { name: 'Post-Disruption Recovery — May',         status: 'Active',   responseRate: 81, responses: '1,540', vu: 38, topIntent: 'Flight Disruption', channel: 'SMS',       segment: 'Leisure Repeat',     trend: 'up' },
  { name: 'Product Feedback — Beta Testers',        status: 'Inactive', responseRate: 41, responses: '320',   vu: 22, topIntent: 'Booking Change',    channel: 'Web Widget', segment: 'First-Time',        trend: 'down' },
  { name: 'Refund Timeline Pulse',                  status: 'Paused',   responseRate: 47, responses: '610',   vu: 27, topIntent: 'Refund Processing', channel: 'Voice IVR', segment: 'SMB',                trend: 'down' },
]

function statusPill(status: Campaign['status']) {
  switch (status) {
    case 'Active':   return 'bg-[#DCFCE7] text-[#15803D]'
    case 'Paused':   return 'bg-[#FEF3C7] text-[#92400E]'
    case 'Inactive': return 'bg-[#F1F5F9] text-[#64748B]'
  }
}

function TrendCell({ trend }: { trend: Trend }) {
  if (trend === 'up')   return <span className="inline-flex items-center gap-1 text-[#16a34a]"><TrendingUp className="h-3.5 w-3.5" /></span>
  if (trend === 'down') return <span className="inline-flex items-center gap-1 text-[#dc2626]"><TrendingDown className="h-3.5 w-3.5" /></span>
  return <span className="inline-flex items-center gap-1 text-[#94a3b8]"><Minus className="h-3.5 w-3.5" /></span>
}

function rrColor(rr: number) {
  if (rr >= 65) return '#16a34a'
  if (rr >= 50) return '#0f172a'
  return '#dc2626'
}

function CampaignTable() {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]">
            {['Campaign', 'Status', 'Response Rate', 'Responses', 'Avg VU', 'Top Intent', 'Channel', 'Segment', 'Trend'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CAMPAIGNS.map((c, i) => (
            <tr key={i} className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
              <td className="px-4 py-3 font-medium text-[#0f172a] whitespace-nowrap">{c.name}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusPill(c.status)}`}>{c.status}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold" style={{ color: rrColor(c.responseRate) }}>{c.responseRate}%</span>
                  <div className="w-16 h-[6px] bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.responseRate}%`, backgroundColor: rrColor(c.responseRate) }} />
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-[#334155]">{c.responses}</td>
              <td className="px-4 py-3 text-[#334155]">{c.vu}</td>
              <td className="px-4 py-3 text-[#334155] whitespace-nowrap">{c.topIntent}</td>
              <td className="px-4 py-3"><span className="inline-flex items-center rounded-full bg-[#EFF6FF] text-[#1d4ed8] text-[11px] px-2 py-0.5 font-medium">{c.channel}</span></td>
              <td className="px-4 py-3 text-[#334155] whitespace-nowrap">{c.segment}</td>
              <td className="px-4 py-3"><TrendCell trend={c.trend} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------- Intent / Action heatmap ---------- */
type HeatCell = { value: string; pct?: number; alert?: boolean }

const HEAT_COLS = [
  { title: 'Transfer',     sub: 'bounced between agents?' },
  { title: 'Hold',         sub: 'kept waiting in-call?' },
  { title: 'Escalation',   sub: 'raised above the agent?' },
  { title: 'Repeat',       sub: 'recurring contact?' },
  { title: 'Action taken', sub: 'resolved with an action?' },
]

const HEAT_ROWS: { label: string; cells: HeatCell[] }[] = [
  { label: 'Billing Dispute',   cells: [{ value: '75%', pct: 75 }, { value: '64%', pct: 64 }, { value: '71%', pct: 71 }, { value: '52%', pct: 52 }, { value: '38%', pct: 38 }] },
  { label: 'Flight Disruption', cells: [{ value: '73%', pct: 73 }, { value: '61%', pct: 61 }, { value: '68%', pct: 68 }, { value: '49%', pct: 49 }, { value: 'Low volume' }] },
  { label: 'Baggage Claim',     cells: [{ value: '62%', pct: 62 }, { value: '54%', pct: 54 }, { value: '70%', pct: 70 }, { value: '58%', pct: 58 }, { value: '31%', pct: 31 }] },
  { label: 'Booking Change',    cells: [{ value: '31%', pct: 31 }, { value: '28%', pct: 28 }, { value: 'Low volume' }, { value: 'Low volume' }, { value: '19%', pct: 19, alert: true }] },
]

function heatCellStyle(cell: HeatCell): { bg: string; fg: string } {
  if (cell.alert) return { bg: '#FEE4E2', fg: '#DC2626' }
  if (cell.pct === undefined) return { bg: '#EFF5FB', fg: '#94A3B8' }
  if (cell.pct >= 70) return { bg: '#1E6BC2', fg: '#FFFFFF' }
  if (cell.pct >= 60) return { bg: '#3D8AD9', fg: '#FFFFFF' }
  if (cell.pct >= 50) return { bg: '#7AB0E5', fg: '#FFFFFF' }
  if (cell.pct >= 40) return { bg: '#A8C9ED', fg: '#1E293B' }
  if (cell.pct >= 30) return { bg: '#C7DCF4', fg: '#1E293B' }
  return { bg: '#DDE9F8', fg: '#1E293B' }
}

function IntentActionHeatmap() {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-4">
      <div className="grid gap-1" style={{ gridTemplateColumns: '180px repeat(5, 1fr)' }}>
        {/* Empty top-left + column headers */}
        <div />
        {HEAT_COLS.map((col, i) => (
          <div key={i} className="px-3 py-2">
            <div className="text-sm font-medium text-[#1E293B]">{col.title}</div>
            <div className="text-xs text-[#94A3B8] mt-0.5">{col.sub}</div>
          </div>
        ))}

        {/* Rows: topic label + cells */}
        {HEAT_ROWS.map((row, ri) => (
          <Fragment key={ri}>
            <div className="flex items-center px-2 text-sm text-[#334155]">{row.label}</div>
            {row.cells.map((cell, ci) => {
              const { bg, fg } = heatCellStyle(cell)
              return (
                <div key={ci} className="flex items-center justify-center h-11 rounded text-sm font-medium" style={{ backgroundColor: bg, color: fg }}>
                  {cell.value}
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
