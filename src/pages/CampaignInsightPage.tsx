import { ArrowLeft, Sparkles } from 'lucide-react'
import type { Campaign } from '@/lib/campaigns'
import { CampaignInsightDashboard } from '@/components/feedback-intelligence/CampaignInsightDashboard'

/* ============================================================
 * Campaign Insight page — full-page Level 3 view that renders
 * the snapshot dashboard from MVP-Version's last commit.
 * Reached from "View Campaign Insight" on the per-campaign view.
 * ============================================================ */
export function CampaignInsightPage({
  campaign,
  onBack,
}: {
  campaign?: Campaign
  onBack: () => void
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <div className="bg-white border-b border-[#e2e8f0] px-6 lg:px-8 py-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[12px] font-medium text-[#64748b] hover:text-[#0f172a] mb-3 outline-none focus:outline-none transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to campaign dashboard
        </button>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4f46e5] mb-1">
              <Sparkles className="h-3 w-3" fill="#6366f1" />
              Campaign Insight
            </div>
            <h1 className="text-[24px] font-semibold text-[#0f172a] leading-tight">
              {campaign ? campaign.name : 'Campaign Insight'}
            </h1>
          </div>
        </div>
      </div>

      <div className="p-6 lg:px-8 flex-1">
        <CampaignInsightDashboard />
      </div>
    </div>
  )
}
