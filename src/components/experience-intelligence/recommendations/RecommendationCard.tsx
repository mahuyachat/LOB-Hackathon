import { useState } from 'react'
import { CheckCircle, X, AlertTriangle } from 'lucide-react'
import type { RecommendationCard as CardType } from '@/data/eiMockData'
import { ZoneBadge } from '../shared/ZoneBadge'

interface Props {
  card: CardType
  status: 'pending' | 'approved' | 'dismissed'
  onApprove: (cardId: string) => void
  onDismiss: (cardId: string) => void
}

export function RecommendationCard({ card, status, onApprove, onDismiss }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  const urgencyColors = {
    high:   { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', dot: '#ef4444' },
    medium: { bg: '#fffbeb', text: '#92400e', border: '#fde68a', dot: '#f59e0b' },
    low:    { bg: '#f0fdf4', text: '#14532d', border: '#bbf7d0', dot: '#22c55e' },
  }
  const uc = urgencyColors[card.urgency]

  const isDismissed = status === 'dismissed'
  const isApproved  = status === 'approved'

  return (
    <>
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        overflow: 'hidden',
        opacity: isDismissed ? 0.5 : 1,
        transition: 'opacity 0.3s',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Top accent bar */}
        <div style={{
          height: 3,
          background: isDismissed ? '#e2e8f0' : isApproved ? '#22c55e'
            : card.urgency === 'high' ? '#ef4444'
            : card.urgency === 'medium' ? '#f59e0b' : '#94a3b8',
        }} />

        <div style={{ padding: '16px 20px', flex: 1 }}>
          {/* Header — badges + title */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                <ZoneBadge zone="blind-spot" size="xs" />
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                  background: uc.bg, color: uc.text, border: `1px solid ${uc.border}`,
                  borderRadius: 9999, padding: '2px 7px',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: uc.dot, flexShrink: 0, display: 'inline-block' }} />
                  {card.urgency.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                {card.headline}
              </div>
            </div>
            {isApproved && <CheckCircle size={20} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />}
          </div>

          {/* Trend label */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontWeight: 600,
            color: card.trendLabel.startsWith('+') ? '#b91c1c' : '#16a34a',
            marginBottom: 14,
          }}>
            <AlertTriangle size={12} />
            {card.trendLabel}
          </div>

          {/* Why you're missing it */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: 4 }}>
              Why you're missing it
            </div>
            <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: 0 }}>
              {card.whyMissing}
            </p>
          </div>

          {/* Root cause — amber panel */}
          <div style={{
            background: '#fffbeb', border: '1px solid #fde68a', borderLeft: '3px solid #f59e0b',
            borderRadius: 6, padding: '10px 12px', marginBottom: 10,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#92400e', marginBottom: 4 }}>
              Root Cause
            </div>
            <p style={{ fontSize: 13, color: '#78350f', lineHeight: 1.55, margin: 0 }}>
              {card.rootCause}
            </p>
          </div>

          {/* Recommended action — indigo panel */}
          <div style={{
            background: '#eef2ff', border: '1px solid #c7d2fe', borderLeft: '3px solid #6366f1',
            borderRadius: 6, padding: '10px 12px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338ca', marginBottom: 4 }}>
              Recommended Action
            </div>
            <p style={{ fontSize: 13, color: '#312e81', lineHeight: 1.55, margin: 0 }}>
              {card.recommendedAction}
            </p>
            <div style={{ marginTop: 8, fontSize: 11, color: '#6366f1', fontWeight: 600 }}>
              → {card.department}
            </div>
          </div>

          {/* Approved notice */}
          {isApproved && (
            <div style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8,
              padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 12, color: '#15803d', fontWeight: 500, marginTop: 12,
            }}>
              <CheckCircle size={14} />
              Approved · Action sent to CXone
              {card.approvedAt && <span style={{ color: '#94a3b8', marginLeft: 'auto', fontWeight: 400 }}>{card.approvedAt}</span>}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!isApproved && !isDismissed && (
          <div style={{ display: 'flex', gap: 10, padding: '12px 20px', borderTop: '1px solid #f1f5f9' }}>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                flex: 1, padding: '9px 0', background: '#1d4ed8', color: '#fff',
                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#1e40af')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#1d4ed8')}
            >
              {card.actionLabel}
            </button>
            <button
              onClick={() => onDismiss(card.id)}
              style={{
                padding: '9px 16px', background: '#fff', color: '#64748b',
                border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, cursor: 'pointer',
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {isDismissed && (
          <div style={{ padding: '10px 20px', borderTop: '1px solid #f1f5f9', fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
            Dismissed
          </div>
        )}

        {isApproved && (
          <div style={{ padding: '10px 20px', borderTop: '1px solid #f1f5f9' }}>
            <button style={{
              background: 'none', border: '1px solid #e2e8f0', borderRadius: 8,
              padding: '7px 14px', fontSize: 12, color: '#1d4ed8', cursor: 'pointer', fontWeight: 600,
            }}>
              View in CXone →
            </button>
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 16, padding: 28,
              maxWidth: 460, width: '90%', boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
              Confirm action: {card.actionLabel}?
            </div>
            <div style={{
              background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10,
              padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#334155', lineHeight: 1.6,
            }}>
              {card.actionDetail}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { onApprove(card.id); setModalOpen(false) }}
                style={{
                  flex: 1, padding: '10px 0', background: '#1d4ed8', color: '#fff',
                  border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}
              >
                Confirm & Approve
              </button>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  padding: '10px 18px', background: '#fff', color: '#64748b',
                  border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
