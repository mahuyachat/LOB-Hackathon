import { ArrowLeft, Star, Sparkles, MessageSquare, Phone, Mail, User, Headset } from 'lucide-react'
import type { Campaign } from '@/lib/campaigns'
import type { Survey, SurveyQuestion, RatingQuestion, OpenQuestion } from '@/lib/surveys'
import { SurveyStatusPill } from '@/components/feedback-intelligence/SurveysList'

/* ============================================================
 * SurveyDetailPage — Level 3 view for an individual survey.
 * Shows customer / interaction / agent context plus the full
 * 3-question Q&A transcript with AI-generation provenance.
 * ============================================================ */
export function SurveyDetailPage({
  survey,
  campaign,
  onBack,
}: {
  survey: Survey
  campaign?: Campaign
  onBack: () => void
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#e2e8f0] px-6 lg:px-8 py-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[12px] font-medium text-[#64748b] hover:text-[#0f172a] mb-3 outline-none focus:outline-none transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to campaign dashboard
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6366f1] mb-1">
              Survey · {survey.id}
            </div>
            <h1 className="text-[24px] font-semibold text-[#0f172a] leading-tight">
              {campaign ? campaign.name : 'Survey detail'}{' '}
              {campaign && <span className="text-[#94a3b8] font-medium">{campaign.version}</span>}
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <SurveyStatusPill status={survey.status} />
              <span className="text-[12px] text-[#94a3b8]">·</span>
              <span className="text-[12px] text-[#64748b]">
                Sent {formatDateTime(survey.surveySentAt)}
              </span>
              {survey.surveyCompletedAt && (
                <>
                  <span className="text-[12px] text-[#94a3b8]">·</span>
                  <span className="text-[12px] text-[#64748b]">
                    Completed {formatDateTime(survey.surveyCompletedAt)}
                  </span>
                </>
              )}
              {survey.csat !== null && (
                <>
                  <span className="text-[12px] text-[#94a3b8]">·</span>
                  <span className="text-[12px] text-[#64748b]">
                    CSAT <span className="font-semibold text-[#0f172a]">{survey.csat}</span>
                  </span>
                </>
              )}
              <span className="text-[12px] text-[#94a3b8]">·</span>
              <span className="text-[12px] text-[#64748b]">
                VU <span className="font-semibold text-[#0f172a]">{survey.vu}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 lg:px-8 space-y-6 flex-1">
        {/* Three-up meta cards */}
        <div className="grid grid-cols-3 gap-4">
          <CustomerCard survey={survey} />
          <InteractionCard survey={survey} />
          <AgentCard survey={survey} />
        </div>

        {/* Survey responses */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-[16px] font-semibold text-[#0f172a]">Survey responses</h2>
            <span className="text-[11px] text-[#94a3b8]">
              3 questions · AI-generated based on interaction signals
            </span>
          </div>
          <div className="space-y-3">
            {survey.questions.map((q, i) => (
              <QuestionCard key={i} index={i + 1} question={q} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

/* ---------- Meta cards ---------- */
function CustomerCard({ survey }: { survey: Survey }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-7 w-7 rounded-full bg-[#eef2ff] flex items-center justify-center">
          <User className="h-3.5 w-3.5 text-[#6366f1]" />
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
          Customer
        </div>
      </div>
      <div className="text-[16px] font-semibold text-[#0f172a] mb-3">{survey.customer.name}</div>
      <div className="space-y-2 text-[12px]">
        <div className="flex items-center gap-2 text-[#475569]">
          <Phone className="h-3 w-3 text-[#94a3b8] flex-shrink-0" />
          <span className="tabular-nums">{survey.customer.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-[#475569]">
          <Mail className="h-3 w-3 text-[#94a3b8] flex-shrink-0" />
          <span className="truncate">{survey.customer.email}</span>
        </div>
      </div>
    </div>
  )
}

function InteractionCard({ survey }: { survey: Survey }) {
  const { interaction } = survey
  const sentimentBg =
    interaction.sentiment > 5
      ? '#dcfce7'
      : interaction.sentiment < -5
      ? '#fee2e2'
      : '#f1f5f9'
  const sentimentText =
    interaction.sentiment > 5
      ? '#15803d'
      : interaction.sentiment < -5
      ? '#b91c1c'
      : '#475569'
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-7 w-7 rounded-full bg-[#eff6ff] flex items-center justify-center">
          <MessageSquare className="h-3.5 w-3.5 text-[#3b82f6]" />
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
          Interaction
        </div>
      </div>
      <div className="text-[13px] font-medium text-[#0f172a] mb-2">
        {formatDateTime(interaction.date)}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-3 text-[12px] text-[#64748b]">
        <span className="inline-flex items-center rounded-md bg-[#eff6ff] px-2 py-0.5 text-[11px] font-medium text-[#1d4ed8]">
          {interaction.channel}
        </span>
        {interaction.durationMinutes > 0 && (
          <>
            <span className="text-[#cbd5e1]">·</span>
            <span>{interaction.durationMinutes}m</span>
          </>
        )}
        <span className="text-[#cbd5e1]">·</span>
        <span
          className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tabular-nums"
          style={{ backgroundColor: sentimentBg, color: sentimentText }}
        >
          Sentiment {interaction.sentiment > 0 ? '+' : ''}
          {interaction.sentiment}
        </span>
      </div>
      <div className="mb-3">
        <div className="text-[10px] font-medium text-[#94a3b8] uppercase tracking-[0.05em] mb-1">
          Topics detected
        </div>
        <div className="flex flex-wrap gap-1.5">
          {interaction.topicsDetected.map(t => (
            <span
              key={t}
              className="inline-flex items-center rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[11px] font-medium text-[#475569]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <p className="text-[12px] text-[#64748b] leading-snug italic">"{interaction.summary}"</p>
    </div>
  )
}

function AgentCard({ survey }: { survey: Survey }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-7 w-7 rounded-full bg-[#f3e8ff] flex items-center justify-center">
          <Headset className="h-3.5 w-3.5 text-[#9333ea]" />
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
          Agent
        </div>
      </div>
      <div className="text-[16px] font-semibold text-[#0f172a] mb-1">{survey.agent.name}</div>
      <div className="text-[12px] text-[#94a3b8] tabular-nums">{survey.agent.id}</div>
    </div>
  )
}

/* ---------- Question cards ---------- */
function QuestionCard({ index, question }: { index: number; question: SurveyQuestion }) {
  if (question.kind === 'rating') {
    return <RatingQuestionCard index={index} question={question} />
  }
  return <OpenQuestionCard index={index} question={question} />
}

function RatingQuestionCard({ index, question }: { index: number; question: RatingQuestion }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-5">
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
            Q{index} · Rating
          </span>
          <TopicChip topic={question.topic} />
        </div>
      </div>
      <p className="text-[14px] font-medium text-[#0f172a] mb-3">{question.prompt}</p>
      <RatingDisplay rating={question.response} max={question.max} />
    </div>
  )
}

function OpenQuestionCard({ index, question }: { index: number; question: OpenQuestion }) {
  const provenance =
    question.generatedFrom.source === 'interaction'
      ? `Generated from interaction sentiment (${formatSigned(
          question.generatedFrom.sentiment
        )}) on topic "${question.generatedFrom.topic ?? question.topic}"`
      : `Generated from your Q${index - 1} response sentiment (${formatSigned(
          question.generatedFrom.sentiment
        )})`

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-5">
      <div className="flex items-baseline justify-between mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
            Q{index} · Open
          </span>
          <TopicChip topic={question.topic} />
          <span className="inline-flex items-center gap-1 rounded-full bg-[#eef2ff] border border-[#c7d2fe] px-2 py-0.5 text-[10px] font-semibold text-[#4f46e5]">
            <Sparkles className="h-2.5 w-2.5" fill="#6366f1" />
            AI-generated
          </span>
        </div>
      </div>
      <p className="text-[11px] text-[#94a3b8] italic mb-2 leading-snug">{provenance}</p>
      <p className="text-[14px] font-medium text-[#0f172a] mb-3">{question.prompt}</p>
      {question.response ? (
        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] px-4 py-3">
          <p className="text-[13px] text-[#0f172a] leading-relaxed">"{question.response}"</p>
          {question.responseSentiment !== null && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[10px] font-medium text-[#94a3b8] uppercase tracking-[0.05em]">
                Response sentiment
              </span>
              <SentimentBadge value={question.responseSentiment} />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#f8fafc] border border-dashed border-[#e2e8f0] rounded-[8px] px-4 py-3">
          <p className="text-[12px] text-[#94a3b8] italic">No response — customer did not answer.</p>
        </div>
      )}
    </div>
  )
}

function TopicChip({ topic }: { topic: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-medium text-[#475569]">
      {topic}
    </span>
  )
}

function RatingDisplay({ rating, max }: { rating: number | null; max: number }) {
  if (rating === null) {
    return (
      <div className="bg-[#f8fafc] border border-dashed border-[#e2e8f0] rounded-[8px] px-4 py-3">
        <p className="text-[12px] text-[#94a3b8] italic">No response — customer did not rate.</p>
      </div>
    )
  }
  const stars = Array.from({ length: max }, (_, i) => i < rating)
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-0.5">
        {stars.map((filled, i) => (
          <Star
            key={i}
            className="h-5 w-5"
            fill={filled ? '#f59e0b' : 'none'}
            stroke={filled ? '#f59e0b' : '#cbd5e1'}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <span className="text-[14px] font-semibold text-[#0f172a] tabular-nums">
        {rating} / {max}
      </span>
    </div>
  )
}

function SentimentBadge({ value }: { value: number }) {
  const tone = value > 5 ? 'pos' : value < -5 ? 'neg' : 'neu'
  const bg = tone === 'pos' ? '#dcfce7' : tone === 'neg' ? '#fee2e2' : '#f1f5f9'
  const text = tone === 'pos' ? '#15803d' : tone === 'neg' ? '#b91c1c' : '#475569'
  const label = value > 0 ? `+${value}` : `${value}`
  return (
    <span
      className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums"
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  )
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function formatSigned(n: number): string {
  return n > 0 ? `+${n}` : `${n}`
}
