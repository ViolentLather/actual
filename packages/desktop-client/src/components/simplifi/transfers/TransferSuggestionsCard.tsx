import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { useTransferSuggestions } from '#components/simplifi/data/useTransferSuggestions';
import type { TransferSuggestion } from '#components/simplifi/data/useTransferSuggestions';
import { SfIcon } from '#components/simplifi/SfIcon';
import { SfCard } from '#components/simplifi/ui/SfCard';
import { usePayees } from '#hooks/usePayees';
import { useTransactionBatchActions } from '#hooks/useTransactionBatchActions';

import { TransferSuggestionRow } from './TransferSuggestionRow';

const COLLAPSED_ROWS = 3;

/**
 * Lists likely transfers between the user's accounts (for example a credit
 * card payment imported once from checking and once from the card) so they
 * can be linked and stop counting as spending and income.
 */
export function TransferSuggestionsCard() {
  const { t } = useTranslation();
  const { suggestions, ignore } = useTransferSuggestions();
  const { data: payees = [] } = usePayees();
  const { onSetTransfer } = useTransactionBatchActions();
  const [isExpanded, setIsExpanded] = useState(false);
  const [busyKeys, setBusyKeys] = useState<ReadonlySet<string>>(new Set());

  if (suggestions.length === 0) {
    return null;
  }

  const setBusy = (keys: string[], isBusy: boolean) =>
    setBusyKeys(current => {
      const next = new Set(current);
      keys.forEach(key => (isBusy ? next.add(key) : next.delete(key)));
      return next;
    });

  const link = async (pairs: TransferSuggestion[]) => {
    const keys = pairs.map(pair => pair.key);
    setBusy(keys, true);
    try {
      for (const pair of pairs) {
        await onSetTransfer(
          [pair.from.id, pair.to.id],
          payees,
          () => undefined,
        );
      }
    } finally {
      setBusy(keys, false);
    }
  };

  const visible = isExpanded
    ? suggestions
    : suggestions.slice(0, COLLAPSED_ROWS);

  return (
    <SfCard
      testId="transfer-suggestions"
      title={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <SfIcon
            name="refresh"
            width={18}
            height={18}
            style={{ color: theme.pageTextLink }}
          />
          {t('Possible transfers to link: {{count}}', {
            count: suggestions.length,
          })}
        </View>
      }
      subtitle={t(
        'These look like money moving between your own accounts, such as credit card payments. Linking them keeps them out of your spending and income.',
      )}
      actions={
        <Button
          variant="primary"
          isDisabled={busyKeys.size > 0}
          onPress={() => void link(suggestions)}
        >
          <Trans>Link all</Trans>
        </Button>
      }
      style={{ flexShrink: 0 }}
    >
      <View>
        {visible.map(suggestion => (
          <TransferSuggestionRow
            key={suggestion.key}
            suggestion={suggestion}
            isBusy={busyKeys.has(suggestion.key)}
            onLink={() => void link([suggestion])}
            onIgnore={() => ignore(suggestion)}
          />
        ))}
      </View>
      {suggestions.length > COLLAPSED_ROWS && (
        <Button
          variant="bare"
          onPress={() => setIsExpanded(!isExpanded)}
          style={{ alignSelf: 'flex-start', marginTop: 6 }}
        >
          <Text style={{ color: theme.pageTextLink, fontWeight: 600 }}>
            {isExpanded
              ? t('Show fewer')
              : t('Show all {{count}}', { count: suggestions.length })}
          </Text>
        </Button>
      )}
    </SfCard>
  );
}
