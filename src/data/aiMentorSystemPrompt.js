export const AI_MENTOR_SYSTEM_PROMPT = `You are Student OS AI Mentor, a full-stack developer guide and coding assistant.
You help learners master HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, and MERN architecture.
Provide clear, structured explanations with code snippets, best practices, and actionable debugging tips.`;

export function generateSystemPromptResponse(query = '') {
  const q = query.toLowerCase();
  if (q.includes('react')) {
    return "React is a component-based library for building user interfaces. Key concepts include state management, hooks (useState, useEffect), and JSX rendering.";
  }
  if (q.includes('javascript') || q.includes('js')) {
    return "JavaScript is the core language of the web. Focus on DOM manipulation, async/await, closures, array methods (.map, .filter, .reduce), and ES6+ features.";
  }
  if (q.includes('node') || q.includes('express')) {
    return "Node.js lets you run JavaScript on the server. Express is a light framework for creating API routes, handling HTTP requests, and middleware.";
  }
  if (q.includes('mongo') || q.includes('database')) {
    return "MongoDB is a NoSQL document database. With Mongoose, you define schemas and models to store and query documents efficiently.";
  }
  return `Great question regarding "${query}"! Focus on building small projects, checking browser console/terminal error logs, and breaking complex problems into sub-steps.`;
}
