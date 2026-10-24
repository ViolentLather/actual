import { Trans } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from '@actual-app/core/shared/months';

import type { TransferSuggestion } from '#components/simplifi/data/useTransferSuggestions';
import { SfIcon } from '#components/simplifi/SfIcon';
import { SfAmount } from '#components/simplifi/ui/SfAmount';
import { useLocale } from '#hooks/useLocale';

type TransferSuggestionRowProps = {
  suggestion: TransferSuggestion;
  isBusy: boolean;
  onLink: () => void;
  onIgnore: () => void;
};

export function TransferSuggestionRow({
  suggestion,
  isBusy,
  onLink,
  onIgnore,
}: TransferSuggestionRowProps) {
  const locale = useLocale();
  const { from, to } = suggestion;
  const describe = (side: typeof from) =>
    `${side.accountName ?? ''} · ${monthUtils.format(side.date, 'MMM d', locale)}${
      side.payeeName ? ` · ${side.payeeName}` : ''
    }`;

  return (
    <View
      data-testid="transfer-suggestion"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 24px minmax(0, 1fr) auto auto',
        alignItems: 'center',
        gap: 12,
        padding: '10px 4px',
        borderTop: `1px solid ${theme.tableBorder}`,
      }}
    >
      <Text title={describe(from)} style={styles.ellipsisText}>
        {describe(from)}
      </Text>
      <SfIcon
        name="chevronRight"
        width={16}
        height={16}
        style={{ color: theme.pageTextSubdued }}
      />
      <Text title={describe(to)} style={styles.ellipsisText}>
        {describe(to)}
      </Text>
      <SfAmount value={to.amount} style={{ fontWeight: 600 }} />
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <Button variant="primary" isDisabled={isBusy} onPress={onLink}>
          <Trans>Link</Trans>
        </Button>
        <Button variant="bare" isDisabled={isBusy} onPress={onIgnore}>
          <Trans>Not a transfer</Trans>
        </Button>
      </View>
    </View>
  );
}
