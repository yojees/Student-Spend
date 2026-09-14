/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Expense, MonthlyBudget, SavingsGoal, StudentProfile } from '../types';
import { generateSmartInsights } from '../utils/analytics';

interface SmartInsightsProps {
  expenses: Expense[];
  budget: MonthlyBudget;
  goals: SavingsGoal[];
  profile: StudentProfile | null;
  currency: string;
}

export const SmartInsights: React.FC<SmartInsightsProps> = ({
  expenses,
  budget,
  goals,
  profile,
  currency,
}) => {
  const insights = generateSmartInsights(expenses, budget, goals, profile);

  return (
    <div id="smart-insights" className="w-full">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5c5c]">
          Real-time Analytics
        </span>
        <h2 className="text-2xl font-medium tracking-tight text-[#111111] mt-0.5">
          Smart insights
        </h2>
        <p className="text-xs text-[#5c5c5c] mt-1">
          Patterns, alerts, and proactive tips derived from your current month's behavior.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((ins) => {
          let IconComponent = Lightbulb;
          let badgeColor = 'text-[#111111] bg-black/5';

          if (ins.type === 'positive') {
            IconComponent = CheckCircle;
            badgeColor = 'text-emerald-700 bg-emerald-50';
          } else if (ins.type === 'warning') {
            IconComponent = AlertCircle;
            badgeColor = 'text-amber-700 bg-amber-50';
          }

          return (
            <div
              key={ins.id}
              className="p-5 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs hover:border-black/15 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${badgeColor}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-[#5c5c5c] tracking-wider">
                    Insight
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#111111] mb-1.5">
                  {ins.title}
                </h3>
                <p className="text-xs text-[#5c5c5c] leading-relaxed">
                  {ins.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
