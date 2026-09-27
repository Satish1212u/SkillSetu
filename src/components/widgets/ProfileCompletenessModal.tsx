import React from 'react';
import { X, CheckCircle2, User, FileText, GraduationCap, Target, ArrowRight } from 'lucide-react';
import { DataBadge } from '../common/DataBadge';

interface ProfileCompletenessModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onGoToResume?: () => void;
  onEditSettings?: () => void;
}

export const ProfileCompletenessModal: React.FC<ProfileCompletenessModalProps> = ({
  isOpen,
  onClose,
  profile,
  onGoToResume,
  onEditSettings,
}) => {
  if (!isOpen || !profile) return null;

  const completeness = profile.profileCompleteness || {
    pct: 85,
    breakdown: { resume: true, education: true, skills: true, targetRole: true },
  };

  const checklist = [
    {
      title: 'Resume Document Analysed',
      desc: profile.resumeFileName || 'Resume uploaded and extracted by NLP hybrid parser',
      isComplete: completeness.breakdown.resume,
      icon: FileText,
      action: onGoToResume,
      actionText: 'View Resume Intelligence',
    },
    {
      title: 'Academic Education Credential',
      desc: profile.education || 'PICT Pune - B.Tech Computer Engineering (2022-2026)',
      isComplete: completeness.breakdown.education,
      icon: GraduationCap,
    },
    {
      title: 'Verified Skills Inventory (≥3 Skills)',
      desc: `${profile.verifiedSkillsCount || 4} verified skills, ${profile.unverifiedSkillsCount || 1} unverified skills`,
      isComplete: completeness.breakdown.skills,
      icon: User,
    },
    {
      title: 'Target Role Defined',
      desc: profile.targetRole || 'DevOps / Cloud Engineer',
      isComplete: completeness.breakdown.targetRole,
      icon: Target,
      action: onEditSettings,
      actionText: 'Change Target Role',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in-50 zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Candidate Profile Completeness
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                {completeness.pct}%
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Breakdown of identity, credentials, and curriculum metrics
            </p>
          </div>
        </div>

        {/* Completeness Bar */}
        <div className="mb-5">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${completeness.pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
            <span>Minimum Baseline: 50%</span>
            <span>Current: {completeness.pct}%</span>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-3 mb-5">
          {checklist.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.title}</span>
                      {item.isComplete ? (
                        <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Complete
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-amber-700">Pending</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>

                {item.action && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      item.action?.();
                    }}
                    className="shrink-0 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {item.actionText} →
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
