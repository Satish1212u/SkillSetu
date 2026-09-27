import { Router, Request, Response } from 'express';
import { db } from '../database/store';
import { CANONICAL_SKILLS, SKILL_ALIASES, normalizeSkillText } from '../data/taxonomy';

export const marketRouter = Router();

// All Skills
marketRouter.get('/skills', (req: Request, res: Response) => {
  const skills = db.getAllSkills();
  res.json({ skills });
});

// Taxonomy & Aliases
marketRouter.get('/taxonomy', (req: Request, res: Response) => {
  res.json({
    canonicalSkills: CANONICAL_SKILLS,
    aliasesCount: SKILL_ALIASES.length,
    sampleAliases: SKILL_ALIASES.slice(0, 20),
  });
});

// Normalize endpoint
marketRouter.post('/normalize-skill', (req: Request, res: Response) => {
  const { rawText } = req.body;
  if (!rawText) {
    res.status(400).json({ error: 'rawText is required.' });
    return;
  }

  const normalized = normalizeSkillText(rawText);
  res.json({
    rawInput: rawText,
    normalized: normalized ? {
      id: normalized.id,
      canonicalName: normalized.canonicalName,
      category: normalized.category,
      marketDemandLevel: normalized.marketDemandLevel,
    } : null,
    isRecognized: Boolean(normalized),
  });
});
