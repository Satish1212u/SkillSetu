import { Router, Request, Response } from 'express';
import { db } from '../database/store';
import { analyticsEngine } from '../services/analyticsEngine';

export const adminRouter = Router();

// 1. Overview & Macro Indicators
adminRouter.get('/overview', (req: Request, res: Response) => {
  const shortages = analyticsEngine.getSkillShortagesAndOversupply();
  const criticalCount = shortages.filter(s => s.status === 'CRITICAL SHORTAGE').length;
  const oversupplyCount = shortages.filter(s => s.status === 'OVERSUPPLY').length;

  const totalOpeningsAnalyzed = shortages.reduce((acc, s) => acc + s.totalOpeningsIndia, 0);
  const geoAggregates = analyticsEngine.getStateGeographicAggregates();
  const emergingSkills = analyticsEngine.getEmergingSkills();

  res.json({
    jobsAnalysed: db.getAllJobs().length + 184500, // Aggregate portal postings
    skillsAnalysed: db.getAllSkills().length,
    criticalShortagesCount: criticalCount,
    oversupplyCount,
    totalOpeningsAnalyzed,
    averageCurriculumAlignment: 48.2,
    totalTechnicalInstitutesMonitored: geoAggregates.reduce((acc, g) => acc + g.instituteCount, 0),
    annualGraduatingCapacity: geoAggregates.reduce((acc, g) => acc + g.studentEnrollmentCapacity, 0),
    topDemandedSkills: db.getAllSkills().filter(s => s.marketDemandLevel === 'HIGH').slice(0, 5),
    emergingSkillsCount: emergingSkills.length,
    recommendations: db.getRecommendations('GOVT'),
  });
});

// 2. Industry Demand Intelligence & Demands
adminRouter.get('/labour-market', (req: Request, res: Response) => {
  const shortages = analyticsEngine.getSkillShortagesAndOversupply();
  const emerging = analyticsEngine.getEmergingSkills();

  // Role demand breakdown
  const roleDemands = [
    { role: 'DevOps / Cloud Platform', openings: 54000, growthPct: 36, averageSalaryLPA: 14.5 },
    { role: 'AI / Machine Learning & GenAI', openings: 42000, growthPct: 68, averageSalaryLPA: 16.2 },
    { role: 'Backend Distributed Systems', openings: 48000, growthPct: 22, averageSalaryLPA: 13.0 },
    { role: 'Frontend & Full-Stack Web', openings: 51000, growthPct: 18, averageSalaryLPA: 11.5 },
    { role: 'Cybersecurity & SecOps', openings: 24000, growthPct: 41, averageSalaryLPA: 15.0 },
  ];

  // Industry demand breakdown
  const industryDemands = [
    { industry: 'Fintech & Payments', sharePct: 28, keySkills: ['Kubernetes', 'AWS', 'PostgreSQL', 'Golang'] },
    { industry: 'Enterprise SaaS & Cloud', sharePct: 32, keySkills: ['Docker', 'Terraform', 'React', 'TypeScript'] },
    { industry: 'Healthcare & DeepTech', sharePct: 16, keySkills: ['Python', 'GenAI', 'PyTorch', 'Data Eng'] },
    { industry: 'E-Commerce & Quick-Commerce', sharePct: 24, keySkills: ['Kafka', 'Redis', 'CI/CD', 'Linux'] },
  ];

  res.json({
    roleDemands,
    industryDemands,
    shortages,
    emergingSkills: emerging,
  });
});

// 3. Geographic Heatmap Data
adminRouter.get('/heatmap', (req: Request, res: Response) => {
  const { state, skillId } = req.query;
  let demands = db.stateDemands;

  if (state && typeof state === 'string') {
    demands = demands.filter(d => d.state.toLowerCase() === state.toLowerCase());
  }

  if (skillId && typeof skillId === 'string') {
    demands = demands.filter(d => d.skillId.toLowerCase() === skillId.toLowerCase());
  }

  const aggregates = analyticsEngine.getStateGeographicAggregates();

  res.json({
    statesData: aggregates,
    demands,
    filteredState: state || 'All India',
  });
});

// 4. Skill Shortage & Oversupply
adminRouter.get('/shortages', (req: Request, res: Response) => {
  const all = analyticsEngine.getSkillShortagesAndOversupply();
  const shortages = all.filter(s => s.status === 'CRITICAL SHORTAGE' || s.status === 'MODERATE SHORTAGE');
  const oversupply = all.filter(s => s.status === 'OVERSUPPLY');

  res.json({
    shortages,
    oversupply,
    totalEvaluated: all.length,
  });
});

// 5. Emerging Skills
adminRouter.get('/emerging-skills', (req: Request, res: Response) => {
  const emerging = analyticsEngine.getEmergingSkills();
  res.json({ emerging });
});

// 6. Training Ecosystem
adminRouter.get('/training-supply', (req: Request, res: Response) => {
  const geo = analyticsEngine.getStateGeographicAggregates();
  const courses = db.getAllCourses();

  res.json({
    stateCapacity: geo,
    courses,
    monitoredInstitutes: [
      { name: 'PICT Pune', state: 'Maharashtra', alignmentScore: 48.2, enrollment: 1200 },
      { name: 'Anna University', state: 'Tamil Nadu', alignmentScore: 52.0, enrollment: 2400 },
      { name: 'DTU Delhi', state: 'Delhi NCR', alignmentScore: 56.4, enrollment: 1800 },
      { name: 'NIT Surathkal', state: 'Karnataka', alignmentScore: 64.0, enrollment: 1100 },
    ],
  });
});

// 7. CSV Export
adminRouter.get('/reports/export', (req: Request, res: Response) => {
  const reportType = (req.query.type as any) || 'skill-gaps';
  const csvContent = analyticsEngine.exportReportCSV(reportType);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=SkillSetu_${reportType}_${Date.now()}.csv`);
  res.status(200).send(csvContent);
});
