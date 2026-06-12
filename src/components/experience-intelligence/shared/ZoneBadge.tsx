import { TrendingUp, AlertTriangle, Shield } from 'lucide-react'
import type { Zone } from '@/data/eiMockData'

type ZoneConfig = { label: string; bg: string; text: string; border: string; Icon: typeof TrendingUp }

const CONFIG: Record<Zone, ZoneConfig> = {
  'emerging': {
    label: 'Emerging Topic',
    bg: '#fff7ed',
    text: '#c2410c',
    border: '#fed7aa',
    Icon: TrendingUp,
  },
  'blind-spot': {
    label: 'Blind Spot',
    bg: '#fef2f2',
    text: '#b91c1c',
    border: '#fecaca',
    Icon: AlertTriangle,
  },
  'private-signal': {
    label: 'Under-the-Radar',
    bg: '#f8fafc',
    text: '#475569',
    border: '#e2e8f0',
    Icon: Shield,
  },
}

export function ZoneBadge({ zone, size = 'sm' }: { zone: Zone; size?: 'xs' | 'sm' | 'md' }) {
  const c = CONFIG[zone]
  const padding = size === 'xs' ? '2px 6px' : size === 'md' ? '4px 12px' : '3px 8px'
  const fontSize = size === 'xs' ? 10 : size === 'md' ? 13 : 11
  const iconSize = size === 'xs' ? 9 : size === 'md' ? 13 : 11
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding,
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        borderRadius: 9999,
        fontSize,
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        lineHeight: 1,
      }}
    >
      <c.Icon size={iconSize} strokeWidth={2.2} />
      {c.label}
    </span>
  )
}

export function ZoneIcon({ zone, size = 16 }: { zone: Zone; size?: number }) {
  const c = CONFIG[zone]
  return (
    <c.Icon
      size={size}
      color={ZONE_COLORS[zone]}
      strokeWidth={2.2}
      aria-label={c.label}
    />
  )
}

export const ZONE_COLORS: Record<Zone, string> = {
  'emerging':       '#f97316',
  'blind-spot':     '#ef4444',
  'private-signal': '#64748b',
}

export const ZONE_TOOLTIPS: Record<Zone, string> = {
  'emerging':       'Emerging Topic — confirmed in both your contact center and public social. High-priority.',
  'blind-spot':     'Blind Spot — customers are raising this publicly but not with your agents. Recommendation available.',
  'private-signal': 'Under-the-Radar — customers are raising this with your agents but it hasn\'t surfaced publicly yet.',
}
