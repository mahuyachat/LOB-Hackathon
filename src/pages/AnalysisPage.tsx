import { Fragment } from 'react'
import { AlertTriangle, Sparkles } from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'

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
  { title: 'The friction is not the agent.', fact: 'Agent VU averages +60 across the 1,060 confirmed responses. Agents are resolving cleanly.' },
  { title: 'The friction sits BEFORE the agent.', fact: 'Customers downrate immediately after the bot-to-human handoff — well before the human resolution begins.' },
  { title: 'The CRM update on May 1 broke AI billing routing.', fact: 'Call Transfer Impact is the resulting friction signal — concentrated in this cluster, not random.' },
  { title: 'FI\'s read is reliable.', fact: 'Validation accuracy on Transfer interactions in this cluster is 73-75% — the highest band in the Intent × Action matrix.' },
]

export function AnalysisPage({ onBack, onOpenCohort }: { onBack: () => void; onOpenCohort?: () => void }) {
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
        <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-5 py-3 flex items-center gap-6">
          <div className="flex-shrink-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#991B1B]">THE INVERSION</div>
            <div className="mt-0.5 text-sm font-semibold text-[#0F172A]">Customers downrate even when the agent did well</div>
            <div className="mt-0.5 text-xs text-[#475569]">Of the 1,060 confirmed responses in this cluster</div>
          </div>
          <div className="h-10 w-px bg-[#FECACA] flex-shrink-0" />
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-[28px] font-bold text-[#DC2626] leading-none">84%</span>
            <span className="text-xs text-[#0F172A]">rated ≤3★</span>
          </div>
          <div className="h-10 w-px bg-[#FECACA] flex-shrink-0" />
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-[28px] font-bold text-[#16A34A] leading-none">+60</span>
            <span className="text-xs text-[#0F172A]">agent VU</span>
          </div>
          <div className="h-10 w-px bg-[#FECACA] flex-shrink-0" />
          <div className="text-xs italic text-[#475569]">Friction sits upstream — not the agent.</div>
        </div>

        {/* Campaign Concentration */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#475569]">THE FRICTION LIVES IN 2 CAMPAIGNS</div>
          <div className="mt-1 text-[15px] font-semibold text-[#0F172A]">Campaign concentration</div>
          <div className="mt-1 text-xs text-[#64748B]">Both affected campaigns account for 100% of the 1,343-customer drop</div>
          <div className="border-t border-[#E5E7EB] mt-4 mb-4" />

          <div className="grid grid-cols-2 gap-4">
            {/* Campaign 1 — Retention Voice Q2 */}
            <div className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0F172A]">Retention Voice Q2</span>
                <span className="text-sm font-semibold text-[#DC2626]">71%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded bg-[#FEE2E2] overflow-hidden">
                <div className="h-full rounded bg-[#DC2626]" style={{ width: '71%' }} />
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                <div>
                  <div className="text-base font-semibold text-[#0F172A]">950</div>
                  <div className="text-[11px] text-[#64748B]">interactions</div>
                </div>
                <div>
                  <div className="text-base font-semibold text-[#0F172A]">Voice</div>
                  <div className="text-[11px] text-[#64748B]">channel</div>
                </div>
                <div>
                  <div className="text-base font-semibold text-[#0F172A]">8</div>
                  <div className="text-[11px] text-[#64748B]">agents affected</div>
                </div>
                <div>
                  <div className="text-base font-semibold text-[#0F172A]">17%</div>
                  <div className="text-[11px] text-[#64748B]">hidden friction rate</div>
                </div>
              </div>
            </div>

            {/* Campaign 2 — Billing Resolution CSAT Q2 */}
            <div className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0F172A]">Billing Resolution CSAT Q2</span>
                <span className="text-sm font-semibold text-[#475569]">29%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded bg-[#F1F5F9] overflow-hidden">
                <div className="h-full rounded bg-[#475569]" style={{ width: '29%' }} />
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                <div>
                  <div className="text-base font-semibold text-[#0F172A]">390</div>
                  <div className="text-[11px] text-[#64748B]">interactions</div>
                </div>
                <div>
                  <div className="text-base font-semibold text-[#0F172A]">Chat / Email</div>
                  <div className="text-[11px] text-[#64748B]">channels</div>
                </div>
                <div>
                  <div className="text-base font-semibold text-[#0F172A]">3</div>
                  <div className="text-[11px] text-[#64748B]">agents affected</div>
                </div>
                <div>
                  <div className="text-base font-semibold text-[#0F172A]">8%</div>
                  <div className="text-[11px] text-[#64748B]">hidden friction rate</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs italic text-[#475569] max-w-[700px]">
            Most of the cohort lives in Retention Voice Q2 (voice channel). The bot-to-human handoff failure is concentrated where the CRM billing routing was triggered.
          </div>
        </div>

        {/* Act 2 — Insights (2×2 grid) */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#378ADD]" />
            <span className="text-[15px] font-semibold text-[#0F172A]">What Feedback Intelligence is telling us</span>
          </div>
          <div className="text-xs text-[#64748B] mt-1">Four observations from the cluster's signal pile</div>

          <div className="mt-4 grid grid-cols-2 gap-4">
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

        {/* Act 3 — Recommendations */}
        <div>
          <div className="text-[15px] font-semibold text-[#0F172A]">Recommended actions</div>
          <div className="text-xs text-[#64748B] mt-1">Two actions to take based on the diagnosis above</div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            {/* Card 1 */}
            <div className="rounded-lg border border-[#E5E7EB] bg-white p-[18px] flex flex-col">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#FEF3C7] text-xs font-semibold text-[#92400E]">①</div>
                <div>
                  <div className="text-sm font-semibold text-[#0F172A]">Route to CX Dashboard</div>
                  <div className="text-xs text-[#64748B]">CRM billing routing fix</div>
                </div>
              </div>
              <p className="mt-2.5 text-xs text-[#475569] leading-relaxed">
                The CRM update on May 1 is the root cause of the cluster's friction.
                This is a CX-side fix — owned by the CX team's routing rules, not an
                FI-side tune. Routing 1,343 affected interactions and the diagnosis
                to CX hands the fix to the right team.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div><div className="text-[22px] font-bold text-[#0F172A]">1,343</div><div className="text-[11px] text-[#64748B]">customers affected</div></div>
                <div><div className="text-[22px] font-bold text-[#0F172A]">$0</div><div className="text-[11px] text-[#64748B]">cost to FI</div></div>
                <div><div className="text-[22px] font-bold text-[#0F172A]">1</div><div className="text-[11px] text-[#64748B]">CX ticket</div></div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-[#FEE2E2] px-2.5 py-1 text-[11px] font-semibold text-[#991B1B]">High impact · this week</span>
                <button className="inline-flex items-center rounded-lg border border-[#F59E0B] bg-white px-3 py-1.5 text-xs font-medium text-[#92400E] hover:bg-[#FEF3C7] transition-colors">
                  Route to CX →
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-lg border border-[#E5E7EB] bg-white p-[18px] flex flex-col">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#FEF3C7] text-xs font-semibold text-[#92400E]">②</div>
                <div>
                  <div className="text-sm font-semibold text-[#0F172A]">Open QM scoring review for 1,343 affected ratings</div>
                  <div className="text-xs text-[#64748B]">Hold these ratings pending the CRM root-cause fix</div>
                </div>
              </div>
              <p className="mt-2.5 text-xs text-[#475569] leading-relaxed">
                1,343 customers experienced the handoff failure. Their ratings reflect
                a system bug, not agent performance. Open a scoring review to hold these
                ratings pending the CRM fix — they can be re-included or permanently
                excluded based on the post-fix audit.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div><div className="text-[22px] font-bold text-[#0F172A]">1,343</div><div className="text-[11px] text-[#64748B]">ratings under review</div></div>
                <div><div className="text-[22px] font-bold text-[#16A34A]">+0.4★</div><div className="text-[11px] text-[#64748B]">expected agent score recovery</div></div>
                <div><div className="text-[22px] font-bold text-[#0F172A]">8</div><div className="text-[11px] text-[#64748B]">retention-unit agents protected</div></div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-semibold text-[#166534]">Protects agents · 24h</span>
                <button className="inline-flex items-center rounded-lg border border-[#16A34A] bg-white px-3 py-1.5 text-xs font-medium text-[#166534] hover:bg-[#F0FDF4] transition-colors">
                  Open scoring review →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Act 4+5 — Conversion Flow + Intent Breakdown (combined panel) */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
          {/* Flow header */}
          <div className="text-[15px] font-semibold text-[#0F172A]">Conversion flow</div>
          <div className="text-xs text-[#64748B] mt-1">How interactions in this cluster move from extraction to confirmed signal</div>

          {/* Flow boxes */}
          <div className="flex items-center mt-5">
            {STEPS.map((step, i) => (
              <Fragment key={i}>
                <div className="w-[110px] h-[85px] flex flex-col items-center justify-center rounded-lg border border-[#E5E7EB] bg-white flex-shrink-0">
                  <div className="text-xl font-bold text-[#0F172A] leading-none">{step.value}</div>
                  <div className="text-xs text-[#64748B] mt-1">{step.percent}</div>
                  <div className="text-[11px] font-medium text-[#475569] mt-0.5">{step.label}</div>
                </div>
                {i < ARROWS.length && (
                  <div className="flex flex-col items-center justify-center flex-1 min-w-[50px] px-1">
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

          <div className="mt-2 text-xs text-[#64748B]">
            Steepest drop at <span className="font-bold text-[#DC2626]">Question → Responded</span> — 1,343 customers received the survey but didn't engage.
          </div>

          {/* Divider */}
          <div className="border-t border-[#E5E7EB] my-4" />

          {/* Breakdown header */}
          <div className="text-sm font-semibold text-[#0F172A]">Where the 1,343 dropped at this step</div>
          <div className="text-xs text-[#64748B] mt-1 mb-3">The 53% drop at Question → Responded, broken down by intent</div>

          {/* Breakdown rows */}
          <div className="rounded-lg border border-[#E5E7EB] overflow-hidden">
            <div className="flex items-center px-4 py-2.5 bg-[#FEF2F2] border-b border-[#F1F5F9] hover:bg-[#FEE2E2] cursor-pointer transition-colors">
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
            <div className="flex items-center px-4 py-2.5 bg-white border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
              <div className="flex-1">
                <span className="text-[13px] font-medium text-[#0F172A]">Billing Dispute</span>
              </div>
              <div className="w-[100px] text-center text-sm font-semibold text-[#475569]">-47%</div>
              <div className="w-[140px] text-center text-xs text-[#64748B]">(-410 customers)</div>
              <button className="inline-flex items-center rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1 text-xs text-[#475569] hover:bg-[#F1F5F9] transition-colors">
                open cohort →
              </button>
            </div>
            <div className="flex items-center px-4 py-2.5 bg-white hover:bg-[#F8FAFC] cursor-pointer transition-colors">
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

        {/* Act 6 — Validation Evidence */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[15px] font-semibold text-[#0F172A]">Why we trust this read</div>
              <div className="text-xs text-[#64748B] mt-1 max-w-[600px]">How often FI's read of the friction matched what customers actually said. Higher % = more reliable diagnostic signal.</div>
            </div>
            <span className="text-[11px] text-[#94A3B8] flex-shrink-0">Last 7 days · VU ≥ 32 confirmed</span>
          </div>

          {/* Matrix */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="px-3 py-1.5 text-left text-xs font-medium text-[#64748B]"></th>
                  {MATRIX_COLS.map((col, i) => (
                    <th
                      key={i}
                      className={`px-3 py-1.5 text-center text-xs font-medium text-[#64748B] ${col.highlighted ? 'border-2 border-b-0 border-[#F59E0B] rounded-t-md' : ''}`}
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
                        className={`px-3 py-1.5 text-center text-xs font-medium rounded ${MATRIX_COLS[ci].highlighted ? (ri === MATRIX_ROWS.length - 1 ? 'border-x-2 border-b-2 border-[#F59E0B] rounded-b-md' : 'border-x-2 border-[#F59E0B]') : ''}`}
                        style={{ backgroundColor: cellBg(cell), color: cellFg(cell) }}
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
          <div className="mt-4 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] p-3.5">
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
    </AppShell>
  )
}
