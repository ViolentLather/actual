import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from '@actual-app/core/shared/months';

import { Page } from '#components/Page';
import { SfAreaChart } from '#components/simplifi/charts/SfAreaChart';
import { buildNetWorthBreakdown } from '#components/simplifi/data/netWorthBreakdown';
import {
  getPeriodStartDate,
  NET_WORTH_PERIODS,
} from '#components/simplifi/data/netWorthPeriods';
import type { NetWorthPeriod } from '#components/simplifi/data/netWorthPeriods';
import { useAccountBalancesSince } from '#components/simplifi/data/useAccountBalances';
import { useEarliestTransactionDate } from '#components/simplifi/data/useEarliestTransactionDate';
import { useNetWorthSeries } from '#components/simplifi/data/useNetWorthSeries';
import { CARD_GAP } from '#components/simplifi/layout';
import { SfIcon } from '#components/simplifi/SfIcon';
import { SfAmount } from '#components/simplifi/ui/SfAmount';
import { SfCard } from '#components/simplifi/ui/SfCard';
import { SfChange } from '#components/simplifi/ui/SfChange';
import { SfSegmented } from '#components/simplifi/ui/SfSegmented';
import { useAccountGroups } from '#hooks/useAccountGroups';
import { useAccounts } from '#hooks/useAccounts';
import { useLocale } from '#hooks/useLocale';
import { replaceModal } from '#modals/modalsSlice';
import { useDispatch } from '#redux';

import { BreakdownCard } from './BreakdownCard';
import { DebtRatioCard } from './DebtRatioCard';
import { NetWorthSideSection } from './NetWorthSideSection';

export function NetWorthPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const dispatch = useDispatch();
  const [period, setPeriod] = useState<NetWorthPeriod>('YTD');
  const earliestDate = useEarliestTransactionDate();
  const { data: accounts = [] } = useAccounts();
  const { data: accountGroups = [] } = useAccountGroups();

  const startDate = getPeriodStartDate(period, earliestDate);
  const endDate = monthUtils.currentDay();
  const { points, startValue } = useNetWorthSeries(startDate, endDate);
  const balances = useAccountBalancesSince(startDate);
  const current = points.at(-1)?.value ?? startValue;
  const openAccounts = accounts.filter(account => !account.closed);

  const breakdown = buildNetWorthBreakdown(
    accounts,
    accountGroups,
    balances.current,
    balances.previous,
    { onBudget: t('On budget'), offBudget: t('Off budget') },
  );

  const changeLabel = t('{{period}} change', { period });
  const longRange =
    monthUtils.differenceInCalendarDays(endDate, startDate) > 120;

  return (
    <Page header={t('Net Worth')}>
      <View
        data-testid="net-worth-page"
        style={{ gap: CARD_GAP, paddingBottom: 32, flexShrink: 0 }}
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
              ariaLabel={t('Net worth period')}
              value={period}
              onChange={setPeriod}
              options={NET_WORTH_PERIODS.map(value => ({
                value,
                label: value,
              }))}
            />
            <View style={{ flex: 1 }} />
            <Text style={{ fontSize: 14, color: theme.pageTextLight }}>
              <Trans>
                Accounts included: {{ count: openAccounts.length }} of{' '}
                {{ total: openAccounts.length }}
              </Trans>
            </Text>
            <Button
              variant="primary"
              onPress={() =>
                dispatch(
                  replaceModal({ modal: { name: 'add-account', options: {} } }),
                )
              }
              style={{ gap: 6, fontWeight: 600 }}
            >
              <SfIcon name="plusCircle" width={16} height={16} />
              <Trans>Account</Trans>
            </Button>
          </View>
        </SfCard>

        <SfCard testId="net-worth-chart">
          <Text style={{ fontSize: 15, color: theme.pageText }}>
            <Trans>Your net worth</Trans>
          </Text>
          <SfAmount
            value={current}
            style={{ fontSize: 24, fontWeight: 700, marginTop: 2 }}
          />
          <View style={{ marginTop: 8, marginBottom: 16 }}>
            <SfChange
              change={current - startValue}
              base={startValue}
              label={changeLabel}
            />
          </View>
          <SfAreaChart
            data={points}
            height={280}
            formatXTick={date =>
              monthUtils.format(date, longRange ? 'MMM yyyy' : 'MMM d', locale)
            }
            formatTooltipTitle={date =>
              monthUtils.format(date, 'MMM d, yyyy', locale)
            }
            renderTooltipValue={value => <SfAmount value={value} />}
          />
        </SfCard>

        <View
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
            gap: CARD_GAP,
            alignItems: 'start',
            '@media (max-width: 1100px)': {
              gridTemplateColumns: 'minmax(0, 1fr)',
            },
          }}
        >
          <SfCard title={t('Accounts')} testId="net-worth-accounts">
            <View style={{ gap: 12 }}>
              <NetWorthSideSection
                title={t('Assets')}
                side={breakdown.assets}
                changeLabel={changeLabel}
              />
              {breakdown.liabilities.groups.length > 0 && (
                <NetWorthSideSection
                  title={t('Liabilities')}
                  side={breakdown.liabilities}
                  changeLabel={changeLabel}
                />
              )}
            </View>
          </SfCard>
          <View style={{ gap: CARD_GAP }}>
            <DebtRatioCard
              assets={breakdown.assets.balance}
              liabilities={breakdown.liabilities.balance}
            />
            <BreakdownCard groups={breakdown.assets.groups} />
          </View>
        </View>
      </View>
    </Page>
  );
}
