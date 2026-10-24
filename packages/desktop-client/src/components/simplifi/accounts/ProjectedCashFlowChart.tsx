import { Trans, useTranslation } from 'react-i18next';

import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from '@actual-app/core/shared/months';
import type { ForecastDataPoint } from '@actual-app/core/types/models/forecast';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Container } from '#components/reports/Container';
import { SfChartTooltip } from '#components/simplifi/charts/SfChartTooltip';
import { useCompactAmount } from '#components/simplifi/charts/useCompactAmount';
import { SfAmount } from '#components/simplifi/ui/SfAmount';
import { useLocale } from '#hooks/useLocale';

import { CashFlowDot } from './CashFlowDot';

type ChartPoint = {
  date: string;
  balance: number;
  kind: 'income' | 'expense' | 'today' | null;
  events: ForecastDataPoint['transactions'];
};

type ProjectedCashFlowChartProps = {
  dataPoints: ForecastDataPoint[];
  height: number;
};

export function ProjectedCashFlowChart({
  dataPoints,
  height,
}: ProjectedCashFlowChartProps) {
  const { t } = useTranslation();
  const locale = useLocale();
  const formatAmount = useCompactAmount();
  const today = monthUtils.currentDay();

  const data: ChartPoint[] = dataPoints.map((point, index) => {
    const net = point.transactions.reduce((sum, tx) => sum + tx.amount, 0);
    return {
      date: point.date,
      balance: point.balance,
      kind:
        point.transactions.length > 0
          ? net > 0
            ? 'income'
            : 'expense'
          : index === 0
            ? 'today'
            : null,
      events: point.transactions,
    };
  });
  const ticks = data
    .filter((_, index) => index % Math.max(1, Math.ceil(data.length / 7)) === 0)
    .map(point => point.date);

  return (
    <Container style={{ height }}>
      {(width, chartHeight) => (
        <LineChart
          width={width}
          height={chartHeight}
          data={data}
          margin={{ top: 14, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke={theme.tableBorder} />
          <XAxis
            dataKey="date"
            ticks={ticks}
            tickFormatter={date => monthUtils.format(date, 'MMM d', locale)}
            tick={{ fill: theme.pageText, fontSize: 12, fontWeight: 600 }}
            tickLine={false}
            axisLine={{ stroke: theme.tableBorder }}
          />
          <YAxis
            tickFormatter={formatAmount}
            tick={{ fill: theme.pageTextSubdued, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={56}
            domain={['auto', 'auto']}
          />
          <ReferenceLine x={today} stroke={theme.pageTextSubdued} />
          <Tooltip
            isAnimationActive={false}
            cursor={{ stroke: theme.pageTextSubdued }}
            content={({ active, payload }) => {
              const point = payload?.[0]?.payload as ChartPoint | undefined;
              if (!active || !point) {
                return null;
              }
              return (
                <SfChartTooltip
                  title={monthUtils.format(point.date, 'MMM d, yyyy', locale)}
                >
                  <View style={{ gap: 3 }}>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                      <Trans>Projected balance:</Trans>{' '}
                      <SfAmount value={point.balance} />
                    </View>
                    {point.events.map(event => (
                      <View
                        key={event.scheduleId}
                        style={{ flexDirection: 'row', gap: 4 }}
                      >
                        {event.scheduleName || event.payee || t('Scheduled')}:{' '}
                        <SfAmount value={event.amount} colorize />
                      </View>
                    ))}
                  </View>
                </SfChartTooltip>
              );
            }}
          />
          <Line
            type="stepAfter"
            dataKey="balance"
            stroke={theme.pageTextLink}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={<CashFlowDot />}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      )}
    </Container>
  );
}
