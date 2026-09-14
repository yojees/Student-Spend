import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.error('Failed to initialize GoogleGenAI client:', err);
      aiClient = null;
    }
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI expense parser endpoint
app.post('/api/ai/parse', async (req, res) => {
  const { input } = req.body;
  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Missing input query' });
  }

  const ai = getGeminiClient();
  if (!ai) {
    // Fallback indicator
    return res.json({ useFallback: true });
  }

  try {
    const prompt = `You are a financial parser for a student app called StudentSpend.
Given the student user's input: "${input}"
Extract:
1. "amount": numerical value (number). If not found, return 0.
2. "category": strictly one of ["Food", "Transport", "Education", "Shopping", "Entertainment", "Accommodation", "Bills", "Subscriptions", "Health", "Travel", "Other"].
3. "description": short, clean title describing the purchase.
4. "date": date formatted as YYYY-MM-DD (today is ${new Date().toISOString().split('T')[0]}).

Return strictly valid JSON only:
{"amount": number, "category": string, "description": string, "date": string}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json({ success: true, parsed });
  } catch (err) {
    console.error('Gemini parse error:', err);
    return res.json({ useFallback: true });
  }
});

// AI student finance assistant endpoint
app.post('/api/ai/ask', async (req, res) => {
  const { question, context } = req.body;
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Missing question' });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({ useFallback: true });
  }

  try {
    const systemInstruction = `You are StudentSpend AI, a friendly, concise, empathetic financial companion for university students.
The student has provided their real current finances:
- Monthly Allowance: ${context?.currency || '₹'}${context?.monthlyAllowance || 8000}
- Total Spent this month: ${context?.currency || '₹'}${context?.totalSpent || 0}
- Remaining Budget: ${context?.currency || '₹'}${context?.remainingBudget || 0}
- Category Breakdown: ${JSON.stringify(context?.categoryBreakdown || {})}
- Primary Savings Goal: ${context?.primaryGoal ? `${context.primaryGoal.title} (${context.currency}${context.primaryGoal.savedAmount} / ${context.currency}${context.primaryGoal.targetAmount})` : 'None'}

Provide practical, encouraging, grounded student advice without financial jargon. Never recommend loans, credit, or crypto. Keep your answer under 3-4 sentences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: question,
      config: {
        systemInstruction,
      },
    });

    return res.json({ success: true, answer: response.text || '' });
  } catch (err) {
    console.error('Gemini ask error:', err);
    return res.json({ useFallback: true });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
