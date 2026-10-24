import { q } from '@actual-app/core/shared/query';

import { useQuery } from '#hooks/useQuery';

type AccountTotal = { account: string; amount: number };

/**
 * Net money transferred into each account (transfers only) on or after
 * `sinceDate`, keyed by account id. For investment accounts this is the
 * amount contributed rather than earned.
 */
export function useTransferTotalsSince(sinceDate: string, accountKey: string) {
  const { data } = useQuery<AccountTotal>(
    () =>
      q('transactions')
        .filter({
          date: { $gte: sinceDate },
          transfer_id: { $ne: null },
          ...(accountKey ? { account: { $oneof: accountKey.split(',') } } : {}),
        })
        .groupBy('account')
        .select(['account', { amount: { $sum: '$amount' } }]),
    [sinceDate, accountKey],
  );

  return new Map((data ?? []).map(row => [row.account, row.amount]));
}
