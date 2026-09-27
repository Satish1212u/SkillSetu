import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StudentProfile, JobMatchResult, AssessmentSummary } from '../../types';
import { MetricCard } from '../../components/common/MetricCard';
import { DataBadge } from '../../components/common/DataBadge';
import { AssessmentModal } from '../../components/widgets/AssessmentModal';
import { ExplainableGapModal } from '../../components/widgets/ExplainableGapModal';
import { DashboardHeaderBanner } from '../../components/common/DashboardHeaderBanner';
import { MarketAlignmentSection } from '../../components/widgets/MarketAlignmentSection';
import { SkillPathAndPriority } from '../../components/widgets/SkillPathAndPriority';
import { SkillDemandTrendChart } from '../../components/widgets/SkillDemandTrendChart';
import { TopMatchedRolesPreview } from '../../components/widgets/TopMatchedRolesPreview';
import { SkillDetailDrawer, SkillDetailData } from '../../components/widgets/SkillDetailDrawer';
import { ProfileCompletenessModal } from '../../components/widgets/ProfileCompletenessModal';
import { CareerSimulator } from '../../components/simulator/CareerSimulator';
import {
  Upload,
  CheckCircle,
  AlertTriangle,
  Send,
  Loader2,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  MapPin,
  Briefcase
} from 'lucide-react';

interface StudentViewProps {
  currentTab: string;
  onTabChange?: (tab: string) => void;
}

