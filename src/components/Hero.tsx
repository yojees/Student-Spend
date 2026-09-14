/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Mic, ArrowUp, Check, Edit2, Sparkles, AlertCircle } from 'lucide-react';
import { Expense, ParsedExpense } from '../types';
import { parseNaturalLanguageExpense } from '../utils/parser';
import { getLocalDateString } from '../utils/dateUtils';

interface HeroProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Expense;
  onOpenStructuredModal: () => void;
  onEditExpense: (expense: Expense) => void;
  currency: string;
}

export const Hero: React.FC<HeroProps> = ({
  onAddExpense,
  onOpenStructuredModal,
  onEditExpense,
  currency,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAddedExpense, setLastAddedExpense] = useState<Expense | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Quick prompt rotation / suggestion clicks
  const quickExamples = [
    '₹120 on lunch',
    '₹850 for headphones',
    '₹60 on bus',
    '₹2,000 college fees',
  ];

  // Speech Recognition setup
  const handleVoiceInput = () => {
    setSpeechError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const windowObj = window as any;
    const SpeechRecognition = windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Voice input is not supported in this browser. Please type your expense.');
      setTimeout(() => setSpeechError(null), 3500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputVal(transcript);
        }
        setIsListening(false);
        inputRef.current?.focus();
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        setIsListening(false);
        setSpeechError(`Voice input: ${event.error || 'could not capture speech'}`);
        setTimeout(() => setSpeechError(null), 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
      setSpeechError('Could not start voice recognition.');
      setTimeout(() => setSpeechError(null), 3500);
    }
  };

  const handleQuickAdd = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isProcessing) return;

    setIsProcessing(true);
    let parsed: ParsedExpense;

    try {
      // Attempt server AI parse first, with local fallback
      const response = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputVal.trim() }),
      });
      const data = await response.json();
      if (data.success && data.parsed && data.parsed.amount > 0) {
        parsed = {
          amount: data.parsed.amount,
          category: data.parsed.category || 'Other',
          description: data.parsed.description || inputVal.trim(),
          date: data.parsed.date || getLocalDateString(),
        };
      } else {
        parsed = parseNaturalLanguageExpense(inputVal.trim());
      }
    } catch (err) {
      parsed = parseNaturalLanguageExpense(inputVal.trim());
    }

    const created = onAddExpense({
      amount: parsed.amount,
      category: parsed.category,
      description: parsed.description,
      date: parsed.date,
      paymentMethod: 'UPI',
    });

    setLastAddedExpense(created);
    setShowConfirmation(true);
    setInputVal('');
    setIsProcessing(false);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      {/* Background container as required:
          fill entire hero, uncropped, unobstructed, no artificial overlay, no gradient wash, no dark scrim */}
      <div className="hero__bg absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <svg
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle architectural & organic curved forms harmonized with #eef2ee */}
          <rect width="1440" height="900" fill="#eef2ee" />
          <circle cx="720" cy="180" r="480" fill="#e6ece6" fillOpacity="0.75" />
          <path
            d="M-100 800C300 680 520 840 920 740C1320 640 1400 850 1600 820V950H-100V800Z"
            fill="#e2eae2"
            fillOpacity="0.6"
          />
          <path
            d="M200 150C550 50 880 240 1300 120"
            stroke="#dbe5db"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />
          <circle cx="1250" cy="280" r="140" fill="#e2eae2" fillOpacity="0.45" />
          <circle cx="180" cy="520" r="220" fill="#e5eee5" fillOpacity="0.5" />
        </svg>
      </div>

      <div className="hero__inner">
        <div className="stage animate-rise delay-1">
          {/* Hero Badge */}
          <div className="hero-badge animate-rise delay-1">
            <span className="badge__tag">New</span>
            <span>StudentSpend is built for smarter student money management</span>
          </div>

          {/* Hero Headline */}
          <h1 className="hero-headline animate-rise delay-2">
            Know where your money.<br className="hidden sm:inline" /> goes next.
          </h1>

          {/* Hero Subcopy */}
          <p className="hero-subcopy animate-rise delay-3">
            StudentSpend helps you track expenses, manage your budget, and build better money habits.
            <br className="hidden md:inline" /> See where your money goes, set goals, and make smarter decisions.
          </p>

          {/* Main Interactive Frosted Glass Prompt Card */}
          <div className="w-full flex flex-col items-center animate-rise delay-4">
            <div className="prompt relative">
              {!showConfirmation ? (
                <form onSubmit={handleQuickAdd} className="flex flex-col gap-3">
                  <textarea
                    ref={inputRef}
                    id="hero-expense-input"
                    className="prompt__input"
                    rows={2}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleQuickAdd();
                      }
                    }}
                    placeholder="What did you spend today?"
                    aria-label="Natural language expense input"
                  />

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-1 border-t border-black/5">
                    {/* Left: Structured Add Expense Trigger */}
                    <button
                      type="button"
                      id="hero-modal-open-btn"
                      onClick={onOpenStructuredModal}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#5c5c5c] hover:text-[#111111] hover:bg-black/5 transition-all cursor-pointer"
                      title="Open full expense form"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add expense</span>
                    </button>

                    {/* Right: Voice + Submit Button */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        id="hero-voice-btn"
                        onClick={handleVoiceInput}
                        disabled={isListening}
                        className={`p-2 rounded-full text-[#5c5c5c] hover:text-[#111111] hover:bg-black/5 transition-all cursor-pointer ${
                          isListening ? 'bg-red-50 text-red-600 animate-pulse ring-2 ring-red-400' : ''
                        }`}
                        title={isListening ? 'Listening...' : 'Use voice'}
                        aria-label="Use voice input"
                      >
                        <Mic className="w-4 h-4" />
                      </button>

                      <button
                        type="submit"
                        id="hero-submit-btn"
                        disabled={!inputVal.trim() || isProcessing}
                        className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${
                          inputVal.trim() && !isProcessing
                            ? 'bg-[#111111] text-white hover:bg-[#2b2b2b] shadow-sm'
                            : 'bg-black/10 text-[#5c5c5c] cursor-not-allowed'
                        }`}
                        title="Add expense"
                        aria-label="Add expense"
                      >
                        {isProcessing ? (
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* Expense Confirmation State */
                <div className="flex flex-col gap-3 py-1 animate-rise">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-semibold text-[#111111]">Expense added.</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (lastAddedExpense) {
                            onEditExpense(lastAddedExpense);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#5c5c5c] hover:text-[#111111] hover:bg-black/5 rounded-full transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => setShowConfirmation(false)}
                        className="px-3 py-1 text-xs font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] rounded-full transition-all"
                      >
                        Done
                      </button>
                    </div>
                  </div>

                  {/* Summary row */}
                  {lastAddedExpense && (
                    <div className="flex flex-wrap items-center justify-between px-3.5 py-2.5 bg-white/70 rounded-xl border border-black/5 text-sm">
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-[#111111] text-base">
                          {currency}
                          {lastAddedExpense.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-[#5c5c5c]">{lastAddedExpense.description}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/5 text-[#111111] font-medium">
                          {lastAddedExpense.category}
                        </span>
                        <span className="text-[#5c5c5c]">Today</span>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex items-center justify-center gap-2 pt-2 border-t border-black/5">
                    <button
                      onClick={() => scrollToSection('monthly-spending')}
                      className="text-xs font-medium text-[#5c5c5c] hover:text-[#111111] underline underline-offset-4"
                    >
                      View spending
                    </button>
                    <span className="text-[#5c5c5c]/40">•</span>
                    <button
                      onClick={() => scrollToSection('budget')}
                      className="text-xs font-medium text-[#5c5c5c] hover:text-[#111111] underline underline-offset-4"
                    >
                      Set budget
                    </button>
                    <span className="text-[#5c5c5c]/40">•</span>
                    <button
                      onClick={() => scrollToSection('goals')}
                      className="text-xs font-medium text-[#5c5c5c] hover:text-[#111111] underline underline-offset-4"
                    >
                      Create goal
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error or listening notification */}
            {speechError && (
              <div className="mt-2 text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/60 inline-flex items-center gap-1.5 animate-rise">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>{speechError}</span>
              </div>
            )}

            {/* Example prompt pills */}
            {!showConfirmation && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5 max-w-[620px]">
                <span className="text-[12px] text-[#5c5c5c] font-medium mr-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Try:
                </span>
                {quickExamples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => {
                      setInputVal(ex);
                      inputRef.current?.focus();
                    }}
                    className="text-[12px] font-medium text-[#5c5c5c] hover:text-[#111111] bg-white/60 hover:bg-white px-2.5 py-1 rounded-full border border-black/5 transition-all shadow-2xs"
                  >
                    "{ex}"
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
