import { Trans } from 'react-i18next';

import { SfBadge } from './SfBadge';

/** Qualitative rating of a savings rate percentage, as Simplifi shows it. */
export function SavingsRateBadge({ rate }: { rate: number }) {
  if (rate >= 20) {
    return (
      <SfBadge tone="positive">
        <Trans>Excellent</Trans>
      </SfBadge>
    );
  }
  if (rate >= 10) {
    return (
      <SfBadge tone="accent">
        <Trans>Good</Trans>
      </SfBadge>
    );
  }
  if (rate >= 0) {
    return (
      <SfBadge tone="warning">
        <Trans>Fair</Trans>
      </SfBadge>
    );
  }
  return (
    <SfBadge tone="negative">
      <Trans>Overspent</Trans>
    </SfBadge>
  );
}
