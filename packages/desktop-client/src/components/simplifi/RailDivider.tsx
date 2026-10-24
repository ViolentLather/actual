import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

export function RailDivider() {
  return (
    <View
      style={{
        height: 1,
        margin: '8px 12px',
        backgroundColor: theme.sidebarBorder,
        flexShrink: 0,
      }}
    />
  );
}
