/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Edit2, Save } from 'lucide-react';
import { Expense, MonthlyBudget } from '../types';

interface BudgetSystemProps {
  budget: MonthlyBudget;
  expenses: Expense[];
  currency: string;
  onUpdateBudget: (newBudget: MonthlyBudget) => void;
}

export const BudgetSystem: React.FC<BudgetSystemProps> = ({
  budget,
  expenses,
  currency,
  onUpdateBudget,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempAllowance, setTempAllowance] = useState(budget.monthlyAllowance);
  const [tempCategories, setTempCategories] = useState<Record<string, number>>({
    ...budget.categoryBudgets,
  });

  useEffect(() => {
    setTempAllowance(budget.monthlyAllowance);
    setTempCategories({ ...budget.categoryBudgets });
  }, [budget]);

  // Calculate actual category spending
  const categorySpent: Record<string, number> = {};
  expenses.forEach((exp) => {
    let cat = exp.category;
    if (['Mess', 'Canteen', 'Snacks'].includes(cat)) cat = 'Food';
    else if (['Books', 'Printing', 'Lab Materials', 'College Fees'].includes(cat)) cat = 'Education';
    else if (['Hostel', 'Laundry'].includes(cat)) cat = 'Accommodation';
    else if (['Subscriptions', 'Bills'].includes(cat)) cat = 'Other';

    categorySpent[cat] = (categorySpent[cat] || 0) + exp.amount;
  });

  const handleSave = () => {
    onUpdateBudget({
      monthlyAllowance: Math.max(0, Number(tempAllowance) || 0),
      categoryBudgets: tempCategories,
    });
    setIsEditing(false);
  };

  const handleCategoryChange = (cat: string, val: string) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setTempCategories((prev) => ({
      ...prev,
      [cat]: num,
    }));
  };

  const defaultCategories = [
    'Food',
    'Transport',
    'Education',
    'Shopping',
    'Entertainment',
    'Accommodation',
    'Other',
  ];

  const categories = Object.keys(budget.categoryBudgets).length > 0
    ? Object.keys(budget.categoryBudgets)
    : defaultCategories;

  return (
    <div id="budget" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5c5c]">
            Monthly Limits
          </span>
          <h2 className="text-2xl font-medium tracking-tight text-[#111111] mt-0.5">
            Set your monthly budget
          </h2>
        </div>

        <button
          onClick={() => {
            if (isEditing) handleSave();
            else {
              setTempAllowance(budget.monthlyAllowance);
              setTempCategories({ ...budget.categoryBudgets });
              setIsEditing(true);
            }
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] transition-all cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          {isEditing ? (
            <>
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="w-3.5 h-3.5" />
              Edit Budget
            </>
          )}
        </button>
      </div>

      {/* Monthly Allowance Banner */}
      <div className="p-6 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#5c5c5c] font-medium uppercase tracking-wide">
            Total Monthly Allowance
          </span>
          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-semibold text-[#111111]">{currency}</span>
              <input
                type="number"
                min="0"
                value={tempAllowance}
                onChange={(e) => setTempAllowance(Number(e.target.value))}
                className="w-36 px-3 py-1.5 text-lg font-semibold bg-white border border-black/15 rounded-xl outline-none focus:border-black"
              />
            </div>
          ) : (
            <div className="text-2xl sm:text-3xl font-semibold text-[#111111] tracking-tight mt-0.5">
              {currency}
              {budget.monthlyAllowance.toLocaleString('en-IN')}
            </div>
          )}
        </div>
        <p className="text-xs text-[#5c5c5c] max-w-xs">
          This sets your monthly spending ceiling to ensure you stay solvent through end-of-semester.
        </p>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const cap = budget.categoryBudgets[cat] || 0;
          const spent = categorySpent[cat] || 0;
          const percentage = cap > 0 ? Math.round((spent / cap) * 100) : 0;
          const isExceeded = cap > 0 && spent > cap;
          const isApproaching = cap > 0 && percentage >= 80 && !isExceeded;

          return (
            <div
              key={cat}
              className="p-5 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs hover:border-black/15 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#111111]">{cat}</span>
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-[#5c5c5c]">{currency}</span>
                    <input
                      type="number"
                      min="0"
                      value={tempCategories[cat] ?? cap}
                      onChange={(e) => handleCategoryChange(cat, e.target.value)}
                      className="w-24 px-2 py-1 text-xs bg-white border border-black/15 rounded-lg text-right outline-none focus:border-black"
                    />
                  </div>
                ) : (
                  <div className="text-xs text-right">
                    <span className="font-semibold text-[#111111]">
                      {currency}
                      {spent.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[#5c5c5c]">
                      {' '}
                      / {currency}
                      {cap.toLocaleString('en-IN')}
                    </span>
                    <span className="ml-1 text-[#5c5c5c]">({percentage}%)</span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-black/6 rounded-full overflow-hidden my-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    isExceeded
                      ? 'bg-amber-600'
                      : isApproaching
                      ? 'bg-amber-500'
                      : 'bg-[#111111]'
                  }`}
                  style={{ width: `${Math.min(100, percentage)}%` }}
                />
              </div>

              {/* Budget Alerts in Calm Non-aggressive Language */}
              <div className="mt-2 text-xs flex items-center justify-between">
                {isExceeded ? (
                  <span className="inline-flex items-center gap-1.5 text-amber-800 font-medium bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/50">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Your {cat.toLowerCase()} budget has been exceeded.
                  </span>
                ) : isApproaching ? (
                  <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50/70 px-2.5 py-1 rounded-full border border-amber-200/40">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    You're approaching your {cat.toLowerCase()} budget.
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    {currency}
                    {Math.max(0, cap - spent).toLocaleString('en-IN')} remaining
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
