import type { ReactNode } from 'react';

import { Button } from '@actual-app/components/button';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { Link } from '#components/common/Link';

import { RAIL_WIDTH } from './layout';

type RailItemProps = {
  title: string;
  icon: ReactNode;
  isExpanded: boolean;
  badge?: ReactNode;
} & (
  | { to: string; isExactPathMatch?: boolean; onPress?: never }
  | { onPress: () => void; to?: never; isExactPathMatch?: never }
);

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: 36,
  margin: '1px 0',
  padding: 0,
  borderRadius: 0,
  textDecoration: 'none',
  color: theme.sidebarItemText,
  fontSize: 14,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  justifyContent: 'flex-start',
  ':hover': { backgroundColor: theme.sidebarItemBackgroundHover },
} as const;

export function RailItem({
  title,
  icon,
  isExpanded,
  badge,
  to,
  isExactPathMatch,
  onPress,
}: RailItemProps) {
  const content = (
    <>
      <View
        style={{
          width: RAIL_WIDTH,
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <Text
        style={{
          ...styles.ellipsisText,
          opacity: isExpanded ? 1 : 0,
          transition: 'opacity .15s',
          paddingRight: 12,
        }}
      >
        {title}
      </Text>
      {badge && isExpanded ? badge : null}
    </>
  );

  if (to != null) {
    return (
      <Link
        variant="internal"
        to={to}
        isExactPathMatch={isExactPathMatch}
        style={rowStyle}
        activeStyle={{
          color: theme.sidebarItemTextSelected,
          backgroundColor: theme.sidebarItemBackgroundHover,
        }}
      >
        <View
          aria-label={title}
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
        >
          {content}
        </View>
      </Link>
    );
  }

  return (
    <Button
      variant="bare"
      aria-label={title}
      onPress={onPress}
      style={{ ...rowStyle, width: '100%' }}
    >
      {content}
    </Button>
  );
}
