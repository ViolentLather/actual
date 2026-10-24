import { Trans, useTranslation } from 'react-i18next';

import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from '@actual-app/core/shared/months';

import { Link } from '#components/common/Link';
import { useRecentTransactions } from '#components/simplifi/data/useRecentTransactions';
import { SfAmount } from '#components/simplifi/ui/SfAmount';
import { SfCard } from '#components/simplifi/ui/SfCard';
import { useLocale } from '#hooks/useLocale';

const RECENT_COUNT = 25;

export function RecentTransactionsCard() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { data: transactions = [] } = useRecentTransactions(RECENT_COUNT);
  const list = transactions ?? [];

  const weekStart = monthUtils.subDays(monthUtils.currentDay(), 6);
  const spentThisWeek = list
    .filter(
      trans =>
        trans.date >= weekStart &&
        trans.amount < 0 &&
        !trans.transferAccountName,
    )
    .reduce((sum, trans) => sum - trans.amount, 0);

  return (
    <SfCard
      testId="dashboard-recent-transactions"
      title={
        <Link
          variant="internal"
          to="/accounts"
          style={{
            color: theme.pageText,
            textDecoration: 'none',
            fontSize: 'inherit',
          }}
        >
          <Trans>Recent Transactions</Trans>
        </Link>
      }
      subtitle={
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <SfAmount value={spentThisWeek} />
          <Trans>spent in the last 7 days</Trans>
        </View>
      }
      style={{ maxHeight: 400 }}
      bodyStyle={{ overflowY: 'auto', paddingTop: 10 }}
    >
      {list.length === 0 && (
        <Text style={{ color: theme.pageTextSubdued }}>
          <Trans>No transactions yet.</Trans>
        </Text>
      )}
      {list.map(trans => {
        const payee =
          trans.transferAccountName != null
            ? t('Transfer: {{account}}', { account: trans.transferAccountName })
            : (trans.payeeName ?? trans.notes ?? t('No payee'));
        return (
          <View
            key={trans.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: '10px 8px',
              borderBottom: `1px solid ${theme.tableBorder}`,
              flexShrink: 0,
            }}
          >
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                title={payee}
                style={{ ...styles.ellipsisText, fontSize: 15 }}
              >
                {payee}
              </Text>
              <Text
                style={{
                  ...styles.ellipsisText,
                  fontSize: 14,
                  color: theme.pageTextLight,
                }}
              >
                {trans.categoryName ??
                  (trans.transferAccountName
                    ? t('Transfer')
                    : t('Uncategorized'))}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
              <SfAmount
                value={trans.amount}
                colorize
                showSign={trans.amount > 0}
                style={{ fontSize: 14 }}
              />
              <Text style={{ fontSize: 14, color: theme.pageTextLight }}>
                {monthUtils.format(trans.date, 'MMM d', locale)}
              </Text>
            </View>
          </View>
        );
      })}
    </SfCard>
  );
}
