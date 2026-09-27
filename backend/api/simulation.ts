import { Router, Request, Response } from 'express';
import { db } from '../database/store';
import { matchingEngine } from '../services/matchingEngine';
import {
  generateSimulatorScenarioWithGemini,
  simulatorTurnWithGemini,
  evaluateSimulationWithGemini,
  SimulatorScenario,
  SimulatorEvaluation,
} from '../services/geminiService';

export const simulationRouter = Router();

// In-memory simulation session cache for conversational persistence
interface SimulationSessionRecord {
  sessionId: string;
  scenario: SimulatorScenario;
  transcript: { role: 'assistant' | 'user'; text: string; timestamp: string }[];
  turnCount: number;
  maxTurns: number;
  stageProgress: number;
  createdAt: string;
  updatedAt: string;
  isCompleted: boolean;
  evaluation?: SimulatorEvaluation;
}

const activeSessions = new Map<string, SimulationSessionRecord>();

function getActiveStudent(req: Request) {
  let profile = db.studentProfiles.get('usr-student-1');
  if (!profile) {
    profile = Array.from(db.studentProfiles.values())[0];
  }
  return profile;
}

/**
 * POST /simulation/create (or /api/simulation/create)
 * Initializes a structured simulation scenario tailored to student's target role, skill gaps, or custom intent.
 */
