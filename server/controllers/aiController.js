import { callGeminiModel } from '../services/geminiService.js';
import { callNvidiaModel } from '../services/nvidiaService.js';
import { callHuggingFaceModel } from '../services/huggingfaceService.js';

const generateFallbackMentorAnswer = (query = '', persona = 'mentor') => {
  const q = query.toLowerCase().trim();

  if (q.includes('let') || q.includes('const') || q.includes('var')) {
    return `In JavaScript:
- **\`const\`**: Default choice. Block-scoped, read-only constant reference. Cannot be re-assigned.
- **\`let\`**: Use when value will change. Block-scoped, re-assignable within its block.
- **\`var\`**: Legacy ES5 declaration. Function-scoped, hoisted to top. Avoid in modern JS.

\`\`\`javascript
const maxLimit = 10; // Cannot be changed
let currentScore = 0; // Can be updated
currentScore += 5;

console.log({ maxLimit, currentScore }); // { maxLimit: 10, currentScore: 5 }
\`\`\`

**Key Takeaway**:
Mutating \`const\` objects/arrays works (e.g. \`const obj = {}; obj.a = 1;\`), but re-assigning \`obj = {}\` throws \`TypeError\`.`;
  }

  if (q.includes('async') || q.includes('await') || q.includes('promise')) {
    return `**Async/Await** lets JavaScript perform network API calls and database queries without freezing the UI thread.
- **Promise**: Represents an asynchronous operation result (\`Pending\`, \`Fulfilled\`, or \`Rejected\`).
- **\`async\`**: Wraps a function return value in a Promise.
- **\`await\`**: Pauses function execution until Promise resolves.

\`\`\`javascript
async function fetchUserData(userId) {
  try {
    const res = await fetch(\`/api/user/\${userId}\`);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    const user = await res.json();
    return user;
  } catch (err) {
    console.error("Fetch failed:", err.message);
    return null;
  }
}
\`\`\`

**Key Takeaway**:
Always wrap \`await\` in \`try...catch\` to prevent unhandled promise rejection crashes.`;
  }

  if (q.includes('useeffect') || q.includes('react hook') || q.includes('lifecycle')) {
    return `React's **\`useEffect\`** Hook synchronizes component rendering with side-effects (data fetching, DOM subscriptions, timers).

\`\`\`jsx
import React, { useState, useEffect } from 'react';

export function ProfileWidget({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    fetch(\`/api/user/\${userId}\`)
      .then(r => r.json())
      .then(data => { if (isCurrent) setUser(data); });

    return () => { isCurrent = false; }; // Cleanup
  }, [userId]); // Dependency array: re-runs when userId changes

  return <div>{user ? user.name : 'Loading...'}</div>;
}
\`\`\`

**Key Takeaway**:
Forgetting the dependency array causes an infinite render loop. Pass \`[]\` for mount-only effects.`;
  }

  if (q.includes('flex') || q.includes('grid') || q.includes('css')) {
    return `- **Flexbox (1D)**: Align items along a single axis (row or column). Ideal for navbars, buttons, centering items.
- **CSS Grid (2D)**: Define rows AND columns simultaneously. Ideal for overall page layout and card grids.

\`\`\`css
/* Flexbox Center */
.center-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Grid 3-Column Responsive */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
\`\`\``;
  }

  if (q.includes('closure') || q.includes('scope')) {
    return `A **Closure** is an inner function that remembers variables from its outer lexical parent scope even after outer function execution finishes.

\`\`\`javascript
function createCounter() {
  let count = 0; // Encapsulated private state
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
\`\`\``;
  }

  if (q.includes('express') || q.includes('middleware') || q.includes('node')) {
    return `In **Express.js**, middleware functions execute sequentially during the HTTP request-response cycle before sending a response.

\`\`\`javascript
import express from 'express';
const app = express();

app.use(express.json()); // Built-in JSON body parser middleware

// Custom Logger Middleware
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next(); // Pass control to next route handler
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(5000, () => console.log("Server running on port 5000"));
\`\`\``;
  }

  if (q.includes('mongo') || q.includes('mongoose') || q.includes('database') || q.includes('schema')) {
    return `**MongoDB** is a NoSQL document database storing BSON/JSON documents. **Mongoose** is an ODM library that enforces schemas and validation in Node.js.

\`\`\`javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Create new user document
async function createUser(data) {
  const newUser = new User(data);
  return await newUser.save();
}
\`\`\``;
  }

  // Dynamic universal topic breakdown for all other queries
  return `### Topic Breakdown: ${query.toUpperCase()}
- **Basics**: Core definitions, syntax rules, and foundational mechanics.
- **Intermediate**: Practical patterns, data flow, and handling error boundaries.
- **Advanced**: Optimization, production architecture, and edge cases.

### Core Concept
When learning **${query.trim()}**:
- **Why It Exists**: Solves real engineering challenges by organizing logic cleanly and reducing manual errors.
- **What Problem It Solves**: Provides a structured, maintainable pattern to build reliable software components.

### Code Example

\`\`\`javascript
// Practical implementation example for: ${query.trim()}
function calculateOrderTotal(items, discountRate = 0) {
  if (!Array.isArray(items) || items.length === 0) {
    return 0;
  }

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * discountRate;
  const grandTotal = subtotal - discountAmount;

  return {
    subtotal: subtotal.toFixed(2),
    discount: discountAmount.toFixed(2),
    total: grandTotal.toFixed(2)
  };
}

// Test dataset
const cartItems = [
  { name: "JavaScript Book", price: 29.99, quantity: 2 },
  { name: "Code Editor Theme", price: 9.99, quantity: 1 }
];

const checkoutSummary = calculateOrderTotal(cartItems, 0.1);
console.log("🛒 Checkout Summary:", checkoutSummary);
\`\`\`

**Check Your Understanding**:
1. What does the \`items.reduce()\` method do in the code example above?
2. How does setting default parameters (\`discountRate = 0\`) prevent runtime errors when arguments are omitted?

**Practice Task**:
Modify the \`calculateOrderTotal\` function to include an optional \`taxRate\` parameter (default 5%) and calculate the final amount after tax.

**Learning Roadmap**:
- Step 1: Master foundational syntax and data structures.
- Step 2: Build 2 small hands-on projects applying this concept.
- Step 3: Review edge cases and performance optimization strategies.`;
};

