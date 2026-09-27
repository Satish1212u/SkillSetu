import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

export function getNativeAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export interface StandardAIResponse {
  success: boolean;
  provider: string;
  model: string;
  response: string;
  fallbackUsed: boolean;
  fallbackReason?: string;
}

export interface AIRequestOptions {
  task: string;
  systemPrompt?: string;
  userPrompt?: string;
  responseFormat?: 'json' | 'text';
  geminiContentsPayload?: any; // For Gemini specific payloads
  geminiSchema?: any; // For Gemini structured output
  messages?: { role: string; content: string }[]; // For chat
  modelChoice?: string;
}

const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

async function tryGemini(options: AIRequestOptions): Promise<string> {
  const ai = getNativeAIClient();
  if (!ai) throw new Error('GEMINI_API_KEY missing');
  
  const model = options.modelChoice || process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  
  let contentsPayload: any;
  if (options.geminiContentsPayload) {
    contentsPayload = options.geminiContentsPayload;
  } else if (options.messages && options.messages.length > 0) {
    contentsPayload = options.messages.map(m => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
  } else {
    contentsPayload = options.systemPrompt 
      ? `${options.systemPrompt}\n\nUSER PROMPT: "${options.userPrompt}"` 
      : options.userPrompt;
  }

  const config: any = {};
  if (options.responseFormat === 'json') {
    config.responseMimeType = 'application/json';
    if (options.geminiSchema) {
      config.responseSchema = options.geminiSchema;
    }
  }
  
  if (options.systemPrompt && !options.geminiContentsPayload && (!options.userPrompt || options.messages)) {
    config.systemInstruction = options.systemPrompt;
  }

  const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS) || 15000;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs);
  });

  const responsePromise = ai.models.generateContent({
    model,
    contents: contentsPayload,
    config,
  });

  const response = await Promise.race([responsePromise, timeoutPromise]);
  if (!response.text) throw new Error('Empty response from Gemini');
  return response.text;
}

async function tryOpenAICompatible(
  providerName: string,
  url: string,
  apiKey: string,
  model: string,
  options: AIRequestOptions,
  timeout: number
): Promise<string> {
  if (!apiKey || apiKey.startsWith('MY_')) throw new Error(`${providerName}_API_KEY missing`);

  const messages: any[] = [];
  if (options.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt });
  }

  if (options.messages && options.messages.length > 0) {
    messages.push(...options.messages.map(m => ({
      role: m.role === 'model' ? 'assistant' : m.role,
      content: m.content
    })));
  } else if (options.userPrompt) {
    messages.push({ role: 'user', content: options.userPrompt });
  } else if (options.geminiContentsPayload && typeof options.geminiContentsPayload === 'string') {
    messages.push({ role: 'user', content: options.geminiContentsPayload });
  } else if (options.geminiContentsPayload) {
    // Basic stringification if it was a complex object like PDF base64
    messages.push({ role: 'user', content: JSON.stringify(options.geminiContentsPayload) });
  }

  const body: any = {
    model,
    messages,
  };

  if (options.responseFormat === 'json') {
    body.response_format = { type: 'json_object' };
  }

  const res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  }, timeout);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

async function tryGroq(options: AIRequestOptions): Promise<string> {
  return tryOpenAICompatible(
    'GROQ',
    'https://api.groq.com/openai/v1/chat/completions',
    process.env.GROQ_API_KEY || '',
    process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    options,
    Number(process.env.GROQ_TIMEOUT_MS) || 10000
  );
}

async function tryOpenRouter(options: AIRequestOptions): Promise<string> {
  return tryOpenAICompatible(
    'OPENROUTER',
    'https://openrouter.ai/api/v1/chat/completions',
    process.env.OPENROUTER_API_KEY || '',
    process.env.OPENROUTER_MODEL || 'openrouter/free',
    options,
    Number(process.env.OPENROUTER_TIMEOUT_MS) || 20000
  );
}

