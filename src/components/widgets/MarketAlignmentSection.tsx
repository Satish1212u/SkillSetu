import React, { useState } from 'react';
import { DataBadge } from '../common/DataBadge';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Database,
  ArrowRight,
  TrendingUp,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { SkillDetailData } from './SkillDetailDrawer';

interface MarketAlignmentItem {
  skillId: string;
  skillName: string;
  category: string;
  yourLevel: string;
  requiredLevel: string;
  marketDemand: string;
  status: 'Covered' | 'Gap';
  isCovered: boolean;
  priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  dataTrustState: any;
  verified: boolean;
  source: string;
  frequencyInTargetJobsPct?: number;
  description?: string;
  averageSalaryBumpPct?: number;
}

interface MarketAlignmentSectionProps {
  items: MarketAlignmentItem[];
  targetRole: string;
  onSelectSkill: (skill: SkillDetailData) => void;
  onStartRoadmap?: (skillName: string) => void;
}

export const MarketAlignmentSection: React.FC<MarketAlignmentSectionProps> = ({
  items,
  targetRole,
  onSelectSkill,
  onStartRoadmap,
}) => {
  // Active gap selected for the "Why This Gap Matters" card
  const gaps = items.filter(i => !i.isCovered);
  const [selectedGapSkillId, setSelectedGapSkillId] = useState<string>('sk-docker');
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  const activeGapItem =
    items.find(i => i.skillId === selectedGapSkillId) ||
    gaps[0] ||
    items[0];

  const handleOpenEvidence = () => {
    setIsEvidenceModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Market Alignment Comparison Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
                    MARKET ALIGNMENT
                  </h2>
                  <DataBadge type="DEMO DATA" label="BENCHMARK DATA" size="sm" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  How your current skills compare with skills currently required for your target role: <strong className="text-slate-800">{targetRole}</strong>.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Click any row to inspect</span>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/70">
                    <th className="py-2.5 px-3">Skill</th>
                    <th className="py-2.5 px-3">Your Level</th>
                    <th className="py-2.5 px-3">Market Demand</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Data State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {items.map(item => {
                    const isSelectedInWhyPanel = item.skillId === activeGapItem.skillId;
                    return (
                      <tr
                        key={item.skillId}
                        onClick={() => {
                          if (!item.isCovered) {
                            setSelectedGapSkillId(item.skillId);
                          }
                          onSelectSkill({
                            ...item,
                            whyItMatters: !item.isCovered
                              ? `${item.skillName} is frequently associated with ${targetRole} in the analysed job dataset.`
                              : `${item.skillName} is verified in your profile and satisfies the ${item.requiredLevel} threshold.`,
                          });
                        }}
                        className={`hover:bg-indigo-50/40 cursor-pointer transition-colors ${
                          isSelectedInWhyPanel ? 'bg-indigo-50/20' : ''
                        }`}
                      >
                        {/* SKILL */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{item.skillName}</span>
                            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                              ({item.category})
                            </span>
                          </div>
                        </td>

                        {/* YOUR LEVEL */}
                        <td className="py-3 px-3">
                          <span
                            className={`font-medium ${
                              item.yourLevel === 'Not detected'
                                ? 'text-rose-600 font-semibold'
                                : 'text-slate-800'
                            }`}
                          >
                            {item.yourLevel}
                          </span>
                        </td>

                        {/* MARKET DEMAND */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold ${
                                item.marketDemand === 'High'
                                  ? 'text-indigo-600'
                                  : item.marketDemand === 'Medium'
                                  ? 'text-slate-700'
                                  : 'text-slate-500'
                              }`}
                            >
                              {item.marketDemand}
                            </span>
                            {/* Visual Demand indicator */}
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className={`h-full rounded-full ${
                                  item.marketDemand === 'High'
                                    ? 'w-full bg-indigo-600'
                                    : item.marketDemand === 'Medium'
                                    ? 'w-2/3 bg-slate-400'
                                    : 'w-1/3 bg-slate-300'
                                }`}
                              />
                            </div>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="py-3 px-3">
                          {item.isCovered ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Covered
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                item.priority === 'HIGH'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Gap
                            </span>
                          )}
                        </td>

                        {/* DATA STATE */}
                        <td className="py-3 px-3 text-right">
                          <DataBadge
                            type={item.dataTrustState}
                            label={item.dataTrustState === 'NOT_DETECTED' ? 'GAP' : undefined}
                            size="sm"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Covered:{' '}
              <strong className="text-slate-800">
                {items.filter(i => i.isCovered).length}
              </strong>{' '}
              · Gaps:{' '}
              <strong className="text-rose-600">
                {items.filter(i => !i.isCovered).length}
              </strong>
            </span>
            <span className="font-mono text-[10px]">Deterministic Matching Engine v2.1</span>
          </div>
        </div>

        {/* Right Col: WHY THIS GAP MATTERS */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  WHY THIS GAP MATTERS
                </h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Telemetry
              </span>
            </div>

            {/* Gap Selector Pills */}
            <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1">
              <span className="text-[10px] text-slate-400 font-mono">Gaps:</span>
              {gaps.map(g => (
                <button
                  key={g.skillId}
                  onClick={() => setSelectedGapSkillId(g.skillId)}
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                    selectedGapSkillId === g.skillId
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {g.skillName}
                </button>
              ))}
            </div>

            {/* Gap Details Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500">Selected Skill</span>
                  <h4 className="text-base font-bold text-slate-900">{activeGapItem.skillName}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-500">Market Demand</span>
                  <p className="text-xs font-bold text-indigo-600 uppercase">{activeGapItem.marketDemand}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                <span className="text-slate-500">Your Profile:</span>
                <span className="font-semibold text-rose-600">{activeGapItem.yourLevel}</span>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  Correlation &amp; Rationale:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  "{activeGapItem.skillName} is frequently associated with the selected{' '}
                  <span className="font-semibold text-slate-900">{targetRole}</span> role in the
                  analysed job dataset."
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={handleOpenEvidence}
                className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>View Market Evidence</span>
              </button>

              {onStartRoadmap && !activeGapItem.isCovered && (
                <button
                  type="button"
                  onClick={() => onStartRoadmap(activeGapItem.skillName)}
                  className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Remediate via Learning Roadmap</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Aggregated from benchmark postings</span>
            <DataBadge type="DEMO DATA" size="sm" />
          </div>
        </div>
      </div>

      {/* Market Evidence Modal */}
      {isEvidenceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in-50 zoom-in-95 duration-150">
            <button
              onClick={() => setIsEvidenceModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Market Evidence Telemetry: {activeGapItem.skillName}
                  </h3>
                  <DataBadge type="DEMO DATA" label="Demo Dataset" size="sm" />
                </div>
                <p className="text-xs text-slate-500">Benchmark Industry Demand Evidence</p>
              </div>
            </div>

            {/* Evidence Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  Analysed Records
                </span>
                <span className="text-lg font-bold text-slate-900">184,500</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">National Vacancies</span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  Skill Frequency
                </span>
                <span className="text-lg font-bold text-indigo-600">
                  {activeGapItem.frequencyInTargetJobsPct || 78}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Of Target Role Postings</span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  Data Source
                </span>
                <span className="font-bold text-slate-900">Demo Dataset</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">SIH Sample Benchmark</span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  Analysis Period
                </span>
                <span className="font-bold text-slate-900">Q1 2026</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Rolling Quarterly Audit</span>
              </div>
            </div>

            {/* Relevant Job Roles */}
            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Relevant Job Roles Requiring {activeGapItem.skillName}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Associate DevOps Engineer',
                  'Cloud Systems Engineer',
                  'Site Reliability Engineer (SRE)',
                  'Junior Cloud Operations Engineer',
                  'Platform Infrastructure Associate'
                ].map((role, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Mandatory Demo Data Notice */}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div className="space-y-0.5 text-[11px] leading-relaxed">
                <p className="font-bold">Transparency Disclosure</p>
                <p>
                  This view utilizes sample benchmark corpus data labelled as{' '}
                  <strong>"Demo Dataset"</strong>. Never present sample data as real live market statistics.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEvidenceModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Close Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
