import { X, Sparkles, Send } from 'lucide-react'

interface AiAssistantPanelProps {
  open: boolean
  onClose: () => void
}

const SUGGESTIONS = [
  'Create an AI Agent',
  'See what has changed since yesterday',
  'How can I manually configure AI Agents?',
]

export function AiAssistantPanel({ open, onClose }: AiAssistantPanelProps) {
  if (!open) return null

  return (
    <div className="flex h-full w-full flex-col bg-card">
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-border px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Empty state */}
      <div className="flex flex-1 flex-col items-center justify-start gap-3 px-6 pt-16">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">How can I help you today?</h3>
        <p className="text-center text-xs text-muted-foreground leading-relaxed max-w-[260px]">
          Ask about agent performance, trends, anomalies, automation opportunities, or how to get started.
        </p>

        {/* Suggestion chips */}
        <div className="mt-6 flex w-full flex-col gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5 text-left text-xs text-foreground hover:bg-accent transition-colors"
            >
              <span>{s}</span>
              <span className="text-muted-foreground">›</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-border p-3">
        <div className="rounded-lg border border-border bg-background px-3 pt-2.5 pb-2">
          <input
            type="text"
            placeholder="Ask Anything..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none mb-2"
          />
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              Sonnet 4.6
            </span>
            <button className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
          AI assistant can make mistakes, double-check responses.
        </p>
      </div>
    </div>
  )
}
