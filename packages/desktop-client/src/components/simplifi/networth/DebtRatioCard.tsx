import { useTranslation } from 'react-i18next';

import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { SfBadge } from '#components/simplifi/ui/SfBadge';
import { SfCard } from '#components/simplifi/ui/SfCard';

type DebtRatioCardProps = {
  assets: number;
  liabilities: number;
};

export function DebtRatioCard({ assets, liabilities }: DebtRatioCardProps) {
  const { t } = useTranslation();
  const debt = Math.abs(liabilities);
  const ratio = assets > 0 ? (debt / assets) * 100 : debt > 0 ? 100 : 0;

  const rating =
    ratio < 30
      ? {
          tone: 'positive' as const,
          label: t('Excellent'),
          color: theme.numberPositive,
          message: t(
            'Your debt is low compared to your assets - a strong sign of financial health. Nice job!',
          ),
        }
      : ratio < 60
        ? {
            tone: 'warning' as const,
            label: t('Fair'),
            color: theme.warningText,
            message: t(
              'Your debt is a sizable share of your assets. Paying it down will strengthen your finances.',
            ),
          }
        : {
            tone: 'negative' as const,
            label: t('High'),
            color: theme.numberNegative,
            message: t(
              'Your debt is high compared to your assets. Focusing on paying it down can make a big difference.',
            ),
          };

  return (
    <SfCard title={t('Debt to Asset Ratio')} testId="net-worth-debt-ratio">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: 700 }}>
          {ratio.toFixed(0)}%
        </Text>
        <SfBadge tone={rating.tone}>{rating.label}</SfBadge>
      </View>
      <View
        style={{
          height: 14,
          borderRadius: 4,
          backgroundColor: theme.tableRowHeaderBackground,
          marginTop: 14,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${Math.min(100, Math.max(ratio, 2))}%`,
            backgroundColor: rating.color,
            borderRadius: 4,
          }}
        />
      </View>
      <Text style={{ fontSize: 13, color: theme.pageTextLight, marginTop: 10 }}>
        {rating.message}
      </Text>
    </SfCard>
  );
}
