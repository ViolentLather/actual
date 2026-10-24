import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { keyframes } from '@emotion/css';
import { useDebounceCallback } from 'usehooks-ts';

import { sync } from '#app/appSlice';
import { EditableBudgetName } from '#components/sidebar/BudgetName';
import { getSidebarMenuItemPath } from '#components/sidebar/sidebarMenu';
import { useSidebarMenuItemDetails } from '#components/sidebar/useSidebarMenuItemDetails';
import { useSidebarMenu } from '#hooks/useSidebarMenu';
import { useSyncedPref } from '#hooks/useSyncedPref';
import { useSyncStatus } from '#hooks/useSyncStatus';
import { useDispatch } from '#redux';

import { RAIL_EXPANDED_WIDTH, RAIL_WIDTH } from './layout';
import { getExtraRailIcon, getPrimaryRailItems } from './navigation';
import { RailDivider } from './RailDivider';
import { RailItem } from './RailItem';
import { SfIcon } from './SfIcon';
import { SfLogo } from './SfLogo';

const spin = keyframes({
  '0%': { transform: 'rotateZ(0deg)' },
  '100%': { transform: 'rotateZ(360deg)' },
});

export function AppRail() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const { sidebarItems } = useSidebarMenu();
  const itemDetails = useSidebarMenuItemDetails();
  const { isSyncing } = useSyncStatus({ syncingEndDelayMs: 200 });

  const collapse = useDebounceCallback(() => setIsExpanded(false), 150);
  const expand = () => {
    collapse.cancel();
    setIsExpanded(true);
  };

  const [showSpendingPlanPref] = useSyncedPref('simplifi.show-spending-plan');
  const sections = getPrimaryRailItems(t)
    .map(section =>
      section.filter(
        item => item.id !== 'budget' || showSpendingPlanPref === 'true',
      ),
    )
    .filter(section => section.length > 0);
  const extraItems = sidebarItems.filter(
    item => getExtraRailIcon(item.id) != null,
  );

  return (
    <View
      style={{
        width: RAIL_WIDTH,
        flexShrink: 0,
        position: 'relative',
        zIndex: 1002,
      }}
    >
      <View
        role="navigation"
        aria-label={t('Main navigation')}
        data-testid="sidebar"
        onMouseEnter={expand}
        onMouseLeave={() => collapse()}
        onFocus={expand}
        onBlur={() => collapse()}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: isExpanded ? RAIL_EXPANDED_WIDTH : RAIL_WIDTH,
          overflow: 'hidden',
          backgroundColor: theme.sidebarBackground,
          borderRight: `1px solid ${theme.sidebarBorder}`,
          boxShadow: isExpanded ? '8px 0 24px rgba(0, 0, 0, 0.35)' : 'none',
          transition: 'width .18s ease, box-shadow .18s ease',
          color: theme.sidebarItemText,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 64,
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          <View
            style={{
              width: RAIL_WIDTH,
              flexShrink: 0,
              alignItems: 'center',
            }}
          >
            <SfLogo width={30} height={30} />
          </View>
          <View
            style={{
              minWidth: 0,
              flex: 1,
              opacity: isExpanded ? 1 : 0,
              transition: 'opacity .15s',
              pointerEvents: isExpanded ? 'auto' : 'none',
            }}
          >
            <EditableBudgetName />
          </View>
        </View>

        <View style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {sections.map((section, index) => (
            <Fragment key={section[0].id}>
              {index > 0 && <RailDivider />}
              {section.map(item => (
                <RailItem
                  key={item.id}
                  title={item.title}
                  to={item.to}
                  isExactPathMatch={item.isExactPathMatch}
                  isExpanded={isExpanded}
                  icon={<SfIcon name={item.icon} width={19} height={19} />}
                />
              ))}
            </Fragment>
          ))}

          {extraItems.length > 0 && <RailDivider />}
          {extraItems.map(item => {
            const icon = getExtraRailIcon(item.id);
            return icon ? (
              <RailItem
                key={item.id}
                title={itemDetails[item.id].title}
                to={getSidebarMenuItemPath(item.id, true)}
                isExpanded={isExpanded}
                icon={<SfIcon name={icon} width={19} height={19} />}
              />
            ) : null;
          })}
        </View>

        <RailDivider />
        <View style={{ flexShrink: 0, paddingBottom: 10 }}>
          <RailItem
            title={t('Refresh')}
            isExpanded={isExpanded}
            onPress={() => void dispatch(sync())}
            icon={
              <View
                style={{
                  animation: isSyncing
                    ? `${spin} 1s infinite linear`
                    : undefined,
                }}
              >
                <SfIcon name="refresh" width={18} height={18} />
              </View>
            }
          />
        </View>
      </View>
    </View>
  );
}
