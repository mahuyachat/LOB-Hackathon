import { useState } from 'react'
import { blindSpotTopics, emergingTopics, RECOMMENDATION_CARDS, getCardByTopicId } from '@/data/eiMockData'

interface Props {
  pendingBlindSpots: number
  onTopicClick: (topicId: string) => void
  onOpenRecommendation: (topicId: string) => void
}

// ── Helpers ───────────────────────────────────────────────────

function sentimentLabel(score: number): string {
  if (score <= -0.3) return 'Negative'
  if (score >= 0.3) return 'Positive'
  return 'Neutral'
}

function urgencyColor(urgency: 'high' | 'medium' | 'low'): string {
  if (urgency === 'high') return '#dc2626'
  if (urgency === 'medium') return '#d97706'
  return '#16a34a'
}

function urgencyBg(urgency: 'high' | 'medium' | 'low'): string {
  if (urgency === 'high') return '#fee2e2'
  if (urgency === 'medium') return '#fef3c7'
  return '#dcfce7'
}

function urgencyBorder(urgency: 'high' | 'medium' | 'low'): string {
  if (urgency === 'high') return '#fca5a5'
  if (urgency === 'medium') return '#fcd34d'
  return '#86efac'
}

// ── Sub-components ────────────────────────────────────────────

interface StatTileProps {
  label: string
  value: string | number
  chip: string
  chipColor: string
  chipBg: string
  onClick?: () => void
  sparklineData?: number[]
  sparklineColor?: string
}

function MiniSparkline({ data, color, width = 80, height = 28, fullWidth = false }: { data: number[]; color: string; width?: number; height?: number; fullWidth?: boolean }) {
  if (data.length < 2) return null
  const w = width, h = height, pad = 2
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const toX = (i: number) => pad + (i / (data.length - 1)) * (w - pad * 2)
  const toY = (v: number) => pad + (h - pad * 2) - ((v - min) / range) * (h - pad * 2)
  const pts = data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')
  const areaPoints = [
    `${pad},${h - pad}`,
    ...data.map((v, i) => `${toX(i)},${toY(v)}`),
    `${w - pad},${h - pad}`,
  ].join(' ')
  const latest = data[data.length - 1]
  return (
    <svg
      width={fullWidth ? '100%' : w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ overflow: 'visible', display: 'block' }}
    >
      <polygon points={areaPoints} fill={color} fillOpacity={0.12} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={toX(data.length - 1)} cy={toY(latest)} r={2.5} fill={color} />
    </svg>
  )
}

function StatTile({ label, value, chip, chipColor, chipBg, onClick, sparklineData, sparklineColor }: StatTileProps) {
  const trendChip = (() => {
    if (!sparklineData || sparklineData.length < 2) return null
    const latest = sparklineData[sparklineData.length - 1]
    const prev = sparklineData[sparklineData.length - 2]
    const delta = latest - prev
    const pct = prev > 0 ? Math.round((delta / prev) * 100) : 0
    const up = delta >= 0
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center',
        background: up ? '#fee2e2' : '#dcfce7',
        color: up ? '#dc2626' : '#16a34a',
        borderRadius: 9999, padding: '2px 8px',
        fontSize: 11, fontWeight: 700,
      }}>
        {up ? '+' : ''}{pct}%
      </span>
    )
  })()

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '20px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{value}</span>
        {trendChip ?? (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: chipBg, color: chipColor,
            borderRadius: 9999, padding: '2px 8px',
            fontSize: 11, fontWeight: 500,
          }}>
            {chip}
          </div>
        )}
      </div>
      {sparklineData && sparklineData.length >= 2 && (
        <MiniSparkline data={sparklineData} color={sparklineColor ?? '#64748b'} width={200} height={48} fullWidth />
      )}
    </div>
  )
}

// ── Social Mentions tile with inline trend chip ───────────────
interface SocialMentionsTileProps {
  value: string | number
  sparklineData: number[]
  sparklineColor: string
}

