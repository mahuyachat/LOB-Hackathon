// ============================================================
// Experience Intelligence — Delta Airlines mock data
// Social data derived from X_Data_Delta_Airlines.xlsx
// (Kaggle Twitter US Airline Sentiment, Feb 2015 — 2,613 Delta tweets, 43% negative)
// Contact-center data is realistic dummy data representing Delta's contact center interactions
// ============================================================

export type Zone = 'emerging' | 'blind-spot' | 'private-signal'
export type Trend = 'up' | 'down' | 'stable' | 'new'
export type RootCausePattern =
  | 'digital-wall'
  | 'sub-threshold'
  | 'policy-disagreement'
  | 'competitive-signal'
  | 'brand-reputation'
  | 'sensitive-topic'

export const ROOT_CAUSE_CONFIG: Record<RootCausePattern, { icon: string; bg: string; text: string; border: string; label: string }> = {
  'digital-wall':        { icon: '🧱', bg: '#fef3c7', text: '#92400e', border: '#f59e0b',  label: 'Digital Wall' },
  'sub-threshold':       { icon: '💬', bg: '#eff6ff', text: '#1e40af', border: '#93c5fd',  label: 'Sub-Threshold Friction' },
  'policy-disagreement': { icon: '📋', bg: '#fdf4ff', text: '#6b21a8', border: '#d8b4fe',  label: 'Policy Disagreement' },
  'competitive-signal':  { icon: '⚡', bg: '#fef2f2', text: '#991b1b', border: '#fca5a5',  label: 'Competitive Signal' },
  'brand-reputation':    { icon: '📢', bg: '#f0fdf4', text: '#14532d', border: '#86efac',  label: 'Brand / Reputation' },
  'sensitive-topic':     { icon: '🔒', bg: '#f8fafc', text: '#1e293b', border: '#cbd5e1',  label: 'Sensitive Topic' },
}

export interface Topic {
  id: string
  name: string
  ccRank: number | null
  socialRank: number | null
  ccVolume: number
  socialVolume: number
  vuWeight: number
  ccScore: number
  socialScore: number
  trend: Trend
  trendPct: number
  zone: Zone
  sentiment: { cc: number; social: number }
  category: string
  sparkline: { day: string; cc: number; twitter: number; facebook: number; reddit: number; instagram: number }[]
  verbatims: {
    cc: { text: string; date: string }[]
    social: { text: string; date: string; handle: string; platform: 'twitter' | 'facebook' | 'reddit' | 'instagram' }[]
  }
}

export interface RecommendationCard {
  id: string
  topicId: string
  zone: 'blind-spot' | 'emerging'
  headline: string
  whyMissing?: string     // Blind-spot only: why topic doesn't surface in CC
  rootCause: string       // The underlying CX/process/system reason
  recommendedAction: string
  department: string
  score: number           // VU score 0–100 — primary sort key
  urgency: 'high' | 'medium' | 'low'
  rootCausePattern?: RootCausePattern  // Blind-spot only
  rootCauseLabel?: string              // Blind-spot only
  rootCauseExplanation?: string        // Blind-spot only
  actionType: 'qm-coaching' | 'digital-incident' | 'notify-ops' | 'escalate-training' | 'proactive-recovery' | 'update-script' | 'retention-workflow' | 'escalate-policy' | 'empathy-coaching' | 'raise-ticket'
  actionLabel: string
  actionDetail: string
  status: 'pending' | 'approved' | 'dismissed'
  approvedAt?: string
  trendLabel: string
}

export interface BrandConfig {
  id: string
  name: string
  industry: string
  socialSources: string[]
  ontologyTopics: number
  lastRefreshed: string
  nextRefresh: string
  dataPartner: string
  dataPartnerStatus: 'connected'
}

// ── Brand config ──────────────────────────────────────────────
export const BRAND_CONFIG: BrandConfig = {
  id: 'delta',
  name: 'Delta Air Lines',
  industry: 'Aviation',
  socialSources: ['X (Twitter)'],
  ontologyTopics: 20,
  lastRefreshed: '2026-06-11T06:00:00Z',
  nextRefresh: '2026-06-12T06:00:00Z',
  dataPartner: 'Brandwatch (OEM)',
  dataPartnerStatus: 'connected',
}

