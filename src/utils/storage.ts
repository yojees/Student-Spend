/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EMPTY_BUDGET,
  EMPTY_EXPENSES,
  EMPTY_PROFILE,
  EMPTY_SAVINGS_GOALS,
  EMPTY_SPLITS,
} from '../data/initialData';
import { Expense, MonthlyBudget, SavingsGoal, SplitExpense, StudentProfile } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'studentspend_profile_v2',
  EXPENSES: 'studentspend_expenses_v2',
  BUDGET: 'studentspend_budget_v2',
  GOALS: 'studentspend_goals_v2',
  SPLITS: 'studentspend_splits_v2',
  ONBOARDED: 'studentspend_onboarded_v2',
};

// Clean legacy sample data keys once if they exist
try {
  const legacyExpenses = localStorage.getItem('studentspend_expenses');
  if (legacyExpenses && legacyExpenses.includes('exp-1')) {
    localStorage.removeItem('studentspend_expenses');
    localStorage.removeItem('studentspend_profile');
    localStorage.removeItem('studentspend_budget');
    localStorage.removeItem('studentspend_goals');
    localStorage.removeItem('studentspend_splits');
  }
} catch {
  // Ignore storage access errors
}

export function hasCompletedOnboarding(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ONBOARDED);
    return raw === 'true';
  } catch {
    return false;
  }
}

export function setCompletedOnboarding(completed: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, completed ? 'true' : 'false');
  } catch (e) {
    console.error('Failed saving onboarding flag to storage', e);
  }
}

export function getStoredProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading profile from storage', e);
  }
  return null;
}

export function saveStoredProfile(profile: StudentProfile | null): void {
  try {
    if (profile) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
    }
  } catch (e) {
    console.error('Failed saving profile to storage', e);
  }
}

export function getStoredExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading expenses from storage', e);
  }
  return EMPTY_EXPENSES;
}

export function saveStoredExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (e) {
    console.error('Failed saving expenses to storage', e);
  }
}

export function getStoredBudget(): MonthlyBudget {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGET);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading budget from storage', e);
  }
  return EMPTY_BUDGET;
}

export function saveStoredBudget(budget: MonthlyBudget): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  } catch (e) {
    console.error('Failed saving budget to storage', e);
  }
}

export function getStoredGoals(): SavingsGoal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading goals from storage', e);
  }
  return EMPTY_SAVINGS_GOALS;
}

export function saveStoredGoals(goals: SavingsGoal[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (e) {
    console.error('Failed saving goals to storage', e);
  }
}

export function getStoredSplits(): SplitExpense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SPLITS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading splits from storage', e);
  }
  return EMPTY_SPLITS;
}

export function saveStoredSplits(splits: SplitExpense[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SPLITS, JSON.stringify(splits));
  } catch (e) {
    console.error('Failed saving splits to storage', e);
  }
}
