import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import type { Reminder } from '#components/simplifi/data/useUpcomingReminders';
import { SfIcon } from '#components/simplifi/SfIcon';
import { ReminderTile } from '#components/simplifi/ui/ReminderTile';

type ReminderCarouselProps = {
  reminders: Reminder[];
  showAccount: boolean;
};

const TILE_WIDTH = 228;

export function ReminderCarousel({
  reminders,
  showAccount,
}: ReminderCarouselProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    scrollRef.current?.scrollBy({
      left: direction * (TILE_WIDTH + 8) * 3,
      behavior: 'smooth',
    });
  };

  return (
    <View style={{ position: 'relative' }}>
      <View
        ref={scrollRef}
        data-testid="reminder-carousel"
        style={{
          flexDirection: 'row',
          gap: 8,
          overflowX: 'auto',
          padding: 4,
          borderRadius: 8,
          backgroundColor: theme.tableRowHeaderBackground,
        }}
      >
        {reminders.map(reminder => (
          <ReminderTile
            key={reminder.id}
            reminder={reminder}
            showAccount={showAccount}
            width={TILE_WIDTH}
          />
        ))}
      </View>
      {reminders.length > 3 && (
        <>
          <Button
            variant="bare"
            aria-label={t('Scroll left')}
            onPress={() => scrollBy(-1)}
            style={{
              position: 'absolute',
              left: -14,
              top: 'calc(50% - 15px)',
              width: 30,
              height: 30,
              borderRadius: 15,
              padding: 0,
              justifyContent: 'center',
              border: `1px solid ${theme.tableBorder}`,
              backgroundColor: theme.cardBackground,
            }}
          >
            <SfIcon name="chevronLeft" width={16} height={16} />
          </Button>
          <Button
            variant="bare"
            aria-label={t('Scroll right')}
            onPress={() => scrollBy(1)}
            style={{
              position: 'absolute',
              right: -14,
              top: 'calc(50% - 15px)',
              width: 30,
              height: 30,
              borderRadius: 15,
              padding: 0,
              justifyContent: 'center',
              border: `1px solid ${theme.tableBorder}`,
              backgroundColor: theme.cardBackground,
            }}
          >
            <SfIcon name="chevronRight" width={16} height={16} />
          </Button>
        </>
      )}
    </View>
  );
}