export async function generateAIResponse(options: AIRequestOptions): Promise<StandardAIResponse> {
  let fallbackReason = '';
  let fallbackUsed = false;

  const validateJson = (text: string) => {
    if (options.responseFormat !== 'json') return text;
    try {
      JSON.parse(text);
      return text;
    } catch {
      throw new Error('Malformed JSON');
    }
  };

  // 1. Try Gemini
  try {
    const text = await tryGemini(options);
    console.log(`[AI ROUTER] Task: ${options.task} | Provider: Gemini | Status: SUCCESS`);
    return {
      success: true,
      provider: 'gemini',
      model: options.modelChoice || process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      response: validateJson(text),
      fallbackUsed: false
    };
  } catch (err: any) {
    console.error(`[AI ROUTER] Task: ${options.task} | Provider: Gemini | Status: FAILED | Reason: ${err.message}`);
    // Retry once
    try {
      const text = await tryGemini(options);
      console.log(`[AI ROUTER] Task: ${options.task} | Provider: Gemini (Retry) | Status: SUCCESS`);
      return {
        success: true,
        provider: 'gemini',
        model: options.modelChoice || process.env.GEMINI_MODEL || 'gemini-3.8-flash',
        response: validateJson(text),
        fallbackUsed: false
      };
    } catch (err2: any) {
      fallbackReason = 'gemini_failed';
      fallbackUsed = true;
      console.error(`[AI ROUTER] Task: ${options.task} | Provider: Gemini (Retry) | Status: FAILED | Reason: ${err2.message}`);
      console.log(`[AI ROUTER] Task: ${options.task} | Provider: Gemini | Fallback: Groq`);
    }
  }

  // 2. Try Groq
  try {
    const text = await tryGroq(options);
    console.log(`[AI ROUTER] Task: ${options.task} | Provider: Groq | Status: SUCCESS`);
    return {
      success: true,
      provider: 'groq',
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
      response: validateJson(text),
      fallbackUsed,
      fallbackReason
    };
  } catch (err: any) {
    console.error(`[AI ROUTER] Task: ${options.task} | Provider: Groq | Status: FAILED | Reason: ${err.message}`);
    // Retry once
    try {
      const text = await tryGroq(options);
      console.log(`[AI ROUTER] Task: ${options.task} | Provider: Groq (Retry) | Status: SUCCESS`);
      return {
        success: true,
        provider: 'groq',
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
        response: validateJson(text),
        fallbackUsed,
        fallbackReason
      };
    } catch (err2: any) {
      fallbackReason = 'gemini_and_groq_failed';
      console.error(`[AI ROUTER] Task: ${options.task} | Provider: Groq (Retry) | Status: FAILED | Reason: ${err2.message}`);
      console.log(`[AI ROUTER] Task: ${options.task} | Provider: Groq | Fallback: OpenRouter`);
    }
  }

  // 3. Try OpenRouter
  try {
    const text = await tryOpenRouter(options);
    console.log(`[AI ROUTER] Task: ${options.task} | Provider: OpenRouter | Status: SUCCESS`);
    return {
      success: true,
      provider: 'openrouter',
      model: process.env.OPENROUTER_MODEL || 'openrouter/free',
      response: validateJson(text),
      fallbackUsed,
      fallbackReason
    };
  } catch (err: any) {
    console.error(`[AI ROUTER] Task: ${options.task} | Provider: OpenRouter | Status: FAILED | Reason: ${err.message}`);
    // Retry once
    try {
      const text = await tryOpenRouter(options);
      console.log(`[AI ROUTER] Task: ${options.task} | Provider: OpenRouter (Retry) | Status: SUCCESS`);
      return {
        success: true,
        provider: 'openrouter',
        model: process.env.OPENROUTER_MODEL || 'openrouter/free',
        response: validateJson(text),
        fallbackUsed,
        fallbackReason
      };
    } catch (err2: any) {
      console.error(`[AI ROUTER] Task: ${options.task} | Provider: OpenRouter (Retry) | Status: FAILED | Reason: ${err2.message}`);
      console.log(`[AI ROUTER] Task: ${options.task} | Fallback: Deterministic/Error`);
    }
  }

  return {
    success: false,
    provider: 'none',
    model: 'none',
    response: '',
    fallbackUsed: true,
    fallbackReason: 'all_providers_failed'
  };
}
