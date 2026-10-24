import type { ReactNode } from 'react';

import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

type SfBadgeTone = 'positive' | 'negative' | 'neutral' | 'accent' | 'warning';

const toneColors: Record<SfBadgeTone, { color: string; background: string }> = {
  positive: { color: theme.noticeText, background: theme.noticeBackground },
  negative: { color: theme.errorText, background: theme.errorBackground },
  warning: { color: theme.warningText, background: theme.warningBackground },
  neutral: { color: theme.pageTextLight, background: theme.pillBackground },
  accent: {
    color: theme.pageTextLink,
    background: theme.pillBackgroundSelected,
  },
};

type SfBadgeProps = {
  tone?: SfBadgeTone;
  children: ReactNode;
};

export function SfBadge({ tone = 'neutral', children }: SfBadgeProps) {
  const colors = toneColors[tone];
  return (
    <View
      style={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: '3px 8px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        color: colors.color,
        backgroundColor: colors.background,
      }}
    >
      {children}
    </View>
  );
}
