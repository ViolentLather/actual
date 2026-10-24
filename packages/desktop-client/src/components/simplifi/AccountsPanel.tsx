import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';

import { AccountsSection } from '#components/sidebar/redesign/AccountsSection';
import { replaceModal } from '#modals/modalsSlice';
import { useDispatch } from '#redux';

import { ACCOUNTS_PANEL_WIDTH } from './layout';
import { SfIcon } from './SfIcon';

export function AccountsPanel() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onAddAccount = () => {
    dispatch(replaceModal({ modal: { name: 'add-account', options: {} } }));
  };

  return (
    <View
      style={{
        position: 'relative',
        flexShrink: 0,
        width: isCollapsed ? 0 : ACCOUNTS_PANEL_WIDTH,
        transition: 'width .2s ease',
        borderRight: `1px solid ${theme.tableBorder}`,
        backgroundColor: theme.pageBackground,
      }}
    >
      <Tooltip
        placement="right"
        content={
          isCollapsed ? (
            <Trans>Show accounts</Trans>
          ) : (
            <Trans>Hide accounts</Trans>
          )
        }
      >
        <Button
          variant="bare"
          aria-label={isCollapsed ? t('Show accounts') : t('Hide accounts')}
          onPress={() => setIsCollapsed(!isCollapsed)}
          style={{
            position: 'absolute',
            top: 14,
            right: -13,
            zIndex: 10,
            width: 26,
            height: 26,
            padding: 0,
            borderRadius: 13,
            justifyContent: 'center',
            border: `1px solid ${theme.tableBorder}`,
            backgroundColor: theme.cardBackground,
            color: theme.pageTextSubdued,
          }}
        >
          <SfIcon
            name={isCollapsed ? 'chevronRight' : 'chevronLeft'}
            width={14}
            height={14}
          />
        </Button>
      </Tooltip>

      <View
        aria-hidden={isCollapsed}
        data-testid="accounts-panel"
        style={{
          width: ACCOUNTS_PANEL_WIDTH,
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          visibility: isCollapsed ? 'hidden' : 'visible',
          color: theme.sidebarItemText,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: '18px 20px 14px 22px',
            borderBottom: `1px solid ${theme.tableBorder}`,
            flexShrink: 0,
          }}
        >
          <View
            role="heading"
            aria-level={2}
            style={{ fontSize: 20, fontWeight: 700, color: theme.pageText }}
          >
            <Trans>Accounts</Trans>
          </View>
          <View style={{ flex: 1 }} />
          <Button
            variant="bare"
            onPress={onAddAccount}
            style={{
              color: theme.pageTextLink,
              fontWeight: 600,
              gap: 6,
            }}
          >
            <SfIcon
              name="plusCircle"
              width={16}
              height={16}
              style={{ color: theme.pageTextLink }}
            />
            <Trans>New</Trans>
          </Button>
        </View>
        <View style={{ flex: 1, minHeight: 0, paddingTop: 8 }}>
          <AccountsSection />
        </View>
      </View>
    </View>
  );
}
