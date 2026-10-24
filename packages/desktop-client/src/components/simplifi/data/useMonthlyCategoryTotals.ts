import * as monthUtils from '@actual-app/core/shared/months';
import { q } from '@actual-app/core/shared/query';

import { useQuery } from '#hooks/useQuery';

export type MonthlyCategoryTotal = {
  month: string;
  category: string | null;
  amount: number;
};

/**
 * Live per-month, per-category totals of on-budget transactions between two
 * months (inclusive), excluding transfers between accounts.
 */
export function useMonthlyCategoryTotals(startMonth: string, endMonth: string) {
  const start = monthUtils.firstDayOfMonth(startMonth);
  const end = monthUtils.lastDayOfMonth(endMonth);

  return useQuery<MonthlyCategoryTotal>(
    () =>
      q('transactions')
        .filter({
          'account.offbudget': false,
          'payee.transfer_acct': null,
          $and: [{ date: { $gte: start } }, { date: { $lte: end } }],
        })
        .groupBy([{ $month: '$date' }, 'category'])
        .select([
          { month: { $month: '$date' } },
          'category',
          { amount: { $sum: '$amount' } },
        ]),
    [start, end],
  );
}
