import { Trans } from 'react-i18next';

import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import type { Reminder } from '#components/simplifi/data/useUpcomingReminders';
import { SfIcon } from '#components/simplifi/SfIcon';

import { SfAmount } from './SfAmount';
import { SfBadge } from './SfBadge';
import { useRelativeDayLabel } from './useRelativeDayLabel';

type ReminderTileProps = {
  reminder: Reminder;
  showAccount?: boolean;
  width?: number | string;
};

export function ReminderTile({
  reminder,
  showAccount = false,
  width,
}: ReminderTileProps) {
  const relativeDay = useRelativeDayLabel();
  const isIncome = reminder.amount > 0;
  const isPast = reminder.status === 'missed';

  return (
    <View
      data-testid="reminder-tile"
      style={{
        width,
        flexShrink: 0,
        padding: '12px 12px 10px',
        borderRadius: 8,
        border: `1px solid ${theme.tableBorder}`,
        backgroundColor: theme.cardBackground,
        gap: 6,
        minWidth: 0,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            color: isIncome ? theme.noticeText : theme.pageTextLink,
            backgroundColor: isIncome
              ? theme.noticeBackground
              : theme.pillBackgroundSelected,
          }}
        >
          <SfIcon
            name={isIncome ? 'calendarIn' : 'calendarOut'}
            width={15}
            height={15}
          />
        </View>
        <Text style={{ fontSize: 12, color: theme.pageTextLight }}>
          {relativeDay(reminder.date)}
        </Text>
      </View>
      <Text
        title={reminder.name}
        style={{ ...styles.ellipsisText, fontSize: 14, fontWeight: 500 }}
      >
        {reminder.name}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <SfAmount
          value={reminder.amount}
          colorize
          showSign={isIncome}
          style={{ fontSize: 15, fontWeight: 700 }}
        />
        {isPast && (
          <SfBadge tone="negative">
            <Trans>Past</Trans>
          </SfBadge>
        )}
      </View>
      {showAccount && reminder.accountName && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingTop: 6,
            marginTop: 2,
            borderTop: `1px solid ${theme.tableBorder}`,
            color: theme.pageTextLight,
            fontSize: 12,
            minWidth: 0,
          }}
        >
          <SfIcon name="card" width={15} height={15} />
          <Text style={styles.ellipsisText}>{reminder.accountName}</Text>
        </View>
      )}
    </View>
  );
}
