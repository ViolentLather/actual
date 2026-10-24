import { useTranslation } from 'react-i18next';

import * as monthUtils from '@actual-app/core/shared/months';

import { useLocale } from '#hooks/useLocale';

/** Labels like "4 days ago", "Today", "In 6 days" or "on Nov 2, 2026". */
export function useRelativeDayLabel() {
  const { t } = useTranslation();
  const locale = useLocale();

  return (date: string) => {
    const days = monthUtils.differenceInCalendarDays(
      date,
      monthUtils.currentDay(),
    );
    if (days === 0) {
      return t('Today');
    }
    if (days === 1) {
      return t('Tomorrow');
    }
    if (days === -1) {
      return t('Yesterday');
    }
    if (days < 0 && days >= -30) {
      return t('{{count}} days ago', { count: -days });
    }
    if (days > 0 && days <= 7) {
      return t('In {{count}} days', { count: days });
    }
    return t('on {{date}}', {
      date: monthUtils.format(date, 'MMM d, yyyy', locale),
    });
  };
}
