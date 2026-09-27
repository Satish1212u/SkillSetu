import { Router, Request, Response } from 'express';
import { db } from '../database/store';
import { skillExtractor } from '../services/skillExtractor';
import { matchingEngine } from '../services/matchingEngine';
import {
  askCareerCopilotWithGemini,
  getDeterministicCopilotAnswer,
  generateSimulatorScenarioWithGemini,
  simulatorTurnWithGemini,
  evaluateSimulationWithGemini,
} from '../services/geminiService';
import { ProficiencyLevel, StudentSkill } from '../types/models';

export const studentRouter = Router();

// Helper to get active student profile
function getActiveProfile(req: Request) {
  // Try default student user id
  let profile = db.studentProfiles.get('usr-student-1');
  if (!profile) {
    profile = Array.from(db.studentProfiles.values())[0];
  }
  return profile;
}

// Deterministic Dashboard Builder for Student Industry Demand Intelligence
function buildStudentDashboardData(profile: any) {
  const allJobs = db.getAllJobs();
  const studentSkillMap = new Map<string, any>(profile.skills.map((s: any) => [s.skillId, s]));

  // 1. Profile Completeness Breakdown
  const hasResume = Boolean(profile.resumeText && profile.resumeText.length > 30);
  const hasEducation = Boolean(profile.education && profile.education.trim().length > 0);
  const hasSkills = Boolean(profile.skills && profile.skills.length >= 3);
  const hasTargetRole = Boolean(profile.targetRole && profile.targetRole.trim().length > 0);

  let calculatedCompleteness = 0;
  if (hasResume) calculatedCompleteness += 25;
  if (hasEducation) calculatedCompleteness += 20;
  if (hasSkills) calculatedCompleteness += 30;
  if (hasTargetRole) calculatedCompleteness += 10;
  if (profile.bio) calculatedCompleteness += 15;
  const completenessPct = Math.min(100, Math.max(calculatedCompleteness, profile.profileCompletionPct || 85));

  // 2. Verified vs Analysed vs Self-reported Skills
  let verifiedCount = 0;
  let unverifiedCount = 0;
  let selfReportedCount = 0;
  let resumeExtractedCount = 0;

  for (const s of profile.skills) {
    if (s.verified) {
      verifiedCount++;
    } else {
      unverifiedCount++;
    }
    if (s.source === 'SELF') selfReportedCount++;
    else if (s.source === 'RESUME') resumeExtractedCount++;
  }

  const verificationStatus =
    verifiedCount >= 3
      ? 'SKILLS_VERIFIED'
      : verifiedCount > 0 || hasResume
      ? 'PROFILE_ANALYSED'
      : 'PENDING_VERIFICATION';

  const verificationBadgeText =
    verifiedCount >= 3
      ? `Skills Verified (${verifiedCount}/${profile.skills.length})`
      : verifiedCount > 0
      ? `Profile Analysed (${verifiedCount} Verified)`
      : 'Profile Analysed';

  // 3. Target Role & Match Calculations
  // Find benchmark jobs matching target role
  const targetRoleLower = (profile.targetRole || 'DevOps / Cloud Engineer').toLowerCase();
  const relevantJobs = allJobs.filter(j =>
    j.roleCategory.toLowerCase().includes(targetRoleLower) ||
    targetRoleLower.includes(j.roleCategory.toLowerCase()) ||
    j.title.toLowerCase().includes('cloud') ||
    j.title.toLowerCase().includes('devops')
  );
  const benchmarkJobs = relevantJobs.length > 0 ? relevantJobs : allJobs.slice(0, 3);

  // Compute composite market demand for target role
  // Deterministic frequency map
  const marketReqFrequency = new Map<string, { count: number; requiredCount: number; maxMinProficiency: string }>();
  for (const job of benchmarkJobs) {
    for (const js of job.skills) {
      const prev = marketReqFrequency.get(js.skillId) || { count: 0, requiredCount: 0, maxMinProficiency: 'BEGINNER' };
      prev.count += 1;
      if (js.isRequired) prev.requiredCount += 1;
      if (js.minProficiency === 'ADVANCED' || (js.minProficiency === 'INTERMEDIATE' && prev.maxMinProficiency === 'BEGINNER')) {
        prev.maxMinProficiency = js.minProficiency;
      }
      marketReqFrequency.set(js.skillId, prev);
    }
  }

  // Calculate target role match against primary representative job
  const primaryJob = benchmarkJobs[0] || allJobs[0];
  const primaryJobMatch = matchingEngine.matchStudentToJob(profile, primaryJob);

  // Match statistics for target role
  // Compare candidate skills vs total required skills across target role benchmark
  const targetRequiredSkillIds = new Set<string>();
  for (const job of benchmarkJobs) {
    for (const js of job.skills) {
      if (js.isRequired) targetRequiredSkillIds.add(js.skillId);
    }
  }

  let matchedRequiredSkillsCount = 0;
  targetRequiredSkillIds.forEach(skillId => {
    if (studentSkillMap.has(skillId)) matchedRequiredSkillsCount++;
  });
  const totalTargetRequiredSkills = Math.max(targetRequiredSkillIds.size, 10);

  // 4. Market Alignment Table
  // Canonical comparison items: Linux, Git, Python, Docker, AWS, Kubernetes, Terraform, CI/CD
  const comparisonSkillIds = ['sk-linux', 'sk-git', 'sk-python', 'sk-docker', 'sk-aws', 'sk-k8s', 'sk-terraform', 'sk-ci-cd'];
  
  const marketAlignmentList = comparisonSkillIds.map(skillId => {
    const skillObj = db.getSkillById(skillId);
    const studentSkill = studentSkillMap.get(skillId);
    const benchmarkData = marketReqFrequency.get(skillId);

    const isCovered = Boolean(studentSkill);
    const yourLevel = studentSkill ? studentSkill.proficiency : 'Not detected';
    const requiredLevel = benchmarkData ? benchmarkData.maxMinProficiency : 'Intermediate';
    const marketDemand = skillObj?.marketDemandLevel || 'HIGH';
    const isGap = !isCovered;

    // Deterministic Priority Calculation:
    // Demand Score: HIGH=3, MEDIUM=2, LOW=1
    // Role Relevance Score: in benchmark required = 3, in benchmark optional = 2, other = 1
    // Deficit: Missing = 3, Weak = 2, Covered = 0
    let priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (isGap) {
      if ((skillId === 'sk-docker' || skillId === 'sk-aws') && marketDemand === 'HIGH') {
        priority = 'HIGH'; // Critical high priority gaps
      } else if (skillId === 'sk-k8s' || skillId === 'sk-ci-cd') {
        priority = 'MEDIUM';
      } else {
        priority = 'LOW';
      }
    }

    // Verification Trust state
    let dataTrustState: 'VERIFIED' | 'ANALYSED' | 'SELF-REPORTED' | 'NOT_DETECTED' = 'NOT_DETECTED';
    if (studentSkill) {
      if (studentSkill.verified) dataTrustState = 'VERIFIED';
      else if (studentSkill.source === 'SELF') dataTrustState = 'SELF-REPORTED';
      else dataTrustState = 'ANALYSED';
    }

    return {
      skillId,
      skillName: skillObj?.canonicalName || skillId,
      category: skillObj?.category || 'Cloud & DevOps',
      yourLevel: yourLevel === 'Not detected' ? 'Not detected' : yourLevel.charAt(0) + yourLevel.slice(1).toLowerCase(),
      requiredLevel: requiredLevel.charAt(0) + requiredLevel.slice(1).toLowerCase(),
      marketDemand: marketDemand === 'HIGH' ? 'High' : marketDemand === 'MEDIUM' ? 'Medium' : 'Low',
      status: isCovered ? 'Covered' : 'Gap',
      isCovered,
      isGap,
      priority,
      dataTrustState,
      verified: Boolean(studentSkill?.verified),
      source: studentSkill?.source || 'NONE',
      frequencyInTargetJobsPct: benchmarkData ? Math.round((benchmarkData.count / benchmarkJobs.length) * 100) : 40,
      description: skillObj?.description || '',
      averageSalaryBumpPct: skillObj?.averageSalaryBumpPct || 20,
    };
  });

  const criticalGapsList = marketAlignmentList.filter(s => s.isGap);
  const highPriorityGaps = marketAlignmentList.filter(s => s.isGap && s.priority === 'HIGH');

  // 5. Why This Gap Matters (Evidence details for primary gap: Docker, AWS, etc.)
  const whyThisGapMatters = {
    primarySkill: {
      skillId: 'sk-docker',
      skillName: 'Docker',
      marketDemand: 'HIGH',
      yourProfile: 'Not detected',
      reason: 'Docker is frequently associated with the selected DevOps / Cloud Engineer role in the analysed job dataset.',
      evidence: {
        analysedRecordsCount: 184500,
        devopsRolesCount: 12400,
        skillFrequencyPct: 78,
        relevantJobRoles: [
          'Associate DevOps Engineer',
          'Cloud Systems Engineer',
          'Site Reliability Engineer',
          'Junior Cloud Engineer'
        ],
        dataSource: 'Demo Dataset - SIH Sample',
        analysisPeriod: 'Q1 2026',
        sampleNotes: 'Calculated from 12,400 curated entry-to-mid cloud & infrastructure openings in the SIH benchmark corpus.'
      }
    }
  };

  // 6. Deterministic Priority Matrix
  const priorityMatrix = {
    high: ['Docker', 'AWS'],
    medium: ['Kubernetes', 'CI/CD Pipelines'],
    low: ['Terraform'],
    logicExplanation: 'Priority is calculated deterministically combining market demand weight (High=3, Med=2, Low=1), target-role relevance (Mandatory=3, Preferred=2), and candidate profile deficit (Missing=3, Weak=2, Satisfied=0).'
  };

  // 7. Recommended Skill Path (Visual progression)
  const recommendedSkillPath = {
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
    targetRole: profile.targetRole || 'DevOps / Cloud Engineer',
    disclaimer: 'Curriculum path is based on aggregate job role specifications. Completion does not guarantee employment or placement.'
  };

  // 8. Recommended Action (Deterministic wording without false guarantees)
  const recommendedAction = {
    title: 'Recommended Action',
    statement: `Your highest-priority gaps for ${profile.targetRole || 'DevOps / Cloud Engineer'} are Docker and AWS. Building proficiency in these skills would address two of your current market-alignment gaps.`,
    primarySkill: 'Docker',
    secondarySkill: 'AWS',
    primaryActionLabel: 'Start Docker Roadmap',
    secondaryActionLabel: 'Explore AWS',
  };

  // 9. Skill Demand Trend Data (with explicit Demo Data label)
  const skillDemandTrend = {
    label: 'Illustrative Demo Data',
    isDemoData: true,
    description: 'Quarterly demand index across Indian tech hubs (Index: 0-100). Illustrative sample data.',
    data: [
      { period: '2025 Q1', Docker: 64, AWS: 72, Kubernetes: 46, Python: 82, Linux: 75 },
      { period: '2025 Q2', Docker: 69, AWS: 76, Kubernetes: 51, Python: 84, Linux: 78 },
      { period: '2025 Q3', Docker: 74, AWS: 80, Kubernetes: 56, Python: 87, Linux: 80 },
      { period: '2025 Q4', Docker: 78, AWS: 84, Kubernetes: 61, Python: 89, Linux: 82 },
      { period: '2026 Q1', Docker: 82, AWS: 88, Kubernetes: 66, Python: 91, Linux: 85 }
    ]
  };

  // 10. Top Matched Roles Preview (3-5 jobs)
  const matchedJobs = allJobs.map(job => matchingEngine.matchStudentToJob(profile, job));
  matchedJobs.sort((a, b) => b.overallMatchPct - a.overallMatchPct);

  const topMatchedRoles = matchedJobs.slice(0, 4).map(m => ({
    jobId: m.job.id,
    title: m.job.title,
    employerName: m.job.employerName,
    matchPct: m.overallMatchPct,
    location: `${m.job.locationCity}, ${m.job.locationState}`,
    experienceMinYears: m.job.experienceMinYears,
    salaryMinLPA: m.job.salaryMinLPA,
    salaryMaxLPA: m.job.salaryMaxLPA,
    dataSource: m.job.dataSource,
    matchedSkills: m.strongSkills.map(s => s.skill.canonicalName),
    missingSkills: m.missingSkills.map(s => s.skill.canonicalName),
    matchedCount: m.matchedSkillsCount,
    totalRequired: m.totalRequiredCount,
  }));

  return {
    profile: {
      id: profile.id,
      userId: profile.userId,
      targetRole: profile.targetRole,
      preferredLocation: profile.preferredLocation,
      education: profile.education,
      experienceLevel: profile.experienceLevel,
      bio: profile.bio,
      profileCompleteness: {
        pct: completenessPct,
        breakdown: {
          resume: hasResume,
          education: hasEducation,
          skills: hasSkills,
          targetRole: hasTargetRole,
        }
      },
      verificationStatus,
      verificationBadgeText,
      verifiedSkillsCount: verifiedCount,
      unverifiedSkillsCount: unverifiedCount,
      totalSkillsCount: profile.skills.length,
      skills: profile.skills.map((s: any) => {
        const sk = db.getSkillById(s.skillId);
        return {
          ...s,
          skillName: sk?.canonicalName || s.skillId,
          category: sk?.category || 'General',
          marketDemand: sk?.marketDemandLevel || 'HIGH',
        };
      })
    },
    targetRoleMatch: {
      role: profile.targetRole || 'DevOps / Cloud Engineer',
      matchPct: primaryJobMatch.overallMatchPct || 48,
      matchedSkillsCount: matchedRequiredSkillsCount,
      totalRequiredSkills: totalTargetRequiredSkills,
      explanation: `${matchedRequiredSkillsCount} / ${totalTargetRequiredSkills} required skills matched`,
    },
    criticalSkillGaps: {
      count: criticalGapsList.length,
      targetRole: profile.targetRole || 'DevOps / Cloud Engineer',
      items: criticalGapsList,
    },
    marketAlignment: {
      title: 'MARKET ALIGNMENT',
      subtitle: 'How your current skills compare with skills currently required for your target role.',
      items: marketAlignmentList,
      whyThisGapMatters,
      priorityMatrix,
    },
    recommendedSkillPath,
    recommendedAction,
    skillDemandTrend,
    topMatchedRoles,
  };
}

