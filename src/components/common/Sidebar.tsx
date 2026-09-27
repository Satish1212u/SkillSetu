import React from 'react';
import { UserRole } from '../../types';
import { KaushalSetuLogo } from './KaushalSetuLogo';
import {
  LayoutDashboard,
  FileText,
  Target,
  Briefcase,
  GitFork,
  CheckCircle2,
  Compass,
  Bot,
  Layers,
  BarChart3,
  Lightbulb,
  MessageSquare,
  PlusCircle,
  Users,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Download,
} from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentTab,
  onTabChange,
}) => {
  const navItemsMap: Record<UserRole, { id: string; label: string; icon: any }[]> = {
    STUDENT: [
      { id: 'overview', label: 'Overview & Profile', icon: LayoutDashboard },
      { id: 'resume', label: 'Resume Intelligence', icon: FileText },
      { id: 'gaps', label: 'Skill Gap Analysis', icon: Target },
      { id: 'jobs', label: 'Job Matching', icon: Briefcase },
      { id: 'roadmap', label: 'Learning Roadmap', icon: GitFork },
      { id: 'assessment', label: 'Skill Assessments', icon: CheckCircle2 },
      { id: 'career-simulator', label: 'Career Simulator', icon: Compass },
      { id: 'copilot', label: 'AI Career Copilot', icon: Bot },
    ],
    INSTITUTE: [
      { id: 'overview', label: 'Institutional Overview', icon: LayoutDashboard },
      { id: 'curriculum', label: 'Curriculum Analyzer', icon: Layers },
      { id: 'alignment', label: 'Industry vs Curriculum', icon: BarChart3 },
      { id: 'recommendations', label: 'AI Curriculum Reforms', icon: Lightbulb },
      { id: 'feedback', label: 'Employer Feedback', icon: MessageSquare },
    ],
    EMPLOYER: [
      { id: 'overview', label: 'Hiring Overview', icon: LayoutDashboard },
      { id: 'builder', label: 'Job Requirement Builder', icon: PlusCircle },
      { id: 'candidates', label: 'Candidate Matching', icon: Users },
      { id: 'survey', label: 'Industry Demand Survey', icon: MessageSquare },
    ],
    ADMIN: [
      { id: 'overview', label: 'National Intel Overview', icon: LayoutDashboard },
      { id: 'market', label: 'Industry Skill Demand', icon: TrendingUp },
      { id: 'heatmap', label: 'Geographic Heatmap', icon: MapPin },
      { id: 'shortages', label: 'Skill Shortage Detection', icon: AlertTriangle },
      { id: 'ecosystem', label: 'Training Ecosystem', icon: Layers },
      { id: 'reports', label: 'Export Reports (CSV)', icon: Download },
    ],
  };

  const navItems = navItemsMap[currentRole] || [];

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 shrink-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto p-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider uppercase text-slate-500">
          {currentRole} WORKSPACE
        </div>
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = currentTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg text-left transition-colors ${isActive
                  ? 'bg-slate-900 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>

      {/* SkillSetu Platform Badge */}
      <div className="p-3 bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl border border-slate-800 text-white shadow-sm mt-6 space-y-2">
        <div className="flex items-center gap-2.5">
          <KaushalSetuLogo size="sm" variant="icon" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs tracking-tight text-white">SkillSetu</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Live
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">Skill Intelligence Bridge</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
