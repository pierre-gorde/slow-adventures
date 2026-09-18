import { REPORT_TIMEZONE } from './report.const.ts';

export type WeekRange = {
  startDateIso: string;
  endDateIso: string;
  previousStartDateIso: string;
  previousEndDateIso: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const DAYS_PER_WEEK = 7;
const MONDAY_ISO_INDEX = 1;
const WEEKDAY_SHORT_NAMES = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
] as const;

function parisDateIso(utcMs: number): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: REPORT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(utcMs));
}

function parisIsoWeekday(utcMs: number): number {
  const shortName = new Intl.DateTimeFormat('en-US', {
    timeZone: REPORT_TIMEZONE,
    weekday: 'short',
  }).format(new Date(utcMs));
  return (
    WEEKDAY_SHORT_NAMES.indexOf(
      shortName as (typeof WEEKDAY_SHORT_NAMES)[number]
    ) + 1
  );
}

function addDaysIso(dateIso: string, days: number): string {
  return new Date(Date.parse(`${dateIso}T00:00:00Z`) + days * DAY_MS)
    .toISOString()
    .slice(0, 10);
}

// Dernière semaine complète en heure de Paris (lundi → dimanche) et la semaine
// d'avant. GA4 interprète les dates dans le fuseau de la propriété : les dates
// ISO suffisent, pas besoin de timestamps.
export function previousWeekRange(nowMs: number): WeekRange {
  const todayIso = parisDateIso(nowMs);
  const mondayThisWeekIso = addDaysIso(
    todayIso,
    -(parisIsoWeekday(nowMs) - MONDAY_ISO_INDEX)
  );
  const startDateIso = addDaysIso(mondayThisWeekIso, -DAYS_PER_WEEK);
  return {
    startDateIso,
    endDateIso: addDaysIso(mondayThisWeekIso, -1),
    previousStartDateIso: addDaysIso(startDateIso, -DAYS_PER_WEEK),
    previousEndDateIso: addDaysIso(startDateIso, -1),
  };
}
