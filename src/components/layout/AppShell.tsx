import { useState } from 'react'
import { SidebarPanel } from './SidebarPanel'
import { TopBar } from './TopBar'
import { PageHeader } from './PageHeader'
import { AiAssistantPanel } from './AiAssistantPanel'

interface AppShellProps {
  children: React.ReactNode
  title?: string
  breadcrumb?: string[]
}

export function AppShell({ children, title = 'Dashboard', breadcrumb = ['Feedback Intelligence'] }: AppShellProps) {
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(true)

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#F8FAFC]">
      <TopBar />

      {/* Body row */}
      <div className="flex flex-1 overflow-hidden p-2 pl-2 gap-2">
        {/* White card containing sidebar + main content */}
        <div className="flex flex-1 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white min-w-0">
          {/* Sidebar panel */}
          <SidebarPanel open={panelOpen} onToggle={() => setPanelOpen(!panelOpen)} />

          {/* Main content */}
          <div className="flex flex-1 flex-col overflow-hidden min-w-0">
            <PageHeader
              title={title}
              breadcrumb={breadcrumb}
              onAskAi={() => setAiPanelOpen(!aiPanelOpen)}
              onToggleSidebar={() => setPanelOpen(!panelOpen)}
              sidebarOpen={panelOpen}
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
