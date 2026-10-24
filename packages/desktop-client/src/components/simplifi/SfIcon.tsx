import type { ReactNode, SVGProps } from 'react';

// Thin outline icons used by the Simplifi-style navigation and cards.
// They inherit `currentColor` so they follow the surrounding text color.

const ICON_SHAPES = {
  dashboard: (
    <>
      <circle cx="7" cy="7" r="3" />
      <circle cx="17" cy="7" r="3" />
      <circle cx="7" cy="17" r="3" />
      <circle cx="17" cy="17" r="3" />
    </>
  ),
  transactions: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="4" />
      <path d="M14.5 9.5c-.4-.9-1.4-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1.1 1.6 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1.1 0-2.1-.6-2.5-1.5M12 6.5V8M12 16v1.5" />
    </>
  ),
  spending: (
    <>
      <path d="M6 8h12l1.2 11.2A1.6 1.6 0 0 1 17.6 21H6.4a1.6 1.6 0 0 1-1.6-1.8L6 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  ),
  netWorth: (
    <>
      <ellipse cx="9" cy="6" rx="5" ry="2.5" />
      <path d="M4 6v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V6" />
      <path d="M4 10v4c0 1.4 2.2 2.5 5 2.5" />
      <circle cx="16.5" cy="16.5" r="4.5" />
      <path d="M16.5 14.5v4M14.5 16.5h4" />
    </>
  ),
  plan: (
    <>
      <rect x="3" y="3" width="11" height="11" rx="2" />
      <path d="M10 10h9a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-9Z" />
      <path d="M6.5 8.5h4M15 15.5h3" />
    </>
  ),
  goals: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 12 19 5M16 5h3v3" />
    </>
  ),
  bills: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4M7.5 14h2M11 14h2M14.5 14h2M7.5 17.5h2M11 17.5h2" />
    </>
  ),
  planning: <path d="M12 3 4 21M12 3l8 18M7 15h10M12 3v4" />,
  reports: (
    <>
      <path d="M12 3a9 9 0 1 0 9 9h-9V3Z" />
      <path d="M15 3.5A9 9 0 0 1 20.5 9H15V3.5Z" />
    </>
  ),
  investments: (
    <>
      <path d="M4 20h16" />
      <rect x="5" y="13" width="3.5" height="7" rx="1" />
      <rect x="10.25" y="9" width="3.5" height="11" rx="1" />
      <rect x="15.5" y="4" width="3.5" height="16" rx="1" />
    </>
  ),
  payees: (
    <>
      <rect x="3" y="4" width="18" height="15" rx="3" />
      <path d="M7 9.5h6M7 13.5h4" />
      <circle cx="17" cy="15" r="3.5" />
      <path d="m19.5 17.5 2 2" />
    </>
  ),
  rules: (
    <>
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12.2V4a1 1 0 0 1 1-1h8.2a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.8l-7.4 7.4a2 2 0 0 1-2.8 0l-7.2-7.2a2 2 0 0 1-.4-1.6Z" />
      <circle cx="8" cy="8" r="1.5" />
    </>
  ),
  bank: <path d="M3 9.5 12 4l9 5.5M4.5 20h15M6 10v7M10 10v7M14 10v7M18 10v7" />,
  refresh: (
    <>
      <path d="M20 12a8 8 0 0 1-14.1 5.2M4 12a8 8 0 0 1 14.1-5.2" />
      <path d="M18.5 3v4h-4M5.5 21v-4h4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>
  ),
  plusCircle: (
    <>
      <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
      <path d="M12 8v8M8 12h8" stroke="var(--sf-icon-contrast, #1d1f24)" />
    </>
  ),
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  chevronUp: <path d="m6 15 6-6 6 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  trendUp: <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />,
  trendDown: <path d="m3 7 6 6 4-4 8 8M15 17h6v-6" />,
  calendarIn: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M4 9.5h16M8.5 3v4M15.5 3v4M9 14.5l2 2 4-4" />
    </>
  ),
  calendarOut: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M4 9.5h16M8.5 3v4M15.5 3v4M8 13h2M11 13h2M14 13h2M8 16.5h2M11 16.5h2" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </>
  ),
  more: (
    <>
      <circle cx="12" cy="5.5" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="18.5" r="1" fill="currentColor" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type SfIconName = keyof typeof ICON_SHAPES;

type SfIconProps = SVGProps<SVGSVGElement> & {
  name: SfIconName;
};

export function SfIcon({
  name,
  width = 20,
  height = 20,
  ...props
}: SfIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {ICON_SHAPES[name]}
    </svg>
  );
}
