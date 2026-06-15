import { ArrowLeft, TrendingUp, ExternalLink, ChevronRight } from 'lucide-react'
import { RECOMMENDATION_CARDS, getTopicById } from '@/data/eiMockData'
import { RecommendationCard } from './RecommendationCard'
import { Toast } from '../shared/Toast'
import { useState } from 'react'

interface Props {
  topicId: string
  cardStatuses: Record<string, 'pending' | 'approved' | 'dismissed'>
  approvedAt: Record<string, string>
  onBack: () => void
  onViewAll: () => void
  onApprove: (cardId: string) => void
  onDismiss: (cardId: string) => void
}

export function SingleRecommendationView({
  topicId,
  cardStatuses,
  approvedAt,
  onBack,
  onViewAll,
  onApprove,
  onDismiss,
}: Props) {
  const [toast, setToast] = useState<string | null>(null)
  const card = RECOMMENDATION_CARDS.find(c => c.topicId === topicId)
  const topic = getTopicById(topicId)

  const handleApprove = (cardId: string) => {
    onApprove(cardId)
    setToast('Action approved and sent to CXone')
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '14px 32px',
      }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', marginBottom: 10 }}>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 12, fontWeight: 500, padding: 0 }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#0f172a')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#64748b')}
          >
            Customer Signal Intelligence
          </button>
          <ChevronRight size={12} />
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 12, fontWeight: 500, padding: 0 }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#0f172a')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#64748b')}
          >
            Blind Spots
          </button>
          <ChevronRight size={12} />
          <span style={{ color: '#0f172a', fontWeight: 500 }}>{topic?.name ?? 'Recommendation'}</span>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#f97316', marginBottom: 4 }}>
            ✦ AI Recommendation
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>
            {topic?.name ?? 'Blind Spot Recommendation'}
          </h1>
        </div>
      </div>

      <div style={{ padding: '28px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── LEFT: Recommendation card ── */}
        <div>
          {card ? (
            <RecommendationCard
              card={{ ...card, approvedAt: approvedAt[card.id] }}
              status={cardStatuses[card.id] ?? 'pending'}
              onApprove={handleApprove}
              onDismiss={onDismiss}
            />
          ) : (
            <div style={{
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
              padding: '40px 24px', textAlign: 'center', color: '#94a3b8', fontSize: 14,
            }}>
              No recommendation found for this topic.
            </div>
          )}

          <button
            onClick={onBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginTop: 20, background: 'none', border: 'none',
              cursor: 'pointer', color: '#64748b', fontSize: 13, fontWeight: 500, padding: 0,
            }}
          >
            <ArrowLeft size={14} />
            Back to Social Intelligence Monitoring
          </button>
        </div>

        {/* ── RIGHT: Supporting evidence ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Stats strip */}
          {topic && card && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { label: 'Social Mentions', value: topic.socialVolume.toLocaleString(), sub: 'Last 7 days', color: '#f97316' },
                { label: 'Urgency Score', value: card.score, sub: card.urgency.toUpperCase(), color: card.urgency === 'high' ? '#dc2626' : card.urgency === 'medium' ? '#d97706' : '#16a34a' },
                { label: 'Weekly Trend', value: `+${topic.trendPct}%`, sub: 'vs prior week', color: '#dc2626' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          )}

          {/* Social verbatims */}
          {topic && topic.verbatims.social.length > 0 && (() => {
            const PLATFORM_CONFIG = {
              twitter:   { label: 'X / Twitter', color: '#0f172a', bg: '#f1f5f9' },
              facebook:  { label: 'Facebook',    color: '#1877f2', bg: '#eff6ff' },
              reddit:    { label: 'Reddit',       color: '#ff4500', bg: '#fff7ed' },
              instagram: { label: 'Instagram',    color: '#e1306c', bg: '#fdf2f8' },
            }
            return (
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Recent Social Media Posts</span>
                  <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>driving this signal</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {topic.verbatims.social.map((v, i) => {
                    const pc = PLATFORM_CONFIG[v.platform]
                    return (
                      <div key={i} style={{
                        padding: '12px 18px',
                        borderBottom: i < topic.verbatims.social.length - 1 ? '1px solid #f8fafc' : 'none',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                            background: pc.bg, color: pc.color, borderRadius: 4, padding: '2px 6px',
                            flexShrink: 0,
                          }}>
                            {pc.label}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#334155', flexShrink: 0 }}>{v.handle}</span>
                          <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 'auto', flexShrink: 0 }}>{v.date}</span>
                        </div>
                        <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.55, margin: 0 }}>{v.text}</p>
                      </div>
                    )
                  })}
                </div>
                <div style={{ padding: '12px 18px', borderTop: '1px solid #f1f5f9' }}>
                  <a
                    href="#"
                    onClick={e => e.preventDefault()}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}
                  >
                    View all {topic.verbatims.social.length}+ posts <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )
          })()}

          {/* CC verbatims (if any) */}
          {topic && topic.verbatims.cc.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={14} color="#1d4ed8" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Contact Center Verbatims</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {topic.verbatims.cc.map((v, i) => (
                  <div key={i} style={{
                    padding: '14px 18px',
                    borderBottom: i < topic.verbatims.cc.length - 1 ? '1px solid #f8fafc' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Agent transcript</span>
                      <span style={{ fontSize: 11, color: '#cbd5e1', marginLeft: 'auto' }}>{v.date}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.55, margin: 0 }}>{v.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
