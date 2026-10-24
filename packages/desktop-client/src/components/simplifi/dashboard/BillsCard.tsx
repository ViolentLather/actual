import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { Link } from '#components/common/Link';
import { useUpcomingReminders } from '#components/simplifi/data/useUpcomingReminders';
import { SfIcon } from '#components/simplifi/SfIcon';
import { ReminderTile } from '#components/simplifi/ui/ReminderTile';
import { SfCard } from '#components/simplifi/ui/SfCard';

const PAGE_SIZE = 4;

export function BillsCard() {
  const { t } = useTranslation();
  const { reminders } = useUpcomingReminders();
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(reminders.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = reminders.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE,
  );

  const pagerButtonStyle = {
    width: 28,
    height: 28,
    padding: 0,
    borderRadius: 6,
    justifyContent: 'center',
    border: `1px solid ${theme.tableBorder}`,
  };

  return (
    <SfCard
      testId="dashboard-bills"
      title={t('Bills & Income')}
      actions={
        <>
          <Button
            variant="bare"
            aria-label={t('Previous')}
            isDisabled={currentPage === 0}
            onPress={() => setPage(currentPage - 1)}
            style={pagerButtonStyle}
          >
            <SfIcon name="chevronLeft" width={14} height={14} />
          </Button>
          <Button
            variant="bare"
            aria-label={t('Next')}
            isDisabled={currentPage >= pageCount - 1}
            onPress={() => setPage(currentPage + 1)}
            style={pagerButtonStyle}
          >
            <SfIcon name="chevronRight" width={14} height={14} />
          </Button>
        </>
      }
    >
      {visible.length === 0 ? (
        <Text style={{ color: theme.pageTextSubdued, padding: '30px 0' }}>
          <Trans>No upcoming bills or income.</Trans>
        </Text>
      ) : (
        <View
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 8,
          }}
        >
          {visible.map(reminder => (
            <ReminderTile key={reminder.id} reminder={reminder} />
          ))}
        </View>
      )}
      <Link
        variant="button"
        buttonVariant="bare"
        to="/schedules"
        style={{
          marginTop: 16,
          justifyContent: 'center',
          fontWeight: 600,
          color: theme.pageTextLink,
          backgroundColor: theme.pillBackgroundSelected,
          borderRadius: 6,
          padding: '8px 12px',
        }}
      >
        <Trans>See all Bills & Income</Trans>
      </Link>
    </SfCard>
  );
}
