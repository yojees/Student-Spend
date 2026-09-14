/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, Plus, Check, Clock, Trash2 } from 'lucide-react';
import { SplitExpense } from '../types';

interface SplitExpensesProps {
  splits: SplitExpense[];
  currency: string;
  onAddSplit: (split: Omit<SplitExpense, 'id' | 'createdAt'>) => void;
  onToggleStatus: (splitId: string, participantIndex: number) => void;
  onDeleteSplit: (splitId: string) => void;
}

export const SplitExpenses: React.FC<SplitExpensesProps> = ({
  splits,
  currency,
  onAddSplit,
  onToggleStatus,
  onDeleteSplit,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [friendsInput, setFriendsInput] = useState('Rohan, Priya, Sameer');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const total = parseFloat(totalAmount);
    if (!title.trim() || !total) return;

    const names = [
      'You',
      ...friendsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    ];

    const share = Math.round(total / names.length);
    const participants = names.map((name, idx) => ({
      name,
      share,
      paid: idx === 0, // 'You' is paid by default as organizer
    }));

    onAddSplit({
      title: title.trim(),
      totalAmount: total,
      participants,
    });

    setTitle('');
    setTotalAmount('');
    setShowForm(false);
  };

  return (
    <div id="split-expenses" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5c5c]">
            Roommates & Group Hangouts
          </span>
          <h2 className="text-2xl font-medium tracking-tight text-[#111111] mt-0.5">
            Split an expense
          </h2>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] transition-all cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          {showForm ? 'Cancel' : 'New Split'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 mb-6 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/8 shadow-sm flex flex-col gap-4 animate-rise"
        >
          <h3 className="text-base font-semibold text-[#111111]">Create Split Group</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-[#5c5c5c] mb-1">Expense Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Hostel Pizza, Taxi to Station"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs text-[#5c5c5c] mb-1">Total Bill ({currency})</label>
              <input
                type="number"
                required
                placeholder="1200"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs text-[#5c5c5c] mb-1">
                Friends (comma-separated)
              </label>
              <input
                type="text"
                placeholder="Rohan, Priya, Sameer"
                value={friendsInput}
                onChange={(e) => setFriendsInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-medium text-[#5c5c5c] hover:text-[#111111]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] rounded-full transition-all"
            >
              Calculate Split
            </button>
          </div>
        </form>
      )}

      {/* Split Cards Grid or Empty State */}
      {splits.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-[rgba(248,248,246,0.97)] border border-black/8 shadow-2xs flex flex-col items-center justify-center">
          <div className="w-11 h-11 rounded-2xl bg-black/5 flex items-center justify-center mb-3 text-[#111111]">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-[#111111]">No split expenses yet</h3>
          <p className="text-xs text-[#5c5c5c] mt-1 max-w-sm">
            Split hostel pizza nights, shared groceries, cab fares, or semester project supplies with roommates.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-4 py-2 text-xs font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] rounded-full transition-all"
          >
            + Create First Split
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {splits.map((split) => {
            const paidCount = split.participants.filter((p) => p.paid).length;
            const totalPeople = split.participants.length;

            return (
              <div
                key={split.id}
                className="p-6 rounded-2xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs hover:border-black/15 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-base font-semibold text-[#111111]">{split.title}</h3>
                      <span className="text-xs text-[#5c5c5c]">
                        Total: {currency}
                        {split.totalAmount.toLocaleString('en-IN')} • {currency}
                        {split.participants[0]?.share} each
                      </span>
                    </div>
                    <button
                      onClick={() => onDeleteSplit(split.id)}
                      className="p-1 text-[#5c5c5c] hover:text-rose-600 rounded"
                      title="Delete split"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    {split.participants.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-black/4 text-xs"
                      >
                        <span className="font-medium text-[#111111]">{p.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[#111111]">
                            {currency}
                            {p.share.toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => onToggleStatus(split.id, idx)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                              p.paid
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            }`}
                          >
                            {p.paid ? (
                              <>
                                <Check className="w-3 h-3" />
                                Paid
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" />
                                Pending
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-black/4 flex items-center justify-between text-xs text-[#5c5c5c]">
                  <span>Status</span>
                  <span className="font-medium text-[#111111]">
                    {paidCount} of {totalPeople} Settled
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
