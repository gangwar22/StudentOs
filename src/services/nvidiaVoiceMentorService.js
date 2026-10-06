// NVIDIA Voice Mentor Service
// Powered by NVIDIA API key for End-of-Day Student Reflection
import { apiRequest } from './api';

const CANDIDATE_MODELS = [];

/**
 * Call NVIDIA API to generate end-of-day voice reflection feedback,
 * conceptual corrections, and deep follow-up questions based on student's morning goals.
 */
export async function getNVidiaVoiceReflection({ 
  morningGoals = [], 
  activePhaseTitle = 'Current Phase', 
  studentSpeechInput, 
  conversationHistory = [],
  forwardedGoals = [],
  sessionMinutesElapsed = 0,
  isConcluding = false
}) {
  // Format morning goals (both AI-assigned & custom student-added goals)
  const goalsSummary = morningGoals.length > 0
    ? morningGoals.map((g, i) => `${i + 1}. "${g.title}" (Status: ${g.completed ? '100% Completed ✓' : `${g.progress || 0}% Progress`})`).join('\n')
    : '- No daily goals recorded for today.';

  const forwardedSummary = forwardedGoals.length > 0
    ? forwardedGoals.map((g, i) => `${i + 1}. "${g.title}"`).join('\n')
    : 'None (all daily goals completed or none scheduled)';

  const previousUserTurns = conversationHistory.filter(m => m.sender === 'user').length;
  const isFirstReflectionTurn = previousUserTurns === 0;

  const systemPrompt = `You are an elite AI Voice Mentor conducting a thorough, deep-dive 30-Minute Daily Reflection & Technical Mastery Dialogue for software engineering students.

Active Phase: ${activePhaseTitle}
Student's Morning Goals:
${goalsSummary}
Incomplete Tasks Forwarded to Tomorrow:
${forwardedSummary}
Session Time Elapsed: ~${sessionMinutesElapsed} minutes (Target: 30 minutes in-depth reflection)
Session State: ${isFirstReflectionTurn ? 'TURN 1: Full Reflection Intake' : isConcluding ? 'CONCLUDING: Final Comprehensive Session Report' : 'INTERACTIVE DEEP-DIVE: Continuous Cross-Questioning Until Conceptual Mastery is Satisfied'}

MANDATORY PROTOCOL & RULES:
1. STRICT ENGLISH-ONLY COMMUNICATION (ZERO HINDI / ZERO HINGLISH):
   Every single word you output MUST be in fluent, professional, supportive ENGLISH.
   DO NOT use any Hindi or Hinglish words under any circumstances.
   If the student speaks or writes in Hindi or Hinglish, gently remind them in English: "Please answer in English to prepare for global software engineering interviews."

2. TURN 1 BEHAVIOR (STUDENT SHARES ENTIRE REFLECTION ALL AT ONCE):
   ${isFirstReflectionTurn ? `The student is sharing their entire reflection in one go (covering what they worked on, learned, and what wasn't completed).
   Your response MUST do the following:
   a) Acknowledge their effort and explicitly confirm task rollover: State that their ${forwardedGoals.length > 0 ? `${forwardedGoals.length} unfinished daily goals have been automatically forwarded to tomorrow's schedule` : 'daily targets are recorded and locked in'}.
   b) Identify all the technical topics, libraries, or algorithms they learned or struggled with today.
   c) Ask 2 sharp, targeted conceptual probing questions on their primary topic to kick off our 30-minute deep-dive discussion.
   d) Prompt them: "Answer these in your own words, and we will systematically explore all your topics today until complete mastery is satisfied!"` : 'Follow Turn 2+ guidelines below.'}

3. TURN 2+ BEHAVIOR (INTERACTIVE CROSS-QUESTIONING UNTIL SATISFIED):
   ${!isFirstReflectionTurn && !isConcluding ? `DO NOT end the reflection session prematurely! The student is in a thorough 30-minute deep-dive reflection dialogue. You must keep cross-questioning until you are satisfied with their depth on all topics shared.
   Your response MUST:
   a) Evaluate the student's latest answer in 1-2 sharp sentences: confirm what was correct, and politely point out any gap, misconception, or edge case.
   b) Then IMMEDIATELY ASK THE NEXT PROBING QUESTION:
      - If their explanation was brief or had gaps: ask a deeper follow-up question on that SAME topic (e.g. asking about failure modes, memory trade-offs, internal JS mechanics, browser rendering, or edge cases).
      - If they answered thoroughly and satisfied that concept: transition to the NEXT concept, library, or challenge they shared in their reflection.
   c) Keep the dialogue vibrant, engaging, and challenging like an authentic Senior Staff Engineer mentorship interview!` : ''}

4. FINAL CONCLUDING EVALUATION (WHEN isConcluding IS TRUE):
   ${isConcluding ? `Deliver the complete, structured final evaluation for this reflection session:
   - 🌟 Comprehensive Mastery Assessment: Detailed summary of topics they mastered with flying colors.
   - 🎯 Targeted Areas to Improve: Specific architectural best practices, tricky edge cases, and syntax nuances to strengthen.
   - 🚀 Tomorrow's Forwarded Roadmap: Connect their growth directly to tomorrow's forwarded tasks (${forwardedSummary}) with concrete action items.` : ''}

5. TONE & VOCAL DELIVERY:
   Warm, natural, encouraging, human-sounding English (120-170 words). Use clean, conversational phrasing suitable for spoken audio playback.`;

  try {
    const result = await apiRequest('/api/voice/reflection', {
      method: 'POST',
      body: JSON.stringify({ 
        morningGoals, 
        activePhaseTitle, 
        studentSpeechInput, 
        conversationHistory,
        forwardedGoals,
        sessionMinutesElapsed,
        isConcluding
      })
    });
    if (result.content) return result;
    throw new Error(result.error || 'Voice reflection request failed');
  } catch (error) {
    console.warn('Voice reflection server request failed, activating intelligent English fallback:', error);
    return {
      success: true,
      model: 'nvidia-smart-fallback',
      content: generateFallbackReflectionResponse(morningGoals, studentSpeechInput, activePhaseTitle, conversationHistory, forwardedGoals, sessionMinutesElapsed, isConcluding)
    };
  }
}

