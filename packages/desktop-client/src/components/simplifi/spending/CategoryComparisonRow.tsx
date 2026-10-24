import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { FinancialText } from '#components/FinancialText';
import { PrivacyFilter } from '#components/PrivacyFilter';
import { SfIcon } from '#components/simplifi/SfIcon';
import { SfAmount } from '#components/simplifi/ui/SfAmount';
import { useFormat } from '#hooks/useFormat';

type CategoryComparisonRowProps = {
  name: string;
  current: number;
  previous: number;
  max: number;
  color: string;
  differenceMode: 'percent' | 'amount';
  isNested?: boolean;
};

function barWidth(value: number, max: number) {
  return max > 0 ? `${Math.max(0.5, (Math.max(value, 0) / max) * 100)}%` : 0;
}

export function CategoryComparisonRow({
  name,
  current,
  previous,
  max,
  color,
  differenceMode,
  isNested = false,
}: CategoryComparisonRowProps) {
  const format = useFormat();
  const difference = current - previous;
  const percent = previous > 0 ? (difference / previous) * 100 : null;
  const isIncrease = difference > 0;
  const isUnchanged = difference === 0;

  const differenceText =
    differenceMode === 'percent'
      ? percent == null
        ? '—'
        : `${Math.abs(percent).toFixed(1)}%`
      : format(Math.abs(difference), 'financial');

  const badgeColor = isUnchanged
    ? theme.pageTextLight
    : isIncrease
      ? theme.numberNegative
      : theme.numberPositive;
  const badgeBackground = isUnchanged
    ? theme.pillBackground
    : isIncrease
      ? theme.errorBackground
      : 'transparent';

  return (
    <View
      style={{
        display: 'grid',
        gridTemplateColumns: '200px minmax(0, 1fr) 190px',
        alignItems: 'center',
        gap: 12,
        padding: isNested ? '10px 16px 10px 32px' : '14px 16px',
        borderBottom: `1px solid ${theme.tableBorder}`,
      }}
    >
      <Text
        title={name}
        style={{
          ...styles.ellipsisText,
          fontWeight: isNested ? 400 : 600,
          fontSize: isNested ? 13 : 14,
        }}
      >
        {name}
      </Text>
      <View style={{ gap: 6, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              height: isNested ? 10 : 14,
              width: barWidth(current, max),
              maxWidth: 'calc(100% - 90px)',
              borderRadius: 7,
              backgroundColor: color,
            }}
          />
          <SfAmount value={current} style={{ fontSize: 12, fontWeight: 600 }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              height: isNested ? 10 : 14,
              width: barWidth(previous, max),
              maxWidth: 'calc(100% - 90px)',
              borderRadius: 7,
              border: `1px solid ${color}`,
              background: `repeating-linear-gradient(-45deg, ${color} 0 3px, transparent 3px 6px)`,
            }}
          />
          <SfAmount value={previous} style={{ fontSize: 12 }} />
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 3,
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 600,
            color: badgeColor,
            backgroundColor: badgeBackground,
          }}
        >
          {!isUnchanged && (
            <SfIcon
              name={isIncrease ? 'chevronUp' : 'chevronDown'}
              width={12}
              height={12}
            />
          )}
          <PrivacyFilter>
            <FinancialText>{differenceText}</FinancialText>
          </PrivacyFilter>
        </View>
      </View>
    </View>
  );
}
