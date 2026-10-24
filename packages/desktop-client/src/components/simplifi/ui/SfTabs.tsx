import { Button } from '@actual-app/components/button';
import type { CSSProperties } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

type SfTabsProps<T extends string> = {
  tabs: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  style?: CSSProperties;
};

export function SfTabs<T extends string>({
  tabs,
  value,
  onChange,
  ariaLabel,
  style,
}: SfTabsProps<T>) {
  return (
    <View
      role="group"
      aria-label={ariaLabel}
      style={{
        flexDirection: 'row',
        alignItems: 'stretch',
        borderBottom: `1px solid ${theme.tableBorder}`,
        flexShrink: 0,
        ...style,
      }}
    >
      {tabs.map(tab => {
        const isSelected = tab.value === value;
        return (
          <Button
            key={tab.value}
            variant="bare"
            data-selected={isSelected || undefined}
            onPress={() => onChange(tab.value)}
            style={{
              padding: '14px 18px 12px',
              minWidth: 72,
              borderRadius: 0,
              fontSize: 14,
              fontWeight: 600,
              color: isSelected ? theme.pageTextLink : theme.pageText,
              borderBottom: `2px solid ${
                isSelected ? theme.pageTextLink : 'transparent'
              }`,
              marginBottom: -1,
            }}
          >
            {tab.label}
          </Button>
        );
      })}
    </View>
  );
}