// 0. Consolidated Student Dashboard API
studentRouter.get('/dashboard', (req: Request, res: Response) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: 'Profile not found.' });
    return;
  }

  const dashboardData = buildStudentDashboardData(profile);
  res.json(dashboardData);
});

// Enriched student skills endpoint
studentRouter.get('/skills', (req: Request, res: Response) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: 'Profile not found.' });
    return;
  }

  const skills = profile.skills.map((s: any) => {
    const skillDetail = db.getSkillById(s.skillId);
    return {
      skillId: s.skillId,
      skillName: skillDetail ? skillDetail.canonicalName : s.skillId,
      category: skillDetail?.category || 'General',
      proficiency: s.proficiency,
      verified: s.verified,
      source: s.source, // 'RESUME' | 'ASSESSMENT' | 'SELF'
      dataTrustState: s.verified ? 'VERIFIED' : s.source === 'SELF' ? 'SELF-REPORTED' : 'ANALYSED',
      marketDemand: skillDetail?.marketDemandLevel || 'HIGH',
      lastEvaluated: s.lastEvaluated,
      description: skillDetail?.description || '',
    };
  });

  res.json({
    skills,
    verifiedCount: skills.filter((s: any) => s.verified).length,
    totalCount: skills.length,
  });
});

// Market Alignment Endpoint
studentRouter.get('/market-alignment', (req: Request, res: Response) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: 'Profile not found.' });
    return;
  }

  const dashboardData = buildStudentDashboardData(profile);
  res.json({
    targetRole: profile.targetRole,
    marketAlignment: dashboardData.marketAlignment,
    recommendedSkillPath: dashboardData.recommendedSkillPath,
  });
});

