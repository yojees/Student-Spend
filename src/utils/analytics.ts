/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AffordabilityResult,
  Expense,
  MonthlyBudget,
  SavingsGoal,
  SmartInsight,
  StudentProfile,
} from '../types';

export function calculateTotalSpent(expenses: Expense[]): number {
  return expenses.reduce((acc, exp) => acc + exp.amount, 0);
}

export function calculateTotalSaved(goals: SavingsGoal[]): number {
  return goals.reduce((acc, g) => acc + g.savedAmount, 0);
}

export function calculateCategoryBreakdown(expenses: Expense[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const exp of expenses) {
    result[exp.category] = (result[exp.category] || 0) + exp.amount;
  }
  return result;
}

export function evaluateAffordability(
  amount: number,
  expenses: Expense[],
  budget: MonthlyBudget,
  profile: StudentProfile | null,
  goals: SavingsGoal[]
): AffordabilityResult {
  const totalSpent = calculateTotalSpent(expenses);
  const currency = profile?.currency || '₹';
  const allowance = budget.monthlyAllowance || profile?.monthlyMoney || 0;
  const remainingBefore = Math.max(0, allowance - totalSpent);
  const remainingAfter = remainingBefore - amount;
  const impactPercentage = remainingBefore > 0 ? Math.round((amount / remainingBefore) * 100) : 100;

  let status: 'SAFE' | 'THINK ABOUT IT' | 'NOT RECOMMENDED' = 'SAFE';
  let explanation = '';

  if (amount <= 0) {
    return {
      status: 'SAFE',
      amount,
      remainingBudgetBefore: remainingBefore,
      remainingBudgetAfter: remainingBefore,
      budgetImpactPercentage: 0,
      explanation: 'Please enter a valid amount to evaluate.',
    };
  }

  if (allowance === 0) {
    return {
      status: 'THINK ABOUT IT',
      amount,
      remainingBudgetBefore: 0,
      remainingBudgetAfter: 0,
      budgetImpactPercentage: 100,
      explanation: `You haven't set a monthly budget yet. Set your monthly allowance in the Budget section to evaluate affordability.`,
    };
  }

  if (amount > remainingBefore) {
    status = 'NOT RECOMMENDED';
    explanation = `This purchase would exceed your remaining monthly allowance by ${currency}${Math.abs(remainingAfter).toLocaleString('en-IN')}. Consider postponing or saving up first.`;
  } else if (impactPercentage > 45 || remainingAfter < 800) {
    status = 'THINK ABOUT IT';
    explanation = `You can technically afford this, but it takes ${impactPercentage}% of your remaining budget, leaving only ${currency}${remainingAfter.toLocaleString('en-IN')} for upcoming essential expenses.`;
  } else if (impactPercentage > 20) {
    status = 'THINK ABOUT IT';
    explanation = `You can afford this, but it would reduce your remaining monthly budget by ${impactPercentage}%. Make sure your academic and food needs are covered.`;
  } else {
    status = 'SAFE';
    explanation = `Comfortably within your budget! This purchase uses only ${impactPercentage}% of your remaining allowance, leaving ${currency}${remainingAfter.toLocaleString('en-IN')} for the rest of the month.`;
  }

  return {
    status,
    amount,
    remainingBudgetBefore: remainingBefore,
    remainingBudgetAfter: Math.max(0, remainingAfter),
    budgetImpactPercentage: impactPercentage,
    explanation,
  };
}

