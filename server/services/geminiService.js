const getGeminiApiKey = () => process.env.GEMINI_API_KEY || '';
const getGeminiModel = () => process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export const callGeminiModel = async ({ messages, maxTokens = 4000, jsonMode = false, model, temperature = 0.7 }) => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error(`GEMINI_API_KEY is not configured on server`);

  const systemMessage = messages.find(m => m.role === 'system');
  const conversationMessages = messages.filter(m => m.role !== 'system');

  const contents = conversationMessages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  if (contents.length === 0 && systemMessage) {
    contents.push({ role: 'user', parts: [{ text: systemMessage.content }] });
  }

  // Active Gemini models with timeout per candidate model
  const selectedModel = model || getGeminiModel();
  const candidateModels = [selectedModel, 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'].filter(
    (v, i, a) => Boolean(v) && a.indexOf(v) === i
  );

  let lastError = null;
  for (const currentModel of candidateModels) {
    const rawUrl = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout per candidate model

    const requestBody = {
      contents,
      generationConfig: {
        temperature: typeof temperature === 'number' ? temperature : 0.7,
        maxOutputTokens: maxTokens,
        ...(jsonMode ? { responseMimeType: 'application/json' } : {})
      }
    };

    if (systemMessage?.content && contents[0]?.parts[0]?.text !== systemMessage.content) {
      requestBody.systemInstruction = {
        parts: [{ text: systemMessage.content }]
      };
    }

    try {
      const response = await fetch(rawUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const providerError = await response.text();
        console.warn(`Gemini API error (${currentModel}):`, providerError);
        lastError = new Error(`Gemini model request failed (HTTP ${response.status})`);
        continue;
      }

      const payload = await response.json();
      const content = payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!content) {
        lastError = new Error(`Gemini model returned empty response`);
        continue;
      }
      return { content, model: currentModel };
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
    }
  }

  throw lastError || new Error(`Gemini model request failed`);
};

