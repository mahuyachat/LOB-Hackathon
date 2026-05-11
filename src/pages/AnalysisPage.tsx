import { Fragment, useState } from 'react'
import { AlertTriangle, Sparkles, ChevronRight } from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'
import './AnalysisPage.css'

/* Validation matrix data */
const MATRIX_COLS = [
  { title: 'Transfer', sub: 'bounced between agents?', highlighted: true },
  { title: 'Hold', sub: 'kept waiting in-call?' },
  { title: 'Escalation', sub: 'raised above the agent?' },
  { title: 'Repeat', sub: 'recurring contact?' },
  { title: 'No action', sub: 'resolved smoothly?' },
]

const MATRIX_ROWS = [
  { label: 'Billing Dispute', cells: [{ value: '75%', pct: 75 }, { value: '64%', pct: 64 }, { value: '71%', pct: 71 }, { value: '52%', pct: 52 }, { value: '38%', pct: 38 }] },
  { label: 'Refund Processing', cells: [{ value: '73%', pct: 73 }, { value: '61%', pct: 61 }, { value: '68%', pct: 68 }, { value: '49%', pct: 49 }, { value: 'Low volume' }] },
  { label: 'Tech Support', cells: [{ value: '62%', pct: 62 }, { value: '54%', pct: 54 }, { value: '70%', pct: 70 }, { value: '58%', pct: 58 }, { value: '31%', pct: 31 }] },
  { label: 'General Inquiry', cells: [{ value: '31%', pct: 31 }, { value: '28%', pct: 28 }, { value: 'Low volume' }, { value: 'Low volume' }, { value: '19%', pct: 19 }] },
]

function cellBg(cell: { value: string; pct?: number }): string {
  if (!cell.pct) return '#F8FAFC'
  if (cell.pct >= 70) return '#1E6BC2'
  if (cell.pct >= 60) return '#3D8AD9'
  if (cell.pct >= 50) return '#7AB0E5'
  if (cell.pct >= 40) return '#A8C9ED'
  if (cell.pct >= 30) return '#C7DCF4'
  return '#DDE9F8'
}

function cellFg(cell: { value: string; pct?: number }): string {
  if (!cell.pct) return '#94A3B8'
  if (cell.pct >= 60) return '#FFFFFF'
  return '#1E293B'
}

/* Flow data */
const STEPS = [
  { label: 'Extracted', value: '3,520', percent: '100%' },
  { label: 'Question', value: '2,534', percent: '72%' },
  { label: 'Responded', value: '1,191', percent: '34%' },
  { label: 'Confirmed', value: '1,060', percent: '30%' },
]

const ARROWS = [
  { drop: '-28%', steepest: false },
  { drop: '-53%', steepest: true },
  { drop: '-11%', steepest: false },
]

/* Insights data */
const INSIGHTS = [
  { title: 'The friction is not the agent.', fact: 'Agent FI signal averages +60 across the 1,060 confirmed responses. Agents are resolving cleanly.' },
  { title: 'FI\'s contextual questions caught the friction in the customer\'s own words.', fact: 'The questions targeted the handoff and re-explanation experience. Customer answers matched the prediction — the friction was the context loss at transfer, validated directly by the people who lived through it.' },
  { title: 'The CRM update on May 1 broke AI billing routing.', fact: 'Call Transfer Impact is the resulting friction signal — concentrated in this cluster, not random.' },
  { title: 'FI\'s read is reliable.', fact: 'Validation accuracy on Transfer interactions in this cluster is 73-75% — the highest band in the Intent × Action matrix.' },
]

