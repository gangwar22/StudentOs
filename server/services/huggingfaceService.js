const HUGGINGFACE_MODEL = process.env.HUGGINGFACE_MODEL || process.env.VITE_HUGGINGFACE_MODEL || 'deepseek-ai/DeepSeek-V3.2-Exp:novita';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN || process.env.NOVITA_API_KEY || '';

const HF_ROUTER_URLS = [
  'https://router.huggingface.co/novita/v1/chat/completions',
  'https://router.huggingface.co/v1/chat/completions',
  'https://api.novita.ai/v3/openai/chat/completions'
];

export const callHuggingFaceModel = async ({ messages, maxTokens = 2000, model = HUGGINGFACE_MODEL }) => {
  const selectedModel = model || HUGGINGFACE_MODEL;
  const apiKey = HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY / NOVITA_API_KEY is not configured');
  }

  let lastErr = null;

  for (const url of HF_ROUTER_URLS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages,
          temperature: 0.7,
          max_tokens: maxTokens
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`HuggingFace Novita API error (${url}):`, errorText);
        lastErr = new Error(`HuggingFace API HTTP ${response.status}`);
        continue;
      }

      const payload = await response.json();
      const message = payload.choices?.[0]?.message;
      let content = (message?.content || '').replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

      if (!content) {
        lastErr = new Error('HuggingFace model returned empty content');
        continue;
      }

      return {
        content,
        model: selectedModel,
        reasoning: message?.reasoning || message?.reasoning_content
      };
    } catch (err) {
      clearTimeout(timeoutId);
      lastErr = err;
    }
  }

  throw lastErr || new Error('HuggingFace Novita model request failed');
};