// ── Topics ────────────────────────────────────────────────────
export const TOPICS: Topic[] = [
  // ─── EMERGING (in both Contact Center + Social top 10) ───────────────
  {
    id: 'customer-service-issue',
    name: 'Customer Service Issue',
    ccRank: 1, socialRank: 1,
    ccVolume: 4120, socialVolume: 3840,
    vuWeight: 0.90,
    ccScore: 3708, socialScore: 3533,
    trend: 'up', trendPct: 18,
    zone: 'emerging',
    sentiment: { cc: -0.52, social: -0.71 },
    category: 'Service Quality',
    sparkline: [
      { day: 'Mon', cc: 3200, twitter: 1160, facebook: 870, reddit: 522, instagram: 348 },
      { day: 'Tue', cc: 3450, twitter: 1240, facebook: 930, reddit: 558, instagram: 372 },
      { day: 'Wed', cc: 3800, twitter: 1360, facebook: 1020, reddit: 612, instagram: 408 },
      { day: 'Thu', cc: 3900, twitter: 1440, facebook: 1080, reddit: 648, instagram: 432 },
      { day: 'Fri', cc: 4000, twitter: 1500, facebook: 1125, reddit: 675, instagram: 450 },
      { day: 'Sat', cc: 4050, twitter: 1520, facebook: 1140, reddit: 684, instagram: 456 },
      { day: 'Sun', cc: 4120, twitter: 1536, facebook: 1152, reddit: 691, instagram: 461 },
    ],
    verbatims: {
      cc: [
        { text: "The agent I spoke with was dismissive and didn't listen to my issue. Had to repeat myself three times before anyone helped.", date: 'Jun 10' },
        { text: "I waited 40 minutes to speak to someone and when I finally got through they couldn't resolve my problem and transferred me again.", date: 'Jun 9' },
      ],
      social: [
        { text: "@Delta your customer service has gone downhill. Two calls, two different answers. No one knows what's going on over there.", date: 'Jun 10', handle: '@travelermike', platform: 'twitter' },
        { text: "Tried three times to get help from @Delta. Each agent told me something different. This is embarrassing for a major airline.", date: 'Jun 9', handle: '@flyerjen82', platform: 'facebook' },
      ],
    },
  },
  {
    id: 'late-flight',
    name: 'Late Flight',
    ccRank: 2, socialRank: 2,
    ccVolume: 2840, socialVolume: 2210,
    vuWeight: 0.85,
    ccScore: 2414, socialScore: 1945,
    trend: 'up', trendPct: 24,
    zone: 'emerging',
    sentiment: { cc: -0.44, social: -0.62 },
    category: 'Operations',
    sparkline: [
      { day: 'Mon', cc: 1900, twitter: 672, facebook: 448, reddit: 288, instagram: 192 },
      { day: 'Tue', cc: 2100, twitter: 735, facebook: 490, reddit: 315, instagram: 210 },
      { day: 'Wed', cc: 2400, twitter: 798, facebook: 532, reddit: 342, instagram: 228 },
      { day: 'Thu', cc: 2550, twitter: 840, facebook: 560, reddit: 360, instagram: 240 },
      { day: 'Fri', cc: 2700, twitter: 882, facebook: 588, reddit: 378, instagram: 252 },
      { day: 'Sat', cc: 2780, twitter: 916, facebook: 610, reddit: 392, instagram: 262 },
      { day: 'Sun', cc: 2840, twitter: 928, facebook: 619, reddit: 398, instagram: 265 },
    ],
    verbatims: {
      cc: [
        { text: "My flight from Atlanta was delayed 3 hours with no explanation until we were already at the gate. I missed my connection.", date: 'Jun 10' },
        { text: "Third delay this month on the same route. Delta keeps saying weather but other airlines are flying fine on the same corridor.", date: 'Jun 8' },
      ],
      social: [
        { text: "@Delta ATL-JFK delayed again. 2 hours no gate, no update, nothing. Standing room only in the terminal.", date: 'Jun 10', handle: '@jetsetterjess', platform: 'twitter' },
        { text: "Sitting on the tarmac for 90 min @Delta. Pilot says 'weather' but it's sunny. At least be honest with us.", date: 'Jun 9', handle: '@bschiff_travels', platform: 'reddit' },
      ],
    },
  },
  {
    id: 'cancelled-flight',
    name: 'Cancelled Flight',
    ccRank: 4, socialRank: 4,
    ccVolume: 1740, socialVolume: 1280,
    vuWeight: 0.82,
    ccScore: 1427, socialScore: 1088,
    trend: 'stable', trendPct: 3,
    zone: 'emerging',
    sentiment: { cc: -0.68, social: -0.79 },
    category: 'Operations',
    sparkline: [
      { day: 'Mon', cc: 1680, twitter: 521, facebook: 347, reddit: 223, instagram: 149 },
      { day: 'Tue', cc: 1700, twitter: 525, facebook: 350, reddit: 225, instagram: 150 },
      { day: 'Wed', cc: 1720, twitter: 529, facebook: 353, reddit: 227, instagram: 151 },
      { day: 'Thu', cc: 1730, twitter: 533, facebook: 356, reddit: 229, instagram: 152 },
      { day: 'Fri', cc: 1740, twitter: 538, facebook: 358, reddit: 230, instagram: 154 },
      { day: 'Sat', cc: 1740, twitter: 537, facebook: 358, reddit: 230, instagram: 153 },
      { day: 'Sun', cc: 1740, twitter: 538, facebook: 358, reddit: 230, instagram: 154 },
    ],
    verbatims: {
      cc: [
        { text: "Flight cancelled 2 hours before departure. Was offered a rebooking for 2 days later — that's unacceptable for a business trip.", date: 'Jun 9' },
        { text: "Three calls to rebook after cancellation. Still don't have confirmed seats. I need to be at a funeral tomorrow.", date: 'Jun 8' },
      ],
      social: [
        { text: "@Delta cancelled our family trip 4 hours before departure. 5 people, no hotel help, no meal voucher. Shameful.", date: 'Jun 9', handle: '@dadoftravelers', platform: 'twitter' },
        { text: "Flight cancelled, @Delta app crashed when I tried to rebook, phone hold was 2hrs. Absolute chaos.", date: 'Jun 8', handle: '@corporatetravels', platform: 'instagram' },
      ],
    },
  },
  {
    id: 'lost-luggage',
    name: 'Lost Luggage',
    ccRank: 6, socialRank: 6,
    ccVolume: 1310, socialVolume: 870,
    vuWeight: 0.78,
    ccScore: 1022, socialScore: 679,
    trend: 'up', trendPct: 31,
    zone: 'emerging',
    sentiment: { cc: -0.58, social: -0.72 },
    category: 'Baggage',
    sparkline: [
      { day: 'Mon', cc: 880, twitter: 279, facebook: 186, reddit:  93, instagram:  62 },
      { day: 'Tue', cc: 950, twitter: 306, facebook: 204, reddit: 102, instagram:  68 },
      { day: 'Wed', cc: 1050, twitter: 329, facebook: 219, reddit: 110, instagram:  73 },
      { day: 'Thu', cc: 1100, twitter: 351, facebook: 234, reddit: 117, instagram:  78 },
      { day: 'Fri', cc: 1200, twitter: 374, facebook: 249, reddit: 125, instagram:  83 },
      { day: 'Sat', cc: 1260, twitter: 387, facebook: 258, reddit: 129, instagram:  86 },
      { day: 'Sun', cc: 1310, twitter: 392, facebook: 261, reddit: 131, instagram:  87 },
    ],
    verbatims: {
      cc: [
        { text: "My bag has been missing for 4 days. Nobody at baggage claim can tell me where it is and the app shows 'in transit' with no update.", date: 'Jun 10' },
        { text: "Lost luggage with medication in it. Delta reimbursed $50 for a $400 loss. This is not acceptable.", date: 'Jun 9' },
      ],
      social: [
        { text: "@Delta day 3 without my luggage. The tracking link you sent is broken. WHERE IS MY BAG", date: 'Jun 10', handle: '@missingbagsara', platform: 'twitter' },
        { text: "Lost bag on @Delta ATL to LAX. Bag office was unstaffed for 45 min. Worst baggage handling I've ever experienced.", date: 'Jun 8', handle: '@airportregular', platform: 'reddit' },
      ],
    },
  },

  // ─── BLIND SPOTS (Social-only — six root cause patterns) ────────────────────
  // Pattern: Digital Wall
  {
    id: 'bs-1',
    name: 'App / Rebooking Tech Issues',
    ccRank: null, socialRank: 1,
    ccVolume: 0, socialVolume: 1820,
    vuWeight: 0.90,
    ccScore: 0, socialScore: 4910,
    trend: 'up', trendPct: 62,
    zone: 'blind-spot',
    sentiment: { cc: 0, social: -0.81 },
    category: 'Digital Experience',
    sparkline: [
      { day: 'Mon', cc: 0, twitter: 360, facebook: 180, reddit: 108, instagram:  72 },
      { day: 'Tue', cc: 0, twitter: 445, facebook: 223, reddit: 134, instagram:  89 },
      { day: 'Wed', cc: 0, twitter: 550, facebook: 275, reddit: 165, instagram: 110 },
      { day: 'Thu', cc: 0, twitter: 670, facebook: 335, reddit: 201, instagram: 134 },
      { day: 'Fri', cc: 0, twitter: 770, facebook: 385, reddit: 231, instagram: 154 },
      { day: 'Sat', cc: 0, twitter: 850, facebook: 425, reddit: 255, instagram: 170 },
      { day: 'Sun', cc: 0, twitter: 910, facebook: 455, reddit: 273, instagram: 182 },
    ],
    verbatims: {
      cc: [],
      social: [
        { text: "@Delta app crashed 4 times while I was trying to rebook after cancellation. Had to wait 2hrs on hold instead. FIX YOUR APP.", date: 'Jun 10', handle: '@apphatesme', platform: 'twitter' },
        { text: "The @Delta fly delta app is completely broken. Can't check in, can't see my seat, nothing works. Absolute disaster.", date: 'Jun 9', handle: '@techfrustrated_', platform: 'facebook' },
        { text: "@Delta app keeps logging me out mid-booking. Lost my seat selection twice. This is embarrassing for a major airline.", date: 'Jun 9', handle: 'u/delta_apprage', platform: 'reddit' },
        { text: "Tried to rebook on the @Delta app after my flight was cancelled. Spinner for 20 min then kicked me out. Had to call.", date: 'Jun 8', handle: '@stranded_atl', platform: 'twitter' },
        { text: "@Delta your app shows my flight as 'on time' but the gate board says delayed 3 hours. Which is it?", date: 'Jun 8', handle: '@confused_flyer', platform: 'instagram' },
      ],
    },
  },
  // Pattern: Digital Wall
  {
    id: 'bs-2',
    name: 'Flight Booking Flow Errors',
    ccRank: null, socialRank: 3,
    ccVolume: 0, socialVolume: 1140,
    vuWeight: 0.80,
    ccScore: 0, socialScore: 3200,
    trend: 'up', trendPct: 40,
    zone: 'blind-spot',
    sentiment: { cc: 0, social: -0.74 },
    category: 'Digital Experience',
    sparkline: [
      { day: 'Mon', cc: 0, twitter: 326, facebook: 184, reddit: 102, instagram:  68 },
      { day: 'Tue', cc: 0, twitter: 365, facebook: 205, reddit: 114, instagram:  76 },
      { day: 'Wed', cc: 0, twitter: 413, facebook: 232, reddit: 129, instagram:  86 },
      { day: 'Thu', cc: 0, twitter: 461, facebook: 259, reddit: 144, instagram:  96 },
      { day: 'Fri', cc: 0, twitter: 499, facebook: 281, reddit: 156, instagram: 104 },
      { day: 'Sat', cc: 0, twitter: 528, facebook: 297, reddit: 165, instagram: 110 },
      { day: 'Sun', cc: 0, twitter: 547, facebook: 308, reddit: 171, instagram: 114 },
    ],
    verbatims: {
      cc: [],
      social: [
        { text: "@Delta your booking system won't let me apply my travel credit. Error code 404 every time. Tried 6 times.", date: 'Jun 10', handle: '@frequentflyer_d', platform: 'twitter' },
        { text: "Tried to book a flight on @Delta website for 30 min. Page kept refreshing. No confirmation, no error message. Just stuck.", date: 'Jun 9', handle: 'Delta Air Lines Passengers (Facebook Group)', platform: 'facebook' },
        { text: "@Delta charged my card twice but says no booking exists. Can't get through on the phone. This is unacceptable.", date: 'Jun 9', handle: '@doubled_charge', platform: 'twitter' },
        { text: "The @Delta website is down again during the busiest booking weekend. Can't select seats, can't confirm payment.", date: 'Jun 8', handle: 'u/peak_booking', platform: 'reddit' },
        { text: "@Delta miles won't apply at checkout. System says I have 42k miles but the booking page ignores them completely.", date: 'Jun 8', handle: '@milesnotworking', platform: 'instagram' },
      ],
    },
  },
  // Pattern: Sub-Threshold Friction
  {
    id: 'bs-3',
    name: 'In-Flight Wi-Fi Quality',
    ccRank: null, socialRank: 5,
    ccVolume: 0, socialVolume: 890,
    vuWeight: 0.65,
    ccScore: 0, socialScore: 1850,
    trend: 'up', trendPct: 18,
    zone: 'blind-spot',
    sentiment: { cc: 0, social: -0.52 },
    category: 'Onboard Experience',
    sparkline: [
      { day: 'Mon', cc: 0, twitter: 256, facebook: 179, reddit: 128, instagram:  77 },
      { day: 'Tue', cc: 0, twitter: 272, facebook: 190, reddit: 136, instagram:  82 },
      { day: 'Wed', cc: 0, twitter: 288, facebook: 202, reddit: 144, instagram:  86 },
      { day: 'Thu', cc: 0, twitter: 304, facebook: 213, reddit: 152, instagram:  91 },
      { day: 'Fri', cc: 0, twitter: 328, facebook: 230, reddit: 164, instagram:  98 },
      { day: 'Sat', cc: 0, twitter: 343, facebook: 240, reddit: 172, instagram: 103 },
      { day: 'Sun', cc: 0, twitter: 356, facebook: 249, reddit: 178, instagram: 107 },
    ],
    verbatims: {
      cc: [],
      social: [
        { text: "Paid $28 for @Delta Wi-Fi on a 4hr flight. Couldn't load a single email. Complete waste of money.", date: 'Jun 10', handle: '@inflight_rage', platform: 'twitter' },
        { text: "@Delta Wi-Fi disconnects every 10 minutes. Useless for anything work-related. You charge too much for this quality.", date: 'Jun 9', handle: 'u/biz_traveler_k', platform: 'reddit' },
        { text: "Why does @Delta still have 2015-era Wi-Fi speeds in 2026? United and AA are both better on the same routes.", date: 'Jun 9', handle: '@wifi_compare', platform: 'facebook' },
        { text: "@Delta charged me $35 for Wi-Fi that didn't work for the last 2 hours of the flight. No refund offered.", date: 'Jun 8', handle: '@inflight_scam', platform: 'twitter' },
        { text: "Three @Delta flights this week. Wi-Fi worked on zero of them. Stop selling something you can't deliver.", date: 'Jun 8', handle: '@road_warrior_t', platform: 'instagram' },
      ],
    },
  },
  // Pattern: Policy Disagreement
  {
    id: 'bs-4',
    name: 'Baggage Fee Policy',
    ccRank: null, socialRank: 2,
    ccVolume: 0, socialVolume: 2080,
    vuWeight: 0.92,
    ccScore: 0, socialScore: 5820,
    trend: 'up', trendPct: 58,
    zone: 'blind-spot',
    sentiment: { cc: 0, social: -0.84 },
    category: 'Pricing & Fees',
    sparkline: [
      { day: 'Mon', cc: 0, twitter: 340, facebook: 272, reddit: 136, instagram: 102 },
      { day: 'Tue', cc: 0, twitter: 420, facebook: 336, reddit: 168, instagram: 126 },
      { day: 'Wed', cc: 0, twitter: 530, facebook: 424, reddit: 212, instagram: 159 },
      { day: 'Thu', cc: 0, twitter: 660, facebook: 528, reddit: 264, instagram: 198 },
      { day: 'Fri', cc: 0, twitter: 790, facebook: 632, reddit: 316, instagram: 237 },
      { day: 'Sat', cc: 0, twitter: 890, facebook: 712, reddit: 356, instagram: 267 },
      { day: 'Sun', cc: 0, twitter: 970, facebook: 776, reddit: 388, instagram: 291 },
    ],
    verbatims: {
      cc: [],
      social: [
        { text: "Nobody told me the extra bag fee I paid was ONE WAY ONLY. Showed up at the gate for my return flight and had to pay again. @Delta this is predatory pricing.", date: 'Jun 10', handle: '@return_shock', platform: 'twitter' },
        { text: "Genuinely thought I'd already paid for my luggage. Turns out the $65 I paid going out doesn't cover the way back. @Delta why is this not made clear at booking??", date: 'Jun 10', handle: 'Delta Passengers Group', platform: 'facebook' },
        { text: "@Delta I paid extra bag fee at outbound check-in. Gate agent on my return flight had zero record of it. Charged again. Two receipts, one bag, two charges.", date: 'Jun 9', handle: '@double_charge', platform: 'twitter' },
        { text: "Just found out at the gate that bag fees are per direction. It's in the fine print apparently. @Delta needs to make this obvious at checkout, not at the boarding gate.", date: 'Jun 9', handle: 'u/gate_surprise', platform: 'reddit' },
        { text: "Charged $45 for extra bag on the way there. Thought I was sorted. Return flight — another $45. @Delta this should be shown as a round-trip cost upfront.", date: 'Jun 8', handle: '@rt_baggage', platform: 'instagram' },
      ],
    },
  },
  // Pattern: Competitive / Switching Signal
  {
    id: 'bs-5',
    name: 'Competitor Airline Comparisons',
    ccRank: null, socialRank: 6,
    ccVolume: 0, socialVolume: 760,
    vuWeight: 0.72,
    ccScore: 0, socialScore: 1620,
    trend: 'up', trendPct: 22,
    zone: 'blind-spot',
    sentiment: { cc: 0, social: -0.66 },
    category: 'Churn & Retention',
    sparkline: [
      { day: 'Mon', cc: 0, twitter: 234, facebook: 146, reddit:  88, instagram:  52 },
      { day: 'Tue', cc: 0, twitter: 257, facebook: 160, reddit:  97, instagram:  57 },
      { day: 'Wed', cc: 0, twitter: 279, facebook: 174, reddit: 105, instagram:  62 },
      { day: 'Thu', cc: 0, twitter: 297, facebook: 185, reddit: 112, instagram:  66 },
      { day: 'Fri', cc: 0, twitter: 315, facebook: 196, reddit: 119, instagram:  70 },
      { day: 'Sat', cc: 0, twitter: 329, facebook: 205, reddit: 124, instagram:  73 },
      { day: 'Sun', cc: 0, twitter: 342, facebook: 213, reddit: 129, instagram:  76 },
    ],
    verbatims: {
      cc: [],
      social: [
        { text: "Switching to @United after this trip. At least they rebooked me same-day. @Delta couldn't even do that after 3 calls.", date: 'Jun 9', handle: '@switching_soon', platform: 'twitter' },
        { text: "@AmericanAir quoted me the same route $120 cheaper. After this @Delta experience I know where I'm going next time.", date: 'Jun 8', handle: 'u/loyalnotanymore', platform: 'reddit' },
        { text: "Used to be a @Delta loyalist. After this week I booked my next 4 trips on @Southwest. Done.", date: 'Jun 9', handle: 'Former Delta Loyalists Group', platform: 'facebook' },
        { text: "@JetBlue handled my rebooking in 8 minutes on their app. @Delta had me on hold for 2 hours. Not hard to see why I'm switching.", date: 'Jun 8', handle: '@jetblue_convert', platform: 'twitter' },
        { text: "Delta SkyMiles vs United MileagePlus — I ran the numbers. For my routes, United wins by a mile. Literally. Bye @Delta.", date: 'Jun 8', handle: '@points_nerd', platform: 'instagram' },
      ],
    },
  },
  // Pattern: Sensitive / Stigmatised
  {
    id: 'bs-6',
    name: 'Accessibility & Special Assistance',
    ccRank: null, socialRank: 8,
    ccVolume: 0, socialVolume: 420,
    vuWeight: 0.88,
    ccScore: 0, socialScore: 1380,
    trend: 'up', trendPct: 29,
    zone: 'blind-spot',
    sentiment: { cc: 0, social: -0.71 },
    category: 'Accessibility',
    sparkline: [
      { day: 'Mon', cc: 0, twitter:  98, facebook:  84, reddit:  56, instagram:  42 },
      { day: 'Tue', cc: 0, twitter: 109, facebook:  93, reddit:  62, instagram:  46 },
      { day: 'Wed', cc: 0, twitter: 119, facebook: 102, reddit:  68, instagram:  51 },
      { day: 'Thu', cc: 0, twitter: 128, facebook: 110, reddit:  73, instagram:  54 },
      { day: 'Fri', cc: 0, twitter: 137, facebook: 117, reddit:  78, instagram:  58 },
      { day: 'Sat', cc: 0, twitter: 143, facebook: 122, reddit:  82, instagram:  61 },
      { day: 'Sun', cc: 0, twitter: 147, facebook: 126, reddit:  84, instagram:  63 },
    ],
    verbatims: {
      cc: [],
      social: [
        { text: "Pre-booked wheelchair assistance on @Delta. Nobody was at the gate. My elderly mother had to walk the full terminal alone. Unacceptable.", date: 'Jun 10', handle: '@accessibility_now', platform: 'twitter' },
        { text: "@Delta I requested special meal and medical device accommodation. Neither was on record when I boarded. Not okay.", date: 'Jun 9', handle: 'Disabled Travelers Network', platform: 'facebook' },
        { text: "@Delta confirmed my aisle seat for mobility reasons three times. Boarded to find I'd been moved to a middle seat with no notice.", date: 'Jun 9', handle: 'u/mobility_needed', platform: 'reddit' },
        { text: "Travelling with a hearing impairment. @Delta gate agents made zero effort to communicate visually during boarding chaos. Felt completely ignored.", date: 'Jun 8', handle: '@deaf_traveler', platform: 'twitter' },
        { text: "@Delta I pre-arranged extra time boarding for my autistic son. Agent rushed us anyway. Please train your staff.", date: 'Jun 8', handle: '@special_needs_dad', platform: 'instagram' },
      ],
    },
  },

  // ─── PRIVATE SIGNALS (Contact-Center-only top 10) ────────────────────
  {
    id: 'baggage-fee-disputes',
    name: 'Baggage Fee Disputes',
    ccRank: 3, socialRank: null,
    ccVolume: 1950, socialVolume: 0,
    vuWeight: 0.88,
    ccScore: 1716, socialScore: 0,
    trend: 'up', trendPct: 19,
    zone: 'private-signal',
    sentiment: { cc: -0.48, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
    category: 'Billing',
    sparkline: [
      { day: 'Mon', cc: 1600, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Tue', cc: 1680, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Wed', cc: 1750, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Thu', cc: 1810, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Fri', cc: 1870, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Sat', cc: 1910, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Sun', cc: 1950, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
    ],
    verbatims: {
      cc: [
        { text: "Charged $35 for a bag that I always carry on. The gate agent said it wouldn't fit but I've used the same bag on Delta for 2 years.", date: 'Jun 10' },
        { text: "Was told my bag was 2lbs overweight and charged $150. No warning, no option to repack at the counter.", date: 'Jun 9' },
      ],
      social: [],
    },
  },
  {
    id: 'refund-voucher-processing',
    name: 'Refund & Voucher Processing',
    ccRank: 5, socialRank: null,
    ccVolume: 1520, socialVolume: 0,
    vuWeight: 0.90,
    ccScore: 1368, socialScore: 0,
    trend: 'stable', trendPct: 2,
    zone: 'private-signal',
    sentiment: { cc: -0.42, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
    category: 'Billing',
    sparkline: [
      { day: 'Mon', cc: 1490, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Tue', cc: 1500, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Wed', cc: 1505, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Thu', cc: 1510, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Fri', cc: 1515, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Sat', cc: 1518, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Sun', cc: 1520, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
    ],
    verbatims: {
      cc: [
        { text: "My refund was promised within 7 days. It's been 3 weeks. Every time I call I'm told to 'wait a few more days'.", date: 'Jun 10' },
        { text: "Travel credit I received for a cancelled flight won't apply at checkout. The system says it's valid but won't accept it.", date: 'Jun 9' },
      ],
      social: [],
    },
  },
  {
    id: 'loyalty-miles-disputes',
    name: 'Loyalty Miles Disputes',
    ccRank: 7, socialRank: null,
    ccVolume: 980, socialVolume: 0,
    vuWeight: 0.70,
    ccScore: 686, socialScore: 0,
    trend: 'down', trendPct: -8,
    zone: 'private-signal',
    sentiment: { cc: -0.38, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
    category: 'Loyalty',
    sparkline: [
      { day: 'Mon', cc: 1060, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Tue', cc: 1040, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Wed', cc: 1020, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Thu', cc: 1000, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Fri', cc: 995, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Sat', cc: 985, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Sun', cc: 980, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
    ],
    verbatims: {
      cc: [
        { text: "My Medallion miles from my partner's flight weren't credited to my account. Delta says they can't verify the booking.", date: 'Jun 9' },
        { text: "Miles expiring even though I flew twice this quarter. Delta says the flights don't count toward qualification. Rules changed without notice.", date: 'Jun 8' },
      ],
      social: [],
    },
  },
  {
    id: 'upgrade-requests',
    name: 'Upgrade Requests',
    ccRank: 8, socialRank: null,
    ccVolume: 830, socialVolume: 0,
    vuWeight: 0.60,
    ccScore: 498, socialScore: 0,
    trend: 'stable', trendPct: 1,
    zone: 'private-signal',
    sentiment: { cc: -0.22, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
    category: 'Loyalty',
    sparkline: [
      { day: 'Mon', cc: 820, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Tue', cc: 822, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Wed', cc: 825, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Thu', cc: 827, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Fri', cc: 828, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Sat', cc: 829, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Sun', cc: 830, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
    ],
    verbatims: {
      cc: [
        { text: "I'm Platinum Medallion and have been waitlisted for an upgrade on this route for 6 straight trips. Lower status customers seem to be getting cleared ahead of me.", date: 'Jun 10' },
        { text: "Requested upgrade using my Global Upgrade Certificate. Was told it can't be applied to this route. Why wasn't this stated when I purchased them?", date: 'Jun 8' },
      ],
      social: [],
    },
  },
  {
    id: 'disability-assistance',
    name: 'Disability Assistance',
    ccRank: 9, socialRank: null,
    ccVolume: 610, socialVolume: 0,
    vuWeight: 0.92,
    ccScore: 561, socialScore: 0,
    trend: 'up', trendPct: 15,
    zone: 'private-signal',
    sentiment: { cc: -0.74, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
    category: 'Accessibility',
    sparkline: [
      { day: 'Mon', cc: 520, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Tue', cc: 540, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Wed', cc: 560, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Thu', cc: 575, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Fri', cc: 590, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Sat', cc: 600, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Sun', cc: 610, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
    ],
    verbatims: {
      cc: [
        { text: "I requested wheelchair assistance for my elderly mother three times in advance. Nobody was at the gate. She had to walk the full length of the terminal.", date: 'Jun 10' },
        { text: "My pre-arranged disability seating was changed without notification. I cannot sit in a standard seat due to my condition.", date: 'Jun 9' },
      ],
      social: [],
    },
  },
  {
    id: 'medical-emergency-handling',
    name: 'Medical Emergency Handling',
    ccRank: 10, socialRank: null,
    ccVolume: 240, socialVolume: 0,
    vuWeight: 0.95,
    ccScore: 228, socialScore: 0,
    trend: 'stable', trendPct: 0,
    zone: 'private-signal',
    sentiment: { cc: -0.62, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
    category: 'Safety',
    sparkline: [
      { day: 'Mon', cc: 238, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Tue', cc: 239, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Wed', cc: 240, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Thu', cc: 240, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Fri', cc: 240, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Sat', cc: 240, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
      { day: 'Sun', cc: 240, twitter: 0, facebook: 0, reddit: 0, instagram: 0 },
    ],
    verbatims: {
      cc: [
        { text: "There was a passenger having a medical emergency on our flight. Crew response was slow and I did not see a defibrillator for 8 minutes.", date: 'Jun 8' },
        { text: "After the mid-flight medical diversion I was never contacted or offered any compensation for the additional 6-hour delay.", date: 'Jun 7' },
      ],
      social: [],
    },
  },
]

// ── Recommendation cards (Blind Spots only) ───────────────────
export const RECOMMENDATION_CARDS: RecommendationCard[] = [
  {
    id: 'rc-1',
    topicId: 'bs-1',
    zone: 'blind-spot',
    headline: 'App & rebooking failures are the #1 social topic — customers can\'t reach us because the channel itself is broken',
    whyMissing: "App crashes and rebooking tech failures rank #1 in social mentions this week — up 62% — but generate zero contact center interactions. The absence of CC contacts is not a sign the issue is small; it's a sign customers couldn't get through.",
    rootCause: "The app is the primary rebooking channel — when it fails, customers are left with no working self-service option. Calling in means significant hold times, so most customers abandon the process entirely and post their frustration on social media instead.",
    recommendedAction: "Raise a P1 incident with the Digital Engineering team to restore the app rebooking flow. Share the social volume spike as evidence of customer impact. Until the channel is fixed, surface a fallback rebooking option (web or chat) within the app error state.",
    department: "Digital + Operations",
    score: 87,
    urgency: 'high',
    rootCausePattern: 'digital-wall',
    rootCauseLabel: 'Digital Wall',
    rootCauseExplanation: 'When the app crashes during rebooking, customers have no working digital alternative and face long call wait times. Most give up and vent on social rather than waiting on hold.',
    actionType: 'digital-incident',
    actionLabel: 'Raise Digital Incident',
    actionDetail: 'A P1 incident will be raised with the Delta Digital Engineering team, with social volume data attached as evidence of scale. The app error state will be reviewed to surface a fallback rebooking path (web or chat) while the fix is in progress.',
    status: 'pending',
    trendLabel: '+62% this week',
  },
  {
    id: 'rc-2',
    topicId: 'bs-2',
    zone: 'blind-spot',
    headline: 'Booking flow errors are sending customers to social before they can complete a purchase',
    whyMissing: "Flight booking flow errors rank #3 on social with 1,140 mentions this week — up 40% — but are absent from contact center interactions. Customers hit an error during booking and, unable to complete the transaction, vent on social.",
    rootCause: "Booking errors block transaction completion — customers abandon and post rather than finding an agent. Conversion abandonment at the booking stage means these are not just frustrated customers; they are lost sales.",
    recommendedAction: "Alert Digital Operations immediately with the social volume data. Review booking flow error logs for the same period to cross-reference with the social spike timing.",
    department: "Digital Operations",
    score: 76,
    urgency: 'high',
    rootCausePattern: 'digital-wall',
    rootCauseLabel: 'Digital Wall',
    rootCauseExplanation: 'Booking errors block transaction completion — customers abandon and post rather than finding an agent.',
    actionType: 'notify-ops',
    actionLabel: 'Notify Digital Operations',
    actionDetail: 'Digital Operations will be notified of the social spike correlated with booking flow errors. Engineering will cross-reference error logs with social spike timeline.',
    status: 'pending',
    trendLabel: '+40% this week',
  },
  {
    id: 'rc-3',
    topicId: 'bs-3',
    zone: 'blind-spot',
    headline: 'In-flight Wi-Fi complaints are rising on social — passengers vent mid-flight, not post-flight via service',
    whyMissing: "In-flight Wi-Fi quality complaints have grown 18% this week with 890 social posts — but do not appear in contact center data. This is the sub-threshold friction pattern: the issue is annoying but not serious enough to prompt a post-flight call.",
    rootCause: "Wi-Fi complaints are too minor to warrant a service call — passengers tweet in-flight and don't follow up. Individually low urgency, but the upward trend is a leading indicator of NPS degradation.",
    recommendedAction: "Raise a service ticket with the in-flight Wi-Fi provider sharing the social volume data and sentiment trend. Delta does not control Wi-Fi infrastructure — the provider needs to be held accountable. Track resolution progress and consider a CXFM survey to quantify passenger impact.",
    department: "Operations + Vendor Management",
    score: 54,
    urgency: 'medium',
    rootCausePattern: 'sub-threshold',
    rootCauseLabel: 'Sub-Threshold Friction',
    rootCauseExplanation: 'Wi-Fi complaints are too minor to warrant a service call — passengers tweet in-flight and don\'t follow up.',
    actionType: 'raise-ticket',
    actionLabel: 'Raise Provider Service Ticket',
    actionDetail: 'A service ticket will be raised with the in-flight Wi-Fi provider, including social volume trends and verbatim samples. Delta Vendor Management will track the escalation and response SLA.',
    status: 'pending',
    trendLabel: '+18% this week',
  },
  {
    id: 'rc-4',
    topicId: 'bs-4',
    zone: 'blind-spot',
    headline: 'Baggage fee complaints are surging on social — customers see a call as futile against a company policy',
    whyMissing: "Baggage fee policy complaints rank #2 on social this week with 1,320 mentions — up 35% — and are absent from contact center data. Customers correctly assess that an agent cannot change the airline's fee structure, so they don't call.",
    rootCause: "Customers don't call because they know an agent can't change pricing policy — social is their protest channel. Left unaddressed, this fuels competitor comparison posts and compounds churn risk.",
    recommendedAction: "Notify Business Leadership with the social volume trend as evidence of recurring customer dissatisfaction. This is a policy-level issue — the recurring signal needs to reach decision-makers who can review the fee structure or introduce customer-friendly exceptions.",
    department: "Business Leadership + Revenue",
    score: 93,
    urgency: 'high',
    rootCausePattern: 'policy-disagreement',
    rootCauseLabel: 'Policy Disagreement',
    rootCauseExplanation: 'Customers don\'t call because they know an agent can\'t change pricing policy — social is their protest channel. Left unaddressed, this is accelerating churn and fuelling competitor comparison posts.',
    actionType: 'escalate-policy',
    actionLabel: 'Notify Business Leadership',
    actionDetail: 'A briefing will be prepared for Business Leadership summarising the social volume trend, verbatim samples, and week-over-week growth. The goal is to surface this as a recurring policy pain point that warrants a business-level review.',
    status: 'pending',
    trendLabel: '+58% this week',
  },
  {
    id: 'rc-5',
    topicId: 'bs-5',
    zone: 'blind-spot',
    headline: 'Competitor comparison posts are growing — customers signalling switching intent before they churn',
    whyMissing: "Competitor airline comparison posts have increased 22% this week with 760 social mentions — but generate zero contact center interactions. A customer posting a competitor comparison has mentally exited before picking up a phone.",
    rootCause: "Customers who've decided to switch don't call the brand — they post to validate the decision publicly. The absence of CC interactions means the service team has no visibility into this cohort until it's too late.",
    recommendedAction: "Activate a retention workflow immediately. Alert CX leadership — this signal, combined with baggage fee complaints, suggests a compounding churn risk.",
    department: "Loyalty + Retention",
    score: 68,
    urgency: 'high',
    rootCausePattern: 'competitive-signal',
    rootCauseLabel: 'Competitive Signal',
    rootCauseExplanation: 'Customers who\'ve decided to switch don\'t call the brand — they post to validate the decision publicly.',
    actionType: 'retention-workflow',
    actionLabel: 'Activate Retention Workflow',
    actionDetail: 'Retention workflow will be activated for high-value customers showing social churn signals. CX Leadership will be notified. Proactive outreach via Cognigy AI Agents will be queued for eligible customers.',
    status: 'pending',
    trendLabel: '+22% this week',
  },
  {
    id: 'rc-6',
    topicId: 'bs-6',
    zone: 'blind-spot',
    headline: 'Accessibility & special assistance complaints are rising — the human agent channel creates a disclosure barrier',
    whyMissing: "Accessibility and special assistance complaints have grown 29% this week with 420 social mentions — but are absent from contact center data. Despite lower volume, the VU score is significant: these are high-impact, high-vulnerability situations.",
    rootCause: "Accessibility needs require personal disclosure — customers avoid the human agent channel and post semi-anonymously instead. Passengers with past experiences of inadequate accommodation are especially reluctant to repeat the disclosure.",
    recommendedAction: "Review and update the agent empathy coaching module for accessibility topics. Improve the digital self-service path for special assistance requests to reduce the need for direct human disclosure.",
    department: "QM + Accessibility",
    score: 49,
    urgency: 'medium',
    rootCausePattern: 'sensitive-topic',
    rootCauseLabel: 'Sensitive Topic',
    rootCauseExplanation: 'Accessibility needs require personal disclosure — customers avoid the human agent channel and post semi-anonymously instead.',
    actionType: 'empathy-coaching',
    actionLabel: 'Update Empathy Coaching',
    actionDetail: 'Accessibility and special assistance coaching module will be reviewed and updated. QM evaluation rubric will be updated to include accessibility handling as a scored dimension. Digital self-service path for special assistance will be flagged for UX review.',
    status: 'pending',
    trendLabel: '+29% this week',
  },

  // ─── EMERGING TOPIC RECOMMENDATIONS ─────────────────────────────────────────
  {
    id: 'ec-1',
    topicId: 'customer-service-issue',
    zone: 'emerging',
    headline: 'Customer service quality is the #1 issue across both CC and social — inconsistent agent responses are amplifying frustration',
    rootCause: "Customers are receiving inconsistent answers across interactions — agents are not aligned on resolution paths. This drives repeat contacts, escalations, and social venting even after a CC interaction.",
    recommendedAction: "Launch a targeted QM coaching programme focused on first-contact resolution and consistency of response. Review recent low-scoring interactions to identify the specific gaps driving repeat contacts and social escalation.",
    department: "Quality Management",
    score: 84,
    urgency: 'high',
    actionType: 'qm-coaching',
    actionLabel: 'Launch QM Coaching',
    actionDetail: 'QM team will run a targeted coaching sprint focused on consistency, first-contact resolution, and de-escalation. Low-scoring interactions from the last 7 days will be reviewed to identify specific agent knowledge gaps.',
    status: 'pending',
    trendLabel: '+18% this week',
  },
  {
    id: 'ec-2',
    topicId: 'late-flight',
    zone: 'emerging',
    headline: 'Flight delay complaints are rising in both CC and social — passengers are frustrated by lack of proactive communication',
    rootCause: "Delays themselves are an operational reality, but the complaint volume spike is driven by lack of proactive communication. Passengers find out at the gate rather than in advance, leaving them no time to rearrange plans.",
    recommendedAction: "Engage Operations to review the delay notification workflow. Proactive SMS/app push notifications with realistic ETAs should be triggered earlier in the delay cycle, before passengers reach the gate.",
    department: "Operations + Digital",
    score: 74,
    urgency: 'high',
    actionType: 'notify-ops',
    actionLabel: 'Review Delay Notification Flow',
    actionDetail: 'Operations team will audit the current delay notification trigger points. Digital will implement earlier push/SMS alerts with estimated rebooking options for passengers on affected routes.',
    status: 'pending',
    trendLabel: '+24% this week',
  },
  {
    id: 'ec-3',
    topicId: 'cancelled-flight',
    zone: 'emerging',
    headline: 'Cancelled flight complaints carry the highest sentiment negativity — passengers feel abandoned after cancellation',
    rootCause: "Cancellations are generating high-severity frustration not just from the disruption itself, but from the recovery experience — slow rebooking, no hotel support, and app failures at the moment of highest need.",
    recommendedAction: "Activate an immediate post-cancellation recovery workflow: auto-rebook where possible, surface hotel and meal voucher options proactively, and ensure the app rebooking path is resilient under high load.",
    department: "Operations + Digital",
    score: 65,
    urgency: 'medium',
    actionType: 'proactive-recovery',
    actionLabel: 'Activate Recovery Workflow',
    actionDetail: 'A post-cancellation recovery playbook will be activated: auto-rebook eligible passengers, surface compensation options in the app within 30 minutes of cancellation, and stress-test the rebooking flow under peak load.',
    status: 'pending',
    trendLabel: 'Stable this week',
  },
  {
    id: 'ec-4',
    topicId: 'lost-luggage',
    zone: 'emerging',
    headline: 'Lost luggage complaints are accelerating — passengers have no reliable way to track their bags in real time',
    rootCause: "The core frustration is not just lost bags — it is the inability to get a real-time status. The tracking link is broken for many passengers, and baggage office staffing is inconsistent, leaving customers with no recovery path.",
    recommendedAction: "Fix the baggage tracking link immediately and audit baggage office staffing at the highest-complaint airports. Consider proactive outreach to passengers with delayed bags before they need to call in.",
    department: "Operations + Baggage",
    score: 62,
    urgency: 'medium',
    actionType: 'notify-ops',
    actionLabel: 'Fix Tracking & Notify Ops',
    actionDetail: 'Digital will fix the broken tracking link as a P1. Operations will audit baggage office staffing at ATL and LAX. A proactive outreach workflow will be scoped for passengers whose bags have been delayed over 24 hours.',
    status: 'pending',
    trendLabel: '+31% this week',
  },
]

// ── Derived helpers ───────────────────────────────────────────
export const emergingTopics = TOPICS.filter(t => t.zone === 'emerging')
export const blindSpotTopics = TOPICS.filter(t => t.zone === 'blind-spot')
export const privateSignalTopics = TOPICS.filter(t => t.zone === 'private-signal')
export const ccTop10 = TOPICS.filter(t => t.ccRank !== null).sort((a, b) => (a.ccRank ?? 99) - (b.ccRank ?? 99))
export const socialTop10 = TOPICS.filter(t => t.socialRank !== null).sort((a, b) => (a.socialRank ?? 99) - (b.socialRank ?? 99))
export const getTopicById = (id: string) => TOPICS.find(t => t.id === id)
export const getCardByTopicId = (topicId: string) => RECOMMENDATION_CARDS.find(c => c.topicId === topicId)