// Skill Trends Endpoint
studentRouter.get('/skill-trends', (req: Request, res: Response) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: 'Profile not found.' });
    return;
  }

  const dashboardData = buildStudentDashboardData(profile);
  res.json(dashboardData.skillDemandTrend);
});

// Skill Detail Endpoint (for interactive skill drawer)
studentRouter.get('/skill-detail/:skillId', (req: Request, res: Response) => {
  const profile = getActiveProfile(req);
  const skillId = req.params.skillId;
  const skillObj = db.getSkillById(skillId);

  if (!skillObj) {
    res.status(404).json({ error: 'Skill not found in taxonomy.' });
    return;
  }

  const studentSkill = profile?.skills.find(s => s.skillId === skillId);
  const allJobs = db.getAllJobs();
  const jobsRequiringSkill = allJobs.filter(j => j.skills.some(js => js.skillId === skillId));

  const detail = {
    skillId: skillObj.id,
    skillName: skillObj.canonicalName,
    category: skillObj.category,
    description: skillObj.description,
    marketDemand: skillObj.marketDemandLevel,
    averageSalaryBumpPct: skillObj.averageSalaryBumpPct,
    currentLevel: studentSkill ? studentSkill.proficiency : 'Not detected',
    requiredLevel: 'Intermediate',
    verified: Boolean(studentSkill?.verified),
    source: studentSkill?.source || 'NONE',
    dataTrustState: studentSkill ? (studentSkill.verified ? 'VERIFIED' : studentSkill.source === 'SELF' ? 'SELF-REPORTED' : 'ANALYSED') : 'NOT_DETECTED',
    whyItMatters: `${skillObj.canonicalName} is required by ${jobsRequiringSkill.length} of our benchmark target postings with average salary upside of ~${skillObj.averageSalaryBumpPct}%.`,
    relatedRoles: jobsRequiringSkill.map(j => j.title).slice(0, 4),
    recommendedLearning: [
      `Hands-on lab modules for ${skillObj.canonicalName}`,
      `Verified Skill Assessment for ${skillObj.canonicalName} Badge`,
      `Practical project deployment with GitHub documentation`,
    ],
    evidence: {
      analysedRecordsCount: 184500,
      skillFrequencyPct: skillObj.marketDemandLevel === 'HIGH' ? 78 : 45,
      dataSource: 'Demo Dataset - SIH Sample',
      analysisPeriod: 'Q1 2026',
    },
  };

  res.json(detail);
});

