/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Expense, ExpenseCategory, PaymentMethod } from '../types';
import { getLocalDateString } from '../utils/dateUtils';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expense: Omit<Expense, 'id' | 'createdAt'>, editingId?: string) => void;
  editingExpense?: Expense | null;
  currency: string;
}

const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Mess',
  'Canteen',
  'Snacks',
  'Transport',
  'Education',
  'Books',
  'Printing',
  'Lab Materials',
  'College Fees',
  'Shopping',
  'Entertainment',
  'Accommodation',
  'Hostel',
  'Laundry',
  'Subscriptions',
  'Bills',
  'Health',
  'Travel',
  'Other',
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'Cash',
  'UPI',
  'Card',
  'Bank Transfer',
  'Other',
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSaveExpense,
  editingExpense,
  currency,
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [date, setDate] = useState(() => getLocalDateString());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');

  useEffect(() => {
    if (editingExpense) {
      setAmount(String(editingExpense.amount));
      setDescription(editingExpense.description);
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setPaymentMethod(editingExpense.paymentMethod);
    } else {
      setAmount('');
      setDescription('');
      setCategory('Food');
      setDate(getLocalDateString());
      setPaymentMethod('UPI');
    }
  }, [editingExpense, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || !description.trim()) return;

    onSaveExpense(
      {
        amount: num,
        description: description.trim(),
        category,
        date,
        paymentMethod,
      },
      editingExpense?.id
    );

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-rise"
    >
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[rgba(248,248,246,0.99)] border border-black/10 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/8 mb-5">
          <h3 className="text-lg font-semibold text-[#111111]">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#5c5c5c] hover:text-[#111111] hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-[#5c5c5c] mb-1">
              Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#5c5c5c]">
                {currency}
              </span>
              <input
                type="number"
                step="any"
                required
                autoFocus
                placeholder="180"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 text-base font-semibold bg-white border border-black/15 rounded-xl outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[#5c5c5c] mb-1">
              Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lunch at college cafeteria"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-[#5c5c5c] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black text-[#111111] cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#5c5c5c] mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5c5c5c] mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black cursor-pointer"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-black/8 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#5c5c5c] hover:text-[#111111]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] rounded-full transition-all shadow-sm"
            >
              {editingExpense ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
