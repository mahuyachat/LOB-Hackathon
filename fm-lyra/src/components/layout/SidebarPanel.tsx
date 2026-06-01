import { useState } from 'react'
import { ChevronRight, ChevronDown, Search, Plus, PanelLeftClose } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FolderItem {
  name: string
  children?: string[]
}

const NAV_TREE: FolderItem[] = [
  { name: 'Folder Name' },
  { name: 'Folder Name' },
  { name: 'Folder Name', children: ['Dashboard name', 'Dashboard name', 'Dashboard name'] },
  { name: 'Folder Name' },
]

function FolderRow({
  folder,
  defaultOpen = false,
}: {
  folder: FolderItem
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const hasChildren = folder.children && folder.children.length > 0

  return (
    <div>
      <button
        onClick={() => hasChildren && setOpen(!open)}
        className="flex w-full items-center gap-2 py-1.5 px-3 text-sm text-[#334155] hover:bg-[#F8FAFC] transition-colors"
      >
        {hasChildren ? (
          open
            ? <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-[#94A3B8]" />
            : <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-[#94A3B8]" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-[#94A3B8]" />
        )}
        <span>{folder.name}</span>
      </button>
      {open && folder.children && (
        <div className="pl-9">
          {folder.children.map((child, i) => (
            <button
              key={i}
              className="flex w-full items-center py-1.5 px-3 text-sm text-[#334155] hover:bg-[#F8FAFC] transition-colors text-left"
            >
              <span>{child}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface SidebarPanelProps {
  open: boolean
  onToggle: () => void
}

export function SidebarPanel({ open, onToggle }: SidebarPanelProps) {
  const [search, setSearch] = useState('')
  const [savedOpen, setSavedOpen] = useState(true)

  const filtered = NAV_TREE.filter(f =>
    !search ||
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.children?.some(c => c.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div
      className={cn(
        'flex flex-col flex-shrink-0 bg-white overflow-hidden transition-all duration-200 ease-in-out',
        open ? 'w-[210px] border-r border-[#E2E8F0]' : 'w-0'
      )}
    >
      {/* Header — aligned with breadcrumb row height */}
      <div className="flex h-12 items-center justify-between pl-2 pr-2 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggle}
            title="Collapse panel"
            className="flex h-5 w-5 items-center justify-center text-[#94A3B8] hover:text-[#64748B] transition-colors outline-none focus:outline-none"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
          <span className="text-base font-semibold text-[#1E293B] whitespace-nowrap">Dashboard</span>
        </div>
        <button
          onClick={onToggle}
          title="Close panel"
          className="flex h-6 w-6 items-center justify-center rounded-md text-[#94A3B8] hover:text-[#64748B] transition-colors outline-none focus:outline-none"
        >
          <PanelLeftClose className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-3 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8] pointer-events-none" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-8 w-full rounded-md border border-[#E2E8F0] bg-white pl-8 pr-2 text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#378ADD]"
          />
        </div>
      </div>

      {/* Saved section */}
      <div className="flex items-center justify-between px-2 pb-1.5 flex-shrink-0">
        <button
          onClick={() => setSavedOpen(!savedOpen)}
          className="flex items-center gap-1 text-[#64748B] hover:text-[#334155] transition-colors outline-none focus:outline-none"
        >
          {savedOpen
            ? <ChevronDown className="h-3 w-3" />
            : <ChevronRight className="h-3 w-3" />}
          <span className="text-[12px] font-medium">Saved</span>
        </button>
        <button
          title="Add new"
          className="flex h-5 w-5 items-center justify-center text-[#94A3B8] hover:text-[#64748B] transition-colors outline-none focus:outline-none"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Folder tree */}
      {savedOpen && (
        <nav className="flex-1 overflow-y-auto pb-2">
          {filtered.map((folder, i) => (
            <FolderRow
              key={i}
              folder={folder}
              defaultOpen={i === 2}
            />
          ))}
        </nav>
      )}
    </div>
  )
}
