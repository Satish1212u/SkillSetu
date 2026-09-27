import React from 'react';
import { UserRole } from '../../types';
import { KaushalSetuLogo } from './KaushalSetuLogo';
import { Sparkles, ShieldCheck, Activity, Award } from 'lucide-react';

interface DashboardHeaderBannerProps {
  role: UserRole;
  title: string;
  subtitle: string;
  badgeText?: string;
  activeMetric?: {
    label: string;
    value: string;
  };
}

export const DashboardHeaderBanner: React.FC<DashboardHeaderBannerProps> = ({
  role,
  title,
  subtitle,
  badgeText,
  activeMetric,
}) => {
  const roleColorMap: Record<UserRole, { badge: string; accent: string; label: string }> = {
    STUDENT: {
      badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
      accent: 'from-emerald-500/5',
      label: 'Student Portal',
    },
    INSTITUTE: {
      badge: 'bg-blue-500/10 text-blue-700 border-blue-200',
      accent: 'from-blue-500/5',
      label: 'Academic Institute',
    },
    EMPLOYER: {
      badge: 'bg-amber-500/10 text-amber-700 border-amber-200',
      accent: 'from-amber-500/5',
      label: 'Employer Workspace',
    },
    ADMIN: {
      badge: 'bg-purple-500/10 text-purple-700 border-purple-200',
      accent: 'from-purple-500/5',
      label: 'National Policy Intel',
    },
  };

  const theme = roleColorMap[role] || roleColorMap.STUDENT;

  return (
    <div className="relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-xs">
      {/* Background soft subtle radial accent */}
      <div className={`absolute top-0 right-0 w-96 h-full bg-gradient-to-l ${theme.accent} to-transparent pointer-events-none opacity-60`} />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Aligned SkillSetu Logo + Title Lockup */}
        <div className="flex items-center gap-4">
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-sm shrink-0">
            <KaushalSetuLogo size="md" variant="icon" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                Skill<span className="text-indigo-600">Setu</span>
              </span>
              <span className="text-slate-300">/</span>
              <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                {title}
              </h1>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${theme.badge}`}>
                {badgeText || theme.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: current dataset Telemetry Pill & Quick Metric */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          {activeMetric && (
            <div className="hidden lg:flex flex-col text-right px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
                {activeMetric.label}
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {activeMetric.value}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-tight text-slate-200 text-[11px] font-mono">
              Live Skill Telemetry
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
