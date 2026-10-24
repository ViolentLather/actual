import { Navigate } from 'react-router';

import { useResponsive } from '@actual-app/components/hooks/useResponsive';

import { useSidebarMenu } from '#hooks/useSidebarMenu';
import { useSyncedPref } from '#hooks/useSyncedPref';

export function StartPageRedirect() {
  const { isNarrowWidth } = useResponsive();
  const { startPath } = useSidebarMenu();
  const [startPagePref] = useSyncedPref('sidebar-start-page');

  if (isNarrowWidth) {
    return <Navigate to="/budget" replace />;
  }

  // Open on the dashboard unless a start page was explicitly chosen.
  return <Navigate to={startPagePref ? startPath : '/dashboard'} replace />;
}