simulationRouter.post('/create', async (req: Request, res: Response) => {
  try {
    const profile = getActiveStudent(req);
    const {
      promptRequest,
      category = 'incident',
      targetRole: requestedRole,
      skillGaps: requestedGaps,
      difficulty = 'Intermediate',
    } = req.body;

    const gapEval = profile ? matchingEngine.evaluateRoleSkillGaps(profile, profile.targetRole) : null;
    const detectedGaps = (gapEval?.marketSkillsNeeded || [])
      .filter(m => m.isMissing)
      .map(m => m.skill.canonicalName);

    const targetRole = requestedRole || profile?.targetRole || 'DevOps / Cloud Engineer';
    const skillGaps = (requestedGaps && requestedGaps.length > 0)
      ? requestedGaps
      : (detectedGaps.length > 0 ? detectedGaps : ['Docker', 'AWS', 'Kubernetes']);

    const scenario = await generateSimulatorScenarioWithGemini({
      targetRole,
      skillGaps,
      promptRequest,
      category,
    });

    if (difficulty && scenario) {
      scenario.difficulty = difficulty;
    }

    const sessionId = `sim-sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const sessionRecord: SimulationSessionRecord = {
      sessionId,
      scenario,
      transcript: [
        {
          role: 'assistant',
          text: scenario.initialMessage,
          timestamp: new Date().toISOString(),
        },
      ],
      turnCount: 0,
      maxTurns: scenario.expectedTurns || 4,
      stageProgress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCompleted: false,
    };

    activeSessions.set(sessionId, sessionRecord);

    res.status(201).json({
      success: true,
      sessionId,
      scenario,
      initialMessage: scenario.initialMessage,
      state: 'initialized',
      turnCount: 0,
      maxTurns: sessionRecord.maxTurns,
    });
  } catch (err: any) {
    console.error('Error in /simulation/create:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to initialize simulation session',
    });
  }
});

/**
 * POST /simulation/respond (or /api/simulation/respond)
 * Handles multi-turn conversational responses, dynamic persona reactions, hints, and phase progress.
 */
simulationRouter.post('/respond', async (req: Request, res: Response) => {
  try {
    const { sessionId, scenario: passedScenario, history: passedHistory, userMessage } = req.body;

    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      res.status(400).json({ success: false, error: 'userMessage text is required' });
      return;
    }

    const session = sessionId ? activeSessions.get(sessionId) : null;
    const scenario = passedScenario || session?.scenario;

    if (!scenario) {
      res.status(400).json({ success: false, error: 'Simulation scenario context is required' });
      return;
    }

    // Build history from session or passed array
    const historyToUse = passedHistory || session?.transcript || [];
    const formattedHistory = historyToUse.map((h: any) => ({
      role: (h.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      text: h.text || h.content || '',
    }));

    const turnResult = await simulatorTurnWithGemini(scenario, formattedHistory, userMessage.trim());

    const updatedTurnCount =
      (session
        ? session.turnCount
        : formattedHistory.filter((h: { role: string; text: string }) => h.role === 'user').length) + 1;
    const isCompleted = updatedTurnCount >= (scenario.expectedTurns || 4);

    if (session) {
      session.transcript.push({
        role: 'user',
        text: userMessage.trim(),
        timestamp: new Date().toISOString(),
      });
      session.transcript.push({
        role: 'assistant',
        text: turnResult.reply,
        timestamp: new Date().toISOString(),
      });
      session.turnCount = updatedTurnCount;
      session.stageProgress = turnResult.stageProgress;
      session.isCompleted = isCompleted;
      session.updatedAt = new Date().toISOString();
    }

    res.json({
      success: true,
      sessionId: sessionId || null,
      reply: turnResult.reply,
      hint: turnResult.hint || null,
      stageProgress: turnResult.stageProgress,
      turnCount: updatedTurnCount,
      suggestedFollowUp: turnResult.suggestedFollowUp,
      isCompleted,
    });
  } catch (err: any) {
    console.error('Error in /simulation/respond:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to process simulation turn',
    });
  }
});

/**
 * POST /simulation/evaluate (or /api/simulation/evaluate)
 * Evaluates the full transcript against professional rubrics and provides structured feedback.
 */
simulationRouter.post('/evaluate', async (req: Request, res: Response) => {
  try {
    const { sessionId, scenario: passedScenario, transcript: passedTranscript } = req.body;
    const session = sessionId ? activeSessions.get(sessionId) : null;

    const scenario = passedScenario || session?.scenario;
    const transcript = passedTranscript || session?.transcript;

    if (!scenario || !transcript || !Array.isArray(transcript)) {
      res.status(400).json({
        success: false,
        error: 'Both scenario and a valid transcript array are required for evaluation',
      });
      return;
    }

    const evaluation = await evaluateSimulationWithGemini(scenario, transcript);

    // Save evaluation to student database profile
    const profile = getActiveStudent(req);
    let verifiedCompetencyEarned = false;

    if (profile && evaluation.overallScore >= 70) {
      verifiedCompetencyEarned = true;
      profile.profileCompletionPct = Math.min(100, (profile.profileCompletionPct || 85) + 3);

      // Verify or strengthen the target skill in the candidate's profile
      const targetSkillObj = Array.from(db.skills.values()).find(
        s => s.canonicalName.toLowerCase() === scenario.evaluatedSkill.toLowerCase()
      );

      if (targetSkillObj) {
        const existingSkill = profile.skills.find(s => s.skillId === targetSkillObj.id);
        if (existingSkill) {
          existingSkill.verified = true;
          existingSkill.source = 'ASSESSMENT';
          existingSkill.lastEvaluated = new Date().toISOString();
        } else {
          profile.skills.push({
            skillId: targetSkillObj.id,
            proficiency: 'INTERMEDIATE',
            verified: true,
            source: 'ASSESSMENT',
            lastEvaluated: new Date().toISOString(),
          });
        }
      }
      db.saveStudentProfile(profile);
    }

    if (session) {
      session.isCompleted = true;
      session.evaluation = evaluation;
    }

    res.json({
      success: true,
      sessionId: sessionId || null,
      evaluation,
      verifiedCompetencyEarned,
      message: verifiedCompetencyEarned
        ? `Simulation passed (${evaluation.overallScore}/100). Competency for ${scenario.evaluatedSkill} recorded.`
        : `Simulation evaluated (${evaluation.overallScore}/100). Review feedback to improve.`,
    });
  } catch (err: any) {
    console.error('Error in /simulation/evaluate:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to evaluate simulation session',
    });
  }
});
