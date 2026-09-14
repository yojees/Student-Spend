/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Education'
  | 'Shopping'
  | 'Entertainment'
  | 'Accommodation'
  | 'Mess'
  | 'Canteen'
  | 'Snacks'
  | 'College Fees'
  | 'Books'
  | 'Printing'
  | 'Lab Materials'
  | 'Hostel'
  | 'Laundry'
  | 'Subscriptions'
  | 'Bills'
  | 'Health'
  | 'Travel'
  | 'Other';

export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Bank Transfer' | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  createdAt: number;
}

export interface CategoryBudget {
  category: string;
  allocated: number;
}

export interface MonthlyBudget {
  monthlyAllowance: number;
  categoryBudgets: Record<string, number>;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string; // e.g., "March 2027" or "2027-03-31"
  createdAt: number;
}

export interface SplitParticipant {
  name: string;
  share: number;
  paid: boolean;
}

export interface SplitExpense {
  id: string;
  title: string;
  totalAmount: number;
  participants: SplitParticipant[];
  createdAt: number;
}

export type StudentType =
  | 'Day Scholar'
  | 'Hostel Student'
  | 'PG Student'
  | 'Living with Family';

export interface StudentProfile {
  name: string;
  studentType: StudentType;
  monthlyMoney: number;
  savingsGoal: string;
  currency: string;
}

export interface ParsedExpense {
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
}

export type AffordabilityStatus = 'SAFE' | 'THINK ABOUT IT' | 'NOT RECOMMENDED';

export interface AffordabilityResult {
  status: AffordabilityStatus;
  amount: number;
  remainingBudgetBefore: number;
  remainingBudgetAfter: number;
  budgetImpactPercentage: number;
  explanation: string;
}

export interface SmartInsight {
  id: string;
  title: string;
  description: string;
  type: 'neutral' | 'positive' | 'warning';
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
}
