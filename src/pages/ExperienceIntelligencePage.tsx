import { useState, useReducer, useCallback } from 'react'
import { RECOMMENDATION_CARDS, blindSpotTopics } from '@/data/eiMockData'
import { EISidebar, type EIPage } from '@/components/experience-intelligence/EISidebar'
import { EIDashboard } from '@/components/experience-intelligence/dashboard/EIDashboard'
import { RecommendationsPage } from '@/components/experience-intelligence/recommendations/RecommendationsPage'
import { SingleRecommendationView } from '@/components/experience-intelligence/recommendations/SingleRecommendationView'
import { TopicDrilldown } from '@/components/experience-intelligence/drilldown/TopicDrilldown'
import { DataSourcesView } from '@/components/experience-intelligence/DataSourcesView'

interface CardStatusState {
  statuses: Record<string, 'pending' | 'approved' | 'dismissed'>
  approvedAt: Record<string, string>
}

type CardAction =
  | { type: 'APPROVE'; cardId: string }
  | { type: 'DISMISS'; cardId: string }
  | { type: 'RESET' }

const initialCardState: CardStatusState = {
  statuses: Object.fromEntries(RECOMMENDATION_CARDS.map(c => [c.id, 'pending'])),
  approvedAt: {},
}

function cardReducer(state: CardStatusState, action: CardAction): CardStatusState {
  switch (action.type) {
    case 'APPROVE':
      return {
        statuses: { ...state.statuses, [action.cardId]: 'approved' },
        approvedAt: { ...state.approvedAt, [action.cardId]: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) },
      }
    case 'DISMISS':
      return { ...state, statuses: { ...state.statuses, [action.cardId]: 'dismissed' } }
    case 'RESET':
      return initialCardState
    default:
      return state
  }
}

interface Props {
  onBackToAdmin: () => void
}

export function ExperienceIntelligencePage({ onBackToAdmin }: Props) {
  const [page, setPage] = useState<EIPage>('dashboard')
  const [drilldownTopicId, setDrilldownTopicId] = useState<string | null>(null)
  const [focusedCardTopicId, setFocusedCardTopicId] = useState<string | null>(null)
  const [cardState, dispatch] = useReducer(cardReducer, initialCardState)

  const pendingBlindSpots = blindSpotTopics.filter(t => {
    const card = RECOMMENDATION_CARDS.find(c => c.topicId === t.id)
    return !card || (cardState.statuses[card.id] ?? 'pending') === 'pending'
  }).length

  const handleApprove = useCallback((cardId: string) => dispatch({ type: 'APPROVE', cardId }), [])
  const handleDismiss = useCallback((cardId: string) => dispatch({ type: 'DISMISS', cardId }), [])

  const handleTopicClick = (topicId: string) => {
    setDrilldownTopicId(topicId)
    setPage('dashboard')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <EISidebar
        activePage={drilldownTopicId || focusedCardTopicId ? 'dashboard' : page}
        onNavigate={(p) => { setPage(p); setDrilldownTopicId(null); setFocusedCardTopicId(null) }}
        onBackToAdmin={onBackToAdmin}
        pendingCount={pendingBlindSpots}
      />

      {drilldownTopicId ? (
        <TopicDrilldown
          topicId={drilldownTopicId}
          cardStatuses={cardState.statuses}
          approvedAt={cardState.approvedAt}
          onBack={() => setDrilldownTopicId(null)}
          onApprove={handleApprove}
          onDismiss={handleDismiss}
        />
      ) : focusedCardTopicId ? (
        <SingleRecommendationView
          topicId={focusedCardTopicId}
          cardStatuses={cardState.statuses}
          approvedAt={cardState.approvedAt}
          onBack={() => setFocusedCardTopicId(null)}
          onViewAll={() => { setFocusedCardTopicId(null); setPage('recommendations') }}
          onApprove={handleApprove}
          onDismiss={handleDismiss}
        />
      ) : page === 'dashboard' ? (
        <EIDashboard
          pendingBlindSpots={pendingBlindSpots}
          onTopicClick={handleTopicClick}
          onOpenRecommendation={(topicId) => setFocusedCardTopicId(topicId)}
          cardStatuses={cardState.statuses}
        />
      ) : page === 'recommendations' ? (
        <RecommendationsPage
          cardStatuses={cardState.statuses}
          approvedAt={cardState.approvedAt}
          onApprove={handleApprove}
          onDismiss={handleDismiss}
        />
      ) : (
        <DataSourcesView onReset={() => dispatch({ type: 'RESET' })} />
      )}
    </div>
  )
}

