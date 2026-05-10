import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { IconRail } from './IconRail'
import { SidebarPanel } from './SidebarPanel'
import { TopBar } from './TopBar'
import { PageHeader } from './PageHeader'
import { AiAssistantPanel } from './AiAssistantPanel'

interface AppShellProps {
  children: React.ReactNode
  title?: string
  breadcrumb?: string[]
}

export function AppShell({ children, title = 'Dashboard', breadcrumb = ['Dashboards with Screen Intelligence'] }: AppShellProps) {
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#F8FAFC]">
      <TopBar />

      {/* Body row */}
      <div className="relative flex flex-1 overflow-hidden p-2 pl-0 gap-2">
        {/* ① Icon rail — sits on the gray surface */}
        <IconRail />

        {/* Floating chevron handle */}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          title={panelOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="absolute left-[42px] top-[26px] z-20 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#334155] shadow-sm transition-colors outline-none focus:outline-none"
        >
          <ChevronRight className="h-3 w-3" />
        </button>

        {/* ② + ③ Single white card containing sidebar panel + main content */}
        <div className="flex flex-1 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white min-w-0">
          {/* Sidebar panel inside the card */}
          <SidebarPanel open={panelOpen} onToggle={() => setPanelOpen(!panelOpen)} />

          {/* Main content */}
          <div className="flex flex-1 flex-col overflow-hidden min-w-0">
            <PageHeader
              title={title}
              breadcrumb={breadcrumb}
              onAskAi={() => setAiPanelOpen(!aiPanelOpen)}
              onToggleSidebar={() => setPanelOpen(!panelOpen)}
            />
            <main className="flex-1 overflow-auto bg-[#F8FAFC]">
              {children}
            </main>
          </div>
        </div>

        {/* AI Assistant panel */}
        {aiPanelOpen && (
          <div className="w-[360px] flex-shrink-0">
            <div className="h-full rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              <AiAssistantPanel open={aiPanelOpen} onClose={() => setAiPanelOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
