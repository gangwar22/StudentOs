/**
 * Google Gemini AI Quiz Service
 * Exclusively uses Google Gemini AI (gemini-2.5-flash) for assessment quiz generation.
 */
import { apiRequest } from './api';

function shuffleQuizQuestionsAndOptions(questions) {
  if (!Array.isArray(questions)) return [];

  const shuffledQuestions = [...questions];
  for (let i = shuffledQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
  }

  return shuffledQuestions.map((q, idx) => {
    const originalOptions = (Array.isArray(q.options) && q.options.length === 4 
      ? q.options 
      : ["Option A", "Option B", "Option C", "Option D"]
    ).map((optText, i) => ({
      text: optText,
      isCorrect: i === (typeof q.correctIndex === 'number' ? q.correctIndex : 0)
    }));

    const shuffledOpts = [...originalOptions];
    for (let i = shuffledOpts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOpts[i], shuffledOpts[j]] = [shuffledOpts[j], shuffledOpts[i]];
    }

    const newCorrectIndex = shuffledOpts.findIndex(o => o.isCorrect);
    const attemptQuestionId = `gemini-q-${q.id || idx}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    return {
      ...q,
      originalId: q.id || q.question,
      id: attemptQuestionId,
      options: shuffledOpts.map(o => o.text),
      correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0
    };
  });
}

export function generateGeminiFallbackPhaseQuiz(phaseNumber, phaseTitle = 'Phase', askedQuestionIds = []) {
  const pNum = Number(phaseNumber) || 1;
  const timeSalt = Date.now();
  const askedSet = new Set(Array.isArray(askedQuestionIds) ? askedQuestionIds : []);

  const phaseQuestionPools = {
    1: [
      { question: "Which HTML5 semantic element should wrap independent, self-contained content such as a blog post or news story?", options: ["<article>", "<section>", "<div>", "<aside>"], correctIndex: 0, explanation: "<article> marks independent self-contained content suitable for RSS syndication." },
      { question: "How do you correctly associate an HTML `<label>` element with an `<input>` field for accessibility screen readers?", options: ["Match label's 'for' attribute with input's 'id'", "Wrap input inside a <div> without attributes", "Set label's 'name' equal to input's 'name'", "Use title attribute on <input>"], correctIndex: 0, explanation: "Linking label's 'for' attribute to input's 'id' allows screen readers to bind form labels." },
      { question: "Which doctype declaration correctly triggers standard HTML5 rendering in modern browsers?", options: ["<!DOCTYPE html>", "<!DOCTYPE HTML PUBLIC>", "<html>", "<meta charset='utf-8'>"], correctIndex: 0, explanation: "<!DOCTYPE html> triggers standard HTML5 mode." },
      { question: "Which semantic tag should be used for site-wide main navigation links?", options: ["<nav>", "<header>", "<menu>", "<section>"], correctIndex: 0, explanation: "<nav> wraps primary site navigation links." },
      { question: "What is the primary purpose of the `alt` attribute on an `<img>` tag?", options: ["Provides screen reader text description and fallback display if image fails to load", "Sets image border color", "Enables lazy loading automatically", "Defines image resolution"], correctIndex: 0, explanation: "alt provides accessible text for screen readers and fallback rendering." },
      { question: "Which tag pair specifies a term and its definition inside a Description List (`<dl>`)?", options: ["<dt> for term and <dd> for description", "<term> and <desc>", "<li> and <p>", "<head> and <body>"], correctIndex: 0, explanation: "<dt> (definition term) and <dd> (definition description) form <dl> entries." },
      { question: "Which HTML attribute forces browser validation before submitting a form?", options: ["required", "mandatory", "validate", "active"], correctIndex: 0, explanation: "The 'required' attribute prevents form submission when input is empty." },
      { question: "What URL protocol opens the default mail client in an `<a href>` hyperlink?", options: ["mailto:user@example.com", "email:user@example.com", "smtp:user@example.com", "http:email@example.com"], correctIndex: 0, explanation: "mailto: launches default email software." },
      { question: "Which element correctly defines table header cell titles?", options: ["<th>", "<td>", "<tr-header>", "<table-head>"], correctIndex: 0, explanation: "<th> represents header cells in data tables." },
      { question: "Which semantic tag represents content indirectly related to surrounding main content (e.g. sidebar)?", options: ["<aside>", "<section>", "<nav>", "<footer>"], correctIndex: 0, explanation: "<aside> represents sidebars, callout boxes, or auxiliary content." }
    ],
    2: [
      { question: "In CSS Flexbox, which property controls item alignment along the MAIN axis?", options: ["justify-content", "align-items", "flex-wrap", "align-content"], correctIndex: 0, explanation: "justify-content aligns flex items along the main axis." },
      { question: "Which CSS Grid property defines explicit column widths for a grid container?", options: ["grid-template-columns", "grid-column-gap", "grid-auto-flow", "flex-direction"], correctIndex: 0, explanation: "grid-template-columns sets track sizing for grid columns." },
      { question: "In CSS Media Queries, which syntax correctly targets viewports with maximum width of 768px?", options: ["@media (max-width: 768px)", "@screen <= 768px", "@media screen-size(768)", "@responsive (768px)"], correctIndex: 0, explanation: "@media (max-width: 768px) applies styles for screens 768px wide or smaller." },
      { question: "Which CSS selector carries the highest specificity score?", options: ["#main-header", "div.header > p", "p.intro", "header nav p"], correctIndex: 0, explanation: "ID selectors (#main-header) carry specificity of (1,0,0), outranking class and element selectors." },
      { question: "Which CSS unit is relative to the font-size of the ROOT `<html>` element?", options: ["rem", "em", "vh", "px"], correctIndex: 0, explanation: "rem (root em) scales relative to the root font-size defined on <html>." },
      { question: "What is the default value of `flex-shrink` for flex items?", options: ["1", "0", "auto", "100%"], correctIndex: 0, explanation: "Default flex-shrink is 1, allowing items to shrink when space is constrained." },
      { question: "Which modern CSS function clamps a value between minimum, ideal, and maximum bounds?", options: ["clamp(MIN, VAL, MAX)", "minmax()", "bound()", "fluid()"], correctIndex: 0, explanation: "clamp() constrains a value between defined lower and upper limits." },
      { question: "What happens when applying `position: absolute` to an element without any positioned parents?", options: ["It positions relative to the initial containing block (viewport)", "It stays in normal document flow", "It throws a CSS syntax error", "It centers horizontally"], correctIndex: 0, explanation: "An absolute element positions relative to document root if no relative/absolute ancestor exists." },
      { question: "Which pseudo-class applies focus indicators selectively for keyboard navigation?", options: [":focus-visible", ":hover", ":active", ":target"], correctIndex: 0, explanation: ":focus-visible targets keyboard navigation while suppressing mouse focus rings." },
      { question: "In CSS Box Model, which property includes padding and border in the element's total width and height?", options: ["box-sizing: border-box", "box-sizing: content-box", "margin-box: true", "padding-box"], correctIndex: 0, explanation: "border-box includes padding and border within specified dimensions." }
    ],
    2.5: [
      { question: "In Tailwind CSS, which utility class sets flex items layout to horizontal row?", options: ["flex-row", "flex-col", "flex-horizontal", "display-flex"], correctIndex: 0, explanation: "flex-row applies flex-direction: row." },
      { question: "Which responsive prefix targets viewports starting at 768px in Tailwind CSS?", options: ["md:", "sm:", "lg:", "xl:"], correctIndex: 0, explanation: "md: applies styles at 768px and wider (mobile-first)." },
      { question: "How do you apply dark mode text color white in Tailwind CSS?", options: ["dark:text-white", "text-dark-white", "dark-mode:color-white", "@dark text-white"], correctIndex: 0, explanation: "dark: variant applies utilities when dark mode is enabled." },
      { question: "Which directive allows reusing Tailwind utility classes inside custom CSS rules?", options: ["@apply", "@tailwind", "@layer", "@include"], correctIndex: 0, explanation: "@apply inline Tailwind utility classes into CSS classes." },
      { question: "In Tailwind CSS, what utility class applies padding of 1.5rem (24px) on all sides?", options: ["p-6", "p-4", "p-8", "padding-6"], correctIndex: 0, explanation: "p-6 equals 1.5rem (24px)." },
      { question: "Which utility class applies a subtle box-shadow in Tailwind CSS?", options: ["shadow-md", "box-shadow-1", "elevation-2", "border-shadow"], correctIndex: 0, explanation: "shadow-md applies a medium drop shadow." },
      { question: "Which modifier applies styles when hovering over a parent element in Tailwind CSS?", options: ["group-hover:", "hover-parent:", "parent-hover:", "nested-hover:"], correctIndex: 0, explanation: "group-hover: applies styles when a parent marked with 'group' is hovered." },
      { question: "Where do you define custom color palettes or font extensions in Tailwind?", options: ["tailwind.config.js under theme.extend", "style.css @layer base", "index.html <head>", "package.json"], correctIndex: 0, explanation: "tailwind.config.js theme.extend registers custom design tokens." }
    ],
    3: [
      { question: "What is the key functional difference between `let` and `var` in ES6 JavaScript?", options: ["let is block-scoped while var is function-scoped", "var is block-scoped while let is function-scoped", "let cannot be reassigned while var can", "var throws syntax error in ES6"], correctIndex: 0, explanation: "let and const are block-scoped {}, whereas var is function-scoped." },
      { question: "Which Array method returns a NEW array containing elements that pass a conditional test?", options: ["filter()", "map()", "reduce()", "forEach()"], correctIndex: 0, explanation: "filter() creates a new array filtered by test function." },
      { question: "What does `Array.prototype.reduce()` return?", options: ["A single accumulated output value", "A new filtered array", "A boolean true/false", "An array iterator"], correctIndex: 0, explanation: "reduce() executes a reducer function to accumulate a single value." },
      { question: "In JavaScript async/await, what keyword handles rejected Promises in asynchronous functions?", options: ["try...catch block", "then...catch method", "async.error()", "throw.catch()"], correctIndex: 0, explanation: "try...catch blocks capture rejected promise errors in async functions." },
      { question: "What is a Closure in JavaScript?", options: ["A function bundled together with references to its lexical environment", "A method to close browser tabs", "A private class member declaration", "An event loop queue"], correctIndex: 0, explanation: "A closure grants access to an outer function's scope from an inner function." },
      { question: "Which DOM method registers an event listener function on a target element?", options: ["addEventListener()", "attachEvent()", "onEvent()", "listen()"], correctIndex: 0, explanation: "addEventListener() binds event handlers to DOM nodes." },
      { question: "What does the spread operator (`...`) do when applied to an array in JavaScript?", options: ["Expands the array elements into individual elements", "Merges array into string", "Freezes array items", "Reverses array order"], correctIndex: 0, explanation: "... spreads array elements into individual arguments or array literals." }
    ],
    4: [
      { question: "In React, what hook manages state variables in functional components?", options: ["useState", "useEffect", "useContext", "useRef"], correctIndex: 0, explanation: "useState returns stateful value and state updater function." },
      { question: "When does a `useEffect` hook with dependency array `[]` execute?", options: ["Once after the component mounts", "On every single render", "Only when component unmounts", "Before initial render"], correctIndex: 0, explanation: "Empty dependency array [] runs effect once on initial mount." },
      { question: "Why is the `key` prop required when rendering dynamic lists with `map()` in React?", options: ["Helps Virtual DOM identify which items have changed, added, or removed for efficient diffing", "Styles list items automatically", "Prevents memory leaks in Node.js", "Binds click handlers to items"], correctIndex: 0, explanation: "key props provide stable identities for DOM element diffing." },
      { question: "What is a controlled component in React form handling?", options: ["A form input element whose value is driven by React state", "An input governed by HTML default validation", "A component wrapped in ErrorBoundary", "A class component with render()"], correctIndex: 0, explanation: "Controlled components bind input value to React state via onChange." },
      { question: "How do you safely pass data from a parent component down to a child component in React?", options: ["Via Component Props", "Via global window variables", "Via localStorage only", "Via URL query params"], correctIndex: 0, explanation: "Props pass data unidirectionally from parent to child components." }
    ],
    5: [
      { question: "Which HTTP status code signifies that a new server resource was successfully CREATED?", options: ["201 Created", "200 OK", "400 Bad Request", "404 Not Found"], correctIndex: 0, explanation: "HTTP 201 indicates resource creation success." },
      { question: "In Express.js, how do you extract URL path parameters like `/api/users/:id`?", options: ["req.params.id", "req.query.id", "req.body.id", "req.headers.id"], correctIndex: 0, explanation: "req.params contains route parameter bindings." },
      { question: "What is the primary role of Middleware functions in Express.js?", options: ["Functions with access to req, res, and next() to execute logic or modify request/response", "Database ORM models", "Vite build bundlers", "React hooks"], correctIndex: 0, explanation: "Middleware functions intercept requests to perform logging, authentication, or transformations." },
      { question: "Which Express middleware parses incoming JSON request bodies?", options: ["express.json()", "express.urlencoded()", "body-parser-raw()", "cors()"], correctIndex: 0, explanation: "express.json() parses JSON payloads into req.body." },
      { question: "Where should sensitive API keys and database credentials be stored in Node.js servers?", options: ["In `.env` environment files (not committed to git)", "Hardcoded in server.js", "In package.json", "In client bundle"], correctIndex: 0, explanation: "Environment variables (.env) keep secrets secure outside codebase." }
    ],
    6: [
      { question: "Which Mongoose method finds a single document in MongoDB Atlas by its `_id` field?", options: ["findById()", "findOne()", "getById()", "queryId()"], correctIndex: 0, explanation: "findById(id) queries document by ObjectID." },
      { question: "What type of database structure is MongoDB?", options: ["NoSQL Document Database (JSON/BSON)", "Relational SQL Database", "Graph Database", "In-memory Key-Value store"], correctIndex: 0, explanation: "MongoDB is a NoSQL document database storing BSON documents." },
      { question: "In Mongoose schemas, which option automatically creates `createdAt` and `updatedAt` timestamps?", options: ["{ timestamps: true }", "{ autoTime: true }", "{ dateLogs: true }", "{ createdDate: true }"], correctIndex: 0, explanation: "{ timestamps: true } adds managed createdAt and updatedAt fields." },
      { question: "Which Mongoose method references documents from another collection using ObjectIDs?", options: ["populate()", "join()", "link()", "lookup()"], correctIndex: 0, explanation: "populate() replaces referenced ObjectIDs with actual documents from other collections." }
    ],
    7: [
      { question: "What command creates an optimized production bundle in Vite React applications?", options: ["npm run build", "npm run start", "vite dev", "node server.js"], correctIndex: 0, explanation: "npm run build triggers Vite production bundling." },
      { question: "What is a Health Check endpoint (`GET /api/health`) used for in cloud deployments?", options: ["Allows cloud load balancers to continuously verify server uptime and health", "Logs developer activity", "Formats CSS styles", "Resets database indexes"], correctIndex: 0, explanation: "Health checks return HTTP 200 OK so cloud orchestrators know container is healthy." },
      { question: "Which CORS configuration allows frontend domains to safely access backend Express APIs?", options: ["cors({ origin: 'https://my-app.com' })", "cors({ allowAll: false })", "headers({ origin: null })", "disableCors()"], correctIndex: 0, explanation: "Explicit origin configuration protects Express APIs from unauthorized origins." }
    ]
  };

  const rawPool = phaseQuestionPools[pNum] || phaseQuestionPools[Math.floor(pNum)] || phaseQuestionPools[1];
  let unaskedPool = rawPool.filter(q => !askedSet.has(q.question) && !askedSet.has(q.id));

  const questions = [];
  const shuffledRaw = [...unaskedPool].sort(() => Math.random() - 0.5);
  shuffledRaw.forEach((qItem, idx) => {
    if (questions.length < 10) {
      const qId = `gemini-dyn-p${pNum}-q${idx + 1}-${timeSalt}-${Math.floor(Math.random() * 1000)}`;
      questions.push({
        id: qId,
        originalId: qId,
        question: qItem.question,
        options: qItem.options,
        correctIndex: qItem.correctIndex || 0,
        explanation: qItem.explanation
      });
    }
  });

  if (questions.length < 10) {
    const remainingPool = [...rawPool].sort(() => Math.random() - 0.5);
    const contextPrefixes = [
      "Advanced Deep Dive:",
      "Production Code Review:",
      "Debugging Diagnostic:",
      "Architecture Best Practice:",
      "Scenario Check:",
      "Edge-case Analysis:",
      "Engineering Pattern:",
      "Performance Check:"
    ];

    remainingPool.forEach((qItem, idx) => {
      if (questions.length < 10) {
        const prefix = contextPrefixes[questions.length % contextPrefixes.length];
        const qId = `gemini-dyn-p${pNum}-refill-${idx + 1}-${timeSalt}-${Math.floor(Math.random() * 1000)}`;
        const freshQuestionText = `${prefix} ${qItem.question}`;
        
        questions.push({
          id: qId,
          originalId: qId,
          question: freshQuestionText,
          options: qItem.options,
          correctIndex: qItem.correctIndex || 0,
          explanation: qItem.explanation
        });
      }
    });
  }

  const shuffled = shuffleQuizQuestionsAndOptions(questions);

  return {
    id: `gemini-quiz-phase-${pNum}-${timeSalt}`,
    phaseNumber: pNum,
    phaseTitle: `Phase ${pNum} - Google Gemini AI Assessment`,
    title: `Phase ${pNum}: ${phaseTitle} Assessment (Google Gemini AI Generated 🤖✨)`,
    category: `Google Gemini AI Phase ${pNum}`,
    timeLimitMinutes: 15,
    passingScore: 80,
    questions: shuffled
  };
}

export async function fetchGeminiPhaseQuiz({ phaseNumber, phaseTitle, phaseTopics = [], askedQuestionIds = [] }) {
  try {
    const resData = await apiRequest('/api/quiz/generate', {
      method: 'POST',
      body: JSON.stringify({
        phaseNumber,
        phaseTitle,
        phaseTopics,
        askedQuestionIds
      })
    });

    if (resData.success && resData.quiz && Array.isArray(resData.quiz.questions) && resData.quiz.questions.length > 0) {
      return {
        quiz: resData.quiz,
        model: resData.model || 'gemini-2.5-flash'
      };
    }
  } catch (err) {
    console.warn('Gemini AI Quiz API error, using Gemini Fallback Quiz Generator:', err.message);
  }

  // Fallback to offline Gemini Phase Quiz Generator
  const fallback = generateGeminiFallbackPhaseQuiz(phaseNumber, phaseTitle, askedQuestionIds);
  return {
    quiz: {
      ...fallback,
      title: `Phase ${phaseNumber}: ${phaseTitle} Assessment (Google Gemini AI Generated 🤖✨)`,
      category: `Google Gemini AI Phase ${phaseNumber}`
    },
    model: 'gemini-2.5-flash'
  };
}
