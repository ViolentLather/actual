import { Trans, useTranslation } from 'react-i18next';

import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import type { MonthCashFlow } from '#components/simplifi/data/cashFlow';
import { SavingsRateBadge } from '#components/simplifi/ui/SavingsRateBadge';
import { SfAmount } from '#components/simplifi/ui/SfAmount';
import { SfBadge } from '#components/simplifi/ui/SfBadge';
import { SfCard } from '#components/simplifi/ui/SfCard';

type ThisMonthCardProps = {
  month: MonthCashFlow | undefined;
};

export function ThisMonthCard({ month }: ThisMonthCardProps) {
  const { t } = useTranslation();
  const income = month?.income ?? 0;
  const spending = month?.spending ?? 0;
  const remaining = income - spending;
  const savingsRate = income > 0 ? (remaining / income) * 100 : null;

  const rows = [
    { label: t('Income'), value: income, colorize: true },
    { label: t('Total spent'), value: spending, colorize: false },
    { label: t('Remaining'), value: remaining, colorize: false },
  ];

  return (
    <SfCard
      testId="dashboard-this-month"
      title={t('Spending Plan')}
      subtitle={t('This Month')}
    >
      <View style={{ gap: 14 }}>
        {rows.map(row => (
          <View
            key={row.label}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 12,
              borderBottom: `1px solid ${theme.tableBorder}`,
            }}
          >
            <Text style={{ color: theme.pageTextLight, fontSize: 14 }}>
              {row.label}
            </Text>
            <SfAmount
              value={row.value}
              colorize={row.colorize}
              style={{ fontSize: 16, fontWeight: 700 }}
            />
          </View>
        ))}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: theme.pageTextLight, fontSize: 14 }}>
            <Trans>Savings rate</Trans>
          </Text>
          {savingsRate == null ? (
            <SfBadge>{t('n/a')}</SfBadge>
          ) : (
            <View
              style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 16, fontWeight: 700 }}>
                {savingsRate.toFixed(1)}%
              </Text>
              <SavingsRateBadge rate={savingsRate} />
            </View>
          )}
        </View>
      </View>
    </SfCard>
  );
}
