import { AppShell } from '../components/layout/AppShell'
import { ArrowRight, Sparkles, Users } from 'lucide-react'

export function LandingPage({ onSelectFlow }: { onSelectFlow: (flow: 'feedback' | 'agent' | 'prototype') => void }) {
  const handleFeedbackClick = () => {
    onSelectFlow('prototype')
  }
  return (
    <AppShell title="Feedback Intelligence" breadcrumb={[]}>
      <div className="p-8 bg-[#F8FAFC] flex-1 flex items-center justify-center">
        <div className="max-w-5xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#0F172A]">Feedback Intelligence</h1>
            <p className="text-base text-[#64748B] mt-2">Choose your intelligence flow</p>
          </div>

          {/* Two flow cards */}
          <div className="grid grid-cols-2 gap-6">
            {/* Feedback Intelligence Flow */}
            <button
              onClick={handleFeedbackClick}
              className="group rounded-xl border-2 border-[#E5E7EB] bg-white p-8 text-left hover:border-[#378ADD] hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EFF6FF]">
                  <Sparkles className="h-6 w-6 text-[#378ADD]" />
                </div>
                <ArrowRight className="h-5 w-5 text-[#94A3B8] group-hover:text-[#378ADD] group-hover:translate-x-1 transition-all" />
              </div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-2">Feedback Intelligence</h2>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Analyze customer feedback patterns, detect hidden friction, and understand what's driving satisfaction scores across interactions.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[#DCFCE7] px-2.5 py-1 text-xs font-medium text-[#15803D]">
                  Dashboard
                </span>
                <span className="inline-flex items-center rounded-full bg-[#DCFCE7] px-2.5 py-1 text-xs font-medium text-[#15803D]">
                  Analysis
                </span>
                <span className="inline-flex items-center rounded-full bg-[#DCFCE7] px-2.5 py-1 text-xs font-medium text-[#15803D]">
                  Cohorts
                </span>
              </div>
            </button>

            {/* Agent Flow */}
            <button
              onClick={() => onSelectFlow('agent')}
              className="group rounded-xl border-2 border-[#E5E7EB] bg-white p-8 text-left hover:border-[#378ADD] hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EFF6FF]">
                  <Users className="h-6 w-6 text-[#378ADD]" />
                </div>
                <ArrowRight className="h-5 w-5 text-[#94A3B8] group-hover:text-[#378ADD] group-hover:translate-x-1 transition-all" />
              </div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-2">Agent Flow</h2>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Track agent performance, identify coaching opportunities, and understand how individual agents contribute to customer experience.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-medium text-[#92400E]">
                  Coming soon
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
