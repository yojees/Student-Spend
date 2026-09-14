/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExpenseCategory, ParsedExpense } from '../types';

export function parseNaturalLanguageExpense(input: string): ParsedExpense {
  const text = input.trim();
  const lower = text.toLowerCase();

  // 1. Extract Amount
  // Matches ₹250, Rs. 250, Rs 250, 250rs, 2,000, 180, etc.
  let amount = 0;
  const amountMatch = text.match(/(?:(?:₹|rs\.?|inr)\s*)?([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)(?:\s*(?:rs|rupees|bucks))?/i);
  
  if (amountMatch && amountMatch[1]) {
    const cleanNum = amountMatch[1].replace(/,/g, '');
    amount = parseFloat(cleanNum);
  }

  // 2. Extract Date
  let date = new Date().toISOString().split('T')[0];
  if (lower.includes('yesterday')) {
    const d = new Date(Date.now() - 86400000);
    date = d.toISOString().split('T')[0];
  } else if (lower.includes('day before yesterday')) {
    const d = new Date(Date.now() - 86400000 * 2);
    date = d.toISOString().split('T')[0];
  } else {
    // Check day of week (e.g. "last saturday", "saturday")
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < days.length; i++) {
      if (lower.includes(days[i])) {
        const todayDay = new Date().getDay();
        const diff = (todayDay - i + 7) % 7 || 7;
        const target = new Date(Date.now() - diff * 86400000);
        date = target.toISOString().split('T')[0];
        break;
      }
    }
  }

  // 3. Category Detection
  let category: ExpenseCategory = 'Other';

  if (/(lunch|dinner|breakfast|food|cafe|restaurant|coffee|chai|tea|snack|snacks|burger|pizza|biryani|mess|canteen|maggi|groceries|eat)/i.test(lower)) {
    category = 'Food';
  } else if (/(bus|train|metro|auto|rickshaw|uber|ola|rapido|cab|petrol|fuel|ticket|transport|commute)/i.test(lower)) {
    category = 'Transport';
  } else if (/(book|books|printing|xerox|notes|course|fees|fee|lab|tuition|exam|stationary|pen|notebook|college fees)/i.test(lower)) {
    category = 'Education';
  } else if (/(movie|cinema|netflix|spotify|game|gaming|prime|party|outing|club|concert|entertainment)/i.test(lower)) {
    category = 'Entertainment';
  } else if (/(headphones|clothes|shirt|shoes|shopping|amazon|flipkart|myntra|electronics|gadget|watch)/i.test(lower)) {
    category = 'Shopping';
  } else if (/(hostel|pg|room|rent|accommodation|deposit)/i.test(lower)) {
    category = 'Accommodation';
  } else if (/(recharge|wifi|broadband|electricity|bill|bills|water)/i.test(lower)) {
    category = 'Bills';
  } else if (/(medicine|pharmacy|doctor|tablet|clinic|health|gym)/i.test(lower)) {
    category = 'Health';
  } else if (/(flight|irctc|trip|travel|vacation|home)/i.test(lower)) {
    category = 'Travel';
  } else if (/(laundry|wash|ironing)/i.test(lower)) {
    category = 'Laundry';
  }

  // 4. Extract Description
  // Clean out common filler words and amount tokens
  let cleaned = text
    .replace(/(?:₹|rs\.?|inr)\s*[0-9,]+(?:\.[0-9]{1,2})?/gi, '')
    .replace(/[0-9,]+(?:\.[0-9]{1,2})?\s*(?:rs|rupees|bucks)?/gi, '')
    .replace(/\b(spent|pay|paid|for|on|at|today|yesterday|last|saturday|sunday|monday|tuesday|wednesday|thursday|friday)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If cleaned string is too short or empty, provide a clean fallback based on category or words
  if (!cleaned || cleaned.length < 2) {
    if (category !== 'Other') {
      cleaned = `${category} expense`;
    } else {
      cleaned = 'General expense';
    }
  } else {
    // Capitalize first letter
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return {
    amount: amount || 100,
    category,
    description: cleaned,
    date,
  };
}
