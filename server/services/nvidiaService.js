const NVIDIA_API_URL = process.env.NVIDIA_API_URL || 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct';
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const NVIDIA_REQUEST_TIMEOUT_MS = Number(process.env.NVIDIA_REQUEST_TIMEOUT_MS) || 30000;

export const callNvidiaModel = async ({ messages, maxTokens = 4000, model = NVIDIA_MODEL }) => {
  const apiKey = NVIDIA_API_KEY;
  let rawUrl = NVIDIA_API_URL;
  if (!rawUrl.endsWith('/chat/completions')) {
    rawUrl = rawUrl.replace(/\/+$/, '') + '/chat/completions';
  }

  if (!apiKey) throw new Error(`NVIDIA_API_KEY is not configured on server`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), NVIDIA_REQUEST_TIMEOUT_MS);

  const requestBody = {
    model: model || NVIDIA_MODEL,
    messages,
    temperature: 0.7,
    top_p: 0.95,
    max_tokens: maxTokens
  };

  try {
    const response = await fetch(rawUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const providerError = await response.text();
      console.error(`NVIDIA API error:`, providerError);
      throw new Error(`NVIDIA model request failed (HTTP ${response.status})`);
    }

    const payload = await response.json();
    const message = payload.choices?.[0]?.message;
    const content = (message?.content || '').replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    if (!content) throw new Error(`NVIDIA model returned an empty response`);
    return { content, reasoning: message.reasoning || message.reasoning_content };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};
