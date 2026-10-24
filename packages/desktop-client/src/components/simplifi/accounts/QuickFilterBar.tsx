import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import type { RuleConditionEntity } from '@actual-app/core/types/models';

import {
  getQuickFilterLabel,
  isQuickFilterCondition,
  makeQuickFilterCondition,
  QUICK_FILTER_IDS,
} from '#components/simplifi/data/quickFilters';
import { useSyncedPref } from '#hooks/useSyncedPref';

type QuickFilterBarProps = {
  conditions: ReadonlyArray<Partial<RuleConditionEntity> | object>;
  onToggle: (condition: Partial<RuleConditionEntity>) => void;
};

export function QuickFilterBar({ conditions, onToggle }: QuickFilterBarProps) {
  const { t } = useTranslation();
  const [reviewedThroughPref, setReviewedThroughPref] = useSyncedPref(
    'simplifi.reviewed-through',
  );
  const reviewedThrough = Number(reviewedThroughPref) || 0;
  const isUnreviewedActive = conditions.some(condition =>
    isQuickFilterCondition(condition, 'unreviewed'),
  );

  return (
    <View
      data-testid="quick-filters"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        marginTop: 10,
      }}
    >
      <Text style={{ color: theme.pageTextSubdued, fontSize: 14 }}>
        <Trans>Quick filters</Trans>
      </Text>
      {QUICK_FILTER_IDS.map(id => {
        const isActive = conditions.some(condition =>
          isQuickFilterCondition(condition, id),
        );
        return (
          <Button
            key={id}
            variant="bare"
            aria-pressed={isActive}
            onPress={() =>
              onToggle(makeQuickFilterCondition(id, reviewedThrough))
            }
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 14,
              border: `1px solid ${
                isActive ? theme.pillBorderSelected : theme.tableBorder
              }`,
              backgroundColor: isActive
                ? theme.pillBackgroundSelected
                : 'transparent',
              color: isActive ? theme.pillTextSelected : theme.pageText,
            }}
          >
            {getQuickFilterLabel(id)}
          </Button>
        );
      })}
      {isUnreviewedActive && (
        <Button
          variant="primary"
          onPress={() => {
            setReviewedThroughPref(String(Date.now()));
            // Everything is reviewed now, so turn the filter off.
            onToggle(makeQuickFilterCondition('unreviewed', reviewedThrough));
          }}
          aria-label={t('Mark all as reviewed')}
        >
          <Trans>Mark all as reviewed</Trans>
        </Button>
      )}
    </View>
  );
}