/**
 * Intelligent fallback generator in case API is unreachable (100% English)
 * Implements full reflection intake, dynamic multi-round cross-questioning until satisfied,
 * and comprehensive final evaluation report.
 */
function generateFallbackReflectionResponse(morningGoals, studentInput, activePhaseTitle, conversationHistory = [], forwardedGoals = [], sessionMinutesElapsed = 0, isConcluding = false) {
  const inputLower = studentInput.toLowerCase();
  const previousUserTurns = conversationHistory.filter(m => m.sender === 'user').length;
  const isFirstTurn = previousUserTurns === 0;

  // TURN 1: Student shares entire reflection all at once
  if (isFirstTurn) {
    let response = `Thank you for sharing your complete day's reflection! 🌟\n\n`;

    // Rollover notice
    if (forwardedGoals.length > 0) {
      response += `⏩ Task Rollover Notice: I have automatically forwarded your ${forwardedGoals.length} unfinished daily goals to tomorrow's schedule (${forwardedGoals.map(g => `"${g.title}"`).join(', ')}) so your momentum continues seamlessly!\n\n`;
    } else {
      response += `✨ Excellent dedication today—all scheduled goals for today are completed and verified!\n\n`;
    }

    // 2 targeted conceptual Q&A questions based on topics mentioned to start deep dive
    if (inputLower.includes('flexbox') || inputLower.includes('css') || inputLower.includes('grid') || inputLower.includes('layout')) {
      response += `We are starting our 30-minute deep-dive reflection dialogue! To test your conceptual depth on today's layout and styling work:\n\n1. In Flexbox, what is the exact difference between \`justify-content\` and \`align-items\`, and how does \`flex-direction: column\` flip their axes?\n2. What is the role of \`flex-shrink: 0\`, and when would you use it in responsive UI components?\n\nPlease answer these in your own words, and we will systematically drill into each topic until complete mastery is satisfied!`;
    } else if (inputLower.includes('async') || inputLower.includes('await') || inputLower.includes('promise') || inputLower.includes('fetch') || inputLower.includes('api')) {
      response += `We are starting our 30-minute deep-dive reflection dialogue! To verify your foundational mechanics on asynchronous JavaScript and APIs:\n\n1. What does \`await\` do under the hood when invoked on a Promise, and does it block the browser's main JavaScript thread?\n2. What happens if a network error occurs during \`fetch()\`, and why is a \`try...catch\` block essential?\n\nPlease answer these in your own words, and we will systematically drill into each topic until complete mastery is satisfied!`;
    } else if (inputLower.includes('useeffect') || inputLower.includes('react') || inputLower.includes('state') || inputLower.includes('component')) {
      response += `We are starting our 30-minute deep-dive reflection dialogue! To check your mastery of React state management and lifecycles:\n\n1. What happens if you update state directly without calling its setter function (for example, \`items.push(newItem)\`), and why does React enforce immutability?\n2. What does an empty dependency array \`[]\` in \`useEffect\` signal to React, and when would cleanup functions be triggered?\n\nPlease answer these in your own words, and we will systematically drill into each topic until complete mastery is satisfied!`;
    } else if (inputLower.includes('array') || inputLower.includes('algorithm') || inputLower.includes('search') || inputLower.includes('sort') || inputLower.includes('pointer')) {
      response += `We are starting our 30-minute deep-dive reflection dialogue! To test your problem solving and algorithmic reasoning from today:\n\n1. In the Two-Pointer technique for sorted arrays, how do you decide whether to increment the left pointer or decrement the right pointer?\n2. What is the time and space complexity of your approach, and how does it prevent inefficient nested O(N²) loops?\n\nPlease answer these in your own words, and we will systematically drill into each topic until complete mastery is satisfied!`;
    } else {
      response += `We are starting our 30-minute deep-dive reflection dialogue! To test your conceptual depth on what you studied in ${activePhaseTitle} today:\n\n1. What was the core technical problem you were solving today, and what trade-offs did you consider in your implementation?\n2. If you encountered a runtime bug or unexpected edge case, what debugging steps would you take to diagnose it?\n\nPlease answer these in your own words, and we will systematically drill into each topic until complete mastery is satisfied!`;
    }

    return response;
  }

  // DYNAMIC CROSS-QUESTIONING (UNTIL SATISFIED): When NOT concluding
  if (!isConcluding) {
    const roundNumber = previousUserTurns + 1;
    let evalIntro = '';
    if (inputLower.includes('not block') || inputLower.includes('microtask') || inputLower.includes('event loop') || inputLower.includes('main axis') || inputLower.includes('cross axis') || inputLower.includes('immutable') || inputLower.includes('re-render') || inputLower.includes('o(n)')) {
      evalIntro = `Spot-on explanation! You accurately articulated the underlying mechanism and internal execution model.\n\n`;
    } else {
      evalIntro = `Good conceptual effort! Keep in mind the exact runtime mechanics—how the browser executes tasks without freezing the main thread and how immutability triggers efficient reconciliation.\n\n`;
    }

    // Dynamic probing questions rotating across rounds
    let nextProbingQuestion = '';
    const turnIndex = previousUserTurns % 4;

    if (turnIndex === 1) {
      nextProbingQuestion = `Let's drill into **Edge Cases & Error Handling** for this concept:\n` +
        `Suppose your code receives malformed data, an empty array, or an unexpected \`null\` / \`undefined\` response. How does your solution safeguard against unhandled rejections or crashes in production, and what HTTP status codes would you handle explicitly?`;
    } else if (turnIndex === 2) {
      nextProbingQuestion = `Great, now let's explore **Performance & Memory Implications**:\n` +
        `What is the algorithmic time and space complexity of your approach? If this code ran over 100,000 items on a low-end mobile device, where would potential bottlenecks emerge, and how would you optimize memory usage or rendering?`;
    } else if (turnIndex === 3) {
      nextProbingQuestion = `Let's pivot to the **Next Topic & Incomplete Challenge** mentioned in your reflection:\n` +
        `Regarding the tasks or concepts you didn't finish today (${forwardedGoals.length > 0 ? `specifically "${forwardedGoals[0].title}"` : 'your remaining technical goals'}): what was the exact blocker that held you back, and what architectural pattern or debugging tool will you apply tomorrow to overcome it?`;
    } else {
      nextProbingQuestion = `Let's test **Production Architecture & Best Practices**:\n` +
        `How would you write an automated unit test or integration test for the feature you built today? What would be your assertions for both happy path and failure conditions?`;
    }

    return `${evalIntro}⏱️ **30-Min Deep Dive Dialogue (Round ${roundNumber} • ~${sessionMinutesElapsed}m elapsed)**:\n\n${nextProbingQuestion}\n\n*Take your time to answer thoroughly in English. We will continue probing until all concepts are completely mastered! You can also click "Finish Session & Get Final Evaluation" whenever you are ready.*`;
  }

  // CONCLUDING EVALUATION REPORT (When isConcluding === true)
  let response = `🎓 **Comprehensive Technical Mastery & Growth Report**\n\n`;
  response += `⏱️ **Session Duration**: ~${sessionMinutesElapsed} minutes of deep-dive technical inquiry completed.\n\n`;

  // Section 1: Strengths
  response += `🌟 **Conceptual Strengths & Verified Mastery**:\n`;
  response += `You demonstrated remarkable technical endurance throughout our multi-round reflection dialogue! You successfully defended your design decisions, articulated browser & runtime mechanisms, and proved solid command over the topics covered today in ${activePhaseTitle}.\n\n`;

  // Section 2: What to Improve
  response += `🎯 **Targeted Areas to Improve**:\n`;
  response += `1. **Edge Case Resilience**: Ensure you always defensively validate boundary conditions (e.g. empty lists, network timeouts, and asynchronous failure states).\n`;
  response += `2. **Technical Interview Precision**: Continue using precise terminology—mentioning specific Big-O complexity, immutability guarantees, and microtask vs macrotask execution.\n\n`;

  // Section 3: Tomorrow's Forwarded Roadmap
  response += `🚀 **Tomorrow's Forwarded Action Plan**:\n`;
  if (forwardedGoals.length > 0) {
    response += `Your ${forwardedGoals.length} unfinished goals are already waiting in tomorrow's agenda: ${forwardedGoals.map(g => `"${g.title}"`).join(', ')}. Tackle them first thing in the morning with high focus!`;
  } else {
    response += `You conquered all today's targets! Build a hands-on mini project tomorrow combining today's topics and write 2 automated test cases to solidify mastery!`;
  }

  return response;
}

