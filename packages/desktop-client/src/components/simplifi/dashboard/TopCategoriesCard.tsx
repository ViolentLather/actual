import { Trans, useTranslation } from 'react-i18next';

import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { categoryColor } from '#components/simplifi/charts/chartColors';
import { SfDonut } from '#components/simplifi/charts/SfDonut';
import type { GroupSpending } from '#components/simplifi/data/cashFlow';
import { SfAmount } from '#components/simplifi/ui/SfAmount';
import { SfCard } from '#components/simplifi/ui/SfCard';

type TopCategoriesCardProps = {
  groups: GroupSpending[];
};

const MAX_SLICES = 6;

export function TopCategoriesCard({ groups }: TopCategoriesCardProps) {
  const { t } = useTranslation();

  const top = groups.slice(0, MAX_SLICES);
  const rest = groups.slice(MAX_SLICES);
  const slices = top.map((group, index) => ({
    id: group.id,
    name: group.name,
    value: group.amount,
    color: categoryColor(index),
  }));
  if (rest.length > 0) {
    slices.push({
      id: 'other',
      name: t('Everything else'),
      value: rest.reduce((sum, group) => sum + group.amount, 0),
      color: theme.reportsGray,
    });
  }

  return (
    <SfCard
      testId="dashboard-top-categories"
      title={t('Top Spending Categories')}
      subtitle={t('This Month')}
    >
      {slices.length === 0 ? (
        <Text style={{ color: theme.pageTextSubdued, padding: '40px 0' }}>
          <Trans>No spending this month yet.</Trans>
        </Text>
      ) : (
        <View style={{ alignItems: 'center', gap: 18 }}>
          <SfDonut
            data={slices}
            size={150}
            renderTooltipValue={value => <SfAmount value={value} />}
          />
          <View
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '14px 12px',
              width: '100%',
            }}
          >
            {slices.map(slice => (
              <View key={slice.id} style={{ minWidth: 0 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    minWidth: 0,
                  }}
                >
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: slice.color,
                      flexShrink: 0,
                    }}
                  />
                  <Text
                    title={slice.name}
                    style={{ ...styles.ellipsisText, fontSize: 14 }}
                  >
                    {slice.name}
                  </Text>
                </View>
                <SfAmount
                  value={slice.value}
                  style={{ fontWeight: 700, marginLeft: 20, fontSize: 13 }}
                />
              </View>
            ))}
          </View>
        </View>
      )}
    </SfCard>
  );
}
