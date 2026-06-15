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
}

function StatTile({ label, value, chip, chipColor, chipBg, onClick }: StatTileProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{value}</div>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: chipBg,
        color: chipColor,
        borderRadius: 9999,
        padding: '2px 8px',
        fontSize: 11,
        fontWeight: 500,
        alignSelf: 'flex-start',
      }}>
        {chip}
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

type ChannelKey = 'twitter' | 'facebook' | 'reddit' | 'instagram'

// Day labels with dates — Jun 4–10 2026
const DAY_LABELS = ['Mon Jun 4', 'Tue Jun 5', 'Wed Jun 6', 'Thu Jun 7', 'Fri Jun 8', 'Sat Jun 9', 'Sun Jun 10']

interface ChannelRow {
  day: string
  twitter: number
  facebook: number
  reddit: number
  instagram: number
}

interface SingleChannelSparklineProps {
  rows: ChannelRow[]
  channelKey: ChannelKey
  color: string
  label: string
  width?: number
  height?: number
}

function SingleChannelSparkline({ rows, channelKey, color, label, width = 200, height = 70 }: SingleChannelSparklineProps) {
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
        <span style={{ fontSize: 9, color: '#cbd5e1' }}>{DAY_LABELS[0]}</span>
        <span style={{ fontSize: 9, color: '#cbd5e1' }}>{DAY_LABELS[DAY_LABELS.length - 1]}</span>
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
  // ── Blind spot data setup ──────────────────────────────────
  const bsOrder = ['bs-1', 'bs-4', 'bs-2', 'bs-5', 'bs-3', 'bs-6']
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

  // Per-channel aggregate sparkline for top 4 blind spots (7 days)
  const bsChannelRows = DAY_LABELS.map((day, i) => ({
    day,
    twitter:   top4BS.reduce((s, t) => s + (t.sparkline[i]?.twitter ?? 0), 0),
    facebook:  top4BS.reduce((s, t) => s + (t.sparkline[i]?.facebook ?? 0), 0),
    reddit:    top4BS.reduce((s, t) => s + (t.sparkline[i]?.reddit ?? 0), 0),
    instagram: top4BS.reduce((s, t) => s + (t.sparkline[i]?.instagram ?? 0), 0),
  }))

  // ── Emerging topic data setup ──────────────────────────────
  const emOrder = ['customer-service-issue', 'late-flight', 'cancelled-flight', 'lost-luggage']
  const sortedEmerging = emOrder
    .map(id => emergingTopics.find(t => t.id === id))
    .filter(Boolean) as typeof emergingTopics

  const top3EM = sortedEmerging.slice(0, 3)

  const emChannelRows = DAY_LABELS.map((day, i) => ({
    day,
    twitter:   sortedEmerging.reduce((s, t) => s + (t.sparkline[i]?.twitter ?? 0), 0),
    facebook:  sortedEmerging.reduce((s, t) => s + (t.sparkline[i]?.facebook ?? 0), 0),
    reddit:    sortedEmerging.reduce((s, t) => s + (t.sparkline[i]?.reddit ?? 0), 0),
    instagram: sortedEmerging.reduce((s, t) => s + (t.sparkline[i]?.instagram ?? 0), 0),
  }))

  const emTotalCC = emergingTopics.reduce((s, t) => s + t.ccVolume, 0)
  const emTotalSocial = emergingTopics.reduce((s, t) => s + t.socialVolume, 0)
  const emAvgSentiment = emergingTopics.reduce((s, t) => s + t.sentiment.social, 0) / emergingTopics.length
  const emTopScore = Math.max(...RECOMMENDATION_CARDS.filter(c => c.zone === 'emerging').map(c => c.score))

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
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Date range</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Last 7 days · Jun 4 – Jun 11, 2026</div>
        </div>
      </div>

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* ═══════════════════════════════════════════════════
            SECTION 1 — BLIND SPOTS
        ═══════════════════════════════════════════════════ */}
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🔍</span> Blind Spots
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
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 12,
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#991b1b' }}>
                Blind Spots — {bsHighCount} high urgency
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {top4BS.map(topic => {
                  const card = getCardByTopicId(topic.id)
                  const urgency = card?.urgency ?? 'medium'
                  return (
                    <li key={topic.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: urgencyColor(urgency), flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#1e293b', lineHeight: '18px' }}>{topic.name}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* RIGHT — stat tiles */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <StatTile
                label="Social Mentions"
                value={bsTotalSocial.toLocaleString()}
                chip="↗ vs last week"
                chipColor="#dc2626"
                chipBg="#fee2e2"
              />
              <StatTile
                label="Avg Sentiment"
                value={`${(bsAvgSentiment * 100).toFixed(0)}%`}
                chip={sentimentLabel(bsAvgSentiment)}
                chipColor="#92400e"
                chipBg="#fef3c7"
              />
            </div>
          </div>

          {/* Row 2: AI recommendation cards */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              AI Recommendations
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {top3BS.map(topic => {
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
              Social Volume Trends by Channel — Blind Spots
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              {CHANNEL_CONFIG.map(ch => (
                <SingleChannelSparkline
                  key={ch.key}
                  rows={bsChannelRows}
                  channelKey={ch.key}
                  color={ch.color}
                  label={ch.label}
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
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              borderRadius: 12,
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#c2410c' }}>
                Emerging Topics — {emergingTopics.length} confirmed
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sortedEmerging.map(topic => {
                  const card = getCardByTopicId(topic.id)
                  const urgency = card?.urgency ?? 'medium'
                  return (
                    <li key={topic.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: urgencyColor(urgency), flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#1e293b', lineHeight: '18px' }}>{topic.name}</span>
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
              />
              <StatTile
                label="Social Mentions"
                value={emTotalSocial.toLocaleString()}
                chip="↗ social"
                chipColor="#7c3aed"
                chipBg="#f5f3ff"
              />
              <StatTile
                label="Avg Sentiment"
                value={`${(emAvgSentiment * 100).toFixed(0)}%`}
                chip={sentimentLabel(emAvgSentiment)}
                chipColor="#92400e"
                chipBg="#fef3c7"
              />
            </div>
          </div>

          {/* Row 2: AI recommendation cards */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              AI Recommendations
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {top3EM.map(topic => {
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

          {/* Row 3: Per-channel trend cards */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Social Volume Trends by Channel — Emerging Topics
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              {CHANNEL_CONFIG.map(ch => (
                <SingleChannelSparkline
                  key={ch.key}
                  rows={emChannelRows}
                  channelKey={ch.key}
                  color={ch.color}
                  label={ch.label}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
