import { BRAND_CONFIG, emergingTopics, blindSpotTopics, privateSignalTopics, type Zone } from '@/data/eiMockData'

interface Props {
  pendingBlindSpots: number
  selectedZone: Zone
  onSelectZone: (zone: Zone) => void
}

type Tile = {
  zone: Zone | null
  label: string
  value: number | null
  total: number | null
  desc: string
  bg: string
  border: string
  text: string
  badge: string | null
}

export function SummaryTiles({ pendingBlindSpots, selectedZone, onSelectZone }: Props) {
  const lastRefreshed = new Date(BRAND_CONFIG.lastRefreshed)
  const refreshStr = 'Today, ' + lastRefreshed.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const tiles: Tile[] = [
    {
      zone: 'blind-spot',
      label: 'Blind Spots',
      value: pendingBlindSpots,
      total: blindSpotTopics.length,
      desc: 'Topics customers discuss publicly but not with your agents',
      bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', badge: '#ef4444',
    },
    {
      zone: 'private-signal',
      label: 'Under-the-Radar',
      value: privateSignalTopics.length,
      total: null,
      desc: 'Topics brewing inside the contact center before going public',
      bg: '#f8fafc', border: '#e2e8f0', text: '#334155', badge: '#64748b',
    },
    {
      zone: 'emerging',
      label: 'Emerging Topics',
      value: emergingTopics.length,
      total: null,
      desc: 'Confirmed in both interactions and social',
      bg: '#fff7ed', border: '#fed7aa', text: '#c2410c', badge: '#f97316',
    },
    {
      zone: null,
      label: 'Last Refreshed',
      value: null,
      total: null,
      desc: refreshStr,
      bg: '#f8fafc', border: '#e2e8f0', text: '#0f172a', badge: null,
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {tiles.map(tile => {
        const clickable = tile.zone !== null
        const selected = clickable && tile.zone === selectedZone
        return (
          <div
            key={tile.label}
            onClick={clickable ? () => onSelectZone(tile.zone as Zone) : undefined}
            style={{
              background: tile.bg,
              border: `${selected ? 2 : 1}px solid ${selected ? (tile.badge ?? tile.border) : tile.border}`,
              borderRadius: 12,
              padding: selected ? '15px 19px' : '16px 20px',
              cursor: clickable ? 'pointer' : 'default',
              transition: 'box-shadow 0.15s, transform 0.1s',
              boxShadow: selected ? `0 4px 14px ${tile.badge}33` : 'none',
              position: 'relative',
            }}
            onMouseEnter={e => { if (clickable && !selected) (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
            onMouseLeave={e => { if (clickable && !selected) (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b' }}>
                {tile.label}
              </div>
              {selected && (
                <span style={{
                  fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: '#fff', background: tile.badge ?? '#64748b',
                  borderRadius: 9999, padding: '2px 7px',
                }}>
                  Viewing
                </span>
              )}
            </div>
            {tile.value !== null ? (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 36, fontWeight: 700, color: tile.text, lineHeight: 1 }}>
                  {tile.value}
                </span>
                {tile.total !== null && tile.value < tile.total && (
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>/ {tile.total}</span>
                )}
                {tile.badge && (
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: tile.badge, display: 'inline-block', marginLeft: 2,
                  }} />
                )}
              </div>
            ) : (
              <div style={{ fontSize: 20, fontWeight: 700, color: tile.text, lineHeight: 1.2, marginBottom: 6 }}>
                {tile.desc}
              </div>
            )}
            {tile.value !== null && (
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>{tile.desc}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
