// Shared campaign data for the prototype.
// All numbers are hand-tuned to tell the demo narrative described in
// the plan file: one star performer, one paused under-performer, one
// steady, one growing, one not yet live.

import type { Topic } from './topics'

export type CampaignStatus = 'active' | 'paused' | 'draft' | 'ended'

export type Trend = 'up' | 'down' | 'flat'

export type Campaign = {
  id: string
  name: string
  version: string
  status: CampaignStatus
  channels: string[]
  daysRunning: number | null
  sent: number | null
  sentDelta: { tone: Trend; text: string } | null
  responseRate: number | null
  responseDelta: { tone: Trend; text: string } | null
  avgVu: number | null
  avgVuDelta: { tone: Trend; text: string } | null
  topIntents: string[]
  trigger: string
  // Mini sparkline data — 14 daily response rates
  sparkline: number[]
  storyTone?: 'star' | 'needs-attention' | 'steady' | 'growing' | 'draft'
  // Monitoring-table fields
  csat: number | null
  category: string
  // 14-day CSAT history for the campaign-level CSAT KPI tile
  csatSeries: number[]
  // On-theme topics surfaced inside this campaign's surveys.
  // Drives the Top Topics table on the per-campaign drill-down.
  topics: Topic[]
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'flight-disruption-recovery',
    name: 'Flight Disruption Recovery',
    version: 'v2.1',
    status: 'active',
    channels: ['SMS', 'WhatsApp', 'AI Agent'],
    daysRunning: 14,
    sent: 1810,
    sentDelta: { tone: 'up', text: '+8%' },
    responseRate: 67,
    responseDelta: { tone: 'up', text: '+6pp' },
    avgVu: 38,
    avgVuDelta: { tone: 'down', text: '−4' },
    topIntents: ['Flight Disruption', 'Baggage Claim', 'Refund Processing'],
    trigger: 'Flight Disruption OR Baggage Claim · VU ≥ 32',
    sparkline: [55, 58, 60, 59, 62, 64, 63, 65, 66, 64, 67, 68, 67, 67],
    storyTone: 'star',
    csat: 84,
    csatSeries: [80, 80, 81, 81, 82, 82, 82, 83, 83, 84, 84, 84, 84, 84],
    category: 'Service Disruption',
    // Per-topic surveys-sent + responses sum to the campaign totals (sent 1,810 · responses ~1,213).
    topics: [
      {
        id: 'fdr-flight-disruption',
        name: 'Flight Disruption',
        category: 'Service Disruption',
        mentions: 1240, surveysSent: 540, responses: 378, responseRate: 70, csat: 78, trend: 'up',
        detectionRate: [42, 44, 46, 48, 50, 52, 54, 55, 56, 57, 58, 59, 60, 61],
        surveysSentSeries: [32, 34, 35, 36, 38, 38, 39, 39, 40, 40, 41, 42, 42, 42],
        responsesSeries: [21, 22, 24, 25, 26, 27, 27, 28, 28, 29, 29, 29, 30, 29],
        responseRateSeries: [66, 66, 67, 68, 69, 69, 70, 70, 70, 71, 71, 70, 71, 70],
      },
      {
        id: 'fdr-rebooking',
        name: 'Rebooking',
        category: 'Service Disruption',
        mentions: 880, surveysSent: 380, responses: 262, responseRate: 69, csat: 82, trend: 'up',
        detectionRate: [28, 30, 31, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 42],
        surveysSentSeries: [23, 24, 25, 26, 26, 27, 27, 28, 29, 29, 29, 30, 30, 30],
        responsesSeries: [15, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 20, 21, 21],
        responseRateSeries: [66, 67, 67, 68, 68, 69, 69, 68, 69, 69, 69, 68, 70, 69],
      },
      {
        id: 'fdr-compensation',
        name: 'Compensation',
        category: 'Service Disruption',
        mentions: 720, surveysSent: 300, responses: 162, responseRate: 54, csat: 62, trend: 'flat',
        detectionRate: [22, 23, 24, 24, 25, 26, 26, 27, 27, 27, 28, 28, 28, 28],
        surveysSentSeries: [19, 20, 20, 21, 21, 21, 22, 22, 22, 22, 22, 23, 23, 23],
        responsesSeries: [10, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        responseRateSeries: [53, 53, 52, 53, 54, 54, 54, 54, 54, 55, 54, 54, 54, 54],
      },
      {
        id: 'fdr-comms',
        name: 'Communication During Disruption',
        category: 'Service Disruption',
        mentions: 540, surveysSent: 240, responses: 175, responseRate: 73, csat: 76, trend: 'up',
        detectionRate: [16, 17, 18, 19, 19, 20, 21, 22, 23, 23, 24, 25, 25, 26],
        surveysSentSeries: [12, 13, 14, 15, 17, 17, 18, 18, 18, 19, 19, 19, 20, 20],
        responsesSeries: [8, 10, 10, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 15],
        responseRateSeries: [68, 70, 70, 71, 71, 72, 72, 72, 73, 73, 73, 74, 73, 73],
      },
      {
        id: 'fdr-refund',
        name: 'Refund Processing',
        category: 'Service Disruption',
        mentions: 480, surveysSent: 210, responses: 141, responseRate: 67, csat: 80, trend: 'up',
        detectionRate: [14, 15, 16, 17, 17, 18, 19, 19, 20, 20, 21, 22, 22, 23],
        surveysSentSeries: [11, 12, 12, 13, 14, 15, 15, 16, 16, 16, 17, 17, 17, 18],
        responsesSeries: [7, 8, 8, 9, 9, 10, 10, 11, 11, 11, 11, 12, 12, 12],
        responseRateSeries: [64, 65, 65, 66, 66, 66, 67, 67, 67, 67, 68, 67, 68, 67],
      },
      {
        id: 'fdr-baggage',
        name: 'Baggage Claim',
        category: 'Service Disruption',
        mentions: 320, surveysSent: 140, responses: 90, responseRate: 64, csat: 74, trend: 'flat',
        detectionRate: [10, 10, 11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14],
        surveysSentSeries: [8, 9, 9, 9, 9, 10, 10, 10, 11, 11, 11, 11, 11, 11],
        responsesSeries: [5, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7],
        responseRateSeries: [62, 67, 67, 67, 67, 60, 60, 60, 55, 64, 64, 64, 64, 64],
      },
    ],
  },
  {
    id: 'baggage-claim-followup',
    name: 'Baggage Claim Follow-up',
    version: 'v1.3',
    status: 'active',
    channels: ['SMS', 'Email'],
    daysRunning: 21,
    sent: 980,
    sentDelta: { tone: 'up', text: '+12%' },
    responseRate: 61,
    responseDelta: { tone: 'up', text: '+4pp' },
    avgVu: 36,
    avgVuDelta: { tone: 'flat', text: '→' },
    topIntents: ['Baggage', 'Lost Item', 'Compensation'],
    trigger: 'Baggage Claim · VU ≥ 30',
    sparkline: [52, 54, 53, 55, 56, 58, 57, 58, 59, 60, 59, 61, 60, 61],
    storyTone: 'growing',
    csat: 78,
    csatSeries: [72, 73, 73, 74, 75, 75, 76, 76, 77, 77, 78, 78, 78, 78],
    category: 'Service Disruption',
    // Per-topic surveys-sent + responses sum to the campaign totals (sent 980 · responses ~598).
    topics: [
      {
        id: 'bcf-baggage-claim',
        name: 'Baggage Claim',
        category: 'Service Disruption',
        mentions: 880, surveysSent: 460, responses: 294, responseRate: 64, csat: 76, trend: 'up',
        detectionRate: [38, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52],
        surveysSentSeries: [29, 30, 31, 32, 32, 33, 34, 35, 35, 35, 36, 37, 37, 24],
        responsesSeries: [17, 19, 19, 19, 20, 21, 22, 22, 22, 22, 23, 23, 24, 21],
        responseRateSeries: [60, 62, 63, 61, 62, 63, 64, 65, 65, 63, 64, 63, 65, 64],
      },
      {
        id: 'bcf-lost-item',
        name: 'Lost Item',
        category: 'Service Disruption',
        mentions: 360, surveysSent: 180, responses: 112, responseRate: 62, csat: 64, trend: 'up',
        detectionRate: [14, 15, 15, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21],
        surveysSentSeries: [10, 11, 12, 12, 12, 13, 13, 14, 14, 14, 14, 14, 15, 12],
        responsesSeries: [6, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 10, 6],
        responseRateSeries: [60, 61, 61, 62, 62, 62, 62, 62, 62, 63, 62, 62, 62, 62],
      },
      {
        id: 'bcf-damaged',
        name: 'Damaged Item',
        category: 'Service Disruption',
        mentions: 220, surveysSent: 120, responses: 70, responseRate: 58, csat: 58, trend: 'flat',
        detectionRate: [9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12],
        surveysSentSeries: [7, 7, 8, 8, 9, 9, 9, 9, 9, 9, 9, 10, 10, 7],
        responsesSeries: [4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 3],
        responseRateSeries: [58, 58, 58, 57, 58, 58, 58, 58, 58, 58, 58, 57, 58, 58],
      },
      {
        id: 'bcf-compensation',
        name: 'Compensation',
        category: 'Service Disruption',
        mentions: 180, surveysSent: 95, responses: 55, responseRate: 58, csat: 70, trend: 'flat',
        detectionRate: [7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 10, 10],
        surveysSentSeries: [6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6],
        responsesSeries: [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 3],
        responseRateSeries: [56, 57, 57, 58, 58, 58, 58, 58, 58, 59, 58, 58, 58, 58],
      },
      {
        id: 'bcf-delivery',
        name: 'Delivery Timeline',
        category: 'Service Disruption',
        mentions: 140, surveysSent: 75, responses: 45, responseRate: 60, csat: 82, trend: 'up',
        detectionRate: [5, 6, 6, 6, 6, 7, 7, 7, 8, 8, 8, 8, 8, 9],
        surveysSentSeries: [5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 4],
        responsesSeries: [3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 0],
        responseRateSeries: [58, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 60],
      },
      {
        id: 'bcf-description',
        name: 'Item Description',
        category: 'Service Disruption',
        mentions: 80, surveysSent: 50, responses: 26, responseRate: 52, csat: 72, trend: 'flat',
        detectionRate: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5],
        surveysSentSeries: [3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2],
        responsesSeries: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
        responseRateSeries: [50, 50, 50, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53],
      },
    ],
  },
  {
    id: 'loyalty-tier-checkin',
    name: 'Loyalty Tier Check-in',
    version: 'v2.0',
    status: 'active',
    channels: ['Email', 'WhatsApp'],
    daysRunning: 30,
    sent: 2240,
    sentDelta: { tone: 'flat', text: '→' },
    responseRate: 54,
    responseDelta: { tone: 'flat', text: '→' },
    avgVu: 31,
    avgVuDelta: { tone: 'flat', text: '→' },
    topIntents: ['Tier Status', 'Upgrade Request', 'Benefits Inquiry'],
    trigger: 'Loyalty members · post-interaction · VU ≥ 25',
    sparkline: [52, 53, 54, 54, 53, 55, 54, 54, 55, 54, 53, 54, 55, 54],
    storyTone: 'steady',
    csat: 74,
    csatSeries: [73, 74, 74, 73, 74, 74, 75, 74, 73, 74, 74, 73, 74, 74],
    category: 'Loyalty & Membership',
    // Per-topic surveys-sent + responses sum to the campaign totals (sent 2,240 · responses ~1,210).
    topics: [
      {
        id: 'ltc-tier-status',
        name: 'Tier Status',
        category: 'Loyalty & Membership',
        mentions: 940, surveysSent: 830, responses: 465, responseRate: 56, csat: 86, trend: 'flat',
        detectionRate: [38, 39, 39, 40, 40, 40, 41, 41, 41, 42, 42, 42, 42, 42],
        surveysSentSeries: [53, 55, 56, 56, 57, 57, 58, 58, 60, 60, 60, 60, 61, 61],
        responsesSeries: [30, 31, 31, 31, 32, 32, 32, 33, 33, 33, 33, 33, 33, 38],
        responseRateSeries: [55, 56, 56, 55, 56, 56, 56, 57, 56, 56, 56, 56, 55, 56],
      },
      {
        id: 'ltc-upgrade',
        name: 'Upgrade Request',
        category: 'Loyalty & Membership',
        mentions: 640, surveysSent: 570, responses: 330, responseRate: 58, csat: 78, trend: 'flat',
        detectionRate: [26, 26, 26, 27, 27, 27, 28, 28, 28, 28, 28, 29, 29, 29],
        surveysSentSeries: [38, 38, 39, 39, 40, 40, 40, 42, 42, 42, 42, 42, 42, 44],
        responsesSeries: [21, 21, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 25, 26],
        responseRateSeries: [56, 56, 58, 58, 56, 59, 59, 57, 57, 57, 57, 57, 60, 57],
      },
      {
        id: 'ltc-benefits',
        name: 'Benefits Inquiry',
        category: 'Loyalty & Membership',
        mentions: 380, surveysSent: 335, responses: 181, responseRate: 54, csat: 80, trend: 'flat',
        detectionRate: [15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17],
        surveysSentSeries: [23, 23, 24, 24, 24, 24, 24, 24, 25, 25, 25, 24, 24, 22],
        responsesSeries: [12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14],
        responseRateSeries: [53, 53, 55, 55, 55, 55, 55, 55, 52, 52, 52, 55, 55, 54],
      },
      {
        id: 'ltc-points',
        name: 'Reward Points',
        category: 'Loyalty & Membership',
        mentions: 260, surveysSent: 240, responses: 122, responseRate: 51, csat: 64, trend: 'flat',
        detectionRate: [10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12],
        surveysSentSeries: [16, 16, 17, 17, 17, 17, 18, 18, 17, 17, 17, 17, 17, 19],
        responsesSeries: [8, 8, 8, 8, 8, 9, 10, 8, 8, 9, 9, 9, 10, 10],
        responseRateSeries: [50, 50, 47, 47, 47, 53, 56, 44, 47, 53, 53, 53, 59, 53],
      },
      {
        id: 'ltc-renewal',
        name: 'Membership Renewal',
        category: 'Loyalty & Membership',
        mentions: 180, surveysSent: 165, responses: 84, responseRate: 51, csat: 84, trend: 'flat',
        detectionRate: [7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
        surveysSentSeries: [11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11],
        responsesSeries: [5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7],
        responseRateSeries: [45, 55, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 51],
      },
      {
        id: 'ltc-lounge',
        name: 'Lounge Access',
        category: 'Loyalty & Membership',
        mentions: 110, surveysSent: 100, responses: 48, responseRate: 48, csat: 56, trend: 'flat',
        detectionRate: [4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        surveysSentSeries: [6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 10],
        responsesSeries: [3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3],
        responseRateSeries: [50, 50, 43, 57, 57, 57, 57, 57, 57, 57, 57, 57, 50, 48],
      },
    ],
  },
  {
    id: 'general-inquiry-pulse',
    name: 'General Inquiry Pulse',
    version: 'v1.0',
    status: 'active',
    channels: ['Email'],
    daysRunning: 12,
    sent: 410,
    sentDelta: { tone: 'down', text: '−22%' },
    responseRate: 28,
    responseDelta: { tone: 'down', text: '−14pp' },
    avgVu: 22,
    avgVuDelta: { tone: 'down', text: '−6' },
    topIntents: ['General Inquiry', 'Account Status', 'Pricing'],
    trigger: 'General Inquiry · VU ≥ 18',
    sparkline: [42, 40, 38, 35, 34, 32, 33, 30, 28, 27, 28, 29, 28, 28],
    storyTone: 'needs-attention',
    csat: 58,
    csatSeries: [72, 70, 68, 66, 65, 63, 62, 61, 60, 59, 58, 58, 58, 58],
    category: 'Customer Service',
    topics: [
      {
        id: 'gip-general',
        name: 'General Inquiry',
        category: 'Customer Service',
        mentions: 220, surveysSent: 180, responses: 52, responseRate: 29, csat: 56, trend: 'down',
        detectionRate: [22, 22, 21, 21, 20, 20, 19, 19, 18, 18, 18, 17, 17, 17],
        surveysSentSeries: [16, 16, 15, 14, 14, 13, 13, 13, 12, 12, 12, 12, 12, 13],
        responsesSeries: [6, 6, 5, 5, 4, 4, 4, 4, 4, 4, 3, 3, 4, 4],
        responseRateSeries: [38, 38, 33, 36, 29, 31, 31, 31, 33, 33, 25, 25, 33, 29],
      },
      {
        id: 'gip-account',
        name: 'Account Status',
        category: 'Customer Service',
        mentions: 90, surveysSent: 72, responses: 22, responseRate: 31, csat: 60, trend: 'down',
        detectionRate: [9, 9, 9, 8, 8, 8, 7, 7, 7, 7, 7, 7, 7, 7],
        surveysSentSeries: [6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        responsesSeries: [2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2],
        responseRateSeries: [33, 33, 33, 40, 40, 40, 20, 40, 40, 20, 40, 40, 20, 31],
      },
      {
        id: 'gip-pricing',
        name: 'Pricing',
        category: 'Customer Service',
        mentions: 70, surveysSent: 56, responses: 18, responseRate: 32, csat: 48, trend: 'flat',
        detectionRate: [7, 7, 7, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5],
        surveysSentSeries: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        responsesSeries: [1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
        responseRateSeries: [25, 25, 25, 50, 25, 25, 25, 50, 25, 25, 25, 25, 25, 32],
      },
      {
        id: 'gip-booking-change',
        name: 'Booking Change',
        category: 'Customer Service',
        mentions: 60, surveysSent: 48, responses: 14, responseRate: 29, csat: 68, trend: 'down',
        detectionRate: [6, 6, 6, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4],
        surveysSentSeries: [4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        responsesSeries: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        responseRateSeries: [25, 25, 25, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 29],
      },
      {
        id: 'gip-hours',
        name: 'Service Hours',
        category: 'Customer Service',
        mentions: 40, surveysSent: 32, responses: 8, responseRate: 25, csat: 54, trend: 'down',
        detectionRate: [4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        surveysSentSeries: [3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        responsesSeries: [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1],
        responseRateSeries: [33, 33, 50, 50, 0, 50, 50, 50, 0, 50, 50, 0, 50, 25],
      },
      {
        id: 'gip-policy',
        name: 'Policy Question',
        category: 'Customer Service',
        mentions: 30, surveysSent: 22, responses: 6, responseRate: 27, csat: 42, trend: 'down',
        detectionRate: [3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        surveysSentSeries: [2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 1, 2, 1],
        responsesSeries: [1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
        responseRateSeries: [50, 50, 50, 0, 0, 0, 0, 50, 0, 50, 0, 0, 50, 27],
      },
    ],
  },
]

export function getCampaignById(id: string): Campaign | undefined {
  return CAMPAIGNS.find(c => c.id === id)
}

// Portfolio-level rollups
export function portfolioSummary() {
  const active = CAMPAIGNS.filter(c => c.status === 'active')
  const totalSent = active.reduce((s, c) => s + (c.sent ?? 0), 0)
  const respondingActive = active.filter(c => c.responseRate !== null)
  const avgResponse = respondingActive.length
    ? Math.round(
        (respondingActive.reduce((s, c) => s + (c.responseRate ?? 0), 0) /
          respondingActive.length) *
          10
      ) / 10
    : 0
  const totalResponses = active.reduce(
    (s, c) => s + Math.round(((c.sent ?? 0) * (c.responseRate ?? 0)) / 100),
    0
  )
  const csatActive = active.filter(c => c.csat !== null)
  const avgCsat = csatActive.length
    ? Math.round(csatActive.reduce((s, c) => s + (c.csat ?? 0), 0) / csatActive.length)
    : 0
  return {
    activeCount: active.length,
    totalCampaigns: CAMPAIGNS.length,
    totalSent,
    avgResponse,
    totalResponses,
    avgCsat,
    aPlusShare: 18, // demo-fixed across portfolio
  }
}
