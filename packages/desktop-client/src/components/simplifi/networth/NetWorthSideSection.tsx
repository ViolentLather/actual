import { useState } from 'react';

import { Button } from '@actual-app/components/button';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import type { NetWorthSide } from '#components/simplifi/data/netWorthBreakdown';
import { SfIcon } from '#components/simplifi/SfIcon';
import { SfAmount } from '#components/simplifi/ui/SfAmount';
import { SfChange } from '#components/simplifi/ui/SfChange';

import { NetWorthAccountGroup } from './NetWorthAccountGroup';

type NetWorthSideSectionProps = {
  title: string;
  side: NetWorthSide;
  changeLabel: string;
};

export function NetWorthSideSection({
  title,
  side,
  changeLabel,
}: NetWorthSideSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <View
      style={{
        border: `1px solid ${theme.tableBorder}`,
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <Button
        variant="bare"
        aria-expanded={isOpen}
        onPress={() => setIsOpen(!isOpen)}
        style={{
          display: 'grid',
          gridTemplateColumns: '20px minmax(0, 1.2fr) minmax(0, 1.5fr) auto',
          alignItems: 'center',
          gap: 12,
          padding: '16px',
          borderRadius: 0,
          width: '100%',
          textAlign: 'left',
        }}
      >
        <SfIcon
          name={isOpen ? 'chevronDown' : 'chevronRight'}
          width={14}
          height={14}
        />
        <View style={{ fontSize: 16, fontWeight: 700 }}>{title}</View>
        <SfChange
          change={side.change}
          base={side.balance - side.change}
          label={changeLabel}
          size="small"
        />
        <SfAmount value={side.balance} style={{ fontWeight: 700 }} />
      </Button>
      {isOpen && (
        <View style={{ padding: '0 16px 16px', gap: 10 }}>
          {side.groups.map(group => (
            <NetWorthAccountGroup
              key={group.id}
              group={group}
              changeLabel={changeLabel}
            />
          ))}
        </View>
      )}
    </View>
  );
}
