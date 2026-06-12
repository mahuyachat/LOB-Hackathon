import { useState } from 'react'
import { SummaryTiles } from './SummaryTiles'
import { ZoneTopicTable } from './ZoneTopicTable'
import type { Zone } from '@/data/eiMockData'

interface Props {
  pendingBlindSpots: number
  onTopicClick: (topicId: string) => void
  onOpenRecommendation: (topicId: string) => void
}

export function EIDashboard({ pendingBlindSpots, onTopicClick, onOpenRecommendation }: Props) {
  const [selectedZone, setSelectedZone] = useState<Zone>('blind-spot')

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc' }}>
      {/* TopBar strip */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#f97316', marginBottom: 2 }}>
            ✦ Experience Intelligence
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Delta Air Lines</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Date range</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Last 7 days · Jun 4 – Jun 11, 2026</div>
        </div>
      </div>

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <SummaryTiles
          pendingBlindSpots={pendingBlindSpots}
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
        />
        <ZoneTopicTable
          zone={selectedZone}
          onTopicClick={onTopicClick}
          onOpenRecommendation={onOpenRecommendation}
        />
      </div>
    </div>
  )
}
