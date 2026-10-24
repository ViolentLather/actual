import { getColorScale } from '#components/reports/chart-theme';

const CATEGORY_COLORS = getColorScale('qualitative');

/** Category color by rank, matching the qualitative chart palette. */
export function categoryColor(index: number) {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}
