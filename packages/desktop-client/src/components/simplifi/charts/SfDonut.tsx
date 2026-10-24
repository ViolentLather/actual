import type { ReactNode } from 'react';

import { theme } from '@actual-app/components/theme';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import { useRechartsAnimation } from '#components/reports/chart-theme';

import { SfChartTooltip } from './SfChartTooltip';

export type SfDonutSlice = {
  id: string;
  name: string;
  value: number;
  color: string;
};

type SfDonutProps = {
  data: SfDonutSlice[];
  size: number;
  renderTooltipValue: (value: number) => ReactNode;
};

export function SfDonut({ data, size, renderTooltipValue }: SfDonutProps) {
  const animationProps = useRechartsAnimation({ animationDuration: 600 });

  return (
    <PieChart width={size} height={size}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        innerRadius={size * 0.21}
        outerRadius={size / 2 - 2}
        startAngle={90}
        endAngle={-270}
        stroke={theme.cardBackground}
        strokeWidth={1}
        {...animationProps}
      >
        {data.map(slice => (
          <Cell key={slice.id} fill={slice.color} />
        ))}
      </Pie>
      <Tooltip
        content={({ active, payload }) => {
          const slice = payload?.[0]?.payload as SfDonutSlice | undefined;
          if (!active || !slice) {
            return null;
          }
          return (
            <SfChartTooltip title={slice.name}>
              {renderTooltipValue(slice.value)}
            </SfChartTooltip>
          );
        }}
        isAnimationActive={false}
      />
    </PieChart>
  );
}
