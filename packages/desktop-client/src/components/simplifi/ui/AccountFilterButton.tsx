import { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { Popover } from '@actual-app/components/popover';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { Checkbox } from '#components/forms';
import { useAccountFilter } from '#components/simplifi/data/useAccountFilter';
import { SfIcon } from '#components/simplifi/SfIcon';
import { useAccountGroups } from '#hooks/useAccountGroups';
import { useAccounts } from '#hooks/useAccounts';

/**
 * "All accounts ▾" picker, e.g. to look at only one person's accounts.
 * Accounts are listed by account group, and a whole group can be toggled.
 */
export function AccountFilterButton() {
  const { t } = useTranslation();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { data: accounts = [] } = useAccounts();
  const { data: accountGroups = [] } = useAccountGroups();
  const { selectedIds, setSelectedIds } = useAccountFilter();

  const openAccounts = accounts.filter(account => !account.closed);
  const isSelected = (id: string) => !selectedIds || selectedIds.includes(id);
  const selectedCount = openAccounts.filter(a => isSelected(a.id)).length;

  const sections = [
    ...accountGroups.map(group => ({
      id: group.id,
      name: group.name,
      accounts: openAccounts.filter(a => a.account_group_id === group.id),
    })),
    {
      id: 'ungrouped',
      name: accountGroups.length > 0 ? t('Other accounts') : t('Accounts'),
      accounts: openAccounts.filter(
        a =>
          !a.account_group_id ||
          !accountGroups.some(group => group.id === a.account_group_id),
      ),
    },
  ].filter(section => section.accounts.length > 0);

  const update = (ids: string[]) => {
    // Selecting everything is the same as no filter.
    setSelectedIds(ids.length === openAccounts.length ? null : ids);
  };
  const currentIds = openAccounts.filter(a => isSelected(a.id)).map(a => a.id);
  const toggle = (ids: string[], isOn: boolean) =>
    update(
      isOn
        ? [...new Set([...currentIds, ...ids])]
        : currentIds.filter(id => !ids.includes(id)),
    );

  const label =
    selectedIds == null
      ? t('All accounts')
      : t('{{count}} of {{total}} accounts', {
          count: selectedCount,
          total: openAccounts.length,
        });

  return (
    <>
      <Button
        ref={triggerRef}
        variant="bare"
        aria-label={t('Choose accounts')}
        onPress={() => setIsOpen(true)}
        style={{
          gap: 8,
          padding: '6px 10px',
          borderRadius: 6,
          fontWeight: 600,
          border: `1px solid ${theme.tableBorder}`,
          color: selectedIds ? theme.pageTextLink : theme.pageText,
        }}
      >
        {label}
        <SfIcon name="chevronDown" width={14} height={14} />
      </Button>
      <Popover
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        placement="bottom end"
        style={{ width: 300, maxHeight: 420, overflowY: 'auto', padding: 8 }}
      >
        <View
          style={{
            flexDirection: 'row',
            padding: '4px 6px 8px',
          }}
        >
          <Button variant="bare" onPress={() => setSelectedIds(null)}>
            <Trans>Select all</Trans>
          </Button>
        </View>
        {sections.map(section => {
          const ids = section.accounts.map(a => a.id);
          const isAllOn = ids.every(isSelected);
          return (
            <View key={section.id} style={{ paddingBottom: 6 }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px',
                  fontWeight: 700,
                }}
              >
                <Checkbox
                  checked={isAllOn}
                  onChange={() => toggle(ids, !isAllOn)}
                />
                <Text>{section.name}</Text>
              </label>
              {section.accounts.map(account => (
                <label
                  key={account.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 6px 4px 26px',
                  }}
                >
                  <Checkbox
                    checked={isSelected(account.id)}
                    onChange={() =>
                      toggle([account.id], !isSelected(account.id))
                    }
                  />
                  <Text style={styles.ellipsisText}>{account.name}</Text>
                </label>
              ))}
            </View>
          );
        })}
      </Popover>
    </>
  );
}