export const handleAIMentorQuery = async (req, res) => {
  try {
    const { query, persona = 'mentor', conversationHistory = [], systemPrompt = '' } = req.body;
    if (!query?.trim()) return res.status(400).json({ success: false, error: 'query is required' });

    const messages = [
      { role: 'system', content: `${systemPrompt}\n\nAnswer the learner directly, accurately, and in the same language style they use. Never print meta section titles like "1. Roadmap / Breakdown" or "2. Concept Explanation".` },
      ...conversationHistory.slice(-6).map(message => ({
        role: message.sender === 'user' ? 'user' : 'assistant',
        content: message.text
      })),
      { role: 'user', content: query }
    ];

    const fetchAiAnswerWithTimeout = async () => {
      // 1. Try HuggingFace / Novita DeepSeek model
      try {
        const hfResult = await callHuggingFaceModel({
          messages,
          maxTokens: 1500,
          model: process.env.HUGGINGFACE_MODEL || 'deepseek-ai/DeepSeek-V3.2-Exp:novita'
        });
        if (hfResult && hfResult.content) {
          return { model: hfResult.model || 'deepseek-ai/DeepSeek-V3.2-Exp:novita', content: hfResult.content };
        }
      } catch (hfErr) {
        console.warn('HuggingFace DeepSeek call skipped/failed, trying Gemini model:', hfErr.message);
      }

      // 2. Try Gemini model fallback
      try {
        const result = await callGeminiModel({ messages, maxTokens: 1000 });
        if (result && result.content) {
          return { model: result.model || 'gemini-2.5-flash', content: result.content };
        }
      } catch (geminiErr) {
        console.warn('Gemini call failed on server, trying NVIDIA fallback:', geminiErr.message);
      }

      // 3. Try NVIDIA model fallback
      try {
        const nvidiaResult = await callNvidiaModel({ messages, maxTokens: 1000 });
        if (nvidiaResult && nvidiaResult.content) {
          return { model: 'meta/llama-3.2-11b-vision-instruct', content: nvidiaResult.content };
        }
      } catch (nvidiaErr) {
        console.warn('NVIDIA fallback failed:', nvidiaErr.message);
      }

      throw new Error('AI providers returned empty payload');
    };

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Fast AI response timeout')), 5000)
    );

    try {
      const aiResult = await Promise.race([fetchAiAnswerWithTimeout(), timeoutPromise]);
      return res.json({
        success: true,
        model: aiResult.model,
        content: aiResult.content
      });
    } catch (fastErr) {
      console.warn('AI mentor call timed out / skipped (< 3.0s), serving instant response engine:', fastErr.message);
    }

    return res.json({
      success: true,
      model: 'server-mentor-engine',
      content: generateFallbackMentorAnswer(query, persona)
    });
  } catch (err) {
    console.error('AI mentor error:', err);
    res.status(500).json({ success: false, error: 'Unable to generate mentor answer' });
  }
};

