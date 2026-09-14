/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Expense, MonthlyBudget } from '../types';

interface MonthlySpendingProps {
  expenses: Expense[];
  budget: MonthlyBudget;
  currency: string;
}

export const MonthlySpending: React.FC<MonthlySpendingProps> = ({
  expenses,
  budget,
  currency,
}) => {
  const primaryCategories = [
    'Food',
    'Transport',
    'Education',
    'Shopping',
    'Entertainment',
    'Accommodation',
    'Other',
  ];

  // Calculate actual spending per category
  const categoryTotals: Record<string, number> = {};
  primaryCategories.forEach((cat) => (categoryTotals[cat] = 0));

  expenses.forEach((exp) => {
    let cat = exp.category;
    if (['Mess', 'Canteen', 'Snacks'].includes(cat)) cat = 'Food';
    else if (['Books', 'Printing', 'Lab Materials', 'College Fees'].includes(cat)) cat = 'Education';
    else if (['Hostel', 'Laundry'].includes(cat)) cat = 'Accommodation';
    else if (['Subscriptions', 'Bills'].includes(cat)) cat = 'Other';

    if (categoryTotals[cat] !== undefined) {
      categoryTotals[cat] += exp.amount;
    } else {
      categoryTotals['Other'] += exp.amount;
    }
  });

  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  return (
    <div id="monthly-spending" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5c5c]">
            Category Breakdown
          </span>
          <h2 className="text-2xl font-medium tracking-tight text-[#111111] mt-0.5">
            Monthly Spending
          </h2>
        </div>
        <span className="text-xs font-medium text-[#5c5c5c] bg-white px-3 py-1.5 rounded-full border border-black/8 shadow-2xs self-start sm:self-auto">
          Total: {currency}
          {totalSpent.toLocaleString('en-IN')}
        </span>
      </div>

      {expenses.length === 0 && (
        <div className="mb-4 p-4 rounded-2xl bg-white/70 border border-black/5 text-xs text-[#5c5c5c] text-center">
          No expenses recorded yet. Your category percentages and progress bars will update immediately as you log spending.
        </div>
      )}

      {/* Grid of Clean Minimal Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {primaryCategories.map((cat) => {
          const spent = categoryTotals[cat] || 0;
          const percentage = totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0;
          const catBudget = budget.categoryBudgets[cat] || 0;
          const isOverBudget = catBudget > 0 && spent > catBudget;

          return (
            <div
              key={cat}
              className="p-5 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs hover:border-black/15 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
                  <span className="text-sm font-medium text-[#111111]">{cat}</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-semibold text-[#111111]">
                    {currency}
                    {spent.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#5c5c5c] ml-1.5 font-normal">
                    ({percentage}%)
                  </span>
                </div>
              </div>

              {/* Progress bar representing share of spend */}
              <div className="w-full h-1.5 bg-black/6 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    isOverBudget ? 'bg-amber-600' : 'bg-[#111111]'
                  }`}
                  style={{ width: `${Math.min(100, percentage)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#5c5c5c] pt-1 border-t border-black/4">
                <span>
                  Budget: {catBudget > 0 ? `${currency}${catBudget.toLocaleString('en-IN')}` : 'Flexible'}
                </span>
                {catBudget > 0 && (
                  <span className={isOverBudget ? 'text-amber-700 font-medium' : 'text-emerald-700'}>
                    {isOverBudget ? 'Exceeded' : `${currency}${(catBudget - spent).toLocaleString('en-IN')} left`}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
