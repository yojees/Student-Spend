/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowDownRight, ArrowUpRight, PiggyBank, Plus, Sparkles, Wallet } from 'lucide-react';

interface DashboardOverviewProps {
  availableMonth: number;
  totalSpent: number;
  totalSaved: number;
  budgetRemaining: number;
  currency: string;
  hasExpenses: boolean;
  onOpenAddExpense: () => void;
  onOpenBudgetModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  availableMonth,
  totalSpent,
  totalSaved,
  budgetRemaining,
  currency,
  hasExpenses,
  onOpenAddExpense,
  onOpenBudgetModal,
}) => {
  return (
    <div id="dashboard" className="w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5c5c]">
            Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111111] mt-1">
            Your money, at a glance.
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBudgetModal}
            className="px-4 py-2 rounded-full text-xs font-medium text-[#111111] bg-white hover:bg-[#f4f4f4] border border-black/8 transition-all cursor-pointer shadow-2xs"
          >
            Adjust Budget
          </button>
          <button
            onClick={onOpenAddExpense}
            className="px-4 py-2 rounded-full text-xs font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            + New Expense
          </button>
        </div>
      </div>

      {/* First-Time User Empty State Banner */}
      {!hasExpenses && (
        <div className="mb-6 p-6 sm:p-7 rounded-3xl bg-[rgba(248,248,246,0.97)] border border-black/8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-black/5 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-[#111111]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[#111111]">
                Start by adding your first expense.
              </h3>
              <p className="text-xs sm:text-sm text-[#5c5c5c] mt-1 leading-relaxed max-w-xl">
                Type something like <span className="font-medium text-[#111111]">"₹180 lunch"</span> in the prompt above, or click the button to log your first transaction and unlock full spending analytics.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAddExpense}
            className="px-5 py-2.5 rounded-full text-xs font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] transition-all cursor-pointer shadow-2xs whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            + Add First Expense
          </button>
        </div>
      )}

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available this month */}
        <div className="p-5 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-sm flex flex-col justify-between hover:border-black/15 transition-all">
          <div className="flex items-center justify-between text-[#5c5c5c]">
            <span className="text-xs font-medium uppercase tracking-wide">
              Available this month
            </span>
            <Wallet className="w-4 h-4 text-[#5c5c5c]" />
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-semibold text-[#111111] tracking-tight">
              {currency}
              {availableMonth.toLocaleString('en-IN')}
            </div>
            <p className="text-[12px] text-[#5c5c5c] mt-1">
              Monthly allowance & balance
            </p>
          </div>
        </div>

        {/* Spent this month */}
        <div className="p-5 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-sm flex flex-col justify-between hover:border-black/15 transition-all">
          <div className="flex items-center justify-between text-[#5c5c5c]">
            <span className="text-xs font-medium uppercase tracking-wide">
              Spent this month
            </span>
            <ArrowUpRight className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-semibold text-[#111111] tracking-tight">
              {currency}
              {totalSpent.toLocaleString('en-IN')}
            </div>
            <p className="text-[12px] text-[#5c5c5c] mt-1">
              {hasExpenses ? 'Total recorded this month' : 'No expenses recorded yet'}
            </p>
          </div>
        </div>

        {/* Saved */}
        <div className="p-5 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-sm flex flex-col justify-between hover:border-black/15 transition-all">
          <div className="flex items-center justify-between text-[#5c5c5c]">
            <span className="text-xs font-medium uppercase tracking-wide">
              Saved
            </span>
            <PiggyBank className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-semibold text-[#111111] tracking-tight">
              {currency}
              {totalSaved.toLocaleString('en-IN')}
            </div>
            <p className="text-[12px] text-[#5c5c5c] mt-1">
              Across your active goals
            </p>
          </div>
        </div>

        {/* Budget remaining */}
        <div className="p-5 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-sm flex flex-col justify-between hover:border-black/15 transition-all">
          <div className="flex items-center justify-between text-[#5c5c5c]">
            <span className="text-xs font-medium uppercase tracking-wide">
              Budget remaining
            </span>
            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-4">
            <div
              className={`text-2xl sm:text-3xl font-semibold tracking-tight ${
                availableMonth > 0 && budgetRemaining < 500 ? 'text-amber-700' : 'text-[#111111]'
              }`}
            >
              {currency}
              {Math.max(0, budgetRemaining).toLocaleString('en-IN')}
            </div>
            <p className="text-[12px] text-[#5c5c5c] mt-1">
              Safe spending limit left
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