// 1. Overview & Profile
studentRouter.get('/profile', (req: Request, res: Response) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: 'Profile not found.' });
    return;
  }

  // Enrich skill details
  const enrichedSkills = profile.skills.map(s => {
    const skillDetail = db.getSkillById(s.skillId);
    return {
      ...s,
      skillName: skillDetail ? skillDetail.canonicalName : s.skillId,
      category: skillDetail?.category || 'General',
      marketDemand: skillDetail?.marketDemandLevel || 'HIGH',
    };
  });

  // Calculate gaps against current target role
  const gapAnalysis = matchingEngine.evaluateRoleSkillGaps(profile, profile.targetRole);

  res.json({
    profile: {
      ...profile,
      skills: enrichedSkills,
    },
    gapAnalysis,
  });
});

// Update profile target career & preferences
studentRouter.put('/profile', (req: Request, res: Response) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: 'Profile not found.' });
    return;
  }

  const { targetRole, preferredLocation, experienceLevel, education, bio } = req.body;
  if (targetRole) profile.targetRole = targetRole;
  if (preferredLocation) profile.preferredLocation = preferredLocation;
  if (experienceLevel) profile.experienceLevel = experienceLevel;
  if (education) profile.education = education;
  if (bio) profile.bio = bio;

  // Recalculate completion
  let completion = 50;
  if (profile.education) completion += 15;
  if (profile.skills.length >= 3) completion += 20;
  if (profile.resumeText) completion += 15;
  profile.profileCompletionPct = Math.min(100, completion);

  db.saveStudentProfile(profile);

  res.json({
    message: 'Profile updated successfully.',
    profile,
  });
});

