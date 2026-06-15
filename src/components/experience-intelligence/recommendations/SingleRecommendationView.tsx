import { useState } from 'react'
import { ArrowLeft, ChevronRight, ExternalLink, ChevronDown, ChevronUp, CheckCircle, TrendingUp } from 'lucide-react'
import { RECOMMENDATION_CARDS, getTopicById } from '@/data/eiMockData'
import { ZoneBadge, ROOT_CAUSE_CONFIG } from '../shared/ZoneBadge'
import { Toast } from '../shared/Toast'

interface Props {
  topicId: string
  cardStatuses: Record<string, 'pending' | 'approved' | 'dismissed'>
  approvedAt: Record<string, string>
  onBack: () => void
  onViewAll: () => void
  onApprove: (cardId: string) => void
  onDismiss: (cardId: string) => void
}

const PLATFORM_CONFIG = {
  twitter:   { label: 'X / Twitter', color: '#0f172a', bg: '#f1f5f9' },
  facebook:  { label: 'Facebook',    color: '#1877f2', bg: '#eff6ff' },
  reddit:    { label: 'Reddit',      color: '#ff4500', bg: '#fff7ed' },
  instagram: { label: 'Instagram',   color: '#e1306c', bg: '#fdf2f8' },
}

// Per-column theme
const STEP_THEME = {
  identify: { accent: '#2563eb', accentBg: '#eff6ff', accentBorder: '#bfdbfe', accentText: '#1e40af', panelBg: '#eff6ff', panelBorder: '#bfdbfe', panelLeft: '#2563eb' },
  assess:   { accent: '#d97706', accentBg: '#fffbeb', accentBorder: '#fde68a', accentText: '#92400e', panelBg: '#fffbeb', panelBorder: '#fde68a', panelLeft: '#f59e0b' },
  resolve:  { accent: '#16a34a', accentBg: '#f0fdf4', accentBorder: '#bbf7d0', accentText: '#15803d', panelBg: '#f0fdf4', panelBorder: '#bbf7d0', panelLeft: '#22c55e' },
}

function sentimentLabel(score: number) {
  if (score <= -0.3) return 'Negative'
  if (score >= 0.3) return 'Positive'
  return 'Neutral'
}

function sentimentColor(score: number) {
  if (score <= -0.3) return { text: '#b91c1c', bg: '#fef2f2', border: '#fecaca' }
  if (score >= 0.3)  return { text: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' }
  return { text: '#92400e', bg: '#fffbeb', border: '#fde68a' }
}

interface StepHeaderProps { num: string; title: string; sub: string; color: string }
function StepHeader({ num, title, sub, color }: StepHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', background: color,
        color: '#fff', fontSize: 14, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {num}
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{title}</div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{sub}</div>
      </div>
    </div>
  )
}

// Shared accent panel — the colored content block used in every column
function AccentPanel({ theme, label, children }: {
  theme: typeof STEP_THEME['identify']
  label: string
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: theme.panelBg,
      border: `1px solid ${theme.panelBorder}`,
      borderLeft: `3px solid ${theme.panelLeft}`,
      borderRadius: 8,
      padding: '12px 14px',
      flex: 1,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: theme.accentText, marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </div>
  )
}

