import { useMemo } from 'react';

import { q } from '@actual-app/core/shared/query';
import { getScheduledAmount } from '@actual-app/core/shared/schedules';
import type { ScheduleStatusType } from '@actual-app/core/shared/schedules';

import { useAccounts } from '#hooks/useAccounts';
import { usePayeesById } from '#hooks/usePayees';
import { useSchedules } from '#hooks/useSchedules';

export type Reminder = {
  id: string;
  name: string;
  date: string;
  amount: number;
  accountId: string | null;
  accountName: string | null;
  status: ScheduleStatusType;
};

const HIDDEN_STATUSES: ReadonlySet<ScheduleStatusType> = new Set([
  'paid',
  'completed',
]);

/**
 * Upcoming and overdue scheduled transactions (Simplifi's "reminders"),
 * soonest first. Pass an account id to only include that account's.
 */
export function useUpcomingReminders(accountId?: string) {
  const schedulesQuery = useMemo(() => q('schedules').select('*'), []);
  const { schedules, statuses, isLoading } = useSchedules({
    query: schedulesQuery,
  });
  const { data: payeesById = {} } = usePayeesById();
  const { data: accounts = [] } = useAccounts();
  const accountsById = new Map(accounts.map(a => [a.id, a]));

  const reminders: Reminder[] = schedules
    .filter(schedule => !schedule.completed && schedule.next_date)
    .filter(schedule => !accountId || schedule._account === accountId)
    .map(schedule => {
      const payee = schedule._payee ? payeesById[schedule._payee] : null;
      const account = schedule._account
        ? accountsById.get(schedule._account)
        : null;
      return {
        id: schedule.id,
        name: schedule.name || payee?.name || '',
        date: schedule.next_date,
        amount: getScheduledAmount(schedule._amount),
        accountId: schedule._account ?? null,
        accountName: account?.name ?? null,
        status: statuses.get(schedule.id) ?? 'scheduled',
      };
    })
    .filter(reminder => !HIDDEN_STATUSES.has(reminder.status))
    .sort((a, b) => a.date.localeCompare(b.date));

  return { reminders, isLoading };
}