export function AnalysisPage({ onBack, onOpenCohort }: { onBack: () => void; onOpenCohort?: () => void }) {
  const [accordion1Open, setAccordion1Open] = useState(false)
  const [accordion2Open, setAccordion2Open] = useState(false)
  const [accordion3Open, setAccordion3Open] = useState(false)
  const [accordion4Open, setAccordion4Open] = useState(false)
  const [animateAccordion1, setAnimateAccordion1] = useState(false)
  const [animateAccordion2, setAnimateAccordion2] = useState(false)
  const [animateAccordion3, setAnimateAccordion3] = useState(false)
  const [animateAccordion4, setAnimateAccordion4] = useState(false)

  const handleAccordion1Toggle = () => {
    if (!accordion1Open) {
      setAccordion1Open(true)
      setAnimateAccordion1(true)
    } else {
      setAccordion1Open(false)
      setAnimateAccordion1(false)
    }
  }

  const handleAccordion2Toggle = () => {
    if (!accordion2Open) {
      setAccordion2Open(true)
      setAnimateAccordion2(true)
    } else {
      setAccordion2Open(false)
      setAnimateAccordion2(false)
    }
  }

  const handleAccordion3Toggle = () => {
    if (!accordion3Open) {
      setAccordion3Open(true)
      setAnimateAccordion3(true)
    } else {
      setAccordion3Open(false)
      setAnimateAccordion3(false)
    }
  }

  const handleAccordion4Toggle = () => {
    if (!accordion4Open) {
      setAccordion4Open(true)
      setAnimateAccordion4(true)
    } else {
      setAccordion4Open(false)
      setAnimateAccordion4(false)
    }
  }

  return (
    <AppShell title="Analysis" breadcrumb={['Screen Intelligence', 'Dashboard']}>
      <div className="p-5 bg-[#F8FAFC] space-y-4">
        {/* Back link */}
        <button onClick={onBack} className="text-sm font-medium text-[#378ADD] hover:underline">
          ← Back to dashboard
        </button>

        {/* Page header */}
        <div>
          <h1 className="text-xl font-semibold text-[#0F172A]">Billing-flow cluster — Analysis</h1>
          <p className="text-[13px] text-[#64748B] mt-1">Tracking 3,520 interactions across 3 linked intents · Last 7 days</p>
        </div>

        {/* Act 1 — The Inversion (single horizontal strip) */}
        <div className="rounded-lg border-2 border-[#DC2626] bg-white px-5 py-3 flex items-center gap-6">
          <div className="flex-shrink-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#991B1B]">THE INVERSION</div>
            <div className="mt-0.5 text-sm font-semibold text-[#0F172A]">Customers downrate even when the agent did well</div>
            <div className="mt-0.5 text-xs text-[#475569]">Of the 1,060 confirmed responses in this cluster</div>
          </div>
          <div className="h-10 w-px bg-[#E5E7EB] flex-shrink-0" />
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-[28px] font-bold text-[#DC2626] leading-none">84%</span>
            <span className="text-xs text-[#0F172A]">rated ≤3★</span>
          </div>
          <div className="h-10 w-px bg-[#E5E7EB] flex-shrink-0" />
          <div className="flex flex-col gap-1 flex-shrink-0">
            <div className="text-xs text-[#0F172A]">agent FI signal</div>
            <div className="text-[11px] text-[#475569]">(positive — agent did well)</div>

            {/* Sentiment trajectory gradient bar */}
            <div className="mt-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#475569]">SENTIMENT TRAJECTORY</div>
              <div className="mt-2 relative" style={{ width: '200px' }}>
                {/* Gradient bar */}
                <div
                  className="h-[10px] rounded-full"
                  style={{
                    background: 'linear-gradient(to right, #16A34A 0%, #16A34A 40%, #D97706 60%, #D97706 100%)'
                  }}
                />
                {/* Handoff marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-[18px] bg-[#DC2626]" />
                {/* Warning icon above marker */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-[16px] text-[#DC2626] text-xs">⚠</div>

                {/* Labels */}
                <div className="mt-2 flex justify-between items-center text-[11px]">
                  <span className="text-[#16A34A]">Positive</span>
                  <span className="text-[#DC2626] text-[10px]">handoff</span>
                  <span className="text-[#D97706]">Neutral</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-10 w-px bg-[#E5E7EB] flex-shrink-0" />
          <div className="text-xs italic text-[#475569]">Friction sits upstream — not the agent.</div>
        </div>

        {/* Two-column row: Insights (left 50%) + Recommended actions (right 50%) */}
        <div className="flex gap-4 items-stretch">
          {/* Left column — What Feedback Intelligence is telling us */}
          <div className="flex-1 rounded-lg border border-[#E5E7EB] bg-white p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#378ADD]" />
              <span className="text-[15px] font-semibold text-[#0F172A]">What Feedback Intelligence is telling us</span>
            </div>
            <div className="text-xs text-[#64748B] mt-1">Four observations from the cluster's signal pile</div>

            <div className="mt-4 space-y-4">
              {INSIGHTS.map((insight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] text-xs font-semibold text-[#0F172A]">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#0F172A]">{insight.title}</div>
                    <div className="mt-0.5 text-xs text-[#475569] leading-[1.4]">{insight.fact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — Recommended actions */}
          <div className="flex-1 rounded-lg border border-[#E5E7EB] bg-white p-5">
            <div className="text-[15px] font-semibold text-[#0F172A]">Recommended actions</div>
            <div className="text-xs text-[#64748B] mt-1">Two actions to take based on the diagnosis above</div>

            <div className="mt-4 grid grid-cols-2 gap-4 items-stretch">
              {/* Card 1 */}
              <div className="rounded-lg border border-[#E5E7EB] bg-white p-[18px] flex flex-col">
                {/* Pill — Completed status */}
                <span className="inline-flex items-center gap-2 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-semibold text-[#166534] self-start">
                  <span className="text-xs">✓</span>
                  Completed · sent today
                </span>

                {/* Title row with badge */}
                <div className="flex items-start gap-2.5 mt-4">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#FEF3C7] text-xs font-semibold text-[#92400E]">①</div>
                  <div>
                    <div className="text-sm font-semibold text-[#0F172A]">Alert has been sent to CX manager</div>
                    <div className="text-xs text-[#64748B] mt-0.5">Root cause: CRM routing failure</div>
                  </div>
                </div>

                {/* Two-metric strip */}
                <div className="grid grid-cols-2 gap-3 mt-4 min-h-[70px]">
                  <div>
                    <div className="text-[22px] font-bold text-[#0F172A]">1,343</div>
                    <div className="text-[11px] text-[#64748B] mt-1">customers affected</div>
                  </div>
                  <div>
                    <div className="text-[22px] font-bold text-[#0F172A]">1</div>
                    <div className="text-[11px] text-[#64748B] mt-1">CX manager notified</div>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-xs text-[#475569] leading-relaxed min-h-[100px]">
                  The CRM update on May 1 is the root cause of the cluster's friction. FI has alerted the CX manager with the diagnosis so the routing fix can be assigned to the right team.
                </p>

                {/* Action chip — right-aligned, footer */}
                <div className="mt-auto pt-4 flex justify-end">
                  <button className="inline-flex items-center rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2 text-[13px] text-[#475569] hover:bg-[#F1F5F9] transition-colors">
                    View alert →
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-lg border border-[#E5E7EB] bg-white p-[18px] flex flex-col">
                {/* Pill — Auto-optimized status */}
                <span className="inline-flex items-center gap-2 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-semibold text-[#166534] self-start">
                  <span className="text-xs">✓</span>
                  Auto-optimized · today
                </span>

                {/* Title row with badge */}
                <div className="flex items-start gap-2.5 mt-4">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#FEF3C7] text-xs font-semibold text-[#92400E]">②</div>
                  <div>
                    <div className="text-sm font-semibold text-[#0F172A]">Campaign has been optimized</div>
                    <div className="text-xs text-[#64748B] mt-0.5">Suppression rule updated · 1,343 ratings tagged</div>
                  </div>
                </div>

                {/* Three-metric strip */}
                <div className="grid grid-cols-3 gap-3 mt-4 min-h-[70px]">
                  <div>
                    <div className="text-[22px] font-bold text-[#0F172A]">1,343</div>
                    <div className="text-[11px] text-[#64748B] mt-1">ratings tagged for review</div>
                  </div>
                  <div>
                    <div className="text-[22px] font-bold text-[#16A34A]">+0.4★</div>
                    <div className="text-[11px] text-[#64748B] mt-1">expected agent score recovery</div>
                  </div>
                  <div>
                    <div className="text-[22px] font-bold text-[#0F172A]">8</div>
                    <div className="text-[11px] text-[#64748B] mt-1">retention-unit agents protected</div>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-xs text-[#475569] leading-relaxed min-h-[100px]">
                  FI has tightened the campaign's suppression rule to prevent further pollution from this pattern, and tagged the 1,343 affected ratings for QM review. Decide whether to permanently exclude or re-include them after the CRM fix lands.
                </p>

                {/* Action chip — right-aligned, footer */}
                <div className="mt-auto pt-4 flex justify-end">
                  <button className="inline-flex items-center rounded-lg border border-[#16A34A] bg-white px-3.5 py-2 text-[13px] text-[#166534] hover:bg-[#F0FDF4] transition-colors">
                    Review optimization →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section divider — Show diagnostic details */}
        <div className="relative" style={{ marginTop: '32px', marginBottom: '16px' }}>
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-[#E5E7EB]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3.5 py-1.5 text-xs text-[#64748B] border border-[#E5E7EB] rounded-md">
              Show diagnostic details
            </span>
          </div>
        </div>

        {/* Accordion 1 — Campaign Concentration */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
          <button
            onClick={handleAccordion1Toggle}
            className="w-full px-5 py-5 flex items-center justify-between cursor-pointer hover:bg-[#FAFAFA] transition-colors group"
          >
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#475569]">THE FRICTION LIVES IN 2 CAMPAIGNS</div>
              <div className="text-[15px] font-semibold text-[#0F172A] text-left mt-1">Which campaigns are affected?</div>
              <div className="text-xs text-[#64748B] mt-1 text-left">Both affected campaigns account for 100% of the 1,343-customer drop</div>
              <div className="flex items-center gap-2 mt-1.5 justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF2F2] px-2.5 py-1 text-[11px] font-semibold text-[#991B1B]">
                  <span className="text-xs">⊙</span>
                  <span className="text-[10px] uppercase tracking-[0.05em]">DATA</span>
                  <span>·</span>
                  <span>Retention Voice Q2 — 71%</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[11px] font-semibold text-[#475569]">
                  <span className="text-xs">⊙</span>
                  <span className="text-[10px] uppercase tracking-[0.05em]">DATA</span>
                  <span>·</span>
                  <span>Billing Resolution CSAT Q2 — 29%</span>
                </span>
              </div>
            </div>
            <ChevronRight
              className={`h-5 w-5 text-[#475569] group-hover:text-[#0F172A] transition-all duration-200 flex-shrink-0 ml-4 ${accordion1Open ? 'rotate-90' : ''}`}
            />
          </button>
          <div
            className="overflow-hidden transition-all duration-200"
            style={{ maxHeight: accordion1Open ? '1000px' : '0' }}
          >
            <div className={`px-5 pb-5 ${animateAccordion1 ? 'animate-accordion-1' : ''}`}>
              <div className="grid grid-cols-2 gap-4">
                {/* Campaign 1 — Retention Voice Q2 */}
                <div className="campaign-card rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#0F172A]">Retention Voice Q2</span>
                    <span className="text-sm font-semibold text-[#DC2626]">71%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded bg-[#FEE2E2] overflow-hidden">
                    <div className="progress-bar-left h-full rounded bg-[#DC2626]" style={{ width: '71%' }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    <div className="metric-0">
                      <div className="text-base font-semibold text-[#0F172A]">950</div>
                      <div className="text-[11px] text-[#64748B]">interactions</div>
                    </div>
                    <div className="metric-1">
                      <div className="text-base font-semibold text-[#0F172A]">Voice</div>
                      <div className="text-[11px] text-[#64748B]">channel</div>
                    </div>
                    <div className="metric-2">
                      <div className="text-base font-semibold text-[#0F172A]">8</div>
                      <div className="text-[11px] text-[#64748B]">agents affected</div>
                    </div>
                    <div className="metric-3">
                      <div className="text-base font-semibold text-[#0F172A]">17%</div>
                      <div className="text-[11px] text-[#64748B]">hidden friction rate</div>
                    </div>
                  </div>
                </div>

                {/* Campaign 2 — Billing Resolution CSAT Q2 */}
                <div className="campaign-card rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#0F172A]">Billing Resolution CSAT Q2</span>
                    <span className="text-sm font-semibold text-[#475569]">29%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded bg-[#F1F5F9] overflow-hidden">
                    <div className="progress-bar-right h-full rounded bg-[#475569]" style={{ width: '29%' }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    <div className="metric-0">
                      <div className="text-base font-semibold text-[#0F172A]">390</div>
                      <div className="text-[11px] text-[#64748B]">interactions</div>
                    </div>
                    <div className="metric-1">
                      <div className="text-base font-semibold text-[#0F172A]">Chat / Email</div>
                      <div className="text-[11px] text-[#64748B]">channels</div>
                    </div>
                    <div className="metric-2">
                      <div className="text-base font-semibold text-[#0F172A]">3</div>
                      <div className="text-[11px] text-[#64748B]">agents affected</div>
                    </div>
                    <div className="metric-3">
                      <div className="text-base font-semibold text-[#0F172A]">8%</div>
                      <div className="text-[11px] text-[#64748B]">hidden friction rate</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="footer-text mt-4 text-xs italic text-[#475569] max-w-[700px]">
                Most of the cohort lives in Retention Voice Q2 (voice channel). The bot-to-human handoff failure is concentrated where the CRM billing routing was triggered.
              </div>
            </div>
          </div>
        </div>

        {/* Accordion 2 — Conversion Flow */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden" style={{ marginTop: '16px' }}>
          <button
            onClick={handleAccordion2Toggle}
            className="w-full px-5 py-5 flex items-center justify-between cursor-pointer hover:bg-[#FAFAFA] transition-colors group"
          >
            <div>
              <div className="text-[15px] font-semibold text-[#0F172A] text-left">How do interactions flow through Feedback Intelligence?</div>
              <div className="text-xs text-[#64748B] mt-1 text-left">The stages an interaction moves through, from initial extraction to confirmed signal</div>
              <div className="mt-1.5 flex justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEE2E2] px-2.5 py-1 text-[11px] font-semibold text-[#991B1B]">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-[0.05em]">PROBLEM</span>
                  <span>·</span>
                  <span>Steepest drop: Question → Responded (-53%)</span>
                </span>
              </div>
            </div>
            <ChevronRight
              className={`h-5 w-5 text-[#475569] group-hover:text-[#0F172A] transition-all duration-200 flex-shrink-0 ml-4 ${accordion2Open ? 'rotate-90' : ''}`}
            />
          </button>
          <div
            className="overflow-hidden transition-all duration-200"
            style={{ maxHeight: accordion2Open ? '1000px' : '0' }}
          >
            <div className={`px-5 pb-5 ${animateAccordion2 ? 'animate-accordion-2' : ''}`}>
              {/* Flow boxes */}
              <div className="flex items-center mt-5">
            {STEPS.map((step, i) => (
              <Fragment key={i}>
                <div className={`flow-box-${i} w-[110px] h-[85px] flex flex-col items-center justify-center rounded-lg border border-[#E5E7EB] bg-white flex-shrink-0`}>
                  <div className="text-xl font-bold text-[#0F172A] leading-none">{step.value}</div>
                  <div className="text-xs text-[#64748B] mt-1">{step.percent}</div>
                  <div className="text-[11px] font-medium text-[#475569] mt-0.5">{step.label}</div>
                </div>
                {i < ARROWS.length && (
                  <div className={`flow-arrow-${i} flex flex-col items-center justify-center flex-1 min-w-[50px] px-1`}>
                    <span className={ARROWS[i].steepest ? 'text-xs font-semibold text-[#DC2626]' : 'text-xs text-[#64748B]'}>
                      {ARROWS[i].steepest && '⚠ '}{ARROWS[i].drop}
                    </span>
                    <div className="w-full flex items-center my-1">
                      <div className="flex-1" style={{ height: ARROWS[i].steepest ? '4px' : '2px', backgroundColor: ARROWS[i].steepest ? '#DC2626' : '#94A3B8' }} />
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] flex-shrink-0" style={{ borderLeftColor: ARROWS[i].steepest ? '#DC2626' : '#94A3B8' }} />
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
              </div>

              <div className="flow-footer mt-2 text-xs text-[#64748B]">
                Steepest drop at <span className="font-bold text-[#DC2626]">Question → Responded</span> — 1,343 customers received the survey but didn't engage.
              </div>
            </div>
          </div>
        </div>

        {/* Accordion 3 — Where the 1,343 dropped */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden" style={{ marginTop: '16px' }}>
          <button
            onClick={handleAccordion3Toggle}
            className="w-full px-5 py-5 flex items-center justify-between cursor-pointer hover:bg-[#FAFAFA] transition-colors group"
          >
            <div>
              <div className="text-[15px] font-semibold text-[#0F172A] text-left">Which intent is driving the drop?</div>
              <div className="text-xs text-[#64748B] mt-1 text-left">The 53% drop at Question → Responded, broken down by intent</div>
              <div className="mt-1.5 flex justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEE2E2] px-2.5 py-1 text-[11px] font-semibold text-[#991B1B]">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-[0.05em]">CULPRIT</span>
                  <span>·</span>
                  <span>Top culprit: Call Transfer Impact (-69%)</span>
                </span>
              </div>
            </div>
            <ChevronRight
              className={`h-5 w-5 text-[#475569] group-hover:text-[#0F172A] transition-all duration-200 flex-shrink-0 ml-4 ${accordion3Open ? 'rotate-90' : ''}`}
            />
          </button>
          <div
            className="overflow-hidden transition-all duration-200"
            style={{ maxHeight: accordion3Open ? '1000px' : '0' }}
          >
            <div className={`px-5 pb-5 ${animateAccordion3 ? 'animate-accordion-3' : ''}`}>
              {/* Breakdown rows */}
              <div className="rounded-lg border border-[#E5E7EB] overflow-hidden">
            <div className="breakdown-row-0 flex items-center px-4 py-2.5 bg-[#FEF2F2] border-b border-[#F1F5F9] hover:bg-[#FEE2E2] cursor-pointer transition-colors">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[13px] font-semibold text-[#0F172A]">Call Transfer Impact</span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#FEE2E2] px-2 py-0.5 text-[11px] font-semibold text-[#991B1B]">
                  <AlertTriangle className="h-2.5 w-2.5" /> culprit
                </span>
              </div>
              <div className="w-[100px] text-center text-sm font-semibold text-[#DC2626]">-69%</div>
              <div className="w-[140px] text-center text-xs text-[#64748B]">(-433 customers)</div>
              <button onClick={onOpenCohort} className="inline-flex items-center rounded-lg border border-[#DC2626] bg-white px-2.5 py-1 text-xs text-[#DC2626] hover:bg-[#FEF2F2] transition-colors">
                open cohort →
              </button>
            </div>
            <div className="breakdown-row-1 flex items-center px-4 py-2.5 bg-white border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
              <div className="flex-1">
                <span className="text-[13px] font-medium text-[#0F172A]">Billing Dispute</span>
              </div>
              <div className="w-[100px] text-center text-sm font-semibold text-[#475569]">-47%</div>
              <div className="w-[140px] text-center text-xs text-[#64748B]">(-410 customers)</div>
              <button className="inline-flex items-center rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1 text-xs text-[#475569] hover:bg-[#F1F5F9] transition-colors">
                open cohort →
              </button>
            </div>
            <div className="breakdown-row-2 flex items-center px-4 py-2.5 bg-white hover:bg-[#F8FAFC] cursor-pointer transition-colors">
              <div className="flex-1">
                <span className="text-[13px] font-medium text-[#0F172A]">Refund Processing</span>
              </div>
              <div className="w-[100px] text-center text-sm font-semibold text-[#475569]">-42%</div>
              <div className="w-[140px] text-center text-xs text-[#64748B]">(-500 customers)</div>
              <button className="inline-flex items-center rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1 text-xs text-[#475569] hover:bg-[#F1F5F9] transition-colors">
                open cohort →
              </button>
            </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion 4 — Why we trust this read */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden" style={{ marginTop: '16px' }}>
          <button
            onClick={handleAccordion4Toggle}
            className="w-full px-5 py-5 flex items-center justify-between cursor-pointer hover:bg-[#FAFAFA] transition-colors group"
          >
            <div className="flex-1 pr-4">
              <div className="flex items-start justify-between">
                <div className="text-[15px] font-semibold text-[#0F172A] text-left">How reliable is this read?</div>
                <span className="text-[11px] text-[#94A3B8] flex-shrink-0 ml-6">Last 7 days · VU ≥ 32 confirmed</span>
              </div>
              <div className="text-xs text-[#64748B] mt-1 text-left max-w-[700px]">How often FI's read of the friction matched what customers actually said. Higher % = more reliable diagnostic signal.</div>
              <div className="mt-1.5 flex justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-semibold text-[#166534]">
                  <span className="text-xs">✓</span>
                  <span className="text-[10px] uppercase tracking-[0.05em]">TRUST</span>
                  <span>·</span>
                  <span>75% validation accuracy on Transfer interactions</span>
                </span>
              </div>
            </div>
            <ChevronRight
              className={`h-5 w-5 text-[#475569] group-hover:text-[#0F172A] transition-all duration-200 flex-shrink-0 ml-4 ${accordion4Open ? 'rotate-90' : ''}`}
            />
          </button>
          <div
            className="overflow-hidden transition-all duration-200"
            style={{ maxHeight: accordion4Open ? '1500px' : '0' }}
          >
            <div className={`px-5 pb-5 ${animateAccordion4 ? 'animate-accordion-4' : ''}`}>
              {/* Matrix */}
              <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="matrix-headers">
                <tr>
                  <th className="px-3 py-1.5 text-left text-xs font-medium text-[#64748B]"></th>
                  {MATRIX_COLS.map((col, i) => (
                    <th
                      key={i}
                      className={`px-3 py-1.5 text-center text-xs font-medium text-[#64748B] ${col.highlighted ? 'border-2 border-b-0 border-[#F59E0B] rounded-t-md transfer-column-border' : ''}`}
                    >
                      <div>{col.title}</div>
                      <div className="font-normal text-[11px] text-[#94A3B8] mt-0.5">{col.sub}</div>
                      {col.highlighted && (
                        <span className="inline-flex items-center rounded-full bg-[#FEF3C7] px-1.5 py-0.5 text-[10px] font-semibold text-[#92400E] mt-1">relevant to cluster</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX_ROWS.map((row, ri) => (
                  <tr key={ri}>
                    <td className="px-3 py-1.5 text-xs font-medium text-[#334155] whitespace-nowrap">{row.label}</td>
                    {row.cells.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`matrix-cell px-3 py-1.5 text-center text-xs font-medium rounded ${MATRIX_COLS[ci].highlighted ? (ri === MATRIX_ROWS.length - 1 ? 'border-x-2 border-b-2 border-[#F59E0B] rounded-b-md' : 'border-x-2 border-[#F59E0B]') : ''}`}
                        style={{ backgroundColor: cellBg(cell), color: cellFg(cell), animationDelay: `${0.2 + (ri + ci) * 0.04}s` }}
                      >
                        {cell.value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
              </div>

              {/* Interpretation callout */}
              <div className="interpretation-callout mt-4 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] p-3.5">
            <div className="flex items-start gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#378ADD] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-[#92400E]">What this means for the billing-flow cluster</div>
                <p className="mt-1.5 text-xs text-[#475569] leading-[1.4]">
                  When billing-dispute interactions involved a Transfer, FI's read of
                  the friction was confirmed 75% of the time — <span className="font-bold text-[#0F172A]">the highest accuracy
                  band in this cluster</span>. This is why we can trust the diagnosis above:
                  FI is reliably catching the bot-to-human handoff as the friction
                  point, not noise.
                </p>
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
