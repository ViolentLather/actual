import { Navigate } from 'react-router';

import { useResponsive } from '@actual-app/components/hooks/useResponsive';

import { useSidebarMenu } from '#hooks/useSidebarMenu';
import { useSyncedPref } from '#hooks/useSyncedPref';

export function StartPageRedirect() {
  const { isNarrowWidth } = useResponsive();
  const { startPath } = useSidebarMenu();
  const [startPagePref] = useSyncedPref('sidebar-start-page');

  // Open on the dashboard unless a start page was explicitly chosen (on
  // desktop; the sidebar start page setting isn't available on mobile).
  return (
    <Navigate
      to={!isNarrowWidth && startPagePref ? startPath : '/dashboard'}
      replace
    />
  );
}
