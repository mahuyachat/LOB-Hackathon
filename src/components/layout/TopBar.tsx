import { useRef, useState, useEffect } from 'react'
import { HelpCircle, Bell, ChevronDown, MessageSquareText, Users, BarChart2, ClipboardCheck, Headphones } from 'lucide-react'

const APPS = [
  { id: 'feedback', label: 'Feedback Intelligence', icon: MessageSquareText, current: true },
  { id: 'quality', label: 'Quality Management', icon: ClipboardCheck, current: false },
  { id: 'workforce', label: 'Workforce Management', icon: Users, current: false },
  { id: 'analytics', label: 'Analytics', icon: BarChart2, current: false },
  { id: 'agent', label: 'Agent Desktop', icon: Headphones, current: false },
]

export function TopBar() {
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setAppSwitcherOpen(false)
      }
    }
    if (appSwitcherOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [appSwitcherOpen])

  return (
    <header className="flex h-12 items-center justify-between bg-[#F8FAFC] px-4 flex-shrink-0 w-full">
      {/* Left: logo + app name — clicking opens the app switcher */}
      <div ref={switcherRef} className="relative">
        <button
          onClick={() => setAppSwitcherOpen(o => !o)}
          className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-accent transition-colors"
        >
          <img src="/blue_smile.svg" alt="Logo" className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium text-foreground">Feedback Intelligence</span>
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${appSwitcherOpen ? 'rotate-180' : ''}`} />
        </button>

        {appSwitcherOpen && (
          <div className="absolute left-0 top-10 z-50 w-56 rounded-xl border border-[#E2E8F0] bg-white shadow-lg overflow-hidden">
            <div className="px-3 py-2.5 border-b border-[#F1F5F9]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">CXone Apps</p>
            </div>
            <ul className="p-1.5 flex flex-col gap-0.5">
              {APPS.map(app => {
                const Icon = app.icon
                return (
                  <li key={app.id}>
                    <button
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${app.current ? 'bg-[#EFF6FF] text-[#1D4ED8]' : 'text-[#334155] hover:bg-[#F8FAFC]'}`}
                      onClick={() => setAppSwitcherOpen(false)}
                    >
                      <Icon className={`h-4 w-4 flex-shrink-0 ${app.current ? 'text-[#378ADD]' : 'text-[#94A3B8]'}`} />
                      <span className="flex-1 font-medium">{app.label}</span>
                      {app.current && (
                        <span className="text-[10px] font-semibold text-[#378ADD]">Active</span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Right: utilities */}
      <div className="flex items-center gap-1">
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <HelpCircle className="h-[18px] w-[18px]" />
        </button>

        <button className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white leading-none">
            5
          </span>
        </button>

        <div className="ml-1 flex items-center gap-1 cursor-pointer">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground select-none">
            JS
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
    </header>
  )
}