export const handleVoiceReflection = async (req, res) => {
  try {
    const { 
      morningGoals = [], 
      activePhaseTitle = 'Current Phase', 
      studentSpeechInput, 
      conversationHistory = [],
      forwardedGoals = [],
      sessionMinutesElapsed = 0,
      isConcluding = false
    } = req.body;
    if (!studentSpeechInput?.trim()) return res.status(400).json({ success: false, error: 'studentSpeechInput is required' });

    const goalsSummary = morningGoals.length
      ? morningGoals.map((goal, index) => `${index + 1}. "${goal.title}" (${goal.completed ? '100% Completed ✓' : `${goal.progress || 0}% Progress`})`).join('\n')
      : '- No daily goals recorded for today.';

    const forwardedSummary = forwardedGoals.length > 0
      ? forwardedGoals.map((g, i) => `${i + 1}. "${g.title}"`).join('\n')
      : 'None (all daily goals completed or none scheduled)';

    // Count user turns in conversation history
    const previousUserTurns = conversationHistory.filter(m => m.sender === 'user').length;
    const isFirstReflectionTurn = previousUserTurns === 0;

    try {
      const result = await callNvidiaModel({
        maxTokens: 850,
        messages: [
          {
            role: 'system',
            content: `You are an elite AI Engineering Mentor conducting a comprehensive, deep-dive 30-Minute Daily Reflection & Technical Mastery Dialogue for software engineering students.

Active Phase: ${activePhaseTitle}
Student's Morning Goals:
${goalsSummary}
Incomplete Tasks Forwarded to Tomorrow:
${forwardedSummary}
Session Time Elapsed: ~${sessionMinutesElapsed} minutes (Target: 30 minutes in-depth reflection)
Session State: ${isFirstReflectionTurn ? 'TURN 1: Full Reflection Intake' : isConcluding ? 'CONCLUDING: Final Comprehensive Session Report' : 'INTERACTIVE DEEP-DIVE: Continuous Cross-Questioning Until Conceptual Mastery is Satisfied'}

MANDATORY RULES & DIALOGUE PROTOCOL:
1. STRICT ENGLISH-ONLY COMMUNICATION (ZERO HINDI / ZERO HINGLISH):
   Every single word you output MUST be in fluent, professional, supportive ENGLISH.
   DO NOT use any Hindi or Hinglish words under any circumstances.

2. TURN 1 (STUDENT SHARES ENTIRE REFLECTION ALL AT ONCE):
   ${isFirstReflectionTurn ? `The student has just shared their complete day's reflection covering completed tasks, concepts learned, and what wasn't finished.
   Your response MUST:
   a) Acknowledge their daily accomplishment warmly and confirm task rollover: explicitly state that their ${forwardedGoals.length > 0 ? `${forwardedGoals.length} unfinished daily goals have been automatically forwarded to tomorrow's queue` : 'daily targets are recorded and locked in'}.
   b) Identify all the technical concepts, code, and problems they mentioned.
   c) Ask 2 sharp, targeted conceptual questions on their primary topic to begin our deep-dive discussion.
   d) Prompt them: "Answer these in your own words, and we will thoroughly explore all your topics today until we verify complete conceptual mastery!"` : 'Follow dialogue instructions below.'}

3. INTERACTIVE CROSS-QUESTIONING (UNTIL FULLY SATISFIED ON ALL TOPICS):
   ${!isFirstReflectionTurn && !isConcluding ? `DO NOT end the reflection session prematurely! The student is in a thorough 30-minute deep-dive reflection dialogue. You must keep cross-questioning until you are satisfied with their depth on all topics shared.
   Your response MUST:
   a) Evaluate the student's latest answer in 1-2 sharp sentences: confirm what was correct, and politely point out any gap, misconception, or edge case.
   b) Then IMMEDIATELY ASK THE NEXT PROBING QUESTION:
      - If their explanation was brief or had gaps: ask a deeper follow-up question on that SAME topic (e.g. asking about failure modes, memory trade-offs, internal JS mechanics, browser rendering, or edge cases).
      - If they answered thoroughly and satisfied that concept: transition to the NEXT concept, library, or challenge they shared in their reflection.
   c) Keep the dialogue vibrant, engaging, and challenging like an authentic Senior Staff Engineer mentorship interview!` : ''}

4. FINAL CONCLUDING EVALUATION (WHEN CONCLUDING):
   ${isConcluding ? `Deliver the complete, structured final evaluation for this reflection session:
   - 🌟 Comprehensive Mastery Assessment: Detailed summary of topics they mastered with flying colors.
   - 🎯 Targeted Areas to Improve: Specific architectural best practices, tricky edge cases, and syntax nuances to strengthen.
   - 🚀 Tomorrow's Forwarded Roadmap: Connect their growth directly to tomorrow's forwarded tasks (${forwardedSummary}) with concrete action items.` : ''}

5. TONE & VOCAL DELIVERY:
   Warm, natural, encouraging, human-sounding English (120-160 words per turn). Use clean sentence structures for spoken audio playback.`
          },
          ...conversationHistory.map(message => ({ role: message.sender === 'user' ? 'user' : 'assistant', content: message.text })),
          { role: 'user', content: studentSpeechInput }
        ]
      });
      return res.json({ success: true, model: 'meta/llama-3.2-11b-vision-instruct', content: result.content, reasoning: result.reasoning });
    } catch (modelErr) {
      console.warn('NVIDIA voice call failed on server:', modelErr.message);
    }

    res.status(502).json({ success: false, error: 'NVIDIA voice model temporarily unavailable' });
  } catch (err) {
    console.error('Voice reflection error:', err);
    res.status(500).json({ success: false, error: 'Unable to generate voice reflection' });
  }
};

