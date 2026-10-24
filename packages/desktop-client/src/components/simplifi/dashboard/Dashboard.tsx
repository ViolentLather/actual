import { useTranslation } from 'react-i18next';

import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from '@actual-app/core/shared/months';

import { Page } from '#components/Page';
import {
  buildGroupSpending,
  flattenToCategories,
} from '#components/simplifi/data/cashFlow';
import { useCashFlowData } from '#components/simplifi/data/useCashFlowData';
import { CARD_GAP, PAGE_BOTTOM_PADDING } from '#components/simplifi/layout';
import { TransferSuggestionsCard } from '#components/simplifi/transfers/TransferSuggestionsCard';
import { UncategorizedBanner } from '#components/simplifi/ui/UncategorizedBanner';
import { useSelector } from '#redux';

import { BillsCard } from './BillsCard';
import { CashFlowBarsCard } from './CashFlowBarsCard';
import { NetWorthCard } from './NetWorthCard';
import { RecentTransactionsCard } from './RecentTransactionsCard';
import { ThisMonthCard } from './ThisMonthCard';
import { TopCategoriesCard } from './TopCategoriesCard';

export function Dashboard() {
  const { t } = useTranslation();
  const userData = useSelector(state => state.user.data);
  const currentMonth = monthUtils.currentMonth();
  const cashFlow = useCashFlowData(currentMonth, 6);

  const categorySpending = flattenToCategories(
    buildGroupSpending(
      cashFlow.rows,
      new Set([currentMonth]),
      cashFlow.categories,
      cashFlow.groups,
      t('Uncategorized'),
    ),
  );

  const greeting = userData?.displayName
    ? t('Hello, {{name}}!', { name: userData.displayName })
    : t('Hello!');

  return (
    <Page header={t('Dashboard')}>
      <View
        data-testid="dashboard-page"
        style={{ gap: CARD_GAP, flexShrink: 0, ...PAGE_BOTTOM_PADDING }}
      >
        <Text style={{ fontSize: 18, fontWeight: 700, color: theme.pageText }}>
          {greeting} <span aria-hidden="true">👋</span>
        </Text>

        <UncategorizedBanner />
        <TransferSuggestionsCard />

        <View
          style={{
            display: 'grid',
            gap: CARD_GAP,
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            '@media (max-width: 1350px)': {
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            },
            '& > .span-2': { gridColumn: 'span 2' },
            '@media (max-width: 900px)': {
              gridTemplateColumns: 'minmax(0, 1fr)',
              '& > .span-2': { gridColumn: 'span 1' },
            },
          }}
        >
          <View className="span-2">
            <NetWorthCard />
          </View>
          <RecentTransactionsCard />
          <CashFlowBarsCard
            kind="income"
            monthly={cashFlow.monthly}
            color={theme.reportsGreen}
          />
          <CashFlowBarsCard
            kind="spending"
            monthly={cashFlow.monthly}
            color={theme.reportsBlue}
          />
          <BillsCard />
          <TopCategoriesCard groups={categorySpending} />
          <ThisMonthCard month={cashFlow.monthly.at(-1)} />
        </View>
      </View>
    </Page>
  );
}
