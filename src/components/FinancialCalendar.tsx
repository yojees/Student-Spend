/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Expense } from '../types';
import {
  getLocalToday,
  formatMonthYear,
  getPrevMonth,
  getNextMonth,
  isExpenseInMonth,
} from '../utils/dateUtils';

interface FinancialCalendarProps {
  expenses: Expense[];
  currency: string;
}

export const FinancialCalendar: React.FC<FinancialCalendarProps> = ({
  expenses,
  currency,
}) => {
  // Dynamically detect user's current local date
  const localToday = useMemo(() => getLocalToday(), []);

  // View state: initialized to user's real current local month and year
  const [viewYear, setViewYear] = useState<number>(() => getLocalToday().year);
  const [viewMonth, setViewMonth] = useState<number>(() => getLocalToday().month);
  const [selectedDate, setSelectedDate] = useState<string>(() => getLocalToday().dateStr);

  // Month navigation handlers
  const handlePrevMonth = () => {
    const prev = getPrevMonth(viewYear, viewMonth);
    setViewYear(prev.year);
    setViewMonth(prev.month);

    // If returning to current real month, default to today's date; otherwise 1st of month
    if (prev.year === localToday.year && prev.month === localToday.month) {
      setSelectedDate(localToday.dateStr);
    } else {
      setSelectedDate(`${prev.year}-${String(prev.month + 1).padStart(2, '0')}-01`);
    }
  };

  const handleNextMonth = () => {
    const next = getNextMonth(viewYear, viewMonth);
    setViewYear(next.year);
    setViewMonth(next.month);

    // If navigating to current real month, default to today's date; otherwise 1st of month
    if (next.year === localToday.year && next.month === localToday.month) {
      setSelectedDate(localToday.dateStr);
    } else {
      setSelectedDate(`${next.year}-${String(next.month + 1).padStart(2, '0')}-01`);
    }
  };

  const handleGoToToday = () => {
    setViewYear(localToday.year);
    setViewMonth(localToday.month);
    setSelectedDate(localToday.dateStr);
  };

  // Month display name (e.g., "September 2026", "January 2027")
  const monthName = formatMonthYear(viewYear, viewMonth);
  const isCurrentRealMonth = viewYear === localToday.year && viewMonth === localToday.month;

  // Calendar math for grid
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  // Filter expenses strictly belonging to the currently viewed month
  const monthExpenses = useMemo(() => {
    return expenses.filter((exp) => isExpenseInMonth(exp.date, viewYear, viewMonth));
  }, [expenses, viewYear, viewMonth]);

  // Group month expenses by date string YYYY-MM-DD
  const expensesByDate = useMemo(() => {
    const map: Record<string, Expense[]> = {};
    monthExpenses.forEach((exp) => {
      if (!map[exp.date]) {
        map[exp.date] = [];
      }
      map[exp.date].push(exp);
    });
    return map;
  }, [monthExpenses]);

  // Monthly summary metrics
  const monthTotalSpent = useMemo(() => {
    return monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [monthExpenses]);

  const monthExpenseCount = monthExpenses.length;

  // Category breakdown for this month
  const categoryBreakdown = useMemo(() => {
    const totals: Record<string, number> = {};
    monthExpenses.forEach((exp) => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    return Object.entries(totals).sort(([, a], [, b]) => b - a);
  }, [monthExpenses]);

  // Selected date details
  const selectedExpenses = expensesByDate[selectedDate] || [];
  const selectedDayTotal = selectedExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Selected date formatted label
  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) return '';
    try {
      const [y, m, d] = selectedDate.split('-').map(Number);
      if (y && m && d) {
        return new Date(y, m - 1, d).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    } catch {
      // fallback
    }
    return selectedDate;
  }, [selectedDate]);

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
          {monthExpenseCount === 0
            ? 'No expenses recorded this month.'
            : `Daily transaction timeline and spending density across ${monthName}.`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid Container */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs">
          {/* Calendar Header with Navigation Controls and Summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-black/5">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-black/8 shadow-2xs">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg hover:bg-black/5 text-[#111111] transition-colors cursor-pointer"
                  title="Previous month"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg hover:bg-black/5 text-[#111111] transition-colors cursor-pointer"
                  title="Next month"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <span className="text-base font-semibold text-[#111111] tracking-tight">
                {monthName}
              </span>

              {!isCurrentRealMonth && (
                <button
                  type="button"
                  onClick={handleGoToToday}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white border border-black/8 text-[#111111] hover:bg-black/5 transition-all cursor-pointer shadow-2xs"
                  title="Jump to current real month"
                >
                  Current Month
                </button>
              )}
            </div>

            {/* Month quick stats */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-baseline gap-1">
                <span className="text-[#5c5c5c]">Total:</span>
                <span className="font-semibold text-[#111111]">
                  {currency}
                  {monthTotalSpent.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-black/20">|</span>
              <span className="text-[#5c5c5c]">
                {monthExpenseCount} {monthExpenseCount === 1 ? 'expense' : 'expenses'}
              </span>
            </div>
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
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(
                dayNum
              ).padStart(2, '0')}`;
              const dayItems = expensesByDate[dateStr] || [];
              const daySpend = dayItems.reduce((acc, e) => acc + e.amount, 0);
              const isSelected = selectedDate === dateStr;
              const isToday = isCurrentRealMonth && dayNum === localToday.day;

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-14 p-1.5 rounded-xl text-left flex flex-col justify-between transition-all cursor-pointer border relative ${
                    isSelected
                      ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                      : isToday
                      ? 'bg-white hover:bg-white/90 border-[#111111]/40 shadow-2xs'
                      : daySpend > 0
                      ? 'bg-white hover:bg-white/80 border-black/8'
                      : 'bg-white/40 hover:bg-white/80 border-transparent text-[#5c5c5c]'
                  }`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className={`text-xs ${isToday || isSelected ? 'font-semibold' : 'font-medium'}`}>
                      {dayNum}
                    </span>
                    {isToday && (
                      <span
                        className={`text-[8.5px] font-semibold px-1 py-0.2 rounded ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-black/8 text-[#111111]'
                        }`}
                      >
                        Today
                      </span>
                    )}
                  </div>

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
                  {selectedDateLabel}
                </h3>
              </div>
              <span className="text-base font-bold text-[#111111]">
                {currency}
                {selectedDayTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {selectedExpenses.length === 0 ? (
              <div className="py-6 text-center">
                {monthExpenses.length === 0 ? (
                  <div className="p-3.5 rounded-xl bg-white/70 border border-black/5">
                    <p className="text-xs font-semibold text-[#111111]">
                      No expenses recorded this month.
                    </p>
                    <p className="text-[11px] text-[#5c5c5c] mt-1">
                      Transactions added with dates in {monthName} will appear here.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-[#5c5c5c]">
                    No recorded spending on this date.
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
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

            {/* Monthly Category Breakdown for viewed month */}
            {categoryBreakdown.length > 0 && (
              <div className="mt-5 pt-4 border-t border-black/6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase text-[#5c5c5c] tracking-wider">
                    {monthName} Categories
                  </span>
                  <span className="text-[11px] font-medium text-[#111111]">
                    {categoryBreakdown.length} active
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {categoryBreakdown.map(([cat, amount]) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-black/6 text-[11px] text-[#111111]"
                    >
                      <span className="text-[#5c5c5c]">{cat}</span>
                      <span className="font-semibold">
                        {currency}
                        {amount.toLocaleString('en-IN')}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-black/6 text-xs text-[#5c5c5c] flex items-center justify-between">
            <span>
              {selectedExpenses.length} transaction{selectedExpenses.length === 1 ? '' : 's'} on this day
            </span>
            <span>
              Month: {monthExpenseCount} total
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
