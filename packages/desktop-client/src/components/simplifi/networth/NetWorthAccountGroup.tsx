import { useState } from 'react';
import { Trans } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { Link } from '#components/common/Link';
import type { AccountGroupRow } from '#components/simplifi/data/netWorthBreakdown';
import { SfIcon } from '#components/simplifi/SfIcon';
import { SfAmount } from '#components/simplifi/ui/SfAmount';
import { SfChange } from '#components/simplifi/ui/SfChange';

type NetWorthAccountGroupProps = {
  group: AccountGroupRow;
  changeLabel: string;
};

export function NetWorthAccountGroup({
  group,
  changeLabel,
}: NetWorthAccountGroupProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View
      style={{
        border: `1px solid ${theme.tableBorder}`,
        borderRadius: 8,
        backgroundColor: theme.tableRowHeaderBackground,
      }}
    >
      <Button
        variant="bare"
        aria-expanded={isOpen}
        onPress={() => setIsOpen(!isOpen)}
        style={{
          display: 'grid',
          gridTemplateColumns: '20px minmax(0, 1.2fr) minmax(0, 1.5fr) auto',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderRadius: 8,
          textAlign: 'left',
          width: '100%',
        }}
      >
        <SfIcon
          name={isOpen ? 'chevronDown' : 'chevronRight'}
          width={14}
          height={14}
        />
        <View style={{ minWidth: 0 }}>
          <Text style={{ ...styles.ellipsisText, fontWeight: 600 }}>
            {group.name}
          </Text>
          <Text style={{ fontSize: 12, color: theme.pageTextLight }}>
            <Trans count={group.accounts.length}>
              {{ count: group.accounts.length }} accounts
            </Trans>
          </Text>
        </View>
        <SfChange
          change={group.change}
          base={group.balance - group.change}
          label={changeLabel}
          size="small"
        />
        <SfAmount value={group.balance} style={{ fontWeight: 600 }} />
      </Button>
      {isOpen && (
        <View style={{ borderTop: `1px solid ${theme.tableBorder}` }}>
          {group.accounts.map(row => (
            <Link
              key={row.account.id}
              variant="internal"
              to={`/accounts/${row.account.id}`}
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '20px minmax(0, 1.2fr) minmax(0, 1.5fr) auto',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                color: theme.pageText,
                textDecoration: 'none',
                ':hover': { backgroundColor: theme.tableRowBackgroundHover },
              }}
            >
              <span />
              <Text style={styles.ellipsisText}>{row.account.name}</Text>
              <SfChange
                change={row.change}
                base={row.balance - row.change}
                size="small"
              />
              <SfAmount value={row.balance} />
            </Link>
          ))}
        </View>
      )}
    </View>
  );
}
