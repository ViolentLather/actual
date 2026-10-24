import { q } from '@actual-app/core/shared/query';

import { useQuery } from '#hooks/useQuery';

export function useEarliestTransactionDate() {
  const { data } = useQuery<{ date: string }>(
    () => q('transactions').select('date').orderBy('date').limit(1),
    [],
  );
  return data?.[0]?.date ?? null;
}
