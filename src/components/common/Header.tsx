import React from 'react';
import { UserRole } from '../../types';
import { ShieldCheck, UserCheck, Building2, Briefcase, Sparkles } from 'lucide-react';
import { KaushalSetuLogo } from './KaushalSetuLogo';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  userName: string;
  organizationName?: string;
  onOpenChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  userName,
  organizationName,
  onOpenChat,
}) => {
  const roles: { role: UserRole; label: string; icon: any; desc: string }[] = [
    { role: 'STUDENT', label: 'Student', icon: UserCheck, desc: 'Candidate & Skills' },
    { role: 'INSTITUTE', label: 'Institute', icon: Building2, desc: 'Curriculum & Courses' },
    { role: 'EMPLOYER', label: 'Employer', icon: Briefcase, desc: 'Hiring & Demand' },
    { role: 'ADMIN', label: 'Govt Admin', icon: ShieldCheck, desc: 'Macro Labour Intel' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity with KaushalSetu Logo */}
          <div className="flex items-center">
            <KaushalSetuLogo size="md" variant="horizontal" />
          </div>

          {/* Quick Role Segmented Switcher for Hackathon Judges */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
            {roles.map(({ role, label, icon: Icon }) => {
              const isActive = currentRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => onRoleChange(role)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${isActive
                      ? 'bg-white text-slate-950 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-950'
                    }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* SkillSetu Help Quick Launch & Active User Details */}
          <div className="flex items-center gap-3">
            {onOpenChat && (
              <button
                type="button"
                onClick={onOpenChat}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors"
                title="Open SkillSetu Help"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">SkillSetu Help</span>
              </button>
            )}

            <div className="hidden lg:flex items-center gap-3 text-right">
              <div>
                <p className="text-xs font-semibold text-slate-800">{userName}</p>
                <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                  {organizationName || `${currentRole.toLowerCase()} portal`}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
