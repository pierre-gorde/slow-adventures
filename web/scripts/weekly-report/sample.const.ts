import type { MetricRow, WeekStats } from './ga4.ts';
import { DIRECT_REFERRER_LABEL } from './report.const.ts';

// Données factices pour prévisualiser le rendu du mail sans accès GA4 (--sample).
export const SAMPLE_PROPERTY_ID = '123456789';

export const SAMPLE_STATS: WeekStats = {
  current: {
    visits: 186,
    visitors: 148,
    pageviews: 412,
    bounceRate: 0.44,
    avgDuration: 83,
  },
  previous: {
    visits: 194,
    visitors: 172,
    pageviews: 305,
    bounceRate: 0.52,
    avgDuration: 61,
  },
};

export const SAMPLE_TOP_PAGES: MetricRow[] = [
  { label: '/', value: 156 },
  { label: '/decouvrir/', value: 74 },
  { label: '/mentions-legales/', value: 12 },
  { label: '/politique-de-confidentialite/', value: 5 },
];

export const SAMPLE_TOP_REFERRERS: MetricRow[] = [
  { label: DIRECT_REFERRER_LABEL, value: 88 },
  { label: 'l.instagram.com', value: 47 },
  { label: 'google', value: 33 },
  { label: 'linkedin.com', value: 12 },
];

export const SAMPLE_TOP_EVENTS: MetricRow[] = [
  { label: 'cta_click', value: 14 },
  { label: 'email_capture', value: 6 },
  { label: 'calendly_complete', value: 2 },
];
