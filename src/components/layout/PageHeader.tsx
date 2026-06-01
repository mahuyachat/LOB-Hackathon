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
        {/* Breadcrumb = path only. The page's big H1 carries the title, so we
           do not repeat it here (avoids the title showing twice). */}
        {breadcrumb.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-[#94A3B8]">/</span>}
            <span className={cn(
              i === breadcrumb.length - 1 ? 'text-[#1E293B] font-semibold' : 'text-[#64748B] hover:text-[#334155] cursor-pointer'
            )}>{item}</span>
          </span>
        ))}
      </div>

      {/* Right side - empty for now */}
      <div className="flex items-center gap-2">
        {/* Reserved for future actions */}
      </div>
    </div>
  )
}