function SocialMentionsTile({ value, sparklineData, sparklineColor }: SocialMentionsTileProps) {
  const data = sparklineData
  const latest = data[data.length - 1]
  const prev = data[data.length - 2]
  const delta = latest - prev
  const pct = prev > 0 ? Math.round((delta / prev) * 100) : 0
  const trendUp = delta >= 0

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>
        Social Mentions
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{typeof value === 'number' ? value.toLocaleString() : value}</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center',
          background: trendUp ? '#fee2e2' : '#dcfce7',
          color: trendUp ? '#dc2626' : '#16a34a',
          borderRadius: 9999, padding: '2px 8px',
          fontSize: 11, fontWeight: 700,
        }}>
          {trendUp ? '+' : ''}{pct}%
        </span>
      </div>
      <MiniSparkline data={sparklineData} color={sparklineColor} width={200} height={48} fullWidth />
    </div>
  )
}

// ── Sentiment distribution breakdown tile ─────────────────────
interface SentimentBreakdownTileProps {
  negPct: number
  neutPct: number
  posPct: number
}

function SentimentBreakdownTile({ negPct, neutPct, posPct }: SentimentBreakdownTileProps) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>
        Avg Sentiment
      </div>
      {/* Distribution bar */}
      <div style={{ display: 'flex', height: 6, borderRadius: 9999, overflow: 'hidden', gap: 1, marginBottom: 14 }}>
        <div style={{ flex: negPct, background: '#ef4444' }} />
        <div style={{ flex: neutPct, background: '#94a3b8' }} />
        <div style={{ flex: posPct, background: '#22c55e' }} />
      </div>
      {/* Labels */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, background: '#fef2f2', borderRadius: 8, padding: '8px 10px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#dc2626', lineHeight: 1 }}>{negPct}%</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#991b1b', marginTop: 3 }}>Negative</div>
        </div>
        <div style={{ flex: 1, background: '#f8fafc', borderRadius: 8, padding: '8px 10px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#475569', lineHeight: 1 }}>{neutPct}%</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginTop: 3 }}>Neutral</div>
        </div>
        <div style={{ flex: 1, background: '#f0fdf4', borderRadius: 8, padding: '8px 10px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#16a34a', lineHeight: 1 }}>{posPct}%</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#15803d', marginTop: 3 }}>Positive</div>
        </div>
      </div>
    </div>
  )
}

interface RecommendationCardProps {
  topicId: string
  topicName: string
  urgency: 'high' | 'medium' | 'low'
  whyMissing?: string
  onAction: () => void
}

