interface Props {
  onReset?: () => void
}

export function DataSourcesView({ onReset }: Props) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 32px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#f97316', marginBottom: 4 }}>
          ✦ Market Intelligence
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>Data Sources</h1>
        <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
          Manage and monitor your connected data streams
        </p>
      </div>

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 680 }}>

        {/* Connected: Brandwatch */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>
                Brandwatch (Social Listening)
              </div>
              <div style={{ fontSize: 13, color: '#64748b' }}>
                Public social posts ingested via Brandwatch OEM integration. Covers X / Twitter.
              </div>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
              background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0',
              borderRadius: 9999, padding: '4px 12px', fontSize: 12, fontWeight: 600,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              Connected
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
            Last sync: <strong style={{ color: '#334155' }}>Jun 11, 2026 06:00 AM</strong>
          </div>
        </div>

        {/* Connected: CXone Contact Center */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>
                CXone Contact Center
              </div>
              <div style={{ fontSize: 13, color: '#64748b' }}>
                Post-interaction contact center data including call transcripts and chat logs.
              </div>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
              background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0',
              borderRadius: 9999, padding: '4px 12px', fontSize: 12, fontWeight: 600,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              Connected
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
            Last sync: <strong style={{ color: '#334155' }}>Jun 11, 2026 06:00 AM</strong>
          </div>
        </div>

        {/* Coming Soon: Review Platforms */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', opacity: 0.75 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>
                Review Platforms (G2, Trustpilot)
              </div>
              <div style={{ fontSize: 13, color: '#64748b' }}>
                Customer reviews from G2 and Trustpilot. Planned for a future release.
              </div>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
              background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0',
              borderRadius: 9999, padding: '4px 12px', fontSize: 12, fontWeight: 600,
            }}>
              Coming Soon
            </span>
          </div>
        </div>

        {/* Demo reset */}
        {onReset && (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', marginTop: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Reset Demo</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
              Restore all recommendation cards to their initial pending state. Use this to restart the demo flow.
            </div>
            <button
              onClick={onReset}
              style={{
                padding: '9px 20px', background: '#fff', color: '#334155',
                border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = '#94a3b8')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0')}
            >
              Reset to Demo State
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
