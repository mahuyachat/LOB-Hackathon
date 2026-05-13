import { Sparkles, ChevronDown, PanelLeftClose } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  breadcrumb?: string[]
  title: string
  onAskAi?: () => void
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
}

export function PageHeader({ breadcrumb = [], title, onAskAi, onToggleSidebar, sidebarOpen = true }: PageHeaderProps) {
  return (
    <div className="flex h-12 items-center justify-between border-b border-[#F1F5F9] bg-white px-4 flex-shrink-0">
      {/* Left: collapse toggle + breadcrumb + title */}
      <div className="flex items-center gap-1.5 text-sm">
        <button
          onClick={onToggleSidebar}
          title="Toggle sidebar"
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#64748B] transition-colors outline-none focus:outline-none flex-shrink-0"
        >
          <PanelLeftClose className={cn('h-4 w-4 transition-transform', !sidebarOpen && 'scale-x-[-1]')} />
        </button>
        {breadcrumb.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-[#64748B] hover:text-[#334155] cursor-pointer">{item}</span>
            <span className="text-[#94A3B8]">/</span>
          </span>
        ))}
        <h1 className="text-sm font-semibold text-[#1E293B]">{title}</h1>
      </div>

      {/* Right: filters + Ask AI */}
      <div className="flex items-center gap-2">
        <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white px-3 text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] transition-colors">
          <span>Last 7 days</span>
          <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
        </button>
        <div className="h-5 w-px bg-[#E2E8F0]" />
        <button
          onClick={onAskAi}
          className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-[#378ADD] hover:bg-[#EFF6FF] transition-colors outline-none focus:outline-none"
          title="Ask AI"
        >
          <Sparkles className="h-4 w-4" />
          <span>Ask AI</span>
        </button>
      </div>
    </div>
  )
}
