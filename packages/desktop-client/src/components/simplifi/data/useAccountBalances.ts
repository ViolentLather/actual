import { q } from '@actual-app/core/shared/query';

import { useQuery } from '#hooks/useQuery';

type AccountTotal = { account: string; amount: number };

/**
 * Live balance of every account, both now and at the end of the day before
 * `sinceDate`, keyed by account id.
 */
export function useAccountBalancesSince(sinceDate: string) {
  const current = useQuery<AccountTotal>(
    () =>
      q('transactions')
        .groupBy('account')
        .select(['account', { amount: { $sum: '$amount' } }]),
    [],
  );
  const previous = useQuery<AccountTotal>(
    () =>
      q('transactions')
        .filter({ date: { $lt: sinceDate } })
        .groupBy('account')
        .select(['account', { amount: { $sum: '$amount' } }]),
    [sinceDate],
  );

  const toMap = (rows: ReadonlyArray<AccountTotal> | null) =>
    new Map((rows ?? []).map(row => [row.account, row.amount]));

  return {
    isLoading: current.isLoading || previous.isLoading,
    current: toMap(current.data),
    previous: toMap(previous.data),
  };
}
