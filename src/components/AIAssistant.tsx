/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import { AIMessage, Expense, MonthlyBudget, SavingsGoal, StudentProfile } from '../types';
import { answerStudentQuestion, calculateCategoryBreakdown, calculateTotalSpent } from '../utils/analytics';

interface AIAssistantProps {
  expenses: Expense[];
  budget: MonthlyBudget;
  goals: SavingsGoal[];
  profile: StudentProfile | null;
  currency: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  expenses,
  budget,
  goals,
  profile,
  currency,
}) => {
  const displayName = profile?.name?.trim() ? profile.name.split(' ')[0] : 'there';
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Hello ${displayName}! I'm StudentSpend AI. I analyze your real expenses, allowances, and goals to help you make smarter financial choices. Ask me anything about your money!`,
      timestamp: Date.now(),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const sampleQuestions = [
    'Where am I spending the most?',
    'Can I afford ₹1,500 headphones?',
    'How much did I spend on food?',
    'How much can I save this month?',
    'Help me make a budget.',
    'Show my biggest expenses.',
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || inputQuery;
    if (!textToSend.trim() || isAsking) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsAsking(true);

    let answer = '';

    try {
      const totalSpent = calculateTotalSpent(expenses);
      const allowance = budget.monthlyAllowance || profile?.monthlyMoney || 0;
      const breakdown = calculateCategoryBreakdown(expenses);

      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend.trim(),
          context: {
            currency,
            monthlyAllowance: allowance,
            totalSpent,
            remainingBudget: Math.max(0, allowance - totalSpent),
            categoryBreakdown: breakdown,
            primaryGoal: goals[0] || null,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.answer) {
        answer = data.answer;
      } else {
        answer = answerStudentQuestion(textToSend, expenses, budget, goals, profile);
      }
    } catch (err) {
      console.warn('AI endpoint unavailable, using local deterministic fallback:', err);
      answer = answerStudentQuestion(textToSend, expenses, budget, goals, profile);
    }

    const aiMsg: AIMessage = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: answer,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsAsking(false);
  };

  return (
    <div id="insights" className="w-full">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5c5c]">
          Personal Companion
        </span>
        <h2 className="text-2xl font-medium tracking-tight text-[#111111] mt-0.5">
          Ask StudentSpend AI
        </h2>
        <p className="text-xs text-[#5c5c5c] mt-1">
          Grounded directly in your active transaction records, budget caps, and savings progress.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-[rgba(248,248,246,0.97)] border border-black/6 shadow-2xs flex flex-col gap-5">
        {/* Messages List */}
        <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs leading-relaxed ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] sm:max-w-[75%] whitespace-pre-line ${
                    isUser
                      ? 'bg-[#111111] text-white rounded-tr-none'
                      : 'bg-white text-[#111111] border border-black/6 shadow-2xs rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center shrink-0 mt-0.5 text-[#111111]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isAsking && (
            <div className="flex gap-3 text-xs items-center text-[#5c5c5c]">
              <div className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span className="italic">Analyzing financial numbers...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-black/5">
          <span className="text-[11px] font-semibold text-[#5c5c5c] py-1">Try asking:</span>
          {sampleQuestions.slice(0, 4).map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-[11px] text-[#5c5c5c] hover:text-[#111111] bg-white hover:bg-black/5 px-2.5 py-1 rounded-full border border-black/6 transition-colors"
            >
              "{q}"
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-2"
        >
          <input
            type="text"
            placeholder="Ask about spending velocity, budget limits, or affordability..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isAsking}
            className="flex-1 px-4 py-2.5 text-xs bg-white border border-black/10 rounded-full outline-none focus:border-black transition-all shadow-2xs disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isAsking}
            className="w-9 h-9 rounded-full bg-[#111111] text-white hover:bg-[#2b2b2b] disabled:bg-black/20 flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
