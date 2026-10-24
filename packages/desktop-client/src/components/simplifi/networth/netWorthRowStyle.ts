import { css } from '@emotion/css';

/**
 * Grid for net worth rows: chevron, name, change and balance. The change
 * column (marked with the `nw-change` class) is dropped on narrow screens.
 */
export const netWorthRowStyle = {
  display: 'grid',
  gridTemplateColumns: '20px minmax(0, 1.2fr) minmax(0, 1.5fr) auto',
  alignItems: 'center',
  gap: 12,
  '@media (max-width: 640px)': {
    gridTemplateColumns: '20px minmax(0, 1fr) auto',
    '& > .nw-change': { display: 'none' },
  },
};

export const netWorthRowClassName = css(netWorthRowStyle);