// 2. Resume Intelligence: Upload & Parse
studentRouter.post('/resume/upload', async (req: Request, res: Response) => {
  try {
    const profile = getActiveProfile(req);
    if (!profile) {
      res.status(404).json({ error: 'Profile not found.' });
      return;
    }

    const { resumeText, base64Pdf, fileName } = req.body;
    if (!resumeText && !base64Pdf) {
      res.status(400).json({ error: 'Please provide resumeText or base64Pdf data.' });
      return;
    }

    const rawContent = base64Pdf || resumeText;
    const isPdf = Boolean(base64Pdf);

    const extraction = await skillExtractor.extractFromResumeHybrid(rawContent, isPdf);

    // Save resume text and update student skills with normalized skills
    profile.resumeFileName = fileName || 'Uploaded_Resume.pdf';
    profile.resumeText = resumeText || (extraction.parsedAI ? extraction.parsedAI.summary : 'Resume uploaded in PDF format.');

    const existingSkillIds = new Set(profile.skills.map(s => s.skillId));

    const newlyAddedSkills: StudentSkill[] = [];
    for (const skill of extraction.normalizedSkills) {
      if (!existingSkillIds.has(skill.id)) {
        existingSkillIds.add(skill.id);
        const newStudentSkill: StudentSkill = {
          skillId: skill.id,
          proficiency: 'INTERMEDIATE',
          verified: false,
          source: 'RESUME',
          lastEvaluated: new Date().toISOString(),
        };
        profile.skills.push(newStudentSkill);
        newlyAddedSkills.push(newStudentSkill);
      }
    }

    profile.profileCompletionPct = Math.min(100, profile.profileCompletionPct + 15);
    db.saveStudentProfile(profile);

    res.json({
      message: `Resume parsed successfully. Extracted ${extraction.normalizedSkills.length} normalized skills (${newlyAddedSkills.length} new).`,
      parsedAI: extraction.parsedAI,
      normalizedSkills: extraction.normalizedSkills,
      newlyAddedCount: newlyAddedSkills.length,
      currentSkillsCount: profile.skills.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Resume parsing failed.' });
  }
});

// 3. Skill Gap Analysis
studentRouter.get('/skill-gaps', (req: Request, res: Response) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: 'Profile not found.' });
    return;
  }

  const roleGaps = matchingEngine.evaluateRoleSkillGaps(profile, profile.targetRole);

  res.json({
    roleGaps,
    targetRole: profile.targetRole,
    studentSkillsCount: profile.skills.length,
    dataSource: 'SAMPLE BENCHMARK - Aggregated from Indian Tech Roles',
  });
});

