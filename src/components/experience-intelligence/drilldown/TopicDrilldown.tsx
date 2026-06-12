import { useState } from 'react'
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import { getTopicById, getCardByTopicId } from '@/data/eiMockData'
import { ZoneBadge } from '../shared/ZoneBadge'
import { SentimentPill } from '../shared/SentimentPill'
import { RecommendationCard } from '../recommendations/RecommendationCard'

interface Props {
  topicId: string
  cardStatuses: Record<string, 'pending' | 'approved' | 'dismissed'>
  approvedAt: Record<string, string>
  onBack: () => void
  onApprove: (cardId: string) => void
  onDismiss: (cardId: string) => void
}

type SparkPoint = { day: string; cc: number; social: number }

function SparklineChart({ data, showCc, showSocial }: { data: SparkPoint[]; showCc: boolean; showSocial: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const W = 600; const H = 160
  const pad = { top: 12, right: 16, bottom: 28, left: 40 }
  const cw = W - pad.left - pad.right
  const ch = H - pad.top - pad.bottom

  const allVals = data.flatMap(d => [showCc ? d.cc : 0, showSocial ? d.social : 0]).filter(v => v > 0)
  const minV = Math.max(0, Math.min(...allVals) * 0.85)
  const maxV = Math.max(...allVals) * 1.1 || 1
  const range = maxV - minV || 1

  const xs = (i: number) => pad.left + (i / (data.length - 1)) * cw
  const ys = (v: number) => pad.top + ch - ((v - minV) / range) * ch

  const makePath = (key: 'cc' | 'social') =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(d[key])}`).join(' ')

  const yTicks = [minV, (minV + maxV) / 2, maxV].map(Math.round)

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}
        onMouseLeave={() => setHovered(null)}>
        {/* Grid lines */}
        {yTicks.map(t => (
          <g key={t}>
            <line x1={pad.left} y1={ys(t)} x2={W - pad.right} y2={ys(t)}
              stroke="#f1f5f9" strokeDasharray="3 4" strokeWidth={1} />
            <text x={pad.left - 6} y={ys(t) + 4} textAnchor="end" fill="#94a3b8" fontSize={9}>
              {t >= 1000 ? `${(t / 1000).toFixed(1)}k` : t}
            </text>
          </g>
        ))}
        {/* X labels */}
        {data.map((d, i) => (
          <text key={i} x={xs(i)} y={H - 8} textAnchor="middle" fill="#94a3b8" fontSize={10}>
            {d.day}
          </text>
        ))}
        {/* Contact Center line */}
        {showCc && (
          <path d={makePath('cc')} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinecap="round" />
        )}
        {/* Social line */}
        {showSocial && (
          <path d={makePath('social')} fill="none" stroke="#f97316" strokeWidth={2} strokeLinecap="round" />
        )}
        {/* Hover dots */}
        {showCc && hovered !== null && (
          <circle cx={xs(hovered)} cy={ys(data[hovered].cc)} r={4} fill="#3b82f6" />
        )}
        {showSocial && hovered !== null && (
          <circle cx={xs(hovered)} cy={ys(data[hovered].social)} r={4} fill="#f97316" />
        )}
        {/* Hover hitboxes */}
        {data.map((_, i) => (
          <rect key={i} x={xs(i) - cw / (2 * (data.length - 1))} y={pad.top}
            width={cw / (data.length - 1)} height={ch}
            fill="transparent" onMouseEnter={() => setHovered(i)} />
        ))}
      </svg>
      {/* Tooltip */}
      {hovered !== null && (
        <div style={{
          position: 'absolute', top: 0, left: `${(xs(hovered) / W) * 100}%`,
          transform: 'translate(-50%, 8px)',
          background: '#1e293b', color: '#fff', borderRadius: 8,
          padding: '6px 10px', fontSize: 11, pointerEvents: 'none', whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>
          <div style={{ fontWeight: 600, marginBottom: 3 }}>{data[hovered].day}</div>
          {showCc && <div style={{ color: '#93c5fd' }}>Contact Center: {data[hovered].cc.toLocaleString()}</div>}
          {showSocial && <div style={{ color: '#fdba74' }}>Social: {data[hovered].social.toLocaleString()}</div>}
        </div>
      )}
      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 8, fontSize: 12, color: '#64748b' }}>
        {showCc && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 16, height: 2, background: '#3b82f6', display: 'inline-block', borderRadius: 1 }} />
          Contact Center
        </span>}
        {showSocial && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 16, height: 2, background: '#f97316', display: 'inline-block', borderRadius: 1 }} />
          Social (X/Twitter)
        </span>}
      </div>
    </div>
  )
}

function SentimentBar({ cc, social, ccHasData, socialHasData }: { cc: number; social: number; ccHasData: boolean; socialHasData: boolean }) {
  // bar goes from -1 to +1; 0 is center
  const toPercent = (v: number) => ((v + 1) / 2) * 100
  const ccPct = toPercent(cc)
  const socialPct = toPercent(social)

  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 12 }}>
        Sentiment Comparison
      </div>

      {/* Sentiment pills — explicit band per channel */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Contact Center</span>
          <SentimentPill score={cc} hasData={ccHasData} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Social Media</span>
          <SentimentPill score={social} hasData={socialHasData} />
        </div>
      </div>

      {/* Position bar */}
      <div style={{ position: 'relative', height: 36, marginBottom: 6 }}>
        {/* Track with sentiment gradient */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: 6, borderRadius: 3, transform: 'translateY(-50%)',
          background: 'linear-gradient(90deg, #fecaca 0%, #fde68a 50%, #bbf7d0 100%)',
        }} />
        {/* Center line */}
        <div style={{
          position: 'absolute', top: '10%', bottom: '10%', left: '50%',
          width: 1, background: '#94a3b8',
        }} />
        {/* Contact Center marker */}
        {ccHasData && (
          <div
            title={`Contact Center avg: ${cc.toFixed(2)}`}
            style={{
              position: 'absolute', top: '50%', left: `${ccPct}%`,
              width: 14, height: 14, borderRadius: '50%',
              background: '#3b82f6', border: '2px solid #fff',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }}
          />
        )}
        {/* Social marker */}
        {socialHasData && (
          <div
            title={`Social Media avg: ${social.toFixed(2)}`}
            style={{
              position: 'absolute', top: '50%', left: `${socialPct}%`,
              width: 14, height: 14, borderRadius: '50%',
              background: '#f97316', border: '2px solid #fff',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }}
          />
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', marginBottom: 12 }}>
        <span>Very Negative (−1)</span>
        <span>Neutral (0)</span>
        <span>Very Positive (+1)</span>
      </div>
      <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#334155' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
          Contact Center: <strong>{ccHasData ? cc.toFixed(2) : '—'}</strong>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f97316', display: 'inline-block' }} />
          Social Media: <strong>{socialHasData ? social.toFixed(2) : '—'}</strong>
        </span>
      </div>
    </div>
  )
}

export function TopicDrilldown({ topicId, cardStatuses, approvedAt, onBack, onApprove, onDismiss }: Props) {
  const topic = getTopicById(topicId)
  if (!topic) return <div style={{ padding: 32 }}>Topic not found.</div>

  const linkedCard = getCardByTopicId(topicId)

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '14px 32px',
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748b', fontSize: 13, padding: 0, marginBottom: 10,
          }}
        >
          <ArrowLeft size={14} /> Back to Signal Intelligence
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>{topic.name}</h1>
          <ZoneBadge zone={topic.zone} size="sm" />
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 13, fontWeight: 600,
            color: topic.trend === 'up' ? '#16a34a' : topic.trend === 'down' ? '#b91c1c' : '#64748b',
          }}>
            {topic.trend === 'up' ? <TrendingUp size={14} /> : topic.trend === 'down' ? <TrendingDown size={14} /> : null}
            {topic.trend === 'up' ? `+${topic.trendPct}%` : topic.trend === 'down' ? `${topic.trendPct}%` : 'Stable'} week-over-week
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8' }}>Category: {topic.category}</span>
        </div>
      </div>

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Metrics row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 4 }}>
              Contact Center Volume (7-day)
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#1d4ed8' }}>
              {topic.ccVolume > 0 ? topic.ccVolume.toLocaleString() : '—'}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>contact center interactions</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 4 }}>
              Social Volume (7-day)
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#f97316' }}>
              {topic.socialVolume > 0 ? topic.socialVolume.toLocaleString() : '—'}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>X / Twitter mentions</div>
          </div>
        </div>

        {/* Sparkline — pure SVG, no recharts */}
        {topic.sparkline.some(d => d.cc > 0 || d.social > 0) && (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>7-day Volume Trend</div>
            <SparklineChart data={topic.sparkline} showCc={topic.ccVolume > 0} showSocial={topic.socialVolume > 0} />
          </div>
        )}

        {/* Sentiment bar */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px' }}>
          <SentimentBar
            cc={topic.sentiment.cc}
            social={topic.sentiment.social}
            ccHasData={topic.ccVolume > 0}
            socialHasData={topic.socialVolume > 0}
          />
        </div>

        {/* Verbatims */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Sample Verbatims</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Contact Center */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                🎙 Contact Center
              </div>
              {topic.verbatims.cc.length > 0 ? topic.verbatims.cc.map((v, i) => (
                <div key={i} style={{
                  background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8,
                  padding: '12px 14px', marginBottom: 10, fontSize: 13, color: '#334155', lineHeight: 1.5,
                }}>
                  <p style={{ margin: '0 0 6px' }}>"{v.text}"</p>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{v.date}</span>
                </div>
              )) : (
                <div style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>
                  No contact center mentions for this topic.
                </div>
              )}
            </div>
            {/* Social */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                𝕏 Social Posts
              </div>
              {topic.verbatims.social.length > 0 ? topic.verbatims.social.map((v, i) => (
                <div key={i} style={{
                  background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8,
                  padding: '12px 14px', marginBottom: 10, fontSize: 13, color: '#334155', lineHeight: 1.5,
                }}>
                  <p style={{ margin: '0 0 6px' }}>"{v.text}"</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
                    <span>X post · {v.handle}</span>
                    <span>{v.date}</span>
                  </div>
                </div>
              )) : (
                <div style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>
                  No social mentions for this topic.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Linked recommendation card */}
        {linkedCard && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
              Linked Recommendation
            </div>
            <div style={{ maxWidth: 500 }}>
              <RecommendationCard
                card={{ ...linkedCard, approvedAt: approvedAt[linkedCard.id] }}
                status={cardStatuses[linkedCard.id] ?? 'pending'}
                onApprove={onApprove}
                onDismiss={onDismiss}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
