import { describe, expect, it } from 'vitest';

import { isExcludedFromReports, setExcludedFromReports } from './exclusion';

describe('report exclusion tag', () => {
  it('detects the tag as a separate word', () => {
    expect(isExcludedFromReports('Reimbursed #exclude')).toBe(true);
    expect(isExcludedFromReports('#exclude')).toBe(true);
    expect(isExcludedFromReports('#excluded later')).toBe(false);
    expect(isExcludedFromReports(null)).toBe(false);
  });

  it('adds the tag once', () => {
    expect(setExcludedFromReports(null, true)).toBe('#exclude');
    expect(setExcludedFromReports('Gift', true)).toBe('Gift #exclude');
    expect(setExcludedFromReports('Gift #exclude', true)).toBe('Gift #exclude');
  });

  it('removes the tag and keeps other notes', () => {
    expect(setExcludedFromReports('Gift #exclude', false)).toBe('Gift');
    expect(setExcludedFromReports('#exclude', false)).toBe('');
    expect(setExcludedFromReports('a #exclude b', false)).toBe('a b');
  });
});
