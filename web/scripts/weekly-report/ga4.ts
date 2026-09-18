import { createSign } from 'node:crypto';
import {
  DIRECT_REFERRER_LABEL,
  EXCLUDED_EVENTS,
  GA4_DASHBOARD_BASE_URL,
  GA4_DASHBOARD_REPORT_PATH,
  GA4_DATA_API_URL,
  GA4_DATE_RANGE_CURRENT,
  GA4_DATE_RANGE_PREVIOUS,
  GA4_DIMENSION_EVENT_NAME,
  GA4_DIMENSION_PAGE_PATH,
  GA4_DIMENSION_SESSION_SOURCE,
  GA4_DIRECT_SOURCE_VALUE,
  GA4_JWT_GRANT_TYPE,
  GA4_JWT_HEADER,
  GA4_JWT_SIGN_ALGORITHM,
  GA4_METRIC_AVG_SESSION_DURATION,
  GA4_METRIC_BOUNCE_RATE,
  GA4_METRIC_EVENT_COUNT,
  GA4_METRIC_PAGEVIEWS,
  GA4_METRIC_SESSIONS,
  GA4_METRIC_TOTAL_USERS,
  GA4_READONLY_SCOPE,
  GA4_STATS_METRICS,
  GA4_TOKEN_TTL_SECONDS,
  TOP_ROWS_LIMIT,
} from './report.const.ts';
import type { WeekRange } from './week.ts';

export type StatsSnapshot = {
  visits: number;
  visitors: number;
  pageviews: number;
  bounceRate: number;
  avgDuration: number;
};

export type WeekStats = { current: StatsSnapshot; previous: StatsSnapshot };

export type MetricRow = { label: string; value: number };

export type ServiceAccountKey = {
  client_email: string;
  private_key: string;
  token_uri: string;
};

export type Ga4Access = { propertyId: string; accessToken: string };

type Ga4ReportRow = {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
};

export type Ga4RunReportResponse = { rows?: Ga4ReportRow[] };

type Ga4DateRange = { startDate: string; endDate: string; name: string };

type Ga4DimensionFilter = {
  notExpression: {
    filter: { fieldName: string; inListFilter: { values: string[] } };
  };
};

export type Ga4RunReportRequest = {
  dateRanges: Ga4DateRange[];
  metrics: { name: string }[];
  dimensions?: { name: string }[];
  orderBys?: { metric: { metricName: string }; desc: boolean }[];
  dimensionFilter?: Ga4DimensionFilter;
  limit?: number;
};

type StatsMetricName = (typeof GA4_STATS_METRICS)[number];

const SERVICE_ACCOUNT_REQUIRED_FIELDS = [
  'client_email',
  'private_key',
  'token_uri',
] as const;
const MS_PER_SECOND = 1000;
const EMPTY_SNAPSHOT: StatsSnapshot = {
  visits: 0,
  visitors: 0,
  pageviews: 0,
  bounceRate: 0,
  avgDuration: 0,
};

export function parseServiceAccount(json: string): ServiceAccountKey {
  const parsed = JSON.parse(json) as Partial<ServiceAccountKey>;
  for (const field of SERVICE_ACCOUNT_REQUIRED_FIELDS) {
    if (!parsed[field]) {
      throw new Error(
        `Clé de compte de service invalide : champ ${field} manquant`
      );
    }
  }
  return parsed as ServiceAccountKey;
}

function base64UrlJson(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

// JWT signé à la main plutôt que google-auth-library : zéro dépendance, le
// workflow exécute le script sans npm ci.
export function buildJwtAssertion(
  key: ServiceAccountKey,
  issuedAtSeconds: number
): string {
  const header = base64UrlJson(GA4_JWT_HEADER);
  const payload = base64UrlJson({
    iss: key.client_email,
    scope: GA4_READONLY_SCOPE,
    aud: key.token_uri,
    iat: issuedAtSeconds,
    exp: issuedAtSeconds + GA4_TOKEN_TTL_SECONDS,
  });
  const signature = createSign(GA4_JWT_SIGN_ALGORITHM)
    .update(`${header}.${payload}`)
    .sign(key.private_key, 'base64url');
  return `${header}.${payload}.${signature}`;
}

export async function fetchAccessToken(
  key: ServiceAccountKey
): Promise<string> {
  const assertion = buildJwtAssertion(
    key,
    Math.floor(Date.now() / MS_PER_SECOND)
  );
  const response = await fetch(key.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: GA4_JWT_GRANT_TYPE,
      assertion,
    }).toString(),
  });
  if (!response.ok) {
    throw new Error(
      `Google OAuth ${response.status} : ${await response.text()}`
    );
  }
  const { access_token } = (await response.json()) as { access_token: string };
  return access_token;
}

