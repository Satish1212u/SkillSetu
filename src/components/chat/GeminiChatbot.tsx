import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { UserRole } from '../../types';
import { KaushalSetuLogo } from '../common/KaushalSetuLogo';
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  Bot,
  User,
  Zap,
  Cpu,
  Brain,
  Copy,
  Check,
  ChevronDown,
  Minimize2,
  Maximize2,
  Loader2,
  Info,
  SlidersHorizontal,
} from 'lucide-react';

interface GeminiChatbotProps {
  currentRole: UserRole;
  userName: string;
  organizationName?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

type ModelType = 'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  modelUsed?: string;
  timestamp: string;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  currentRole,
  userName,
  organizationName,
  isOpen = false,
  onClose,
}) => {
  const [modelChoice, setModelChoice] = useState<ModelType>('gemini-3.5-flash');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Welcome, ${userName}! I am your SkillSetu Help assistant.

I am grounded in your **${currentRole}** context. You can ask me to:
- Diagnose skill gaps and evaluate job postings
- Review and recommend curriculum updates for higher education
- Draft job requirements and evaluate candidate competencies
- Analyze national Industry Demand deficits and forecast trends

Select a model based on your task complexity:
- **gemini-3.5-flash**: Ideal for general market & skill queries
- **gemini-3.1-pro-preview**: Best for deep curriculum restructuring & complex strategy
- **gemini-3.1-flash-lite**: Optimized for ultra-fast lookups`,
      modelUsed: 'gemini-3.5-flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [customSystemInstruction, setCustomSystemInstruction] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Role-based quick prompts
  const rolePromptMap: Record<UserRole, string[]> = {
    STUDENT: [
      'Why do I need Docker & AWS for a DevOps Engineer role in 2026?',
      'Analyze how to close my 50% skill gap for Razorpay Associate DevOps position',
      'What are the highest paying technical skills in Bengaluru & Pune right now?',
      'Generate a 4-week study plan for containerization & Kubernetes basics',
    ],
    INSTITUTE: [
      'How can we modernize our 5th semester Operating Systems syllabus to include Docker?',
      'Explain why our Computer Engineering curriculum alignment score is currently 48.2%',
      'What practical lab projects should we introduce for Cloud Native Architecture?',
      'Draft a formal academic proposal to replace legacy 8086 assembly lectures with DevOps credits',
    ],
    EMPLOYER: [
      'Draft a comprehensive job description for a Senior DevOps Platform Engineer in Bengaluru',
      'What are the most common practical skill deficits seen in Indian engineering freshers?',
      'Generate 5 scenario-based interview questions to assess Kubernetes troubleshooting',
      'How to evaluate candidates on AWS IAM security and infrastructure-as-code',
    ],
    ADMIN: [
      'Synthesize a policy memo on the 2.47x containerization shortage across Maharashtra & Karnataka',
      'Compare demand-to-supply ratios between Generative AI and traditional Full-Stack roles',
      'What interventions should AICTE implement in Tier-2 technical universities for FY2026-27?',
      'Generate a summary of monitored state university capacities and deficit hotspots',
    ],
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setLoading(true);

    try {
      // Map all conversation history for the multi-turn API
      const historyPayload = newMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const res = await api.sendChatMessage({
        messages: historyPayload,
        modelChoice,
        systemInstruction: customSystemInstruction || undefined,
        userRole: currentRole,
        userName,
        organization: organizationName,
      });

      const assistantMessage: Message = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        modelUsed: res.modelUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Error generating response: ${err.message || 'Please check your connection and retry.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (confirm('Start a fresh conversation thread?')) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: `New conversation started with **${modelChoice}**. How can I help you today regarding skill intelligence or Industry Demand insights?`,
          modelUsed: modelChoice,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-200 flex flex-col bg-white border border-slate-300 shadow-2xl rounded-2xl overflow-hidden ${
        isExpanded
          ? 'inset-4 md:inset-8'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[480px] h-[640px] max-h-[88vh]'
      }`}
    >
      {/* Header */}
      <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <KaushalSetuLogo size="sm" variant="icon" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight">SkillSetu Help</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                Multi-Turn
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Role: <span className="text-white font-medium">{currentRole}</span> · {userName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button
            type="button"
            onClick={() => setShowSystemPrompt(!showSystemPrompt)}
            title="Configure System Role Instruction"
            className={`p-1.5 rounded hover:text-white hover:bg-slate-800 transition-colors ${
              showSystemPrompt ? 'text-indigo-400 bg-slate-800' : ''
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleClearHistory}
            title="Clear Thread & Restart"
            className="p-1.5 rounded hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Restore Size' : 'Expand Fullscreen'}
            className="p-1.5 rounded hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close Chat"
              className="p-1.5 rounded hover:text-white hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Model Selector Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Model Engine:</span>
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setModelChoice('gemini-3.1-flash-lite')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                modelChoice === 'gemini-3.1-flash-lite'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Ultra-fast responses for quick definitions & lookups"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Flash-Lite</span>
            </button>

            <button
              type="button"
              onClick={() => setModelChoice('gemini-3.5-flash')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                modelChoice === 'gemini-3.5-flash'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="General tasks: balanced speed & deep Industry Demand understanding"
            >
              <Cpu className="w-3 h-3 text-indigo-400" />
              <span>3.5 Flash</span>
            </button>

            <button
              type="button"
              onClick={() => setModelChoice('gemini-3.1-pro-preview')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                modelChoice === 'gemini-3.1-pro-preview'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Complex tasks: deep curriculum restructuring, econometric modeling & policy synthesis"
            >
              <Brain className="w-3 h-3 text-emerald-400" />
              <span>3.1 Pro</span>
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>{modelChoice}</span>
        </div>
      </div>

      {/* System Prompt Customizer Collapsible */}
      {showSystemPrompt && (
        <div className="bg-amber-50/70 border-b border-amber-200 p-3 text-xs space-y-2">
          <div className="flex items-center justify-between text-amber-900 font-bold">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-700" />
              Active System Role Instruction
            </span>
            <button
              type="button"
              onClick={() => setCustomSystemInstruction('')}
              className="text-[11px] text-amber-700 underline font-normal"
            >
              Reset to Default
            </button>
          </div>
          <textarea
            rows={2}
            value={customSystemInstruction}
            onChange={e => setCustomSystemInstruction(e.target.value)}
            placeholder={`Default: You are SkillSetu Help tailored for ${currentRole} (${userName}). Provide evidence-based Industry Demand intelligence and actionable steps.`}
            className="w-full text-xs font-mono p-2 bg-white border border-amber-300 rounded text-slate-800"
          />
        </div>
      )}

      {/* Scrollable Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-500 font-mono">
                {isUser ? (
                  <>
                    <span>{msg.timestamp}</span>
                    <span className="font-semibold text-slate-700">You</span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-indigo-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-500" /> Gemini
                    </span>
                    {msg.modelUsed && (
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1 rounded">
                        {msg.modelUsed}
                      </span>
                    )}
                    <span>· {msg.timestamp}</span>
                  </>
                )}
              </div>

              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap shadow-xs relative ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                }`}
              >
                {msg.content}

                {!isUser && (
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="absolute bottom-2 right-2 p-1 text-slate-400 hover:text-slate-700 bg-white/80 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-500 font-mono">
              <span className="font-semibold text-indigo-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" /> Gemini ({modelChoice})
              </span>
              <span>· Thinking...</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs p-3.5 shadow-xs flex items-center gap-2 text-xs text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Analyzing market data &amp; formulating evidence-based guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="bg-white border-t border-slate-100 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-400 font-semibold uppercase text-[10px] shrink-0">Prompts:</span>
        {rolePromptMap[currentRole]?.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="shrink-0 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors text-left truncate max-w-[260px]"
            title={prompt}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="bg-white border-t border-slate-200 p-3">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            ref={inputRef}
            rows={2}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask Gemini about ${currentRole.toLowerCase()} skills, demands, or curricula (Enter to send, Shift+Enter for newline)...`}
            className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none"
          />

          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl shadow-xs transition-all shrink-0 flex items-center justify-center"
            title="Send Message"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
