import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { Select } from '@actual-app/components/select';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from '@actual-app/core/shared/months';
import type { AccountEntity } from '@actual-app/core/types/models';

import { shiftDayByMonths } from '#components/simplifi/data/netWorthPeriods';
import { useUpcomingReminders } from '#components/simplifi/data/useUpcomingReminders';
import { SfIcon } from '#components/simplifi/SfIcon';
import { SfCard } from '#components/simplifi/ui/SfCard';
import { useBalanceForecast } from '#hooks/useBalanceForecast';

import { ProjectedCashFlowChart } from './ProjectedCashFlowChart';
import { ReminderCarousel } from './ReminderCarousel';

type AccountOverviewProps = {
  account: AccountEntity | undefined;
};

type ForecastRange = '1' | '3' | '6' | '12';

/**
 * Simplifi-style "Projected Cash Flow" for a single account, or the list of
 * upcoming reminders when viewing several accounts at once.
 */
export function AccountOverview({ account }: AccountOverviewProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const [range, setRange] = useState<ForecastRange>('3');
  const { reminders } = useUpcomingReminders(account?.id);

  const today = monthUtils.currentDay();
  const endDate = shiftDayByMonths(today, Number(range));
  const forecast = useBalanceForecast({
    accountIds: account ? [account.id] : undefined,
    startDate: today,
    endDate,
    source: 'schedules',
    enabled: account != null && isOpen,
  });

  if (!account && reminders.length === 0) {
    return null;
  }

  const collapseButton = (
    <Button
      variant="bare"
      aria-label={isOpen ? t('Collapse') : t('Expand')}
      aria-expanded={isOpen}
      onPress={() => setIsOpen(!isOpen)}
      style={{
        width: 30,
        height: 30,
        padding: 0,
        justifyContent: 'center',
        borderRadius: 6,
        border: `1px solid ${theme.tableBorder}`,
      }}
    >
      <SfIcon
        name={isOpen ? 'chevronUp' : 'chevronDown'}
        width={14}
        height={14}
      />
    </Button>
  );

  if (!account) {
    return (
      <SfCard
        testId="account-reminders"
        title={t('Reminders')}
        actions={collapseButton}
        style={{ marginBottom: 16, flexShrink: 0 }}
        bodyStyle={isOpen ? undefined : { padding: 0, height: 16 }}
      >
        {isOpen && <ReminderCarousel reminders={reminders} showAccount />}
      </SfCard>
    );
  }

  const dataPoints = (forecast.data?.dataPoints ?? []).filter(
    point => point.accountId === account.id,
  );

  return (
    <SfCard
      testId="projected-cash-flow"
      title={t('Projected Cash Flow')}
      actions={
        <>
          {isOpen && (
            <Select
              aria-label={t('Forecast range')}
              value={range}
              onChange={setRange}
              options={[
                ['1', t('Next month')],
                ['3', t('Next 3 months')],
                ['6', t('Next 6 months')],
                ['12', t('Next 12 months')],
              ]}
              style={{ fontWeight: 600 }}
            />
          )}
          {collapseButton}
        </>
      }
      style={{ marginBottom: 16, flexShrink: 0 }}
      bodyStyle={isOpen ? undefined : { padding: 0, height: 16 }}
    >
      {isOpen && (
        <View style={{ gap: 14 }}>
          {forecast.isPending ? (
            <View style={{ height: 190 }} />
          ) : dataPoints.length === 0 ? (
            <Text style={{ color: theme.pageTextSubdued }}>
              <Trans>No forecast available for this account.</Trans>
            </Text>
          ) : (
            <ProjectedCashFlowChart dataPoints={dataPoints} height={190} />
          )}
          {reminders.length > 0 && (
            <ReminderCarousel reminders={reminders} showAccount={false} />
          )}
        </View>
      )}
    </SfCard>
  );
}
