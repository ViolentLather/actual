import type { ReactNode } from 'react';

import { theme } from '@actual-app/components/theme';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useRechartsAnimation } from '#components/reports/chart-theme';
import { Container } from '#components/reports/Container';

import { SfChartTooltip } from './SfChartTooltip';
import { useCompactAmount } from './useCompactAmount';

export type SfBarDatum = {
  key: string;
  label: string;
  value: number;
  /** Highlight the bar, e.g. the current, still-incomplete period. */
  isHighlighted?: boolean;
};

type SfBarChartProps = {
  data: SfBarDatum[];
  height: number;
  color: string;
  /** Color of regular bars when one bar is highlighted. */
  mutedColor?: string;
  barSize?: number;
  renderTooltipValue: (value: number) => ReactNode;
  onBarClick?: (datum: SfBarDatum) => void;
};

export function SfBarChart({
  data,
  height,
  color,
  mutedColor,
  barSize = 30,
  renderTooltipValue,
  onBarClick,
}: SfBarChartProps) {
  const animationProps = useRechartsAnimation({ animationDuration: 600 });
  const formatAmount = useCompactAmount();

  return (
    <Container style={{ height }}>
      {(width, chartHeight) => (
        <BarChart
          width={width}
          height={chartHeight}
          data={data}
          margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke={theme.tableBorder} />
          <XAxis
            dataKey="label"
            tick={{ fill: theme.pageTextLight, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            interval={0}
          />
          <YAxis
            tickFormatter={formatAmount}
            tick={{ fill: theme.pageTextSubdued, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={56}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            content={({ active, payload }) => {
              const datum = payload?.[0]?.payload as SfBarDatum | undefined;
              if (!active || !datum) {
                return null;
              }
              return (
                <SfChartTooltip title={datum.label}>
                  {renderTooltipValue(datum.value)}
                </SfChartTooltip>
              );
            }}
            isAnimationActive={false}
          />
          <Bar
            dataKey="value"
            barSize={barSize}
            radius={[3, 3, 0, 0]}
            cursor={onBarClick ? 'pointer' : undefined}
            onClick={
              onBarClick
                ? (entry: { payload?: SfBarDatum }) => {
                    if (entry.payload) {
                      onBarClick(entry.payload);
                    }
                  }
                : undefined
            }
            {...animationProps}
          >
            {data.map(datum => (
              <Cell
                key={datum.key}
                fill={mutedColor && !datum.isHighlighted ? mutedColor : color}
              />
            ))}
          </Bar>
        </BarChart>
      )}
    </Container>
  );
}
