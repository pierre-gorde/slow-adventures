export const GA4_DATA_API_URL = 'https://analyticsdata.googleapis.com/v1beta';
export const GA4_READONLY_SCOPE =
  'https://www.googleapis.com/auth/analytics.readonly';
export const GA4_JWT_GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
export const GA4_JWT_HEADER = { alg: 'RS256', typ: 'JWT' } as const;
export const GA4_JWT_SIGN_ALGORITHM = 'RSA-SHA256';
export const GA4_TOKEN_TTL_SECONDS = 3600;
export const GA4_DASHBOARD_BASE_URL =
  'https://analytics.google.com/analytics/web/';
export const GA4_DASHBOARD_REPORT_PATH = '/reports/intelligenthome';
export const GA4_DATE_RANGE_CURRENT = 'current';
export const GA4_DATE_RANGE_PREVIOUS = 'previous';
export const GA4_DIRECT_SOURCE_VALUE = '(direct)';

export const GA4_METRIC_SESSIONS = 'sessions';
export const GA4_METRIC_TOTAL_USERS = 'totalUsers';
export const GA4_METRIC_PAGEVIEWS = 'screenPageViews';
export const GA4_METRIC_BOUNCE_RATE = 'bounceRate';
export const GA4_METRIC_AVG_SESSION_DURATION = 'averageSessionDuration';
export const GA4_METRIC_EVENT_COUNT = 'eventCount';
export const GA4_STATS_METRICS = [
  GA4_METRIC_SESSIONS,
  GA4_METRIC_TOTAL_USERS,
  GA4_METRIC_PAGEVIEWS,
  GA4_METRIC_BOUNCE_RATE,
  GA4_METRIC_AVG_SESSION_DURATION,
] as const;

export const GA4_DIMENSION_PAGE_PATH = 'pagePath';
export const GA4_DIMENSION_SESSION_SOURCE = 'sessionSource';
export const GA4_DIMENSION_EVENT_NAME = 'eventName';

// Events automatiques GA4 (enhanced measurement) + events maison qui ne sont pas
// des clics (scroll_depth, utm_params) : exclus pour ne garder que cta_click,
// email_capture et calendly_complete émis par src/lib/analytics.ts.
export const EXCLUDED_EVENTS = [
  'page_view',
  'session_start',
  'first_visit',
  'user_engagement',
  'scroll',
  'click',
  'view_search_results',
  'file_download',
  'form_start',
  'form_submit',
  'video_start',
  'video_progress',
  'video_complete',
  'scroll_depth',
  'utm_params',
] as const;

export const BREVO_EMAIL_API_URL = 'https://api.brevo.com/v3/smtp/email';
export const EMAIL_SENDER_NAME = 'Slow Adventures — Rapport hebdo';
export const RECIPIENTS_SEPARATOR = ',';

export const REPORT_TIMEZONE = 'Europe/Paris';
export const REPORT_LOCALE = 'fr-FR';
export const TOP_ROWS_LIMIT = 8;

export const SITE_LABEL = 'slowadventures.fr';
export const EMAIL_SUBJECT_PREFIX = 'Rapport hebdo';
export const DIRECT_REFERRER_LABEL = 'Accès direct';

// Emails HTML : pas de système de theme possible, les couleurs vivent ici.
// Palette alignée sur les tokens de src/styles/global.css (warm-black, warm-gray,
// terracotta, creme-dark, creme).
export const EMAIL_COLORS = {
  text: '#2c2825',
  muted: '#6b5e52',
  accent: '#a65330',
  border: '#f5ede3',
  bgSubtle: '#fff9f3',
} as const;
