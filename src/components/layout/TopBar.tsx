import { HelpCircle, Bell, ChevronDown, LayoutGrid } from 'lucide-react'

export function TopBar() {
  return (
    <header className="flex h-12 items-center justify-between bg-[#F8FAFC] px-4 flex-shrink-0 w-full">
      {/* Left: logo + app name */}
      <div className="flex items-center gap-2">
        <img src="/blue_smile.svg" alt="Logo" className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm font-medium text-foreground">Feedback Intelligence</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      {/* Right: utilities */}
      <div className="flex items-center gap-1">
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <HelpCircle className="h-[18px] w-[18px]" />
        </button>

        <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <LayoutGrid className="h-[18px] w-[18px]" />
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
