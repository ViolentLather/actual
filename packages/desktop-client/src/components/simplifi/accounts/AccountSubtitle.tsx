import { Trans, useTranslation } from 'react-i18next';

import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { tsToRelativeTime } from '@actual-app/core/shared/util';
import type { AccountEntity } from '@actual-app/core/types/models';

import { SfBadge } from '#components/simplifi/ui/SfBadge';
import { useLocale } from '#hooks/useLocale';

type AccountSubtitleProps = {
  account: AccountEntity | undefined;
  accounts: AccountEntity[];
};

/** "Navy Federal •••9148  Updated 3 hrs ago", or an account count. */
export function AccountSubtitle({ account, accounts }: AccountSubtitleProps) {
  const { t } = useTranslation();
  const locale = useLocale();

  if (!account) {
    const openCount = accounts.filter(a => !a.closed).length;
    return (
      <Text style={{ fontSize: 14, color: theme.pageTextLight }}>
        {t('{{count}} accounts', { count: openCount })}
      </Text>
    );
  }

  const institution =
    account.bankName ||
    (account.offbudget ? t('Off budget account') : t('On budget account'));

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        fontSize: 14,
        color: theme.pageTextLight,
      }}
    >
      <Text>
        {institution}
        {account.mask ? ` •••${account.mask}` : ''}
      </Text>
      {account.last_sync && (
        <SfBadge tone="positive">
          {t('Updated {{time}}', {
            time: tsToRelativeTime(account.last_sync, locale),
          })}
        </SfBadge>
      )}
      {account.closed ? (
        <SfBadge>
          <Trans>Closed</Trans>
        </SfBadge>
      ) : null}
    </View>
  );
}
