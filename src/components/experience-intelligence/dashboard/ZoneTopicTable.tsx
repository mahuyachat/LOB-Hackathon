import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, Headphones, ChevronRight, AlertTriangle, Shield } from 'lucide-react'
import {
  blindSpotTopics, privateSignalTopics, emergingTopics,
  getCardByTopicId, type Topic, type Zone, type RecommendationCard,
} from '@/data/eiMockData'
import { ZONE_COLORS, ZONE_TOOLTIPS, ZoneIcon } from '../shared/ZoneBadge'
import { SentimentPill, SentimentLegend } from '../shared/SentimentPill'

interface Props {
  zone: Zone
  onTopicClick: (topicId: string) => void
  onOpenRecommendation: (topicId: string) => void
}

const ZONE_META: Record<Zone, { title: string; desc: string }> = {
  'blind-spot': {
    title: 'Blind Spots',
    desc: 'Topics customers discuss publicly but not with your agents — each has an AI recommendation.',
  },
  'private-signal': {
    title: 'Under-the-Radar Topics',
    desc: 'Topics customers raise with your agents but that haven\'t surfaced publicly yet — your early-warning advantage.',
  },
  'emerging': {
    title: 'Emerging Topics',
    desc: 'Confirmed in both contact center and social — your highest-confidence priorities.',
  },
}

const URGENCY_STYLE: Record<RecommendationCard['urgency'], { bg: string; text: string; dot: string }> = {
  high: { bg: '#fef2f2', text: '#b91c1c', dot: '#ef4444' },
  medium: { bg: '#fffbeb', text: '#92400e', dot: '#f59e0b' },
  low: { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e' },
}

function rowsForZone(zone: Zone): Topic[] {
  if (zone === 'blind-spot') return blindSpotTopics
  if (zone === 'private-signal') return privateSignalTopics
  return emergingTopics
}

function ZoneMarker({ zone }: { zone: Zone }) {
  const [hover, setHover] = useState(false)
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ZoneIcon zone={zone} size={15} />
      {hover && (
        <span style={{
          position: 'absolute', bottom: '100%', left: 0, marginBottom: 6,
          background: '#1e293b', color: '#fff', fontSize: 12, borderRadius: 8,
          padding: '6px 10px', width: 230, zIndex: 50, pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)', lineHeight: 1.5, fontWeight: 400,
        }}>
          {ZONE_TOOLTIPS[zone]}
        </span>
      )}
    </span>
  )
}

function TrendChip({ trend, pct }: { trend: Topic['trend']; pct: number }) {
  if (trend === 'up') return (
    <span style={{ color: '#16a34a', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      <TrendingUp size={12} />+{pct}%
    </span>
  )
  if (trend === 'down') return (
    <span style={{ color: '#b91c1c', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      <TrendingDown size={12} />{pct}%
    </span>
  )
  return <span style={{ color: '#94a3b8', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 2 }}><Minus size={12} />Stable</span>
}

function ChannelCell({ volume, sentiment }: { volume: number; sentiment: number }) {
  const hasData = volume > 0
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: hasData ? '#0f172a' : '#cbd5e1', fontVariantNumeric: 'tabular-nums' }}>
        {hasData ? volume.toLocaleString() : '—'}
      </span>
      <SentimentPill score={sentiment} hasData={hasData} size="sm" />
    </div>
  )
}

function UrgencyBadge({ urgency }: { urgency: RecommendationCard['urgency'] }) {
  const s = URGENCY_STYLE[urgency]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
      background: s.bg, color: s.text, borderRadius: 9999, padding: '3px 9px',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
      {urgency}
    </span>
  )
}

