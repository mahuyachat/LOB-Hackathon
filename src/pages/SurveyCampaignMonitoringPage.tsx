import { TrendingUp, TrendingDown, Minus, Search } from 'lucide-react'
import { CAMPAIGNS, portfolioSummary, type Campaign, type CampaignStatus } from '@/lib/campaigns'

/* ============================================================
 * Feedback Campaign Monitor — Level 1 portfolio dashboard
 *
 * Two main sections:
 *   1. Campaign Performance — KPI row + dense campaign table
 *   2. Top Discussed Topics — ranked topic table with inline
 *      drill-down showing 4 trend charts per topic
 * Drill-down on a campaign row opens the per-campaign FI dashboard.
 * ============================================================ */
export function SurveyCampaignMonitoringPage({
  onSelectCampaign,
  onBackToAdmin,
}: {
  onSelectCampaign: (campaignId: string) => void
  onBackToAdmin: () => void
}) {
  const summary = portfolioSummary()

  return (
    <div className="bg-[#F8FAFC] flex-1 flex flex-col">
      <div className="px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] font-semibold text-[#0f172a] leading-[1.1] tracking-[-0.02em]">
            Operations Dashboard
          </h1>
        </div>

        <FilterRow />

        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-[16px] font-semibold text-[#0f172a]">Campaign Performance</h2>
            <span className="text-[11px] text-[#94a3b8]">
              Live across active campaigns · last 30 days
            </span>
          </div>
          <KpiRow summary={summary} />
        </section>

        <CampaignTable onSelectCampaign={onSelectCampaign} />
      </div>
    </div>
  )
}

/* ---------- Filter row ---------- */
function FilterRow() {
  const filters = ['Last 30 days', 'All Campaigns', 'All Channels', 'All Categories']
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] pointer-events-none" />
          <input
            type="text"
            placeholder="Search campaigns"
            className="h-[34px] w-[220px] pl-8 pr-3 bg-white border border-[#e2e8f0] rounded-[8px] text-[12px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
          />
        </div>
        {filters.map(label => (
          <select
            key={label}
            className="h-[34px] px-3 bg-white border border-[#e2e8f0] rounded-[8px] text-[12px] text-[#0f172a] font-medium hover:border-[#cbd5e1] focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%2210%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M6%208L2%204h8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[center_right_10px] pr-8"
          >
            <option>{label}</option>
          </select>
        ))}
      </div>
      <div className="text-[12px] text-[#94a3b8]">Jun 2, 2026 · 09:14</div>
    </div>
  )
}

/* ---------- KPI tiles ---------- */
function KpiRow({ summary }: { summary: ReturnType<typeof portfolioSummary> }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <KpiTile
        label="Active campaigns"
        value={`${summary.activeCount}`}
        sub="1 launched this week"
      />
      <KpiTile
        label="Avg response rate"
        value={`${summary.avgResponse}%`}
        delta={{ arrow: '↑', text: '+3.2pp', suffix: 'vs. prior period' }}
        deltaTone="up"
      />
      <KpiTile
        label="Total responses"
        value={summary.totalResponses.toLocaleString()}
        delta={{ arrow: '↑', text: '+240', suffix: 'last 30 days' }}
        deltaTone="up"
      />
      <KpiTile
        label="Avg CSAT score"
        value={`${summary.avgCsat}`}
        delta={{ arrow: '↑', text: '+4', suffix: 'vs. prior period' }}
        deltaTone="up"
      />
    </div>
  )
}

function KpiTile({
  label,
  value,
  sub,
  delta,
  deltaTone = 'flat',
}: {
  label: string
  value: string
  sub?: string
  delta?: { arrow?: '↑' | '↓'; text: string; suffix?: string }
  deltaTone?: 'up' | 'down' | 'flat'
}) {
  const deltaColor =
    deltaTone === 'up' ? '#16a34a' : deltaTone === 'down' ? '#dc2626' : '#64748b'
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-5">
      <div className="text-[10px] font-medium text-[#94a3b8] uppercase tracking-[0.08em] mb-2 leading-none">
        {label}
      </div>
      <div className="text-[40px] font-bold leading-[1] tracking-[-0.02em] text-[#0f172a] tabular-nums">
        {value}
      </div>
      {delta && (
        <div className="flex items-center gap-1 mt-3 text-[12px] leading-none">
          <span className="font-semibold" style={{ color: deltaColor }}>
            {delta.arrow ? `${delta.arrow} ${delta.text}` : delta.text}
          </span>
          {delta.suffix && <span className="text-[#64748b]">{delta.suffix}</span>}
        </div>
      )}
      {sub && !delta && (
        <div className="text-[12px] text-[#64748b] mt-3 leading-none">{sub}</div>
      )}
    </div>
  )
}

