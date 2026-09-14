/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Expense } from '../types';

interface FinancialCalendarProps {
  expenses: Expense[];
  currency: string;
}

export const FinancialCalendar: React.FC<FinancialCalendarProps> = ({
  expenses,
  currency,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Group expenses by date YYYY-MM-DD
  const expensesByDate: Record<string, Expense[]> = {};
  expenses.forEach((exp) => {
    if (!expensesByDate[exp.date]) {
      expensesByDate[exp.date] = [];
    }
    expensesByDate[exp.date].push(exp);
  });

  // Simple current month generator
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  const selectedExpenses = expensesByDate[selectedDate] || [];
  const selectedDayTotal = selectedExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div id="financial-calendar" className="w-full">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5c5c]">
          Temporal Tracking
        </span>
        <h2 className="text-2xl font-medium tracking-tight text-[#111111] mt-0.5">
          Financial calendar
        </h2>
        <p className="text-xs text-[#5c5c5c] mt-1">
          Daily transaction timeline and spending density across {monthName}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid Container */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[#111111]">{monthName}</span>
            <span className="text-xs text-[#5c5c5c]">Click any date to inspect spend</span>
          </div>

          {/* Day header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#5c5c5c] pb-2 border-b border-black/5">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {paddingDays.map((p) => (
              <div key={`pad-${p}`} className="h-14 rounded-xl bg-transparent" />
            ))}

            {days.map((dayNum) => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
                dayNum
              ).padStart(2, '0')}`;
              const dayItems = expensesByDate[dateStr] || [];
              const daySpend = dayItems.reduce((acc, e) => acc + e.amount, 0);
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-14 p-1.5 rounded-xl text-left flex flex-col justify-between transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                      : daySpend > 0
                      ? 'bg-white hover:bg-white/80 border-black/8'
                      : 'bg-white/40 hover:bg-white/80 border-transparent text-[#5c5c5c]'
                  }`}
                >
                  <span className="text-xs font-medium">{dayNum}</span>
                  {daySpend > 0 ? (
                    <span
                      className={`text-[10px] font-semibold truncate ${
                        isSelected ? 'text-white' : 'text-[#111111]'
                      }`}
                    >
                      {currency}
                      {daySpend.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-[10px] opacity-0">-</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Detail Panel */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-black/6 mb-4">
              <div>
                <span className="text-xs text-[#5c5c5c] uppercase font-semibold">
                  Selected Day
                </span>
                <h3 className="text-base font-semibold text-[#111111]">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h3>
              </div>
              <span className="text-base font-bold text-[#111111]">
                {currency}
                {selectedDayTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {selectedExpenses.length === 0 ? (
              <p className="text-xs text-[#5c5c5c] py-6 text-center">
                No recorded spending on this date.
              </p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto">
                {selectedExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3 bg-white rounded-xl border border-black/4 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-medium text-[#111111] block">
                        {exp.description}
                      </span>
                      <span className="text-[11px] text-[#5c5c5c]">{exp.category}</span>
                    </div>
                    <span className="font-semibold text-[#111111]">
                      {currency}
                      {exp.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-black/6 text-xs text-[#5c5c5c]">
            {selectedExpenses.length} transaction{selectedExpenses.length === 1 ? '' : 's'} on this day
          </div>
        </div>
      </div>
    </div>
  );
};
