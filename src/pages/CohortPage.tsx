import { AppShell } from '../components/layout/AppShell'
import { Star, Search } from 'lucide-react'

const SUMMARY_TILES = [
  { value: '890', value2: '457', label: 'total customers', label2: 'responding to survey', green: false },
  { value: '87%', label: 'had bot-to-human handoff', green: false },
  { value: '+60', label: 'avg agent FI signal (positive)', green: true },
]

const TABLE_ROWS = [
  { id: '1c4fa089', date: '7/05/2026', time: '8:21 PM', channel: 'Voice', campaign: 'Retention Voice Q2', agent: 'R. Whitman', match: 98, rating: 3, featured: true },
  { id: '2b4fa089', date: '6/05/2026', time: '9:00 AM', channel: 'Chat', campaign: 'Billing Resolution CSAT Q2', agent: 'S. Chen', match: 95, rating: 2, featured: false },
  { id: '4d4fa089', date: '4/05/2026', time: '11:00 AM', channel: 'Voice', campaign: 'Retention Voice Q2', agent: 'R. Whitman', match: 93, rating: 3, featured: false },
  { id: '5e4fa089', date: '3/05/2026', time: '12:00 PM', channel: 'Voice', campaign: 'Retention Voice Q2', agent: 'T. Wong', match: 91, rating: 3, featured: false },
  { id: '6f4fa089', date: '2/05/2026', time: '1:00 PM', channel: 'Voice', campaign: 'Retention Voice Q2', agent: 'L. Park', match: 89, rating: 3, featured: false },
  { id: '7g4fa089', date: '1/05/2026', time: '2:00 PM', channel: 'Chat', campaign: 'Billing Resolution CSAT Q2', agent: 'T. Wong', match: 87, rating: 2, featured: false },
  { id: '8h4fa089', date: '30/04/2026', time: '3:00 PM', channel: 'Voice', campaign: 'Retention Voice Q2', agent: 'A. Brooks', match: 85, rating: 3, featured: false },
  { id: '9i4fa089', date: '29/04/2026', time: '4:00 PM', channel: 'Voice', campaign: 'Retention Voice Q2', agent: 'R. Whitman', match: 83, rating: 3, featured: false },
  { id: '0j4fa089', date: '28/04/2026', time: '10:00 AM', channel: 'Email', campaign: 'Billing Resolution CSAT Q2', agent: 'S. Chen', match: 81, rating: 2, featured: false },
  { id: '1k4fa089', date: '27/04/2026', time: '11:00 AM', channel: 'Voice', campaign: 'Retention Voice Q2', agent: 'L. Park', match: 79, rating: 3, featured: false },
]

function matchColor(pct: number): string {
  if (pct >= 90) return '#16A34A'
  if (pct >= 80) return '#D97706'
  return '#475569'
}

