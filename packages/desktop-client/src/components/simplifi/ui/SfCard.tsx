import type { ReactNode } from 'react';

import type { CSSProperties } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { CARD_RADIUS } from '#components/simplifi/layout';

type SfCardProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
  testId?: string;
};

export function SfCard({
  title,
  subtitle,
  actions,
  children,
  style,
  bodyStyle,
  testId,
}: SfCardProps) {
  const hasHeader = title != null || actions != null;

  return (
    <View
      data-testid={testId}
      style={{
        backgroundColor: theme.cardBackground,
        border: `1px solid ${theme.tableBorder}`,
        borderRadius: CARD_RADIUS,
        minWidth: 0,
        ...style,
      }}
    >
      {hasHeader && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: '18px 18px 0 18px',
            gap: 12,
            flexShrink: 0,
          }}
        >
          <View style={{ flex: 1, minWidth: 0 }}>
            {title != null && (
              <View
                role="heading"
                aria-level={2}
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: theme.pageText,
                }}
              >
                {title}
              </View>
            )}
            {subtitle != null && (
              <View
                style={{
                  fontSize: 14,
                  color: theme.pageTextLight,
                  marginTop: 3,
                }}
              >
                {subtitle}
              </View>
            )}
          </View>
          {actions != null && (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              {actions}
            </View>
          )}
        </View>
      )}
      <View style={{ padding: 18, flex: 1, minHeight: 0, ...bodyStyle }}>
        {children}
      </View>
    </View>
  );
}
