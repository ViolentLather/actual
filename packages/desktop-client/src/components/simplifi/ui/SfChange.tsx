import type { ReactNode } from 'react';

import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { FinancialText } from '#components/FinancialText';
import { PrivacyFilter } from '#components/PrivacyFilter';
import { SfIcon } from '#components/simplifi/SfIcon';
import { useFormat } from '#hooks/useFormat';

type SfChangeProps = {
  change: number;
  base: number;
  label?: ReactNode;
  size?: 'small' | 'medium';
};

/**
 * Change indicator like "↗ $1,234 (5.2%) Year to date change". The
 * percentage is relative to the absolute starting value.
 */
export function SfChange({
  change,
  base,
  label,
  size = 'medium',
}: SfChangeProps) {
  const format = useFormat();
  const isUp = change >= 0;
  const color = isUp ? theme.numberPositive : theme.numberNegative;
  const rawPercent = base !== 0 ? (change / Math.abs(base)) * 100 : null;
  // Percentages against a near-zero starting point are meaningless.
  const percent =
    rawPercent != null && Math.abs(rawPercent) < 1000 ? rawPercent : null;
  const fontSize = size === 'small' ? 12 : 14;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        fontSize,
        flexWrap: 'wrap',
      }}
    >
      <View
        style={{
          width: size === 'small' ? 18 : 22,
          height: size === 'small' ? 18 : 22,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          color,
          backgroundColor: isUp
            ? theme.noticeBackground
            : theme.errorBackground,
        }}
      >
        <SfIcon
          name={isUp ? 'trendUp' : 'trendDown'}
          width={size === 'small' ? 12 : 14}
          height={size === 'small' ? 12 : 14}
        />
      </View>
      <PrivacyFilter>
        <FinancialText style={{ color, fontWeight: 500 }}>
          {format(Math.abs(change), 'financial')}
          {percent != null && ` (${Math.abs(percent).toFixed(1)}%)`}
        </FinancialText>
      </PrivacyFilter>
      {label != null && (
        <Text style={{ color: theme.pageTextLight }}>{label}</Text>
      )}
    </View>
  );
}
