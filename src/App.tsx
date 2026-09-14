/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { DashboardOverview } from './components/DashboardOverview';
import { MonthlySpending } from './components/MonthlySpending';
import { TransactionHistory } from './components/TransactionHistory';
import { BudgetSystem } from './components/BudgetSystem';
import { SavingsGoals } from './components/SavingsGoals';
import { AffordabilityChecker } from './components/AffordabilityChecker';
import { AIAssistant } from './components/AIAssistant';
import { SmartInsights } from './components/SmartInsights';
import { SplitExpenses } from './components/SplitExpenses';
import { FinancialCalendar } from './components/FinancialCalendar';
import { AnalyticsView } from './components/AnalyticsView';
import { ExpenseModal } from './components/ExpenseModal';
import { ProfileModal } from './components/ProfileModal';
import { OnboardingModal } from './components/OnboardingModal';
import { Expense, MonthlyBudget, SavingsGoal, SplitExpense, StudentProfile } from './types';
import {
  getStoredBudget,
  getStoredExpenses,
  getStoredGoals,
  getStoredProfile,
  getStoredSplits,
  hasCompletedOnboarding,
  saveStoredBudget,
  saveStoredExpenses,
  saveStoredGoals,
  saveStoredProfile,
  saveStoredSplits,
  setCompletedOnboarding,
} from './utils/storage';
import { calculateTotalSaved, calculateTotalSpent } from './utils/analytics';
import { Logo } from './components/Logo';

