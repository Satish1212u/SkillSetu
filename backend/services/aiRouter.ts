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
  provider: 'gemini' | 'groq' | 'openrouter' | 'none';
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

/**
 * Check if the error is a permanent configuration issue (missing/invalid key) where retry would just waste time.
 */
function isNonRetryableError(err: any): boolean {
  const msg = (err?.message || String(err)).toLowerCase();
  return (
    msg.includes('missing') ||
    msg.includes('invalid api key') ||
    msg.includes('api_key_invalid') ||
    msg.includes('401') ||
    msg.includes('unauthorized') ||
    msg.includes('403') ||
    msg.includes('forbidden')
  );
}

// 1. PRIMARY: Gemini 2.5 Flash
async function tryGemini(options: AIRequestOptions): Promise<string> {
  const ai = getNativeAIClient();
  if (!ai) throw new Error('GEMINI_API_KEY missing or unconfigured');

  const model = process.env.GEMINI_MODEL || options.modelChoice || 'gemini-2.5-flash';

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
      ? `${options.systemPrompt}\n\nUSER PROMPT: "${options.userPrompt || ''}"`
      : (options.userPrompt || '');
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

  const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS) || 10000;

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('TIMEOUT: Gemini exceeded response time')), timeoutMs);
  });

  const responsePromise = ai.models.generateContent({
    model,
    contents: contentsPayload,
    config,
  });

  const response = await Promise.race([responsePromise, timeoutPromise]);
  if (!response?.text) throw new Error('Empty response from Gemini');
  return response.text;
}