/**
 * High-Fidelity Human Neural Text-to-Speech Streaming Endpoint
 * Produces genuine human-sounding speech MP3 streams (not mechanical or robotic)
 */
export const handleTextToSpeech = async (req, res) => {
  try {
    const rawText = (req.method === 'GET' ? req.query.text : (req.body?.text || req.query.text)) || '';
    if (!rawText.trim()) {
      return res.status(400).json({ success: false, error: 'Text is required for audio synthesis.' });
    }

    // Clean text: strip markdown formatting, code blocks, URLs, and asterisks
    let cleanText = rawText
      .replace(/```[\s\S]*?```/g, 'Code snippet omitted.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*_#~>]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      cleanText = 'Voice reflection audio ready.';
    }

    // Split text into natural conversational sentence fragments
    const sentences = [];
    const rawSentences = cleanText.split(/([.!?\n]+)/);
    let currentChunk = '';

    for (let i = 0; i < rawSentences.length; i++) {
      const part = rawSentences[i];
      if ((currentChunk + part).length < 150) {
        currentChunk += part;
      } else {
        if (currentChunk.trim()) sentences.push(currentChunk.trim());
        currentChunk = part;
      }
    }
    if (currentChunk.trim()) sentences.push(currentChunk.trim());

    // Take up to 10 natural sentence chunks
    const chunksToFetch = sentences.slice(0, 10).filter(s => s.trim().length > 1);

    const audioBuffers = [];
    for (const chunk of chunksToFetch) {
      try {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=en&client=tw-ob`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Referer': 'https://translate.google.com/'
          },
          signal: AbortSignal.timeout(5000)
        });

        if (response.ok) {
          const arrayBuf = await response.arrayBuffer();
          audioBuffers.push(Buffer.from(arrayBuf));
        }
      } catch (chunkErr) {
        console.warn('TTS chunk fetch failed:', chunkErr.message);
      }
    }

    if (audioBuffers.length === 0) {
      return res.status(502).json({ success: false, error: 'Could not generate human audio stream' });
    }

    const combinedBuffer = Buffer.concat(audioBuffers);
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': combinedBuffer.length,
      'Cache-Control': 'public, max-age=86400'
    });
    return res.end(combinedBuffer);
  } catch (err) {
    console.error('Text to speech error:', err);
    res.status(500).json({ success: false, error: 'Internal TTS error' });
  }
};
