/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Expense, MonthlyBudget, SavingsGoal, SplitExpense, StudentProfile } from '../types';

export const EMPTY_PROFILE: StudentProfile = {
  name: '',
  studentType: 'Hostel Student',
  monthlyMoney: 0,
  savingsGoal: '',
  currency: '₹',
};

export const EMPTY_EXPENSES: Expense[] = [];

export const EMPTY_BUDGET: MonthlyBudget = {
  monthlyAllowance: 0,
  categoryBudgets: {
    Food: 0,
    Transport: 0,
    Education: 0,
    Entertainment: 0,
    Shopping: 0,
    Accommodation: 0,
    Other: 0,
  },
};

export const EMPTY_SAVINGS_GOALS: SavingsGoal[] = [];

export const EMPTY_SPLITS: SplitExpense[] = [];
