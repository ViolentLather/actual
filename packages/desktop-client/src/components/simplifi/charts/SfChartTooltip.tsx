import type { ReactNode } from 'react';

import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

type SfChartTooltipProps = {
  title: ReactNode;
  children: ReactNode;
};

export function SfChartTooltip({ title, children }: SfChartTooltipProps) {
  return (
    <View
      style={{
        pointerEvents: 'none',
        padding: '8px 10px',
        borderRadius: 8,
        backgroundColor: theme.tooltipBackground,
        border: `1px solid ${theme.tooltipBorder}`,
        color: theme.tooltipText,
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)',
        fontSize: 13,
        gap: 3,
      }}
    >
      <View style={{ fontWeight: 600 }}>{title}</View>
      <View>{children}</View>
    </View>
  );
}
