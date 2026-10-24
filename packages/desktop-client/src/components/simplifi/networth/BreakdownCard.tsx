import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { View } from '@actual-app/components/view';

import { categoryColor } from '#components/simplifi/charts/chartColors';
import { SfDonut } from '#components/simplifi/charts/SfDonut';
import type { AccountGroupRow } from '#components/simplifi/data/netWorthBreakdown';
import { SfAmount } from '#components/simplifi/ui/SfAmount';
import { SfCard } from '#components/simplifi/ui/SfCard';
import { SfSegmented } from '#components/simplifi/ui/SfSegmented';

type BreakdownCardProps = {
  groups: AccountGroupRow[];
};

export function BreakdownCard({ groups }: BreakdownCardProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'amount' | 'percent'>('amount');
  const total = groups.reduce((sum, group) => sum + group.balance, 0);
  const slices = groups
    .filter(group => group.balance > 0)
    .map((group, index) => ({
      id: group.id,
      name: group.name,
      value: group.balance,
      color: categoryColor(index),
    }));

  return (
    <SfCard
      title={t('Breakdown')}
      subtitle={t('Assets by group')}
      testId="net-worth-breakdown"
      actions={
        <SfSegmented
          ariaLabel={t('Breakdown units')}
          value={mode}
          onChange={setMode}
          options={[
            { value: 'amount', label: '$' },
            { value: 'percent', label: '%' },
          ]}
        />
      }
    >
      <View style={{ alignItems: 'center', gap: 14 }}>
        <SfDonut
          data={slices}
          size={160}
          renderTooltipValue={value => <SfAmount value={value} />}
        />
        <View style={{ width: '100%', gap: 8 }}>
          {slices.map(slice => (
            <View
              key={slice.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: slice.color,
                  flexShrink: 0,
                }}
              />
              <Text style={{ ...styles.ellipsisText, flex: 1 }}>
                {slice.name}
              </Text>
              {mode === 'amount' ? (
                <SfAmount value={slice.value} style={{ fontWeight: 600 }} />
              ) : (
                <Text style={{ fontWeight: 600 }}>
                  {total > 0 ? ((slice.value / total) * 100).toFixed(1) : 0}%
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </SfCard>
  );
}
