import { useAccounts } from '#hooks/useAccounts';
import { useSyncedPref } from '#hooks/useSyncedPref';

import {
  looksLikeInvestmentAccount,
  parseInvestmentAccountIds,
} from './investmentAccounts';

/**
 * Accounts shown on the Investments page: the user's saved choice, or
 * accounts whose names look like investment accounts.
 */
export function useInvestmentAccounts() {
  const { data: accounts = [] } = useAccounts();
  const [savedPref, setSavedPref] = useSyncedPref(
    'simplifi.investment-accounts',
  );
  const savedIds = parseInvestmentAccountIds(savedPref);

  const investmentAccounts = savedIds
    ? accounts.filter(account => savedIds.includes(account.id))
    : accounts.filter(looksLikeInvestmentAccount);

  return {
    accounts: investmentAccounts,
    allAccounts: accounts,
    isGuessed: savedIds == null,
    setAccountIds: (ids: string[]) => setSavedPref(JSON.stringify(ids)),
  };
}
