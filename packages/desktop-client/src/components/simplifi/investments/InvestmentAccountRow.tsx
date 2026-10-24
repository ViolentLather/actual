import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import type { AccountEntity } from '@actual-app/core/types/models';

import { Link } from '#components/common/Link';
import { updateToBankBalance } from '#components/simplifi/data/updateToBankBalance';
import { SfAmount } from '#components/simplifi/ui/SfAmount';

export const INVESTMENT_COLUMNS =
  'minmax(160px, 1.6fr) repeat(4, minmax(90px, 1fr)) minmax(70px, 0.6fr)';

type InvestmentAccountRowProps = {
  account: AccountEntity;
  balance: number;
  change: number;
  contributions: number;
  share: number;
};

export function InvestmentAccountRow({
  account,
  balance,
  change,
  contributions,
  share,
}: InvestmentAccountRowProps) {
  const { t } = useTranslation();
  const bankBalance = account.bank ? account.balance_current : null;
  const bankDiff = bankBalance != null ? bankBalance - balance : 0;

  return (
    <View
      data-testid="investment-account-row"
      style={{
        display: 'grid',
        gridTemplateColumns: INVESTMENT_COLUMNS,
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderTop: `1px solid ${theme.tableBorder}`,
      }}
    >
      <View style={{ minWidth: 0, gap: 2 }}>
        <Link
          variant="internal"
          to={`/accounts/${account.id}`}
          style={{
            ...styles.ellipsisText,
            fontSize: 14,
            fontWeight: 600,
            color: theme.pageText,
            textDecoration: 'none',
          }}
        >
          {account.name}
        </Link>
        {bankDiff !== 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 12, color: theme.warningText }}>
              <Trans>Bank reports</Trans> <SfAmount value={bankBalance ?? 0} />
            </Text>
            <Tooltip
              content={t(
                'Adds a market value adjustment so the balance matches your bank. It is left out of income and spending.',
              )}
            >
              <Button
                variant="bare"
                onPress={() => void updateToBankBalance(account.id, bankDiff)}
                style={{
                  padding: '1px 6px',
                  fontSize: 12,
                  color: theme.pageTextLink,
                }}
              >
                <Trans>Update</Trans>
              </Button>
            </Tooltip>
          </View>
        )}
      </View>
      <SfAmount value={balance} style={{ fontWeight: 600 }} />
      <SfAmount value={change} colorize showSign />
      <SfAmount value={contributions} showSign />
      <SfAmount value={change - contributions} colorize showSign />
      <Text>{(share * 100).toFixed(1)}%</Text>
    </View>
  );
}
