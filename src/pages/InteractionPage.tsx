import { Sparkles, AlertTriangle, Play, Check, ArrowRight } from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'

const VU_SCORES = [
  { intent: 'Agent Resolution', score: '+68', color: '#16A34A', description: 'Rachel resolved the issue cleanly — refund processed, bundle removed, account protected.' },
  { intent: 'Bot Transfer Impact', score: '-52', color: '#DC2626', description: 'The bot-to-human handoff created friction. Billing policy changes impacted the routing, triggering the transfer.' },
  { intent: 'System Listening', score: '-38', color: '#DC2626', description: 'Customer felt unheard during the bot phase — repeated the issue twice before transfer.' },
  { intent: 'Issue Clarity', score: '-34', color: '#DC2626', description: 'The unauthorized charge wasn\'t immediately surfaced by the system — customer had to explain.' },
]

const VALIDATED_FEEDBACK = [
  { label: 'Rating', value: '3/5 ★★★☆☆' },
  { label: 'Campaign', value: 'Retention Voice Q2' },
  { label: 'Q1', value: 'Was your issue resolved?' },
  { label: 'Answer 1', value: 'Yes' },
  { label: 'Q2', value: 'How would you rate your overall experience?' },
  { label: 'Answer 2', value: '3 — Neutral' },
  { label: 'Customer comment', value: '"Rachel was patient and walked me through the duplicate charge step by step. Refund showed up the same day. Really appreciated the follow-up email."', isComment: true },
  { label: 'FI signal', value: 'Bot Transfer Impact — handoff friction detected' },
  { label: 'Confidence', value: '100/100' },
]

