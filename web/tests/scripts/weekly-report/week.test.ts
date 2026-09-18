import { describe, expect, it } from 'vitest';
import { previousWeekRange } from '../../../scripts/weekly-report/week.ts';

describe('previousWeekRange', () => {
  it('returns the last complete Monday-Sunday week and the one before', () => {
    expect(previousWeekRange(Date.parse('2026-09-14T07:17:00Z'))).toEqual({
      startDateIso: '2026-09-07',
      endDateIso: '2026-09-13',
      previousStartDateIso: '2026-08-31',
      previousEndDateIso: '2026-09-06',
    });
  });

  it('uses Paris local time: Sunday 22:30 UTC in summer is already Monday', () => {
    const range = previousWeekRange(Date.parse('2026-09-13T22:30:00Z'));
    expect(range.startDateIso).toBe('2026-09-07');
    expect(range.endDateIso).toBe('2026-09-13');
  });

  it('uses Paris local time: Sunday 21:59 UTC in summer is still Sunday', () => {
    const range = previousWeekRange(Date.parse('2026-09-13T21:59:00Z'));
    expect(range.startDateIso).toBe('2026-08-31');
    expect(range.endDateIso).toBe('2026-09-06');
  });

  it('uses Paris local time in winter (UTC+1)', () => {
    const range = previousWeekRange(Date.parse('2026-01-11T23:30:00Z'));
    expect(range).toEqual({
      startDateIso: '2026-01-05',
      endDateIso: '2026-01-11',
      previousStartDateIso: '2025-12-29',
      previousEndDateIso: '2026-01-04',
    });
  });

  it('keeps exact 7-day weeks across the spring DST change', () => {
    expect(previousWeekRange(Date.parse('2026-03-30T08:00:00Z'))).toEqual({
      startDateIso: '2026-03-23',
      endDateIso: '2026-03-29',
      previousStartDateIso: '2026-03-16',
      previousEndDateIso: '2026-03-22',
    });
  });

  it('keeps exact 7-day weeks across the autumn DST change', () => {
    expect(previousWeekRange(Date.parse('2026-10-26T08:00:00Z'))).toEqual({
      startDateIso: '2026-10-19',
      endDateIso: '2026-10-25',
      previousStartDateIso: '2026-10-12',
      previousEndDateIso: '2026-10-18',
    });
  });
});
