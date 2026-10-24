import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from '@actual-app/core/shared/months';

import { Page } from '#components/Page';
import { categoryColor } from '#components/simplifi/charts/chartColors';
import { SfBarChart } from '#components/simplifi/charts/SfBarChart';
import {
  buildGroupSpending,
  buildMonthlyCashFlow,
  flattenToCategories,
} from '#components/simplifi/data/cashFlow';
import { getSpendingPeriods } from '#components/simplifi/data/spendingPeriods';
import type { SpendingInterval } from '#components/simplifi/data/spendingPeriods';
import { useAccountFilter } from '#components/simplifi/data/useAccountFilter';
import { useMonthlyCategoryTotals } from '#components/simplifi/data/useMonthlyCategoryTotals';
import { CARD_GAP, PAGE_BOTTOM_PADDING } from '#components/simplifi/layout';
import { AccountFilterButton } from '#components/simplifi/ui/AccountFilterButton';
import { SavingsRateBadge } from '#components/simplifi/ui/SavingsRateBadge';
import { SfAmount } from '#components/simplifi/ui/SfAmount';
import { SfCard } from '#components/simplifi/ui/SfCard';
import { SfSegmented } from '#components/simplifi/ui/SfSegmented';
import { UncategorizedBanner } from '#components/simplifi/ui/UncategorizedBanner';
import { useCategories } from '#hooks/useCategories';
import { useDateFormat } from '#hooks/useDateFormat';
import { useLocale } from '#hooks/useLocale';

import { CategoryComparisonRow } from './CategoryComparisonRow';
import { SpendingStatTile } from './SpendingStatTile';

