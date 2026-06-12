import { ArrowLeft, ChevronRight } from 'lucide-react'
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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#f97316', marginBottom: 4 }}>
              ✦ AI Recommendation
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>
              {topic?.name ?? 'Blind Spot Recommendation'}
            </h1>
          </div>
          <button
            onClick={onViewAll}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: 8, padding: '8px 14px',
              fontSize: 13, fontWeight: 600, color: '#334155',
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = '#94a3b8')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0')}
          >
            View all recommendations
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div style={{ padding: '32px', maxWidth: 560 }}>
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
          Back to Signal Intelligence
        </button>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
