export type SentimentBand = 'negative' | 'neutral' | 'positive' | 'none'

export function sentimentBand(score: number, hasData: boolean): SentimentBand {
  if (!hasData) return 'none'
  if (score <= -0.2) return 'negative'
  if (score >= 0.2) return 'positive'
  return 'neutral'
}

const BAND_CONFIG: Record<SentimentBand, { bg: string; text: string; border: string; dot: string; label: string }> = {
  negative: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', dot: '#ef4444', label: 'Negative' },
  neutral:  { bg: '#fffbeb', text: '#92400e', border: '#fde68a', dot: '#f59e0b', label: 'Neutral' },
  positive: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', dot: '#22c55e', label: 'Positive' },
  none:     { bg: '#f8fafc', text: '#94a3b8', border: '#e2e8f0', dot: '#cbd5e1', label: 'No data' },
}

function formatScore(score: number): string {
  // signed, one decimal, en-dash for minus
  const s = score.toFixed(1)
  return score < 0 ? `−${Math.abs(score).toFixed(1)}` : `+${s}`
}

interface Props {
  score: number
  hasData?: boolean
  size?: 'sm' | 'md'
  showScore?: boolean
}

export function SentimentPill({ score, hasData = true, size = 'md', showScore = true }: Props) {
  const band = sentimentBand(score, hasData)
  const c = BAND_CONFIG[band]
  const isNone = band === 'none'

  const padding = size === 'sm' ? '2px 8px' : '3px 10px'
  const fontSize = size === 'sm' ? 11 : 12
  const dotSize = size === 'sm' ? 6 : 7

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding,
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        borderRadius: 9999,
        fontSize,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
      }}
    >
      <span style={{
        width: dotSize, height: dotSize, borderRadius: '50%',
        background: c.dot, flexShrink: 0, display: 'inline-block',
      }} />
      {isNone ? (
        <span>No data</span>
      ) : (
        <>
          {showScore && <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatScore(score)}</span>}
          <span style={{ fontWeight: 500 }}>{c.label}</span>
        </>
      )}
    </span>
  )
}

/** Small legend strip showing the three sentiment bands. */
export function SentimentLegend() {
  const items: { band: Exclude<SentimentBand, 'none'>; }[] = [
    { band: 'negative' }, { band: 'neutral' }, { band: 'positive' },
  ]
  return (
    <div style={{ display: 'flex', gap: 18, fontSize: 12, color: '#64748b' }}>
      {items.map(({ band }) => {
        const c = BAND_CONFIG[band]
        return (
          <span key={band} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: c.dot, display: 'inline-block' }} />
            {c.label}
          </span>
        )
      })}
    </div>
  )
}
