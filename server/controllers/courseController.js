import { CurriculumPhase } from '../models/CurriculumPhase.js';
import { Course } from '../models/Course.js';
import { callGeminiModel, parseJsonResponse } from '../services/geminiService.js';
import { callNvidiaModel } from '../services/nvidiaService.js';

const findLesson = (modules, lessonId) => {
  if (!Array.isArray(modules)) return null;
  for (const module of modules) {
    const lesson = Array.isArray(module.lessons)
      ? module.lessons.find(item => item.id === lessonId)
      : null;
    if (lesson) return lesson;
  }
  return null;
};

const buildLessonContext = (course, lesson) => JSON.stringify({
  course: course.title,
  category: course.category,
  lesson: {
    id: lesson.id,
    title: lesson.title,
    type: lesson.type,
    summary: lesson.summary,
    content: lesson.material?.content,
    codeSnippets: lesson.material?.codeSnippets,
    keyTakeaways: lesson.material?.keyTakeaways,
    quiz: lesson.quiz
  }
}, null, 2);

export const getCurriculumPhases = async (req, res) => {
  try {
    const phases = await CurriculumPhase.find().sort({ phaseNumber: 1 });
    res.json({ success: true, count: phases.length, data: phases });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getCurriculumPhaseById = async (req, res) => {
  try {
    const phase = await CurriculumPhase.findOne({ id: req.params.phaseId });
    if (!phase) return res.status(404).json({ success: false, error: 'Phase not found' });
    res.json({ success: true, data: phase });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const evaluateLearningContent = async (req, res) => {
  try {
    const { courseSlug, lessonId, question } = req.body;
    if (!courseSlug || !lessonId) {
      return res.status(400).json({ success: false, error: 'courseSlug and lessonId are required' });
    }

    const course = await Course.findOne({ slug: courseSlug }).lean();
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });

    const lesson = findLesson(course.modules, lessonId);
    if (!lesson) return res.status(404).json({ success: false, error: 'Lesson not found' });

    const retrievedContext = buildLessonContext(course, lesson);
    const messages = [
      {
        role: 'system',
        content: 'You are a careful learning-content reviewer. Use only the retrieved context as evidence. Return valid JSON with keys rating (number 1-10), level (string), strengths (array of strings), gaps (array of strings), explanation (string), and nextStep (string). If evidence is insufficient, say so instead of inventing facts.'
      },
      {
        role: 'user',
        content: `Retrieved learning context (reference only):\n${retrievedContext}\n\nLearner request: ${question || 'Rate this lesson and explain whether it is beginner-friendly.'}`
      }
    ];

    let result;
    try {
      result = await callGeminiModel({ messages, maxTokens: 1000, jsonMode: true });
    } catch (geminiErr) {
      console.warn('Gemini model evaluation call failed, falling back to NVIDIA model:', geminiErr.message);
      result = await callNvidiaModel({ messages, maxTokens: 700 });
    }

    let evaluation;
    try {
      evaluation = parseJsonResponse(result.content);
    } catch {
      evaluation = { rating: null, explanation: result.content };
    }

    res.json({ success: true, data: evaluation, source: { courseSlug, lessonId, model: result.model || 'gemini-2.5-flash' } });
  } catch (err) {
    console.error('Learning content evaluation error:', err);
    res.status(500).json({ success: false, error: 'Unable to evaluate learning content' });
  }
};

export const addVideo = async (req, res) => {
  try {
    const { phaseId, lessonId, videoTitle, videoUrl } = req.body;
    if (!videoUrl) return res.status(400).json({ success: false, error: 'videoUrl is required' });

    if (lessonId) {
      const course = await Course.findOne({ "modules.lessons.id": lessonId });
      if (course) {
        course.modules.forEach(m => {
          m.lessons.forEach(l => {
            if (l.id === lessonId) l.videoUrl = videoUrl;
          });
        });
        course.markModified('modules');
        await course.save();
      }
    }

    if (phaseId && videoTitle) {
      const phase = await CurriculumPhase.findOne({ id: phaseId });
      if (phase && phase.conceptVideos) {
        const vid = phase.conceptVideos.find(v => v.title.toLowerCase().includes(videoTitle.toLowerCase()));
        if (vid) vid.videoUrl = videoUrl;
        phase.markModified('conceptVideos');
        await phase.save();
      }
    }

    res.json({ success: true, message: 'Video URL updated in MongoDB Atlas successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const PHASE_SYSTEM_PROMPTS = {
  1: `You are an expert Senior Web Assessor specializing in Phase 1: Pure HTML5 & Web Semantics.
Your target is to evaluate student understanding of semantic document architecture, structural HTML tags, accessibility, forms, tables, and document head metadata.
Core Syllabus Topics to cover:
- HTML5 Document Structure (<!DOCTYPE html>, <html>, <head>, <meta charset="UTF-8">, <title>, <body>)
- Semantic Page Structuring (<header>, <nav>, <main>, <section>, <article>, <aside>, <footer>)
- Accessible HTML Forms (<form>, <label for="...">, <input type="text|email|radio|checkbox|date">, <select>, <textarea>, <button>)
- Data Tables Structure (<table>, <thead>, <tbody>, <tr>, <th>, <td>, <figcaption>, colspan/rowspan)
- Hyperlinks & Media Elements (<a href="..." target="_blank">, mailto: protocol, <img> with alt attributes, <figure>, <picture>)
- Text Semantics & Formatting (<strong>, <em>, <code>, <kbd>, <mark>, <dl>/<dt>/<dd>, <ul>/<ol>)`,

  2: `You are an expert Senior Web Assessor specializing in Phase 2: CSS3 Layouts, Flexbox, Grid & Responsive Design.
Your target is to evaluate student mastery of modern CSS styling, layout algorithms, box model, responsiveness, and positioning.
Core Syllabus Topics to cover:
- Box Model Mechanics (content, padding, border, margin, box-sizing: border-box)
- CSS Flexbox Layouts (display: flex, flex-direction, justify-content, align-items, flex-wrap, flex-grow/shrink)
- CSS Grid Systems (display: grid, grid-template-columns, fr units, repeat(), minmax(), gap, grid-column/row)
- Responsive Design & Media Queries (@media (min-width: ...), mobile-first responsive strategy, viewport meta tag)
- CSS Positioning & Z-Index (position: static|relative|absolute|fixed|sticky, z-index stacking contexts)
- Modern CSS Variables & Units (var(--name), rem vs em vs px vs vh/vw, calc())`,

  2.5: `You are an expert Senior UI Engineer specializing in Phase 2.5: Tailwind CSS & Utility-First Architecture.
Your target is to evaluate student proficiency with Tailwind CSS utilities, responsive prefixes, dark mode, and custom configuration.
Core Syllabus Topics to cover:
- Tailwind Utility Classes (flex, grid, gap-*, p-*, m-*, space-y-*, text-*, bg-*, rounded-*, shadow-*)
- Responsive Layout Prefixes (sm:, md:, lg:, xl:, 2xl:) and Mobile-First Breakpoints
- Dark Mode Variant Handling (dark:bg-*, dark:text-*, strategy configuration in tailwind.config.js)
- Custom Theme Extension (tailwind.config.js theme.extend colors, fonts, spacing, keyframes)
- Directives & Organization (@apply, @tailwind base, components, utilities, utility class grouping)
- State & Pseudo-Class Modifiers (hover:, focus:, active:, disabled:, group-hover:, peer-focus:)`,

  3: `You are an expert Senior JavaScript Architect specializing in Phase 3: Modern JavaScript ES6+ & DOM Engineering.
Your target is to evaluate student knowledge of core JavaScript ES6+ language mechanics, async operations, DOM manipulation, and array methods.
Core Syllabus Topics to cover:
- ES6+ Language Core (let/const scope, arrow functions, destructuring arrays/objects, spread/rest operators, template literals)
- Asynchronous JavaScript (Promises, async/await, fetch API, handling HTTP responses, try/catch blocks)
- Functional Array Methods (map, filter, reduce, find, some, every, forEach, immutability)
- DOM Manipulation & Events (document.querySelector, addEventListener, event object, event bubbling/delegation, innerHTML vs textContent)
- Functions & Scope (closures, lexical environment, default parameters, higher-order functions)
- Error Handling & JSON (JSON.parse, JSON.stringify, throwing custom errors, debugging)`,

  4: `You are an expert Senior React Developer specializing in Phase 4: React.js & Google Gemini API Integration.
Your target is to evaluate student mastery of React functional components, hooks, state management, props, and AI API integration.
Core Syllabus Topics to cover:
- React Functional Component Architecture (JSX rules, component hierarchy, props passing, destructuring props)
- Core React Hooks (useState for local state, useEffect for side-effects/data fetching, useRef, useMemo, useCallback)
- Event Handling & Conditional Rendering (onClick, onSubmit, controlled inputs, ternary operators, short-circuit &&)
- Google Gemini API Integration in React (POST /api calls to Gemini, handling AI text responses, streaming/json parsing, prompt engineering)
- Custom Hooks & Component State Patterns (reusable custom hooks, lifting state up, list rendering with unique keys)
- Component Lifecycle & Dependencies (useEffect dependency arrays, cleanup functions, preventing memory leaks)`,

  5: `You are an expert Senior Backend Engineer specializing in Phase 5: Node.js & Express REST API Architecture.
Your target is to evaluate student capability in building Node.js server applications, Express routes, middleware, and security.
Core Syllabus Topics to cover:
- Node.js Runtime & Fundamentals (Event loop, CommonJS vs ES Modules, process.env, fs module)
- Express Server & Routing (express(), app.get/post/put/delete, req.params, req.query, req.body, res.json)
- Express Middleware Architecture (app.use(), custom middleware, cors, express.json(), error-handling middleware)
- RESTful API Conventions (HTTP methods, resource URIs, standard HTTP status codes: 200, 201, 400, 401, 403, 404, 500)
- Authentication & Authorization (JWT token signing & verification, Authorization Bearer header, bcrypt password hashing)
- Server Security & Environment Configuration (dotenv, secret key protection, input validation)`,

  6: `You are an expert Senior Database Architect specializing in Phase 6: MongoDB Atlas & Mongoose Data Modeling.
Your target is to evaluate student expertise in NoSQL database design, Mongoose schemas, CRUD queries, indexing, and aggregations.
Core Syllabus Topics to cover:
- MongoDB Fundamentals (Documents, Collections, BSON vs JSON, ObjectIDs)
- Mongoose Schema Definition (Schema types, required, default, trim, enum, timestamps)
- Mongoose Model CRUD Operations (Model.find(), findOne(), create(), findByIdAndUpdate(), deleteOne(), countDocuments())
- Query Filtering & Selection (Operators like $gte, $lte, $in, select fields, populate references)
- Mongoose Middleware & Hooks (pre('save'), post('save'), virtual properties)
- Aggregation Pipeline & Indexing ($match, $group, $project, $unwind, index performance)`,

  7: `You are an expert Senior DevOps & Full-Stack Architect specializing in Phase 7: Full-Stack Deployment, Production & Security.
Your target is to evaluate student readiness in deploying MERN stack apps to production platforms, securing environment variables, and configuring CI/CD.
Core Syllabus Topics to cover:
- Production Build & Optimization (Vite build output, static asset bundling, tree shaking, minification)
- Full-Stack Deployment Strategy (Frontend hosting, Express backend deployment on Render/Vercel/DigitalOcean)
- Environment Variables & Key Security (.env management, process.env, preventing API key exposure)
- Production CORS & Security Headers (CORS origin whitelist, rate limiting, SSL/TLS HTTPS security)
- CI/CD & Error Monitoring (Deployment build scripts, healthcheck endpoints, error tracking)`
};

export const generateGeminiQuiz = async (req, res) => {
  try {
    const { phaseNumber, phaseTitle, phaseTopics, askedQuestionIds = [] } = req.body;
    const pNum = Number(phaseNumber) || 1;
    
    const phaseSystemPrompt = PHASE_SYSTEM_PROMPTS[pNum] || PHASE_SYSTEM_PROMPTS[Math.floor(pNum)] || PHASE_SYSTEM_PROMPTS[1];
    const topicsList = Array.isArray(phaseTopics) && phaseTopics.length > 0 ? phaseTopics.join(', ') : phaseTitle;

    // Filter askedQuestionIds to extract actual question text strings (ignoring internal IDs)
    const askedQuestionsList = Array.isArray(askedQuestionIds)
      ? askedQuestionIds.filter(q => typeof q === 'string' && q.length > 8 && !q.startsWith('gemini-p') && !q.startsWith('dyn-p') && !q.startsWith('nvidia-'))
      : [];

    const previousQuestionsText = askedQuestionsList.length > 0
      ? askedQuestionsList.slice(-30).map((q, idx) => `${idx + 1}. "${q}"`).join('\n')
      : 'None (First assessment attempt for this student)';

    const requestSalt = `${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

    const messages = [
      {
        role: 'system',
        content: `${phaseSystemPrompt}

CRITICAL RULES FOR NON-REPETITION & QUESTION VARIETY:
1. Generate EXACTLY 10 multiple-choice questions strictly tailored to Phase ${pNum} (${phaseTitle}).
2. Focus Topics: ${topicsList}.
3. THE STUDENT HAS ALREADY ANSWERED THESE QUESTIONS IN PREVIOUS ATTEMPTS:
---
${previousQuestionsText}
---
4. ABSOLUTELY DO NOT REPEAT ANY OF THE PREVIOUS QUESTIONS LISTED ABOVE! DO NOT ASK SIMILAR QUESTIONS WITH MINOR WORDING CHANGES!
5. Every question MUST BE 100% NEW, FRESH, clear, and test practical code snippets, sub-topics, real-world edge cases, or debugging scenarios within Phase ${pNum}.
6. Session Request Seed: ${requestSalt}.

RETURN ONLY VALID JSON IN THIS EXACT STRUCTURE (no markdown fence outside JSON):
{
  "title": "Phase ${pNum}: ${phaseTitle} Assessment (Google Gemini AI Generated 🤖✨)",
  "category": "Google Gemini AI Phase ${pNum}",
  "timeLimitMinutes": 15,
  "passingScore": 80,
  "questions": [
    {
      "id": "gemini-p${pNum}-q1-${Date.now()}",
      "question": "What is the primary technical purpose of ...?",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correctIndex": 0,
      "explanation": "Detailed engineering explanation of why this answer is correct."
    }
  ]
}`
      },
      {
        role: 'user',
        content: `Generate 10 completely fresh, non-repetitive multiple-choice questions for Phase ${pNum} (${phaseTitle}) right now in valid JSON format. Session Seed: ${requestSalt}.`
      }
    ];

    const result = await callGeminiModel({ messages, maxTokens: 3000, jsonMode: true, model: 'gemini-2.5-flash', temperature: 0.95 });
    const quizData = parseJsonResponse(result.content);

    if (!quizData || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
      return res.status(422).json({ success: false, error: 'Failed to parse Gemini quiz JSON structure' });
    }

    res.json({ success: true, quiz: quizData, model: result.model || 'gemini-2.5-flash' });
  } catch (err) {
    console.warn('Gemini quiz generation error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
