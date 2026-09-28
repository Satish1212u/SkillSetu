import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Cpu,
  Briefcase,
  GraduationCap,
  Award,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  FileUp,
  RefreshCw,
  FolderGit2,
  Target,
  ExternalLink,
  Brain,
} from 'lucide-react';
import { api } from '../../services/api';
import {
  StudentProfile,
  ResumeUploadResponse,
  StructuredResumeData,
  StructuredResumeSkill,
  JobMatchResult,
  Skill,
} from '../../types';
import { DataBadge } from '../common/DataBadge';

export type ProcessingState =
  | 'idle'
  | 'uploading'
  | 'extracting'
  | 'analyzing'
  | 'building'
  | 'completed'
  | 'error';

interface ResumeIntelligenceSectionProps {
  profile: StudentProfile | null;
  onRefreshDashboard: () => Promise<void>;
  onNavigateTab?: (tab: string) => void;
  onSelectJobForExplain?: (job: JobMatchResult) => void;
}

export const ResumeIntelligenceSection: React.FC<ResumeIntelligenceSectionProps> = ({
  profile,
  onRefreshDashboard,
  onNavigateTab,
  onSelectJobForExplain,
}) => {
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<ResumeUploadResponse | null>(null);
  const [uploadMode, setUploadMode] = useState<'pdf' | 'text'>('pdf');
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resume data to display: from recent upload response, or from existing profile
  const resumeData: StructuredResumeData | undefined =
    uploadResult?.parsedResume || profile?.resumeData;

  const currentRole = profile?.targetRole || 'DevOps / Cloud Engineer';

  // State step labels
  const steps: { key: ProcessingState; label: string }[] = [
    { key: 'uploading', label: '1. Uploading' },
    { key: 'extracting', label: '2. Extracting' },
    { key: 'analyzing', label: '3. Analyzing with AI' },
    { key: 'building', label: '4. Building Skill Profile' },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setSelectedFile(file);
        setErrorMessage(null);
      } else {
        setErrorMessage('Please upload a valid PDF document (.pdf format).');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setSelectedFile(file);
        setErrorMessage(null);
      } else {
        setErrorMessage('Please select a valid PDF file (.pdf format).');
      }
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Strip data url prefix if present
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = err => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleUploadAndAnalyze = async () => {
    if (uploadMode === 'pdf' && !selectedFile) {
      setErrorMessage('Please select a PDF file first.');
      return;
    }
    if (uploadMode === 'text' && !textInput.trim()) {
      setErrorMessage('Please paste resume text.');
      return;
    }

    try {
      setErrorMessage(null);
      setProcessingState('uploading');

      let payload: { resumeText?: string; base64Pdf?: string; fileName?: string } = {};

      if (uploadMode === 'pdf' && selectedFile) {
        setProcessingState('uploading');
        const base64 = await readFileAsBase64(selectedFile);
        payload = {
          base64Pdf: base64,
          fileName: selectedFile.name,
        };
      } else {
        payload = {
          resumeText: textInput,
          fileName: 'Pasted_Engineering_Resume.txt',
        };
      }

      // Step progress progression
      setTimeout(() => setProcessingState('extracting'), 400);
      setTimeout(() => setProcessingState('analyzing'), 900);
      setTimeout(() => setProcessingState('building'), 1600);

      const response = await api.uploadResume(payload);

      setUploadResult(response);
      setProcessingState('completed');
      await onRefreshDashboard();
    } catch (err: any) {
      console.error('Resume processing failed:', err);
      setProcessingState('error');
      setErrorMessage(err.message || 'Resume extraction failed. Please try again.');
    }
  };

  // Derive Deterministic Skill Gap Analysis for the current / detected target role
  const profileSkillsMap = new Map(
    (profile?.skills || []).map(s => [s.skillId, s])
  );

  // Group extracted skills by category
  const skillsByCategory: Record<string, StructuredResumeSkill[]> = {};
  if (resumeData?.skills) {
    for (const sk of resumeData.skills) {
      const cat = (sk.category || 'technical').toLowerCase();
      if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
      skillsByCategory[cat].push(sk);
    }
  }

  // Deterministic skills check for Target Role
  // For DevOps: Linux, Git, Python, Docker, AWS, Kubernetes, Terraform, CI/CD
  // For Frontend: React, JavaScript, HTML5 & CSS3, TypeScript, Tailwind CSS, Testing
  const roleSkillSets: Record<
    string,
    { required: { name: string; id: string }[]; emerging: { name: string; id: string }[] }
  > = {
    'DevOps / Cloud Engineer': {
      required: [
        { name: 'Linux', id: 'sk-linux' },
        { name: 'Git', id: 'sk-git' },
        { name: 'Python', id: 'sk-python' },
        { name: 'Docker', id: 'sk-docker' },
        { name: 'AWS', id: 'sk-aws' },
        { name: 'Kubernetes', id: 'sk-k8s' },
        { name: 'CI/CD Pipelines', id: 'sk-ci-cd' },
      ],
      emerging: [
        { name: 'Terraform', id: 'sk-terraform' },
        { name: 'Generative AI', id: 'sk-genai' },
      ],
    },
    'Frontend Developer': {
      required: [
        { name: 'React', id: 'sk-react' },
        { name: 'JavaScript', id: 'sk-javascript' },
        { name: 'HTML5 & CSS3', id: 'sk-html-css' },
        { name: 'TypeScript', id: 'sk-typescript' },
        { name: 'Testing', id: 'sk-testing' },
        { name: 'CI/CD Pipelines', id: 'sk-ci-cd' },
      ],
      emerging: [
        { name: 'Tailwind CSS', id: 'sk-tailwind' },
        { name: 'React Testing Library', id: 'sk-testing' },
      ],
    },
    'Backend Developer': {
      required: [
        { name: 'Node.js', id: 'sk-nodejs' },
        { name: 'SQL', id: 'sk-sql' },
        { name: 'PostgreSQL', id: 'sk-postgresql' },
        { name: 'RESTful API Design', id: 'sk-rest-api' },
        { name: 'Python', id: 'sk-python' },
      ],
      emerging: [
        { name: 'FastAPI', id: 'sk-fastapi' },
        { name: 'Redis', id: 'sk-redis' },
        { name: 'Docker', id: 'sk-docker' },
      ],
    },
  };

  const currentRoleSet =
    roleSkillSets[currentRole] || roleSkillSets['DevOps / Cloud Engineer'];

  const matchedRoleSkills = currentRoleSet.required.filter(req =>
    profileSkillsMap.has(req.id)
  );

  const missingRoleSkills = currentRoleSet.required.filter(
    req => !profileSkillsMap.has(req.id)
  );

  const recommendedSkills = currentRoleSet.emerging;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                <Brain className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                AI Resume Screening &amp; Resume Intelligence
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Upload your engineering PDF resume. Centralized AI extracts structured candidate data,
              standardizes skills via canonical taxonomy, and calculates deterministic labor-market alignment.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {uploadResult?.provider && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-mono">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  Provider: <strong>{uploadResult.provider.toUpperCase()}</strong> ({uploadResult.modelUsed})
                </span>
                {uploadResult.fallbackUsed && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 rounded">
                    Fallback
                  </span>
                )}
              </div>
            )}
            <DataBadge type="REAL" label="Centralized AI Router" />
          </div>
        </div>

        {/* 2. Resume Upload Component */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUploadMode('pdf')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  uploadMode === 'pdf'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Upload PDF Resume
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('text')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  uploadMode === 'text'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Paste Resume Text
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              Supported: <strong>PDF</strong> (.pdf, max 10MB)
            </span>
          </div>

          {uploadMode === 'pdf' ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-indigo-600 bg-indigo-50/50'
                  : selectedFile
                  ? 'border-emerald-500 bg-emerald-50/20'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-2">
                <div
                  className={`p-3 rounded-full ${
                    selectedFile ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {selectedFile ? (
                    <FileText className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <FileUp className="w-6 h-6 text-slate-600" />
                  )}
                </div>

                {selectedFile ? (
                  <div>
                    <p className="text-xs font-bold text-slate-900">{selectedFile.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB · Ready for AI Screening
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Drag &amp; drop your PDF resume here, or <span className="text-indigo-600 underline">browse</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Fast local text extraction with Gemini 2.5 Flash, Groq &amp; OpenRouter fallback
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                rows={6}
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="Paste full resume text with Education, Technical Skills, Projects, and Work Experience..."
                className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <button
                type="button"
                onClick={() => setTextInput(profile?.resumeText || '')}
                className="text-[11px] font-medium text-slate-600 hover:text-slate-900 underline"
              >
                Load Sample Final-Year DevOps Resume
              </button>
            </div>
          )}

          {/* Progress / Status Indicator */}
          {processingState !== 'idle' && processingState !== 'completed' && processingState !== 'error' && (
            <div className="p-4 bg-indigo-50/80 border border-indigo-100 rounded-lg space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-950 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  Processing Resume Intelligence...
                </span>
                <span className="font-mono text-indigo-700 font-semibold uppercase text-[10px]">
                  State: {processingState}
                </span>
              </div>

              {/* Step indicator */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {steps.map(step => {
                  const isActive = processingState === step.key;
                  return (
                    <div
                      key={step.key}
                      className={`px-2.5 py-1.5 rounded text-[11px] font-medium border text-center transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                          : 'bg-white/80 text-slate-600 border-slate-200'
                      }`}
                    >
                      {step.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error Banner */}
          {processingState === 'error' && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-xs text-rose-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage || 'Resume processing failed. Please verify the document.'}</span>
              </div>
              <button
                type="button"
                onClick={handleUploadAndAnalyze}
                className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 font-semibold rounded text-[11px]"
              >
                Retry
              </button>
            </div>
          )}

          {/* Completion Success Banner */}
          {processingState === 'completed' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Resume analyzed successfully</span>
                </div>
                {uploadResult && (
                  <span className="text-[11px] font-mono text-emerald-800">
                    Extracted {uploadResult.normalizedSkills.length} skills (
                    {uploadResult.newlyAddedCount} new added to profile)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-800">
                Candidate intelligence and deterministic skill gaps have been updated across your dashboard.
              </p>
            </div>
          )}

          {/* Action Trigger */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              {profile?.resumeFileName ? (
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Active file: <strong>{profile.resumeFileName}</strong>
                </span>
              ) : (
                'No resume uploaded yet'
              )}
            </span>

            <button
              type="button"
              disabled={
                processingState === 'uploading' ||
                processingState === 'extracting' ||
                processingState === 'analyzing' ||
                processingState === 'building' ||
                (uploadMode === 'pdf' && !selectedFile) ||
                (uploadMode === 'text' && !textInput.trim())
              }
              onClick={handleUploadAndAnalyze}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg shadow-sm flex items-center gap-2"
            >
              {processingState !== 'idle' &&
              processingState !== 'completed' &&
              processingState !== 'error' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              )}
              <span>Screen &amp; Parse with AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. STRUCTURED RESUME INTELLIGENCE DATA (Candidate, Roles, Education, Experience, Projects) */}
      {resumeData && (
        <div className="space-y-6">
          {/* Candidate Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Parsed Candidate Intelligence
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  {resumeData.candidate?.name || profile?.userId || 'Candidate Profile'}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                  {resumeData.candidate?.email && <span>{resumeData.candidate.email}</span>}
                  {resumeData.candidate?.phone && <span>· {resumeData.candidate.phone}</span>}
                  {resumeData.candidate?.location && <span>· {resumeData.candidate.location}</span>}
                </div>
              </div>

              {/* Detected Roles */}
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">
                  Detected / Possible Roles
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1 sm:justify-end">
                  {resumeData.possibleRoles && resumeData.possibleRoles.length > 0 ? (
                    resumeData.possibleRoles.map((role, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-100 rounded text-[11px] font-semibold"
                      >
                        {role}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">{currentRole}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Candidate Summary */}
            {resumeData.summary && (
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-0.5">Professional Summary:</span>
                {resumeData.summary}
              </div>
            )}
          </div>

          {/* Grid: Education, Experience, Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Education & Certifications */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wide">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Education &amp; Certifications</span>
              </div>

              {resumeData.education && resumeData.education.length > 0 ? (
                <div className="space-y-3">
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                      <p className="font-bold text-slate-900">{edu.degree || 'Engineering Degree'}</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">{edu.institution || 'University'}</p>
                      {edu.year && <p className="text-slate-400 font-mono text-[10px] mt-1">{edu.year}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No formal education section extracted.</p>
              )}

              {/* Certifications */}
              {resumeData.certifications && resumeData.certifications.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600" /> Certifications ({resumeData.certifications.length})
                  </span>
                  <div className="space-y-1.5">
                    {resumeData.certifications.map((cert, cIdx) => (
                      <div
                        key={cIdx}
                        className="px-2.5 py-1 bg-amber-50/60 border border-amber-200 text-amber-900 text-[11px] font-medium rounded"
                      >
                        {cert}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Column 2: Work Experience */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wide">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>Experience ({resumeData.experience?.length || 0})</span>
              </div>

              {resumeData.experience && resumeData.experience.length > 0 ? (
                <div className="space-y-3">
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{exp.role || 'Role'}</span>
                        <span className="text-[10px] font-mono text-slate-400">{exp.duration}</span>
                      </div>
                      <p className="text-indigo-800 font-medium text-[11px]">{exp.company}</p>
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="list-disc list-inside text-[11px] text-slate-600 pt-1 space-y-0.5">
                          {exp.responsibilities.slice(0, 3).map((resp, rIdx) => (
                            <li key={rIdx} className="leading-snug">{resp}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <p className="text-xs text-slate-500 font-medium">Fresher / Academic Focus</p>
                  <p className="text-[10px] text-slate-400 mt-1">No prior corporate employment listed.</p>
                </div>
              )}
            </div>

            {/* Column 3: Projects */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wide">
                <FolderGit2 className="w-4 h-4 text-indigo-600" />
                <span>Engineering Projects ({resumeData.projects?.length || 0})</span>
              </div>

              {resumeData.projects && resumeData.projects.length > 0 ? (
                <div className="space-y-3">
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1.5">
                      <span className="font-bold text-slate-900 block">{proj.name}</span>
                      {proj.description && (
                        <p className="text-[11px] text-slate-600 leading-snug">{proj.description}</p>
                      )}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.technologies.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-mono rounded"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No project entries extracted.</p>
              )}
            </div>
          </div>

          {/* Normalized Skills Showcase */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Taxonomy Normalization
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Extracted Skills with Evidence ({resumeData.skills?.length || 0})
                </h3>
              </div>
              <DataBadge type="VERIFIED" label="Normalized Canonical Skills" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {resumeData.skills && resumeData.skills.length > 0 ? (
                resumeData.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-xs space-y-1 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{skill.name}</span>
                      <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-semibold rounded uppercase">
                        {skill.category || 'Technical'}
                      </span>
                    </div>
                    {skill.evidence && (
                      <p className="text-[11px] text-slate-500 italic line-clamp-2">
                        {skill.evidence}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No skills parsed.</p>
              )}
            </div>
          </div>

          {/* 4. DETERMINISTIC SKILL GAP ANALYSIS FOR TARGET ROLE */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Skill Gap Analysis for Target Role: {currentRole}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Evaluated deterministically against industry benchmarks. Math-based gap computation without LLM hallucinations.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-500">Preparedness:</span>
                <span className="text-lg font-extrabold text-slate-900">
                  {Math.round(
                    (matchedRoleSkills.length / Math.max(1, currentRoleSet.required.length)) * 100
                  )}
                  %
                </span>
              </div>
            </div>

            {/* 3 Categories: Matched, Missing, Recommended */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Matched Skills */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Matched Skills ({matchedRoleSkills.length})</span>
                </div>
                <div className="space-y-1.5">
                  {matchedRoleSkills.length > 0 ? (
                    matchedRoleSkills.map(s => (
                      <div
                        key={s.id}
                        className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold flex items-center justify-between"
                      >
                        <span>{s.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">None matched yet.</p>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                  <X className="w-4 h-4 text-rose-600" />
                  <span>Missing Skills ({missingRoleSkills.length})</span>
                </div>
                <div className="space-y-1.5">
                  {missingRoleSkills.length > 0 ? (
                    missingRoleSkills.map(s => (
                      <div
                        key={s.id}
                        className="px-3 py-2 bg-rose-50 border border-rose-200 text-rose-900 rounded-lg text-xs font-semibold flex items-center justify-between"
                      >
                        <span>{s.name}</span>
                        <span className="text-[10px] font-mono text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                          Priority Deficit
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-emerald-700 font-semibold">
                      All benchmark skills satisfied!
                    </p>
                  )}
                </div>
              </div>

              {/* Emerging / Recommended Skills */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Emerging &amp; Recommended ({recommendedSkills.length})</span>
                </div>
                <div className="space-y-1.5">
                  {recommendedSkills.map(s => (
                    <div
                      key={s.id}
                      className="px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-lg text-xs font-semibold flex items-center justify-between"
                    >
                      <span>{s.name}</span>
                      <span className="text-[10px] font-mono text-indigo-700 bg-white px-1.5 py-0.5 rounded">
                        High Demand
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 5. DETERMINISTIC JOB MATCHES PREVIEW */}
          {uploadResult?.jobMatches && uploadResult.jobMatches.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Live Job Matches (Calculated Deterministically)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Match percentages are derived mathematically from weighted skill intersections.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('jobs')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  View All Openings <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {uploadResult.jobMatches.map((m: any, idx: number) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{m.job.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {m.job.employerName} · {m.job.locationCity}, {m.job.locationState} · ₹
                        {m.job.salaryMinLPA}-{m.job.salaryMaxLPA} LPA
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          Matched: {m.strongSkills.map((s: any) => s.skill.canonicalName).join(', ') || 'Base fit'}
                        </span>
                        {m.missingSkills.length > 0 && (
                          <span className="text-[10px] text-rose-600">
                            · Missing: {m.missingSkills.map((s: any) => s.skill.canonicalName).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-400 block">MATCH</span>
                        <span className="text-base font-extrabold text-slate-900">
                          {m.overallMatchPct}%
                        </span>
                      </div>
                      {onSelectJobForExplain && (
                        <button
                          type="button"
                          onClick={() => onSelectJobForExplain(m)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                        >
                          Why this match?
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