/* ---------- Campaign table ---------- */
function CampaignTable({ onSelectCampaign }: { onSelectCampaign: (id: string) => void }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-[#f1f5f9]">
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
              Campaign
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
              Status
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8] w-[200px]">
              Response Rate
            </th>
            <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
              Responses
            </th>
            <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
              CSAT
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
              Emerging Topic
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
              Channel
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
              Category
            </th>
          </tr>
        </thead>
        <tbody>
          {CAMPAIGNS.map(c => (
            <CampaignRow key={c.id} campaign={c} onSelect={() => onSelectCampaign(c.id)} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CampaignRow({ campaign, onSelect }: { campaign: Campaign; onSelect: () => void }) {
  const topTopic = campaign.topIntents[0] ?? '—'
  const primaryChannel = campaign.channels[0] ?? '—'
  const responses = Math.round(((campaign.sent ?? 0) * (campaign.responseRate ?? 0)) / 100)

  return (
    <tr
      onClick={onSelect}
      className="border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fafc] cursor-pointer transition-colors"
    >
      <td className="px-5 py-3.5">
        <div className="text-[13px] font-medium text-[#0f172a]">{campaign.name}</div>
      </td>
      <td className="px-5 py-3.5">
        <StatusPill status={campaign.status} />
      </td>
      <td className="px-5 py-3.5">
        <ResponseRateCell rate={campaign.responseRate ?? 0} />
      </td>
      <td className="px-5 py-3.5 text-right text-[#0f172a] tabular-nums">
        {responses.toLocaleString()}
      </td>
      <td className="px-5 py-3.5 text-right text-[#0f172a] tabular-nums">
        {campaign.csat ?? '—'}
      </td>
      <td className="px-5 py-3.5 text-[#475569]">{topTopic}</td>
      <td className="px-5 py-3.5">
        <ChannelChip channel={primaryChannel} />
      </td>
      <td className="px-5 py-3.5 text-[#475569]">{campaign.category}</td>
    </tr>
  )
}

/* ---------- Response rate cell (% + colored bar) ---------- */
function ResponseRateCell({ rate }: { rate: number }) {
  const color = rate >= 60 ? '#16a34a' : rate >= 45 ? '#0f172a' : '#dc2626'
  return (
    <div className="flex items-center gap-3">
      <span className="text-[13px] font-semibold tabular-nums" style={{ color }}>
        {rate}%
      </span>
      <div className="flex-1 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${rate}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

/* ---------- Trend arrow ---------- */
function TrendArrow({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-[#16a34a] inline-block" />
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-[#dc2626] inline-block" />
  return <Minus className="h-4 w-4 text-[#94a3b8] inline-block" />
}

/* ---------- Channel chip ---------- */
function ChannelChip({ channel }: { channel: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-[#eff6ff] px-2 py-0.5 text-[12px] font-medium text-[#1d4ed8]">
      {channel}
    </span>
  )
}

/* ---------- Status pill ---------- */
const STATUS_STYLES: Record<CampaignStatus, { bg: string; text: string; label: string }> = {
  active: { bg: '#dcfce7', text: '#15803d', label: 'Active' },
  paused: { bg: '#fef3c7', text: '#b45309', label: 'Paused' },
  draft: { bg: '#e2e8f0', text: '#475569', label: 'Draft' },
  ended: { bg: '#f1f5f9', text: '#64748b', label: 'Ended' },
}

function StatusPill({ status }: { status: CampaignStatus }) {
  const s = STATUS_STYLES[status]
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  )
}
