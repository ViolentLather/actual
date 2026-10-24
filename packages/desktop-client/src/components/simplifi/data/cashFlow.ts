import type {
  CategoryEntity,
  CategoryGroupEntity,
} from '@actual-app/core/types/models';

import type { MonthlyCategoryTotal } from './useMonthlyCategoryTotals';

export type MonthCashFlow = {
  month: string;
  income: number;
  spending: number;
};

export type GroupSpending = {
  id: string;
  name: string;
  amount: number;
  categories: Array<{ id: string; name: string; amount: number }>;
};

export const UNCATEGORIZED_ID = 'uncategorized';

function isIncomeRow(
  row: MonthlyCategoryTotal,
  categoriesById: ReadonlyMap<string, CategoryEntity>,
) {
  if (row.category == null) {
    return row.amount > 0;
  }
  return categoriesById.get(row.category)?.is_income === true;
}

/** Income and spending (both positive numbers) for every month in `months`. */
export function buildMonthlyCashFlow(
  rows: ReadonlyArray<MonthlyCategoryTotal>,
  months: string[],
  categories: CategoryEntity[],
): MonthCashFlow[] {
  const categoriesById = new Map(categories.map(c => [c.id, c]));
  const byMonth = new Map(
    months.map(month => [month, { month, income: 0, spending: 0 }]),
  );

  for (const row of rows) {
    const entry = byMonth.get(row.month);
    if (!entry) {
      continue;
    }
    if (isIncomeRow(row, categoriesById)) {
      entry.income += row.amount;
    } else {
      entry.spending -= row.amount;
    }
  }

  return months.map(month => byMonth.get(month)!);
}

/**
 * Net spending per category group over the given months, largest first.
 * Groups whose refunds outweigh their spending are dropped.
 */
export function buildGroupSpending(
  rows: ReadonlyArray<MonthlyCategoryTotal>,
  months: ReadonlySet<string>,
  categories: CategoryEntity[],
  groups: CategoryGroupEntity[],
  uncategorizedLabel: string,
): GroupSpending[] {
  const categoriesById = new Map(categories.map(c => [c.id, c]));
  const groupsById = new Map(groups.map(g => [g.id, g]));
  const result = new Map<string, GroupSpending>();

  for (const row of rows) {
    if (!months.has(row.month) || isIncomeRow(row, categoriesById)) {
      continue;
    }

    const category = row.category ? categoriesById.get(row.category) : null;
    const group = category ? groupsById.get(category.group) : null;
    const groupId = group?.id ?? UNCATEGORIZED_ID;
    const groupName = group?.name ?? uncategorizedLabel;

    let entry = result.get(groupId);
    if (!entry) {
      entry = { id: groupId, name: groupName, amount: 0, categories: [] };
      result.set(groupId, entry);
    }
    entry.amount -= row.amount;

    const categoryId = category?.id ?? UNCATEGORIZED_ID;
    let categoryEntry = entry.categories.find(c => c.id === categoryId);
    if (!categoryEntry) {
      categoryEntry = {
        id: categoryId,
        name: category?.name ?? uncategorizedLabel,
        amount: 0,
      };
      entry.categories.push(categoryEntry);
    }
    categoryEntry.amount -= row.amount;
  }

  return [...result.values()]
    .filter(group => group.amount > 0)
    .map(group => ({
      ...group,
      categories: group.categories
        .filter(c => c.amount !== 0)
        .sort((a, b) => b.amount - a.amount),
    }))
    .sort((a, b) => b.amount - a.amount);
}

/** Turns group spending into one entry per category, largest first. */
export function flattenToCategories(groups: GroupSpending[]): GroupSpending[] {
  return groups
    .flatMap(group => group.categories)
    .filter(category => category.amount > 0)
    .map(category => ({ ...category, categories: [] }))
    .sort((a, b) => b.amount - a.amount);
}
