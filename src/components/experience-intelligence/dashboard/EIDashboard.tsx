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

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
}

function SparklineSVG({ data, width = 400, height = 64, color = '#2563eb' }: SparklineProps) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pad = 4
  const w = width - pad * 2
  const h = height - pad * 2

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w
    const y = pad + h - ((v - min) / range) * h
    return `${x},${y}`
  })

  const areaPoints = [
    `${pad},${pad + h}`,
    ...points,
    `${pad + w},${pad + h}`,
  ].join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <polygon
        points={areaPoints}
        fill={color}
        fillOpacity={0.08}
      />
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map((pt, i) => {
        const [x, y] = pt.split(',').map(Number)
        return <circle key={i} cx={x} cy={y} r={3} fill={color} />
      })}
    </svg>
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

  // Aggregate sparkline for top 4 blind spots (7 days)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const bsAggSparkline = days.map((day, i) =>
    top4BS.reduce((sum, t) => sum + (t.sparkline[i]?.social ?? 0), 0)
  )

  // ── Emerging topic data setup ──────────────────────────────
  const emOrder = ['customer-service-issue', 'late-flight', 'cancelled-flight', 'lost-luggage']
  const sortedEmerging = emOrder
    .map(id => emergingTopics.find(t => t.id === id))
    .filter(Boolean) as typeof emergingTopics

  const top3EM = sortedEmerging.slice(0, 3)

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
              <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {top4BS.map(topic => {
                  const card = getCardByTopicId(topic.id)
                  const urgency = card?.urgency ?? 'medium'
                  return (
                    <li key={topic.id} style={{ fontSize: 13, color: '#1e293b', lineHeight: '18px' }}>
                      <span
                        onClick={() => onTopicClick(topic.id)}
                        style={{ cursor: 'pointer', fontWeight: 500, color: '#1e40af', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
                      >
                        {topic.name}
                      </span>
                      {' '}
                      <span style={{ fontWeight: 700, color: urgencyColor(urgency), fontSize: 12 }}>
                        {card?.score}
                      </span>
                      {' '}
                      <span style={{
                        background: urgencyBg(urgency),
                        color: urgencyColor(urgency),
                        border: `1px solid ${urgencyBorder(urgency)}`,
                        borderRadius: 9999,
                        padding: '1px 6px',
                        fontSize: 10,
                        fontWeight: 600,
                      }}>
                        {urgency.toUpperCase()}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <div style={{ marginTop: 4 }}>
                <span
                  onClick={() => onTopicClick(bsHighestScoreTopic.id)}
                  style={{ fontSize: 12, color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}
                >
                  View all →
                </span>
              </div>
            </div>

            {/* RIGHT — 2×2 stat tiles */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <StatTile
                label="Social Mentions"
                value={bsTotalSocial.toLocaleString()}
                chip="↗ mentions risk"
                chipColor="#dc2626"
                chipBg="#fee2e2"
                onClick={() => onTopicClick(bsHighestScoreTopic.id)}
              />
              <StatTile
                label="Avg Sentiment"
                value={`${(bsAvgSentiment * 100).toFixed(0)}%`}
                chip={sentimentLabel(bsAvgSentiment)}
                chipColor="#92400e"
                chipBg="#fef3c7"
              />
              <StatTile
                label="Top Urgency Score"
                value={bsTopScore}
                chip="High urgency"
                chipColor="#dc2626"
                chipBg="#fee2e2"
              />
              <StatTile
                label="Pending Actions"
                value={pendingBlindSpots}
                chip={`${pendingBlindSpots} pending`}
                chipColor="#1e40af"
                chipBg="#eff6ff"
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

          {/* Row 3: Sparkline + Donut */}
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            {/* Sparkline */}
            <div style={{
              flex: '0 0 60%',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '18px 20px',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>
                Social Volume Trend — Blind Spots (7-day)
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 12 }}>Aggregate across top 4 blind spot topics</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, width: '100%' }}>
                <SparklineSVG data={bsAggSparkline} width={420} height={72} color="#dc2626" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                {days.map(d => (
                  <span key={d} style={{ fontSize: 10, color: '#94a3b8' }}>{d}</span>
                ))}
              </div>
            </div>

            {/* Donut */}
            <div style={{
              flex: '0 0 calc(40% - 16px)',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Topics Health</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: -6 }}>By urgency level</div>
              <DonutChart
                size={120}
                segments={[
                  { label: 'High urgency', value: bsHighCount, color: '#dc2626' },
                  { label: 'Medium urgency', value: bsMedCount, color: '#d97706' },
                ]}
              />
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
              <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sortedEmerging.map(topic => {
                  const card = getCardByTopicId(topic.id)
                  const urgency = card?.urgency ?? 'medium'
                  return (
                    <li key={topic.id} style={{ fontSize: 13, color: '#1e293b', lineHeight: '18px' }}>
                      <span
                        onClick={() => onTopicClick(topic.id)}
                        style={{ cursor: 'pointer', fontWeight: 500, color: '#1e40af', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
                      >
                        {topic.name}
                      </span>
                      {' '}
                      <span style={{ fontWeight: 700, color: urgencyColor(urgency), fontSize: 12 }}>
                        {card?.score}
                      </span>
                      {' '}
                      <span style={{
                        background: urgencyBg(urgency),
                        color: urgencyColor(urgency),
                        border: `1px solid ${urgencyBorder(urgency)}`,
                        borderRadius: 9999,
                        padding: '1px 6px',
                        fontSize: 10,
                        fontWeight: 600,
                      }}>
                        {urgency.toUpperCase()}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <div style={{ marginTop: 4 }}>
                <span
                  onClick={() => onTopicClick(sortedEmerging[0]?.id ?? '')}
                  style={{ fontSize: 12, color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}
                >
                  View all →
                </span>
              </div>
            </div>

            {/* RIGHT — 2×2 stat tiles */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
              <StatTile
                label="Top Urgency Score"
                value={emTopScore}
                chip="High urgency"
                chipColor="#dc2626"
                chipBg="#fee2e2"
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
        </div>

      </div>
    </div>
  )
}
