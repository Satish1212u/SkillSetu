import React from 'react';
import { X, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Database, BookOpen, Layers } from 'lucide-react';
import { DataBadge, DataStateType } from '../common/DataBadge';

export interface SkillDetailData {
  skillId: string;
  skillName: string;
  category: string;
  yourLevel: string;
  requiredLevel: string;
  marketDemand: string;
  status: 'Covered' | 'Gap';
  isCovered: boolean;
  isGap?: boolean;
  priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  dataTrustState: DataStateType;
  verified?: boolean;
  whyItMatters?: string;
  description?: string;
  averageSalaryBumpPct?: number;
  relatedRoles?: string[];
  recommendedLearning?: string[];
  evidence?: {
    analysedRecordsCount: number;
    skillFrequencyPct: number;
    dataSource: string;
    analysisPeriod: string;
  };
}

interface SkillDetailDrawerProps {
  skill: SkillDetailData | null;
  isOpen: boolean;
  onClose: () => void;
  onStartRoadmap?: (skillName: string) => void;
  onStartAssessment?: (skillId: string) => void;
}

export const SkillDetailDrawer: React.FC<SkillDetailDrawerProps> = ({
  skill,
  isOpen,
  onClose,
  onStartRoadmap,
  onStartAssessment,
}) => {
  if (!isOpen || !skill) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col z-10 overflow-y-auto border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                {skill.category}
              </span>
              {skill.isCovered ? (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Covered
                </span>
              ) : (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Skill Gap
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold mt-2 tracking-tight">{skill.skillName}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 space-y-6 flex-1 text-slate-800">
          {/* Status Matrix */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div>
              <p className="text-[11px] font-mono text-slate-500 uppercase">Your Level</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`font-bold ${
                    skill.yourLevel === 'Not detected' ? 'text-rose-600' : 'text-slate-900'
                  }`}
                >
                  {skill.yourLevel}
                </span>
                {skill.yourLevel !== 'Not detected' && (
                  <DataBadge type={skill.dataTrustState} size="sm" />
                )}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-mono text-slate-500 uppercase">Required Level</p>
              <p className="font-bold text-slate-900 mt-1">{skill.requiredLevel}</p>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <p className="text-[11px] font-mono text-slate-500 uppercase">Market Demand</p>
              <p className="font-bold text-slate-900 mt-1">{skill.marketDemand}</p>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <p className="text-[11px] font-mono text-slate-500 uppercase">Priority Rating</p>
              <p
                className={`font-bold mt-1 ${
                  skill.priority === 'HIGH' || skill.priority === 'CRITICAL'
                    ? 'text-rose-600'
                    : skill.priority === 'MEDIUM'
                    ? 'text-amber-600'
                    : 'text-slate-700'
                }`}
              >
                {skill.priority || 'NORMAL'}
              </p>
            </div>
          </div>

          {/* Description */}
          {skill.description && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                Skill Definition
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 border border-slate-200 rounded-lg">
                {skill.description}
              </p>
            </div>
          )}

          {/* Why This Matters */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Why This Gap Matters
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-indigo-50/60 p-3.5 border border-indigo-100 rounded-lg">
              {skill.whyItMatters ||
                `${skill.skillName} is frequently associated with DevOps and Cloud infrastructure roles in the analysed dataset. It represents an essential industry competency for production deployment.`}
            </p>
          </div>

          {/* Market Evidence Box */}
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Market Evidence Telemetry
                </h4>
              </div>
              <DataBadge type="DEMO DATA" size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-800 rounded">
                <span className="text-[10px] text-slate-400 block font-mono">Dataset Frequency</span>
                <span className="font-bold text-white text-sm">
                  {skill.evidence?.skillFrequencyPct || 78}% of roles
                </span>
              </div>
              <div className="p-2 bg-slate-800 rounded">
                <span className="text-[10px] text-slate-400 block font-mono">Analysed Records</span>
                <span className="font-bold text-white text-sm">
                  {(skill.evidence?.analysedRecordsCount || 184500).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 space-y-1 pt-1">
              <p>
                <span className="text-slate-300 font-medium">Source:</span>{' '}
                {skill.evidence?.dataSource || 'Demo Dataset - SIH Sample'}
              </p>
              <p>
                <span className="text-slate-300 font-medium">Analysis Period:</span>{' '}
                {skill.evidence?.analysisPeriod || 'Q1 2026'}
              </p>
              <p className="text-[10px] text-slate-500 italic mt-1">
                Notice: Data is provided for illustrative alignment benchmark during hackathon evaluation.
              </p>
            </div>
          </div>

          {/* Related Roles */}
          {skill.relatedRoles && skill.relatedRoles.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Associated Benchmark Roles
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skill.relatedRoles.map((r, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-md font-medium"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Learning Path */}
          {skill.recommendedLearning && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Recommended Remediation
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {skill.recommendedLearning.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Drawer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
          {skill.isGap ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartRoadmap?.(skill.skillName);
              }}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Start {skill.skillName} Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartAssessment?.(skill.skillId);
              }}
              className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verify Assessment Level</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-slate-300 hover:bg-white text-slate-700 text-xs font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
