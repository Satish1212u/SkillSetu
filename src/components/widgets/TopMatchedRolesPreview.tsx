import React from 'react';
import { Briefcase, MapPin, ArrowRight, CheckCircle2, AlertTriangle, Building, Layers } from 'lucide-react';
import { DataBadge } from '../common/DataBadge';

export interface TopMatchedRoleItem {
  jobId: string;
  title: string;
  employerName: string;
  matchPct: number;
  location: string;
  experienceMinYears: number;
  salaryMinLPA?: number;
  salaryMaxLPA?: number;
  dataSource?: string;
  matchedSkills: string[];
  missingSkills: string[];
  matchedCount?: number;
  totalRequired?: number;
}

interface TopMatchedRolesPreviewProps {
  roles: TopMatchedRoleItem[];
  onViewAllJobs: () => void;
  onSelectJob?: (jobId: string) => void;
}

export const TopMatchedRolesPreview: React.FC<TopMatchedRolesPreviewProps> = ({
  roles,
  onViewAllJobs,
  onSelectJob,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              TOP MATCHED ROLES
            </h3>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              Algorithmic Alignment
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Role alignment calculated against current job specifications. Shows matched vs missing requirements.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAllJobs}
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span>View All Job Matches</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {roles.map(role => (
          <div
            key={role.jobId}
            onClick={() => onSelectJob?.(role.jobId) || onViewAllJobs()}
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm bg-slate-50/50 hover:bg-white transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Header: Company & Match % */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" />
                    {role.employerName}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5 tracking-tight line-clamp-1">
                    {role.title}
                  </h4>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-sm font-extrabold font-mono px-2 py-0.5 rounded-md ${
                      role.matchPct >= 55
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {role.matchPct}% Match
                  </span>
                </div>
              </div>

              {/* Meta: Location, Experience, Salary */}
              <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {role.location}
                </span>
                <span>·</span>
                <span>{role.experienceMinYears === 0 ? 'Fresher (0 yrs)' : `${role.experienceMinYears}+ yrs exp`}</span>
                {role.salaryMinLPA && (
                  <>
                    <span>·</span>
                    <span className="text-slate-700 font-medium">
                      ₹{role.salaryMinLPA} - {role.salaryMaxLPA} LPA
                    </span>
                  </>
                )}
              </div>

              {/* Skills breakdown */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 space-y-2 text-xs">
                {/* Matched */}
                <div>
                  <span className="text-[10px] uppercase font-mono text-emerald-700 font-semibold block mb-1">
                    Matching Skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {role.matchedSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-medium"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                {role.missingSkills.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-mono text-rose-700 font-semibold block mb-1">
                      Missing Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {role.missingSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1 font-medium"
                        >
                          <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-400">
              <span>{role.dataSource || 'Benchmark Role'}</span>
              <span className="text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                View Requirements <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Notice: Matching scores represent algorithmic profile alignment, not job offers.</span>
        <button
          type="button"
          onClick={onViewAllJobs}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          Explore All Job Openings
        </button>
      </div>
    </div>
  );
};