export const StudentView: React.FC<StudentViewProps> = ({ currentTab, onTabChange }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [gapAnalysis, setGapAnalysis] = useState<any>(null);
  const [jobMatches, setJobMatches] = useState<JobMatchResult[]>([]);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // New interactive states for Skill Drawer and Profile Completeness Modal
  const [selectedSkillForDrawer, setSelectedSkillForDrawer] = useState<SkillDetailData | null>(null);
  const [isCompletenessModalOpen, setIsCompletenessModalOpen] = useState(false);

  // Resume upload state
  const [resumeTextInput, setResumeTextInput] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeUploadResult, setResumeUploadResult] = useState<any>(null);

  // Copilot state
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState<
    { role: 'user' | 'assistant'; text: string; time: string; provider?: string; modelUsed?: string }[]
  >([
    {
      role: 'assistant',
      text: 'Hello! I am your AI Career Copilot. I analyze your actual student profile and regional Industry Demand metrics to advise you on bridging skill gaps. Try asking: "Why do I need Docker for DevOps?" or "What should I learn next?"',
      time: 'Just now',
      provider: 'gemini',
      modelUsed: 'gemini-2.5-flash',
    },
  ]);

  // Modals state
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentSummary | null>(null);
  const [selectedJobForExplain, setSelectedJobForExplain] = useState<JobMatchResult | null>(null);

  // Career settings
  const [targetRoleInput, setTargetRoleInput] = useState('');
  const [preferredLocationInput, setPreferredLocationInput] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const [profileRes, jobsRes, roadmapRes, assessmentsRes, dashboardRes] = await Promise.all([
        api.getStudentProfile(),
        api.getStudentJobMatches(),
        api.getStudentRoadmap(),
        api.getAssessments(),
        api.getStudentDashboard().catch(err => {
          console.warn('Dashboard API fallback:', err);
          return null;
        }),
      ]);

      setProfile(profileRes.profile);
      setDashboardData(dashboardRes);
      setGapAnalysis(profileRes.gapAnalysis);
      setTargetRoleInput(profileRes.profile.targetRole);
      setPreferredLocationInput(profileRes.profile.preferredLocation);
      setJobMatches(jobsRes.matches);
      setRoadmap(roadmapRes);
      setAssessments(assessmentsRes.assessments);
    } catch (err) {
      console.error('Error fetching student data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeTextInput.trim()) return;

    try {
      setUploadingResume(true);
      const result = await api.uploadResume({
        resumeText: resumeTextInput,
        fileName: 'Student_Engineering_Resume.txt',
      });
      setResumeUploadResult(result);
      fetchStudentData();
    } catch (err: any) {
      alert(err.message || 'Resume upload failed');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleToggleRoadmap = async (moduleId: string, currentStatus: boolean) => {
    try {
      await api.updateRoadmapProgress(moduleId, !currentStatus);
      const updatedRoadmap = await api.getStudentRoadmap();
      setRoadmap(updatedRoadmap);
    } catch (err) {
      console.error('Failed to update roadmap', err);
    }
  };

  const handleCopilotSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim() || copilotLoading) return;

    const userText = copilotQuery;
    setCopilotQuery('');
    setCopilotMessages(prev => [...prev, { role: 'user', text: userText, time: 'Just now' }]);

    try {
      setCopilotLoading(true);
      const res = await api.askCareerCopilot(userText);
      setCopilotMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: res.answer,
          time: 'Just now',
          provider: res.provider,
          modelUsed: res.modelUsed,
        },
      ]);
    } catch (err: any) {
      setCopilotMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'SkillSetu Deterministic Fallback: Recommended immediate focus is Containerization (Docker) and AWS cloud infrastructure.',
          time: 'Just now',
          provider: 'deterministic',
          modelUsed: 'SkillSetu Deterministic Engine',
        },
      ]);
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleSaveProfileSettings = async () => {
    try {
      setSavingSettings(true);
      await api.updateStudentProfile({
        targetRole: targetRoleInput,
        preferredLocation: preferredLocationInput,
      });
      fetchStudentData();
    } catch (err: any) {
      alert(err.message || 'Update failed');
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-800" />
      </div>
    );
  }

  // Sub-tabs rendering
  return (
    <div className="w-full min-w-0 space-y-6">
      {/* 1. OVERVIEW & PROFILE: STUDENT LABOUR-MARKET INTELLIGENCE DASHBOARD */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <DashboardHeaderBanner
            role="STUDENT"
            title="Student Skill Intelligence Dashboard"
            subtitle="AI-driven mapping of your verified skills, target-role requirements, and current labour-market demand."
            badgeText={
              dashboardData?.profile?.verificationBadgeText ||
              (profile?.skills.some(s => s.verified) ? 'Skills Verified (4/5)' : 'Profile Analysed')
            }
            activeMetric={{
              label: 'Target Career',
              value: dashboardData?.profile?.targetRole || profile?.targetRole || 'DevOps / Cloud Engineer',
            }}
          />

          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: PROFILE COMPLETENESS */}
            <MetricCard
              title="Profile Completeness"
              value={`${dashboardData?.profile?.profileCompleteness?.pct || profile?.profileCompletionPct || 85}%`}
              subtitle="Identity & Credentials Analysed"
              dataLabel="VERIFIED"
              interactive
              onClick={() => setIsCompletenessModalOpen(true)}
            >
              <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-slate-600 flex-wrap">
                <span className="flex items-center gap-0.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Resume
                </span>
                <span>·</span>
                <span className="flex items-center gap-0.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Education
                </span>
                <span>·</span>
                <span className="flex items-center gap-0.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Skills
                </span>
                <span>·</span>
                <span className="flex items-center gap-0.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Target Role
                </span>
              </div>
            </MetricCard>

            {/* Card 2: TARGET ROLE MATCH */}
            <MetricCard
              title="Target Role Match"
              value={`${dashboardData?.targetRoleMatch?.matchPct || jobMatches[0]?.overallMatchPct || 48}%`}
              subtitle={dashboardData?.targetRoleMatch?.role || profile?.targetRole || 'DevOps / Cloud Engineer'}
              change="Benchmark Fit"
              isPositive
              dataLabel="VERIFIED"
              interactive
              onClick={() => onTabChange?.('gaps')}
            >
              <div className="mt-2 text-[10px] font-mono font-semibold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100 flex items-center justify-between">
                <span>{dashboardData?.targetRoleMatch?.explanation || '5 / 10 required skills matched'}</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </div>
            </MetricCard>

            {/* Card 3: VERIFIED / ANALYSED SKILLS */}
            <MetricCard
              title="Verified / Analysed Skills"
              value={dashboardData?.profile?.totalSkillsCount || profile?.skills.length || 5}
              subtitle={`${dashboardData?.profile?.verifiedSkillsCount || profile?.skills.filter(s => s.verified).length || 4} Verified · ${dashboardData?.profile?.unverifiedSkillsCount || 1} Unverified`}
              dataLabel="VERIFIED"
              interactive
              onClick={() => onTabChange?.('assessment')}
            >
              <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono">
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {dashboardData?.profile?.verifiedSkillsCount || 4} Verified
                </span>
                <span className="text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {dashboardData?.profile?.unverifiedSkillsCount || 1} Unverified
                </span>
              </div>
            </MetricCard>

            {/* Card 4: CRITICAL SKILL GAPS */}
            <MetricCard
              title="Critical Skill Gaps"
              value={dashboardData?.criticalSkillGaps?.count || gapAnalysis?.missingCount || 5}
              subtitle={`For Target: ${profile?.targetRole || 'DevOps / Cloud Engineer'}`}
              change="Critical Priority"
              isPositive={false}
              statusColor="danger"
              dataLabel="DEMO DATA"
              interactive
              onClick={() => onTabChange?.('gaps')}
            >
              <div className="mt-2 text-[10px] font-mono text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center justify-between">
                <span>Priority: Docker, AWS</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </div>
            </MetricCard>
          </div>

          {/* SECTION 4 & 5: MARKET ALIGNMENT & WHY THIS GAP MATTERS */}
          <MarketAlignmentSection
            items={dashboardData?.marketAlignment?.items || [
              { skillId: 'sk-linux', skillName: 'Linux', category: 'Cloud & DevOps', yourLevel: 'Intermediate', requiredLevel: 'Intermediate', marketDemand: 'High', status: 'Covered', isCovered: true, verified: true, source: 'RESUME', dataTrustState: 'VERIFIED' },
              { skillId: 'sk-git', skillName: 'Git', category: 'Cloud & DevOps', yourLevel: 'Advanced', requiredLevel: 'Intermediate', marketDemand: 'High', status: 'Covered', isCovered: true, verified: true, source: 'ASSESSMENT', dataTrustState: 'VERIFIED' },
              { skillId: 'sk-python', skillName: 'Python', category: 'AI & Data Science', yourLevel: 'Intermediate', requiredLevel: 'Intermediate', marketDemand: 'High', status: 'Covered', isCovered: true, verified: true, source: 'RESUME', dataTrustState: 'VERIFIED' },
              { skillId: 'sk-docker', skillName: 'Docker', category: 'Cloud & DevOps', yourLevel: 'Not detected', requiredLevel: 'Intermediate', marketDemand: 'High', status: 'Gap', isCovered: false, verified: false, source: 'NONE', priority: 'HIGH', dataTrustState: 'NOT_DETECTED' },
              { skillId: 'sk-aws', skillName: 'AWS', category: 'Cloud & DevOps', yourLevel: 'Not detected', requiredLevel: 'Intermediate', marketDemand: 'High', status: 'Gap', isCovered: false, verified: false, source: 'NONE', priority: 'HIGH', dataTrustState: 'NOT_DETECTED' },
              { skillId: 'sk-k8s', skillName: 'Kubernetes', category: 'Cloud & DevOps', yourLevel: 'Not detected', requiredLevel: 'Beginner', marketDemand: 'Medium', status: 'Gap', isCovered: false, verified: false, source: 'NONE', priority: 'MEDIUM', dataTrustState: 'NOT_DETECTED' },
              { skillId: 'sk-terraform', skillName: 'Terraform', category: 'Cloud & DevOps', yourLevel: 'Not detected', requiredLevel: 'Beginner', marketDemand: 'Medium', status: 'Gap', isCovered: false, verified: false, source: 'NONE', priority: 'LOW', dataTrustState: 'NOT_DETECTED' },
              { skillId: 'sk-ci-cd', skillName: 'CI/CD Pipelines', category: 'Cloud & DevOps', yourLevel: 'Not detected', requiredLevel: 'Intermediate', marketDemand: 'High', status: 'Gap', isCovered: false, verified: false, source: 'NONE', priority: 'MEDIUM', dataTrustState: 'NOT_DETECTED' },
            ]}
            targetRole={profile?.targetRole || 'DevOps / Cloud Engineer'}
            onSelectSkill={skill => setSelectedSkillForDrawer(skill)}
            onStartRoadmap={skillName => onTabChange?.('roadmap')}
          />

          {/* SECTION 6, 7 & 10: CAREER PATH PROGRESSION, PRIORITY MATRIX, & RECOMMENDED ACTION */}
          <SkillPathAndPriority
            targetRole={profile?.targetRole || 'DevOps / Cloud Engineer'}
            recommendedPath={dashboardData?.recommendedSkillPath || {
              currentProfile: [
                { name: 'Linux', status: 'Covered', verified: true, level: 'Intermediate', stage: 'Stage 1: OS Foundations', source: 'RESUME' },
                { name: 'Git', status: 'Covered', verified: true, level: 'Advanced', stage: 'Stage 1: Version Control', source: 'ASSESSMENT' },
                { name: 'Python', status: 'Covered', verified: true, level: 'Intermediate', stage: 'Stage 1: Automation Scripting', source: 'RESUME' },
              ],
              priorityGaps: [
                { name: 'Docker', status: 'Priority Gap', requiredLevel: 'Intermediate', priority: 'HIGH', stage: 'Stage 2: Containerization', timeline: 'Week 1-3' },
                { name: 'AWS', status: 'Priority Gap', requiredLevel: 'Intermediate', priority: 'HIGH', stage: 'Stage 2: Cloud Infrastructure', timeline: 'Week 4-6' },
                { name: 'Kubernetes', status: 'Secondary Gap', requiredLevel: 'Beginner', priority: 'MEDIUM', stage: 'Stage 3: Orchestration', timeline: 'Week 7-9' },
              ],
              targetRole: profile?.targetRole || 'DevOps / Cloud Engineer',
              disclaimer: 'Curriculum path is based on aggregate job role specifications. Completion does not guarantee employment or placement.'
            }}
            priorityMatrix={dashboardData?.marketAlignment?.priorityMatrix || {
              high: ['Docker', 'AWS'],
              medium: ['Kubernetes', 'CI/CD Pipelines'],
              low: ['Terraform'],
              logicExplanation: 'Priority is calculated deterministically combining market demand weight, target-role relevance, and current skill gap.'
            }}
            recommendedAction={dashboardData?.recommendedAction || {
              title: 'Recommended Action',
              statement: `Your highest-priority gaps for ${profile?.targetRole || 'DevOps / Cloud Engineer'} are Docker and AWS. Building proficiency in these skills would address two of your current market-alignment gaps.`,
              primarySkill: 'Docker',
              secondarySkill: 'AWS',
              primaryActionLabel: 'Start Docker Roadmap',
              secondaryActionLabel: 'Explore AWS',
            }}
            onStartRoadmap={skillName => onTabChange?.('roadmap')}
            onExploreSkill={skillName => onTabChange?.('gaps')}
          />

          {/* SECTION 8: SKILL DEMAND TREND */}
          <SkillDemandTrendChart trendData={dashboardData?.skillDemandTrend} />

          {/* SECTION 9: TOP MATCHED ROLES PREVIEW */}
          <TopMatchedRolesPreview
            roles={dashboardData?.topMatchedRoles || [
              { jobId: 'job-6', title: 'Cloud Support Engineer (Linux & Cloud Infrastructure)', employerName: 'Infosys Cloud Operations', matchPct: 56, location: 'Pune, Maharashtra', experienceMinYears: 0, salaryMinLPA: 6.5, salaryMaxLPA: 10.0, matchedSkills: ['Linux', 'Git', 'SQL'], missingSkills: ['AWS', 'Docker'] },
              { jobId: 'job-7', title: 'Junior Cloud Engineer', employerName: 'Wipro Digital Platforms', matchPct: 51, location: 'Bengaluru, Karnataka', experienceMinYears: 0, salaryMinLPA: 7.2, salaryMaxLPA: 11.5, matchedSkills: ['Linux', 'Python'], missingSkills: ['Docker', 'AWS'] },
              { jobId: 'job-1', title: 'Associate DevOps Engineer (Platform Team)', employerName: 'Razorpay', matchPct: 48, location: 'Bengaluru, Karnataka', experienceMinYears: 0, salaryMinLPA: 12, salaryMaxLPA: 18, matchedSkills: ['Linux', 'Git'], missingSkills: ['Docker', 'AWS'] },
              { jobId: 'job-2', title: 'Cloud Systems Engineer (AWS/GCP)', employerName: 'Persistent Systems', matchPct: 44, location: 'Pune, Maharashtra', experienceMinYears: 1, salaryMinLPA: 8.5, salaryMaxLPA: 14, matchedSkills: ['Linux'], missingSkills: ['AWS', 'Docker', 'CI/CD Pipelines'] },
            ]}
            onViewAllJobs={() => onTabChange?.('jobs')}
          />

          {/* PRESERVED: Candidate Intelligence Profile & Current Skill Inventory */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">Candidate Intelligence Profile</span>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{profile?.userId}</h2>
                <p className="text-xs text-slate-600 mt-0.5">{profile?.education}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-mono">Target Role:</span>
                <span className="px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md">
                  {profile?.targetRole}
                </span>
              </div>
            </div>

            {/* Current Skill Inventory */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Current Skill Inventory</p>
                <span className="text-[11px] text-slate-500">{profile?.skills.length} competencies registered</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile?.skills.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedSkillForDrawer({
                        skillId: s.skillId,
                        skillName: s.skillName || s.skillId,
                        category: s.category || 'Engineering',
                        yourLevel: s.proficiency,
                        requiredLevel: 'Intermediate',
                        marketDemand: s.marketDemand || 'HIGH',
                        status: 'Covered',
                        isCovered: true,
                        dataTrustState: s.verified ? 'VERIFIED' : s.source === 'SELF' ? 'SELF-REPORTED' : 'ANALYSED',
                        verified: s.verified,
                        whyItMatters: `${s.skillName || s.skillId} is part of your verified profile foundations.`,
                      });
                    }}
                    className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 cursor-pointer transition-colors"
                  >
                    <span className="font-semibold">{s.skillName || s.skillId}</span>
                    <span className="text-[10px] text-slate-500 font-mono">· {s.proficiency}</span>
                    {s.verified ? (
                      <DataBadge type="VERIFIED" label="VERIFIED" size="sm" />
                    ) : s.source === 'SELF' ? (
                      <DataBadge type="SELF-REPORTED" label="SELF-REPORTED" size="sm" />
                    ) : (
                      <DataBadge type="ANALYSED" label="ANALYSED" size="sm" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RESUME INTELLIGENCE */}
      {currentTab === 'resume' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Resume Intelligence &amp; Skill Extraction</h3>
              <p className="text-xs text-slate-500">
                Upload or paste your engineering resume. The parser normalizes skills (e.g. React.js → React, k8s → Kubernetes) and extracts structured projects.
              </p>
            </div>
            <DataBadge type="REAL" label="Gemini 2.5 Flash Parser" />
          </div>

          <form onSubmit={handleResumeSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Paste Resume Text (or Upload Plain Text/PDF Content)
              </label>
              <textarea
                rows={8}
                value={resumeTextInput}
                onChange={e => setResumeTextInput(e.target.value)}
                placeholder="Paste full resume text with Education, Technical Skills, Projects, and Work Experience..."
                className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setResumeTextInput(profile?.resumeText || '')}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 underline"
              >
                Load Sample Final-Year DevOps Resume
              </button>

              <button
                type="submit"
                disabled={uploadingResume || !resumeTextInput.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg shadow-sm flex items-center gap-2"
              >
                {uploadingResume && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Extract &amp; Normalize Skills</span>
              </button>
            </div>
          </form>

          {resumeUploadResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{resumeUploadResult.message}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-emerald-950">Normalized Canonical Skills Detected:</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {resumeUploadResult.normalizedSkills?.map((s: any) => (
                    <span key={s.id} className="px-2 py-0.5 bg-white border border-emerald-200 text-emerald-800 text-[11px] font-semibold rounded">
                      {s.canonicalName} ({s.category})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. SKILL GAP ENGINE */}
      {currentTab === 'gaps' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">Deterministic Gap Engine</span>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Skill Comparison: Your Profile vs. Market Demands for {profile?.targetRole}
              </h3>
            </div>
            <DataBadge type="REAL" label="Mathematical Benchmark" />
          </div>

          {/* Target Role Selector */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Target Role:</span>
              <input
                type="text"
                value={targetRoleInput}
                onChange={e => setTargetRoleInput(e.target.value)}
                className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white text-slate-800"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Preferred Location:</span>
              <input
                type="text"
                value={preferredLocationInput}
                onChange={e => setPreferredLocationInput(e.target.value)}
                className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white text-slate-800"
              />
            </div>
            <button
              type="button"
              disabled={savingSettings}
              onClick={handleSaveProfileSettings}
              className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800"
            >
              {savingSettings ? 'Saving...' : 'Update Career Target'}
            </button>
          </div>

          {/* Gap Matrix Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
              Market Required Competencies ({gapAnalysis?.marketSkillsNeeded?.length || 0} Evaluated)
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
              {gapAnalysis?.marketSkillsNeeded?.map((item: any, idx: number) => {
                const isMissing = item.isMissing;
                return (
                  <div key={idx} className="p-3.5 bg-white flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${isMissing ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      <div>
                        <p className="font-bold text-slate-900">{item.skill.canonicalName}</p>
                        <p className="text-[11px] text-slate-500">{item.skill.category} · {item.skill.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block">DEMAND</span>
                        <span className="font-semibold text-slate-700">{item.marketDemand}</span>
                      </div>
                      <div className="w-24">
                        {isMissing ? (
                          <span className="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px] rounded block text-center">
                            MISSING
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px] rounded block text-center">
                            COVERED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. JOB MATCHING */}
      {currentTab === 'jobs' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Active Industry Openings &amp; Fit Analysis</h3>
              <p className="text-xs text-slate-500">
                Matches are calculated mathematically using weighted required (70%) and preferred (30%) skill sets.
              </p>
            </div>
            <DataBadge type="REAL" label={`${jobMatches.length} Live Positions`} />
          </div>

          <div className="space-y-3">
            {jobMatches.map((m, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{m.job.title}</span>
                      <span className="text-xs text-slate-500 font-medium">at {m.job.employerName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {m.job.locationCity}, {m.job.locationState}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> {m.job.experienceMinYears}+ Yrs Exp</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-700">₹{m.job.salaryMinLPA} - {m.job.salaryMaxLPA} LPA</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-mono">DETERMINISTIC MATCH</span>
                      <span className="text-xl font-extrabold text-slate-900">{m.overallMatchPct}%</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedJobForExplain(m)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold"
                    >
                      Why this Match?
                    </button>
                  </div>
                </div>

                {/* Missing Skills Warning */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Missing Mandatory:</span>
                    {m.missingSkills.length === 0 ? (
                      <span className="text-emerald-700 font-semibold">None! 100% matched</span>
                    ) : (
                      m.missingSkills.map((gap, gIdx) => (
                        <span key={gIdx} className="px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded font-semibold text-[11px]">
                          {gap.skill.canonicalName}
                        </span>
                      ))
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">{m.matchBreakdownExplanation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. LEARNING ROADMAP */}
      {currentTab === 'roadmap' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">Personalized Progression</span>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                DevOps &amp; Cloud Architecture Learning Roadmap
              </h3>
              <p className="text-xs text-slate-500">
                Track completion of hands-on modules designed specifically to bridge your identified industry gaps.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-mono">ROADMAP PROGRESS</span>
              <span className="text-xl font-extrabold text-slate-900">{roadmap?.progressPct || 0}% Completed</span>
            </div>
          </div>

          <div className="space-y-6">
            {roadmap?.stages?.map((stage: any) => (
              <div key={stage.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-indigo-600"></span>
                    {stage.title}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">{stage.level}</span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
                  {stage.modules?.map((mod: any) => (
                    <div key={mod.id} className="p-3.5 bg-white flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={mod.isCompleted}
                          onChange={() => handleToggleRoadmap(mod.id, mod.isCompleted)}
                          className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                        />
                        <div>
                          <p className={`font-semibold ${mod.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                            {mod.title}
                          </p>
                          <p className="text-[11px] text-slate-500">Target Skill: {mod.skill} · Est. {mod.estimatedHours} Hours Hands-On</p>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mod.isCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {mod.isCompleted ? 'COMPLETED' : 'PENDING'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SKILL ASSESSMENTS */}
      {currentTab === 'assessment' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Verified Technical Skill Assessments</h3>
              <p className="text-xs text-slate-500">
                Score 66% or higher to verify skills on your candidate profile and boost recruiter search ranking.
              </p>
            </div>
            <DataBadge type="REAL" label="Objective Evaluation" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assessments.map(asmt => (
              <div key={asmt.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-indigo-700">{asmt.skillName}</span>
                    {asmt.passed && (
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> VERIFIED
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{asmt.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {asmt.questionsCount} Multiple-Choice Questions · {asmt.durationMinutes} Mins
                  </p>
                  {asmt.hasAttempted && (
                    <p className="text-xs font-semibold text-slate-700 mt-2">
                      Last Score: <span className="font-mono">{asmt.lastScore}%</span>
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedAssessment(asmt)}
                  className="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold"
                >
                  {asmt.hasAttempted ? 'Re-take Assessment' : 'Start Assessment'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6.5 AI CAREER SIMULATOR */}
      {currentTab === 'career-simulator' && (
        <CareerSimulator
          profile={profile}
          dashboardData={dashboardData}
          onNavigateToRoadmap={() => onTabChange?.('roadmap')}
          onNavigateToAssessments={() => onTabChange?.('assessment')}
        />
      )}

      {/* 7. AI CAREER COPILOT */}
      {currentTab === 'copilot' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 flex flex-col min-h-[500px]">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                AI Career Copilot (Grounded Intelligence)
              </h3>
              <p className="text-xs text-slate-500">
                Answers are grounded in your actual verified skills ({profile?.skills.length}), detected gaps ({gapAnalysis?.missingCount}), and live market openings.
              </p>
            </div>
            <DataBadge type="REAL" label="Gemini 2.5 Flash (Multi-AI Fallback)" />
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => setCopilotQuery('What should I learn next?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
            >
              "What should I learn next?"
            </button>
            <button
              type="button"
              onClick={() => setCopilotQuery('Why is Docker important for my target role?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
            >
              "Why is Docker important for my target role?"
            </button>
            <button
              type="button"
              onClick={() => setCopilotQuery('Show my biggest skill gaps.')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
            >
              "Show my biggest skill gaps."
            </button>
            <button
              type="button"
              onClick={() => setCopilotQuery('Which job roles currently match my profile?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
            >
              "Which job roles currently match my profile?"
            </button>
            <button
              type="button"
              onClick={() => setCopilotQuery('What skills are most demanded for my target role?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
            >
              "What skills are most demanded for my target role?"
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200 max-h-[380px]">
            {copilotMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-lg text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-[10px] text-slate-400">{msg.time}</span>
                  {msg.modelUsed && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {msg.modelUsed}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {copilotLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
                <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
                <span>Career Copilot analyzing market telemetry...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleCopilotSend} className="flex gap-2">
            <input
              type="text"
              value={copilotQuery}
              onChange={e => setCopilotQuery(e.target.value)}
              placeholder="Ask anything about your skill gaps, industry requirements, or salary benchmarks..."
              className="flex-1 text-xs p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <button
              type="submit"
              disabled={copilotLoading || !copilotQuery.trim()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}

      {/* Modals */}
      {selectedAssessment && (
        <AssessmentModal
          assessment={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
          onCompleted={() => {
            fetchStudentData();
          }}
        />
      )}

      {selectedJobForExplain && (
        <ExplainableGapModal
          match={selectedJobForExplain}
          onClose={() => setSelectedJobForExplain(null)}
        />
      )}

      {/* Interactive Skill Detail Drawer */}
      <SkillDetailDrawer
        skill={selectedSkillForDrawer}
        isOpen={Boolean(selectedSkillForDrawer)}
        onClose={() => setSelectedSkillForDrawer(null)}
        onStartRoadmap={skillName => {
          setSelectedSkillForDrawer(null);
          onTabChange?.('roadmap');
        }}
        onStartAssessment={skillId => {
          setSelectedSkillForDrawer(null);
          onTabChange?.('assessment');
        }}
      />

      {/* Interactive Profile Completeness Modal */}
      <ProfileCompletenessModal
        isOpen={isCompletenessModalOpen}
        onClose={() => setIsCompletenessModalOpen(false)}
        profile={dashboardData?.profile || profile}
        onGoToResume={() => {
          setIsCompletenessModalOpen(false);
          onTabChange?.('resume');
        }}
        onEditSettings={() => {
          setIsCompletenessModalOpen(false);
          onTabChange?.('overview');
        }}
      />
    </div>
  );
};