export function SpendingPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const dateFormat = useDateFormat() || 'MM/dd/yyyy';
  const [interval, setSpendingInterval] = useState<SpendingInterval>('month');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [differenceMode, setDifferenceMode] = useState<'percent' | 'amount'>(
    'percent',
  );
  const [breakdownBy, setBreakdownBy] = useState<'categories' | 'groups'>(
    'categories',
  );
  const [expandedGroups, setExpandedGroups] = useState<ReadonlySet<string>>(
    new Set(),
  );

  const periods = getSpendingPeriods(interval, locale);
  const firstMonth = periods[0].months[0];
  const lastMonth = periods[periods.length - 1].months.at(-1) ?? firstMonth;
  const { selectedIds } = useAccountFilter();
  const totals = useMonthlyCategoryTotals(firstMonth, lastMonth, selectedIds);
  const { data: categoryData } = useCategories();
  const categories = categoryData?.list ?? [];
  const groups = categoryData?.grouped ?? [];
  const rows = totals.data ?? [];

  const selectedIndex = Math.max(
    0,
    periods.findIndex(period => period.key === selectedKey),
  );
  const selected =
    periods[selectedKey == null ? periods.length - 1 : selectedIndex];
  const previous = periods[periods.indexOf(selected) - 1] ?? null;

  const monthly = buildMonthlyCashFlow(
    rows,
    monthUtils.rangeInclusive(firstMonth, lastMonth),
    categories,
  );
  const sumFor = (months: string[], key: 'income' | 'spending') =>
    monthly
      .filter(entry => months.includes(entry.month))
      .reduce((sum, entry) => sum + entry[key], 0);

  const income = sumFor(selected.months, 'income');
  const spent = sumFor(selected.months, 'spending');
  const remaining = income - spent;
  const savingsRate = income > 0 ? (remaining / income) * 100 : null;

  const toRows = (months: string[]) => {
    const spending = buildGroupSpending(
      rows,
      new Set(months),
      categories,
      groups,
      t('Uncategorized'),
    );
    return breakdownBy === 'groups' ? spending : flattenToCategories(spending);
  };
  const currentGroups = toRows(selected.months);
  const previousGroups = previous ? toRows(previous.months) : [];
  const isExpandable = breakdownBy === 'groups';
  const previousById = new Map(previousGroups.map(g => [g.id, g]));
  const comparisonMax = Math.max(
    1,
    ...currentGroups.map(g => g.amount),
    ...previousGroups.map(g => g.amount),
  );

  const chartData = periods.map(period => ({
    key: period.key,
    label: period.isCurrent ? `${period.shortLabel}*` : period.shortLabel,
    value: Math.max(0, sumFor(period.months, 'spending')),
    isHighlighted: period.key === selected.key,
  }));

  const toggleGroup = (id: string) => {
    const next = new Set(expandedGroups);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedGroups(next);
  };

  return (
    <Page header={t('Spending')}>
      <View
        data-testid="spending-page"
        style={{ gap: CARD_GAP, flexShrink: 0, ...PAGE_BOTTOM_PADDING }}
      >
        <SfCard bodyStyle={{ padding: '14px 18px' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <Text style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
              <Trans>View spend by:</Trans>
            </Text>
            <SfSegmented
              ariaLabel={t('Spending interval')}
              value={interval}
              onChange={value => {
                setSpendingInterval(value);
                setSelectedKey(null);
              }}
              options={[
                { value: 'month', label: t('Month') },
                { value: 'quarter', label: t('Quarter') },
                { value: 'year', label: t('Year') },
              ]}
            />
            <View style={{ flex: 1 }} />
            <AccountFilterButton />
          </View>
        </SfCard>

        <SfCard
          testId="spending-chart"
          title={selected.longLabel}
          subtitle={`${monthUtils.format(selected.start, dateFormat, locale)} - ${monthUtils.format(selected.end, dateFormat, locale)}${selected.isCurrent ? '*' : ''}`}
        >
          <SfBarChart
            data={chartData}
            height={200}
            color={theme.reportsBlue}
            mutedColor={theme.pillBackgroundSelected}
            barSize={interval === 'month' ? 70 : 90}
            renderTooltipValue={value => <SfAmount value={value} />}
            onBarClick={datum => setSelectedKey(datum.key)}
          />
        </SfCard>

        <View
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: CARD_GAP,
            '@media (max-width: 1000px)': {
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            },
          }}
        >
          <SpendingStatTile label={t('Income')}>
            <SfAmount value={income} colorize />
          </SpendingStatTile>
          <SpendingStatTile label={t('Total spent')}>
            <SfAmount value={spent} />
          </SpendingStatTile>
          <SpendingStatTile label={t('Remaining')}>
            <SfAmount value={remaining} />
          </SpendingStatTile>
          <SpendingStatTile label={t('Savings rate')}>
            {savingsRate == null ? (
              <Text>—</Text>
            ) : (
              <>
                <Text>{savingsRate.toFixed(1)}%</Text>
                <SavingsRateBadge rate={savingsRate} />
              </>
            )}
          </SpendingStatTile>
        </View>

        <SfCard testId="spending-categories" bodyStyle={{ padding: 0 }}>
          <UncategorizedBanner style={{ margin: '16px 16px 0' }} />

          <View
            style={{
              display: 'grid',
              gridTemplateColumns: '200px minmax(0, 1fr) 190px',
              '@media (max-width: 640px)': {
                gridTemplateColumns: 'minmax(0, 1fr)',
              },
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              borderBottom: `1px solid ${theme.tableBorder}`,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            <SfSegmented
              ariaLabel={t('Break down spending by')}
              value={breakdownBy}
              onChange={setBreakdownBy}
              options={[
                { value: 'categories', label: t('Categories') },
                { value: 'groups', label: t('Groups') },
              ]}
            />
            <Text>
              {previous ? (
                <Trans>Spend vs. {{ period: previous.longLabel }}</Trans>
              ) : (
                <Trans>Spend</Trans>
              )}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 6,
              }}
            >
              <Text>
                <Trans>Difference</Trans>
              </Text>
              <SfSegmented
                ariaLabel={t('Difference units')}
                value={differenceMode}
                onChange={setDifferenceMode}
                options={[
                  { value: 'percent', label: '%' },
                  { value: 'amount', label: '$' },
                ]}
              />
            </View>
          </View>

          {currentGroups.length === 0 && (
            <Text style={{ padding: 24, color: theme.pageTextSubdued }}>
              <Trans>No spending in this period.</Trans>
            </Text>
          )}
          {currentGroups.map((group, index) => {
            const color = categoryColor(index);
            const previousGroup = previousById.get(group.id);
            const isExpanded = expandedGroups.has(group.id);
            return (
              <View key={group.id}>
                <View
                  role={isExpandable ? 'button' : undefined}
                  tabIndex={isExpandable ? 0 : undefined}
                  aria-expanded={isExpandable ? isExpanded : undefined}
                  onClick={
                    isExpandable ? () => toggleGroup(group.id) : undefined
                  }
                  onKeyDown={event => {
                    if (
                      isExpandable &&
                      (event.key === 'Enter' || event.key === ' ')
                    ) {
                      event.preventDefault();
                      toggleGroup(group.id);
                    }
                  }}
                  style={
                    isExpandable
                      ? {
                          cursor: 'pointer',
                          ':hover': {
                            backgroundColor: theme.tableRowBackgroundHover,
                          },
                        }
                      : undefined
                  }
                >
                  <CategoryComparisonRow
                    name={group.name}
                    current={group.amount}
                    previous={previousGroup?.amount ?? 0}
                    max={comparisonMax}
                    color={color}
                    differenceMode={differenceMode}
                  />
                </View>
                {isExpanded &&
                  group.categories.map(category => (
                    <CategoryComparisonRow
                      key={category.id}
                      name={category.name}
                      current={category.amount}
                      previous={
                        previousGroup?.categories.find(
                          c => c.id === category.id,
                        )?.amount ?? 0
                      }
                      max={comparisonMax}
                      color={color}
                      differenceMode={differenceMode}
                      isNested
                    />
                  ))}
              </View>
            );
          })}
        </SfCard>
      </View>
    </Page>
  );
}
