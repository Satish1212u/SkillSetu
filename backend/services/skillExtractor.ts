import { Skill, StructuredResumeData } from '../types/models';
import { CANONICAL_SKILLS, SKILL_ALIASES, normalizeSkillText } from '../data/taxonomy';
import { parseResumeWithCentralizedAI } from './resumeParser';
import { extractTextFromPdf } from './pdfExtractor';

export interface ExtractedSkillResult {
  skill: Skill;
  extractedFromText: string;
  source: 'DICTIONARY' | 'AI_MODEL';
  confidence: number;
}

export interface HybridResumeAnalysisResult {
  parsedResume: StructuredResumeData;
  normalizedSkills: Skill[];
  extractedText: string;
  provider: 'gemini' | 'groq' | 'openrouter' | 'deterministic';
  modelUsed: string;
  fallbackUsed: boolean;
}

export class SkillExtractorService {
  /**
   * Deterministically extract normalized skills from freeform text using
   * boundary-aware regex matching against canonical names and aliases.
   */
  public extractFromText(text: string): ExtractedSkillResult[] {
    if (!text || typeof text !== 'string') return [];

    const foundSkillsMap = new Map<string, ExtractedSkillResult>();
    const lowerText = ` ${text.toLowerCase()} `;

    // 1. Check all canonical skills
    for (const skill of CANONICAL_SKILLS) {
      const escaped = skill.canonicalName.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:[^a-z0-9]|^)${escaped}(?:[^a-z0-9]|$)`, 'i');
      if (regex.test(lowerText)) {
        foundSkillsMap.set(skill.id, {
          skill,
          extractedFromText: skill.canonicalName,
          source: 'DICTIONARY',
          confidence: 0.98,
        });
      }
    }

    // 2. Check all aliases
    for (const aliasEntry of SKILL_ALIASES) {
      if (foundSkillsMap.has(aliasEntry.skillId)) continue;

      const escaped = aliasEntry.alias.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:[^a-z0-9]|^)${escaped}(?:[^a-z0-9]|$)`, 'i');
      if (regex.test(lowerText)) {
        const canonical = CANONICAL_SKILLS.find(s => s.id === aliasEntry.skillId);
        if (canonical) {
          foundSkillsMap.set(canonical.id, {
            skill: canonical,
            extractedFromText: aliasEntry.alias,
            source: 'DICTIONARY',
            confidence: 0.95,
          });
        }
      }
    }

    return Array.from(foundSkillsMap.values());
  }

  /**
   * Normalizes an array of raw skill string inputs (e.g. ['ReactJS', 'k8s', 'AWS Cloud'])
   * into canonical skills.
   */
  public normalizeSkills(rawSkills: string[]): Skill[] {
    const unique = new Map<string, Skill>();
    for (const raw of rawSkills) {
      if (!raw || typeof raw !== 'string') continue;
      const normalized = normalizeSkillText(raw);
      if (normalized && !unique.has(normalized.id)) {
        unique.set(normalized.id, normalized);
      }
    }
    return Array.from(unique.values());
  }

  /**
   * Complete End-to-End Resume Intelligence Pipeline:
   * PDF/Text -> Text Extraction -> Centralized AI Parsing -> Skill Normalization -> Structured Result.
   */
  public async analyzeResume(options: {
    resumeText?: string;
    base64Pdf?: string;
  }): Promise<HybridResumeAnalysisResult> {
    let extractedText = options.resumeText || '';

    // 1. If base64Pdf is provided, extract plain text using pdf extractor
    if (options.base64Pdf) {
      const pdfResult = await extractTextFromPdf(options.base64Pdf);
      if (pdfResult.text && pdfResult.text.trim().length > 0) {
        extractedText = pdfResult.text.trim();
      }
    }

    // 2. Run Centralized AI Parsing (Gemini -> Groq -> OpenRouter -> Deterministic Fallback)
    const aiResult = await parseResumeWithCentralizedAI(extractedText);

    // 3. Collect all raw skills for normalization
    const skillsToNormalize: string[] = [];

    // Direct dictionary scan from text
    const directResults = this.extractFromText(extractedText);
    for (const res of directResults) {
      skillsToNormalize.push(res.skill.canonicalName);
    }

    // Skills returned by AI parser
    if (aiResult.parsedResume && Array.isArray(aiResult.parsedResume.skills)) {
      for (const s of aiResult.parsedResume.skills) {
        if (s.name) skillsToNormalize.push(s.name);
      }
    }

    // 4. Pass through deterministic normalization system (deduplication & canonical mapping)
    const normalizedSkills = this.normalizeSkills(skillsToNormalize);

    return {
      parsedResume: aiResult.parsedResume,
      normalizedSkills,
      extractedText,
      provider: aiResult.provider,
      modelUsed: aiResult.modelUsed,
      fallbackUsed: aiResult.fallbackUsed,
    };
  }

  /**
   * Backward-compatible helper method
   */
  public async extractFromResumeHybrid(
    rawText: string,
    isBase64Pdf: boolean = false
  ): Promise<{
    parsedAI: any;
    normalizedSkills: Skill[];
  }> {
    const result = await this.analyzeResume({
      resumeText: isBase64Pdf ? undefined : rawText,
      base64Pdf: isBase64Pdf ? rawText : undefined,
    });

    return {
      parsedAI: result.parsedResume,
      normalizedSkills: result.normalizedSkills,
    };
  }
}

export const skillExtractor = new SkillExtractorService();
