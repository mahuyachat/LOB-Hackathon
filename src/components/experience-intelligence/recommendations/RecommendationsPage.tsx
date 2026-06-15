import { useState } from 'react'
import { RECOMMENDATION_CARDS, ROOT_CAUSE_CONFIG, type RootCausePattern } from '@/data/eiMockData'
import { RecommendationCard } from './RecommendationCard'
import { Toast } from '../shared/Toast'

interface Props {
  cardStatuses: Record<string, 'pending' | 'approved' | 'dismissed'>
  approvedAt: Record<string, string>
  onApprove: (cardId: string) => void
  onDismiss: (cardId: string) => void
}

type UrgencyFilter = 'all' | 'high' | 'medium' | 'low'
type StatusFilter = 'all' | 'pending' | 'approved' | 'dismissed'
type RootCauseFilter = 'all' | RootCausePattern

export function RecommendationsPage({ cardStatuses, approvedAt, onApprove, onDismiss }: Props) {
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [rootCauseFilter, setRootCauseFilter] = useState<RootCauseFilter>('all')
  const [toast, setToast] = useState<string | null>(null)

  const handleApprove = (cardId: string) => {
    onApprove(cardId)
    setToast('Action approved and sent to CXone')
  }

  const filtered = RECOMMENDATION_CARDS.filter(card => {
    const status = cardStatuses[card.id] ?? 'pending'
    if (urgencyFilter !== 'all' && card.urgency !== urgencyFilter) return false
    if (statusFilter !== 'all' && status !== statusFilter) return false
    if (rootCauseFilter !== 'all' && card.rootCausePattern !== rootCauseFilter) return false
    return true
  })

  const pillStyle = (active: boolean, bg?: string, border?: string) => ({
    padding: '6px 12px',
    background: active ? (bg ?? '#1d4ed8') : '#fff',
    color: active ? (bg ? '#fff' : '#fff') : '#475569',
    border: `1px solid ${active ? (border ?? '#1d4ed8') : '#e2e8f0'}`,
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    transition: 'all 0.15s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
  })

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 32px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#f97316', marginBottom: 4 }}>
          ✦ Experience Intelligence
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>Recommendations</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          AI-generated actions for each Blind Spot topic — topics customers discuss publicly but not with your agents.
        </p>

        {/* Pattern legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
          {(Object.keys(ROOT_CAUSE_CONFIG) as RootCausePattern[]).map(pattern => {
            const rc = ROOT_CAUSE_CONFIG[pattern]
            return (
              <span key={pattern} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#64748b' }}>
                <span>{rc.icon}</span>
                <span style={{ fontWeight: 500 }}>{rc.label}</span>
              </span>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '24px 32px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500, minWidth: 90 }}>Urgency:</span>
            {(['all', 'high', 'medium', 'low'] as UrgencyFilter[]).map(v => (
              <button key={v} onClick={() => setUrgencyFilter(v)} style={pillStyle(urgencyFilter === v) as React.CSSProperties}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500, minWidth: 90 }}>Root Cause:</span>
            <button onClick={() => setRootCauseFilter('all')} style={pillStyle(rootCauseFilter === 'all') as React.CSSProperties}>
              All patterns
            </button>
            {(Object.keys(ROOT_CAUSE_CONFIG) as RootCausePattern[]).map(pattern => {
              const rc = ROOT_CAUSE_CONFIG[pattern]
              const active = rootCauseFilter === pattern
              return (
                <button
                  key={pattern}
                  onClick={() => setRootCauseFilter(pattern)}
                  style={{
                    ...pillStyle(active, active ? rc.text : undefined, active ? rc.border : undefined) as React.CSSProperties,
                    background: active ? rc.bg : '#fff',
                    color: active ? rc.text : '#475569',
                    border: `1px solid ${active ? rc.border : '#e2e8f0'}`,
                  }}
                >
                  <span>{rc.icon}</span>
                  {rc.label}
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500, minWidth: 90 }}>Status:</span>
            {(['all', 'pending', 'approved', 'dismissed'] as StatusFilter[]).map(v => (
              <button key={v} onClick={() => setStatusFilter(v)} style={pillStyle(statusFilter === v) as React.CSSProperties}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: 14 }}>
            No cards match the current filters.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: 20 }}>
            {filtered.map(card => (
              <RecommendationCard
                key={card.id}
                card={{ ...card, approvedAt: approvedAt[card.id] }}
                status={cardStatuses[card.id] ?? 'pending'}
                onApprove={handleApprove}
                onDismiss={onDismiss}
              />
            ))}
          </div>
        )}
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
