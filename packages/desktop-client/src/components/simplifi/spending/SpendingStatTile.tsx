import type { ReactNode } from 'react';

import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { CARD_RADIUS } from '#components/simplifi/layout';

type SpendingStatTileProps = {
  label: ReactNode;
  children: ReactNode;
  trailing?: ReactNode;
};

export function SpendingStatTile({
  label,
  children,
  trailing,
}: SpendingStatTileProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: '16px 16px 18px',
        borderRadius: CARD_RADIUS,
        border: `1px solid ${theme.tableBorder}`,
        backgroundColor: theme.cardBackground,
        minWidth: 0,
      }}
    >
      <View style={{ flex: 1, gap: 6, minWidth: 0 }}>
        <Text style={{ fontSize: 14, color: theme.pageText }}>{label}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          {children}
        </View>
      </View>
      {trailing}
    </View>
  );
}