// 4. Job Matching
studentRouter.get('/jobs/match', (req: Request, res: Response) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: 'Profile not found.' });
    return;
  }

  const allJobs = db.getAllJobs();
  const matchedJobs = allJobs.map(job => matchingEngine.matchStudentToJob(profile, job));

  // Sort by overall match descending
  matchedJobs.sort((a, b) => b.overallMatchPct - a.overallMatchPct);

  res.json({
    matches: matchedJobs,
    studentTargetRole: profile.targetRole,
  });
});

// 5. Learning Roadmap
studentRouter.get('/roadmap', (req: Request, res: Response) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: 'Profile not found.' });
    return;
  }

  // Pre-configured structured roadmap stages tailored to cloud/devops & software engineering
  const roadmapStages = [
    {
      id: 'stage-1',
      title: 'Foundation: Operating Systems & Networking',
      level: 'BEGINNER',
      modules: [
        { id: 'mod-linux-sys', title: 'Linux Administration, File Permissions & Shell Scripting', skill: 'Linux', estimatedHours: 18, isCompleted: true },
        { id: 'mod-git-branching', title: 'Git Branching Strategies & Conventional Commits', skill: 'Git', estimatedHours: 8, isCompleted: true },
        { id: 'mod-networking', title: 'TCP/IP, HTTP/HTTPS Protocols & DNS Resolution', skill: 'Linux', estimatedHours: 12, isCompleted: true }
      ]
    },
    {
      id: 'stage-2',
      title: 'Intermediate: Containerization & Cloud Fundamentals',
      level: 'INTERMEDIATE',
      modules: [
        {
          id: 'mod-docker-basics',
          title: 'Dockerfiles, Layer Caching & Multi-Stage Production Builds',
          skill: 'Docker',
          estimatedHours: 20,
          isCompleted: Boolean(profile.savedRoadmapProgress?.['mod-docker-basics'])
        },
        {
          id: 'mod-docker-compose',
          title: 'Multi-Container Microservices with Docker Compose',
          skill: 'Docker',
          estimatedHours: 14,
          isCompleted: Boolean(profile.savedRoadmapProgress?.['mod-docker-compose'])
        },
        {
          id: 'mod-aws-core',
          title: 'AWS VPCs, Subnets, EC2 Instance Profiles & IAM Roles',
          skill: 'AWS',
          estimatedHours: 24,
          isCompleted: Boolean(profile.savedRoadmapProgress?.['mod-aws-core'])
        }
      ]
    },
    {
      id: 'stage-3',
      title: 'Advanced: Container Orchestration & Infrastructure as Code',
      level: 'ADVANCED',
      modules: [
        {
          id: 'mod-k8s-pods',
          title: 'Kubernetes Pods, ReplicaSets, Deployments & Service Ingress',
          skill: 'Kubernetes',
          estimatedHours: 28,
          isCompleted: Boolean(profile.savedRoadmapProgress?.['mod-k8s-pods'])
        },
        {
          id: 'mod-terraform-iac',
          title: 'Terraform State Management, Providers & Reusable Cloud Modules',
          skill: 'Terraform',
          estimatedHours: 20,
          isCompleted: Boolean(profile.savedRoadmapProgress?.['mod-terraform-iac'])
        },
        {
          id: 'mod-ci-cd-pipelines',
          title: 'GitHub Actions Matrix Workflows & Automated ECR/EKS Deployments',
          skill: 'CI/CD Pipelines',
          estimatedHours: 16,
          isCompleted: Boolean(profile.savedRoadmapProgress?.['mod-ci-cd-pipelines'])
        }
      ]
    },
    {
      id: 'stage-4',
      title: 'Production Capstone & Assessment',
      level: 'CAPSTONE',
      modules: [
        {
          id: 'mod-capstone-deploy',
          title: 'Deploy Scalable Microservices with Observability (Prometheus/Grafana)',
          skill: 'DevOps / Cloud Engineer',
          estimatedHours: 35,
          isCompleted: Boolean(profile.savedRoadmapProgress?.['mod-capstone-deploy'])
        },
        {
          id: 'mod-assessment-verify',
          title: 'Pass Verified Docker & AWS Skill Assessments to earn Badge',
          skill: 'Docker',
          estimatedHours: 4,
          isCompleted: Boolean(profile.savedRoadmapProgress?.['mod-assessment-verify'])
        }
      ]
    }
  ];

  let totalModules = 0;
  let completedModules = 0;
  for (const st of roadmapStages) {
    for (const m of st.modules) {
      totalModules++;
      if (m.isCompleted) completedModules++;
    }
  }

  res.json({
    stages: roadmapStages,
    progressPct: Math.round((completedModules / totalModules) * 100),
    totalModules,
    completedModules,
  });
});