export async function runReport(
  access: Ga4Access,
  request: Ga4RunReportRequest
): Promise<Ga4RunReportResponse> {
  const response = await fetch(
    `${GA4_DATA_API_URL}/properties/${access.propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  );
  if (!response.ok) {
    throw new Error(
      `GA4 Data API ${response.status} : ${await response.text()}`
    );
  }
  return (await response.json()) as Ga4RunReportResponse;
}

function snapshotFromRow(row: Ga4ReportRow | undefined): StatsSnapshot {
  if (!row) {
    return EMPTY_SNAPSHOT;
  }
  const metric = (name: StatsMetricName): number =>
    Number(row.metricValues[GA4_STATS_METRICS.indexOf(name)]?.value ?? 0);
  return {
    visits: metric(GA4_METRIC_SESSIONS),
    visitors: metric(GA4_METRIC_TOTAL_USERS),
    pageviews: metric(GA4_METRIC_PAGEVIEWS),
    bounceRate: metric(GA4_METRIC_BOUNCE_RATE),
    avgDuration: metric(GA4_METRIC_AVG_SESSION_DURATION),
  };
}

export function mapStatsResponse(response: Ga4RunReportResponse): WeekStats {
  const rows = response.rows ?? [];
  const rowFor = (rangeName: string): Ga4ReportRow | undefined =>
    rows.find((row) => row.dimensionValues[0]?.value === rangeName);
  return {
    current: snapshotFromRow(rowFor(GA4_DATE_RANGE_CURRENT)),
    previous: snapshotFromRow(rowFor(GA4_DATE_RANGE_PREVIOUS)),
  };
}

export function mapRowsResponse(response: Ga4RunReportResponse): MetricRow[] {
  return (response.rows ?? []).map((row) => {
    const raw = row.dimensionValues[0]?.value ?? '';
    return {
      label: raw === GA4_DIRECT_SOURCE_VALUE ? DIRECT_REFERRER_LABEL : raw,
      value: Number(row.metricValues[0]?.value ?? 0),
    };
  });
}

function currentDateRange(range: WeekRange): Ga4DateRange {
  return {
    startDate: range.startDateIso,
    endDate: range.endDateIso,
    name: GA4_DATE_RANGE_CURRENT,
  };
}

export async function fetchStats(
  access: Ga4Access,
  range: WeekRange
): Promise<WeekStats> {
  const response = await runReport(access, {
    dateRanges: [
      currentDateRange(range),
      {
        startDate: range.previousStartDateIso,
        endDate: range.previousEndDateIso,
        name: GA4_DATE_RANGE_PREVIOUS,
      },
    ],
    metrics: GA4_STATS_METRICS.map((name) => ({ name })),
  });
  return mapStatsResponse(response);
}

async function fetchTopRows(
  access: Ga4Access,
  range: WeekRange,
  dimension: string,
  metric: string,
  dimensionFilter?: Ga4DimensionFilter
): Promise<MetricRow[]> {
  const response = await runReport(access, {
    dateRanges: [currentDateRange(range)],
    dimensions: [{ name: dimension }],
    metrics: [{ name: metric }],
    orderBys: [{ metric: { metricName: metric }, desc: true }],
    limit: TOP_ROWS_LIMIT,
    ...(dimensionFilter ? { dimensionFilter } : {}),
  });
  return mapRowsResponse(response);
}

export function fetchTopPages(
  access: Ga4Access,
  range: WeekRange
): Promise<MetricRow[]> {
  return fetchTopRows(
    access,
    range,
    GA4_DIMENSION_PAGE_PATH,
    GA4_METRIC_PAGEVIEWS
  );
}

export function fetchTopSources(
  access: Ga4Access,
  range: WeekRange
): Promise<MetricRow[]> {
  return fetchTopRows(
    access,
    range,
    GA4_DIMENSION_SESSION_SOURCE,
    GA4_METRIC_SESSIONS
  );
}

export function fetchTopEvents(
  access: Ga4Access,
  range: WeekRange
): Promise<MetricRow[]> {
  return fetchTopRows(
    access,
    range,
    GA4_DIMENSION_EVENT_NAME,
    GA4_METRIC_EVENT_COUNT,
    {
      notExpression: {
        filter: {
          fieldName: GA4_DIMENSION_EVENT_NAME,
          inListFilter: { values: [...EXCLUDED_EVENTS] },
        },
      },
    }
  );
}

export function dashboardUrl(propertyId: string): string {
  return `${GA4_DASHBOARD_BASE_URL}#/p${propertyId}${GA4_DASHBOARD_REPORT_PATH}`;
}