export function InteractionPage({ onBack, onBackToAnalysis }: { onBack: () => void; onBackToAnalysis: () => void }) {
  return (
    <AppShell title="Interaction" breadcrumb={['Screen Intelligence', 'Dashboard', 'Analysis', 'Cohort']}>
      <div className="p-5 bg-[#F8FAFC] space-y-5">
        {/* Back link */}
        <button onClick={onBack} className="text-sm font-medium text-[#2563EB] hover:underline">
          ← Back to cohort
        </button>

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#0F172A]">Interaction Survey Result</h1>
            <p className="font-mono text-xs text-[#64748B] mt-0.5">ID: 1c4fa089-d0c2-4157-ad35-b519bd0a2964</p>
            <p className="text-xs text-[#64748B] mt-1">7/05/2026 · 8:21 PM · Voice · Retention Voice Q2 · James Carter → Rachel Whitman (Retention Unit)</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors">
              <Play className="h-3.5 w-3.5" /> Play Interaction
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#378ADD] hover:bg-[#EFF6FF] transition-colors">
              <Sparkles className="h-3.5 w-3.5" /> Ask AI
            </button>
          </div>
        </div>

        {/* Act 1 — The Verdict */}
        <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#991B1B]">THE VERDICT</div>
          <div className="mt-1 text-base font-semibold text-[#0F172A] max-w-[900px]">
            The customer rated 3/5. The agent earned +68. The friction wasn't Rachel — it was the handoff.
          </div>

          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="rounded-md border border-[#FECACA] bg-white p-3.5 text-center">
              <div className="text-2xl font-bold text-[#DC2626]">3/5</div>
              <div className="text-[11px] text-[#64748B] mt-1">customer rating</div>
            </div>
            <div className="rounded-md border border-[#FECACA] bg-white p-3.5 text-center">
              <div className="text-2xl font-bold text-[#16A34A]">+68</div>
              <div className="text-[11px] text-[#64748B] mt-1">agent FI signal</div>
            </div>
            <div className="rounded-md border border-[#FECACA] bg-white p-3.5 text-center">
              <div className="text-2xl font-bold text-[#DC2626]">-52</div>
              <div className="text-[11px] text-[#64748B] mt-1">handoff VU</div>
            </div>
            <div className="rounded-md border border-[#FECACA] bg-white p-3.5 text-center">
              <div className="text-2xl font-bold text-[#0F172A]">100/100</div>
              <div className="text-[11px] text-[#64748B] mt-1">validation score</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-[#475569]">
            Member of <button onClick={onBack} className="text-[#2563EB] hover:underline">Call Transfer Impact cohort</button> · <span className="font-bold text-[#0F172A]">890 like this case</span>
          </div>
        </div>

        {/* Acts 2 + 3 — Two-column layout */}
        <div className="grid grid-cols-2 gap-5">
          {/* Act 2 — VU score by intent */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
            <div className="text-sm font-semibold text-[#0F172A] mb-4">VU score by intent</div>
            <div className="space-y-3">
              {VU_SCORES.map((item, i) => (
                <div key={i} className="rounded-md border border-[#E5E7EB] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-[#0F172A]">{item.intent}</span>
                    <span className="text-base font-bold" style={{ color: item.color }}>{item.score}</span>
                  </div>
                  <div className="mt-1.5 text-xs text-[#64748B] leading-relaxed">{item.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Act 3 — Validated feedback */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
            <div className="text-sm font-semibold text-[#0F172A] mb-4">Validated feedback</div>
            <div className="space-y-0">
              {VALIDATED_FEEDBACK.map((item, i) => (
                <div key={i} className="flex border-b border-[#F1F5F9] last:border-b-0 py-2.5">
                  <div className="w-[100px] flex-shrink-0 text-xs font-medium text-[#64748B]">{item.label}</div>
                  <div className={`text-xs text-[#0F172A] flex-1 ${item.isComment ? 'italic text-[#475569]' : ''}`}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Act 4 — How this call unfolded */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-6">
          <div className="text-base font-semibold text-[#0F172A]">How this call unfolded</div>
          <div className="text-xs text-[#64748B] mt-1">The narrative arc of James's call, stage by stage</div>

          <div className="mt-5 space-y-4">
            {/* Stage 1 */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] text-sm font-semibold text-[#0F172A]">1</div>
              <div>
                <div className="text-sm font-semibold text-[#0F172A]">Bot Engagement</div>
                <div className="mt-1 text-[13px] text-[#475569] leading-relaxed">James called about an unauthorized $87 charge on his bill. Andrew (AI agent) began handling the inquiry.</div>
              </div>
            </div>
            {/* Stage 2 */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FEE2E2] text-sm font-semibold text-[#991B1B]">2</div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-[#DC2626]">The Friction Point</span>
                  <AlertTriangle className="h-3.5 w-3.5 text-[#DC2626]" />
                </div>
                <div className="mt-1 text-[13px] text-[#475569] leading-relaxed">AI billing routing didn't apply (recent billing policy changes impacted the routing). Andrew transferred the call to a human agent — and James had to re-explain the entire $87 charge dispute from scratch. <span className="font-bold text-[#0F172A]">Sentiment shifted: Positive → Neutral.</span></div>
              </div>
            </div>
            {/* Stage 3 */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-sm font-semibold text-[#166534]">3</div>
              <div>
                <div className="text-sm font-semibold text-[#0F172A]">Human Resolution</div>
                <div className="mt-1 text-[13px] text-[#475569] leading-relaxed">Rachel (Retention Unit) refunded the charge, removed the bundle, and added account protection so it doesn't happen again. James thanked her: "you've been fantastic."</div>
              </div>
            </div>
            {/* Stage 4 */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FEF3C7] text-sm font-semibold text-[#92400E]">4</div>
              <div>
                <div className="text-sm font-semibold text-[#0F172A]">Outcome — Rating Mismatch</div>
                <div className="mt-1 text-[13px] text-[#475569] leading-relaxed">Despite Rachel's clean resolution (+68 agent FI signal), James rated 3/5. The friction signal points to <span className="font-bold text-[#0F172A]">the handoff — not the human agent's performance</span>.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Act 5 — What FI did with this signal */}
        <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#D97706]" />
            <span className="text-base font-semibold text-[#0F172A]">What Feedback Intelligence did with this signal</span>
          </div>
          <div className="text-xs text-[#64748B] mt-1">Five steps from raw interaction to system-level action</div>

          <div className="mt-4 space-y-2.5">
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
              <span className="text-[13px] text-[#0F172A]">Diagnosed: <span className="font-semibold">handoff friction</span>, not agent performance</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
              <span className="text-[13px] text-[#0F172A]">Validated: <span className="font-semibold">100/100 confidence</span> — customer's own comment confirms the diagnosis</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
              <span className="text-[13px] text-[#0F172A]">Tagged: added to <span className="font-semibold">Call Transfer Impact cohort</span> (890 like cases)</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
              <span className="text-[13px] text-[#0F172A]">Surfaced: contributed to <span className="font-semibold">cluster pattern detection</span> on the dashboard</span>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-[#D97706] flex-shrink-0 mt-0.5" />
              <span className="text-[13px] text-[#475569]">Pending: <span className="font-semibold text-[#0F172A]">scoring review</span> (recommended on the analysis page)</span>
            </div>
          </div>
        </div>

        {/* Act 6 — Next Actions */}
        <div className="flex items-center justify-center gap-4 py-4">
          <button onClick={onBackToAnalysis} className="inline-flex items-center rounded-lg border border-[#CBD5E1] bg-white px-4.5 py-2.5 text-[13px] text-[#475569] hover:bg-[#F1F5F9] transition-colors">
            ← Back to analysis
          </button>
          <button className="inline-flex items-center rounded-lg bg-[#16A34A] px-4.5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#15803D] transition-colors">
            Add to scoring review
          </button>
          <button onClick={onBack} className="inline-flex items-center rounded-lg border border-[#CBD5E1] bg-white px-4.5 py-2.5 text-[13px] text-[#475569] hover:bg-[#F1F5F9] transition-colors">
            ← Back to cohort
          </button>
        </div>
      </div>
    </AppShell>
  )
}