export default function App() {
  // Application State backed by localStorage (Empty by default for all new users)
  const [profile, setProfile] = useState<StudentProfile | null>(getStoredProfile);
  const [expenses, setExpenses] = useState<Expense[]>(getStoredExpenses);
  const [budget, setBudget] = useState<MonthlyBudget>(getStoredBudget);
  const [goals, setGoals] = useState<SavingsGoal[]>(getStoredGoals);
  const [splits, setSplits] = useState<SplitExpense[]>(getStoredSplits);

  // First-Time Onboarding State
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => !hasCompletedOnboarding());

  // Modal States
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveStoredExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    saveStoredBudget(budget);
  }, [budget]);

  useEffect(() => {
    saveStoredGoals(goals);
  }, [goals]);

  useEffect(() => {
    saveStoredSplits(splits);
  }, [splits]);

  useEffect(() => {
    saveStoredProfile(profile);
  }, [profile]);

  // Financial Calculations
  const currency = profile?.currency || '₹';
  const totalSpent = calculateTotalSpent(expenses);
  const totalSaved = calculateTotalSaved(goals);
  const allowance = budget.monthlyAllowance || profile?.monthlyMoney || 0;
  const budgetRemaining = Math.max(0, allowance - totalSpent);
  const availableMonth = allowance;

  // Onboarding Complete Handler
  const handleOnboardingComplete = (monthlyBudget: number) => {
    const initialAllowance = Math.max(0, monthlyBudget);
    const newBudget: MonthlyBudget = {
      monthlyAllowance: initialAllowance,
      categoryBudgets: {
        Food: Math.round(initialAllowance * 0.35),
        Transport: Math.round(initialAllowance * 0.15),
        Education: Math.round(initialAllowance * 0.15),
        Entertainment: Math.round(initialAllowance * 0.1),
        Shopping: Math.round(initialAllowance * 0.1),
        Accommodation: Math.round(initialAllowance * 0.1),
        Other: Math.round(initialAllowance * 0.05),
      },
    };
    setBudget(newBudget);
    saveStoredBudget(newBudget);

    const initialProfile: StudentProfile = {
      name: profile?.name || 'Student',
      studentType: profile?.studentType || 'Hostel Student',
      monthlyMoney: initialAllowance,
      savingsGoal: profile?.savingsGoal || '',
      currency: profile?.currency || '₹',
    };
    setProfile(initialProfile);
    saveStoredProfile(initialProfile);

    setCompletedOnboarding(true);
    setIsOnboardingOpen(false);
  };

  // Expense Handlers
  const handleAddExpense = (newExpData: Omit<Expense, 'id' | 'createdAt'>): Expense => {
    const created: Expense = {
      ...newExpData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: Date.now(),
    };
    setExpenses((prev) => [created, ...prev]);
    return created;
  };

  const handleSaveExpenseModal = (
    expenseData: Omit<Expense, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId) {
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...expenseData } : item
        )
      );
    } else {
      handleAddExpense(expenseData);
    }
  };

  const handleEditExpenseTrigger = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Budget Handlers
  const handleUpdateBudget = (newBudget: MonthlyBudget) => {
    setBudget(newBudget);
  };

  // Goals Handlers
  const handleAddGoal = (goalData: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      createdAt: Date.now(),
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const handleUpdateGoal = (updatedGoal: SavingsGoal) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g))
    );
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Split Handlers
  const handleAddSplit = (splitData: Omit<SplitExpense, 'id' | 'createdAt'>) => {
    const newSplit: SplitExpense = {
      ...splitData,
      id: `split-${Date.now()}`,
      createdAt: Date.now(),
    };
    setSplits((prev) => [newSplit, ...prev]);
  };

  const handleToggleSplitStatus = (splitId: string, participantIndex: number) => {
    setSplits((prev) =>
      prev.map((s) => {
        if (s.id !== splitId) return s;
        const nextParticipants = [...s.participants];
        nextParticipants[participantIndex].paid = !nextParticipants[participantIndex].paid;
        return { ...s, participants: nextParticipants };
      })
    );
  };

  const handleDeleteSplit = (splitId: string) => {
    setSplits((prev) => prev.filter((s) => s.id !== splitId));
  };

  return (
    <div className="min-h-screen bg-[#eef2ee] text-[#111111] flex flex-col selection:bg-[#111111] selection:text-white">
      {/* 1. Header Navigation */}
      <Navigation
        onOpenExpenseModal={() => {
          setEditingExpense(null);
          setIsExpenseModalOpen(true);
        }}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        studentName={profile?.name || 'Student'}
      />

      {/* 2. Full-Viewport Hero Section (Preserved visual language) */}
      <main className="flex-1 flex flex-col">
        <Hero
          onAddExpense={handleAddExpense}
          onOpenStructuredModal={() => {
            setEditingExpense(null);
            setIsExpenseModalOpen(true);
          }}
          onEditExpense={handleEditExpenseTrigger}
          currency={currency}
        />

        {/* 3. StudentSpend Application Core Body (Below Hero) */}
        <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col gap-16 sm:gap-24">
          {/* Dashboard Overview */}
          <DashboardOverview
            availableMonth={availableMonth}
            totalSpent={totalSpent}
            totalSaved={totalSaved}
            budgetRemaining={budgetRemaining}
            currency={currency}
            hasExpenses={expenses.length > 0}
            onOpenAddExpense={() => {
              setEditingExpense(null);
              setIsExpenseModalOpen(true);
            }}
            onOpenBudgetModal={() => {
              const el = document.getElementById('budget');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Monthly Category Spending */}
          <MonthlySpending
            expenses={expenses}
            budget={budget}
            currency={currency}
          />

          {/* Recent Activity / Transaction History with empty state */}
          <TransactionHistory
            expenses={expenses}
            onEditExpense={handleEditExpenseTrigger}
            onDeleteExpense={handleDeleteExpense}
            onOpenAddExpense={() => {
              setEditingExpense(null);
              setIsExpenseModalOpen(true);
            }}
            currency={currency}
          />

          {/* Budget Limits & Alerts */}
          <BudgetSystem
            budget={budget}
            expenses={expenses}
            currency={currency}
            onUpdateBudget={handleUpdateBudget}
          />

          {/* Savings Goals Tracker */}
          <SavingsGoals
            goals={goals}
            currency={currency}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />

          {/* Can I Afford It? Simulation */}
          <AffordabilityChecker
            expenses={expenses}
            budget={budget}
            goals={goals}
            profile={profile}
            currency={currency}
          />

          {/* Ask StudentSpend AI */}
          <AIAssistant
            expenses={expenses}
            budget={budget}
            goals={goals}
            profile={profile}
            currency={currency}
          />

          {/* Smart Insights Derived from Real Data */}
          <SmartInsights
            expenses={expenses}
            budget={budget}
            goals={goals}
            profile={profile}
            currency={currency}
          />

          {/* Roommate & Group Split Expenses */}
          <SplitExpenses
            splits={splits}
            currency={currency}
            onAddSplit={handleAddSplit}
            onToggleStatus={handleToggleSplitStatus}
            onDeleteSplit={handleDeleteSplit}
          />

          {/* Financial Calendar Timeline */}
          <FinancialCalendar
            expenses={expenses}
            currency={currency}
          />

          {/* Deep Analytics */}
          <AnalyticsView
            expenses={expenses}
            budget={budget}
            goals={goals}
            profile={profile || { name: 'Student', studentType: 'Hostel Student', monthlyMoney: allowance, savingsGoal: '', currency }}
            currency={currency}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-black/8 py-10 px-4 sm:px-8 mt-12 bg-white/40">
        <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#5c5c5c]">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-[11px] text-[#5c5c5c]">
              — Know where your money goes.
            </span>
          </div>

          <div className="text-center sm:text-right flex flex-col gap-1">
            <p className="text-[11px]">
              Intelligent student personal finance companion. All data is saved locally on your device.
            </p>
            <p className="text-[10px] text-[#5c5c5c]/80">
              StudentSpend does not require bank credentials and provides informational budgeting assistance only.
            </p>
          </div>
        </div>
      </footer>

      {/* First-Time Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        currency={currency}
      />

      {/* Structured Expense Modal (Add / Edit) */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        onSaveExpense={handleSaveExpenseModal}
        editingExpense={editingExpense}
        currency={currency}
      />

      {/* Student Profile Settings Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={setProfile}
      />
    </div>
  );
}
