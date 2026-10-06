import { callGeminiModel, parseJsonResponse, shuffleQuestionsAndOptions, generateServerQuizQuestions } from '../services/geminiService.js';

export const generateAssessmentQuiz = async (req, res) => {
  try {
    const { phaseNumber = 1, phaseTitle = 'Web Development', phaseTopics = [], seed = Date.now(), askedQuestionIds = [] } = req.body;
    const pNum = Number(phaseNumber) || 1;

    const phaseStrictConceptsMap = {
      1: "STRICT REQUIREMENT: Test ONLY pure HTML5 Semantic elements & Document Structure (<!DOCTYPE>, <html>, <head>, <body>, <header>, <nav>, <main>, <section>, <article>, <aside>, <footer>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <form>, <label>, <input type='text|email|radio|checkbox|date|number'>, <select>, <option>, <textarea>, <a>, <img> with alt, <iframe>, <details>, <summary>). DO NOT include any CSS, JavaScript, Node, React, or Database questions!",
      2: "STRICT REQUIREMENT: Test ONLY CSS3 styling & responsive layout concepts (* { box-sizing: border-box }, Flexbox align-items/justify-content/flex-wrap, CSS Grid grid-template-columns/fr units, Box Model content-box/border-box, Selectors tag/class/ID specificity, Media Queries max-width 768px/480px, rem/em units, position relative/absolute/fixed/sticky, CSS transitions, object-fit cover). DO NOT include HTML forms, JS loops, or Backend questions!",
      2.5: "STRICT REQUIREMENT: Test ONLY Core JavaScript Foundations & Algorithmic Logic (let vs const vs var, Data Types string/number/boolean/typeof, Operators ===/!==/??/&&/||, Arrays & Array methods map/filter/reduce/slice/splice/find, Objects key-value/destructuring, Functions & Arrow Functions, if/else/switch Conditionals, for/while Loops, Scope, Coercion). DO NOT include DOM manipulation, CSS layout, or Backend questions!",
      3: "STRICT REQUIREMENT: Test ONLY Browser DOM Manipulation & Interactivity (document.querySelector, document.getElementById, textContent, innerHTML, element.style, classList.add/toggle, document.createElement, appendChild, addEventListener for click/submit/input, event.preventDefault(), Event Delegation, localStorage.setItem/getItem, sessionStorage, JSON.parse/stringify). DO NOT include Node.js, Express, or MongoDB questions!",
      4: "STRICT REQUIREMENT: Test ONLY Modern ES6+ & Google Gemini REST API Integration (Arrow functions, Template Literals, Destructuring, Promises Pending/Fulfilled/Rejected, async/await, try/catch error handling, Web fetch() API, HTTP Headers, JSON.stringify/parse, Gemini API generateContent endpoint, prompt engineering). DO NOT include Node backend servers or MongoDB questions!",
      5: "STRICT REQUIREMENT: Test ONLY Node.js Runtime & Express.js Backend Development (Node.js runtime, npm init, CommonJS require vs ES Modules import, express() server, app.get/app.post routes, req.body/req.params/req.query, middleware app.use(express.json()), CORS cors(), .env & process.env.GEMINI_API_KEY with dotenv, HTTP Status Codes 200/201/400/401/404/500). DO NOT include React state or MongoDB database questions!",
      6: "STRICT REQUIREMENT: Test ONLY NoSQL Database with MongoDB & Mongoose ODM (MongoDB Atlas cloud connection URI, Mongoose Schema definition with required/default/unique/timestamps, mongoose.model, CRUD operations .save(), .find(), .findOne(), .findById(), findByIdAndUpdate(), findByIdAndDelete(), ObjectIDs, .populate()). DO NOT include HTML/CSS layout questions!",
      7: "STRICT REQUIREMENT: Test ONLY Full-Stack MERN Architecture, JWT Security & Capstone Systems (Full-Stack integration React frontend to Express backend, REST API design, bcrypt password hashing, jsonwebtoken JWT signing/verification with Bearer header, protected authMiddleware, Mongoose schema relationships, Multer file upload middleware, SimpleMDE markdown, Production deployment on Render/Vercel)."
    };

    const conceptGuidance = phaseStrictConceptsMap[pNum] || phaseStrictConceptsMap[1];
    const topics = phaseTopics.length ? phaseTopics.join(', ') : `${phaseTitle} concepts`;

    const uniqueSeed = `${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

    const messages = [
      {
        role: 'system',
        content: `You are an expert technical examiner. Generate 10 to 15 challenging, unique, dynamic MCQs for Phase ${pNum}: "${phaseTitle}". ${conceptGuidance} Focus on: ${topics}. Seed: ${uniqueSeed}. DO NOT repeat standard introductory questions. Return ONLY a valid JSON array of 10 to 15 objects with keys: id, question, options (4 strings), correctIndex (0-3), explanation (under 10 words).`
      },
      { role: 'user', content: `Create a completely unique Phase ${pNum} assessment quiz for ${phaseTitle}. Seed: ${uniqueSeed}.` }
    ];

    // 4.0 second race for dynamic AI questions or sub-100ms instant pool fallback
    const fetchAiQuizWithTimeout = async () => {
      const result = await callGeminiModel({ messages, maxTokens: 4000, jsonMode: true });
      const rawParsed = parseJsonResponse(result.content);
      const questionsList = Array.isArray(rawParsed)
        ? rawParsed
        : (Array.isArray(rawParsed?.questions) ? rawParsed.questions : (Array.isArray(rawParsed?.data) ? rawParsed.data : []));

      if (questionsList.length > 0) {
        const formattedQuestions = questionsList.slice(0, 15).map((question, index) => ({
          id: question.id || `p${phaseNumber}-q${index + 1}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          question: question.question,
          options: Array.isArray(question.options) && question.options.length === 4 ? question.options : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctIndex: Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex <= 3 ? question.correctIndex : 0,
          explanation: question.explanation || 'Review the related phase concept.'
        }));

        return {
          model: result.model || 'gemini-2.5-flash',
          questions: shuffleQuestionsAndOptions(formattedQuestions)
        };
      }
      throw new Error('Invalid AI response structure');
    };

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Fast quiz timeout')), 12000)
    );

    try {
      const aiQuizResult = await Promise.race([fetchAiQuizWithTimeout(), timeoutPromise]);
      return res.json({
        success: true,
        model: aiQuizResult.model,
        quiz: {
          id: `quiz-phase-${phaseNumber}-${Date.now()}`,
          phaseNumber: Number(phaseNumber),
          phaseTitle,
          title: `Phase ${phaseNumber}: ${phaseTitle} Diagnostic Assessment`,
          category: `Gemini AI Phase ${phaseNumber}`,
          timeLimitMinutes: 15,
          passingScore: 80,
          questions: aiQuizResult.questions
        }
      });
    } catch (fastErr) {
      console.warn('Fast Gemini quiz timeout/skipped (< 2.5s), serving instant question engine:', fastErr.message);
    }

    // Instant Sub-100ms Response Fallback Question Engine
    const serverQuestions = generateServerQuizQuestions(pNum, askedQuestionIds);
    return res.json({
      success: true,
      model: 'server-quiz-engine',
      quiz: {
        id: `quiz-phase-${phaseNumber}-${Date.now()}`,
        phaseNumber: Number(phaseNumber),
        phaseTitle,
        title: `Phase ${phaseNumber}: ${phaseTitle} Diagnostic Assessment`,
        category: `Phase ${phaseNumber} Assessment`,
        timeLimitMinutes: 15,
        passingScore: 80,
        questions: serverQuestions
      }
    });
  } catch (err) {
    console.error('Assessment generation error:', err);
    res.status(500).json({ success: false, error: 'Unable to generate assessment' });
  }
};
