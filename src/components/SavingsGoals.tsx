/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Target, Trash2, Calendar, Sparkles } from 'lucide-react';
import { SavingsGoal } from '../types';

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  currency: string;
  onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  onUpdateGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (id: string) => void;
}

export const SavingsGoals: React.FC<SavingsGoalsProps> = ({
  goals,
  currency,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newSaved, setNewSaved] = useState('');
  const [newDate, setNewDate] = useState('March 2027');

  const [contributeGoalId, setContributeGoalId] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');

  // Calculate required savings
  const calculateRequirements = (goal: SavingsGoal) => {
    const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
    const monthsRemaining = 6;
    const monthly = Math.round(remaining / monthsRemaining);
    const weekly = Math.round(monthly / 4.3);
    return { monthly, weekly };
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTarget) return;

    onAddGoal({
      title: newTitle.trim(),
      targetAmount: Number(newTarget),
      savedAmount: Number(newSaved) || 0,
      targetDate: newDate.trim() || new Date(Date.now() + 90 * 86400000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    });

    setNewTitle('');
    setNewTarget('');
    setNewSaved('');
    setShowAddForm(false);
  };

  const handleAddContribution = (goal: SavingsGoal) => {
    const amt = Number(contributeAmount);
    if (amt > 0) {
      onUpdateGoal({
        ...goal,
        savedAmount: goal.savedAmount + amt,
      });
      setContributeGoalId(null);
      setContributeAmount('');
    }
  };

  return (
    <div id="goals" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5c5c]">
            Future Ambitions
          </span>
          <h2 className="text-2xl font-medium tracking-tight text-[#111111] mt-0.5">
            Savings goals
          </h2>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] transition-all cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          {showAddForm ? 'Close Form' : 'Create Goal'}
        </button>
      </div>

      {/* Add New Goal Form Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 mb-6 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/8 shadow-sm flex flex-col gap-4 animate-rise"
        >
          <h3 className="text-base font-semibold text-[#111111]">New Savings Goal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-[#5c5c5c] mb-1">Goal Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Laptop, Mountain Trip"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs text-[#5c5c5c] mb-1">Target Amount ({currency})</label>
              <input
                type="number"
                required
                placeholder="60000"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs text-[#5c5c5c] mb-1">Already Saved ({currency})</label>
              <input
                type="number"
                placeholder="0"
                value={newSaved}
                onChange={(e) => setNewSaved(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs text-[#5c5c5c] mb-1">Target Date</label>
              <input
                type="text"
                placeholder="March 2027"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-medium text-[#5c5c5c] hover:text-[#111111] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] rounded-full transition-all"
            >
              Create Savings Goal
            </button>
          </div>
        </form>
      )}

      {/* Empty State for Savings Goals */}
      {goals.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-[rgba(248,248,246,0.97)] border border-black/8 shadow-2xs flex flex-col items-center justify-center">
          <div className="w-11 h-11 rounded-2xl bg-black/5 flex items-center justify-center mb-3 text-[#111111]">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-[#111111]">No savings goals yet</h3>
          <p className="text-xs text-[#5c5c5c] mt-1 max-w-sm">
            Set your first goal (like a laptop upgrade, semester trip, or emergency fund) to calculate your weekly savings targets.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 px-4 py-2 text-xs font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] rounded-full transition-all"
          >
            + Create First Goal
          </button>
        </div>
      ) : (
        /* Goals Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.savedAmount / Math.max(1, goal.targetAmount)) * 100));
            const { monthly, weekly } = calculateRequirements(goal);

            return (
              <div
                key={goal.id}
                className="p-6 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs hover:border-black/15 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-base font-semibold text-[#111111]">{goal.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-[#5c5c5c] mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>Target: {goal.targetDate}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1.5 text-[#5c5c5c] hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Delete goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Progress Numbers */}
                  <div className="flex items-baseline justify-between mt-4 mb-2">
                    <div className="text-xl font-semibold text-[#111111]">
                      {currency}
                      {goal.savedAmount.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-[#5c5c5c] ml-1">
                        of {currency}
                        {goal.targetAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#111111] px-2 py-0.5 rounded-full bg-black/5">
                      {percentage}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-black/6 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full bg-[#111111] transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {/* Savings Requirement Calculations */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-white/60 rounded-xl border border-black/4 text-xs text-[#5c5c5c]">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wide">
                        Required Monthly
                      </span>
                      <span className="font-semibold text-[#111111]">
                        {currency}
                        {monthly.toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wide">
                        Required Weekly
                      </span>
                      <span className="font-semibold text-[#111111]">
                        {currency}
                        {weekly.toLocaleString('en-IN')}/wk
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contribution Trigger */}
                <div className="mt-4 pt-3 border-t border-black/4">
                  {contributeGoalId === goal.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Amount to add"
                        value={contributeAmount}
                        onChange={(e) => setContributeAmount(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black"
                      />
                      <button
                        onClick={() => handleAddContribution(goal)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-[#111111] rounded-xl hover:bg-[#2b2b2b] transition-all whitespace-nowrap"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setContributeGoalId(null)}
                        className="px-2 py-1.5 text-xs text-[#5c5c5c] hover:text-[#111111]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setContributeGoalId(goal.id)}
                      className="w-full py-2 rounded-xl text-xs font-medium text-[#111111] bg-white hover:bg-black/5 border border-black/8 transition-all cursor-pointer shadow-2xs text-center"
                    >
                      + Add Contribution
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