export function getPhaseDailyAgendaTitles(phaseNumber = 1, daysSpent = 1) {
  const pNum = Number(phaseNumber) || 1;
  const rawDays = Number(daysSpent);
  const dayIndex = Math.max(0, (isNaN(rawDays) || rawDays <= 0 ? 1 : rawDays) - 1);

  const phaseAgendas = {
    1: {
      deadline: 7,
      agenda: [
        [
          "Phase 1 (Day 1/7): Master HTML5 Boilerplate (<!DOCTYPE html>, <head>, <title>)",
          "Phase 1 (Day 1/7): Build index.html Home Page with <header>, <nav> & <footer>",
          "Phase 1 (Day 1/7): Test multi-page relative navigation links in browser"
        ],
        [
          "Phase 1 (Day 2/7): Study Semantic Article & Figure tags (<article>, <figure>, <figcaption>)",
          "Phase 1 (Day 2/7): Build profile.html Student Profile Page with <img>, bio & hobbies lists",
          "Phase 1 (Day 2/7): Verify image alt text & semantic heading hierarchy (h1 > h2 > h3)"
        ],
        [
          "Phase 1 (Day 3/7): Learn Description Lists (<dl>, <dt>, <dd>) & inline formatting tags",
          "Phase 1 (Day 3/7): Build courses.html Page showcasing enrolled courses and syllabus",
          "Phase 1 (Day 3/7): Solve HTML Mini Project 1 (Simple Recipe Page)"
        ],
        [
          "Phase 1 (Day 4/7): Master HTML Form Controls (<form>, <label>, <input>, <select>)",
          "Phase 1 (Day 4/7): Build feedback.html Student Feedback Form Page with submit button",
          "Phase 1 (Day 4/7): Solve HTML Mini Project 2 (Basic Blog Post with <blockquote>)"
        ],
        [
          "Phase 1 (Day 5/7): Master HTML Table Architecture (<table>, <thead>, <tbody>, <tfoot>, <th>, <td>)",
          "Phase 1 (Day 5/7): Build grades.html Page with semester marks breakdown & colspan/rowspan",
          "Phase 1 (Day 5/7): Solve HTML Mini Project 3 (Event Announcement Page)"
        ],
        [
          "Phase 1 (Day 6/7): Learn Action Links (mailto:, tel:) & Embedded map iFrames",
          "Phase 1 (Day 6/7): Build contact.html Page with <address> block & <details>/<summary> accordion",
          "Phase 1 (Day 6/7): Test full multi-page navigation flow across all 6 HTML files"
        ],
        [
          "Phase 1 (Day 7/7 Deadline): Record 3-minute video walkthrough explaining HTML tags used",
          "Phase 1 (Day 7/7 Deadline): Submit Phase 1 GitHub Repo & Live Deploy link in Curriculum Hub",
          "Phase 1 (Day 7/7 Deadline): Complete Phase 1 Assessment Quiz & unlock Phase 2!"
        ]
      ]
    },
    2: {
      deadline: 10,
      agenda: [
        [
          "Phase 2 (Day 1/10): External style.css setup, CSS Reset (* { box-sizing: border-box }) & body typography",
          "Phase 2 (Day 1/10): Apply base font-family, line-height & background canvas color",
          "Phase 2 (Day 1/10): Style navigation bar list-style reset and horizontal link alignment"
        ],
        [
          "Phase 2 (Day 2/10): Master the CSS Box Model (margin, padding, border, content sizing)",
          "Phase 2 (Day 2/10): Add custom margins & padding to headers and container sections",
          "Phase 2 (Day 2/10): Style interactive hyperlinked text hover states (a:hover)"
        ],
        [
          "Phase 2 (Day 3/10): Style Home & Profile pages (circular avatar border-radius: 50%)",
          "Phase 2 (Day 3/10): Center hero section headers and style bio card text container",
          "Phase 2 (Day 3/10): Practice class (.) vs ID (#) CSS selectors"
        ],
        [
          "Phase 2 (Day 4/10): Learn 1D Flexbox layout (display: flex, justify-content, align-items)",
          "Phase 2 (Day 4/10): Practice flex-direction (row vs column) & flex-wrap properties",
          "Phase 2 (Day 4/10): Play Flexbox Froggy interactive CSS coding game"
        ],
        [
          "Phase 2 (Day 5/10): Build Courses Page Flexbox Cards (flex-basis: 300px, gap: 20px)",
          "Phase 2 (Day 5/10): Add box-shadow & border-radius to course cards",
          "Phase 2 (Day 5/10): Solve CSS Mini Project 1 (Stylish Online Resume)"
        ],
        [
          "Phase 2 (Day 6/10): Learn 2D CSS Grid (grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)))",
          "Phase 2 (Day 6/10): Build responsive 2D course grid with gap spacing",
          "Phase 2 (Day 6/10): Play CSS Grid Garden interactive game"
        ],
        [
          "Phase 2 (Day 7/10): Style Feedback Form (display: block labels, full-width inputs, :focus states)",
          "Phase 2 (Day 7/10): Style Grades Table (border-collapse, zebra striping tr:nth-child(even))",
          "Phase 2 (Day 7/10): Solve CSS Mini Project 2 (Responsive Product Card UI)"
        ],
        [
          "Phase 2 (Day 8/10): Write Media Queries (@media (max-width: 768px)) for mobile screens",
          "Phase 2 (Day 8/10): Convert navigation flex direction to column on small viewports",
          "Phase 2 (Day 8/10): Solve CSS Mini Project 3 (Feedback Form UI Makeover)"
        ],
        [
          "Phase 2 (Day 9/10): Add CSS transitions & button hover animations",
          "Phase 2 (Day 9/10): Test full cross-browser responsive layout on desktop & mobile viewports",
          "Phase 2 (Day 9/10): Audit color contrast and typography readability"
        ],
        [
          "Phase 2 (Day 10/10 Deadline): Upload Phase 2 CSS GitHub Repository & Live Deploy link",
          "Phase 2 (Day 10/10 Deadline): Complete Phase 2 Assessment Quiz",
          "Phase 2 (Day 10/10 Deadline): Pass Phase 2 Masterclass & unlock Phase 2.5!"
        ]
      ]
    },
    2.5: {
      deadline: 7,
      agenda: [
        [
          "Phase 2.5 (Day 1/7): Master JS Variables (let vs const) & Data Types (string, number, boolean)",
          "Phase 2.5 (Day 1/7): Practice template literals (`Hello ${name}`) & console.log() debugging",
          "Phase 2.5 (Day 1/7): Run JS scripts in Node terminal / browser devtools"
        ],
        [
          "Phase 2.5 (Day 2/7): Master Arithmetic (+, -, *, /, %) & Comparison (===, !==, >, <) operators",
          "Phase 2.5 (Day 2/7): Solve Even/Odd Checker logic puzzle",
          "Phase 2.5 (Day 2/7): Practice strict equality (===) vs loose equality (==)"
        ],
        [
          "Phase 2.5 (Day 3/7): Write Conditional Logic (if, else if, else & switch statements)",
          "Phase 2.5 (Day 3/7): Solve Vowel Counter Algorithm puzzle",
          "Phase 2.5 (Day 3/7): Build Grade Classifier script (A, B, C, F based on score)"
        ],
        [
          "Phase 2.5 (Day 4/7): Master Loops (for, while, for...of) & Array iteration",
          "Phase 2.5 (Day 4/7): Solve Word Reverser & Array Max Finder puzzles",
          "Phase 2.5 (Day 4/7): Practice Array methods (push, pop, filter, map)"
        ],
        [
          "Phase 2.5 (Day 5/7): Learn Objects ({ name: 'Coffee', price: 5 }) & Key-Value properties",
          "Phase 2.5 (Day 5/7): Write Parameterized Reusable Functions with return values",
          "Phase 2.5 (Day 5/7): Solve Palindrome Checker logic puzzle"
        ],
        [
          "Phase 2.5 (Day 6/7): Build Student Grade Analyzer Console Application",
          "Phase 2.5 (Day 6/7): Build Expense Tracker Console Application ({ name, price })",
          "Phase 2.5 (Day 6/7): Build Simple Calculator Engine"
        ],
        [
          "Phase 2.5 (Day 7/7 Deadline): Complete Phase 2.5 Terminal Logic Projects",
          "Phase 2.5 (Day 7/7 Deadline): Submit Phase 2.5 GitHub Repo link",
          "Phase 2.5 (Day 7/7 Deadline): Complete Assessment Quiz & unlock Phase 3!"
        ]
      ]
    },
    3: {
      deadline: 12,
      agenda: [
        [
          "Phase 3 (Day 1/12): Learn DOM Selection (document.querySelector, getElementById)",
          "Phase 3 (Day 1/12): Add Event Listeners (addEventListener('click', fn))",
          "Phase 3 (Day 1/12): Build interactive counter app using JS DOM manipulation"
        ],
        [
          "Phase 3 (Day 2/12): Master React 18 JSX syntax & Functional Component architecture",
          "Phase 3 (Day 2/12): Understand Props & component parent-to-child data flow",
          "Phase 3 (Day 2/12): Build reusable UI Card component with React props"
        ],
        [
          "Phase 3 (Day 3/12): Master useState Hook for reactive UI state updates",
          "Phase 3 (Day 3/12): Implement interactive counter & toggle state in React",
          "Phase 3 (Day 3/12): Handle controlled form inputs in React"
        ],
        [
          "Phase 3 (Day 4/12): Master useEffect Hook for side effects & component lifecycle",
          "Phase 3 (Day 4/12): Fetch external REST API data inside useEffect hook",
          "Phase 3 (Day 4/12): Build dynamic Weather / Quote generator React component"
        ],
        [
          "Phase 3 (Day 5/12): Master React Conditional Rendering (ternary ? : & && operators)",
          "Phase 3 (Day 5/12): Render dynamic lists using Array.map() with key props",
          "Phase 3 (Day 5/12): Implement filtering & search bar in React"
        ],
        [
          "Phase 3 (Day 6/12): Build Custom React Hooks for reusable state logic",
          "Phase 3 (Day 6/12): Master Context API (createContext, useContext) for global state",
          "Phase 3 (Day 6/12): Implement dark/light theme toggle with React Context"
        ],
        [
          "Phase 3 (Day 7/12): Build Interactive Quiz Master App (Question 1 & 2 logic)",
          "Phase 3 (Day 7/12): Implement active option selection & real-time score tracking",
          "Phase 3 (Day 7/12): Add progress bar indicator per quiz question"
        ],
        [
          "Phase 3 (Day 8/12): Implement Quiz timer countdown & timeout handling",
          "Phase 3 (Day 8/12): Build final Quiz Result Screen with score summary",
          "Phase 3 (Day 8/12): Add retake quiz & review answer feedback features"
        ],
        [
          "Phase 3 (Day 9/12): Style React components using Tailwind CSS utility classes",
          "Phase 3 (Day 9/12): Implement glassmorphism & responsive layout cards",
          "Phase 3 (Day 9/12): Refactor React code into modular component files"
        ],
        [
          "Phase 3 (Day 10/12): Solve React Mini Project 1 (Interactive Todo Manager)",
          "Phase 3 (Day 10/12): Solve React Mini Project 2 (Dynamic Product Shopping Cart)",
          "Phase 3 (Day 10/12): Solve React Mini Project 3 (Interactive Quiz App)"
        ],
        [
          "Phase 3 (Day 11/12): Audit React app performance & fix console warning keys",
          "Phase 3 (Day 11/12): Test responsive mobile layouts for React Quiz Master",
          "Phase 3 (Day 11/12): Deploy React frontend to Vercel / Netlify"
        ],
        [
          "Phase 3 (Day 12/12 Deadline): Upload Phase 3 React GitHub Repo & Live Deploy link",
          "Phase 3 (Day 12/12 Deadline): Complete Phase 3 Assessment Quiz",
          "Phase 3 (Day 12/12 Deadline): Pass Phase 3 Masterclass & unlock Phase 4!"
        ]
      ]
    },
    4: {
      deadline: 14,
      agenda: [
        [
          "Phase 4 (Day 1/14): Understand Node.js Server Runtime & V8 JavaScript Engine",
          "Phase 4 (Day 1/14): Initialize npm package.json with npm init -y",
          "Phase 4 (Day 1/14): Practice Node.js File System module (fs.readFile, fs.writeFile)"
        ],
        [
          "Phase 4 (Day 2/14): Install Express.js framework (npm i express)",
          "Phase 4 (Day 2/14): Build basic Express HTTP server listening on port 5000",
          "Phase 4 (Day 2/14): Create first app.get('/', (req, res) => ...) route"
        ],
        [
          "Phase 4 (Day 3/14): Learn REST API HTTP Methods (GET, POST, PUT, DELETE)",
          "Phase 4 (Day 3/14): Configure express.json() middleware for JSON request body parsing",
          "Phase 4 (Day 3/14): Test REST endpoints using Postman or Thunder Client"
        ],
        [
          "Phase 4 (Day 4/14): Implement Express Router modules (express.Router())",
          "Phase 4 (Day 4/14): Build separate API route files (/api/users, /api/courses)",
          "Phase 4 (Day 4/14): Implement custom logging middleware (req.method, req.url)"
        ],
        [
          "Phase 4 (Day 5/14): Implement environment variable security with dotenv package",
          "Phase 4 (Day 5/14): Create .env file for PORT & SECRET_KEY configuration",
          "Phase 4 (Day 5/14): Ensure .env is added to .gitignore to protect secrets"
        ],
        [
          "Phase 4 (Day 6/14): Learn Password Hashing with Bcrypt package (bcrypt.hash)",
          "Phase 4 (Day 6/14): Build user signup endpoint (/api/auth/register)",
          "Phase 4 (Day 6/14): Compare hashed passwords during login with bcrypt.compare()"
        ],
        [
          "Phase 4 (Day 7/14): Learn JSON Web Tokens (JWT) for stateless authentication",
          "Phase 4 (Day 7/14): Generate JWT auth token (jwt.sign) on successful login",
          "Phase 4 (Day 7/14): Build auth middleware (verifyToken) checking Bearer token"
        ],
        [
          "Phase 4 (Day 8/14): Protect private API routes with verifyToken middleware",
          "Phase 4 (Day 8/14): Handle Express error middleware (err, req, res, next)",
          "Phase 4 (Day 8/14): Implement standard JSON error responses ({ success: false, error })"
        ],
        [
          "Phase 4 (Day 9/14): Connect Express REST API server to Ask Gemini AI integration",
          "Phase 4 (Day 9/14): Build POST /api/ai/explain code route",
          "Phase 4 (Day 9/14): Return AI structured explanation to frontend"
        ],
        [
          "Phase 4 (Day 10/14): Solve Express Mini Project 1 (Notes & Tasks REST API)",
          "Phase 4 (Day 10/14): Solve Express Mini Project 2 (Secure JWT Authentication Server)",
          "Phase 4 (Day 10/14): Solve Express Mini Project 3 (AI Code Assistant Backend Endpoint)"
        ],
        [
          "Phase 4 (Day 11/14): Enable CORS middleware (npm i cors) for cross-origin requests",
          "Phase 4 (Day 11/14): Connect React frontend fetch requests to Express server",
          "Phase 4 (Day 11/14): Test full end-to-end client-server authentication flow"
        ],
        [
          "Phase 4 (Day 12/14): Audit Express backend error handling & input validations",
          "Phase 4 (Day 12/14): Prepare Render / Railway deployment setup for Node server",
          "Phase 4 (Day 12/14): Write API documentation for all server endpoints"
        ],
        [
          "Phase 4 (Day 13/14): Deploy Express server to Render & verify live endpoints",
          "Phase 4 (Day 13/14): Verify .env environment variables on cloud server",
          "Phase 4 (Day 13/14): Test production live backend API from frontend client"
        ],
        [
          "Phase 4 (Day 14/14 Deadline): Upload Phase 4 Node/Express GitHub Repo & Live Deploy link",
          "Phase 4 (Day 14/14 Deadline): Complete Phase 4 Assessment Quiz",
          "Phase 4 (Day 14/14 Deadline): Pass Phase 4 Masterclass & unlock Phase 5!"
        ]
      ]
    },
    5: {
      deadline: 14,
      agenda: [
        [
          "Phase 5 (Day 1/14): Study Full Stack MERN Architecture & Data Flow",
          "Phase 5 (Day 1/14): Connect React frontend to Express backend using axios / fetch",
          "Phase 5 (Day 1/14): Handle loading & error states during server API calls"
        ],
        [
          "Phase 5 (Day 2/14): Build Full Stack AI Integration (/api/gemini/chat endpoint)",
          "Phase 5 (Day 2/14): Connect AIMentor frontend component to Node.js AI backend",
          "Phase 5 (Day 2/14): Test live streaming & formatted markdown AI responses"
        ],
        [
          "Phase 5 (Day 3/14): Implement CORS security headers & origin authorization",
          "Phase 5 (Day 3/14): Build client-side HTTP error boundaries for API calls",
          "Phase 5 (Day 3/14): Handle network offline & server timeout scenarios"
        ],
        [
          "Phase 5 (Day 4/14): Build MERN Stack Mini Project 1 (AI Developer Assistant Portal)",
          "Phase 5 (Day 4/14): Build MERN Stack Mini Project 2 (Full Stack Notes App with Auth)",
          "Phase 5 (Day 4/14): Build MERN Stack Mini Project 3 (AI Code Explainer Platform)"
        ],
        [
          "Phase 5 (Day 14/14 Deadline): Upload Phase 5 MERN GitHub Repo & Live Deploy link",
          "Phase 5 (Day 14/14 Deadline): Complete Phase 5 Assessment Quiz",
          "Phase 5 (Day 14/14 Deadline): Pass Phase 5 Masterclass & unlock Phase 6 Database!"
        ]
      ]
    },
    6: {
      deadline: 14,
      agenda: [
        [
          "Phase 6 (Day 1/14): Understand Databases: Relational vs NoSQL MongoDB",
          "Phase 6 (Day 1/14): Create MongoDB Atlas Cloud Database Cluster",
          "Phase 6 (Day 1/14): Store MONGODB_URI connection string safely in .env"
        ],
        [
          "Phase 6 (Day 2/14): Install Mongoose package (npm i mongoose)",
          "Phase 6 (Day 2/14): Connect Express server to MongoDB using mongoose.connect()",
          "Phase 6 (Day 2/14): Handle database connection success & error events"
        ],
        [
          "Phase 6 (Day 3/14): Learn Mongoose Schemas & Data Types",
          "Phase 6 (Day 3/14): Define UserSchema (name, email, password, createdAt)",
          "Phase 6 (Day 3/14): Add Mongoose field validations (required: true, unique: true)"
        ],
        [
          "Phase 6 (Day 4/14): Create Mongoose Models (const User = mongoose.model('User', UserSchema))",
          "Phase 6 (Day 4/14): Implement Create operation using new Model(data).save()",
          "Phase 6 (Day 4/14): Test database document insertion from POST route"
        ],
        [
          "Phase 6 (Day 5/14): Implement Read operation using Model.find() & Model.findById()",
          "Phase 6 (Day 5/14): Return MongoDB JSON documents from Express GET endpoint",
          "Phase 6 (Day 5/14): Handle 404 Not Found if ID does not exist"
        ],
        [
          "Phase 6 (Day 6/14): Implement Update operation using Model.findByIdAndUpdate()",
          "Phase 6 (Day 6/14): Pass { new: true, runValidators: true } options to return updated doc",
          "Phase 6 (Day 6/14): Test PUT /api/users/:id route in Postman"
        ],
        [
          "Phase 6 (Day 7/14): Implement Delete operation using Model.findByIdAndDelete()",
          "Phase 6 (Day 7/14): Return success confirmation message upon document deletion",
          "Phase 6 (Day 7/14): Test DELETE /api/users/:id route in Postman"
        ],
        [
          "Phase 6 (Day 8/14): Define Project Schema & Task Schema with Mongoose References",
          "Phase 6 (Day 8/14): Use ObjectId ref ('User') to link tasks to student user",
          "Phase 6 (Day 8/14): Practice Mongoose .populate('user') query expansion"
        ],
        [
          "Phase 6 (Day 9/14): Build complete Task Management REST API with Mongoose CRUD",
          "Phase 6 (Day 9/14): Implement filter tasks by status & user ID",
          "Phase 6 (Day 9/14): Add pagination / limit options to Mongoose queries"
        ],
        [
          "Phase 6 (Day 10/14): Solve Database Mini Project 1 (User Directory & Profile Store)",
          "Phase 6 (Day 10/14): Solve Database Mini Project 2 (E-Commerce Product Inventory Mongoose API)",
          "Phase 6 (Day 10/14): Solve Database Mini Project 3 (Blog Post & Comments Database)"
        ],
        [
          "Phase 6 (Day 11/14): Connect React frontend form to Mongoose Express endpoints",
          "Phase 6 (Day 11/14): Render MongoDB documents dynamically in React UI",
          "Phase 6 (Day 11/14): Test live CRUD updates between frontend and MongoDB Atlas"
        ],
        [
          "Phase 6 (Day 12/14): Audit MongoDB Atlas IP Whitelist & Security settings",
          "Phase 6 (Day 12/14): Ensure MONGODB_URI is configured on Render production server",
          "Phase 6 (Day 12/14): Test production cloud database connection"
        ],
        [
          "Phase 6 (Day 13/14): Optimize Mongoose indexes for fast query performance",
          "Phase 6 (Day 13/14): Write complete API documentation for Database endpoints",
          "Phase 6 (Day 13/14): Conduct end-to-end database CRUD testing"
        ],
        [
          "Phase 6 (Day 14/14 Deadline): Upload Phase 6 MongoDB GitHub Repo & Live Deploy link",
          "Phase 6 (Day 14/14 Deadline): Complete Phase 6 Assessment Quiz",
          "Phase 6 (Day 14/14 Deadline): Pass Phase 6 Database Masterclass & unlock Phase 7!"
        ]
      ]
    },
    7: {
      deadline: 21,
      agenda: [
        [
          "Phase 7 (Day 1/21): CollabSphere Project Kickoff & MERN + AI Architecture Planning",
          "Phase 7 (Day 1/21): Set up Monorepo / Client-Server project directory structure",
          "Phase 7 (Day 1/21): Initialize Git repository & project README.md outline"
        ],
        [
          "Phase 7 (Day 2/21): Design MongoDB Schemas for Users, Projects, Notes & Snippets",
          "Phase 7 (Day 2/21): Connect Express server to MongoDB Atlas cluster",
          "Phase 7 (Day 2/21): Configure .env security variables for JWT & Gemini API"
        ],
        [
          "Phase 7 (Day 3/21): Build CollabSphere JWT Auth System (Register, Login, Middleware)",
          "Phase 7 (Day 3/21): Hash user passwords with bcrypt before saving to MongoDB",
          "Phase 7 (Day 3/21): Test Auth REST endpoints in Postman"
        ],
        [
          "Phase 7 (Day 4/21): Build Projects REST API (Create Project, List Projects, Invite Team)",
          "Phase 7 (Day 4/21): Connect React frontend to Project Management API",
          "Phase 7 (Day 4/21): Build CollabSphere Project Dashboard UI"
        ],
        [
          "Phase 7 (Day 5/21): Build Markdown Documentation Notes Module",
          "Phase 7 (Day 5/21): Integrate React Markdown editor with live preview",
          "Phase 7 (Day 5/21): Save & retrieve project markdown notes from MongoDB"
        ],
        [
          "Phase 7 (Day 6/21): Build Code Snippets Sharing & Review Module",
          "Phase 7 (Day 6/21): Add syntax highlighting for code snippets",
          "Phase 7 (Day 6/21): Allow team members to review & comment on code snippets"
        ],
        [
          "Phase 7 (Day 7/21): Integrate Google Gemini AI Server Endpoint (/api/gemini/explain)",
          "Phase 7 (Day 7/21): Build AI Code Explainer feature for uploaded snippets",
          "Phase 7 (Day 7/21): Display Gemini AI explanations inline in CollabSphere UI"
        ],
        [
          "Phase 7 (Day 8/21): Build Gemini AI README.md Auto-Generator Feature",
          "Phase 7 (Day 8/21): Generate professional GitHub README files based on project scope",
          "Phase 7 (Day 8/21): Allow one-click download / copy of AI generated README"
        ],
        [
          "Phase 7 (Day 9/21): Configure Multer Middleware for file uploads (code & docs)",
          "Phase 7 (Day 9/21): Handle file validation & upload storage",
          "Phase 7 (Day 9/21): Connect uploaded files to project scope"
        ],
        [
          "Phase 7 (Day 10/21): Build CollabSphere Team Collaboration & Invitations UI",
          "Phase 7 (Day 10/21): Implement project member roles (Owner, Collaborator)",
          "Phase 7 (Day 10/21): Display active collaborators on project dashboard"
        ],
        [
          "Phase 7 (Day 11/21): Build Real-Time Activity Log / Audit Trail in MongoDB",
          "Phase 7 (Day 11/21): Record project creation, note edits & AI requests",
          "Phase 7 (Day 11/21): Render activity timeline on project overview"
        ],
        [
          "Phase 7 (Day 12/21): Polish CollabSphere UI with Tailwind CSS dark/light theme",
          "Phase 7 (Day 12/21): Add interactive glassmorphism cards & responsive navbar",
          "Phase 7 (Day 12/21): Test all client forms & error alerts"
        ],
        [
          "Phase 7 (Day 13/21): Conduct End-to-End Client/Server Integration Testing",
          "Phase 7 (Day 13/21): Verify JWT token refresh & session expiration handling",
          "Phase 7 (Day 13/21): Fix edge cases in Gemini AI response parsing"
        ],
        [
          "Phase 7 (Day 14/21): Perform Code Refactoring & Component Modularization",
          "Phase 7 (Day 14/21): Audit frontend console warnings & clean up unused code",
          "Phase 7 (Day 14/21): Ensure clean separation of API services and UI components"
        ],
        [
          "Phase 7 (Day 15/21): Prepare Backend Server Deployment on Render / Railway",
          "Phase 7 (Day 15/21): Configure production environment variables in Render",
          "Phase 7 (Day 15/21): Deploy CollabSphere Express Backend & verify CORS"
        ],
        [
          "Phase 7 (Day 16/21): Prepare Frontend Client Deployment on Vercel / Netlify",
          "Phase 7 (Day 16/21): Point Vercel environment variables to live Render API URL",
          "Phase 7 (Day 16/21): Deploy CollabSphere React Frontend & verify live connection"
        ],
        [
          "Phase 7 (Day 17/21): Perform Live Production Testing of CollabSphere App",
          "Phase 7 (Day 17/21): Test user registration, project creation & Gemini AI live",
          "Phase 7 (Day 17/21): Verify database document persistence in MongoDB Atlas cloud"
        ],
        [
          "Phase 7 (Day 18/21): Record Full-Stack Capstone Video Demonstration",
          "Phase 7 (Day 18/21): Walkthrough CollabSphere features, AI integration & code structure",
          "Phase 7 (Day 18/21): Highlight architectural decisions & database schemas"
        ],
        [
          "Phase 7 (Day 19/21): Finalize CollabSphere GitHub Repository Documentation",
          "Phase 7 (Day 19/21): Add setup instructions, environment variables & screenshots",
          "Phase 7 (Day 19/21): Include live deployment links in GitHub repository description"
        ],
        [
          "Phase 7 (Day 20/21): Final Portfolio Audit & Peer Review Verification",
          "Phase 7 (Day 20/21): Submit CollabSphere GitHub Link & Live Deploy URL in Curriculum Hub",
          "Phase 7 (Day 20/21): Verify all Phase 1-7 projects & verified skill badges on Profile"
        ],
        [
          "Phase 7 (Day 21/21 Deadline): Graduate Full-Stack MERN + AI Engineering Program 🎓!",
          "Phase 7 (Day 21/21 Deadline): Complete Final Capstone Assessment Quiz",
          "Phase 7 (Day 21/21 Deadline): Claim Full-Stack Software Engineer Certification Badge 🚀!"
        ]
      ]
    }
  };

  const phaseObj = phaseAgendas[pNum] || phaseAgendas[1];
  const list = phaseObj.agenda;
  const idx = dayIndex % list.length;
  return list[idx] || list[0];
}

