import { Trans, useTranslation } from 'react-i18next';

import type { CSSProperties } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { Link } from '#components/common/Link';
import { CARD_RADIUS } from '#components/simplifi/layout';
import { useSheetValue } from '#hooks/useSheetValue';
import * as bindings from '#spreadsheet/bindings';

type UncategorizedBannerProps = {
  style?: CSSProperties;
};

/** "N transactions need to be categorized. [Categorize now]" */
export function UncategorizedBanner({ style }: UncategorizedBannerProps) {
  const { t } = useTranslation();
  const count: number | null = useSheetValue(bindings.uncategorizedCount());

  if (count == null || count <= 0) {
    return null;
  }

  return (
    <View
      data-testid="uncategorized-banner"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderRadius: CARD_RADIUS / 2,
        backgroundColor: theme.errorBackground,
        ...style,
      }}
    >
      <Text style={{ flex: 1 }}>
        {t('Transactions to categorize: {{count}}', { count })}
      </Text>
      <Link
        variant="button"
        buttonVariant="primary"
        to="/categories/uncategorized"
      >
        <Trans>Categorize now</Trans>
      </Link>
    </View>
  );
}
