import { tokens } from '@actual-app/components/tokens';

export const RAIL_WIDTH = 56;
export const RAIL_EXPANDED_WIDTH = 232;
export const HEADER_HEIGHT = 64;
export const ACCOUNTS_PANEL_WIDTH = 300;
export const CARD_RADIUS = 10;
export const CARD_GAP = 16;

/** Bottom padding that keeps content clear of the mobile navigation. */
export const PAGE_BOTTOM_PADDING = {
  paddingBottom: 32,
  [`@media (max-width: ${tokens.breakpoint_small})`]: {
    paddingBottom: 150,
  },
};