export function generateSmartInsights(
  expenses: Expense[],
  budget: MonthlyBudget,
  goals: SavingsGoal[],
  profile: StudentProfile | null
): SmartInsight[] {
  const insights: SmartInsight[] = [];
  const currency = profile?.currency || '₹';
  const totalSpent = calculateTotalSpent(expenses);
  const allowance = budget.monthlyAllowance || profile?.monthlyMoney || 0;
  const remaining = allowance - totalSpent;
  const breakdown = calculateCategoryBreakdown(expenses);

  if (expenses.length === 0) {
    insights.push({
      id: 'ins-empty-1',
      title: 'Fresh Start',
      description: `Your account is ready with ${currency}0 spent this month. Log your everyday expenses to see real-time smart tips.`,
      type: 'positive',
    });

    if (allowance > 0) {
      insights.push({
        id: 'ins-empty-2',
        title: 'Monthly Allowance Configured',
        description: `Your monthly budget is ${currency}${allowance.toLocaleString('en-IN')}. As you add expenses, we'll monitor your run-rate automatically.`,
        type: 'neutral',
      });
    }

    if (goals.length === 0) {
      insights.push({
        id: 'ins-empty-3',
        title: 'Set Your First Goal',
        description: `Planning a semester trip or laptop upgrade? Add a savings goal to keep your extra cash working for you.`,
        type: 'neutral',
      });
    }

    return insights;
  }

  // 1. Budget Pace
  if (allowance > 0) {
    if (remaining > allowance * 0.4) {
      insights.push({
        id: 'ins-1',
        title: 'Healthy Budget Pacing',
        description: `You are currently in a great spot with ${currency}${remaining.toLocaleString('en-IN')} remaining of your ${currency}${allowance.toLocaleString('en-IN')} allowance.`,
        type: 'positive',
      });
    } else if (remaining < allowance * 0.15) {
      insights.push({
        id: 'ins-1',
        title: 'Approaching Monthly Limit',
        description: `You have used ${Math.round((totalSpent / allowance) * 100)}% of your monthly allowance. Focus on essentials for the remaining days.`,
        type: 'warning',
      });
    }
  }

  // 2. Top Category
  const sortedCategories = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  if (sortedCategories.length > 0) {
    const [topCat, topAmt] = sortedCategories[0];
    const pct = totalSpent > 0 ? Math.round((topAmt / totalSpent) * 100) : 0;
    insights.push({
      id: 'ins-2',
      title: `${topCat} is your highest expense`,
      description: `You've spent ${currency}${topAmt.toLocaleString('en-IN')} (${pct}% of total) on ${topCat} this month.`,
      type: 'neutral',
    });
  }

  // 3. Goal Booster Insight
  if (goals.length > 0) {
    const primaryGoal = goals[0];
    const leftToSave = Math.max(0, primaryGoal.targetAmount - primaryGoal.savedAmount);
    if (leftToSave > 0) {
      insights.push({
        id: 'ins-3',
        title: `Goal Booster: ${primaryGoal.title}`,
        description: `You could reach your ${primaryGoal.title} goal faster by setting aside just ${currency}250 more each week.`,
        type: 'positive',
      });
    }
  }

  // 4. Student Specific Category Insight
  const messAndCanteen = (breakdown['Food'] || 0);
  if (messAndCanteen > 1500) {
    insights.push({
      id: 'ins-4',
      title: 'Food & Dining Trend',
      description: `Food spending is currently at ${currency}${messAndCanteen.toLocaleString('en-IN')}. Cooking with roommates or canteen passes can cut this by ~15%.`,
      type: 'neutral',
    });
  }

  return insights;
}

