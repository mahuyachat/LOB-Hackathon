import { useState, useReducer, useCallback } from 'react'
import { BRAND_CONFIG, RECOMMENDATION_CARDS, blindSpotTopics } from '@/data/eiMockData'
import { EISidebar, type EIPage } from '@/components/experience-intelligence/EISidebar'
import { EIDashboard } from '@/components/experience-intelligence/dashboard/EIDashboard'
import { RecommendationsPage } from '@/components/experience-intelligence/recommendations/RecommendationsPage'
import { SingleRecommendationView } from '@/components/experience-intelligence/recommendations/SingleRecommendationView'
import { TopicDrilldown } from '@/components/experience-intelligence/drilldown/TopicDrilldown'

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
    return !card || cardState.statuses[card.id] === 'pending'
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
        />
      ) : page === 'recommendations' ? (
        <RecommendationsPage
          cardStatuses={cardState.statuses}
          approvedAt={cardState.approvedAt}
          onApprove={handleApprove}
          onDismiss={handleDismiss}
        />
      ) : (
        <DataSourcesPage onReset={() => dispatch({ type: 'RESET' })} />
      )}
    </div>
  )
}

function DataSourcesPage({ onReset }: { onReset: () => void }) {
  const lastRefreshed = new Date(BRAND_CONFIG.lastRefreshed)
  const nextRefresh = new Date(BRAND_CONFIG.nextRefresh)
  const fmt = (d: Date) => d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 32px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#f97316', marginBottom: 4 }}>
          ✦ Experience Intelligence
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>Data Sources</h1>
        <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
          Which brand is being monitored, where the data comes from, and the refresh schedule.
        </p>
      </div>

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
        {/* Monitored brand */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Monitored Brand</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
            The brand whose contact-center interactions and social posts are being compared.
          </div>
          {[
            ['Brand', BRAND_CONFIG.name],
            ['Industry', BRAND_CONFIG.industry],
            ['Ontology topics', String(BRAND_CONFIG.ontologyTopics) + ' topics tracked'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Social data source */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Social Media Source</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
            Public social posts ingested via data partner. New topics and sentiment are recalculated on each refresh.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>{BRAND_CONFIG.dataPartner}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{BRAND_CONFIG.socialSources.join(', ')}</div>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0',
              borderRadius: 9999, padding: '4px 12px', fontSize: 12, fontWeight: 600,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
              Connected ✓
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
            <div>Last ingestion: <strong style={{ color: '#334155' }}>{fmt(lastRefreshed)}</strong></div>
            <div>Next scheduled: <strong style={{ color: '#334155' }}>{fmt(nextRefresh)}</strong></div>
          </div>
        </div>

        {/* Demo reset */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Reset Demo</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
            Restore all recommendation cards to their initial pending state. Use this to restart the demo flow.
          </div>
          <button
            onClick={onReset}
            style={{
              padding: '9px 20px', background: '#fff', color: '#334155',
              border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = '#94a3b8')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0')}
          >
            Reset to Demo State
          </button>
        </div>
      </div>
    </div>
  )
}
