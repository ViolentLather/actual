import { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { Popover } from '@actual-app/components/popover';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { Checkbox } from '#components/forms';
import { useInvestmentAccounts } from '#components/simplifi/data/useInvestmentAccounts';

/** Lets the user pick which accounts count as investments. */
export function InvestmentAccountsButton() {
  const { t } = useTranslation();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { accounts, allAccounts, setAccountIds } = useInvestmentAccounts();
  const selectedIds = accounts.map(account => account.id);
  const openAccounts = allAccounts.filter(account => !account.closed);

  const toggle = (id: string) =>
    setAccountIds(
      selectedIds.includes(id)
        ? selectedIds.filter(existing => existing !== id)
        : [...selectedIds, id],
    );

  return (
    <>
      <Button
        ref={triggerRef}
        variant="bare"
        onPress={() => setIsOpen(true)}
        style={{
          padding: '6px 10px',
          borderRadius: 6,
          fontWeight: 600,
          border: `1px solid ${theme.tableBorder}`,
        }}
      >
        {t('{{count}} investment accounts', { count: accounts.length })}
      </Button>
      <Popover
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        placement="bottom end"
        style={{ width: 300, maxHeight: 420, overflowY: 'auto', padding: 8 }}
      >
        <Text
          style={{
            display: 'block',
            padding: '4px 6px 8px',
            color: theme.pageTextLight,
          }}
        >
          <Trans>Choose the accounts that hold investments.</Trans>
        </Text>
        <View>
          {openAccounts.map(account => (
            <label
              key={account.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 6px',
              }}
            >
              <Checkbox
                checked={selectedIds.includes(account.id)}
                onChange={() => toggle(account.id)}
              />
              <Text style={styles.ellipsisText}>{account.name}</Text>
            </label>
          ))}
        </View>
      </Popover>
    </>
  );
}
