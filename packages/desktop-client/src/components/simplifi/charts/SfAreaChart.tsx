import { useId } from 'react';
import type { ReactNode } from 'react';

import { theme } from '@actual-app/components/theme';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useRechartsAnimation } from '#components/reports/chart-theme';
import { Container } from '#components/reports/Container';

import { SfChartTooltip } from './SfChartTooltip';
import { useCompactAmount } from './useCompactAmount';

export type SfAreaPoint = { date: string; value: number };

const MAX_TICKS = 12;

/**
 * Ticks on the first point of each month, thinned out for long ranges.
 * Returns undefined for short ranges so recharts picks the ticks itself.
 */
function getMonthTicks(data: SfAreaPoint[]) {
  const monthStarts = data
    .filter(
      (point, index) =>
        index > 0 &&
        point.date.slice(0, 7) !== data[index - 1].date.slice(0, 7),
    )
    .map(point => point.date);
  if (monthStarts.length < 2) {
    return undefined;
  }
  const step = Math.ceil(monthStarts.length / MAX_TICKS);
  return monthStarts.filter((_, index) => index % step === 0);
}

type SfAreaChartProps = {
  data: SfAreaPoint[];
  height: number;
  color?: string;
  formatXTick: (date: string) => string;
  formatTooltipTitle: (date: string) => ReactNode;
  renderTooltipValue: (value: number) => ReactNode;
  /** Draw a line instead of a filled area. */
  isLine?: boolean;
};

export function SfAreaChart({
  data,
  height,
  color = theme.reportsChartFill,
  formatXTick,
  formatTooltipTitle,
  renderTooltipValue,
  isLine = false,
}: SfAreaChartProps) {
  const id = useId();
  const animationProps = useRechartsAnimation({ animationDuration: 600 });
  const formatAmount = useCompactAmount();

  const values = data.map(point => point.value);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);

  return (
    <Container style={{ height }}>
      {(width, chartHeight) => (
        <AreaChart
          width={width}
          height={chartHeight}
          data={data}
          margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.95} />
              <stop offset="100%" stopColor={color} stopOpacity={0.85} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke={theme.tableBorder}
            strokeDasharray="0"
          />
          <XAxis
            dataKey="date"
            ticks={getMonthTicks(data)}
            tickFormatter={formatXTick}
            tick={{ fill: theme.pageTextLight, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            minTickGap={40}
          />
          <YAxis
            tickFormatter={formatAmount}
            tick={{ fill: theme.pageTextSubdued, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={56}
            domain={[min < 0 ? 'auto' : 0, max > 0 ? 'auto' : 0]}
          />
          <Tooltip
            cursor={{ stroke: theme.pageTextSubdued, strokeWidth: 1 }}
            content={({ active, payload }) => {
              const point = payload?.[0]?.payload as SfAreaPoint | undefined;
              if (!active || !point) {
                return null;
              }
              return (
                <SfChartTooltip title={formatTooltipTitle(point.date)}>
                  {renderTooltipValue(point.value)}
                </SfChartTooltip>
              );
            }}
            isAnimationActive={false}
          />
          <Area
            type="linear"
            dataKey="value"
            stroke={color}
            strokeWidth={isLine ? 2 : 1}
            fill={isLine ? 'transparent' : `url(#fill-${id})`}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: theme.cardBackground }}
            {...animationProps}
          />
        </AreaChart>
      )}
    </Container>
  );
}
