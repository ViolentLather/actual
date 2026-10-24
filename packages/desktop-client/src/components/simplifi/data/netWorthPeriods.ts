import * as monthUtils from '@actual-app/core/shared/months';
import * as d from 'date-fns';

export const NET_WORTH_PERIODS = [
  '1M',
  '3M',
  '6M',
  '1Y',
  '5Y',
  'QTD',
  'YTD',
  'All',
] as const;

export type NetWorthPeriod = (typeof NET_WORTH_PERIODS)[number];

export function isNetWorthPeriod(value: string): value is NetWorthPeriod {
  return (NET_WORTH_PERIODS as readonly string[]).includes(value);
}

/** Shifts a `yyyy-MM-dd` day by whole months, keeping day precision. */
export function shiftDayByMonths(day: string, months: number): string {
  return d.format(d.addMonths(d.parseISO(day), months), 'yyyy-MM-dd');
}

/** First day included in the period, relative to today. */
export function getPeriodStartDate(
  period: NetWorthPeriod,
  earliestDate: string | null,
): string {
  const today = monthUtils.currentDay();
  const month = monthUtils.currentMonth();
  switch (period) {
    case '1M':
      return monthUtils.addDays(shiftDayByMonths(today, -1), 1);
    case '3M':
      return monthUtils.addDays(shiftDayByMonths(today, -3), 1);
    case '6M':
      return monthUtils.addDays(shiftDayByMonths(today, -6), 1);
    case '1Y':
      return monthUtils.addDays(shiftDayByMonths(today, -12), 1);
    case '5Y':
      return monthUtils.addDays(shiftDayByMonths(today, -60), 1);
    case 'QTD':
      return monthUtils.firstDayOfMonth(monthUtils.getQuarterStart(month));
    case 'YTD':
      return monthUtils.firstDayOfMonth(monthUtils.getYearStart(month));
    case 'All':
      return earliestDate ?? monthUtils.firstDayOfMonth(month);
    default:
      throw new Error(`Unknown period: ${String(period)}`);
  }
}