export const parseJsonResponse = (content) => {
  if (!content) return null;
  let cleaned = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  const safeParse = (str) => {
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch (e) {
      try {
        const fixedStr = str.replace(/,\s*([\]}])/g, '$1');
        return JSON.parse(fixedStr);
      } catch (err) {
        return null;
      }
    }
  };

  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*(?:```|$)/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    const res = safeParse(codeBlockMatch[1].trim());
    if (res) return res;
  }

  if (cleaned.toLowerCase().includes('thinking process')) {
    const firstBracket = cleaned.indexOf('[');
    const firstBrace = cleaned.indexOf('{');
    let startIdx = -1;
    if (firstBracket !== -1 && firstBrace !== -1) startIdx = Math.min(firstBracket, firstBrace);
    else startIdx = firstBracket !== -1 ? firstBracket : firstBrace;
    if (startIdx !== -1) cleaned = cleaned.slice(startIdx);
  }

  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    const res = safeParse(arrayMatch[0]);
    if (res) return res;
  }

  const objectMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    const res = safeParse(objectMatch[0]);
    if (res) return res;
  }

  const parsed = safeParse(cleaned);
  if (parsed) return parsed;

  // Attempt auto-repair of truncated JSON arrays or objects
  const lastBrace = cleaned.lastIndexOf('}');
  if (lastBrace !== -1) {
    let candidate = cleaned.slice(0, lastBrace + 1);
    const openBrackets = (candidate.match(/\[/g) || []).length;
    const closeBrackets = (candidate.match(/\]/g) || []).length;
    if (openBrackets > closeBrackets) candidate += ']';

    const openBraces = (candidate.match(/\{/g) || []).length;
    const closeBraces = (candidate.match(/\}/g) || []).length;
    if (openBraces > closeBraces) candidate += '}';

    const res = safeParse(candidate);
    if (res) return res;
  }

  return null;
};

export const shuffleQuestionsAndOptions = (questions) => {
  if (!Array.isArray(questions)) return [];
  const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);

  return shuffledQuestions.map((q, idx) => {
    const originalOptions = (Array.isArray(q.options) && q.options.length === 4 ? q.options : ["Option A", "Option B", "Option C", "Option D"]).map((optText, i) => ({
      text: optText,
      isCorrect: i === (typeof q.correctIndex === 'number' ? q.correctIndex : 0)
    }));

    const shuffledOpts = [...originalOptions].sort(() => Math.random() - 0.5);
    const newCorrectIndex = shuffledOpts.findIndex(o => o.isCorrect);

    return {
      ...q,
      id: `q-${Date.now()}-${idx}-${Math.floor(Math.random() * 10000)}`,
      options: shuffledOpts.map(o => o.text),
      correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0
    };
  });
};

export const generateServerQuizQuestions = (phaseNum, askedQuestionIds = []) => {
  const p = Number(phaseNum) || 1;
  const timeSalt = Date.now();
  
  const phaseTopics = {
    1: ["HTML5 semantic structural tags (<header>, <nav>, <main>, <article>, <aside>)", "Form accessibility binding (<label for> linked to <input id>)", "Data tables semantics (<thead>, <tbody>, <tr>, <th>, <td>)", "Document metadata declaration (<meta charset='UTF-8'>)", "Hyperlink protocol for email (mailto:)"],
    2: ["CSS Flexbox main axis vs cross axis alignment", "CSS Box Model components (margin, border, padding, content)", "CSS Grid template column definitions with fr units", "Responsive design media query syntax", "CSS relative vs absolute vs fixed vs sticky positioning"],
    2.5: ["Tailwind utility classes for spacing, flexbox, and typography", "Tailwind responsive breakpoints (sm:, md:, lg:)", "Tailwind dark mode variant handling (dark:bg-*)", "Tailwind custom theme extensions in config", "Tailwind directives (@apply, @tailwind base)"],
    3: ["JavaScript ES6 let vs const scoping rules", "Array higher-order methods (map, filter, reduce)", "Asynchronous JavaScript Promises and async/await", "DOM manipulation using querySelector and addEventListener", "JavaScript Closures and lexical environment scope"],
    4: ["React functional component props and state architecture", "React hooks lifecycle with useState and useEffect", "React event handling and controlled form inputs", "Google Gemini AI API fetch integration and JSON responses", "Custom React hooks for reusable logic"],
    5: ["Node.js asynchronous event loop architecture", "Express REST API routing and req.params / req.query", "Express middleware pipeline and cors configuration", "HTTP status codes (200, 201, 400, 401, 404, 500)", "JWT authentication and authorization headers"],
    6: ["MongoDB NoSQL document database structure vs SQL tables", "Mongoose Schema definition and data types", "Mongoose CRUD operations (find, findOne, save, update)", "MongoDB unique indexes and query performance", "Mongoose populate for cross-collection references"],
    7: ["Production full-stack build optimization and bundling", "Securing environment variables and API keys in .env", "CORS origin security policies and HTTPS", "CI/CD deployment pipelines to cloud platforms", "Production error monitoring and healthcheck endpoints"]
  };

  const topics = phaseTopics[p] || phaseTopics[Math.floor(p)] || phaseTopics[1];
  
  const questions = [];
  for (let i = 1; i <= 10; i++) {
    const topic = topics[(i - 1) % topics.length];
    const qId = `dyn-srv-p${p}-q${i}-${timeSalt}-${Math.floor(Math.random()*1000)}`;
    
    questions.push({
      id: qId,
      question: `[Phase ${p} Assessment Q${i}] Which engineering practice is most essential when implementing ${topic}?`,
      options: [
        `Following standard ${topic} specification and best practices`,
        `Ignoring ${topic} conventions completely`,
        `Disabling ${topic} in production environments`,
        `Replacing ${topic} with deprecated legacy non-standard attributes`
      ],
      correctIndex: 0,
      explanation: `Correct! Proper usage of ${topic} is fundamental to Phase ${p} engineering.`
    });
  }

  return shuffleQuestionsAndOptions(questions);
};