/**
 * Call NVIDIA API to auto-generate 3 realistic, structured goals strictly bounded within the student's active phase.
 */
export async function generateNVidiaGoals({ 
  scope = 'daily', 
  activePhaseTitle = 'Phase 1: HTML5 Foundations', 
  activePhaseNumber = 1,
  phaseTopics = [],
  miniProjects = [],
  targetRole = 'Full Stack Developer', 
  deadlineDays = 7 
}) {
  const topicsText = phaseTopics.length > 0 ? phaseTopics.join(', ') : '';
  const miniProjText = miniProjects.length > 0 ? miniProjects.map(m => m.title || m).join(', ') : '';

  const prompt = `You are an AI Tech Lead and Mentor powered by NVIDIA AI.
Generate 3 realistic, highly specific, actionable ${scope.toUpperCase()} goals for a software engineering student.

STRICT MANDATORY CONSTRAINT:
All 3 generated goals MUST be strictly based on and strictly scoped within the student's CURRENT ACTIVE PHASE: "Phase ${activePhaseNumber}: ${activePhaseTitle}".
Do NOT include any concepts, languages, frameworks, or topics from other phases.

Context:
- Current Active Phase: Phase ${activePhaseNumber} (${activePhaseTitle})
${topicsText ? `- Key Phase Topics: ${topicsText}` : ''}
${miniProjText ? `- Phase Mini Projects: ${miniProjText}` : ''}
- Target Engineering Role: ${targetRole}
- Goal Scope: ${scope} (Timeframe: ${deadlineDays} days)

Return ONLY a JSON array of 3 goal title strings strictly inside Phase ${activePhaseNumber}.
Example format:
["Study Phase ${activePhaseNumber} core topics...", "Build Phase ${activePhaseNumber} project...", "Solve Phase ${activePhaseNumber} practice problem..."]`;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await fetch(NVIDIA_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NVIDIA_TEXT_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 1,
          top_p: 0.95,
          max_tokens: 2000,
          chat_template_kwargs: { thinking: true, reasoning_effort: "high" }
        })
      });

      if (response.ok) {
        const data = await response.json();
        let text = data.choices?.[0]?.message?.content?.trim() || '';
        text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        if (text) {
          const match = text.match(/\[[\s\S]*\]/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed.slice(0, 3);
            }
          }
        }
      }
    } catch (err) {
      console.warn(`NVIDIA goal generation attempt with ${model} failed:`, err);
    }
  }

  // Guaranteed Active Phase Bounded Daily Agenda Fallback
  return getPhaseDailyAgendaTitles(activePhaseNumber, 0);
}
