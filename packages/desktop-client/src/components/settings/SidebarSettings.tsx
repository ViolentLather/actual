import type { DragItem } from 'react-aria';
import { DropIndicator, GridList, useDragAndDrop } from 'react-aria-components';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { Select } from '@actual-app/components/select';
import { theme } from '@actual-app/components/theme';
import { css } from '@emotion/css';

import {
  getDefaultSidebarMenuItems,
  moveSidebarMenuItem,
} from '#components/sidebar/sidebarMenu';
import type { SidebarMenuItemId } from '#components/sidebar/sidebarMenu';
import { useSidebarMenuItemDetails } from '#components/sidebar/useSidebarMenuItemDetails';
import { useSidebarMenu } from '#hooks/useSidebarMenu';
import { useSyncedPref } from '#hooks/useSyncedPref';

import { SettingsGroup } from './SettingsGroup';
import { SettingsRow } from './SettingsRow';
import { SidebarMenuListItem } from './SidebarMenuListItem';

const DASHBOARD_START_PAGE = 'dashboard' as const;

export function SidebarSettings() {
  const { t } = useTranslation();
  const itemDetails = useSidebarMenuItemDetails();
  const { items, availableItems, startPage, saveItems, saveStartPage } =
    useSidebarMenu();
  // An unset start page opens the dashboard, which isn't a sidebar menu item.
  const [startPagePref, setStartPagePref] = useSyncedPref('sidebar-start-page');
  const isDashboardStart = !startPagePref;

  const onToggleItem = (id: SidebarMenuItemId, isVisible: boolean) => {
    saveItems(
      items.map(item =>
        item.id === id ? { ...item, hidden: !isVisible } : item,
      ),
    );
  };

  const onResetToDefault = () => {
    const defaultItems = getDefaultSidebarMenuItems();
    saveItems(defaultItems);
    setStartPagePref('');
  };

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: keys =>
      [...keys].map(key => ({ 'text/plain': String(key) }) satisfies DragItem),
    renderDropIndicator: target => (
      <DropIndicator
        target={target}
        className={css({
          '&[data-drop-target]': {
            height: 4,
            backgroundColor: theme.tableBorderSeparator,
            opacity: 1,
            borderRadius: 4,
          },
        })}
      />
    ),
    onReorder: e => {
      const [key] = e.keys;
      saveItems(
        moveSidebarMenuItem(
          items,
          String(key),
          String(e.target.key),
          e.target.dropPosition,
        ),
      );
    },
  });

  return (
    <SettingsGroup title={t('Sidebar')}>
      <SettingsRow
        title={t('Pages')}
        description={t(
          'Choose which pages appear in the sidebar and drag them into the order you prefer. Pages you switch off can be found here in Settings.',
        )}
        control={
          <Button variant="bare" onPress={onResetToDefault}>
            <Trans>Reset to default</Trans>
          </Button>
        }
      >
        <GridList
          aria-label={t('Sidebar pages')}
          items={availableItems}
          dragAndDropHooks={dragAndDropHooks}
          dependencies={[itemDetails, startPage]}
          className={css({ display: 'flex', flexDirection: 'column' })}
        >
          {item => (
            <SidebarMenuListItem
              key={item.id}
              item={item}
              label={itemDetails[item.id].title}
              Icon={itemDetails[item.id].Icon}
              isStartPage={!isDashboardStart && item.id === startPage}
              onToggle={onToggleItem}
            />
          )}
        </GridList>
      </SettingsRow>
      <SettingsRow
        title={t('Start page')}
        description={t("Actual's home page.")}
        htmlFor="settings-sidebarStartPage"
        control={
          <Select<SidebarMenuItemId | typeof DASHBOARD_START_PAGE>
            id="settings-sidebarStartPage"
            value={isDashboardStart ? DASHBOARD_START_PAGE : startPage}
            onChange={value =>
              value === DASHBOARD_START_PAGE
                ? setStartPagePref('')
                : saveStartPage(value)
            }
            options={[
              [DASHBOARD_START_PAGE, t('Dashboard')],
              ...availableItems.map(
                item => [item.id, itemDetails[item.id].title] as const,
              ),
            ]}
          />
        }
      />
    </SettingsGroup>
  );
}