// Generic OpenAI-compatible runner for Groq and OpenRouter
async function tryOpenAICompatible(
  providerName: 'GROQ' | 'OPENROUTER',
  url: string,
  apiKey: string,
  model: string,
  options: AIRequestOptions,
  timeout: number
): Promise<string> {
  if (!apiKey || apiKey.startsWith('MY_') || apiKey.trim().length < 5) {
    throw new Error(`${providerName}_API_KEY missing or invalid`);
  }

  const messages: any[] = [];
  if (options.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt });
  }

  if (options.messages && options.messages.length > 0) {
    messages.push(
      ...options.messages.map(m => ({
        role: m.role === 'model' ? 'assistant' : m.role,
        content: m.content,
      }))
    );
  } else if (options.userPrompt) {
    messages.push({ role: 'user', content: options.userPrompt });
  } else if (options.geminiContentsPayload && typeof options.geminiContentsPayload === 'string') {
    messages.push({ role: 'user', content: options.geminiContentsPayload });
  } else if (options.geminiContentsPayload) {
    messages.push({ role: 'user', content: JSON.stringify(options.geminiContentsPayload) });
  }

  const body: any = {
    model,
    messages,
  };

  if (options.responseFormat === 'json') {
    body.response_format = { type: 'json_object' };
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  if (providerName === 'OPENROUTER') {
    const appUrl =
      process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL'
        ? process.env.APP_URL
        : 'https://skillsetu.gov.in';
    headers['HTTP-Referer'] = appUrl;
    headers['X-Title'] = 'SkillSetu';
  }

  const res = await fetchWithTimeout(
    url,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    },
    timeout
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${errText.slice(0, 120)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error(`Empty response from ${providerName}`);
  return content;
}

// 2. FALLBACK 1: Groq GPT-OSS 120B
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

// 3. FALLBACK 2: OpenRouter Free
async function tryOpenRouter(options: AIRequestOptions): Promise<string> {
  return tryOpenAICompatible(
    'OPENROUTER',
    'https://openrouter.ai/api/v1/chat/completions',
    process.env.OPENROUTER_API_KEY || '',
    process.env.OPENROUTER_MODEL || 'openrouter/free',
    options,
    Number(process.env.OPENROUTER_TIMEOUT_MS) || 15000
  );
}

/**
 * Centralized AI Router implementing the strict provider fallback chain:
 * 1. Gemini 2.5 Flash (Primary)
 *      ↓ [429, 500, 502, 503, timeout, unavailable model, invalid API key, network error]
 * 2. Groq GPT-OSS 120B (Fallback 1)
 *      ↓ [failure / timeout / rate limit]
 * 3. OpenRouter Free (Fallback 2)
 *      ↓ [all AI providers fail]
 * 4. Deterministic Engine (Final Fallback)
 */
export async function generateAIResponse(options: AIRequestOptions): Promise<StandardAIResponse> {
  let fallbackReason = '';
  let fallbackUsed = false;

  const validateJson = (text: string) => {
    if (options.responseFormat !== 'json') return text;
    try {
      JSON.parse(text);
      return text;
    } catch {
      throw new Error('Malformed JSON received from AI provider');
    }
  };

  // Helper to execute with maximum 1 retry for transient errors
  async function runWithOneRetry(providerName: string, fn: () => Promise<string>): Promise<string> {
    try {
      return await fn();
    } catch (firstErr: any) {
      if (isNonRetryableError(firstErr)) {
        throw firstErr;
      }
      console.warn(`[AI ROUTER] ${providerName} attempt 1 failed (${firstErr.message}). Retrying once...`);
      return await fn();
    }
  }

  // -------------------------------------------------------------
  // 1. PRIMARY: Gemini 2.5 Flash
  // -------------------------------------------------------------
  try {
    const text = await runWithOneRetry('Gemini', () => tryGemini(options));
    const validated = validateJson(text);
    console.log(`[AI ROUTER] Task: ${options.task} | Provider: Gemini | Model: ${process.env.GEMINI_MODEL || 'gemini-2.5-flash'} | Status: SUCCESS`);
    return {
      success: true,
      provider: 'gemini',
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      response: validated,
      fallbackUsed: false,
    };
  } catch (geminiErr: any) {
    fallbackUsed = true;
    fallbackReason = `gemini_failed: ${geminiErr.message}`;
    console.warn(`[AI ROUTER] Task: ${options.task} | Gemini FAILED (${geminiErr.message}) -> Falling back to Groq`);
  }

  // -------------------------------------------------------------
  // 2. FALLBACK 1: Groq GPT-OSS 120B
  // -------------------------------------------------------------
  try {
    const text = await runWithOneRetry('Groq', () => tryGroq(options));
    const validated = validateJson(text);
    console.log(`[AI ROUTER] Task: ${options.task} | Provider: Groq | Model: ${process.env.GROQ_MODEL || 'openai/gpt-oss-120b'} | Status: SUCCESS`);
    return {
      success: true,
      provider: 'groq',
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
      response: validated,
      fallbackUsed: true,
      fallbackReason,
    };
  } catch (groqErr: any) {
    fallbackReason = `groq_failed: ${groqErr.message}`;
    console.warn(`[AI ROUTER] Task: ${options.task} | Groq FAILED (${groqErr.message}) -> Falling back to OpenRouter`);
  }

  // -------------------------------------------------------------
  // 3. FALLBACK 2: OpenRouter Free
  // -------------------------------------------------------------
  try {
    const text = await runWithOneRetry('OpenRouter', () => tryOpenRouter(options));
    const validated = validateJson(text);
    console.log(`[AI ROUTER] Task: ${options.task} | Provider: OpenRouter | Model: ${process.env.OPENROUTER_MODEL || 'openrouter/free'} | Status: SUCCESS`);
    return {
      success: true,
      provider: 'openrouter',
      model: process.env.OPENROUTER_MODEL || 'openrouter/free',
      response: validated,
      fallbackUsed: true,
      fallbackReason,
    };
  } catch (openRouterErr: any) {
    fallbackReason = `openrouter_failed: ${openRouterErr.message}`;
    console.warn(`[AI ROUTER] Task: ${options.task} | OpenRouter FAILED (${openRouterErr.message}) -> Falling back to Deterministic Engine`);
  }

  // -------------------------------------------------------------
  // 4. FINAL FALLBACK: Caller triggers deterministic engine
  // -------------------------------------------------------------
  return {
    success: false,
    provider: 'none',
    model: 'none',
    response: '',
    fallbackUsed: true,
    fallbackReason: 'all_providers_failed',
  };
}
