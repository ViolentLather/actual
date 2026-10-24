import { theme } from '@actual-app/components/theme';

type CashFlowDotProps = {
  cx?: number;
  cy?: number;
  payload?: { kind: 'income' | 'expense' | 'today' | null };
};

/** Marker for days with scheduled income, bills, or today's balance. */
export function CashFlowDot({ cx, cy, payload }: CashFlowDotProps) {
  if (cx == null || cy == null || !payload?.kind) {
    return null;
  }

  if (payload.kind === 'income') {
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill={theme.reportsGreen} />
        <text
          x={cx}
          y={cy + 3.5}
          textAnchor="middle"
          fontSize={10}
          fontWeight={700}
          fill={theme.cardBackground}
        >
          $
        </text>
      </g>
    );
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={5.5}
      fill={theme.pageTextLink}
      stroke={theme.cardBackground}
      strokeWidth={2}
    />
  );
}
