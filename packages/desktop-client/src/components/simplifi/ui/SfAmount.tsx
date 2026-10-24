import type { CSSProperties } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';

import { FinancialText } from '#components/FinancialText';
import { PrivacyFilter } from '#components/PrivacyFilter';
import { useFormat } from '#hooks/useFormat';

type SfAmountProps = {
  value: number;
  /** Color positive amounts green (and show a `+`), like income in Simplifi. */
  colorize?: boolean;
  showSign?: boolean;
  style?: CSSProperties;
};

export function SfAmount({
  value,
  colorize = false,
  showSign = false,
  style,
}: SfAmountProps) {
  const format = useFormat();
  const isPositive = value > 0;

  return (
    <PrivacyFilter>
      <FinancialText
        style={{
          ...(colorize && isPositive ? { color: theme.numberPositive } : {}),
          ...style,
        }}
      >
        {format(value, showSign ? 'financial-with-sign' : 'financial')}
      </FinancialText>
    </PrivacyFilter>
  );
}
