import React, { useCallback, useState } from 'react';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { animated, config, useSpring } from 'react-spring';

import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { SvgAdd, SvgCog } from '@actual-app/components/icons/v1';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { useDrag } from '@use-gesture/react';

import { SfIcon } from '#components/simplifi/SfIcon';
import { useIsTestEnv } from '#hooks/useIsTestEnv';
import { useScrollListener } from '#hooks/useScrollListener';
import { useSyncedPref } from '#hooks/useSyncedPref';

const COLUMN_COUNT = 3;
const PILL_HEIGHT = 15;
const ROW_HEIGHT = 70;
const OPEN_FULL_Y = 1;

export const MOBILE_NAV_HEIGHT = ROW_HEIGHT + PILL_HEIGHT;

export function MobileNavTabs() {
  const { t } = useTranslation();
  const { isNarrowWidth } = useResponsive();
  const isTestEnv = useIsTestEnv();
  const [navbarState, setNavbarState] = useState<'default' | 'open' | 'hidden'>(
    'default',
  );
  const [showSpendingPlanPref] = useSyncedPref('simplifi.show-spending-plan');
  const showSpendingPlan = showSpendingPlanPref === 'true';
  // The first row is always visible; drag the sheet up to see the rest.
  const rowCount = showSpendingPlan ? 4 : 3;
  const totalHeight = ROW_HEIGHT * rowCount;
  const openDefaultY = totalHeight - ROW_HEIGHT;
  const hiddenY = totalHeight;

  const navTabStyle = {
    flex: `1 1 ${100 / COLUMN_COUNT}%`,
    height: ROW_HEIGHT,
    padding: 10,
    maxWidth: `${100 / COLUMN_COUNT}%`,
  };

  const [{ y }, api] = useSpring(() => ({ from: { y: openDefaultY } }), []);

  const openFull = useCallback(
    ({ canceled }: { canceled?: boolean }) => {
      // when cancel is true, it means that the user passed the upwards threshold
      // so we change the spring config to create a nice wobbly effect
      setNavbarState('open');
      void api.start({
        to: { y: OPEN_FULL_Y },
        immediate: isTestEnv,
        config: canceled ? config.wobbly : config.stiff,
      });
    },
    [api, isTestEnv],
  );

  const openDefault = useCallback(
    (velocity = 0) => {
      setNavbarState('default');
      void api.start({
        to: { y: openDefaultY },
        immediate: isTestEnv,
        config: { ...config.stiff, velocity },
      });
    },
    [api, isTestEnv, openDefaultY],
  );

  const hide = useCallback(
    (velocity = 0) => {
      setNavbarState('hidden');
      void api.start({
        to: { y: hiddenY },
        immediate: isTestEnv,
        config: { ...config.stiff, velocity },
      });
    },
    [api, isTestEnv, hiddenY],
  );

  const iconProps = { width: 22, height: 22, style: { minHeight: 22 } };
  const navTabs = [
    {
      name: t('Dashboard'),
      path: '/dashboard',
      icon: <SfIcon name="dashboard" {...iconProps} />,
    },
    {
      name: t('Transaction'),
      path: '/transactions/new',
      icon: <SvgAdd {...iconProps} />,
    },
    {
      name: t('Accounts'),
      path: '/accounts',
      icon: <SfIcon name="transactions" {...iconProps} />,
    },
    {
      name: t('Spending'),
      path: '/spending',
      icon: <SfIcon name="spending" {...iconProps} />,
    },
    {
      name: t('Net Worth'),
      path: '/net-worth',
      icon: <SfIcon name="netWorth" {...iconProps} />,
    },
    {
      name: t('Bills & Income'),
      path: '/schedules',
      icon: <SfIcon name="bills" {...iconProps} />,
    },
    {
      name: t('Investments'),
      path: '/investments',
      icon: <SfIcon name="investments" {...iconProps} />,
    },
    {
      name: t('Reports'),
      path: '/reports',
      icon: <SfIcon name="reports" {...iconProps} />,
    },
    {
      name: t('Settings'),
      path: '/settings',
      icon: <SvgCog {...iconProps} />,
    },
    ...(showSpendingPlan
      ? [
          {
            name: t('Spending Plan'),
            path: '/budget',
            icon: <SfIcon name="plan" {...iconProps} />,
          },
        ]
      : []),
  ].map(tab => (
    <NavTab
      key={tab.path}
      style={navTabStyle}
      onClick={() => openDefault()}
      {...tab}
    />
  ));

  useScrollListener(
    useCallback(
      ({ isScrolling, hasScrolledToEnd }) => {
        if (isScrolling('down') && !hasScrolledToEnd('up')) {
          hide();
        } else if (isScrolling('up') && !hasScrolledToEnd('down')) {
          openDefault();
        }
      },
      [hide, openDefault],
    ),
  );

  const bind = useDrag(
    ({
      last,
      velocity: [, vy],
      direction: [, dy],
      offset: [, oy],
      cancel,
      canceled,
    }) => {
      // if the user drags up passed a threshold, then we cancel
      // the drag so that the sheet resets to its open position
      if (oy < 0) {
        cancel();
      }

      // when the user releases the sheet, we check whether it passed
      // the threshold for it to close, or if we reset it to its open position
      if (last) {
        if (oy > ROW_HEIGHT * 0.5 || (vy > 0.5 && dy > 0)) {
          openDefault(vy);
        } else {
          openFull({ canceled });
        }
      } else {
        // when the user keeps dragging, we just move the sheet according to
        // the cursor position
        void api.start({ to: { y: oy }, immediate: true });
      }
    },
    {
      from: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: -totalHeight, bottom: totalHeight - ROW_HEIGHT },
      axis: 'y',
      rubberband: true,
    },
  );

  return (
    <animated.div
      role="navigation"
      {...bind()}
      style={{
        y,
        touchAction: 'pan-x',
        backgroundColor: theme.mobileNavBackground,
        borderTop: `1px solid ${theme.menuBorder}`,
        ...styles.shadow,
        height: totalHeight + PILL_HEIGHT,
        width: '100%',
        position: 'fixed',
        zIndex: 100,
        bottom: 0,
        ...(!isNarrowWidth && { display: 'none' }),
      }}
      data-navbar-state={navbarState}
    >
      <View>
        <div
          style={{
            backgroundColor: theme.pillBorder,
            borderRadius: 10,
            width: 30,
            marginTop: 5,
            marginBottom: 5,
            padding: 2,
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            height: totalHeight,
            width: '100%',
          }}
        >
          {navTabs}
        </View>
      </View>
    </animated.div>
  );
}

type NavTabProps = {
  name: string;
  path: string;
  icon: ReactNode;
  style?: CSSProperties;
  onClick: ComponentProps<typeof NavLink>['onClick'];
};

function NavTab({ icon, name, path, style, onClick }: NavTabProps) {
  return (
    <NavLink
      to={path}
      style={({ isActive }) => ({
        ...styles.noTapHighlight,
        alignItems: 'center',
        color: isActive ? theme.mobileNavItemSelected : theme.mobileNavItem,
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        textAlign: 'center',
        textWrap: 'balance',
        userSelect: 'none',
        ...style,
      })}
      onClick={onClick}
    >
      {icon}
      {name}
    </NavLink>
  );
}