export function answerStudentQuestion(
  query: string,
  expenses: Expense[],
  budget: MonthlyBudget,
  goals: SavingsGoal[],
  profile: StudentProfile | null
): string {
  const q = query.toLowerCase().trim();
  const currency = profile?.currency || '₹';
  const totalSpent = calculateTotalSpent(expenses);
  const allowance = budget.monthlyAllowance || profile?.monthlyMoney || 0;
  const remaining = allowance - totalSpent;
  const breakdown = calculateCategoryBreakdown(expenses);

  if (expenses.length === 0) {
    if (q.includes('where am i spending') || q.includes('most') || q.includes('biggest')) {
      return `You haven't logged any expenses yet! Start by typing an expense like "${currency}180 lunch" into the quick input above.`;
    }
    if (q.includes('afford')) {
      return `You haven't logged any expenses yet. Your remaining budget is ${currency}${allowance.toLocaleString('en-IN')}. Log expenses to evaluate purchase safety against real daily spending.`;
    }
    return `Welcome to StudentSpend! You're starting fresh with ${currency}0 spent this month out of your ${currency}${allowance.toLocaleString('en-IN')} budget. Type something like "${currency}180 lunch" in the top bar to record your first expense!`;
  }

  // "Where am I spending the most?" or "biggest expenses"
  if (q.includes('where am i spending') || q.includes('most') || q.includes('biggest expense')) {
    const sorted = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return 'You have not logged any expenses yet this month.';
    const [topCat, topAmt] = sorted[0];
    const topExp = [...expenses].sort((a, b) => b.amount - a.amount)[0];
    return `Your biggest spending category is **${topCat}** at **${currency}${topAmt.toLocaleString('en-IN')}** (${Math.round((topAmt / totalSpent) * 100)}% of all spending). Your largest single transaction was "${topExp?.description}" for **${currency}${topExp?.amount.toLocaleString('en-IN')}**.`;
  }

  // "Can I afford..."
  const affordMatch = q.match(/(?:afford|buy|purchase)\s*(?:(?:₹|rs\.?)\s*)?([0-9]+)/i);
  if (affordMatch || q.includes('can i afford')) {
    const amt = affordMatch ? parseInt(affordMatch[1], 10) : 1500;
    const evalRes = evaluateAffordability(amt, expenses, budget, profile, goals);
    return `**${evalRes.status}**: ${evalRes.explanation} (Current balance remaining: ${currency}${remaining.toLocaleString('en-IN')}).`;
  }

  // "How much did I spend on food?" / category queries
  const categories = ['food', 'transport', 'education', 'shopping', 'entertainment', 'accommodation', 'bills', 'health', 'travel'];
  for (const cat of categories) {
    if (q.includes(cat)) {
      const matchKey = Object.keys(breakdown).find(k => k.toLowerCase() === cat);
      const spentOnCat = matchKey ? breakdown[matchKey] : 0;
      const catBudget = budget.categoryBudgets[matchKey || ''] || 0;
      let budgetNote = '';
      if (catBudget > 0) {
        const pct = Math.round((spentOnCat / catBudget) * 100);
        budgetNote = ` Your monthly ${cat} budget is ${currency}${catBudget.toLocaleString('en-IN')} (${pct}% utilized).`;
      }
      return `You have spent **${currency}${spentOnCat.toLocaleString('en-IN')}** on **${cat.toUpperCase()}** this month across your recorded transactions.${budgetNote}`;
    }
  }

  // "How much can I save this month?"
  if (q.includes('save this month') || q.includes('how much can i save')) {
    if (remaining > 0) {
      return `Based on your monthly allowance of ${currency}${allowance.toLocaleString('en-IN')} and spending of ${currency}${totalSpent.toLocaleString('en-IN')}, you can potentially save up to **${currency}${remaining.toLocaleString('en-IN')}** if you maintain your current daily average!`;
    }
    return `Currently your spending (${currency}${totalSpent.toLocaleString('en-IN')}) has reached your allowance. Focus on eliminating discretionary purchases for the rest of the month.`;
  }

  // "Why did I spend more this month?"
  if (q.includes('why') || q.includes('spend more')) {
    const sorted = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 3);
    const names = sorted.map(e => `"${e.description}" (${currency}${e.amount})`).join(', ');
    return `The main drivers of your spending this month were your top transactions: ${names}. Food & Mess accounted for the largest overall proportion.`;
  }

  // "Help me make a budget"
  if (q.includes('make a budget') || q.includes('help me budget')) {
    return `A healthy student 50/30/20 budget on ${currency}${allowance.toLocaleString('en-IN')}:
• **Essentials (50%)**: ${currency}${Math.round(allowance * 0.5)} (Mess, books, hostel/travel)
• **Lifestyle & Social (30%)**: ${currency}${Math.round(allowance * 0.3)} (Cafes, movies, outings)
• **Savings & Emergencies (20%)**: ${currency}${Math.round(allowance * 0.2)} (Goes straight to your ${goals[0]?.title || 'goals'})`;
  }

  // Default helpful response with real numbers
  return `Currently you have spent **${currency}${totalSpent.toLocaleString('en-IN')}** out of your **${currency}${allowance.toLocaleString('en-IN')}** monthly allowance. You have **${currency}${Math.max(0, remaining).toLocaleString('en-IN')}** remaining and have saved **${currency}${calculateTotalSaved(goals).toLocaleString('en-IN')}** towards your goals. Ask me about specific categories or whether you can afford an item!`;
}