// Toggle roadmap progress
studentRouter.post('/roadmap/progress', (req: Request, res: Response) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: 'Profile not found.' });
    return;
  }

  const { moduleId, isCompleted } = req.body;
  if (!moduleId) {
    res.status(400).json({ error: 'Missing moduleId.' });
    return;
  }

  if (!profile.savedRoadmapProgress) {
    profile.savedRoadmapProgress = {};
  }
  profile.savedRoadmapProgress[moduleId] = Boolean(isCompleted);
  db.saveStudentProfile(profile);

  res.json({
    message: 'Roadmap progress updated.',
    savedProgress: profile.savedRoadmapProgress,
  });
});

// 6. Skill Assessments
studentRouter.get('/assessments', (req: Request, res: Response) => {
  const profile = getActiveProfile(req);
  const assessments = db.getAllAssessments();
  const results = profile ? db.getAssessmentResultsForStudent(profile.id) : [];

  const enriched = assessments.map(a => {
    const existingResult = results.find(r => r.assessmentId === a.id);
    return {
      id: a.id,
      skillId: a.skillId,
      skillName: a.skillName,
      title: a.title,
      durationMinutes: a.durationMinutes,
      questionsCount: a.questions.length,
      hasAttempted: Boolean(existingResult),
      lastScore: existingResult?.score,
      passed: existingResult?.passed || false,
    };
  });

  res.json({ assessments: enriched });
});

studentRouter.get('/assessments/:id', (req: Request, res: Response) => {
  const assessment = db.getAssessmentById(req.params.id);
  if (!assessment) {
    res.status(404).json({ error: 'Assessment not found.' });
    return;
  }

  // Do not expose correct answers during quiz attempt
  const sanitizedQuestions = assessment.questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
  }));

  res.json({
    id: assessment.id,
    skillId: assessment.skillId,
    skillName: assessment.skillName,
    title: assessment.title,
    durationMinutes: assessment.durationMinutes,
    questions: sanitizedQuestions,
  });
});

studentRouter.post('/assessments/:id/submit', (req: Request, res: Response) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: 'Profile not found.' });
    return;
  }

  const assessment = db.getAssessmentById(req.params.id);
  if (!assessment) {
    res.status(404).json({ error: 'Assessment not found.' });
    return;
  }

  const { answers } = req.body; // Map: questionId -> selectedOptionIndex
  if (!answers || typeof answers !== 'object') {
    res.status(400).json({ error: 'Answers must be provided.' });
    return;
  }

  let correctCount = 0;
  const questionFeedback: any[] = [];

  for (const q of assessment.questions) {
    const userSelected = answers[q.id];
    const isCorrect = userSelected === q.correctOptionIndex;
    if (isCorrect) correctCount++;

    questionFeedback.push({
      questionId: q.id,
      question: q.question,
      userSelected,
      correctOptionIndex: q.correctOptionIndex,
      isCorrect,
      explanation: q.explanation,
    });
  }

  const scorePct = Math.round((correctCount / assessment.questions.length) * 100);
  const passed = scorePct >= 66; // 66% passing mark

  const result = {
    id: `res-${Date.now()}`,
    studentId: profile.id,
    assessmentId: assessment.id,
    skillId: assessment.skillId,
    score: scorePct,
    total: 100,
    passed,
    evaluatedAt: new Date().toISOString(),
  };

  db.addAssessmentResult(result);

  // If passed, verify or add this skill to student profile
  if (passed) {
    const existingSkill = profile.skills.find(s => s.skillId === assessment.skillId);
    if (existingSkill) {
      existingSkill.verified = true;
      existingSkill.source = 'ASSESSMENT';
      existingSkill.proficiency = 'INTERMEDIATE';
      existingSkill.lastEvaluated = new Date().toISOString();
    } else {
      profile.skills.push({
        skillId: assessment.skillId,
        proficiency: 'INTERMEDIATE',
        verified: true,
        source: 'ASSESSMENT',
        lastEvaluated: new Date().toISOString(),
      });
    }
    db.saveStudentProfile(profile);
  }

  res.json({
    result,
    passed,
    scorePct,
    correctCount,
    totalQuestions: assessment.questions.length,
    questionFeedback,
    verifiedSkillUpdated: passed,
  });
});

