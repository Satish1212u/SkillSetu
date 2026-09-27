import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { StudentProfile } from '../../types';
import { DataBadge } from '../common/DataBadge';
import {
  Sparkles,
  ArrowRight,
  Send,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Target,
  Briefcase,
  Play,
  Lightbulb,
  Award,
  Terminal,
  MessageSquare,
  Flame,
  Cpu,
  Compass,
  FileCheck
} from 'lucide-react';

interface CareerSimulatorProps {
  profile: StudentProfile | null;
  dashboardData: any;
  onNavigateToRoadmap?: () => void;
  onNavigateToAssessments?: () => void;
}

export const CareerSimulator: React.FC<CareerSimulatorProps> = ({
  profile,
  dashboardData,
  onNavigateToRoadmap,
  onNavigateToAssessments,
}) => {
  // Simulator lifecycle states: 'landing' | 'preview' | 'active' | 'evaluation'
  const [viewState, setViewState] = useState<'landing' | 'preview' | 'active' | 'evaluation'>('landing');

  // Input on landing
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'incident' | 'interview' | 'workplace' | 'problem_solving'>('incident');
  const [generatingScenario, setGeneratingScenario] = useState(false);

  // Active scenario & session
  const [scenario, setScenario] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Conversation state
  const [messages, setMessages] = useState<{ role: 'assistant' | 'user'; text: string; time: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [turnLoading, setTurnLoading] = useState(false);
  const [activeHint, setActiveHint] = useState<string | null>(null);

  // Timer & voice options
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [speechSynthesisEnabled, setSpeechSynthesisEnabled] = useState(true);

  // Evaluation result
  const [evaluation, setEvaluation] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Derived telemetry metrics
  const targetRole = profile?.targetRole || 'DevOps / Cloud Engineer';
  const marketMatchPct = dashboardData?.targetRoleMatch?.matchPct || 48;
  const criticalGaps = dashboardData?.criticalSkillGaps?.items?.map((i: any) => i.skillName) || ['Docker', 'AWS', 'Kubernetes'];

  // Scroll to bottom on message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, turnLoading]);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && viewState === 'active') {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, viewState]);

  // Voice speech synthesis helper
  const speakText = (text: string) => {
    if (!speechSynthesisEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  };

  // Toggle voice recognition
  const toggleVoiceMode = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use text input.');
      return;
    }

    if (isVoiceActive) {
      recognitionRef.current?.stop();
      setIsVoiceActive(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
          setIsVoiceActive(false);
        };

        recognition.onerror = () => {
          setIsVoiceActive(false);
        };

        recognition.onend = () => {
          setIsVoiceActive(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsVoiceActive(true);
      } catch (err) {
        console.warn('SpeechRecognition start error:', err);
        setIsVoiceActive(false);
      }
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Quick scenario presets
  const quickSuggestions = [
    {
      label: 'Handle a Production Incident',
      prompt: 'I want to practice handling a failed production container deployment where checkout API is returning 502.',
      category: 'incident' as const,
    },
    {
      label: 'Explain Docker to Your Manager',
      prompt: 'I want to practice presenting a proposal to migrate legacy VMs to Docker containers to my non-technical engineering manager.',
      category: 'workplace' as const,
    },
    {
      label: 'AWS Deployment Interview',
      prompt: 'I want to practice a senior technical interview on AWS VPC, EC2, IAM policies, and cloud infrastructure setup.',
      category: 'interview' as const,
    },
    {
      label: 'Technical Interview',
      prompt: 'Practice a technical interview on container orchestration, Docker multi-stage builds, and CI/CD pipelines.',
      category: 'interview' as const,
    },
    {
      label: 'Negotiate a Project Deadline',
      prompt: 'Negotiate an extra week for cloud migration due to unexpected database schema compatibility issues.',
      category: 'workplace' as const,
    },
    {
      label: 'Handle a Difficult Team Member',
      prompt: 'Practice resolving a disagreement with a peer who bypassed code review to push hotfixes directly to main.',
      category: 'workplace' as const,
    },
  ];

  // Category cards configuration
  const categoryCards = [
    {
      id: 'incident' as const,
      icon: Flame,
      title: '🚨 Technical Incident',
      badge: 'Production Failure',
      shortDesc: 'Production outages, container crash-loops, cloud rollbacks, and high-pressure incident mitigation.',
      targetSkill: 'Docker & Incident Response',
      difficulty: 'Intermediate',
      color: 'border-rose-200 bg-rose-50/30 hover:border-rose-300',
    },
    {
      id: 'interview' as const,
      icon: Briefcase,
      title: '🎤 Technical Interview',
      badge: 'Architecture & HR',
      shortDesc: 'System architecture, containerization principles, AWS cloud infrastructure, and technical design trade-offs.',
      targetSkill: 'Docker & AWS Systems',
      difficulty: 'Intermediate',
      color: 'border-indigo-200 bg-indigo-50/30 hover:border-indigo-300',
    },
    {
      id: 'workplace' as const,
      icon: MessageSquare,
      title: '💼 Workplace Scenarios',
      badge: 'Manager Round',
      shortDesc: 'Explaining architectural choices, defending sprint trade-offs, cross-functional engineering alignment.',
      targetSkill: 'Stakeholder Communication',
      difficulty: 'Intermediate',
      color: 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-300',
    },
    {
      id: 'problem_solving' as const,
      icon: Cpu,
      title: '🧠 Problem Solving',
      badge: 'Deep Debugging',
      shortDesc: 'Latency bottleneck isolation, memory leak diagnosis, and distributed systems root cause analysis.',
      targetSkill: 'SRE & Distributed Systems',
      difficulty: 'Advanced',
      color: 'border-purple-200 bg-purple-50/30 hover:border-purple-300',
    },
  ];

  // Start generation handler
  const handleStartSimulation = async (presetPrompt?: string, presetCategory?: any) => {
    const promptToUse = presetPrompt || customPrompt || 'Handle a production incident';
    const catToUse = presetCategory || selectedCategory;

    try {
      setGeneratingScenario(true);
      const res = await api.createSimulation({
        promptRequest: promptToUse,
        category: catToUse,
        targetRole,
        skillGaps: criticalGaps,
      });

      if (res && res.scenario) {
        setScenario(res.scenario);
        setSessionId(res.sessionId || null);
        setViewState('preview');
      }
    } catch (err: any) {
      console.error('Scenario generation error:', err);
    } finally {
      setGeneratingScenario(false);
    }
  };

  // Enter active simulation
  const handleEnterSimulation = () => {
    if (!scenario) return;
    setMessages([
      {
        role: 'assistant',
        text: scenario.initialMessage,
        time: 'Just now',
      },
    ]);
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    setViewState('active');
    speakText(scenario.initialMessage);
  };

  // Send turn
  const handleSendTurn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || turnLoading) return;

    const userText = inputText.trim();
    setInputText('');
    setActiveHint(null);

    const updatedMessages = [
      ...messages,
      { role: 'user' as const, text: userText, time: 'Just now' },
    ];
    setMessages(updatedMessages);

    try {
      setTurnLoading(true);
      const res = await api.respondToSimulation({
        sessionId: sessionId || undefined,
        scenario,
        history: updatedMessages,
        userMessage: userText,
      });

      if (res && res.reply) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', text: res.reply, time: 'Just now' },
        ]);
        if (res.hint) {
          setActiveHint(res.hint);
        }
        speakText(res.reply);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Technical connection glitch. In this scenario, verify the container logs and memory limit.',
          time: 'Just now',
        },
      ]);
    } finally {
      setTurnLoading(false);
    }
  };

  // Finish and evaluate simulation
  const handleFinishAndEvaluate = async () => {
    setIsTimerRunning(false);
    setEvaluating(true);
    setViewState('evaluation');

    try {
      const res = await api.evaluateSimulation({
        sessionId: sessionId || undefined,
        scenario,
        transcript: messages.map(m => ({ role: m.role, text: m.text })),
      });

      if (res && res.evaluation) {
        setEvaluation(res.evaluation);
      }
    } catch (err: any) {
      console.error('Evaluation error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  // Reset to landing
  const handleReset = () => {
    setViewState('landing');
    setScenario(null);
    setSessionId(null);
    setMessages([]);
    setInputText('');
    setEvaluation(null);
    setElapsedSeconds(0);
    setIsTimerRunning(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. LANDING PAGE VIEW */}
      {viewState === 'landing' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-indigo-600/30 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                  AI CAREER SIMULATOR
                </span>
                <span className="text-[11px] font-mono text-slate-400">SIH26134 Platform Module</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                AI CAREER SIMULATOR
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed">
                Practice the real conversations, decisions, and challenges you'll face in your target career.
                Simulations are mathematically generated from your verified skills, market gaps, and employer benchmarks.
              </p>

              {/* Student Context Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
                <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
                  <span className="text-slate-400">Target Role:</span>
                  <span className="font-bold text-white">{targetRole}</span>
                </div>

                <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
                  <span className="text-slate-400">Market Alignment:</span>
                  <span className="font-bold text-indigo-400">{marketMatchPct}%</span>
                </div>

                <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
                  <span className="text-slate-400">Priority Skill Gaps:</span>
                  <span className="font-bold text-rose-300">{criticalGaps.slice(0, 3).join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Central Input Box */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">
                What do you want to practice?
              </label>
              <p className="text-xs text-slate-500">
                Describe any workplace situation, incident, technical interview round, or managerial conversation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleStartSimulation();
                }}
                placeholder="I want to practice handling a failed production deployment..."
                className="flex-1 text-sm p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 transition-all font-sans"
              />

              <button
                type="button"
                disabled={generatingScenario}
                onClick={() => handleStartSimulation()}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-colors shrink-0"
              >
                {generatingScenario ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Generating Scenario...</span>
                  </>
                ) : (
                  <>
                    <span>Start Simulation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Recommended Quick Suggestions */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                RECOMMENDED FOR YOU (Based on {targetRole} &amp; Skill Gaps)
              </span>
              <span className="text-[11px] font-mono text-slate-400">Personalized Practice</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {quickSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleStartSimulation(item.prompt, item.category)}
                  className="p-3 text-left rounded-lg bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 text-xs text-slate-800 transition-all font-medium flex items-center justify-between group"
                >
                  <span className="font-semibold group-hover:text-indigo-900 line-clamp-1">{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Categories */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                SCENARIO CATEGORIES
              </h2>
              <span className="text-[11px] font-mono text-slate-400">4 Core Career Domains</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryCards.map(cat => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      handleStartSimulation(undefined, cat.id);
                    }}
                    className={`p-5 rounded-xl border ${cat.color} transition-all cursor-pointer shadow-xs hover:shadow-sm flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-900 border border-slate-200">
                          <Icon className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-semibold">
                          {cat.difficulty}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 mt-3">{cat.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{cat.shortDesc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-slate-500">Skill: {cat.targetSkill}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. SCENARIO PREVIEW / CONFIRMATION MODAL/SCREEN */}
      {viewState === 'preview' && scenario && (
        <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 sm:p-8 shadow-md max-w-2xl mx-auto space-y-6 animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-mono text-xs font-bold border border-indigo-200">
                {scenario.categoryLabel || 'AI-GENERATED SCENARIO'}
              </span>
              <DataBadge type="REAL" label="Telemetry Grounded" />
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-700 underline"
            >
              Choose Another
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 block">
              TARGET ROLE: {scenario.targetRole} · EVALUATED GAP: {scenario.evaluatedSkill}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {scenario.title}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {scenario.description}
            </p>
          </div>

          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Difficulty</span>
              <span className="font-bold text-slate-900">{scenario.difficulty}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Persona</span>
              <span className="font-bold text-indigo-700">{scenario.personaName}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Role</span>
              <span className="font-bold text-slate-900 line-clamp-1">{scenario.personaRole}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Expected Turns</span>
              <span className="font-bold text-slate-900">3 - 5 Turns</span>
            </div>
          </div>

          {/* Skills Tested */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
              Skills Being Tested:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {scenario.skillsTested?.map((s: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Objectives */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
              Simulation Objectives:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {scenario.objectives?.map((obj: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleEnterSimulation}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Enter Simulation</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. ACTIVE SIMULATION INTERFACE */}
      {viewState === 'active' && scenario && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Scenario Information & Controls */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE SIMULATION
                </span>

                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{formatTimer(elapsedSeconds)}</span>
                </div>
              </div>

              {/* Scenario Overview */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Target Role</span>
                <p className="text-xs font-bold text-slate-900">{scenario.targetRole}</p>

                <span className="text-[10px] font-mono text-slate-400 uppercase block mt-2">Scenario</span>
                <p className="text-xs font-bold text-indigo-700">{scenario.title}</p>
              </div>

              {/* Persona Profile */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Interviewer / Manager Persona</span>
                <p className="font-bold text-slate-900">{scenario.personaName}</p>
                <p className="text-[11px] text-slate-500">{scenario.personaRole}</p>
              </div>

              {/* Skill Being Evaluated */}
              <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 text-xs">
                <span className="text-[10px] font-mono text-indigo-600 uppercase block font-semibold">Primary Skill Evaluated</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-bold text-indigo-900">{scenario.evaluatedSkill}</span>
                  <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded text-indigo-700 border border-indigo-200">
                    {scenario.difficulty}
                  </span>
                </div>
              </div>

              {/* Objectives Checklist */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                  Candidate Objectives:
                </span>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  {scenario.objectives?.map((obj: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold">·</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Active Mentor Hint if available */}
              {activeHint && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>AI Career Mentor Hint</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{activeHint}</p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={handleFinishAndEvaluate}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Finish &amp; Evaluate Simulation</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Exit Simulation
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Conversational Stream */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col h-[600px] justify-between">
            {/* Persona Bar */}
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  {scenario.personaName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{scenario.personaName}</h4>
                  <p className="text-[10px] text-slate-500">{scenario.personaRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSpeechSynthesisEnabled(prev => !prev)}
                  title={speechSynthesisEnabled ? 'Mute AI Persona Voice' : 'Unmute AI Persona Voice'}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  {speechSynthesisEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-rose-500" />}
                </button>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                  Turn {messages.filter(m => m.role === 'user').length + 1}
                </span>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-slate-50/60 rounded-xl my-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">
                      {m.role === 'user' ? (profile?.userId || 'Candidate') : scenario.personaName}
                    </span>
                    <span className="text-[9px] text-slate-400">{m.time}</span>
                  </div>

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-slate-900 text-white rounded-br-xs'
                        : 'bg-white border border-slate-200 text-slate-900 shadow-xs rounded-bl-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {turnLoading && (
                <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 max-w-[60%] text-xs text-slate-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-700" />
                  <span>{scenario.personaName} is evaluating your response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendTurn} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Explain your approach, diagnosis, or plan..."
                  className="flex-1 text-xs p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900"
                />

                {/* Voice button */}
                <button
                  type="button"
                  onClick={toggleVoiceMode}
                  title="Voice input"
                  className={`p-3 rounded-xl border transition-colors ${
                    isVoiceActive
                      ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Send button */}
                <button
                  type="submit"
                  disabled={turnLoading || !inputText.trim()}
                  className="px-4 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>Respond naturally as you would in a workplace or live interview.</span>
                <span>Press Enter to send</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. AI EVALUATION & SKILL REPORT VIEW */}
      {viewState === 'evaluation' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
          {evaluating ? (
            <div className="p-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-slate-900 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Evaluating Simulation Transcript</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                SkillSetu AI Evaluator is scoring technical accuracy, problem solving, communication, and composing personalized skill insights.
              </p>
            </div>
          ) : evaluation ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wide text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-bold">
                    SIMULATION EVALUATION REPORT
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    {scenario?.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Evaluated Skill: <strong>{scenario?.evaluatedSkill}</strong> · Target Role: <strong>{scenario?.targetRole}</strong>
                  </p>
                </div>

                {/* Overall Score Circle */}
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Performance Score</span>
                  <span className="text-3xl font-extrabold font-mono text-indigo-600">
                    {evaluation.overallScore}/100
                  </span>
                </div>
              </div>

              {/* Verdict Banner */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1">
                <span className="text-[10px] font-mono uppercase text-indigo-300">Workplace Competency Verdict</span>
                <p className="text-sm font-semibold">{evaluation.verdict}</p>
              </div>

              {/* Rubric Breakdown Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Rubric Assessment Breakdown
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Technical Accuracy</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      {evaluation.rubricScores?.technicalAccuracy}%
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Problem Solving</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      {evaluation.rubricScores?.problemSolving}%
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Communication</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      {evaluation.rubricScores?.communication}%
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Composure</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      {evaluation.rubricScores?.composureUnderPressure}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wide">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Key Strengths Identified
                  </span>
                  <ul className="space-y-1.5 text-emerald-950">
                    {evaluation.strengths?.map((s: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wide">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Areas for Technical Growth
                  </span>
                  <ul className="space-y-1.5 text-amber-950">
                    {evaluation.areasForImprovement?.map((a: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">!</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* New Skill Insights */}
              <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-200 text-xs space-y-2">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5 uppercase text-[11px] tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  New Skill Insights (Applied Telemetry)
                </span>
                <ul className="space-y-1 text-slate-700">
                  {evaluation.skillInsights?.map((insight: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-600">·</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Next Step & CTA */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Actionable Next Step</span>
                  <p className="font-semibold text-slate-900">{evaluation.recommendedAction}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onNavigateToRoadmap && (
                    <button
                      type="button"
                      onClick={onNavigateToRoadmap}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>Update Learning Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-medium shadow-xs transition-colors"
                  >
                    Try Another Scenario
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
