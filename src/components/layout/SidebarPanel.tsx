import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { LayoutGrid, Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SidebarNavItem = { id: string; label: string; icon: LucideIcon }

const DEFAULT_NAV_ITEMS: SidebarNavItem[] = [
  { id: 'dashboard', label: 'Dashboard',        icon: LayoutGrid },
  { id: 'campaign',  label: 'Campaign Manager', icon: Megaphone },
]

interface SidebarPanelProps {
  open: boolean
  onToggle: () => void
  /** Optional nav items. Falls back to the default Dashboard / Campaign Manager. */
  items?: SidebarNavItem[]
  /** Controlled active item id. Falls back to internal selection state. */
  activeKey?: string
  /** Fires when a nav item is clicked. */
  onSelect?: (id: string) => void
}

export function SidebarPanel({ open, items, activeKey, onSelect }: SidebarPanelProps) {
  const navItems = items ?? DEFAULT_NAV_ITEMS
  const [internalSelected, setInternalSelected] = useState(navItems[0]?.id ?? '')
  const selected = activeKey ?? internalSelected

  return (
    <div
      className={cn(
        'flex flex-col flex-shrink-0 bg-white overflow-hidden transition-all duration-200 ease-in-out border border-[#E2E8F0] rounded-xl',
        open ? 'w-[220px]' : 'w-[52px]'
      )}
    >
      {/* Spacer */}
      <div className="h-3 flex-shrink-0" />

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 px-1.5 flex-1">
        {navItems.map(item => {
          const Icon = item.icon
          const isSelected = selected === item.id

          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  setInternalSelected(item.id)
                  onSelect?.(item.id)
                }}
                title={!open ? item.label : undefined}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors',
                  isSelected
                    ? 'bg-[#EFF6FF] text-[#126bce] font-medium'
                    : 'text-[#334155] hover:bg-[#F8FAFC]'
                )}
              >
                <Icon className={cn('h-4 w-4 flex-shrink-0', isSelected ? 'text-[#126bce]' : 'text-[#64748B]')} />
                {open && (
                  <span className="flex-1 text-left text-sm whitespace-nowrap">{item.label}</span>
                )}
              </button>
            </div>
          )
        })}
      </nav>
    </div>
  )
}
