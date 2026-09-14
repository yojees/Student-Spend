/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { AffordabilityResult, Expense, MonthlyBudget, SavingsGoal, StudentProfile } from '../types';
import { evaluateAffordability } from '../utils/analytics';

interface AffordabilityCheckerProps {
  expenses: Expense[];
  budget: MonthlyBudget;
  goals: SavingsGoal[];
  profile: StudentProfile | null;
  currency: string;
}

export const AffordabilityChecker: React.FC<AffordabilityCheckerProps> = ({
  expenses,
  budget,
  goals,
  profile,
  currency,
}) => {
  const [amountInput, setAmountInput] = useState('');
  const [itemTitle, setItemTitle] = useState('');
  const [result, setResult] = useState<AffordabilityResult | null>(null);

  const handleEvaluate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const amt = parseFloat(amountInput) || 0;
    const res = evaluateAffordability(amt, expenses, budget, profile, goals);
    setResult(res);
  };

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'SAFE':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
          icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
        };
      case 'THINK ABOUT IT':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200/60',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
        };
      case 'NOT RECOMMENDED':
      default:
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200/60',
          icon: <XCircle className="w-4 h-4 text-rose-600" />,
        };
    }
  };

  return (
    <div id="affordability" className="w-full">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5c5c]">
          Pre-Purchase Simulation
        </span>
        <h2 className="text-2xl font-medium tracking-tight text-[#111111] mt-0.5">
          Can I afford it?
        </h2>
        <p className="text-xs text-[#5c5c5c] mt-1">
          Simulate purchase impact on your remaining monthly allowance and savings goals before tapping UPI.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs">
        <form onSubmit={handleEvaluate} className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6">
          <div className="sm:col-span-6">
            <label className="block text-xs text-[#5c5c5c] mb-1">Item or expense description</label>
            <input
              type="text"
              placeholder="e.g. Noise Cancelling Headphones, Concert Ticket"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/10 rounded-xl outline-none focus:border-black transition-all"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs text-[#5c5c5c] mb-1">Cost ({currency})</label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 1500"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/10 rounded-xl outline-none focus:border-black transition-all"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={!amountInput}
              className="w-full py-2.5 px-4 text-xs font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] disabled:bg-black/20 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              Evaluate
            </button>
          </div>
        </form>

        {/* Evaluation Output */}
        {result ? (
          <div className="p-5 rounded-2xl bg-white border border-black/6 flex flex-col gap-4 animate-rise">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    getBadgeStyle(result.status).bg
                  }`}
                >
                  {getBadgeStyle(result.status).icon}
                  {result.status}
                </span>
                <span className="text-sm font-semibold text-[#111111]">
                  {itemTitle ? `"${itemTitle}"` : 'Evaluation for'}{' '}
                  <span className="text-[#111111]">
                    ({currency}
                    {result.amount.toLocaleString('en-IN')})
                  </span>
                </span>
              </div>

              <span className="text-xs text-[#5c5c5c]">
                Impact: {result.budgetImpactPercentage}% of available balance
              </span>
            </div>

            <p className="text-xs text-[#111111] leading-relaxed bg-[#fafafa] p-3.5 rounded-xl border border-black/4">
              {result.explanation}
            </p>

            {/* Impact Metric Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-black/4">
              <div>
                <span className="text-[11px] text-[#5c5c5c] block">Budget Before</span>
                <span className="font-medium text-[#111111]">
                  {currency}
                  {result.remainingBudgetBefore.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#5c5c5c] block">Budget After</span>
                <span className="font-semibold text-[#111111]">
                  {currency}
                  {result.remainingBudgetAfter.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <span className="text-[11px] text-[#5c5c5c] block">Difference</span>
                <span className="font-medium text-rose-600">
                  -{currency}
                  {result.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-[#5c5c5c]">
            Enter an amount to simulate whether a planned purchase fits safely into your remaining monthly allowance.
          </div>
        )}
      </div>
    </div>
  );
};
