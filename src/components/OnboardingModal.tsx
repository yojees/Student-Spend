/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (monthlyBudget: number) => void;
  currency?: string;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  currency = '₹',
}) => {
  const [budgetInput, setBudgetInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(budgetInput) || 0;
    onComplete(Math.max(0, amount));
  };

  return (
    <div
      id="onboarding-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="w-full max-w-md bg-[#fafaf8] rounded-3xl border border-black/8 shadow-2xl p-8 sm:p-10 relative flex flex-col animate-rise">
        {/* Brand header */}
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#5c5c5c] px-2.5 py-1 rounded-full bg-black/5">
            Getting Started
          </span>
        </div>

        {/* Welcome Text */}
        <div className="mb-8">
          <h1
            id="onboarding-title"
            className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111111] leading-snug"
          >
            Welcome to StudentSpend
          </h1>
          <p className="text-sm sm:text-base text-[#5c5c5c] mt-2 font-normal leading-relaxed">
            Your money has a story. Let's start tracking it.
          </p>
        </div>

        {/* Budget Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="monthly-budget-input"
              className="block text-sm font-medium text-[#111111] mb-2.5"
            >
              What's your monthly budget?
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-xl sm:text-2xl font-semibold text-[#111111] select-none">
                {currency}
              </span>
              <input
                id="monthly-budget-input"
                type="number"
                min="0"
                step="100"
                autoFocus
                required
                placeholder="e.g. 8000"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 text-xl sm:text-2xl font-semibold text-[#111111] bg-white border border-black/15 rounded-2xl outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-[#5c5c5c]/40 shadow-2xs"
              />
            </div>
            <p className="text-xs text-[#5c5c5c] mt-2">
              This can be your monthly allowance, stipend, or spending target. You can adjust it anytime.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              id="onboarding-continue-btn"
              className="w-full py-3.5 px-6 rounded-full text-sm font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] active:scale-[0.99] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onComplete(0)}
              className="text-xs text-[#5c5c5c] hover:text-[#111111] text-center transition-colors py-1 cursor-pointer"
            >
              Skip for now, I'll set it later
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
