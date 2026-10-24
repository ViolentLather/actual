import type { AccountEntity } from '@actual-app/core/types/models';

const INVESTMENT_NAME_PATTERN =
  /\b(401\s?k|403\s?b|457\s?b?|ira|roth|hsa|brokerage|invest(ment|ments|ing)?|retirement|pension|stocks?|etf|index fund|vanguard|fidelity|schwab|e\*?trade|robinhood|merrill|tsp)\b/i;

/** Best guess at whether an account holds investments, based on its name. */
export function looksLikeInvestmentAccount(account: AccountEntity) {
  return !account.closed && INVESTMENT_NAME_PATTERN.test(account.name);
}

/** Parses the saved account id list; `null` when nothing was saved yet. */
export function parseInvestmentAccountIds(raw: string | undefined) {
  if (!raw) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : null;
  } catch {
    return null;
  }
}