export function ZoneTopicTable({ zone, onTopicClick, onOpenRecommendation }: Props) {
  const rows = rowsForZone(zone)
  const meta = ZONE_META[zone]

  const th: React.CSSProperties = {
    textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b',
    borderBottom: '1px solid #e2e8f0', background: '#f8fafc',
  }

  const ccHeader = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Headphones size={13} /> Contact Center
    </span>
  )
  const socialHeader = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 14 }}>𝕏</span> Social Media
    </span>
  )

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>{meta.title}</h2>
        <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{meta.desc}</p>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Topic</th>
              {zone === 'blind-spot' && <th style={th}>{socialHeader}</th>}
              {zone === 'private-signal' && <th style={th}>{ccHeader}</th>}
              {zone === 'emerging' && <th style={th}>{ccHeader}</th>}
              {zone === 'emerging' && <th style={th}>{socialHeader}</th>}
              <th style={th}>Trend</th>
              {zone === 'blind-spot' && <th style={th}>Urgency</th>}
              {zone === 'blind-spot' && <th style={{ ...th, textAlign: 'right' }}>Action</th>}
              {zone !== 'blind-spot' && <th style={{ ...th, width: 40 }} />}
            </tr>
          </thead>
          <tbody>
            {rows.map((topic, i) => {
              const card = zone === 'blind-spot' ? getCardByTopicId(topic.id) : undefined
              return (
                <tr
                  key={topic.id}
                  onClick={() => onTopicClick(topic.id)}
                  style={{
                    cursor: 'pointer',
                    borderBottom: i === rows.length - 1 ? 'none' : '1px solid #f1f5f9',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#f8fafc')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  {/* Topic + zone */}
                  <td style={{ padding: '14px 16px', maxWidth: 300 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ZoneMarker zone={topic.zone} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{topic.name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{topic.category}</div>
                      </div>
                    </div>
                  </td>

                  {/* Channel cells — zone-aware */}
                  {zone === 'blind-spot' && (
                    <td style={{ padding: '14px 16px' }}>
                      <ChannelCell volume={topic.socialVolume} sentiment={topic.sentiment.social} />
                    </td>
                  )}
                  {zone === 'private-signal' && (
                    <td style={{ padding: '14px 16px' }}>
                      <ChannelCell volume={topic.ccVolume} sentiment={topic.sentiment.cc} />
                    </td>
                  )}
                  {zone === 'emerging' && (
                    <>
                      <td style={{ padding: '14px 16px' }}>
                        <ChannelCell volume={topic.ccVolume} sentiment={topic.sentiment.cc} />
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <ChannelCell volume={topic.socialVolume} sentiment={topic.sentiment.social} />
                      </td>
                    </>
                  )}

                  {/* Trend */}
                  <td style={{ padding: '14px 16px' }}>
                    <TrendChip trend={topic.trend} pct={topic.trendPct} />
                  </td>

                  {/* Blind spot: urgency + recommendation link */}
                  {zone === 'blind-spot' && (
                    <td style={{ padding: '14px 16px' }}>
                      {card ? <UrgencyBadge urgency={card.urgency} /> : <span style={{ color: '#cbd5e1' }}>—</span>}
                    </td>
                  )}
                  {zone === 'blind-spot' && (
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        onClick={e => { e.stopPropagation(); onOpenRecommendation(topic.id) }}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 3,
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#1d4ed8', fontSize: 12, fontWeight: 600, padding: 0, whiteSpace: 'nowrap',
                        }}
                      >
                        View recommendation <ChevronRight size={13} />
                      </button>
                    </td>
                  )}

                  {/* Non-blind-spot: drill-in chevron */}
                  {zone !== 'blind-spot' && (
                    <td style={{ padding: '14px 16px', textAlign: 'right', color: '#cbd5e1', fontSize: 16 }}>›</td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Sentiment legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, padding: '14px 2px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#64748b' }}>
          <span style={{ fontWeight: 500, color: '#94a3b8' }}>Zone:</span>
          {(['emerging', 'blind-spot', 'private-signal'] as Zone[]).map(z => (
            <span key={z} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ZoneIcon zone={z} size={12} />
              {z === 'emerging' ? 'Emerging' : z === 'blind-spot' ? 'Blind Spot' : 'Under-the-Radar'}
            </span>
          ))}
        </div>
        <span style={{ width: 1, height: 14, background: '#e2e8f0' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Sentiment:</span>
          <SentimentLegend />
        </div>
      </div>
    </div>
  )
}
