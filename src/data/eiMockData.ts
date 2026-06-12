// ============================================================
// Experience Intelligence — Delta Airlines mock data
// Social data derived from X_Data_Delta_Airlines.xlsx
// (Kaggle Twitter US Airline Sentiment, Feb 2015 — 2,613 Delta tweets, 43% negative)
// Contact-center data is realistic dummy data representing Delta's contact center interactions
// ============================================================

export type Zone = 'emerging' | 'blind-spot' | 'private-signal'
export type Trend = 'up' | 'down' | 'stable' | 'new'

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
  sparkline: { day: string; cc: number; social: number }[]
  verbatims: {
    cc: { text: string; date: string }[]
    social: { text: string; date: string; handle: string }[]
  }
}

export interface RecommendationCard {
  id: string
  topicId: string
  zone: 'blind-spot'
  headline: string
  // Structured AI analysis — replaces the single heavy aiNarrative
  whyMissing: string      // Why this topic doesn't surface in contact center data
  rootCause: string       // The underlying CX/process/system reason
  recommendedAction: string  // Concise action sentence
  department: string      // Owning team(s), e.g. "Digital + Operations"
  urgency: 'high' | 'medium' | 'low'
  actionType: 'qm-coaching' | 'digital-incident' | 'notify-ops' | 'escalate-training' | 'proactive-recovery' | 'update-script' | 'retention-workflow'
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
      { day: 'Mon', cc: 3200, social: 2900 },
      { day: 'Tue', cc: 3450, social: 3100 },
      { day: 'Wed', cc: 3800, social: 3400 },
      { day: 'Thu', cc: 3900, social: 3600 },
      { day: 'Fri', cc: 4000, social: 3750 },
      { day: 'Sat', cc: 4050, social: 3800 },
      { day: 'Sun', cc: 4120, social: 3840 },
    ],
    verbatims: {
      cc: [
        { text: "The agent I spoke with was dismissive and didn't listen to my issue. Had to repeat myself three times before anyone helped.", date: 'Jun 10' },
        { text: "I waited 40 minutes to speak to someone and when I finally got through they couldn't resolve my problem and transferred me again.", date: 'Jun 9' },
      ],
      social: [
        { text: "@Delta your customer service has gone downhill. Two calls, two different answers. No one knows what's going on over there.", date: 'Jun 10', handle: '@travelermike' },
        { text: "Tried three times to get help from @Delta. Each agent told me something different. This is embarrassing for a major airline.", date: 'Jun 9', handle: '@flyerjen82' },
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
      { day: 'Mon', cc: 1900, social: 1600 },
      { day: 'Tue', cc: 2100, social: 1750 },
      { day: 'Wed', cc: 2400, social: 1900 },
      { day: 'Thu', cc: 2550, social: 2000 },
      { day: 'Fri', cc: 2700, social: 2100 },
      { day: 'Sat', cc: 2780, social: 2180 },
      { day: 'Sun', cc: 2840, social: 2210 },
    ],
    verbatims: {
      cc: [
        { text: "My flight from Atlanta was delayed 3 hours with no explanation until we were already at the gate. I missed my connection.", date: 'Jun 10' },
        { text: "Third delay this month on the same route. Delta keeps saying weather but other airlines are flying fine on the same corridor.", date: 'Jun 8' },
      ],
      social: [
        { text: "@Delta ATL-JFK delayed again. 2 hours no gate, no update, nothing. Standing room only in the terminal.", date: 'Jun 10', handle: '@jetsetterjess' },
        { text: "Sitting on the tarmac for 90 min @Delta. Pilot says 'weather' but it's sunny. At least be honest with us.", date: 'Jun 9', handle: '@bschiff_travels' },
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
      { day: 'Mon', cc: 1680, social: 1240 },
      { day: 'Tue', cc: 1700, social: 1250 },
      { day: 'Wed', cc: 1720, social: 1260 },
      { day: 'Thu', cc: 1730, social: 1270 },
      { day: 'Fri', cc: 1740, social: 1280 },
      { day: 'Sat', cc: 1740, social: 1278 },
      { day: 'Sun', cc: 1740, social: 1280 },
    ],
    verbatims: {
      cc: [
        { text: "Flight cancelled 2 hours before departure. Was offered a rebooking for 2 days later — that's unacceptable for a business trip.", date: 'Jun 9' },
        { text: "Three calls to rebook after cancellation. Still don't have confirmed seats. I need to be at a funeral tomorrow.", date: 'Jun 8' },
      ],
      social: [
        { text: "@Delta cancelled our family trip 4 hours before departure. 5 people, no hotel help, no meal voucher. Shameful.", date: 'Jun 9', handle: '@dadoftravelers' },
        { text: "Flight cancelled, @Delta app crashed when I tried to rebook, phone hold was 2hrs. Absolute chaos.", date: 'Jun 8', handle: '@corporatetravels' },
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
      { day: 'Mon', cc: 880, social: 620 },
      { day: 'Tue', cc: 950, social: 680 },
      { day: 'Wed', cc: 1050, social: 730 },
      { day: 'Thu', cc: 1100, social: 780 },
      { day: 'Fri', cc: 1200, social: 830 },
      { day: 'Sat', cc: 1260, social: 860 },
      { day: 'Sun', cc: 1310, social: 870 },
    ],
    verbatims: {
      cc: [
        { text: "My bag has been missing for 4 days. Nobody at baggage claim can tell me where it is and the app shows 'in transit' with no update.", date: 'Jun 10' },
        { text: "Lost luggage with medication in it. Delta reimbursed $50 for a $400 loss. This is not acceptable.", date: 'Jun 9' },
      ],
      social: [
        { text: "@Delta day 3 without my luggage. The tracking link you sent is broken. WHERE IS MY BAG", date: 'Jun 10', handle: '@missingbagsara' },
        { text: "Lost bag on @Delta ATL to LAX. Bag office was unstaffed for 45 min. Worst baggage handling I've ever experienced.", date: 'Jun 8', handle: '@airportregular' },
      ],
    },
  },

  // ─── BLIND SPOTS (Social-only top 10) ────────────────────
  {
    id: 'flight-booking-problems',
    name: 'Flight Booking Problems',
    ccRank: null, socialRank: 3,
    ccVolume: 0, socialVolume: 1540,
    vuWeight: 0.80,
    ccScore: 0, socialScore: 1232,
    trend: 'up', trendPct: 40,
    zone: 'blind-spot',
    sentiment: { cc: 0, social: -0.66 },
    category: 'Digital Experience',
    sparkline: [
      { day: 'Mon', cc: 0, social: 900 },
      { day: 'Tue', cc: 0, social: 1000 },
      { day: 'Wed', cc: 0, social: 1100 },
      { day: 'Thu', cc: 0, social: 1200 },
      { day: 'Fri', cc: 0, social: 1350 },
      { day: 'Sat', cc: 0, social: 1480 },
      { day: 'Sun', cc: 0, social: 1540 },
    ],
    verbatims: {
      cc: [],
      social: [
        { text: "@Delta your booking system won't let me apply my travel credit. Error code 404 every time. Tried 6 times.", date: 'Jun 10', handle: '@frequentflyer_d' },
        { text: "Tried to book a flight on @Delta website for 30 min. Page kept refreshing. Had to call in which added 2 hrs wait time.", date: 'Jun 9', handle: '@bookingfrustrate' },
      ],
    },
  },
  {
    id: 'flight-attendant-complaints',
    name: 'Flight Attendant Complaints',
    ccRank: null, socialRank: 5,
    ccVolume: 0, socialVolume: 980,
    vuWeight: 0.72,
    ccScore: 0, socialScore: 706,
    trend: 'up', trendPct: 22,
    zone: 'blind-spot',
    sentiment: { cc: 0, social: -0.54 },
    category: 'Service Quality',
    sparkline: [
      { day: 'Mon', cc: 0, social: 720 },
      { day: 'Tue', cc: 0, social: 760 },
      { day: 'Wed', cc: 0, social: 800 },
      { day: 'Thu', cc: 0, social: 840 },
      { day: 'Fri', cc: 0, social: 900 },
      { day: 'Sat', cc: 0, social: 950 },
      { day: 'Sun', cc: 0, social: 980 },
    ],
    verbatims: {
      cc: [],
      social: [
        { text: "@Delta FA on flight 1492 was rude when I asked for water. Told me she was 'too busy.' Three other passengers saw it.", date: 'Jun 10', handle: '@delta_frequent' },
        { text: "The crew on my @Delta flight seemed completely uninterested in their jobs. Ignored call buttons for 20 min.", date: 'Jun 9', handle: '@aviation_critic' },
      ],
    },
  },
  {
    id: 'bad-flight-experience',
    name: 'Bad Flight Experience',
    ccRank: null, socialRank: 7,
    ccVolume: 0, socialVolume: 760,
    vuWeight: 0.70,
    ccScore: 0, socialScore: 532,
    trend: 'stable', trendPct: 8,
    zone: 'blind-spot',
    sentiment: { cc: 0, social: -0.58 },
    category: 'In-Flight',
    sparkline: [
      { day: 'Mon', cc: 0, social: 700 },
      { day: 'Tue', cc: 0, social: 720 },
      { day: 'Wed', cc: 0, social: 730 },
      { day: 'Thu', cc: 0, social: 740 },
      { day: 'Fri', cc: 0, social: 750 },
      { day: 'Sat', cc: 0, social: 755 },
      { day: 'Sun', cc: 0, social: 760 },
    ],
    verbatims: {
      cc: [],
      social: [
        { text: "Worst @Delta flight I've had. Broken seat, no entertainment, meal was inedible. Premium economy my foot.", date: 'Jun 9', handle: '@premiumdisapoint' },
        { text: "Every single overhead bin was full by the time I boarded @Delta. Had to gate-check a bag I specifically brought as carry-on.", date: 'Jun 8', handle: '@bin_wars_2026' },
      ],
    },
  },
  {
    id: 'app-rebooking-tech-issues',
    name: 'App / Rebooking Tech Issues',
    ccRank: null, socialRank: 8,
    ccVolume: 0, socialVolume: 620,
    vuWeight: 0.88,
    ccScore: 0, socialScore: 546,
    trend: 'up', trendPct: 62,
    zone: 'blind-spot',
    sentiment: { cc: 0, social: -0.76 },
    category: 'Digital Experience',
    sparkline: [
      { day: 'Mon', cc: 0, social: 320 },
      { day: 'Tue', cc: 0, social: 390 },
      { day: 'Wed', cc: 0, social: 450 },
      { day: 'Thu', cc: 0, social: 510 },
      { day: 'Fri', cc: 0, social: 560 },
      { day: 'Sat', cc: 0, social: 595 },
      { day: 'Sun', cc: 0, social: 620 },
    ],
    verbatims: {
      cc: [],
      social: [
        { text: "@Delta app crashed 4 times while I was trying to rebook after cancellation. Had to wait 2hrs on hold instead. FIX YOUR APP.", date: 'Jun 10', handle: '@apphatesme' },
        { text: "The @Delta fly delta app is completely broken after the last update. Can't check in, can't see my seat, nothing works.", date: 'Jun 9', handle: '@techfrustrated_' },
      ],
    },
  },
  {
    id: 'seating-dissatisfaction',
    name: 'Seating Dissatisfaction',
    ccRank: null, socialRank: 9,
    ccVolume: 0, socialVolume: 440,
    vuWeight: 0.65,
    ccScore: 0, socialScore: 286,
    trend: 'down', trendPct: -10,
    zone: 'blind-spot',
    sentiment: { cc: 0, social: -0.43 },
    category: 'In-Flight',
    sparkline: [
      { day: 'Mon', cc: 0, social: 490 },
      { day: 'Tue', cc: 0, social: 480 },
      { day: 'Wed', cc: 0, social: 470 },
      { day: 'Thu', cc: 0, social: 460 },
      { day: 'Fri', cc: 0, social: 455 },
      { day: 'Sat', cc: 0, social: 448 },
      { day: 'Sun', cc: 0, social: 440 },
    ],
    verbatims: {
      cc: [],
      social: [
        { text: "Paid for Comfort+ on @Delta and got a middle seat between two large passengers. The extra legroom I paid for was meaningless.", date: 'Jun 9', handle: '@comfortplus_not' },
        { text: "@Delta why did you change my seat assignment without asking? I'm in a middle seat now and I specifically paid to avoid that.", date: 'Jun 8', handle: '@seatchangedagain' },
      ],
    },
  },
  {
    id: 'competitor-mention',
    name: 'Competitor Mention',
    ccRank: null, socialRank: 10,
    ccVolume: 0, socialVolume: 310,
    vuWeight: 0.55,
    ccScore: 0, socialScore: 171,
    trend: 'up', trendPct: 14,
    zone: 'blind-spot',
    sentiment: { cc: 0, social: -0.35 },
    category: 'Competitive',
    sparkline: [
      { day: 'Mon', cc: 0, social: 260 },
      { day: 'Tue', cc: 0, social: 270 },
      { day: 'Wed', cc: 0, social: 280 },
      { day: 'Thu', cc: 0, social: 290 },
      { day: 'Fri', cc: 0, social: 300 },
      { day: 'Sat', cc: 0, social: 306 },
      { day: 'Sun', cc: 0, social: 310 },
    ],
    verbatims: {
      cc: [],
      social: [
        { text: "Switching to @United after this trip. At least they rebooked me on the same day. @Delta couldn't even do that.", date: 'Jun 9', handle: '@switching_soon' },
        { text: "Used @Delta for 5 years. After this experience I'm checking out @AmericanAir. They at least answer the phone.", date: 'Jun 8', handle: '@loyalnotanymore' },
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
    sentiment: { cc: -0.48, social: 0 },
    category: 'Billing',
    sparkline: [
      { day: 'Mon', cc: 1600, social: 0 },
      { day: 'Tue', cc: 1680, social: 0 },
      { day: 'Wed', cc: 1750, social: 0 },
      { day: 'Thu', cc: 1810, social: 0 },
      { day: 'Fri', cc: 1870, social: 0 },
      { day: 'Sat', cc: 1910, social: 0 },
      { day: 'Sun', cc: 1950, social: 0 },
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
    sentiment: { cc: -0.42, social: 0 },
    category: 'Billing',
    sparkline: [
      { day: 'Mon', cc: 1490, social: 0 },
      { day: 'Tue', cc: 1500, social: 0 },
      { day: 'Wed', cc: 1505, social: 0 },
      { day: 'Thu', cc: 1510, social: 0 },
      { day: 'Fri', cc: 1515, social: 0 },
      { day: 'Sat', cc: 1518, social: 0 },
      { day: 'Sun', cc: 1520, social: 0 },
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
    sentiment: { cc: -0.38, social: 0 },
    category: 'Loyalty',
    sparkline: [
      { day: 'Mon', cc: 1060, social: 0 },
      { day: 'Tue', cc: 1040, social: 0 },
      { day: 'Wed', cc: 1020, social: 0 },
      { day: 'Thu', cc: 1000, social: 0 },
      { day: 'Fri', cc: 995, social: 0 },
      { day: 'Sat', cc: 985, social: 0 },
      { day: 'Sun', cc: 980, social: 0 },
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
    sentiment: { cc: -0.22, social: 0 },
    category: 'Loyalty',
    sparkline: [
      { day: 'Mon', cc: 820, social: 0 },
      { day: 'Tue', cc: 822, social: 0 },
      { day: 'Wed', cc: 825, social: 0 },
      { day: 'Thu', cc: 827, social: 0 },
      { day: 'Fri', cc: 828, social: 0 },
      { day: 'Sat', cc: 829, social: 0 },
      { day: 'Sun', cc: 830, social: 0 },
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
    sentiment: { cc: -0.74, social: 0 },
    category: 'Accessibility',
    sparkline: [
      { day: 'Mon', cc: 520, social: 0 },
      { day: 'Tue', cc: 540, social: 0 },
      { day: 'Wed', cc: 560, social: 0 },
      { day: 'Thu', cc: 575, social: 0 },
      { day: 'Fri', cc: 590, social: 0 },
      { day: 'Sat', cc: 600, social: 0 },
      { day: 'Sun', cc: 610, social: 0 },
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
    sentiment: { cc: -0.62, social: 0 },
    category: 'Safety',
    sparkline: [
      { day: 'Mon', cc: 238, social: 0 },
      { day: 'Tue', cc: 239, social: 0 },
      { day: 'Wed', cc: 240, social: 0 },
      { day: 'Thu', cc: 240, social: 0 },
      { day: 'Fri', cc: 240, social: 0 },
      { day: 'Sat', cc: 240, social: 0 },
      { day: 'Sun', cc: 240, social: 0 },
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
    id: 'rc-app-tech',
    topicId: 'app-rebooking-tech-issues',
    zone: 'blind-spot',
    headline: 'App / Rebooking Tech Issues',
    whyMissing: "Customers hit the app wall and abandon — they never reach an agent. The failure is invisible in contact center data because the contact never happens.",
    rootCause: "It's not the rebooking process — it's a broken digital entry point. The Fly Delta app has a session timeout bug preventing completion. Customers who can't self-serve don't call; they vent.",
    recommendedAction: "Raise a P1 digital incident immediately. Brief agents to acknowledge the app issue proactively and complete rebooking manually — don't redirect to a broken channel.",
    department: "Digital + Operations",
    urgency: 'high',
    actionType: 'digital-incident',
    actionLabel: 'Raise Digital Incident',
    actionDetail: 'A P1 digital incident will be raised with the Fly Delta app and web platform team. Contact center agents will be briefed with an interim acknowledgement script: "I\'m aware our app is currently experiencing issues — let me help you directly here."',
    status: 'pending',
    trendLabel: '+62% social mentions this week',
  },
  {
    id: 'rc-booking-problems',
    topicId: 'flight-booking-problems',
    zone: 'blind-spot',
    headline: 'Flight Booking Problems',
    whyMissing: "Customers who can't book online don't call — they abandon or escalate to social. Long hold times make calling feel futile after a digital failure.",
    rootCause: "Booking flow friction (likely a payment gateway or session drop) is blocking completion at scale. Social is the pressure valve — customers go there when the product fails them.",
    recommendedAction: "Alert Digital Operations with the social volume spike. Issue agents a manual booking workaround guide so they can complete bookings for customers who do break through.",
    department: "Digital Operations",
    urgency: 'high',
    actionType: 'notify-ops',
    actionLabel: 'Notify Digital Operations',
    actionDetail: 'An alert will be sent to the Digital Operations team with the social volume data and a request to investigate booking flow friction. Agents will be issued a manual booking guide for customers who escalate via phone after failing online.',
    status: 'pending',
    trendLabel: '+40% social mentions this week',
  },
  {
    id: 'rc-fa-complaints',
    topicId: 'flight-attendant-complaints',
    zone: 'blind-spot',
    headline: 'Flight Attendant Complaints',
    whyMissing: "Passengers experiencing poor cabin crew behaviour vent publicly — they don't see contacting customer service as the right channel for an in-flight complaint.",
    rootCause: "No structured path exists for passengers to report crew behaviour through the contact center. The signal goes to social and dies there, never reaching the In-Flight Training team.",
    recommendedAction: "Escalate the social sentiment report to In-Flight Training for the next crew briefing. Coach agents to tag and route any crew complaints they do receive.",
    department: "In-Flight Training + QM",
    urgency: 'medium',
    actionType: 'escalate-training',
    actionLabel: 'Escalate to In-Flight Training',
    actionDetail: 'The social sentiment report for Flight Attendant Complaints will be escalated to the In-Flight Service Training team for inclusion in the next crew briefing cycle. Contact center agents will be coached to correctly tag and route any in-cabin complaints they do receive.',
    status: 'pending',
    trendLabel: '+22% social mentions this week',
  },
  {
    id: 'rc-bad-flight',
    topicId: 'bad-flight-experience',
    zone: 'blind-spot',
    headline: 'Bad Flight Experience',
    whyMissing: "General in-flight dissatisfaction rarely triggers a call — customers absorb it, post publicly, and move on. The contact center never gets the chance to recover them.",
    rootCause: "Delta has no proactive outreach mechanism for customers who experience a poor flight but don't escalate. The recovery window closes within 48 hours — after that, sentiment hardens.",
    recommendedAction: "Activate a proactive recovery outreach for passengers on recently flagged routes. A timely goodwill gesture shifts NPS 8–12 points and prevents the complaint going further.",
    department: "CX Operations + CRM",
    urgency: 'medium',
    actionType: 'proactive-recovery',
    actionLabel: 'Launch Proactive Recovery',
    actionDetail: 'A proactive recovery outreach will be activated for passengers on recently flagged routes and flights with elevated social complaint volume. The recovery message will acknowledge the experience and offer a goodwill gesture, routed through Delta\'s existing CRM workflow.',
    status: 'pending',
    trendLabel: '+8% social mentions this week',
  },
  {
    id: 'rc-seating',
    topicId: 'seating-dissatisfaction',
    zone: 'blind-spot',
    headline: 'Seating Dissatisfaction',
    whyMissing: "Customers rarely call specifically about seating — they accept a bad seat and post about it instead. The frustration never becomes a contact center data point.",
    rootCause: "Agent scripts lack a consistent, compensatory response for seat downgrades and Comfort+ disappointments. When calls do come through, the recovery is ad-hoc and inconsistent.",
    recommendedAction: "Publish an updated Agent Response Guide with explicit compensation thresholds for seating contacts to standardise recovery and reduce repeat contacts.",
    department: "QM + Operations",
    urgency: 'low',
    actionType: 'update-script',
    actionLabel: 'Update Agent Response Guide',
    actionDetail: 'An updated Agent Response Guide will be published for seating-related contacts, covering: (1) when to offer a seat-downgrade compensation credit, (2) proactive re-accommodation language for Comfort+ disappointments, and (3) bin space conflict de-escalation steps.',
    status: 'pending',
    trendLabel: '−10% social mentions this week',
  },
  {
    id: 'rc-competitor',
    topicId: 'competitor-mention',
    zone: 'blind-spot',
    headline: 'Competitor Mentions',
    whyMissing: "Customers who are mentally switching don't call — they've decided and post publicly as a warning to others. The contact center sees nothing because the relationship is already ending.",
    rootCause: "There's no churn signal routing from contact center to the loyalty team. At-risk customers are undetected until they formally switch — by which point it's too late to intervene.",
    recommendedAction: "Activate the Retention Workflow so that the 'Churn Risk' disposition tag triggers a 24-hour loyalty team follow-up with a personalised retention offer.",
    department: "Loyalty + Retention",
    urgency: 'low',
    actionType: 'retention-workflow',
    actionLabel: 'Activate Retention Workflow',
    actionDetail: 'The CXone Retention Workflow will be activated: agents will apply the "Churn Risk" disposition tag when detecting competitive switching language. This triggers an automatic 24-hour follow-up from the Loyalty team with a personalised retention offer.',
    status: 'pending',
    trendLabel: '+14% social mentions this week',
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
