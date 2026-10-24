import * as monthUtils from '@actual-app/core/shared/months';

import { useCategories } from '#hooks/useCategories';

import { buildMonthlyCashFlow } from './cashFlow';
import { useMonthlyCategoryTotals } from './useMonthlyCategoryTotals';

/**
 * Monthly income and spending for `monthCount` months ending with
 * `endMonth`, plus the raw per-category rows for further breakdowns.
 */
export function useCashFlowData(endMonth: string, monthCount: number) {
  const startMonth = monthUtils.subMonths(endMonth, monthCount - 1);
  const months = monthUtils.rangeInclusive(startMonth, endMonth);
  const totals = useMonthlyCategoryTotals(startMonth, endMonth);
  const { data: categoryData, isPending } = useCategories();
  const categories = categoryData?.list ?? [];
  const groups = categoryData?.grouped ?? [];
  const rows = totals.data ?? [];

  return {
    isLoading: totals.isLoading || isPending,
    months,
    rows,
    categories,
    groups,
    monthly: buildMonthlyCashFlow(rows, months, categories),
  };
}
