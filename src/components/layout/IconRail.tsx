import { Box } from 'lucide-react'
import { cn } from '@/lib/utils'

const RAIL_ITEMS = [{ icon: Box }, { icon: Box }, { icon: Box }, { icon: Box }, { icon: Box }]
const ACTIVE_INDEX = 1

export function IconRail() {
  return (
    <div className="flex w-12 flex-shrink-0 flex-col items-center pt-3 gap-1 bg-[#F8FAFC]">
      {RAIL_ITEMS.map((item, i) => {
        const Icon = item.icon
        const active = i === ACTIVE_INDEX
        return (
          <div key={i} className="relative flex items-center justify-center">
            {active && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-sm bg-[#378ADD]" />
            )}
            <button
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg transition-colors outline-none focus:outline-none focus-visible:outline-none',
                active
                  ? 'bg-[#DBEAFE] text-[#378ADD]'
                  : 'text-[#94A3B8] hover:bg-[#EFF2F7] hover:text-[#64748B]'
              )}
            >
              <Icon className="h-5 w-5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
