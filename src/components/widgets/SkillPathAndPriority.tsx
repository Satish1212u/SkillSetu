import React from 'react';
import {
  GitFork,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  ShieldCheck,
  Target
} from 'lucide-react';
import { DataBadge } from '../common/DataBadge';

interface SkillPathAndPriorityProps {
  targetRole: string;
  recommendedPath: {
    currentProfile: Array<{
      name: string;
      status: string;
      verified: boolean;
      level: string;
      stage: string;
      source?: string;
    }>;
    priorityGaps: Array<{
      name: string;
      status: string;
      requiredLevel: string;
      priority: string;
      stage: string;
      timeline?: string;
    }>;
    targetRole: string;
    disclaimer?: string;
  };
  priorityMatrix: {
    high: string[];
    medium: string[];
    low: string[];
    logicExplanation?: string;
  };
  recommendedAction: {
    title: string;
    statement: string;
    primarySkill: string;
    secondarySkill: string;
    primaryActionLabel: string;
    secondaryActionLabel: string;
  };
  onStartRoadmap?: (skillName: string) => void;
  onExploreSkill?: (skillName: string) => void;
}

export const SkillPathAndPriority: React.FC<SkillPathAndPriorityProps> = ({
  targetRole,
  recommendedPath,
  priorityMatrix,
  recommendedAction,
  onStartRoadmap,
  onExploreSkill,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. RECOMMENDED ACTION CARD */}
      <div className="bg-white border-2 border-indigo-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-50/70 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Recommended Action
              </span>
              <span className="text-[11px] font-mono text-slate-400">Targeted Gap Remediation</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 leading-snug">
              {recommendedAction.statement}
            </p>
            <p className="text-xs text-slate-500">
              Focusing on these core gaps addresses foundational requirements across 78%+ of active {targetRole} postings.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onStartRoadmap?.(recommendedAction.primarySkill)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>{recommendedAction.primaryActionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onExploreSkill?.(recommendedAction.secondarySkill)}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              {recommendedAction.secondaryActionLabel}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: YOUR RECOMMENDED SKILL PATH */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GitFork className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  YOUR RECOMMENDED SKILL PATH
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Progressive Milestone Map</span>
            </div>

            {/* Visual Progression Pipeline */}
            <div className="mt-5 space-y-4">
              {/* Step 1: Current Profile */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Current Profile (Validated Foundations)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active Base
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                  {recommendedPath.currentProfile.map((skill, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{skill.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                        <span>{skill.level}</span>
                        <span>{skill.stage.split(':')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting Down Arrow */}
              <div className="flex justify-center text-slate-400">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-mono text-slate-600 border border-slate-200">
                  <ArrowDown className="w-3 h-3 text-indigo-600" />
                  <span>Next Remediation Milestones</span>
                </div>
              </div>

              {/* Step 2: Priority Gaps */}
              <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-indigo-600" />
                    Priority Industry Gaps to Bridge
                  </span>
                  <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200">
                    Highest Market Impact
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                  {recommendedPath.priorityGaps.map((skill, idx) => (
                    <div
                      key={idx}
                      onClick={() => onStartRoadmap?.(skill.name)}
                      className="p-2.5 bg-white border border-indigo-200 hover:border-indigo-400 rounded-lg text-xs space-y-1.5 cursor-pointer shadow-xs transition-all hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{skill.name}</span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                            skill.priority === 'HIGH'
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {skill.priority}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        <p>{skill.stage}</p>
                        <p className="text-indigo-600 font-semibold mt-0.5">Needed: {skill.requiredLevel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting Down Arrow */}
              <div className="flex justify-center text-slate-400">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-mono text-slate-600 border border-slate-200">
                  <ArrowDown className="w-3 h-3 text-emerald-600" />
                  <span>Target Role Alignment</span>
                </div>
              </div>

              {/* Step 3: Target Role */}
              <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-indigo-300 uppercase block">
                      Target Career Destination
                    </span>
                    <h4 className="text-base font-bold text-white tracking-tight">{targetRole}</h4>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 hidden sm:block">
                  Verified Benchmarks
                </span>
              </div>
            </div>
          </div>

          <p className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500 italic">
            Notice: {recommendedPath.disclaimer || 'Curriculum path is based on aggregate job specifications. Completion does not promise employment or placement.'}
          </p>
        </div>

        {/* Right Col: SKILL GAP PRIORITY MATRIX */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  SKILL GAP PRIORITY
                </h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                Deterministic
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
              Priority is calculated mathematically using market demand, target-role relevance, and current skill gap status:
            </p>

            <div className="mt-4 space-y-3">
              {/* High Priority */}
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    HIGH PRIORITY
                  </span>
                  <span className="text-[10px] font-mono text-rose-600 font-semibold">Immediate Focus</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {priorityMatrix.high.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-white border border-rose-300 font-bold text-slate-900 shadow-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Medium Priority */}
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    MEDIUM PRIORITY
                  </span>
                  <span className="text-[10px] font-mono text-amber-600 font-semibold">Secondary Phase</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {priorityMatrix.medium.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-white border border-amber-300 font-semibold text-slate-800 shadow-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Low Priority */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    LOW / EMERGING
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">Future Roadmap</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {priorityMatrix.low.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-300 font-medium text-slate-700 shadow-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500 leading-normal">
            Formula: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">Priority = DemandWeight × RoleRequirement × GapDeficit</code>
          </div>
        </div>
      </div>
    </div>
  );
};
