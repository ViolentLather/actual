import { Button } from '@actual-app/components/button';
import type { CSSProperties } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

type SfSegmentedProps<T extends string> = {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  style?: CSSProperties;
};

export function SfSegmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  style,
}: SfSegmentedProps<T>) {
  return (
    <View
      role="group"
      aria-label={ariaLabel}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 4, ...style }}
    >
      {options.map(option => {
        const isSelected = option.value === value;
        return (
          <Button
            key={option.value}
            variant="bare"
            data-selected={isSelected || undefined}
            onPress={() => onChange(option.value)}
            style={{
              padding: '6px 9px',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              color: isSelected ? theme.pageTextLink : theme.pageText,
              backgroundColor: isSelected
                ? theme.pillBackgroundSelected
                : 'transparent',
            }}
          >
            {option.label}
          </Button>
        );
      })}
    </View>
  );
}
