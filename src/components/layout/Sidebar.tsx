import { useState } from 'react'
import { LayoutDashboard, MessageSquare, BarChart2, Settings, ChevronRight, ChevronDown, Search, PanelLeftClose, PanelLeftOpen, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const RAIL_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboards' },
  { icon: MessageSquare, label: 'Feedback' },
  { icon: BarChart2, label: 'Analytics' },
  { icon: Settings, label: 'Settings' },
]
const ACTIVE_INDEX = 0

interface FolderItem {
  name: string
  children?: string[]
}

const NAV_TREE: FolderItem[] = [
  { name: 'Folder Name', children: ['Dashboard name', 'Dashboard name', 'Dashboard name'] },
  { name: 'Folder Name', children: ['Dashboard name', 'Dashboard name'] },
  { name: 'Folder Name', children: ['Dashboard name', 'Dashboard name', 'Dashboard name', 'Dashboard name'] },
  { name: 'Folder Name', children: ['Dashboard name'] },
]

function FolderRow({
  folder,
  defaultOpen = false,
  selectedItem,
  onSelect,
}: {
  folder: FolderItem
  defaultOpen?: boolean
  selectedItem: string | null
  onSelect: (name: string) => void
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
      >
        {open
          ? <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
          : <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />}
        <span className="truncate">{folder.name}</span>
      </button>
      {open && folder.children && (
        <div className="ml-[18px] border-l border-border">
          {folder.children.map((child, i) => (
            <button
              key={i}
              onClick={() => onSelect(child)}
              className={cn(
                'flex w-full items-center rounded-md pl-3 pr-2 py-1.5 text-sm transition-colors text-left',
                selectedItem === child
                  ? 'bg-primary-50 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <span className="truncate">{child}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface SidebarProps {
  expanded: boolean
  onToggle: () => void
}

export function Sidebar({ expanded, onToggle }: SidebarProps) {
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const filtered = NAV_TREE.filter(f =>
    !search ||
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.children?.some(c => c.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <aside
      className={cn(
        'flex flex-shrink-0 flex-col bg-sidebar overflow-hidden transition-all duration-200 ease-in-out border-r border-[#E2E8F0]',
        expanded ? 'w-[220px]' : 'w-[52px]'
      )}
    >
      {/* Collapsed: icon rail */}
      {!expanded && (
        <div className="flex flex-col items-center gap-1 py-2">
          <button
            onClick={onToggle}
            title="Expand sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors mb-1 outline-none focus:outline-none"
          >
            <PanelLeftOpen className="h-[18px] w-[18px]" />
          </button>
          {RAIL_ITEMS.map((item, i) => {
            const Icon = item.icon
            const active = i === ACTIVE_INDEX
            return (
              <button
                key={i}
                title={item.label}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg transition-colors outline-none focus:outline-none',
                  active
                    ? 'bg-primary-50 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </button>
            )
          })}
        </div>
      )}

      {/* Expanded: full panel */}
      {expanded && (
        <>
          {/* Header */}
          <div className="flex h-[52px] items-center justify-between pl-3 pr-2 flex-shrink-0">
            <span className="text-[13px] font-medium text-foreground">Dashboards</span>
            <div className="flex items-center gap-0.5">
              <button
                title="New dashboard"
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={onToggle}
                title="Collapse sidebar"
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors outline-none focus:outline-none"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="px-3 pb-3 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-7 w-full rounded-md border border-[#E2E8F0] bg-card pl-8 pr-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Nav tree */}
          <nav className="flex-1 overflow-y-auto pb-2">
            {!search && (
              <div className="flex items-center justify-between px-3 pb-1">
                <span className="text-[11px] font-semibold tracking-wide text-muted-foreground/70">
                  Saved
                </span>
                <button
                  title="New saved item"
                  className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            )}
            <div className="px-2">
              {filtered.map((folder, i) => (
                <FolderRow
                  key={i}
                  folder={folder}
                  defaultOpen={i === 0}
                  selectedItem={selectedItem}
                  onSelect={setSelectedItem}
                />
              ))}
            </div>
          </nav>
        </>
      )}
    </aside>
  )
}
