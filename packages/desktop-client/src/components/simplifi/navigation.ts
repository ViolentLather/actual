import type { TFunction } from 'i18next';

import type { SidebarMenuItemId } from '#components/sidebar/sidebarMenu';

import type { SfIconName } from './SfIcon';

export type RailNavItem = {
  id: string;
  title: string;
  icon: SfIconName;
  to: string;
  isExactPathMatch?: boolean;
};

export function getPrimaryRailItems(t: TFunction): RailNavItem[][] {
  return [
    [
      {
        id: 'dashboard',
        title: t('Dashboard'),
        icon: 'dashboard',
        to: '/dashboard',
      },
      {
        id: 'transactions',
        title: t('Transactions'),
        icon: 'transactions',
        to: '/accounts',
      },
      {
        id: 'spending',
        title: t('Spending'),
        icon: 'spending',
        to: '/spending',
      },
      {
        id: 'net-worth',
        title: t('Net Worth'),
        icon: 'netWorth',
        to: '/net-worth',
      },
    ],
    [
      { id: 'budget', title: t('Spending Plan'), icon: 'plan', to: '/budget' },
      {
        id: 'schedules',
        title: t('Bills & Income'),
        icon: 'bills',
        to: '/schedules',
      },
    ],
    [{ id: 'reports', title: t('Reports'), icon: 'reports', to: '/reports' }],
  ];
}

// Menu items from the configurable sidebar menu that are not already part of
// the fixed primary navigation above.
const EXTRA_ITEM_ICONS: Partial<Record<SidebarMenuItemId, SfIconName>> = {
  payees: 'payees',
  tags: 'tag',
  rules: 'rules',
  'bank-sync': 'bank',
};

export function getExtraRailIcon(id: SidebarMenuItemId): SfIconName | null {
  return EXTRA_ITEM_ICONS[id] ?? null;
}

/**
 * Title shown in the app header for the current route when the page does not
 * register its own.
 */
export function getRouteTitle(pathname: string, t: TFunction): string {
  const routes: Array<[string, string]> = [
    ['/dashboard', t('Dashboard')],
    ['/accounts', t('Transactions')],
    ['/categories', t('Transactions')],
    ['/spending', t('Spending')],
    ['/net-worth', t('Net Worth')],
    ['/budget', t('Spending Plan')],
    ['/schedules', t('Bills & Income')],
    ['/reports', t('Reports')],
    ['/payees', t('Payees')],
    ['/rules', t('Rules')],
    ['/tags', t('Tags')],
    ['/bank-sync', t('Bank Sync')],
    ['/settings', t('Settings')],
    ['/notifications', t('Notifications')],
    ['/user-directory', t('User Directory')],
    ['/user-access', t('User Access')],
  ];

  const match = routes.find(
    ([path]) => pathname === path || pathname.startsWith(path + '/'),
  );
  return match ? match[1] : '';
}

/** Routes that show the accounts panel next to the page content. */
export function showsAccountsPanel(pathname: string) {
  return (
    pathname === '/dashboard' ||
    pathname === '/accounts' ||
    pathname.startsWith('/accounts/')
  );
}