export function SingleRecommendationView({
  topicId,
  cardStatuses,
  approvedAt,
  onBack,
  onApprove,
  onDismiss,
}: Props) {
  const [toast, setToast] = useState<string | null>(null)
  const [postsOpen, setPostsOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const card = RECOMMENDATION_CARDS.find(c => c.topicId === topicId)
  const topic = getTopicById(topicId)

  if (!card || !topic) return null

  const status = cardStatuses[card.id] ?? 'pending'
  const isApproved = status === 'approved'
  const isDismissed = status === 'dismissed'

  const handleApprove = () => {
    onApprove(card.id)
    setModalOpen(false)
    setToast('Action approved and sent to CXone')
  }

  const urgencyColors = {
    high:   { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', dot: '#ef4444', badge: '#dc2626' },
    medium: { bg: '#fffbeb', text: '#92400e', border: '#fde68a', dot: '#f59e0b', badge: '#d97706' },
    low:    { bg: '#f0fdf4', text: '#14532d', border: '#bbf7d0', dot: '#22c55e', badge: '#16a34a' },
  }
  const uc = urgencyColors[card.urgency]

  const sentScore = topic.sentiment?.social ?? -0.5
  const sc = sentimentColor(sentScore)
  const sentPct = `${sentScore >= 0 ? '+' : ''}${Math.round(sentScore * 100)}`

  const ti = STEP_THEME.identify
  const ta = STEP_THEME.assess
  const tr = STEP_THEME.resolve

  const rc = card.rootCausePattern
    ? ROOT_CAUSE_CONFIG[card.rootCausePattern]
    : { icon: '📊', bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe', label: 'Emerging Signal' }

  // Shared card style
  const colCard = (borderColor: string): React.CSSProperties => ({
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderTop: `3px solid ${borderColor}`,
    borderRadius: 14,
    padding: '22px 22px 18px',
    display: 'flex',
    flexDirection: 'column',
  })

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 12, fontWeight: 500, padding: 0, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <ArrowLeft size={13} /> Summary
          </button>
          <ChevronRight size={12} />
          <span style={{ color: '#0f172a', fontWeight: 500, fontSize: 13 }}>{topic.name}</span>
        </div>
      </div>

      {/* ── 3-column body ── */}
      <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'stretch' }}>

        {/* ── 01 Identify (blue) ── */}
        <div style={colCard(ti.accent)}>
          <StepHeader num="01" title="Identify" sub="Issue Description" color={ti.accent} />

          {/* Merged block: pattern label + headline + explanation */}
          <div style={{
            background: rc.bg, border: `1px solid ${rc.border}`,
            borderLeft: `3px solid ${rc.border}`, borderRadius: 8,
            padding: '14px 16px', flex: 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 15, lineHeight: 1 }}>{rc.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: rc.text }}>
                {rc.label}
              </span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', lineHeight: 1.45, marginBottom: 10 }}>
              {card.headline}
            </div>
            <p style={{ fontSize: 13, color: rc.text, opacity: 0.9, margin: 0, lineHeight: 1.6 }}>
              {card.rootCauseExplanation}
            </p>
          </div>
        </div>

        {/* ── 02 Assess (amber) ── */}
        <div style={colCard(ta.accent)}>
          <StepHeader num="02" title="Assess" sub="Issue Impact" color={ta.accent} />

          {/* Descriptor: 3 stat tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
            {[
              { label: 'Social Mentions',   value: topic.socialVolume.toLocaleString(),                          sub: 'Last 7 days',           color: '#f97316' },
              { label: 'Weekly Trend',      value: `+${topic.trendPct}%`,                                        sub: 'vs prior week',          color: '#dc2626' },
              { label: 'Overall Sentiment', value: `${sentScore >= 0 ? '+' : ''}${Math.round(sentScore * 100)}`, sub: sentimentLabel(sentScore), color: sc.text   },
            ].map(s => (
              <div key={s.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Accent panel: root cause */}
          <AccentPanel theme={ta} label="Root Cause">
            <p style={{ fontSize: 13, color: ta.accentText, lineHeight: 1.6, margin: 0 }}>
              {card.rootCause}
            </p>
          </AccentPanel>
        </div>

        {/* ── 03 Resolve (green) ── */}
        <div style={colCard(tr.accent)}>
          {/* Header row: step label + action button side by side */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: tr.accent,
                color: '#fff', fontSize: 14, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>03</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>Resolve</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>Issue Mitigation</div>
              </div>
            </div>
            {!isApproved && !isDismissed && (
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  padding: '8px 14px', background: '#fff', color: '#334155',
                  border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#f8fafc')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#fff')}
              >
                {card.actionLabel}
              </button>
            )}
            {isApproved && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#15803d', fontWeight: 500 }}>
                <CheckCircle size={14} /> Approved
              </div>
            )}
          </div>

          {/* Descriptor: department chip */}
          <div style={{ marginBottom: 12 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: tr.accentBg, border: `1px solid ${tr.accentBorder}`,
              color: tr.accentText, borderRadius: 6, padding: '5px 10px',
              fontSize: 12, fontWeight: 600,
            }}>
              → {card.department}
            </span>
          </div>

          {/* Accent panel: recommended action */}
          <AccentPanel theme={tr} label="Recommended Action">
            <p style={{ fontSize: 13, color: tr.accentText, lineHeight: 1.6, margin: 0 }}>
              {card.recommendedAction}
            </p>
          </AccentPanel>

          {/* Approved notice */}
          {isApproved && (
            <div style={{ marginTop: 12 }}>
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8,
                padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 12, color: '#15803d', fontWeight: 500, marginBottom: 10,
              }}>
                <CheckCircle size={14} />
                Action sent to CXone
                {approvedAt[card.id] && <span style={{ color: '#94a3b8', marginLeft: 'auto', fontWeight: 400 }}>{approvedAt[card.id]}</span>}
              </div>
              <button style={{
                background: 'none', border: '1px solid #e2e8f0', borderRadius: 8,
                padding: '8px 14px', fontSize: 12, color: '#1d4ed8', cursor: 'pointer', fontWeight: 600,
              }}>
                View in CXone →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Social Media Posts collapsible ── */}
      {topic.verbatims.social.length > 0 && (
        <div style={{ margin: '0 32px 32px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
          <button
            onClick={() => setPostsOpen(o => !o)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 22px', background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: postsOpen ? '1px solid #e2e8f0' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Recent Social Media Posts</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>driving this signal</span>
              <span style={{ background: '#f1f5f9', color: '#475569', borderRadius: 9999, padding: '1px 8px', fontSize: 11, fontWeight: 600 }}>
                {topic.verbatims.social.length}
              </span>
            </div>
            {postsOpen ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
          </button>

          {postsOpen && (
            <div>
              {/* Verbatim list */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {topic.verbatims.social.map((v, i) => {
                  const pc = PLATFORM_CONFIG[v.platform]
                  return (
                    <div key={i} style={{ padding: '14px 22px', borderBottom: i < topic.verbatims.social.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', background: pc.bg, color: pc.color, borderRadius: 4, padding: '2px 6px', flexShrink: 0 }}>
                          {pc.label}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#334155', flexShrink: 0 }}>{v.handle}</span>
                        <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 'auto', flexShrink: 0 }}>{v.date}</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.55, margin: 0 }}>{v.text}</p>
                    </div>
                  )
                })}
              </div>

              <div style={{ padding: '12px 22px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <a href="#" onClick={e => e.preventDefault()} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>
                  View all {topic.verbatims.social.length}+ posts <ExternalLink size={12} />
                </a>
                {topic.verbatims.cc.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                    <TrendingUp size={13} color="#1d4ed8" />
                    {topic.verbatims.cc.length} contact center verbatims also available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Confirmation modal ── */}
      {modalOpen && (
        <div onClick={() => setModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 460, width: '90%', boxShadow: '0 20px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
              Confirm action: {card.actionLabel}?
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#334155', lineHeight: 1.6 }}>
              {card.actionDetail}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleApprove} style={{ flex: 1, padding: '10px 0', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Confirm & Approve
              </button>
              <button onClick={() => setModalOpen(false)} style={{ padding: '10px 18px', background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
