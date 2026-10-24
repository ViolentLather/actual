import { useFormat } from '#hooks/useFormat';
import { useLocale } from '#hooks/useLocale';
import { usePrivacyMode } from '#hooks/usePrivacyMode';

/**
 * Formatter for chart axes: short amounts like `$12K`, hidden in privacy mode.
 */
export function useCompactAmount() {
  const format = useFormat();
  const locale = useLocale();
  const isPrivacyEnabled = usePrivacyMode();
  const { currency } = format;
  const formatter = new Intl.NumberFormat(locale.code, {
    notation: 'compact',
    maximumFractionDigits: 1,
  });

  return (value: number) => {
    if (isPrivacyEnabled) {
      return '***';
    }
    const amount = value / Math.pow(10, currency.decimalPlaces || 2);
    const sign = amount < 0 ? '-' : '';
    const compact = formatter.format(Math.abs(amount));
    if (!currency.symbol) {
      return sign + compact;
    }
    return currency.symbolFirst
      ? `${sign}${currency.symbol}${compact}`
      : `${sign}${compact}${currency.symbol}`;
  };
}
