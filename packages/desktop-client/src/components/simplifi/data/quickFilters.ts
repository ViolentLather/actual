import * as monthUtils from '@actual-app/core/shared/months';
import type { RuleConditionEntity } from '@actual-app/core/types/models';
import { t } from 'i18next';

export type QuickFilterId = 'this-month' | 'uncategorized' | 'unreviewed';

export const QUICK_FILTER_IDS: QuickFilterId[] = [
  'this-month',
  'uncategorized',
  'unreviewed',
];

export function getQuickFilterLabel(id: QuickFilterId) {
  switch (id) {
    case 'this-month':
      return t('This month');
    case 'uncategorized':
      return t('Uncategorized');
    case 'unreviewed':
      return t('Unreviewed');
    default:
      throw new Error(`Unknown quick filter: ${String(id)}`);
  }
}

type MaybeCondition = Partial<RuleConditionEntity> | object;

/** Whether the condition is the given quick filter (matched by its label). */
export function isQuickFilterCondition(
  condition: MaybeCondition,
  id: QuickFilterId,
) {
  return (
    'customName' in condition &&
    condition.customName === getQuickFilterLabel(id) &&
    'queryFilter' in condition &&
    condition.queryFilter != null
  );
}

/**
 * Filter condition for a quick filter. `reviewedThrough` is the time (epoch
 * ms) of the last "mark all reviewed"; transactions imported after it are
 * unreviewed.
 */
export function makeQuickFilterCondition(
  id: QuickFilterId,
  reviewedThrough: number,
): Partial<RuleConditionEntity> {
  const label = getQuickFilterLabel(id);
  switch (id) {
    case 'this-month': {
      const month = monthUtils.currentMonth();
      return {
        field: 'date',
        op: 'gte',
        value: monthUtils.firstDayOfMonth(month),
        type: 'date',
        customName: label,
        queryFilter: {
          date: {
            $gte: monthUtils.firstDayOfMonth(month),
            $lte: monthUtils.lastDayOfMonth(month),
          },
        },
      } as Partial<RuleConditionEntity>;
    }
    case 'uncategorized':
      return {
        field: 'category',
        op: 'is',
        value: '',
        type: 'id',
        customName: label,
        queryFilter: {
          category: null,
          is_parent: false,
          'payee.transfer_acct': null,
        },
      } as Partial<RuleConditionEntity>;
    case 'unreviewed':
      return {
        field: 'date',
        op: 'gte',
        value: '',
        type: 'date',
        customName: label,
        queryFilter: { sort_order: { $gt: reviewedThrough } },
      } as Partial<RuleConditionEntity>;
    default:
      throw new Error(`Unknown quick filter: ${String(id)}`);
  }
}
