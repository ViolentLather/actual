import type { AccountEntity } from '@actual-app/core/types/models';
import { describe, expect, it } from 'vitest';

import {
  looksLikeInvestmentAccount,
  parseInvestmentAccountIds,
} from './investmentAccounts';

function account(name: string, closed: 0 | 1 = 0) {
  return { id: name, name, closed } as AccountEntity;
}

describe('looksLikeInvestmentAccount', () => {
  it('recognizes common retirement and brokerage names', () => {
    for (const name of [
      '401K - Ray',
      'Roth IRA - Grace',
      'Vanguard Brokerage',
      'Fidelity HSA',
      '457B - Ray',
      'Pension - Ray',
    ]) {
      expect(looksLikeInvestmentAccount(account(name))).toBe(true);
    }
  });

  it('ignores everyday and closed accounts', () => {
    expect(looksLikeInvestmentAccount(account('Flagship Checking'))).toBe(
      false,
    );
    expect(looksLikeInvestmentAccount(account('CC - Amazon'))).toBe(false);
    expect(looksLikeInvestmentAccount(account('Old 401k', 1))).toBe(false);
  });
});

describe('parseInvestmentAccountIds', () => {
  it('returns null when unset or invalid', () => {
    expect(parseInvestmentAccountIds(undefined)).toBe(null);
    expect(parseInvestmentAccountIds('nope')).toBe(null);
  });

  it('keeps string ids', () => {
    expect(parseInvestmentAccountIds('["a", 1, "b"]')).toEqual(['a', 'b']);
  });
});
