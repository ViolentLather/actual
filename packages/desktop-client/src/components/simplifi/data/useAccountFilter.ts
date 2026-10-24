import { useLocalPref } from '#hooks/useLocalPref';

/**
 * Accounts the Spending and Net Worth pages are limited to, remembered per
 * device. `null` means no filter (all accounts).
 */
export function useAccountFilter() {
  const [selected, setSelected] = useLocalPref('simplifi.accountFilter');
  const selectedIds = selected && selected.length > 0 ? selected : null;

  return {
    selectedIds,
    // Stable string for hook dependencies, since the array identity changes.
    filterKey: selectedIds ? [...selectedIds].sort().join(',') : '',
    setSelectedIds: (ids: string[] | null) => setSelected(ids ?? []),
  };
}
