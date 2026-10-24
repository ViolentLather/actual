import { describe, expect, it } from 'vitest';

import { findTransferPairs, getTransferPairKey } from './transferMatching';

function tx(id: string, account: string, amount: number, date: string) {
  return { id, account, amount, date };
}

describe('findTransferPairs', () => {
  it('pairs opposite amounts in different accounts within the window', () => {
    const pairs = findTransferPairs([
      tx('out', 'checking', -50000, '2026-10-01'),
      tx('in', 'card', 50000, '2026-10-03'),
    ]);

    expect(pairs).toEqual([
      {
        key: getTransferPairKey('out', 'in'),
        from: tx('out', 'checking', -50000, '2026-10-01'),
        to: tx('in', 'card', 50000, '2026-10-03'),
      },
    ]);
  });

  it('ignores matches in the same account or too far apart', () => {
    expect(
      findTransferPairs([
        tx('out', 'checking', -50000, '2026-10-01'),
        tx('same', 'checking', 50000, '2026-10-01'),
        tx('late', 'card', 50000, '2026-10-20'),
      ]),
    ).toEqual([]);
  });

  it('uses each transaction once and prefers the closest date', () => {
    const pairs = findTransferPairs([
      tx('out1', 'checking', -2500, '2026-10-01'),
      tx('out2', 'checking', -2500, '2026-10-05'),
      tx('in-far', 'card', 2500, '2026-10-04'),
      tx('in-near', 'savings', 2500, '2026-10-02'),
    ]);

    expect(pairs.map(pair => [pair.from.id, pair.to.id])).toEqual([
      ['out1', 'in-near'],
      ['out2', 'in-far'],
    ]);
  });

  it('skips ignored pairs', () => {
    const pairs = findTransferPairs(
      [
        tx('out', 'checking', -100, '2026-10-01'),
        tx('in', 'card', 100, '2026-10-01'),
      ],
      new Set([getTransferPairKey('in', 'out')]),
    );

    expect(pairs).toEqual([]);
  });
});
