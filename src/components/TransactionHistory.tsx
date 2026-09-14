/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trash2, Edit3, Search, Plus, Sparkles, Receipt } from 'lucide-react';
import { Expense } from '../types';

interface TransactionHistoryProps {
  expenses: Expense[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  onOpenAddExpense: () => void;
  currency: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  expenses,
  onEditExpense,
  onDeleteExpense,
  onOpenAddExpense,
  currency,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filtered expenses
  const filtered = expenses.filter((exp) => {
    const matchesSearch =
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || exp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by date label (Today, Yesterday, Date string)
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const grouped: Record<string, Expense[]> = {};
  filtered.forEach((exp) => {
    let dateLabel = exp.date;
    if (exp.date === todayStr) {
      dateLabel = 'Today';
    } else if (exp.date === yesterdayStr) {
      dateLabel = 'Yesterday';
    } else {
      try {
        const d = new Date(exp.date);
        dateLabel = d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      } catch {
        dateLabel = exp.date;
      }
    }

    if (!grouped[dateLabel]) {
      grouped[dateLabel] = [];
    }
    grouped[dateLabel].push(exp);
  });

  return (
    <div id="track" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5c5c]">
            Activity Log
          </span>
          <h2 className="text-2xl font-medium tracking-tight text-[#111111] mt-0.5">
            Recent activity
          </h2>
        </div>

        {/* Search & Filter (shown when user has expenses) */}
        {expenses.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5c5c5c]" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white/80 border border-black/8 rounded-full outline-none focus:border-black/20 focus:bg-white transition-all w-36 sm:w-44"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-white/80 border border-black/8 rounded-full px-3 py-1.5 outline-none focus:border-black/20 text-[#111111] cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Education">Education</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Accommodation">Accommodation</option>
              <option value="Other">Other</option>
            </select>
          </div>
        )}
      </div>

      {/* When no expenses exist: show elegant empty state */}
      {expenses.length === 0 ? (
        <div className="p-10 sm:p-14 text-center rounded-3xl bg-[rgba(248,248,246,0.97)] border border-black/8 shadow-sm flex flex-col items-center justify-center max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center mb-4">
            <Receipt className="w-6 h-6 text-[#111111]" />
          </div>
          <h3 className="text-xl font-medium text-[#111111] tracking-tight">
            Your spending starts here.
          </h3>
          <p className="text-sm text-[#5c5c5c] mt-2 max-w-sm mx-auto leading-relaxed">
            Add your first expense to start understanding where your money goes.
          </p>
          <div className="mt-6">
            <button
              onClick={onOpenAddExpense}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Expense</span>
            </button>
          </div>
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6">
          <p className="text-sm text-[#5c5c5c]">No matching expenses found for this filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-rise">
          {Object.entries(grouped).map(([dateLabel, items]) => (
            <div key={dateLabel} className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5c5c] px-1">
                {dateLabel}
              </span>

              <div className="rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs divide-y divide-black/5 overflow-hidden">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:px-5 flex items-center justify-between hover:bg-white/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center font-medium text-xs text-[#111111]">
                        {item.category.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#111111]">
                          {item.description}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-[#5c5c5c] mt-0.5">
                          <span className="px-2 py-0.5 rounded-full bg-black/5 text-[#111111]">
                            {item.category}
                          </span>
                          <span>•</span>
                          <span>{item.paymentMethod}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm sm:text-base font-semibold text-[#111111]">
                        {currency}
                        {item.amount.toLocaleString('en-IN')}
                      </span>

                      {/* Action buttons (Edit & Delete) */}
                      <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditExpense(item)}
                          className="p-1.5 rounded-lg text-[#5c5c5c] hover:text-[#111111] hover:bg-black/5 transition-colors cursor-pointer"
                          title="Edit Expense"
                          aria-label="Edit Expense"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(item.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Expense"
                          aria-label="Delete Expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
