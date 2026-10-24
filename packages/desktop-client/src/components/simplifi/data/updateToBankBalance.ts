import { send } from '@actual-app/core/platform/client/connection';
import { currentDay } from '@actual-app/core/shared/months';
import { realizeTempTransactions } from '@actual-app/core/shared/transactions';
import { t } from 'i18next';

import { EXCLUDE_TAG } from './exclusion';

/**
 * Adds a balance adjustment so an account matches the balance its bank last
 * reported (e.g. an investment account's market value). The adjustment is
 * excluded from income and spending.
 */
export async function updateToBankBalance(accountId: string, diff: number) {
  if (diff === 0) {
    return;
  }
  const added = realizeTempTransactions([
    {
      id: 'temp',
      account: accountId,
      cleared: true,
      reconciled: false,
      amount: diff,
      date: currentDay(),
      notes: `${t('Market value update')} ${EXCLUDE_TAG}`,
    },
  ]);
  await send('transactions-batch-update', { added });
}
