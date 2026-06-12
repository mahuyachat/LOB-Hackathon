import { LayoutDashboard, Database, ChevronLeft } from 'lucide-react'

export type EIPage = 'dashboard' | 'recommendations' | 'settings'

const NAV_ITEMS: { id: EIPage; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Customer Signal Intelligence', icon: LayoutDashboard },
  { id: 'settings', label: 'Data Sources', icon: Database },
]

interface EISidebarProps {
  activePage: EIPage
  onNavigate: (page: EIPage) => void
  onBackToAdmin: () => void
  pendingCount: number
}

export function EISidebar({ activePage, onNavigate, onBackToAdmin, pendingCount }: EISidebarProps) {
  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        background: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Brand header */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>✦</div>
          <div>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
              Experience
            </div>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
              Intelligence
            </div>
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: '#64748b', fontWeight: 500 }}>
          Delta Air Lines
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const active = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '9px 12px',
                marginBottom: 2,
                background: active ? 'rgba(249,115,22,0.15)' : 'transparent',
                border: 'none',
                borderRadius: 8,
                color: active ? '#fb923c' : '#94a3b8',
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <Icon size={16} />
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Back to Admin */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={onBackToAdmin}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: '8px 12px',
            background: 'transparent',
            border: 'none',
            borderRadius: 8,
            color: '#64748b',
            fontSize: 13,
            cursor: 'pointer',
            textAlign: 'left',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#94a3b8')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#64748b')}
        >
          <ChevronLeft size={14} />
          Back to Admin
        </button>
      </div>
    </aside>
  )
}
