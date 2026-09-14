/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Returns a date string formatted as YYYY-MM-DD in the user's local timezone.
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns components of the user's current local date.
 */
export function getLocalToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)
  const day = now.getDate();
  const dateStr = getLocalDateString(now);
  return { year, month, day, dateStr };
}

/**
 * Formats a year and month (0-indexed) into "MonthName YYYY" (e.g., "September 2026").
 */
export function formatMonthYear(year: number, month: number): string {
  const d = new Date(year, month, 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Returns previous month { year, month } handling year boundaries (e.g., Jan 2027 -> Dec 2026).
 */
export function getPrevMonth(year: number, month: number): { year: number; month: number } {
  if (month === 0) {
    return { year: year - 1, month: 11 };
  }
  return { year, month: month - 1 };
}

/**
 * Returns next month { year, month } handling year boundaries (e.g., Dec 2026 -> Jan 2027).
 */
export function getNextMonth(year: number, month: number): { year: number; month: number } {
  if (month === 11) {
    return { year: year + 1, month: 0 };
  }
  return { year, month: month + 1 };
}

/**
 * Checks if an expense date string belongs to a specific year and month (0-indexed).
 */
export function isExpenseInMonth(expDate: string, year: number, month: number): boolean {
  if (!expDate) return false;
  const targetPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  if (expDate.startsWith(targetPrefix)) return true;

  // Fallback for full ISO dates
  try {
    const d = new Date(expDate);
    if (!isNaN(d.getTime())) {
      return d.getFullYear() === year && d.getMonth() === month;
    }
  } catch {
    return false;
  }
  return false;
}
