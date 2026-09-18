import { createVerify, generateKeyPairSync } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildJwtAssertion,
  fetchAccessToken,
  fetchStats,
  fetchTopEvents,
  mapRowsResponse,
  mapStatsResponse,
  parseServiceAccount,
  type Ga4Access,
  type ServiceAccountKey,
} from '../../../scripts/weekly-report/ga4.ts';
import { EXCLUDED_EVENTS } from '../../../scripts/weekly-report/report.const.ts';
import type { WeekRange } from '../../../scripts/weekly-report/week.ts';

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const KEY: ServiceAccountKey = {
  client_email: 'report@project.iam.gserviceaccount.com',
  private_key: privateKey,
  token_uri: 'https://oauth2.googleapis.com/token',
};

const ACCESS: Ga4Access = { propertyId: '123', accessToken: 'token-abc' };

const RANGE: WeekRange = {
  startDateIso: '2026-09-07',
  endDateIso: '2026-09-13',
  previousStartDateIso: '2026-08-31',
  previousEndDateIso: '2026-09-06',
};

function decodeSegment(segment: string): Record<string, unknown> {
  return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));
}

function statsRow(rangeName: string, values: number[]) {
  return {
    dimensionValues: [{ value: rangeName }],
    metricValues: values.map((value) => ({ value: String(value) })),
  };
}

describe('parseServiceAccount', () => {
  it('returns the key when the required fields are present', () => {
    expect(parseServiceAccount(JSON.stringify(KEY))).toEqual(KEY);
  });

  it('throws when a required field is missing', () => {
    const { client_email, token_uri } = KEY;
    expect(() =>
      parseServiceAccount(JSON.stringify({ client_email, token_uri }))
    ).toThrow('champ private_key manquant');
  });
});

describe('buildJwtAssertion', () => {
  it('builds an RS256 JWT with the analytics readonly scope', () => {
    const issuedAt = 1_757_000_000;
    const assertion = buildJwtAssertion(KEY, issuedAt);
    const [header, payload, signature] = assertion.split('.');

    expect(decodeSegment(header)).toEqual({ alg: 'RS256', typ: 'JWT' });
    expect(decodeSegment(payload)).toEqual({
      iss: KEY.client_email,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: KEY.token_uri,
      iat: issuedAt,
      exp: issuedAt + 3600,
    });
    const verified = createVerify('RSA-SHA256')
      .update(`${header}.${payload}`)
      .verify(publicKey, signature, 'base64url');
    expect(verified).toBe(true);
  });
});

describe('with a mocked fetch', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    mockFetch.mockReset();
    vi.stubGlobal('fetch', mockFetch);
  });

  it('fetchAccessToken exchanges the JWT for an access token', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'ya29.token' }),
    });

    const token = await fetchAccessToken(KEY);

    expect(token).toBe('ya29.token');
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe(KEY.token_uri);
    expect(options.method).toBe('POST');
    const body = new URLSearchParams(options.body);
    expect(body.get('grant_type')).toBe(
      'urn:ietf:params:oauth:grant-type:jwt-bearer'
    );
    expect(body.get('assertion')?.split('.')).toHaveLength(3);
  });

  it('fetchAccessToken throws with the HTTP status on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'invalid_grant',
    });

    await expect(fetchAccessToken(KEY)).rejects.toThrow(
      'Google OAuth 400 : invalid_grant'
    );
  });

  it('fetchStats requests both weeks in one report and maps them', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rows: [
          statsRow('previous', [194, 172, 305, 0.52, 61]),
          statsRow('current', [186, 148, 412, 0.44, 83]),
        ],
      }),
    });

    const stats = await fetchStats(ACCESS, RANGE);

    expect(stats).toEqual({
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
    });
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe(
      'https://analyticsdata.googleapis.com/v1beta/properties/123:runReport'
    );
    expect(options.headers.Authorization).toBe('Bearer token-abc');
    const body = JSON.parse(options.body);
    expect(body.dateRanges).toEqual([
      { startDate: '2026-09-07', endDate: '2026-09-13', name: 'current' },
      { startDate: '2026-08-31', endDate: '2026-09-06', name: 'previous' },
    ]);
    expect(body.metrics.map((metric: { name: string }) => metric.name)).toEqual(
      [
        'sessions',
        'totalUsers',
        'screenPageViews',
        'bounceRate',
        'averageSessionDuration',
      ]
    );
    expect(body.dimensions).toBeUndefined();
  });

  it('fetchTopEvents excludes automatic events and limits to 8 rows', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rows: [
          {
            dimensionValues: [{ value: 'cta_click' }],
            metricValues: [{ value: '14' }],
          },
        ],
      }),
    });

    const rows = await fetchTopEvents(ACCESS, RANGE);

    expect(rows).toEqual([{ label: 'cta_click', value: 14 }]);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.dimensions).toEqual([{ name: 'eventName' }]);
    expect(body.metrics).toEqual([{ name: 'eventCount' }]);
    expect(body.orderBys).toEqual([
      { metric: { metricName: 'eventCount' }, desc: true },
    ]);
    expect(body.limit).toBe(8);
    expect(body.dimensionFilter.notExpression.filter).toEqual({
      fieldName: 'eventName',
      inListFilter: { values: [...EXCLUDED_EVENTS] },
    });
  });

  it('runReport throws with the HTTP status on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: async () => 'PERMISSION_DENIED',
    });

    await expect(fetchStats(ACCESS, RANGE)).rejects.toThrow(
      'GA4 Data API 403 : PERMISSION_DENIED'
    );
  });
});

describe('mapStatsResponse', () => {
  it('fills a missing date range with zeros', () => {
    const stats = mapStatsResponse({
      rows: [statsRow('current', [3, 3, 3, 1, 0])],
    });
    expect(stats.current.visits).toBe(3);
    expect(stats.previous).toEqual({
      visits: 0,
      visitors: 0,
      pageviews: 0,
      bounceRate: 0,
      avgDuration: 0,
    });
  });

  it('returns zeros when the response has no rows', () => {
    const stats = mapStatsResponse({});
    expect(stats.current.pageviews).toBe(0);
    expect(stats.previous.pageviews).toBe(0);
  });
});

describe('mapRowsResponse', () => {
  it('maps dimension and metric values and relabels direct traffic', () => {
    expect(
      mapRowsResponse({
        rows: [
          {
            dimensionValues: [{ value: '(direct)' }],
            metricValues: [{ value: '88' }],
          },
          {
            dimensionValues: [{ value: 'l.instagram.com' }],
            metricValues: [{ value: '1' }],
          },
        ],
      })
    ).toEqual([
      { label: 'Accès direct', value: 88 },
      { label: 'l.instagram.com', value: 1 },
    ]);
  });

  it('returns an empty list when the response has no rows', () => {
    expect(mapRowsResponse({})).toEqual([]);
  });
});
