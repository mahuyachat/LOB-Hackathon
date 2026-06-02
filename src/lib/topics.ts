// Top-discussed topics across the survey program. Used by the
// "Top Discussed Topics" panel on the Feedback Campaign Monitor.
// Each topic carries headline counts plus 14-day trend series for
// the inline drill-down charts.

export type TopicTrend = 'up' | 'down' | 'flat'

export type Topic = {
  id: string
  name: string
  category: string
  mentions: number
  surveysSent: number
  responses: number
  responseRate: number // %
  csat: number // 0..100 (per-topic CSAT score)
  trend: TopicTrend
  // 14-day trend series for the inline drill-down
  detectionRate: number[] // % of interactions where topic detected
  surveysSentSeries: number[]
  responsesSeries: number[]
  responseRateSeries: number[] // %
}

export const TOPICS: Topic[] = [
  {
    id: 'flight-disruption',
    name: 'Flight Disruption',
    category: 'Service Disruption',
    mentions: 2140,
    surveysSent: 1440,
    responses: 980,
    responseRate: 68,
    csat: 64,
    trend: 'up',
    detectionRate: [12, 13, 14, 14, 15, 16, 17, 18, 18, 19, 20, 21, 22, 22],
    surveysSentSeries: [85, 92, 95, 98, 100, 105, 108, 112, 115, 118, 122, 128, 132, 130],
    responsesSeries: [55, 60, 62, 66, 68, 70, 72, 75, 78, 80, 84, 88, 92, 90],
    responseRateSeries: [64, 65, 65, 67, 68, 67, 67, 67, 68, 68, 69, 69, 70, 68],
  },
  {
    id: 'baggage-claim',
    name: 'Baggage Claim',
    category: 'Service Disruption',
    mentions: 1820,
    surveysSent: 1180,
    responses: 750,
    responseRate: 64,
    csat: 72,
    trend: 'up',
    detectionRate: [10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16],
    surveysSentSeries: [70, 72, 75, 78, 80, 82, 84, 85, 87, 88, 90, 92, 94, 95],
    responsesSeries: [42, 45, 46, 49, 51, 52, 53, 54, 55, 56, 58, 59, 61, 62],
    responseRateSeries: [60, 62, 61, 63, 64, 63, 63, 63, 63, 64, 64, 64, 65, 64],
  },
  {
    id: 'refund-processing',
    name: 'Refund Processing',
    category: 'Service Disruption',
    mentions: 1420,
    surveysSent: 980,
    responses: 642,
    responseRate: 65,
    csat: 66,
    trend: 'up',
    detectionRate: [8, 8, 9, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14],
    surveysSentSeries: [58, 60, 62, 65, 68, 70, 72, 74, 76, 78, 80, 82, 85, 88],
    responsesSeries: [36, 38, 40, 41, 43, 45, 46, 48, 49, 51, 52, 54, 56, 58],
    responseRateSeries: [62, 63, 64, 63, 64, 64, 64, 65, 65, 65, 65, 65, 66, 65],
  },
  {
    id: 'tier-status',
    name: 'Tier Status',
    category: 'Loyalty & Membership',
    mentions: 1180,
    surveysSent: 860,
    responses: 480,
    responseRate: 56,
    csat: 82,
    trend: 'flat',
    detectionRate: [6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    surveysSentSeries: [55, 58, 60, 60, 62, 62, 63, 62, 62, 63, 63, 62, 62, 62],
    responsesSeries: [30, 32, 33, 33, 34, 35, 35, 35, 35, 35, 35, 34, 34, 35],
    responseRateSeries: [55, 55, 55, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 56],
  },
  {
    id: 'account-status',
    name: 'Account Status',
    category: 'Customer Service',
    mentions: 820,
    surveysSent: 540,
    responses: 286,
    responseRate: 53,
    csat: 76,
    trend: 'flat',
    detectionRate: [4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    surveysSentSeries: [35, 36, 38, 38, 40, 39, 40, 40, 41, 41, 41, 40, 40, 41],
    responsesSeries: [18, 19, 20, 20, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22],
    responseRateSeries: [51, 52, 52, 53, 53, 54, 53, 54, 54, 53, 53, 54, 53, 53],
  },
  {
    id: 'general-inquiry',
    name: 'General Inquiry',
    category: 'Customer Service',
    mentions: 1640,
    surveysSent: 410,
    responses: 115,
    responseRate: 28,
    csat: 74,
    trend: 'down',
    detectionRate: [9, 10, 11, 11, 12, 12, 12, 12, 12, 11, 11, 11, 11, 11],
    surveysSentSeries: [40, 38, 36, 34, 32, 32, 30, 30, 28, 28, 27, 28, 28, 28],
    responsesSeries: [16, 14, 12, 11, 10, 9, 9, 9, 8, 8, 8, 8, 8, 8],
    responseRateSeries: [40, 38, 35, 34, 32, 30, 29, 28, 28, 27, 28, 29, 28, 28],
  },
  {
    id: 'upgrade-request',
    name: 'Upgrade Request',
    category: 'Loyalty & Membership',
    mentions: 540,
    surveysSent: 380,
    responses: 220,
    responseRate: 58,
    csat: 80,
    trend: 'flat',
    detectionRate: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    surveysSentSeries: [25, 25, 26, 26, 27, 27, 27, 27, 28, 28, 27, 27, 28, 27],
    responsesSeries: [14, 14, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
    responseRateSeries: [56, 57, 57, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58],
  },
  {
    id: 'pricing',
    name: 'Pricing',
    category: 'Customer Service',
    mentions: 420,
    surveysSent: 280,
    responses: 160,
    responseRate: 57,
    csat: 73,
    trend: 'down',
    detectionRate: [3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    surveysSentSeries: [22, 22, 21, 21, 20, 20, 20, 19, 19, 19, 19, 19, 19, 19],
    responsesSeries: [13, 13, 13, 12, 12, 12, 11, 11, 11, 11, 11, 11, 11, 11],
    responseRateSeries: [60, 59, 58, 58, 58, 58, 57, 57, 57, 57, 57, 57, 57, 57],
  },
]
