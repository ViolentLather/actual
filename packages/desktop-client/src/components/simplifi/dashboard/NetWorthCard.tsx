import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Select } from '@actual-app/components/select';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from '@actual-app/core/shared/months';

import { Link } from '#components/common/Link';
import { SfAreaChart } from '#components/simplifi/charts/SfAreaChart';
import { getPeriodStartDate } from '#components/simplifi/data/netWorthPeriods';
import type { NetWorthPeriod } from '#components/simplifi/data/netWorthPeriods';
import { useEarliestTransactionDate } from '#components/simplifi/data/useEarliestTransactionDate';
import { useNetWorthSeries } from '#components/simplifi/data/useNetWorthSeries';
import { SfAmount } from '#components/simplifi/ui/SfAmount';
import { SfCard } from '#components/simplifi/ui/SfCard';
import { SfChange } from '#components/simplifi/ui/SfChange';
import { useAccounts } from '#hooks/useAccounts';
import { useLocale } from '#hooks/useLocale';

export function NetWorthCard() {
  const { t } = useTranslation();
  const locale = useLocale();
  const [period, setPeriod] = useState<NetWorthPeriod>('YTD');
  const earliestDate = useEarliestTransactionDate();
  const { data: accounts = [] } = useAccounts();
  const openAccounts = accounts.filter(account => !account.closed);

  const startDate = getPeriodStartDate(period, earliestDate);
  const endDate = monthUtils.currentDay();
  const { points, startValue } = useNetWorthSeries(startDate, endDate);
  const current = points.at(-1)?.value ?? startValue;

  const periodOptions: Array<[NetWorthPeriod, string]> = [
    ['1M', t('Last 30 days')],
    ['3M', t('Last 3 months')],
    ['6M', t('Last 6 months')],
    ['YTD', t('Year to date')],
    ['1Y', t('Last 12 months')],
    ['All', t('All time')],
  ];
  const periodLabel =
    periodOptions.find(([value]) => value === period)?.[1] ?? '';

  return (
    <SfCard
      testId="dashboard-net-worth"
      title={
        <Link
          variant="internal"
          to="/net-worth"
          style={{
            color: theme.pageText,
            textDecoration: 'none',
            fontSize: 'inherit',
          }}
        >
          <Trans>Net Worth</Trans>
        </Link>
      }
      actions={
        <>
          <View style={{ fontSize: 12, color: theme.pageTextLight }}>
            <Trans count={openAccounts.length}>
              {{ count: openAccounts.length }} accounts
            </Trans>
          </View>
          <Select
            aria-label={t('Net worth period')}
            value={period}
            onChange={setPeriod}
            options={periodOptions}
            style={{ fontWeight: 600 }}
          />
        </>
      }
      style={{ flex: 1 }}
      bodyStyle={{ paddingTop: 0 }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginTop: -6,
          marginBottom: 12,
          flexWrap: 'wrap',
        }}
      >
        <SfAmount value={current} style={{ fontSize: 20, fontWeight: 700 }} />
        <SfChange
          change={current - startValue}
          base={startValue}
          label={t('{{period}} change', { period: periodLabel })}
        />
      </View>
      <SfAreaChart
        data={points}
        height={220}
        formatXTick={date => monthUtils.format(date, 'MMM yyyy', locale)}
        formatTooltipTitle={date =>
          monthUtils.format(date, 'MMM d, yyyy', locale)
        }
        renderTooltipValue={value => (
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Trans>Total Net Worth</Trans> <SfAmount value={value} />
          </View>
        )}
      />
    </SfCard>
  );
}