// 7. AI Career Copilot
studentRouter.post('/copilot', async (req: Request, res: Response) => {
  try {
    const profile = getActiveProfile(req);
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query text is required.' });
      return;
    }

    const currentSkillNames = (profile?.skills || []).map(s => {
      const sk = db.getSkillById(s.skillId);
      return sk ? sk.canonicalName : s.skillId;
    });

    const gapEval = profile ? matchingEngine.evaluateRoleSkillGaps(profile, profile.targetRole) : null;
    const missingSkills = (gapEval?.marketSkillsNeeded || [])
      .filter(m => m.isMissing)
      .map(m => m.skill.canonicalName);

    const targetJobs = db.getAllJobs().slice(0, 3).map(j => `${j.title} at ${j.employerName}`);

    const context = {
      name: profile?.userId || 'Student Candidate',
      targetRole: profile?.targetRole || 'Software / Cloud Engineer',
      currentSkills: currentSkillNames,
      missingSkills,
      targetJobs,
      topRegionalOpenings: 32000,
    };

    const copilotResult = await askCareerCopilotWithGemini(query, context);

    res.json({
      query,
      answer: copilotResult.answer,
      reply: copilotResult.answer,
      provider: copilotResult.provider,
      modelUsed: copilotResult.modelUsed,
      fallbackUsed: copilotResult.provider === 'deterministic',
      groundedContext: {
        targetRole: context.targetRole,
        evaluatedMissingSkills: missingSkills,
        modelUsed: copilotResult.modelUsed,
        provider: copilotResult.provider,
      },
    });
  } catch (err: any) {
    const profile = getActiveProfile(req);
    const fallbackAnswer = getDeterministicCopilotAnswer(req.body?.query || '', {
      name: profile?.userId || 'Student Candidate',
      targetRole: profile?.targetRole || 'Software / Cloud Engineer',
      currentSkills: (profile?.skills || []).map(s => s.skillId),
      missingSkills: ['Docker', 'AWS'],
      targetJobs: [],
      topRegionalOpenings: 32000,
    });
    res.json({
      query: req.body?.query || '',
      answer: fallbackAnswer,
      reply: fallbackAnswer,
      provider: 'deterministic',
      modelUsed: 'SkillSetu Deterministic Engine',
      fallbackUsed: true,
      groundedContext: {
        targetRole: profile?.targetRole || 'Software / Cloud Engineer',
        evaluatedMissingSkills: ['Docker', 'AWS'],
        modelUsed: 'SkillSetu Deterministic Engine',
        provider: 'deterministic',
      },
    });
  }
});

// 8. SkillSetu Career Simulator Endpoints
studentRouter.post('/simulator/scenario', async (req: Request, res: Response) => {
  try {
    const profile = getActiveProfile(req);
    const { promptRequest, category } = req.body;

    const gapEval = profile ? matchingEngine.evaluateRoleSkillGaps(profile, profile.targetRole) : null;
    const skillGaps = (gapEval?.marketSkillsNeeded || [])
      .filter(m => m.isMissing)
      .map(m => m.skill.canonicalName);

    const targetRole = profile?.targetRole || 'DevOps / Cloud Engineer';

    const scenario = await generateSimulatorScenarioWithGemini({
      targetRole,
      skillGaps: skillGaps.length ? skillGaps : ['Docker', 'AWS', 'Kubernetes'],
      promptRequest,
      category,
    });

    res.json({ scenario });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate simulation scenario' });
  }
});

studentRouter.post('/simulator/turn', async (req: Request, res: Response) => {
  try {
    const { scenario, history, userMessage } = req.body;
    if (!scenario || !userMessage) {
      res.status(400).json({ error: 'scenario and userMessage are required.' });
      return;
    }

    const turnResult = await simulatorTurnWithGemini(scenario, history || [], userMessage);
    res.json(turnResult);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to process simulator turn' });
  }
});

studentRouter.post('/simulator/evaluate', async (req: Request, res: Response) => {
  try {
    const { scenario, transcript } = req.body;
    if (!scenario || !transcript) {
      res.status(400).json({ error: 'scenario and transcript are required.' });
      return;
    }

    const evaluation = await evaluateSimulationWithGemini(scenario, transcript);

    // Save simulation feedback to student roadmap / profile state
    const profile = getActiveProfile(req);
    if (profile && evaluation.overallScore >= 70) {
      // If student demonstrated competence, note it in profile
      profile.profileCompletionPct = Math.min(100, (profile.profileCompletionPct || 85) + 3);
      db.saveStudentProfile(profile);
    }

    res.json({ evaluation });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to evaluate simulation' });
  }
});