export function CohortPage({ onBack, onOpenInteraction }: { onBack: () => void; onOpenInteraction?: () => void }) {
  return (
    <AppShell title="Cohort" breadcrumb={['Screen Intelligence', 'Dashboard', 'Analysis']}>
      <div className="p-5 bg-[#F8FAFC] space-y-5">
        {/* Back link */}
        <button onClick={onBack} className="text-sm font-medium text-[#2563EB] hover:underline">
          ← Back to analysis
        </button>

        {/* Page header */}
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Call Transfer Impact — Cohort</h1>
          <p className="text-[13px] text-[#64748B] mt-1">890 total customers in this cohort</p>
          <p className="text-[13px] text-[#64748B]">457 customers responded · 433 didn't engage with the survey · Sorted by pattern relevance</p>
        </div>

        {/* Section 1 — Summary Strip */}
        <div className="grid grid-cols-3 gap-4">
          {SUMMARY_TILES.map((tile, i) => (
            <div key={i} className="rounded-lg border border-[#E5E7EB] bg-white p-4">
              {i === 0 ? (
                <>
                  <div className="text-2xl font-bold leading-none text-[#0F172A]">{tile.value}</div>
                  <div className="text-[11px] text-[#64748B] mt-1">{tile.label}</div>
                  <div className="text-lg font-semibold leading-none text-[#0F172A] mt-2">{tile.value2}</div>
                  <div className="text-[11px] text-[#64748B] mt-1">{tile.label2}</div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold leading-none" style={{ color: tile.green ? '#16A34A' : '#0F172A' }}>{tile.value}</div>
                  <div className="text-[11px] text-[#64748B] mt-1">{tile.label}</div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Reconciliation line */}
        <div className="rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
          <p className="text-[13px] text-[#92400E]">
            <span className="font-semibold">This cohort is one segment</span> of the larger 1,343-customer drop detected on the dashboard.
            The 890 customers here represent the Call Transfer Impact intent within that pattern.
          </p>
        </div>

        {/* Section 2 — Featured Representative Case */}
        <div className="rounded-lg border-2 border-[#F59E0B] bg-[#FFFBEB] p-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-[#D97706] fill-[#D97706]" />
              <span className="text-[13px] font-semibold text-[#92400E]">Most representative case · 98% pattern match</span>
            </div>
            <span className="text-[11px] text-[#B45309]">Highest match in this cohort</span>
          </div>

          {/* Body — two columns */}
          <div className="flex mt-4 gap-0">
            {/* Left — interaction details */}
            <div className="flex-1 pr-5 border-r border-[#FDE68A]">
              <div className="font-mono text-[13px] text-[#0F172A]">1c4fa089-d0c2-4157-ad35-b519bd0a2964</div>
              <div className="text-xs text-[#475569] mt-1">7/05/2026 · 8:21 PM · Voice · Retention Voice Q2</div>
              <div className="text-[13px] font-medium text-[#0F172A] mt-3">James Carter → Rachel Whitman (Retention Unit)</div>
              <div className="text-xs text-[#475569] mt-3">Customer rating: 3/5 · Agent FI signal: +68 (above cohort avg) · Handoff: bot → human</div>
            </div>

            {/* Right — customer comment */}
            <div className="flex-shrink-0 w-[40%] pl-5">
              <div className="rounded-md border border-[#FDE68A] bg-white p-3">
                <p className="text-xs italic text-[#475569] leading-[1.4]">
                  "Rachel was patient and walked me through the duplicate charge step by step. Refund showed up the same day. Really appreciated the follow-up email."
                </p>
                <div className="text-[11px] text-[#94A3B8] mt-1.5">— Customer comment</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-4">
            <button onClick={onOpenInteraction} className="inline-flex items-center rounded-lg border border-[#F59E0B] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#92400E] hover:bg-[#FEF3C7] transition-colors">
              Open interaction →
            </button>
          </div>
        </div>

        {/* Section 3 — Cohort Table */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
          {/* Header */}
          <div className="text-[15px] font-semibold text-[#0F172A]">Other cases in this cohort (456)</div>
          <div className="text-xs text-[#64748B] mt-1">All matching the bot-to-human handoff friction pattern</div>

          {/* Filter row */}
          <div className="flex items-center gap-3 mt-3">
            <button className="inline-flex items-center rounded-full border border-[#378ADD] bg-[#EFF6FF] px-3 py-1.5 text-xs font-medium text-[#1E40AF] hover:bg-[#DBEAFE]">
              Show: Responding only
            </button>
            <button className="inline-flex items-center rounded-full border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs text-[#475569] hover:bg-[#F1F5F9]">
              Sort by: Pattern match ▾
            </button>
            <button className="inline-flex items-center rounded-full border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs text-[#475569] hover:bg-[#F1F5F9]">
              Channel: All ▾
            </button>
            <button className="inline-flex items-center rounded-full border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs text-[#475569] hover:bg-[#F1F5F9]">
              Campaign: All ▾
            </button>
            <div className="ml-auto relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8] pointer-events-none" />
              <input
                type="text"
                placeholder="Search"
                className="h-7 w-[200px] rounded-full border border-[#CBD5E1] bg-white pl-8 pr-3 text-xs placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#378ADD]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-[#475569]">ID</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-[#475569]">Date</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-[#475569]">Channel</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-[#475569]">Campaign</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-[#475569]">Agent</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-[#475569]">Match</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-[#475569]">Rating</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8FAFC] cursor-pointer transition-colors ${row.featured ? 'bg-[#FFFBEB]' : ''}`}
                  >
                    <td className="px-3 py-2.5 font-mono text-xs text-[#475569]">
                      <div className="flex items-center gap-1">
                        {row.featured && <Star className="h-3 w-3 text-[#D97706] fill-[#D97706] flex-shrink-0" />}
                        {row.id}…
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-xs text-[#0F172A]">{row.date}</div>
                      <div className="text-[11px] text-[#94A3B8]">{row.time}</div>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-[#475569]">{row.channel}</td>
                    <td className="px-3 py-2.5 text-xs text-[#475569]">{row.campaign}</td>
                    <td className="px-3 py-2.5 text-xs text-[#475569]">{row.agent}</td>
                    <td className="px-3 py-2.5 text-right text-[13px] font-semibold" style={{ color: matchColor(row.match) }}>{row.match}%</td>
                    <td className="px-3 py-2.5 text-right">
                      <span className="text-[13px] font-medium text-[#0F172A]">{row.rating}</span>
                      <span className="text-[#F59E0B]">★</span>
                      <span className="text-xs text-[#94A3B8] ml-2">→</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <span>Showing 1-10 of 456</span>
              <button className="inline-flex items-center rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs text-[#475569] hover:bg-[#F1F5F9] transition-colors">
                load more
              </button>
            </div>
            <button className="inline-flex items-center rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs text-[#475569] hover:bg-[#F1F5F9] transition-colors">
              Export cohort
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
