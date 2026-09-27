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
 * Sanitize error messages so that API keys, tokens, or authorization headers are never logged.
 */
function sanitizeError(err: any): string {
  let msg = err?.message || String(err);
  msg = msg.replace(/AIza[0-9A-Za-z-_]{20,}/g, '[REDACTED_API_KEY]');
  msg = msg.replace(/gsk_[0-9A-Za-z-_]{20,}/g, '[REDACTED_GROQ_KEY]');
  msg = msg.replace(/sk-or-[0-9A-Za-z-_]{20,}/g, '[REDACTED_OPENROUTER_KEY]');
  msg = msg.replace(/AQ\.[0-9A-Za-z-_]{20,}/g, '[REDACTED_TOKEN]');
  msg = msg.replace(/Bearer\s+[^\s"']+/gi, 'Bearer [REDACTED]');
  return msg;
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
      console.warn(`[AI] ${providerName} attempt 1 failed (${sanitizeError(firstErr)}). Retrying once...`);
      return await fn();
    }
  }

  // -------------------------------------------------------------
  // 1. PRIMARY: Gemini 2.5 Flash
  // -------------------------------------------------------------
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  console.log(`[AI] Gemini attempt | Task: ${options.task} | Model: ${geminiModel}`);
  try {
    const text = await runWithOneRetry('Gemini', () => tryGemini(options));
    const validated = validateJson(text);
    console.log(`[AI] Gemini status: SUCCESS | Task: ${options.task} | Model: ${geminiModel}`);
    return {
      success: true,
      provider: 'gemini',
      model: geminiModel,
      response: validated,
      fallbackUsed: false,
    };
  } catch (geminiErr: any) {
    fallbackUsed = true;
    const cleanErr = sanitizeError(geminiErr);
    fallbackReason = `gemini_failed: ${cleanErr}`;
    console.warn(`[AI] Gemini status: FAILURE | Task: ${options.task} | Error: ${cleanErr} -> Falling back to Groq`);
  }

  // -------------------------------------------------------------
  // 2. FALLBACK 1: Groq GPT-OSS 120B
  // -------------------------------------------------------------
  const groqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
  console.log(`[AI] Groq attempt | Task: ${options.task} | Model: ${groqModel}`);
  try {
    const text = await runWithOneRetry('Groq', () => tryGroq(options));
    const validated = validateJson(text);
    console.log(`[AI] Groq status: SUCCESS | Task: ${options.task} | Model: ${groqModel}`);
    return {
      success: true,
      provider: 'groq',
      model: groqModel,
      response: validated,
      fallbackUsed: true,
      fallbackReason,
    };
  } catch (groqErr: any) {
    const cleanErr = sanitizeError(groqErr);
    fallbackReason = `groq_failed: ${cleanErr}`;
    console.warn(`[AI] Groq status: FAILURE | Task: ${options.task} | Error: ${cleanErr} -> Falling back to OpenRouter`);
  }

  // -------------------------------------------------------------
  // 3. FALLBACK 2: OpenRouter Free
  // -------------------------------------------------------------
  const openRouterModel = process.env.OPENROUTER_MODEL || 'openrouter/free';
  console.log(`[AI] OpenRouter attempt | Task: ${options.task} | Model: ${openRouterModel}`);
  try {
    const text = await runWithOneRetry('OpenRouter', () => tryOpenRouter(options));
    const validated = validateJson(text);
    console.log(`[AI] OpenRouter status: SUCCESS | Task: ${options.task} | Model: ${openRouterModel}`);
    return {
      success: true,
      provider: 'openrouter',
      model: openRouterModel,
      response: validated,
      fallbackUsed: true,
      fallbackReason,
    };
  } catch (openRouterErr: any) {
    const cleanErr = sanitizeError(openRouterErr);
    fallbackReason = `openrouter_failed: ${cleanErr}`;
    console.warn(`[AI] OpenRouter status: FAILURE | Task: ${options.task} | Error: ${cleanErr} -> Falling back to Deterministic Engine`);
  }

  // -------------------------------------------------------------
  // 4. FINAL FALLBACK: Caller triggers deterministic engine
  // -------------------------------------------------------------
  console.log(`[AI] Deterministic fallback engaged | Task: ${options.task}`);
  return {
    success: false,
    provider: 'none',
    model: 'none',
    response: '',
    fallbackUsed: true,
    fallbackReason: 'all_providers_failed',
  };
}
