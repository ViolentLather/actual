import { useTranslation } from 'react-i18next';

import * as monthUtils from '@actual-app/core/shared/months';

import { SfBarChart } from '#components/simplifi/charts/SfBarChart';
import type { MonthCashFlow } from '#components/simplifi/data/cashFlow';
import { SfAmount } from '#components/simplifi/ui/SfAmount';
import { SfCard } from '#components/simplifi/ui/SfCard';
import { useLocale } from '#hooks/useLocale';
import { useNavigate } from '#hooks/useNavigate';

type CashFlowBarsCardProps = {
  kind: 'income' | 'spending';
  monthly: MonthCashFlow[];
  color: string;
};

export function CashFlowBarsCard({
  kind,
  monthly,
  color,
}: CashFlowBarsCardProps) {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();

  const data = monthly.map(entry => ({
    key: entry.month,
    label: monthUtils.format(entry.month, 'MMM', locale),
    value: Math.max(0, kind === 'income' ? entry.income : entry.spending),
  }));

  return (
    <SfCard
      testId={`dashboard-${kind}`}
      title={kind === 'income' ? t('Income') : t('Spending')}
      subtitle={t('Recent {{count}} months', { count: monthly.length })}
    >
      <SfBarChart
        data={data}
        height={250}
        color={color}
        barSize={30}
        renderTooltipValue={value => <SfAmount value={value} />}
        onBarClick={() => void navigate('/spending')}
      />
    </SfCard>
  );
}
