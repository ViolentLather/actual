import type { RuleConditionEntity } from '@actual-app/core/types/models';
import { t } from 'i18next';

export type TransactionTab = 'all' | 'spending' | 'income';

type MaybeCondition = Partial<RuleConditionEntity> | object;

/**
 * Whether a filter condition is one of the Spending/Income tab filters,
 * which are amount-sign conditions carrying their own query filter.
 */
export function isTransactionTabCondition(condition: MaybeCondition) {
  return (
    'field' in condition &&
    condition.field === 'amount' &&
    'value' in condition &&
    condition.value === 0 &&
    'queryFilter' in condition &&
    condition.queryFilter != null
  );
}

export function getActiveTransactionTab(
  conditions: MaybeCondition[],
): TransactionTab {
  const condition = conditions.find(isTransactionTabCondition);
  if (!condition || !('op' in condition)) {
    return 'all';
  }
  return condition.op === 'gt' ? 'income' : 'spending';
}

/** Filter condition for the tab, excluding transfers between accounts. */
export function makeTransactionTabCondition(
  tab: Exclude<TransactionTab, 'all'>,
): Partial<RuleConditionEntity> {
  const isIncome = tab === 'income';
  return {
    field: 'amount',
    op: isIncome ? 'gt' : 'lt',
    value: 0,
    type: 'number',
    customName: isIncome ? t('Income') : t('Spending'),
    queryFilter: {
      $and: [
        { amount: isIncome ? { $gt: 0 } : { $lt: 0 } },
        { 'payee.transfer_acct': null },
      ],
    },
  } as Partial<RuleConditionEntity>;
}
