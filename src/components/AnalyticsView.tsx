/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Expense, MonthlyBudget, SavingsGoal, StudentProfile } from '../types';
import { calculateCategoryBreakdown, calculateTotalSaved, calculateTotalSpent } from '../utils/analytics';

interface AnalyticsViewProps {
  expenses: Expense[];
  budget: MonthlyBudget;
  goals: SavingsGoal[];
  profile: StudentProfile;
  currency: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  expenses,
  budget,
  goals,
  profile,
  currency,
}) => {
  const totalSpent = calculateTotalSpent(expenses);
  const totalSaved = calculateTotalSaved(goals);
  const allowance = budget.monthlyAllowance || profile.monthlyMoney || 0;

  // Days passed in current month
  const today = new Date();
  const dayOfMonth = Math.max(1, today.getDate());

  // Average daily spend
  const avgDailySpend = Math.round(totalSpent / dayOfMonth);
  const avgWeeklySpend = Math.round(avgDailySpend * 7);

  // Weekly spending (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const weeklySpend = expenses
    .filter((e) => e.date >= sevenDaysAgo)
    .reduce((sum, e) => sum + e.amount, 0);

  // Highest spending day
  const dailySpendMap: Record<string, number> = {};
  expenses.forEach((e) => {
    dailySpendMap[e.date] = (dailySpendMap[e.date] || 0) + e.amount;
  });

  let highestDay = 'None';
  let highestAmount = 0;
  Object.entries(dailySpendMap).forEach(([date, amt]) => {
    if (amt > highestAmount) {
      highestAmount = amt;
      highestDay = date;
    }
  });

  // Savings rate
  const totalInflow = totalSpent + totalSaved;
  const savingsRate = totalInflow > 0 ? Math.round((totalSaved / totalInflow) * 100) : 0;

  // Budget usage
  const budgetUsage = allowance > 0 ? Math.round((totalSpent / allowance) * 100) : 0;

  // Category breakdown sorted
  const breakdown = calculateCategoryBreakdown(expenses);
  const sortedCategories = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);

  return (
    <div id="analytics" className="w-full">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5c5c]">
          Deep Intelligence
        </span>
        <h2 className="text-2xl font-medium tracking-tight text-[#111111] mt-0.5">
          Spending analytics
        </h2>
        <p className="text-xs text-[#5c5c5c] mt-1">
          Quantitative telemetry of your daily run-rate, savings velocity, and budget consumption.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs">
          <span className="text-xs text-[#5c5c5c] uppercase font-semibold">Weekly Spend</span>
          <div className="text-2xl font-semibold text-[#111111] mt-1">
            {currency}
            {weeklySpend.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-[#5c5c5c] mt-1">Last 7 calendar days</p>
        </div>

        <div className="p-5 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs">
          <span className="text-xs text-[#5c5c5c] uppercase font-semibold">Average Daily Spend</span>
          <div className="text-2xl font-semibold text-[#111111] mt-1">
            {currency}
            {avgDailySpend.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-[#5c5c5c]">/day</span>
          </div>
          <p className="text-[11px] text-[#5c5c5c] mt-1">
            Est. Weekly: {currency}
            {avgWeeklySpend.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs">
          <span className="text-xs text-[#5c5c5c] uppercase font-semibold">Savings Rate</span>
          <div className="text-2xl font-semibold text-[#111111] mt-1">
            {savingsRate}%
          </div>
          <p className="text-[11px] text-[#5c5c5c] mt-1">
            {currency}
            {totalSaved.toLocaleString('en-IN')} allocated to goals
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs">
          <span className="text-xs text-[#5c5c5c] uppercase font-semibold">Budget Usage</span>
          <div className={`text-2xl font-semibold mt-1 ${budgetUsage > 90 ? 'text-amber-700' : 'text-[#111111]'}`}>
            {budgetUsage}%
          </div>
          <p className="text-[11px] text-[#5c5c5c] mt-1">
            {currency}
            {totalSpent.toLocaleString('en-IN')} of {currency}
            {allowance.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Highest Spending Day Callout & Category Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs text-[#5c5c5c] uppercase font-semibold">
              Peak Burn Rate
            </span>
            <h3 className="text-lg font-semibold text-[#111111] mt-1">
              Highest Spending Day
            </h3>
            <div className="mt-4 p-4 rounded-xl bg-white border border-black/6">
              <span className="text-xs text-[#5c5c5c] block">Date</span>
              <span className="text-sm font-semibold text-[#111111]">
                {highestDay !== 'None'
                  ? new Date(highestDay).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'No spending logged yet'}
              </span>
              <div className="mt-2 text-2xl font-bold text-[#111111]">
                {currency}
                {highestAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
          <p className="text-xs text-[#5c5c5c] mt-4">
            Identifying single-day spikes helps detect irregular textbook, hostel fees, or social outings early.
          </p>
        </div>

        <div className="lg:col-span-7 p-6 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs">
          <span className="text-xs text-[#5c5c5c] uppercase font-semibold">
            Category Share
          </span>
          <h3 className="text-lg font-semibold text-[#111111] mt-1 mb-4">
            Expense Volume Ranking
          </h3>

          {sortedCategories.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#5c5c5c]">
              No transactions logged yet. Your category ranking will appear here as you record expenses.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sortedCategories.slice(0, 5).map(([cat, amt]) => {
                const pct = totalSpent > 0 ? Math.round((amt / totalSpent) * 100) : 0;
                return (
                  <div key={cat} className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#111111]">{cat}</span>
                      <span className="text-[#5c5c5c]">
                        {currency}
                        {amt.toLocaleString('en-IN')} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-black/6 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#111111] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