function RecommendationCardItem({ topicId, topicName, urgency, whyMissing, onAction }: RecommendationCardProps) {
  const truncated = whyMissing
    ? whyMissing.length > 120
      ? whyMissing.slice(0, 117) + '…'
      : whyMissing
    : ''

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderLeft: `3px solid ${urgencyColor(urgency)}`,
      borderRadius: 12,
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      flex: '1 1 0',
      minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', lineHeight: '20px' }}>{topicName}</div>
        <span style={{
          background: urgencyBg(urgency),
          color: urgencyColor(urgency),
          border: `1px solid ${urgencyBorder(urgency)}`,
          borderRadius: 9999,
          padding: '2px 8px',
          fontSize: 11,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {urgency.toUpperCase()}
        </span>
      </div>
      {truncated && (
        <div style={{ fontSize: 12, color: '#475569', lineHeight: '18px' }}>{truncated}</div>
      )}
      <button
        onClick={onAction}
        style={{
          marginTop: 4,
          background: 'none',
          border: 'none',
          padding: 0,
          color: '#2563eb',
          fontSize: 12,
          fontWeight: 500,
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        View details &amp; take action →
      </button>
    </div>
  )
}

const CHANNEL_CONFIG = [
  { key: 'twitter' as const,   label: 'X / Twitter', color: '#0f172a' },
  { key: 'facebook' as const,  label: 'Facebook',    color: '#1877f2' },
  { key: 'reddit' as const,    label: 'Reddit',      color: '#ff4500' },
  { key: 'instagram' as const, label: 'Instagram',   color: '#e1306c' },
]

type ChannelKey = 'twitter' | 'facebook' | 'reddit' | 'instagram' | 'cc'

// Day labels with dates — Jun 4–10 2026
const DAY_LABELS = ['Mon Jun 4', 'Tue Jun 5', 'Wed Jun 6', 'Thu Jun 7', 'Fri Jun 8', 'Sat Jun 9', 'Sun Jun 10']

// Month sparkline — 30 daily totals (May 13 – Jun 11) simulated as scaled multiples of the 7-day pattern
const MONTH_LABELS = ['May 13', 'May 14', 'May 15', 'May 16', 'May 17', 'May 18', 'May 19',
  'May 20', 'May 21', 'May 22', 'May 23', 'May 24', 'May 25', 'May 26',
  'May 27', 'May 28', 'May 29', 'May 30', 'May 31', 'Jun 1',
  'Jun 2', 'Jun 3', 'Jun 4', 'Jun 5', 'Jun 6', 'Jun 7', 'Jun 8', 'Jun 9', 'Jun 10', 'Jun 11']

// Deterministic noise offsets (% of value) — repeating pattern with realistic ups/downs
const NOISE = [0, -8, 5, -12, 8, -3, 10, -6, 4, -9, 7, -4, 12, -7, 3, -10, 6, -2, 8, -5, 11, -8, 4, -6, 9, -3, 7, -11, 5, 13]

function addVariance(vals: number[], seedOffset = 0): number[] {
  return vals.map((v, i) => Math.max(1, Math.round(v + v * (NOISE[(i + seedOffset) % NOISE.length] / 100))))
}

// Generates a 30-point series by repeating the 7-day pattern with gradual upward drift + variance
function expandToMonth(weekVals: number[], seedOffset = 0): number[] {
  const base = [...weekVals, ...weekVals, ...weekVals, ...weekVals, ...weekVals].slice(0, 30)
  const drifted = base.map((v, i) => Math.round(v * (0.75 + (i / 29) * 0.45)))
  return addVariance(drifted, seedOffset)
}

interface ChannelRow {
  day: string
  twitter: number
  facebook: number
  reddit: number
  instagram: number
  cc: number
}

interface SingleChannelSparklineProps {
  rows: ChannelRow[]
  channelKey: ChannelKey
  color: string
  label: string
  width?: number
  height?: number
  startLabel?: string
  endLabel?: string
}

function SingleChannelSparkline({ rows, channelKey, color, label, width = 200, height = 70, startLabel, endLabel }: SingleChannelSparklineProps) {
  const data = rows.map(r => r[channelKey])
  if (data.length < 2) return null

  const pad = { top: 8, right: 8, bottom: 8, left: 8 }
  const w = width - pad.left - pad.right
  const h = height - pad.top - pad.bottom
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const toX = (i: number) => pad.left + (i / (data.length - 1)) * w
  const toY = (v: number) => pad.top + h - ((v - min) / range) * h

  const pts = data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')
  const areaPoints = [
    `${pad.left},${pad.top + h}`,
    ...data.map((v, i) => `${toX(i)},${toY(v)}`),
    `${pad.left + w},${pad.top + h}`,
  ].join(' ')

  const latest = data[data.length - 1]
  const prev = data[data.length - 2]
  const delta = latest - prev
  const pct = prev > 0 ? Math.round((delta / prev) * 100) : 0

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 10,
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{label}</span>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: delta >= 0 ? '#dc2626' : '#16a34a',
        }}>
          {delta >= 0 ? '+' : ''}{pct}%
        </span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>
        {latest.toLocaleString()}
        <span style={{ fontSize: 11, fontWeight: 400, color: '#94a3b8', marginLeft: 4 }}>mentions</span>
      </div>
      <svg width={width - 32} height={height} viewBox={`0 0 ${width - 32} ${height}`} style={{ overflow: 'visible', display: 'block' }}>
        <polygon points={areaPoints} fill={color} fillOpacity={0.08} />
        <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={toX(data.length - 1)} cy={toY(latest)} r={3} fill={color} />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9, color: '#cbd5e1' }}>{startLabel ?? DAY_LABELS[0]}</span>
        <span style={{ fontSize: 9, color: '#cbd5e1' }}>{endLabel ?? DAY_LABELS[DAY_LABELS.length - 1]}</span>
      </div>
    </div>
  )
}

