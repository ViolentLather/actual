/**
 * Transactions whose notes contain this tag are left out of the Simplifi-style
 * income and spending totals (they still count toward account balances).
 */
export const EXCLUDE_TAG = '#exclude';

const EXCLUDE_TAG_PATTERN = /(^|\s)#exclude(?=\s|$)/i;

export function isExcludedFromReports(notes: string | null | undefined) {
  return notes != null && EXCLUDE_TAG_PATTERN.test(notes);
}

/** Adds or removes the exclusion tag, leaving the rest of the notes intact. */
export function setExcludedFromReports(
  notes: string | null | undefined,
  isExcluded: boolean,
): string {
  const current = notes ?? '';
  if (isExcluded) {
    return isExcludedFromReports(current)
      ? current
      : `${current} ${EXCLUDE_TAG}`.trim();
  }
  const stripped = current
    .replace(new RegExp(EXCLUDE_TAG_PATTERN.source, 'gi'), '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return stripped;
}

/** AQL filter that keeps only transactions not excluded from reports. */
export const notExcludedFilter = {
  $or: [{ notes: null }, { notes: { $notlike: `%${EXCLUDE_TAG}%` } }],
};
