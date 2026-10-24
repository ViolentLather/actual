import * as monthUtils from '@actual-app/core/shared/months';
import { q } from '@actual-app/core/shared/query';

import { useQuery } from '#hooks/useQuery';
import { useSyncedPref } from '#hooks/useSyncedPref';

import { findTransferPairs, getTransferPairKey } from './transferMatching';
import type { TransferPair } from './transferMatching';

const LOOKBACK_DAYS = 120;

export type TransferSuggestionTransaction = {
  id: string;
  account: string;
  amount: number;
  date: string;
  accountName: string | null;
  payeeName: string | null;
  notes: string | null;
};

export type TransferSuggestion = TransferPair<TransferSuggestionTransaction>;

function parseIgnored(raw: string | undefined): string[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((key): key is string => typeof key === 'string')
      : [];
  } catch {
    return [];
  }
}

/**
 * Recent pairs of transactions that look like money moving between the
 * user's own accounts but are not linked as a transfer yet.
 */
export function useTransferSuggestions() {
  const since = monthUtils.subDays(monthUtils.currentDay(), LOOKBACK_DAYS);
  const [ignoredPref, setIgnoredPref] = useSyncedPref(
    'simplifi.ignored-transfers',
  );
  const ignored = parseIgnored(ignoredPref);

  const { data, isLoading } = useQuery<TransferSuggestionTransaction>(
    () =>
      q('transactions')
        .filter({
          date: { $gte: since },
          transfer_id: null,
          is_parent: false,
          is_child: false,
          starting_balance_flag: false,
          amount: { $ne: 0 },
        })
        .select([
          'id',
          'account',
          'amount',
          'date',
          'notes',
          { accountName: 'account.name' },
          { payeeName: 'payee.name' },
        ]),
    [since],
  );

  const suggestions = findTransferPairs(data ?? [], new Set(ignored));

  const ignore = (pair: TransferSuggestion) => {
    const key = getTransferPairKey(pair.from.id, pair.to.id);
    // Only keep keys that could still be suggested so the pref stays small.
    const stillRelevant = new Set((data ?? []).map(trans => trans.id));
    const next = [
      ...ignored.filter(existing =>
        existing.split('|').every(id => stillRelevant.has(id)),
      ),
      key,
    ];
    setIgnoredPref(JSON.stringify(next));
  };

  return { suggestions, isLoading, ignore };
}
