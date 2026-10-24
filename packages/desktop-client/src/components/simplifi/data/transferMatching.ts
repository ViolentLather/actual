import * as monthUtils from '@actual-app/core/shared/months';

export type TransferCandidate = {
  id: string;
  account: string;
  amount: number;
  date: string;
};

export type TransferPair<T extends TransferCandidate = TransferCandidate> = {
  key: string;
  from: T;
  to: T;
};

/** Stable key for a pair, independent of which side is passed first. */
export function getTransferPairKey(idA: string, idB: string) {
  return [idA, idB].sort().join('|');
}

/**
 * Finds likely transfers between the user's own accounts: an outflow and an
 * inflow of exactly the same amount, in different accounts, at most
 * `maxDaysApart` days apart. Each transaction is used in at most one pair and
 * the closest-dated match wins. Pairs whose key is in `ignoredKeys` are
 * skipped.
 */
export function findTransferPairs<T extends TransferCandidate>(
  candidates: readonly T[],
  ignoredKeys: ReadonlySet<string> = new Set(),
  maxDaysApart = 5,
): Array<TransferPair<T>> {
  const inflowsByAmount = new Map<number, T[]>();
  for (const candidate of candidates) {
    if (candidate.amount > 0) {
      const list = inflowsByAmount.get(candidate.amount) ?? [];
      list.push(candidate);
      inflowsByAmount.set(candidate.amount, list);
    }
  }

  const outflows = candidates
    .filter(candidate => candidate.amount < 0)
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

  const used = new Set<string>();
  const pairs: Array<TransferPair<T>> = [];

  for (const outflow of outflows) {
    const options = (inflowsByAmount.get(-outflow.amount) ?? []).filter(
      inflow =>
        !used.has(inflow.id) &&
        inflow.account !== outflow.account &&
        !ignoredKeys.has(getTransferPairKey(outflow.id, inflow.id)) &&
        Math.abs(
          monthUtils.differenceInCalendarDays(inflow.date, outflow.date),
        ) <= maxDaysApart,
    );
    if (options.length === 0) {
      continue;
    }

    const best = options.reduce((closest, option) =>
      Math.abs(monthUtils.differenceInCalendarDays(option.date, outflow.date)) <
      Math.abs(monthUtils.differenceInCalendarDays(closest.date, outflow.date))
        ? option
        : closest,
    );
    used.add(best.id);
    pairs.push({
      key: getTransferPairKey(outflow.id, best.id),
      from: outflow,
      to: best,
    });
  }

  return pairs;
}
