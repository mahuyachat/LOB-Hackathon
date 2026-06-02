import { ArrowRight, Users, Sparkles } from 'lucide-react'
import { AnimatedSmile } from '../components/AnimatedSmile'

export function LandingPage({ onSelectFlow }: { onSelectFlow: (flow: 'admin' | 'agent') => void }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top Navigation */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex items-center gap-2">
          <AnimatedSmile size={24} />
          <span className="text-base font-semibold text-[#0F172A]">Feedback Intelligence</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-8 pt-24">
        {/* Page title — C26 sans (Geist) */}
        <div className="w-full max-w-5xl mb-12 text-center">
          <h1
            className="text-[#0F172A] tracking-tight font-bold"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '56px',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            Feedback Intelligence
          </h1>
        </div>

        <div className="max-w-4xl w-full">

          {/* Two flow cards */}
          <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Agent Flow */}
            <button
              onClick={() => onSelectFlow('agent')}
              className="group rounded-xl border-2 border-[#E5E7EB] bg-white p-8 text-left hover:border-[#378ADD] hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#378ADD]" />
                  <h2 className="text-xl font-bold text-[#0F172A]">Agent Flow</h2>
                </div>
                <ArrowRight className="h-5 w-5 text-[#94A3B8] group-hover:text-[#378ADD] group-hover:translate-x-1 transition-all" />
              </div>
            </button>

            {/* Feedback Intelligence Flow → Admin first, then app-switcher to FI */}
            <button
              onClick={() => onSelectFlow('admin')}
              className="group rounded-xl border-2 border-[#E5E7EB] bg-white p-8 text-left hover:border-[#378ADD] hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#378ADD]" />
                  <h2 className="text-xl font-bold text-[#0F172A]">Feedback Intelligence</h2>
                </div>
                <ArrowRight className="h-5 w-5 text-[#94A3B8] group-hover:text-[#378ADD] group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
