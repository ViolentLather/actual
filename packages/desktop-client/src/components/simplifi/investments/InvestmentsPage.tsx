import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from '@actual-app/core/shared/months';

import { Page } from '#components/Page';
import { SfAreaChart } from '#components/simplifi/charts/SfAreaChart';
import {
  getPeriodStartDate,
  NET_WORTH_PERIODS,
} from '#components/simplifi/data/netWorthPeriods';
import type { NetWorthPeriod } from '#components/simplifi/data/netWorthPeriods';
import { updateToBankBalance } from '#components/simplifi/data/updateToBankBalance';
import { useAccountBalancesSince } from '#components/simplifi/data/useAccountBalances';
import { useEarliestTransactionDate } from '#components/simplifi/data/useEarliestTransactionDate';
import { useInvestmentAccounts } from '#components/simplifi/data/useInvestmentAccounts';
import { useNetWorthSeries } from '#components/simplifi/data/useNetWorthSeries';
import { useTransferTotalsSince } from '#components/simplifi/data/useTransferTotals';
import { CARD_GAP, PAGE_BOTTOM_PADDING } from '#components/simplifi/layout';
import { SpendingStatTile } from '#components/simplifi/spending/SpendingStatTile';
import { SfAmount } from '#components/simplifi/ui/SfAmount';
import { SfCard } from '#components/simplifi/ui/SfCard';
import { SfSegmented } from '#components/simplifi/ui/SfSegmented';
import { useLocale } from '#hooks/useLocale';

import {
  INVESTMENT_COLUMNS,
  InvestmentAccountRow,
} from './InvestmentAccountRow';
import { InvestmentAccountsButton } from './InvestmentAccountsButton';

export function InvestmentsPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const [period, setPeriod] = useState<NetWorthPeriod>('YTD');
  const earliestDate = useEarliestTransactionDate();
  const { accounts, isGuessed } = useInvestmentAccounts();
  const accountIds = accounts.map(account => account.id);
  const accountKey = [...accountIds].sort().join(',');

  const startDate = getPeriodStartDate(period, earliestDate);
  const endDate = monthUtils.currentDay();
  // An empty selection must show nothing rather than every account.
  const seriesIds = accountIds.length > 0 ? accountIds : ['none'];
  const { points } = useNetWorthSeries(startDate, endDate, seriesIds);
  const balances = useAccountBalancesSince(startDate);
  const contributionsByAccount = useTransferTotalsSince(
    startDate,
    accountKey || 'none',
  );

  const rows = accounts
    .map(account => {
      const balance = balances.current.get(account.id) ?? 0;
      return {
        account,
        balance,
        change: balance - (balances.previous.get(account.id) ?? 0),
        contributions: contributionsByAccount.get(account.id) ?? 0,
      };
    })
    .sort((a, b) => b.balance - a.balance);

  const total = rows.reduce((sum, row) => sum + row.balance, 0);
  const change = rows.reduce((sum, row) => sum + row.change, 0);
  const contributions = rows.reduce((sum, row) => sum + row.contributions, 0);
  const outdated = rows.filter(
    row =>
      row.account.bank &&
      row.account.balance_current != null &&
      row.account.balance_current !== row.balance,
  );

  const updateAll = async () => {
    for (const row of outdated) {
      await updateToBankBalance(
        row.account.id,
        (row.account.balance_current ?? 0) - row.balance,
      );
    }
  };

  return (
    <Page header={t('Investments')}>
      <View
        data-testid="investments-page"
        style={{ gap: CARD_GAP, flexShrink: 0, ...PAGE_BOTTOM_PADDING }}
      >
        <SfCard bodyStyle={{ padding: '14px 18px' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <SfSegmented
              ariaLabel={t('Investments period')}
              value={period}
              onChange={setPeriod}
              options={NET_WORTH_PERIODS.map(value => ({
                value,
                label: value,
              }))}
            />
            <View style={{ flex: 1 }} />
            {outdated.length > 0 && (
              <Button variant="primary" onPress={() => void updateAll()}>
                {t('Update {{count}} balances from bank', {
                  count: outdated.length,
                })}
              </Button>
            )}
            <InvestmentAccountsButton />
          </View>
          {isGuessed && accounts.length > 0 && (
            <Text
              style={{
                marginTop: 10,
                fontSize: 13,
                color: theme.pageTextLight,
              }}
            >
              <Trans>
                Accounts were picked by name. Use the account button to choose
                exactly which ones hold investments.
              </Trans>
            </Text>
          )}
        </SfCard>

        <View
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: CARD_GAP,
            '@media (max-width: 1000px)': {
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            },
          }}
        >
          <SpendingStatTile label={t('Market value')}>
            <SfAmount value={total} />
          </SpendingStatTile>
          <SpendingStatTile label={t('{{period}} change', { period })}>
            <SfAmount value={change} colorize showSign />
          </SpendingStatTile>
          <SpendingStatTile label={t('Contributions')}>
            <SfAmount value={contributions} showSign />
          </SpendingStatTile>
          <SpendingStatTile label={t('Market gain')}>
            <SfAmount value={change - contributions} colorize showSign />
          </SpendingStatTile>
        </View>

        <SfCard title={t('Balance over time')} testId="investments-chart">
          {accounts.length === 0 ? (
            <Text style={{ color: theme.pageTextSubdued }}>
              <Trans>No investment accounts selected yet.</Trans>
            </Text>
          ) : (
            <SfAreaChart
              data={points}
              height={260}
              formatXTick={date => monthUtils.format(date, 'MMM yyyy', locale)}
              formatTooltipTitle={date =>
                monthUtils.format(date, 'MMM d, yyyy', locale)
              }
              renderTooltipValue={value => <SfAmount value={value} />}
            />
          )}
        </SfCard>

        <SfCard
          title={t('Accounts')}
          testId="investments-accounts"
          bodyStyle={{ padding: '8px 0 0', overflowX: 'auto' }}
        >
          <View style={{ minWidth: 680 }}>
            <View
              style={{
                display: 'grid',
                gridTemplateColumns: INVESTMENT_COLUMNS,
                gap: 12,
                padding: '8px 16px 10px',
                fontWeight: 600,
                fontSize: 13,
                color: theme.pageTextLight,
              }}
            >
              <Text>
                <Trans>Account</Trans>
              </Text>
              <Text>
                <Trans>Value</Trans>
              </Text>
              <Text>
                <Trans>Change</Trans>
              </Text>
              <Text>
                <Trans>Contributions</Trans>
              </Text>
              <Text>
                <Trans>Market gain</Trans>
              </Text>
              <Text>
                <Trans>Share</Trans>
              </Text>
            </View>
            {rows.map(row => (
              <InvestmentAccountRow
                key={row.account.id}
                account={row.account}
                balance={row.balance}
                change={row.change}
                contributions={row.contributions}
                share={total > 0 ? row.balance / total : 0}
              />
            ))}
          </View>
        </SfCard>
      </View>
    </Page>
  );
}
