export type UserRole = 'STUDENT' | 'INSTITUTE' | 'EMPLOYER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  organizationName?: string;
}

export interface Skill {
  id: string;
  canonicalName: string;
  category: string;
  description: string;
  marketDemandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  averageSalaryBumpPct: number;
}

export interface StudentSkill {
  skillId: string;
  skillName?: string;
  category?: string;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  verified: boolean;
  source: 'RESUME' | 'ASSESSMENT' | 'SELF';
  lastEvaluated?: string;
  marketDemand?: string;
}

export interface StructuredResumeCandidate {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface StructuredResumeEducation {
  degree: string;
  institution: string;
  year: string;
}

export interface StructuredResumeSkill {
  name: string;
  category: 'technical' | 'soft' | 'tool' | 'language' | string;
  evidence: string;
}

export interface StructuredResumeExperience {
  company: string;
  role: string;
  duration: string;
  responsibilities: string[];
}

export interface StructuredResumeProject {
  name: string;
  description: string;
  technologies: string[];
}

export interface StructuredResumeData {
  candidate: StructuredResumeCandidate;
  summary: string;
  education: StructuredResumeEducation[];
  skills: StructuredResumeSkill[];
  experience: StructuredResumeExperience[];
  projects: StructuredResumeProject[];
  certifications: string[];
  possibleRoles: string[];
}

export interface ResumeUploadResponse {
  message: string;
  parsedResume: StructuredResumeData;
  normalizedSkills: Skill[];
  newlyAddedCount: number;
  currentSkillsCount: number;
  provider: 'gemini' | 'groq' | 'openrouter' | 'deterministic';
  modelUsed: string;
  fallbackUsed: boolean;
  roleGaps?: any;
  jobMatches?: any[];
}

export interface StudentProfile {
  id: string;
  userId: string;
  targetRole: string;
  preferredLocation: string;
  experienceLevel: string;
  education: string;
  bio: string;
  profileCompletionPct: number;
  skills: StudentSkill[];
  resumeText?: string;
  resumeFileName?: string;
  resumeData?: StructuredResumeData;
  possibleRoles?: string[];
  savedRoadmapProgress?: Record<string, boolean>;
}

export interface SkillMatchDetail {
  skill: Skill;
  status: 'STRONG' | 'MATCHED' | 'WEAK' | 'MISSING';
  isRequired: boolean;
  studentProficiency?: string;
  requiredProficiency?: string;
  marketDemand: string;
  gapPriority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
}

export interface Job {
  id: string;
  employerId: string;
  employerName: string;
  title: string;
  roleCategory: string;
  locationCity: string;
  locationState: string;
  experienceMinYears: number;
  salaryMinLPA: number;
  salaryMaxLPA: number;
  description: string;
  postedAt: string;
  dataSource: 'REAL VERIFIED' | 'SAMPLE BENCHMARK';
  skills: {
    skillId: string;
    isRequired: boolean;
    minProficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  }[];
}

export interface JobMatchResult {
  job: Job;
  overallMatchPct: number;
  requiredMatchPct: number;
  preferredMatchPct: number;
  matchedSkillsCount: number;
  totalRequiredCount: number;
  strongSkills: SkillMatchDetail[];
  missingSkills: SkillMatchDetail[];
  weakSkills: SkillMatchDetail[];
  matchBreakdownExplanation: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface AssessmentSummary {
  id: string;
  skillId: string;
  skillName: string;
  title: string;
  durationMinutes: number;
  questionsCount: number;
  hasAttempted: boolean;
  lastScore?: number;
  passed: boolean;
}

export interface CurriculumComparisonRow {
  skill: Skill;
  marketDemand: 'HIGH' | 'MEDIUM' | 'LOW';
  openingsInIndia: number;
  coverageStatus: 'COVERED' | 'MISSING' | 'PARTIAL';
  coverageDepth?: 'CONCEPTUAL' | 'PRACTICAL' | 'CAPSTONE';
  semesterTaught?: number;
  hoursDedicated?: number;
  urgency: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
}

export interface CurriculumAlignmentReport {
  curriculumId: string;
  courseTitle: string;
  alignmentScore: number;
  scoreCalculationMethod: string;
  totalMarketSkillsEvaluated: number;
  coveredMarketSkillsCount: number;
  missingHighDemandSkillsCount: number;
  comparisonTable: CurriculumComparisonRow[];
  aiCurriculumRecommendations: {
    category: 'SKILLS_TO_ADD' | 'MODULES_TO_UPDATE' | 'TOPICS_TO_REDUCE' | 'PRACTICAL_PROJECTS' | 'CERTIFICATIONS';
    title: string;
    details: string;
    marketEvidence: string;
  }[];
  trainingSupplyVsDemandSummary: {
    highDemandLowSupply: string[];
    highDemandHighSupply: string[];
    lowDemandHighSupply: string[];
  };
}

export interface SkillShortageInsight {
  skillId: string;
  skillName: string;
  category: string;
  demandIndex: number;
  supplyIndex: number;
  gapRatio: number;
  totalOpeningsIndia: number;
  status: 'CRITICAL SHORTAGE' | 'MODERATE SHORTAGE' | 'BALANCED' | 'OVERSUPPLY';
  affectedRoles: string[];
  affectedStates: string[];
  evidenceSummary: string;
}

export interface StateGeoAggregate {
  state: string;
  totalOpenings: number;
  topDemandedSkills: { skillName: string; openings: number; growthPct: number }[];
  avgGapRatio: number;
  topShortageSkill: string;
  criticalShortagesCount: number;
  instituteCount: number;
  studentEnrollmentCapacity: number;
  severity: 'HIGH_URGENCY' | 'ELEVATED' | 'STABLE';
}

// Career Simulation & Assessment Types
export type SimulationCategory = 'interview' | 'workplace' | 'incident' | 'problem_solving';
export type SimulationDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface SimulationScenario {
  id: string;
  category: SimulationCategory;
  categoryLabel: string;
  title: string;
  subtitle: string;
  description: string;
  targetRole: string;
  evaluatedSkill: string;
  skillsTested: string[];
  difficulty: SimulationDifficulty;
  personaName: string;
  personaRole: string;
  initialMessage: string;
  objectives: string[];
  keyRubrics: string[];
  expectedTurns: number;
}

export interface SimulationTurnMessage {
  role: 'assistant' | 'user';
  text: string;
  timestamp?: string;
}

export interface SimulationCreatePayload {
  promptRequest?: string;
  category?: SimulationCategory;
  targetRole?: string;
  skillGaps?: string[];
  difficulty?: SimulationDifficulty;
}

export interface SimulationCreateResponse {
  success: boolean;
  sessionId: string;
  scenario: SimulationScenario;
  initialMessage: string;
  state: 'initialized' | 'active';
  turnCount: number;
  maxTurns: number;
}

export interface SimulationRespondPayload {
  sessionId?: string;
  scenario?: SimulationScenario;
  history?: SimulationTurnMessage[];
  userMessage: string;
}

export interface SimulationRespondResponse {
  success: boolean;
  sessionId: string | null;
  reply: string;
  hint?: string | null;
  stageProgress: number;
  turnCount: number;
  suggestedFollowUp?: string;
  isCompleted?: boolean;
}

export interface SimulationRubricScores {
  technicalAccuracy: number;
  problemSolving: number;
  communication: number;
  composureUnderPressure: number;
}

export interface SimulationEvaluation {
  overallScore: number;
  verdict: string;
  rubricScores: SimulationRubricScores;
  strengths: string[];
  areasForImprovement: string[];
  skillInsights: string[];
  recommendedAction: string;
  roadmapSkillToUpdate: string;
}

export interface SimulationEvaluatePayload {
  sessionId?: string;
  scenario?: SimulationScenario;
  transcript: SimulationTurnMessage[];
}

export interface SimulationEvaluateResponse {
  success: boolean;
  sessionId: string | null;
  evaluation: SimulationEvaluation;
  verifiedCompetencyEarned: boolean;
  message?: string;
}