interface DonutProps {
  segments: { label: string; value: number; color: string }[]
  size?: number
}

function DonutChart({ segments, size = 120 }: DonutProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.38
  const innerR = size * 0.24

  let cumAngle = -Math.PI / 2
  const paths: { d: string; color: string }[] = []

  for (const seg of segments) {
    const angle = (seg.value / total) * 2 * Math.PI
    const x1 = cx + r * Math.cos(cumAngle)
    const y1 = cy + r * Math.sin(cumAngle)
    const x2 = cx + r * Math.cos(cumAngle + angle)
    const y2 = cy + r * Math.sin(cumAngle + angle)
    const ix1 = cx + innerR * Math.cos(cumAngle)
    const iy1 = cy + innerR * Math.sin(cumAngle)
    const ix2 = cx + innerR * Math.cos(cumAngle + angle)
    const iy2 = cy + innerR * Math.sin(cumAngle + angle)
    const largeArc = angle > Math.PI ? 1 : 0

    paths.push({
      color: seg.color,
      d: [
        `M ${x1} ${y1}`,
        `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${ix2} ${iy2}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1}`,
        'Z',
      ].join(' '),
    })
    cumAngle += angle
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill={p.color} />
        ))}
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="#0f172a">
          {total}
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#475569' }}>
              {seg.label} <strong style={{ color: '#0f172a' }}>{seg.value}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Section divider ───────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
      <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────

