/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, UserCheck } from 'lucide-react';
import { StudentProfile, StudentType } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile | null;
  onSaveProfile: (profile: StudentProfile) => void;
}

const STUDENT_TYPES: StudentType[] = [
  'Day Scholar',
  'Hostel Student',
  'PG Student',
  'Living with Family',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(profile?.name || '');
  const [studentType, setStudentType] = useState<StudentType>(profile?.studentType || 'Hostel Student');
  const [monthlyMoney, setMonthlyMoney] = useState(profile?.monthlyMoney ? String(profile.monthlyMoney) : '');
  const [savingsGoal, setSavingsGoal] = useState(profile?.savingsGoal || '');
  const [currency, setCurrency] = useState(profile?.currency || '₹');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setStudentType(profile.studentType);
      setMonthlyMoney(profile.monthlyMoney ? String(profile.monthlyMoney) : '');
      setSavingsGoal(profile.savingsGoal);
      setCurrency(profile.currency || '₹');
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: name.trim() || 'Student',
      studentType,
      monthlyMoney: Math.max(0, Number(monthlyMoney) || 0),
      savingsGoal: savingsGoal.trim(),
      currency: currency.trim() || '₹',
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-rise"
    >
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[rgba(248,248,246,0.99)] border border-black/10 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-black/8 mb-5">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#111111]" />
            <h3 className="text-lg font-semibold text-[#111111]">Student Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#5c5c5c] hover:text-[#111111] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#5c5c5c] mb-1">
              Your Name
            </label>
            <input
              type="text"
              placeholder="e.g. Student"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5c5c5c] mb-1">
              Student Housing Setup
            </label>
            <select
              value={studentType}
              onChange={(e) => setStudentType(e.target.value as StudentType)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black"
            >
              {STUDENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#5c5c5c] mb-1">
                Monthly Allowance
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 8000"
                value={monthlyMoney}
                onChange={(e) => setMonthlyMoney(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5c5c5c] mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5c5c5c] mb-1">
              Primary Financial Ambition
            </label>
            <input
              type="text"
              placeholder="e.g. Laptop Upgrade, Trip Fund"
              value={savingsGoal}
              onChange={(e) => setSavingsGoal(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-black/15 rounded-xl outline-none focus:border-black"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-black/8 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#5c5c5c] hover:text-[#111111]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] rounded-full transition-all cursor-pointer shadow-2xs"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
