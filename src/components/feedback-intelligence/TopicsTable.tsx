import { useMemo, useState } from 'react'
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronRight } from 'lucide-react'
import type { Topic } from '@/lib/topics'

/* ============================================================
 * TopicsTable — rich topic table with inline drill-down trends.
 * Reused on the Feedback Campaign Monitor (portfolio) and inside
 * the per-campaign Feedback Intelligence Dashboard.
 * ============================================================ */
export function TopicsTable({ topics }: { topics: Topic[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const sorted = useMemo(() => [...topics].sort((a, b) => b.mentions - a.mentions), [topics])

  if (sorted.length === 0) {
    return (
      <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 text-center">
        <p className="text-[13px] text-[#94a3b8]">No topics available for this view.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-[#f1f5f9]">
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8] w-[40px]" />
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
              Intent
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
              Category
            </th>
            <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
              Mentions
            </th>
            <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
              Surveys Sent
            </th>
            <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
              Responses
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8] w-[180px]">
              Response Rate
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
              CSAT
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(t => (
            <TopicRow
              key={t.id}
              topic={t}
              expanded={openId === t.id}
              onToggle={() => setOpenId(openId === t.id ? null : t.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TopicRow({
  topic,
  expanded,
  onToggle,
}: {
  topic: Topic
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] cursor-pointer transition-colors"
      >
        <td className="px-5 py-3.5">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-[#64748b]" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[#94a3b8]" />
          )}
        </td>
        <td className="px-5 py-3.5">
          <div className="text-[13px] font-medium text-[#0f172a]">{topic.name}</div>
        </td>
        <td className="px-5 py-3.5 text-[#475569]">{topic.category}</td>
        <td className="px-5 py-3.5 text-right text-[#0f172a] tabular-nums">
          {topic.mentions.toLocaleString()}
        </td>
        <td className="px-5 py-3.5 text-right text-[#0f172a] tabular-nums">
          {topic.surveysSent.toLocaleString()}
        </td>
        <td className="px-5 py-3.5 text-right text-[#0f172a] tabular-nums">
          {topic.responses.toLocaleString()}
        </td>
        <td className="px-5 py-3.5">
          <ResponseRateCell rate={topic.responseRate} />
        </td>
        <td className="px-5 py-3.5">
          <CsatBadge value={topic.csat} />
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-[#f1f5f9] bg-[#fafbfc]">
          <td colSpan={8} className="px-5 py-5">
            <TopicTrendPanel topic={topic} />
          </td>
        </tr>
      )}
    </>
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
        <div className="h-full rounded-full" style={{ width: `${rate}%`, backgroundColor: color }} />
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

/* ---------- CSAT badge — no red, ranges from green (high) to slate (low) ---------- */
function CsatBadge({ value }: { value: number }) {
  // ≥75 high (green), 60–74 mid (blue), 50–59 caution (amber), <50 low (slate)
  const tone = value >= 75 ? 'high' : value >= 60 ? 'mid' : value >= 50 ? 'caution' : 'low'
  const bg =
    tone === 'high' ? '#dcfce7' :
    tone === 'mid' ? '#dbeafe' :
    tone === 'caution' ? '#fef3c7' :
    '#e2e8f0'
  const text =
    tone === 'high' ? '#15803d' :
    tone === 'mid' ? '#1d4ed8' :
    tone === 'caution' ? '#b45309' :
    '#475569'
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-semibold tabular-nums"
      style={{ backgroundColor: bg, color: text }}
    >
      {value}
    </span>
  )
}

/* ---------- Topic trend drill-down (4 mini charts) ---------- */
function TopicTrendPanel({ topic }: { topic: Topic }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <h3 className="text-[14px] font-semibold text-[#0f172a]">
            {topic.name} <span className="text-[#94a3b8] font-medium">· {topic.category}</span>
          </h3>
          <p className="text-[11px] text-[#94a3b8] mt-0.5">
            14-day trend · detection · sends · responses · response rate
          </p>
        </div>
        <div className="text-[11px] text-[#94a3b8]">
          CSAT <CsatBadge value={topic.csat} />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <TrendChart title="Detection rate" unit="%" color="#6366f1" data={topic.detectionRate} />
        <TrendChart title="Surveys sent" unit="" color="#3b82f6" data={topic.surveysSentSeries} />
        <TrendChart title="Responses received" unit="" color="#0ea5e9" data={topic.responsesSeries} />
        <TrendChart title="Response rate" unit="%" color="#16a34a" data={topic.responseRateSeries} />
      </div>
    </div>
  )
}

function TrendChart({
  title,
  unit,
  color,
  data,
}: {
  title: string
  unit: string
  color: string
  data: number[]
}) {
  const width = 320
  const height = 110
  const padding = { top: 16, right: 10, bottom: 22, left: 28 }
  const cw = width - padding.left - padding.right
  const ch = height - padding.top - padding.bottom

  const min = Math.max(
    0,
    Math.min(...data) - Math.max(2, (Math.max(...data) - Math.min(...data)) * 0.2)
  )
  const max = Math.max(...data) + Math.max(2, (Math.max(...data) - Math.min(...data)) * 0.2)
  const range = max - min || 1
  const xs = (i: number) => padding.left + (i / (data.length - 1)) * cw
  const ys = (v: number) => padding.top + ch - ((v - min) / range) * ch

  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(v)}`).join(' ')
  const areaPath = `${path} L ${xs(data.length - 1)} ${padding.top + ch} L ${xs(0)} ${padding.top + ch} Z`
  const gradId = `tr-${title.replace(/\W/g, '').toLowerCase()}-${color.replace('#', '')}`

  const latest = data[data.length - 1]
  const first = data[0]
  // For count metrics (unit === '') the headline is the 14-day total — this
  // matches the parent row's "Surveys Sent" / "Responses" column. For rate
  // metrics (unit === '%') the headline is today's value.
  const total = data.reduce((s, v) => s + v, 0)
  const headline = unit === '' ? total : latest
  const delta = latest - first
  const deltaPct = first !== 0 ? Math.round((delta / first) * 100) : 0
  const deltaColor = delta > 0 ? '#16a34a' : delta < 0 ? '#dc2626' : '#94a3b8'

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[10px] p-3">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] font-medium text-[#94a3b8] uppercase tracking-[0.05em]">
          {title}
        </span>
        <span className="text-[10px] font-semibold tabular-nums" style={{ color: deltaColor }}>
          {delta > 0 ? '+' : ''}
          {deltaPct}%
        </span>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-[20px] font-bold text-[#0f172a] tabular-nums leading-none">
          {unit === '' ? headline.toLocaleString() : headline}
        </span>
        {unit && <span className="text-[12px] text-[#64748b] leading-none">{unit}</span>}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[90px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <text x={padding.left - 4} y={padding.top + 4} textAnchor="end" fill="#cbd5e1" fontSize="9">
          {Math.round(max)}
        </text>
        <text x={padding.left - 4} y={padding.top + ch} textAnchor="end" fill="#cbd5e1" fontSize="9">
          {Math.round(min)}
        </text>
        <text x={padding.left} y={height - 6} textAnchor="start" fill="#94a3b8" fontSize="9">
          Day 1
        </text>
        <text x={width - padding.right} y={height - 6} textAnchor="end" fill="#94a3b8" fontSize="9">
          Today
        </text>
        <line
          x1={padding.left}
          y1={padding.top + ch}
          x2={width - padding.right}
          y2={padding.top + ch}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx={xs(data.length - 1)} cy={ys(latest)} r="3" fill={color} />
      </svg>
    </div>
  )
}
