import * as monthUtils from '@actual-app/core/shared/months';
import type { Locale } from 'date-fns';

export type SpendingInterval = 'month' | 'quarter' | 'year';

export type SpendingPeriod = {
  key: string;
  months: string[];
  start: string;
  end: string;
  shortLabel: string;
  longLabel: string;
  isCurrent: boolean;
};

const PERIOD_COUNTS: Record<SpendingInterval, number> = {
  month: 12,
  quarter: 8,
  year: 5,
};

function quarterStart(month: string) {
  return monthUtils.getQuarterStart(month);
}

/** The most recent periods for the interval, oldest first. */
export function getSpendingPeriods(
  interval: SpendingInterval,
  locale: Locale,
): SpendingPeriod[] {
  const currentMonth = monthUtils.currentMonth();
  const count = PERIOD_COUNTS[interval];
  const periods: SpendingPeriod[] = [];

  for (let i = count - 1; i >= 0; i--) {
    let startMonth: string;
    let endMonth: string;
    let shortLabel: string;
    let longLabel: string;

    if (interval === 'month') {
      startMonth = monthUtils.subMonths(currentMonth, i);
      endMonth = startMonth;
      shortLabel = monthUtils.format(startMonth, 'MMM', locale);
      longLabel = monthUtils.format(startMonth, 'MMMM yyyy', locale);
    } else if (interval === 'quarter') {
      startMonth = monthUtils.subMonths(quarterStart(currentMonth), i * 3);
      endMonth = monthUtils.addMonths(startMonth, 2);
      const quarter = monthUtils.getQuarter(startMonth);
      const year = monthUtils.getYear(startMonth);
      shortLabel = `Q${quarter} '${year.slice(2)}`;
      longLabel = `Q${quarter} ${year}`;
    } else {
      const year = String(Number(monthUtils.getYear(currentMonth)) - i);
      startMonth = `${year}-01`;
      endMonth = `${year}-12`;
      shortLabel = year;
      longLabel = year;
    }

    const isCurrent = i === 0;
    periods.push({
      key: startMonth,
      months: monthUtils.rangeInclusive(startMonth, endMonth),
      start: monthUtils.firstDayOfMonth(startMonth),
      end: isCurrent
        ? monthUtils.currentDay()
        : monthUtils.lastDayOfMonth(endMonth),
      shortLabel,
      longLabel,
      isCurrent,
    });
  }

  return periods;
}
