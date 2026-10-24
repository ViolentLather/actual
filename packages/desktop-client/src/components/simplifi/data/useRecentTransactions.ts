import { q } from '@actual-app/core/shared/query';

import { useQuery } from '#hooks/useQuery';

export type RecentTransaction = {
  id: string;
  date: string;
  amount: number;
  payeeName: string | null;
  transferAccountName: string | null;
  categoryName: string | null;
  accountName: string | null;
  notes: string | null;
};

export function useRecentTransactions(limit: number) {
  return useQuery<RecentTransaction>(
    () =>
      q('transactions')
        .filter({ is_parent: false })
        .select([
          'id',
          'date',
          'amount',
          'notes',
          { payeeName: 'payee.name' },
          { transferAccountName: 'payee.transfer_acct.name' },
          { categoryName: 'category.name' },
          { accountName: 'account.name' },
        ])
        .orderBy([{ date: 'desc' }, { sort_order: 'desc' }])
        .limit(limit),
    [limit],
  );
}
