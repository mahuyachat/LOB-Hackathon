import { useState } from 'react'
import { LayoutDashboard, Send, Megaphone, MessageSquare, Brain, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { id: 'intelligence', label: 'Intelligence Dashboards', icon: LayoutDashboard, expandable: false },
  { id: 'survey', label: 'Survey Campaigns', icon: Send, expandable: false },
  { id: 'campaign', label: 'Campaign Manager', icon: Megaphone, expandable: false },
  { id: 'interactions', label: 'Interactions', icon: MessageSquare, expandable: false },
  { id: 'models', label: 'Models', icon: Brain, expandable: true },
]

interface SidebarPanelProps {
  open: boolean
  onToggle: () => void
}

export function SidebarPanel({ open }: SidebarPanelProps) {
  const [selected, setSelected] = useState('intelligence')
  const [modelsOpen, setModelsOpen] = useState(false)

  return (
    <div
      className={cn(
        'flex flex-col flex-shrink-0 bg-white overflow-hidden transition-all duration-200 ease-in-out border-r border-[#E2E8F0]',
        open ? 'w-[220px]' : 'w-[52px]'
      )}
    >
      {/* Spacer */}
      <div className="h-2 flex-shrink-0" />

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-1.5 flex-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const isSelected = selected === item.id
          const isModels = item.id === 'models'

          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  setSelected(item.id)
                  if (isModels) setModelsOpen(o => !o)
                }}
                title={!open ? item.label : undefined}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 transition-colors',
                  isSelected
                    ? 'bg-[#EFF6FF] text-[#126bce] font-medium'
                    : 'text-[#334155] hover:bg-[#F8FAFC]'
                )}
              >
                <Icon className={cn('h-[15px] w-[15px] flex-shrink-0', isSelected ? 'text-[#126bce]' : 'text-[#64748B]')} strokeWidth={1.75} />
                {open && (
                  <>
                    <span className="flex-1 text-left text-[13px] whitespace-nowrap">{item.label}</span>
                    {item.expandable && (
                      modelsOpen
                        ? <ChevronDown className="h-3 w-3 text-[#94A3B8] flex-shrink-0" />
                        : <ChevronRight className="h-3 w-3 text-[#94A3B8] flex-shrink-0" />
                    )}
                  </>
                )}
              </button>
            </div>
          )
        })}
      </nav>
    </div>
  )
}