export function EIDashboard({ pendingBlindSpots, onTopicClick, onOpenRecommendation }: Props) {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week')

  // ── Blind spot data setup ──────────────────────────────────
  const bsOrder = ['bs-4', 'bs-1', 'bs-2', 'bs-5', 'bs-3', 'bs-6']
  const sortedBlindSpots = bsOrder
    .map(id => blindSpotTopics.find(t => t.id === id))
    .filter(Boolean) as typeof blindSpotTopics

  const top4BS = sortedBlindSpots.slice(0, 4)
  const top3BS = sortedBlindSpots.slice(0, 3)

  const bsTotalSocial = blindSpotTopics.reduce((s, t) => s + t.socialVolume, 0)
  const bsAvgSentiment = blindSpotTopics.reduce((s, t) => s + t.sentiment.social, 0) / blindSpotTopics.length
  const bsTopScore = Math.max(...RECOMMENDATION_CARDS.filter(c => c.zone === 'blind-spot').map(c => c.score))
  const bsHighestScoreTopic = sortedBlindSpots[0]

  const bsHighCount = RECOMMENDATION_CARDS.filter(c => c.zone === 'blind-spot' && c.urgency === 'high').length
  const bsMedCount = RECOMMENDATION_CARDS.filter(c => c.zone === 'blind-spot' && c.urgency === 'medium').length

  // Per-channel aggregate sparkline for top 4 blind spots (7 days) with variance
  const bsRawRows = DAY_LABELS.map((day, i) => ({
    day,
    twitter:   top4BS.reduce((s, t) => s + (t.sparkline[i]?.twitter ?? 0), 0),
    facebook:  top4BS.reduce((s, t) => s + (t.sparkline[i]?.facebook ?? 0), 0),
    reddit:    top4BS.reduce((s, t) => s + (t.sparkline[i]?.reddit ?? 0), 0),
    instagram: top4BS.reduce((s, t) => s + (t.sparkline[i]?.instagram ?? 0), 0),
  }))
  const bsTw = addVariance(bsRawRows.map(r => r.twitter), 0)
  const bsFb = addVariance(bsRawRows.map(r => r.facebook), 3)
  const bsRd = addVariance(bsRawRows.map(r => r.reddit), 6)
  const bsIg = addVariance(bsRawRows.map(r => r.instagram), 9)
  const bsChannelRows = DAY_LABELS.map((day, i) => ({ day, twitter: bsTw[i], facebook: bsFb[i], reddit: bsRd[i], instagram: bsIg[i], cc: 0 }))

  // ── Emerging topic data setup ──────────────────────────────
  const emOrder = ['customer-service-issue', 'late-flight', 'cancelled-flight', 'lost-luggage']
  const sortedEmerging = emOrder
    .map(id => emergingTopics.find(t => t.id === id))
    .filter(Boolean) as typeof emergingTopics

  const top3EM = sortedEmerging.slice(0, 3)

  const emRawRows = DAY_LABELS.map((day, i) => ({
    day,
    twitter:   sortedEmerging.reduce((s, t) => s + (t.sparkline[i]?.twitter ?? 0), 0),
    facebook:  sortedEmerging.reduce((s, t) => s + (t.sparkline[i]?.facebook ?? 0), 0),
    reddit:    sortedEmerging.reduce((s, t) => s + (t.sparkline[i]?.reddit ?? 0), 0),
    instagram: sortedEmerging.reduce((s, t) => s + (t.sparkline[i]?.instagram ?? 0), 0),
  }))
  const emTw = addVariance(emRawRows.map(r => r.twitter), 2)
  const emFb = addVariance(emRawRows.map(r => r.facebook), 5)
  const emRd = addVariance(emRawRows.map(r => r.reddit), 8)
  const emIg = addVariance(emRawRows.map(r => r.instagram), 11)

  const emCCRaw = DAY_LABELS.map((_, i) =>
    sortedEmerging.reduce((s, t) => s + (t.sparkline[i]?.cc ?? 0), 0)
  )
  const emCCVaried = addVariance(emCCRaw, 14)
  const emCCSparkline = emCCVaried

  const emChannelRows = DAY_LABELS.map((day, i) => ({ day, twitter: emTw[i], facebook: emFb[i], reddit: emRd[i], instagram: emIg[i], cc: emCCVaried[i] }))

  // ── Month-expanded rows (30 days) ──────────────────────────
  const bsMTw = expandToMonth(bsRawRows.map(r => r.twitter), 0)
  const bsMFb = expandToMonth(bsRawRows.map(r => r.facebook), 3)
  const bsMRd = expandToMonth(bsRawRows.map(r => r.reddit), 6)
  const bsMIg = expandToMonth(bsRawRows.map(r => r.instagram), 9)
  const bsMonthRows = MONTH_LABELS.map((day, i) => ({ day, twitter: bsMTw[i], facebook: bsMFb[i], reddit: bsMRd[i], instagram: bsMIg[i], cc: 0 }))

  const emMTw = expandToMonth(emRawRows.map(r => r.twitter), 2)
  const emMFb = expandToMonth(emRawRows.map(r => r.facebook), 5)
  const emMRd = expandToMonth(emRawRows.map(r => r.reddit), 8)
  const emMIg = expandToMonth(emRawRows.map(r => r.instagram), 11)
  const emMCC = expandToMonth(emCCRaw, 14)
  const emMonthRows = MONTH_LABELS.map((day, i) => ({ day, twitter: emMTw[i], facebook: emMFb[i], reddit: emMRd[i], instagram: emMIg[i], cc: emMCC[i] }))

  const emCCMonthSparkline = expandToMonth(emCCSparkline)
  const bsCCMonthSparkline = expandToMonth(bsChannelRows.map(r => r.twitter + r.facebook + r.reddit + r.instagram))

  const activeBSRows     = timeRange === 'week' ? bsChannelRows : bsMonthRows
  const activeEMRows     = timeRange === 'week' ? emChannelRows : emMonthRows
  const activeEMCC       = timeRange === 'week' ? emCCSparkline : emCCMonthSparkline
  const activeBSSocial   = timeRange === 'week'
    ? bsChannelRows.map(r => r.twitter + r.facebook + r.reddit + r.instagram)
    : bsCCMonthSparkline
  const activeEMSocial   = timeRange === 'week'
    ? emChannelRows.map(r => r.twitter + r.facebook + r.reddit + r.instagram)
    : emMonthRows.map(r => r.twitter + r.facebook + r.reddit + r.instagram)
  const activeStartLabel = timeRange === 'week' ? DAY_LABELS[0] : MONTH_LABELS[0]
  const activeEndLabel   = timeRange === 'week' ? DAY_LABELS[DAY_LABELS.length - 1] : MONTH_LABELS[MONTH_LABELS.length - 1]
  const activeDateLabel  = timeRange === 'week' ? 'Jun 4 – Jun 11, 2026' : 'May 13 – Jun 11, 2026'

  const emTotalCC = emergingTopics.reduce((s, t) => s + t.ccVolume, 0)
  const emTotalSocial = emergingTopics.reduce((s, t) => s + t.socialVolume, 0)
  const emAvgSentiment = emergingTopics.reduce((s, t) => s + t.sentiment.social, 0) / emergingTopics.length
  const emTopScore = Math.max(...RECOMMENDATION_CARDS.filter(c => c.zone === 'emerging').map(c => c.score))

  // Sentiment distribution — realistic mock split based on zone characteristics
  // Blind spots skew strongly negative (hidden pain points); emerging topics are mixed
  const bsNegPct = 70; const bsNeutPct = 20; const bsPosPct = 10
  const emNegPct = 52; const emNeutPct = 30; const emPosPct = 18

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      {/* Header strip */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Delta Air Lines</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Tab toggle */}
          <div style={{
            display: 'flex', background: '#f1f5f9', borderRadius: 8,
            padding: 3, gap: 2,
          }}>
            {(['week', 'month'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                style={{
                  padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600,
                  background: timeRange === t ? '#fff' : 'transparent',
                  color: timeRange === t ? '#0f172a' : '#64748b',
                  boxShadow: timeRange === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {t === 'week' ? 'Week' : 'Month'}
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Date range</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{activeDateLabel}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* ═══════════════════════════════════════════════════
            SECTION 1 — BLIND SPOTS
        ═══════════════════════════════════════════════════ */}
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🔍</span> Open Market Signals
            <span style={{
              background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5',
              borderRadius: 9999, padding: '1px 10px', fontSize: 12, fontWeight: 600,
            }}>
              {bsHighCount} high urgency
            </span>
          </div>

          {/* Row 1: list card + stat tiles */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            {/* LEFT — topic list */}
            <div style={{
              width: '35%',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#991b1b' }}>
                Open Market Signals — {bsHighCount} high urgency
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 4, borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Topic</span>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Urgency Score</span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {top4BS.map(topic => {
                  const card = getCardByTopicId(topic.id)
                  const urgency = card?.urgency ?? 'medium'
                  return (
                    <li key={topic.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: urgencyColor(urgency), flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#1e293b', lineHeight: '18px', flex: 1 }}>{topic.name}</span>
                      {card && (
                        <span style={{
                          fontSize: 11, fontWeight: 700, flexShrink: 0,
                          background: urgencyBg(urgency), color: urgencyColor(urgency),
                          border: `1px solid ${urgencyBorder(urgency)}`,
                          borderRadius: 9999, padding: '1px 7px',
                        }}>{card.score}</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* RIGHT — stat tiles */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <SocialMentionsTile
                value={bsTotalSocial.toLocaleString()}
                sparklineData={activeBSSocial}
                sparklineColor="#dc2626"
              />
              <SentimentBreakdownTile negPct={bsNegPct} neutPct={bsNeutPct} posPct={bsPosPct} />
            </div>
          </div>

          {/* Row 2: AI recommendation cards */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              AI Recommendations
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {top4BS.map(topic => {
                const card = getCardByTopicId(topic.id)
                if (!card) return null
                return (
                  <RecommendationCardItem
                    key={topic.id}
                    topicId={topic.id}
                    topicName={topic.name}
                    urgency={card.urgency}
                    whyMissing={card.whyMissing}
                    onAction={() => onOpenRecommendation(topic.id)}
                  />
                )
              })}
            </div>
          </div>

          {/* Row 3: Per-channel trend cards (2×2 grid) */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Social Volume Trends by Channel — Open Market Signals
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              {CHANNEL_CONFIG.map(ch => (
                <SingleChannelSparkline
                  key={ch.key}
                  rows={activeBSRows}
                  channelKey={ch.key}
                  color={ch.color}
                  label={ch.label}
                  startLabel={activeStartLabel}
                  endLabel={activeEndLabel}
                />
              ))}
            </div>
          </div>
        </div>

        <SectionDivider label="Emerging Topics" />

        {/* ═══════════════════════════════════════════════════
            SECTION 2 — EMERGING TOPICS
        ═══════════════════════════════════════════════════ */}
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>📈</span> Emerging Topics
            <span style={{
              background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa',
              borderRadius: 9999, padding: '1px 10px', fontSize: 12, fontWeight: 600,
            }}>
              {emergingTopics.length} confirmed
            </span>
          </div>

          {/* Row 1: list card + stat tiles */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            {/* LEFT — topic list */}
            <div style={{
              width: '35%',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#c2410c' }}>
                Emerging Topics — {emergingTopics.length} confirmed
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 4, borderBottom: '1px solid #fed7aa' }}>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Topic</span>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Urgency Score</span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sortedEmerging.map(topic => {
                  const card = getCardByTopicId(topic.id)
                  const urgency = card?.urgency ?? 'medium'
                  return (
                    <li key={topic.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: urgencyColor(urgency), flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#1e293b', lineHeight: '18px', flex: 1 }}>{topic.name}</span>
                      {card && (
                        <span style={{
                          fontSize: 11, fontWeight: 700, flexShrink: 0,
                          background: urgencyBg(urgency), color: urgencyColor(urgency),
                          border: `1px solid ${urgencyBorder(urgency)}`,
                          borderRadius: 9999, padding: '1px 7px',
                        }}>{card.score}</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* RIGHT — stat tiles (single row) */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <StatTile
                label="CC Mentions"
                value={emTotalCC.toLocaleString()}
                chip="↗ contact center"
                chipColor="#1e40af"
                chipBg="#eff6ff"
                sparklineData={activeEMCC}
                sparklineColor="#1e40af"
              />
              <SocialMentionsTile
                value={emTotalSocial.toLocaleString()}
                sparklineData={activeEMSocial}
                sparklineColor="#7c3aed"
              />
              <SentimentBreakdownTile negPct={emNegPct} neutPct={emNeutPct} posPct={emPosPct} />
            </div>
          </div>

          {/* Row 2: AI recommendation cards */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              AI Recommendations
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {sortedEmerging.map(topic => {
                const card = getCardByTopicId(topic.id)
                if (!card) return null
                return (
                  <RecommendationCardItem
                    key={topic.id}
                    topicId={topic.id}
                    topicName={topic.name}
                    urgency={card.urgency}
                    whyMissing={card.rootCause}
                    onAction={() => onOpenRecommendation(topic.id)}
                  />
                )
              })}
            </div>
          </div>

          {/* Row 3: Per-channel trend cards (CC + 4 social) */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Volume Trends by Channel — Emerging Topics
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 12 }}>
              <SingleChannelSparkline
                key="cc"
                rows={activeEMRows}
                channelKey="cc"
                color="#1d4ed8"
                label="Contact Center"
                startLabel={activeStartLabel}
                endLabel={activeEndLabel}
              />
              {CHANNEL_CONFIG.map(ch => (
                <SingleChannelSparkline
                  key={ch.key}
                  rows={activeEMRows}
                  channelKey={ch.key}
                  color={ch.color}
                  label={ch.label}
                  startLabel={activeStartLabel}
                  endLabel={activeEndLabel}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
