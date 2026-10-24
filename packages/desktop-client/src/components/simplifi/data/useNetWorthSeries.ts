import * as monthUtils from '@actual-app/core/shared/months';
import { q } from '@actual-app/core/shared/query';

import { useQuery } from '#hooks/useQuery';

export type NetWorthPoint = {
  date: string;
  value: number;
};

type DailyTotal = { date: string; amount: number };

/** Query filter for a comma-joined list of account ids ('' = all). */
function accountFilterFor(accountKey: string) {
  return accountKey ? { account: { $oneof: accountKey.split(',') } } : {};
}

/**
 * Daily net worth (sum of every account balance) from `startDate` through
 * `endDate`. When the range is long, the series is sampled to one point per
 * week so charts stay responsive.
 */
export function useNetWorthSeries(
  startDate: string,
  endDate: string,
  accountIds: string[] | null = null,
) {
  const accountKey = accountIds ? accountIds.join(',') : '';
  const startingBalance = useQuery<number>(
    () =>
      q('transactions')
        .filter({ date: { $lt: startDate }, ...accountFilterFor(accountKey) })
        .calculate({ $sum: '$amount' }),
    [startDate, accountKey],
  );
  const dailyTotals = useQuery<DailyTotal>(
    () =>
      q('transactions')
        .filter({
          $and: [{ date: { $gte: startDate } }, { date: { $lte: endDate } }],
          ...accountFilterFor(accountKey),
        })
        .groupBy('date')
        .select(['date', { amount: { $sum: '$amount' } }]),
    [startDate, endDate, accountKey],
  );

  const isLoading = startingBalance.isLoading || dailyTotals.isLoading;
  if (isLoading || startingBalance.data == null || dailyTotals.data == null) {
    return { isLoading: true, points: [] as NetWorthPoint[], startValue: 0 };
  }

  // `calculate` queries resolve to a single number rather than rows.
  const startValue = Number(startingBalance.data) || 0;
  const totalsByDate = new Map(dailyTotals.data.map(d => [d.date, d.amount]));
  const days = monthUtils.dayRangeInclusive(startDate, endDate);
  const step = days.length > 400 ? 7 : 1;

  const points: NetWorthPoint[] = [];
  let running = startValue;
  days.forEach((day, index) => {
    running += totalsByDate.get(day) ?? 0;
    if (index % step === 0 || index === days.length - 1) {
      points.push({ date: day, value: running });
    }
  });

  return { isLoading: false, points, startValue };
}
