import type {
  AccountEntity,
  AccountGroupEntity,
} from '@actual-app/core/types/models';

export type AccountRow = {
  account: AccountEntity;
  balance: number;
  change: number;
};

export type AccountGroupRow = {
  id: string;
  name: string;
  balance: number;
  change: number;
  accounts: AccountRow[];
};

export type NetWorthSide = {
  balance: number;
  change: number;
  groups: AccountGroupRow[];
};

export type NetWorthBreakdown = {
  assets: NetWorthSide;
  liabilities: NetWorthSide;
};

/**
 * Splits open accounts into assets (non-negative balance) and liabilities,
 * each organized by account group. `change` is the balance change since the
 * period start.
 */
export function buildNetWorthBreakdown(
  accounts: AccountEntity[],
  groups: AccountGroupEntity[],
  current: ReadonlyMap<string, number>,
  previous: ReadonlyMap<string, number>,
  ungroupedLabels: { onBudget: string; offBudget: string },
): NetWorthBreakdown {
  const groupsById = new Map(groups.map(group => [group.id, group]));

  function buildSide(rows: AccountRow[]): NetWorthSide {
    const byGroup = new Map<string, AccountGroupRow>();
    for (const row of rows) {
      const group = row.account.account_group_id
        ? groupsById.get(row.account.account_group_id)
        : undefined;
      // Without account groups, fall back to Actual's on/off budget split.
      const ungroupedId = row.account.offbudget ? 'offbudget' : 'onbudget';
      const id = group?.id ?? ungroupedId;
      let entry = byGroup.get(id);
      if (!entry) {
        entry = {
          id,
          name:
            group?.name ??
            (row.account.offbudget
              ? ungroupedLabels.offBudget
              : ungroupedLabels.onBudget),
          balance: 0,
          change: 0,
          accounts: [],
        };
        byGroup.set(id, entry);
      }
      entry.balance += row.balance;
      entry.change += row.change;
      entry.accounts.push(row);
    }

    const sortOrder = (id: string) =>
      groupsById.get(id)?.sort_order ?? Number.MAX_SAFE_INTEGER;
    const sideGroups = [...byGroup.values()].sort(
      (a, b) => sortOrder(a.id) - sortOrder(b.id),
    );

    return {
      balance: sideGroups.reduce((sum, group) => sum + group.balance, 0),
      change: sideGroups.reduce((sum, group) => sum + group.change, 0),
      groups: sideGroups,
    };
  }

  const rows = accounts
    .filter(account => !account.closed)
    .map(account => {
      const balance = current.get(account.id) ?? 0;
      return {
        account,
        balance,
        change: balance - (previous.get(account.id) ?? 0),
      };
    });

  return {
    assets: buildSide(rows.filter(row => row.balance >= 0)),
    liabilities: buildSide(rows.filter(row => row.balance < 0)),
  };
}
