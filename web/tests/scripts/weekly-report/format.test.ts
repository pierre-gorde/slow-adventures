import { describe, expect, it } from 'vitest';
import {
  buildHtml,
  buildSubject,
  formatDuration,
  formatTrend,
  type ReportData,
} from '../../../scripts/weekly-report/format.ts';
import type { WeekRange } from '../../../scripts/weekly-report/week.ts';

const RANGE: WeekRange = {
  startDateIso: '2026-09-07',
  endDateIso: '2026-09-13',
  previousStartDateIso: '2026-08-31',
  previousEndDateIso: '2026-09-06',
};

const DASHBOARD_URL = 'https://analytics.google.com/analytics/web/#/p123';

function reportWith(overrides: Partial<ReportData> = {}): ReportData {
  return {
    range: RANGE,
    stats: {
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
    },
    topPages: [{ label: '/', value: 156 }],
    topReferrers: [{ label: 'l.instagram.com', value: 47 }],
    topEvents: [{ label: 'cta_click', value: 14 }],
    dashboardUrl: DASHBOARD_URL,
    ...overrides,
  };
}

describe('formatTrend', () => {
  it('handles zero previous values', () => {
    expect(formatTrend(0, 0)).toBe('—');
    expect(formatTrend(5, 0)).toBe('nouveau');
  });

  it('reports stable when the rounded delta is zero', () => {
    expect(formatTrend(100, 100)).toBe('stable');
    expect(formatTrend(100.4, 100)).toBe('stable');
  });

  it('formats signed percentages vs previous week', () => {
    expect(formatTrend(120, 100)).toBe('+20 % vs S-1');
    expect(formatTrend(80, 100)).toBe('-20 % vs S-1');
    expect(formatTrend(101, 100)).toBe('+1 % vs S-1');
  });
});

describe('formatDuration', () => {
  it('formats seconds and minutes', () => {
    expect(formatDuration(45)).toBe('45 s');
    expect(formatDuration(83)).toBe('1 min 23 s');
    expect(formatDuration(59.6)).toBe('1 min 0 s');
  });
});

describe('buildSubject', () => {
  it('builds a French subject with the week bounds', () => {
    expect(buildSubject(RANGE)).toBe(
      'Rapport hebdo slowadventures.fr — du 7 septembre au 13 septembre'
    );
  });
});

describe('buildHtml', () => {
  it('renders the KPI tiles, the three sections and the dashboard link', () => {
    const html = buildHtml(reportWith());
    expect(html).toContain('Semaine du 7 septembre au 13 septembre');
    expect(html).toContain('Visites');
    expect(html).toContain('Visiteurs');
    expect(html).toContain('Pages vues');
    expect(html).toContain('Taux de rebond');
    expect(html).toContain('Durée moyenne');
    expect(html).toContain('44 %');
    expect(html).toContain('1 min 23 s');
    expect(html).toContain('Pages les plus vues');
    expect(html).toContain('Sources de trafic');
    expect(html).toContain('Clics (events)');
    expect(html).toContain('l.instagram.com');
    expect(html).toContain(`href="${DASHBOARD_URL}"`);
  });

  it('renders empty labels when a section has no rows', () => {
    const html = buildHtml(
      reportWith({ topPages: [], topReferrers: [], topEvents: [] })
    );
    expect(html).toContain('Aucune page vue cette semaine.');
    expect(html).toContain('Aucune source enregistrée.');
    expect(html).toContain('Aucun clic tracké cette semaine.');
  });
});
