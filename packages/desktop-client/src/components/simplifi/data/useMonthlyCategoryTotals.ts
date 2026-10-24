import * as monthUtils from '@actual-app/core/shared/months';
import { q } from '@actual-app/core/shared/query';

import { useQuery } from '#hooks/useQuery';

import { notExcludedFilter } from './exclusion';

export type MonthlyCategoryTotal = {
  month: string;
  category: string | null;
  amount: number;
};

/**
 * Live per-month, per-category totals of transactions between two
 * months (inclusive), excluding transfers between accounts and
 * transactions tagged to be left out of reports.
 */
export function useMonthlyCategoryTotals(
  startMonth: string,
  endMonth: string,
  accountIds: string[] | null = null,
) {
  const accountKey = accountIds ? accountIds.join(',') : '';
  const start = monthUtils.firstDayOfMonth(startMonth);
  const end = monthUtils.lastDayOfMonth(endMonth);

  return useQuery<MonthlyCategoryTotal>(
    () =>
      q('transactions')
        .filter({
          // Without an account filter, stick to on-budget accounts like
          // Actual's own reports; an explicit selection is used as is.
          ...(accountKey
            ? { account: { $oneof: accountKey.split(',') } }
            : { 'account.offbudget': false }),
          'payee.transfer_acct': null,
          $and: [
            { date: { $gte: start } },
            { date: { $lte: end } },
            notExcludedFilter,
          ],
        })
        .groupBy([{ $month: '$date' }, 'category'])
        .select([
          { month: { $month: '$date' } },
          'category',
          { amount: { $sum: '$amount' } },
        ]),
    [start, end, accountKey],
  );
}
