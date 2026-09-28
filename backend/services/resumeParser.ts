import { generateAIResponse } from './aiRouter';
import { skillExtractor } from './skillExtractor';
import {
  StructuredResumeData,
  StructuredResumeCandidate,
  StructuredResumeEducation,
  StructuredResumeSkill,
  StructuredResumeExperience,
  StructuredResumeProject,
} from '../types/models';

/**
 * Deterministic Fallback Parser: Extracts structured candidate data directly
 * from freeform text without calling an external LLM.
 * Adheres strictly to the rule: Never invent information not present in the resume.
 */
export function parseResumeDeterministically(text: string): StructuredResumeData {
  if (!text || typeof text !== 'string') {
    return {
      candidate: { name: '', email: '', phone: '', location: '' },
      summary: '',
      education: [],
      skills: [],
      experience: [],
      projects: [],
      certifications: [],
      possibleRoles: [],
    };
  }

  const lines = text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  // 1. Candidate Contact Information
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b[6-9]\d{9}\b/);

  let candidateName = '';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (
      line.length > 2 &&
      line.length < 50 &&
      !line.includes('@') &&
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('curriculum') &&
      !line.toLowerCase().includes('phone') &&
      !line.toLowerCase().includes('http') &&
      !line.toLowerCase().includes('git')
    ) {
      candidateName = line.replace(/^[#*\s-]+/, '').trim();
      break;
    }
  }

  // Common Indian / Global tech hubs
  const cityRegex = /\b(Bengaluru|Bangalore|Pune|Mumbai|Delhi|Hyderabad|Chennai|Kolkata|Noida|Gurgaon|Gurugram|Ahmedabad|Jaipur|Chandigarh|Kochi)\b/i;
  const locMatch = text.match(cityRegex);
  const location = locMatch ? locMatch[0] : '';

  // 2. Summary
  let summary = '';
  const summaryHeaderIdx = lines.findIndex(l =>
    /^(summary|professional summary|profile|about me|objective)[:\s]*$/i.test(l)
  );
  if (summaryHeaderIdx !== -1 && lines[summaryHeaderIdx + 1]) {
    summary = lines[summaryHeaderIdx + 1];
  } else {
    const candidateSummary = lines.find(
      l => l.length > 60 && !l.includes(':') && !l.startsWith('-') && !l.startsWith('•')
    );
    summary = candidateSummary || '';
  }

  // 3. Education
  const education: StructuredResumeEducation[] = [];
  const degreeRegex = /(B\.?Tech|B\.?E\.?|M\.?Tech|M\.?E\.?|B\.?Sc|M\.?Sc|BCA|MCA|Bachelor|Master|Diploma)[\w\s,.-]*/i;
  const yearRegex = /\b(20\d{2}(?:\s*[-–]\s*20?\d{2})?)\b/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const degMatch = line.match(degreeRegex);
    if (degMatch) {
      const yrMatch = line.match(yearRegex);
      const degree = degMatch[0].trim();
      let institution = line.replace(degMatch[0], '').replace(yearRegex, '').replace(/[,|–-]/g, ' ').trim();
      if (!institution && i > 0) {
        institution = lines[i - 1];
      }
      education.push({
        degree,
        institution: institution || 'Engineering Institute / University',
        year: yrMatch ? yrMatch[0] : '',
      });
      if (education.length >= 3) break;
    }
  }

  // 4. Skills extraction using deterministic taxonomy scanner
  const rawExtracted = skillExtractor.extractFromText(text);
  const skills: StructuredResumeSkill[] = rawExtracted.map(res => ({
    name: res.skill.canonicalName,
    category: res.skill.category.toLowerCase().includes('soft') ? 'soft' : 'technical',
    evidence: `Extracted from text: "${res.extractedFromText}"`,
  }));

  // 5. Projects
  const projects: StructuredResumeProject[] = [];
  let inProjects = false;
  let currentProject: StructuredResumeProject | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^(projects|academic projects|key projects)[:\s]*$/i.test(line)) {
      inProjects = true;
      continue;
    }
    if (
      inProjects &&
      /^(experience|work experience|education|certifications|skills|technical skills|achievements)[:\s]*$/i.test(
        line
      )
    ) {
      inProjects = false;
      if (currentProject) projects.push(currentProject);
      currentProject = null;
      continue;
    }
    if (inProjects) {
      if (
        /^(\d+\.|\*|-|•)\s+[A-Z]/.test(line) ||
        /^[A-Z][A-Za-z0-9\s-]{3,40}(?:\s*\([^)]+\))?:?$/.test(line)
      ) {
        if (currentProject) projects.push(currentProject);
        const nameClean = line.replace(/^(\d+\.|\*|-|•)\s*/, '').replace(/:$/, '').trim();
        currentProject = {
          name: nameClean,
          description: '',
          technologies: [],
        };
      } else if (currentProject) {
        if (!currentProject.description) {
          currentProject.description = line;
        } else {
          currentProject.description += ' ' + line;
        }
      }
    }
  }
  if (currentProject) projects.push(currentProject);

  // 6. Experience
  const experience: StructuredResumeExperience[] = [];
  let inExp = false;
  let currentExp: StructuredResumeExperience | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      /^(experience|work experience|internships|professional experience)[:\s]*$/i.test(
        line
      )
    ) {
      inExp = true;
      continue;
    }
    if (
      inExp &&
      /^(projects|education|certifications|skills|achievements)[:\s]*$/i.test(line)
    ) {
      inExp = false;
      if (currentExp) experience.push(currentExp);
      currentExp = null;
      continue;
    }
    if (inExp) {
      if (
        /^(\d+\.|\*|-|•)\s+[A-Z]/.test(line) ||
        /^[A-Z][A-Za-z0-9\s,-]{3,50}\s*[-|–]/.test(line)
      ) {
        if (currentExp) experience.push(currentExp);
        const parts = line.split(/[-|–]/).map(p => p.trim());
        currentExp = {
          company: parts[0] || 'Organization',
          role: parts[1] || 'Intern / Engineer',
          duration: parts[2] || '',
          responsibilities: [],
        };
      } else if (currentExp && (line.startsWith('-') || line.startsWith('•'))) {
        currentExp.responsibilities.push(line.replace(/^[-•*]\s*/, '').trim());
      }
    }
  }
  if (currentExp) experience.push(currentExp);

  // 7. Certifications
  const certifications: string[] = [];
  const certLines = lines.filter(l =>
    /(certified|certification|certificate|aws certified|cka|coursera|udemy|nptel)/i.test(l)
  );
  for (const cl of certLines.slice(0, 5)) {
    certifications.push(cl.replace(/^[-•*]\s*/, '').trim());
  }

  // 8. Possible Roles inference
  const skillNamesLower = new Set(skills.map(s => s.name.toLowerCase()));
  const possibleRoles: string[] = [];
  if (
    skillNamesLower.has('docker') ||
    skillNamesLower.has('kubernetes') ||
    skillNamesLower.has('linux') ||
    skillNamesLower.has('aws')
  ) {
    possibleRoles.push('DevOps / Cloud Engineer');
  }
  if (
    skillNamesLower.has('react') ||
    skillNamesLower.has('javascript') ||
    skillNamesLower.has('typescript') ||
    skillNamesLower.has('html5 & css3')
  ) {
    possibleRoles.push('Frontend Developer');
  }
  if (
    skillNamesLower.has('node.js') ||
    skillNamesLower.has('fastapi') ||
    skillNamesLower.has('postgresql') ||
    skillNamesLower.has('sql')
  ) {
    possibleRoles.push('Backend Developer');
  }
  if (
    skillNamesLower.has('python') &&
    (skillNamesLower.has('machine learning') ||
      skillNamesLower.has('generative ai') ||
      skillNamesLower.has('pytorch'))
  ) {
    possibleRoles.push('AI & Data Science Engineer');
  }
  if (possibleRoles.length === 0) {
    possibleRoles.push('Software Engineer');
  }

  return {
    candidate: {
      name: candidateName,
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      location,
    },
    summary,
    education,
    skills,
    experience,
    projects,
    certifications,
    possibleRoles,
  };
}

/**
 * AI Resume Parsing via the Centralized AI Router.
 * Primary: Gemini 2.5 Flash
 * Fallback 1: Groq GPT-OSS 120B
 * Fallback 2: OpenRouter Free
 * Final Fallback: Deterministic Parser
 */
export async function parseResumeWithCentralizedAI(resumeText: string): Promise<{
  parsedResume: StructuredResumeData;
  provider: 'gemini' | 'groq' | 'openrouter' | 'deterministic';
  modelUsed: string;
  fallbackUsed: boolean;
}> {
  if (!resumeText || !resumeText.trim()) {
    const empty = parseResumeDeterministically('');
    return {
      parsedResume: empty,
      provider: 'deterministic',
      modelUsed: 'SkillSetu Deterministic Engine',
      fallbackUsed: true,
    };
  }

  const systemPrompt = `You are a high-precision Resume Intelligence parser for the SkillSetu platform.
Extract all candidate information from the provided resume text into a structured JSON object.

CRITICAL EXTRACTION RULES:
1. Never invent or hallucinate information that is not present in the resume text.
2. If information is missing, return empty string "", empty array [], or null as appropriate.
3. Classify each extracted skill category as "technical", "soft", "tool", or "language", and provide the concise evidence phrase from the resume where it appeared.
4. Detect realistic possible industry roles matching this candidate's profile.
5. Return ONLY a single valid JSON object strictly adhering to this schema:
{
  "candidate": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string"
  },
  "summary": "string",
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string"
    }
  ],
  "skills": [
    {
      "name": "string",
      "category": "technical|soft|tool|language",
      "evidence": "string"
    }
  ],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "responsibilities": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"]
    }
  ],
  "certifications": ["string"],
  "possibleRoles": ["string"]
}`;

  try {
    const aiRes = await generateAIResponse({
      task: 'RESUME_ANALYSIS',
      systemPrompt,
      userPrompt: `RESUME TEXT:\n"""\n${resumeText.slice(0, 15000)}\n"""`,
      responseFormat: 'json',
      modelChoice: 'gemini-2.5-flash',
    });

    if (aiRes.success && aiRes.response && aiRes.provider !== 'none') {
      let cleaned = aiRes.response.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
      }
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }
      const parsed = JSON.parse(cleaned);

      if (parsed && typeof parsed === 'object') {
        const validated: StructuredResumeData = {
          candidate: {
            name: parsed.candidate?.name || '',
            email: parsed.candidate?.email || '',
            phone: parsed.candidate?.phone || '',
            location: parsed.candidate?.location || '',
          },
          summary: parsed.summary || '',
          education: Array.isArray(parsed.education) ? parsed.education : [],
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          experience: Array.isArray(parsed.experience) ? parsed.experience : [],
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
          possibleRoles: Array.isArray(parsed.possibleRoles) ? parsed.possibleRoles : [],
        };

        return {
          parsedResume: validated,
          provider: aiRes.provider,
          modelUsed: aiRes.model,
          fallbackUsed: aiRes.fallbackUsed,
        };
      }
    }
  } catch (err: any) {
    console.warn(
      '[AI] Centralized AI Router resume parsing error, falling back to deterministic engine:',
      err?.message || err
    );
  }

  // Deterministic final fallback
  const deterministicParsed = parseResumeDeterministically(resumeText);
  return {
    parsedResume: deterministicParsed,
    provider: 'deterministic',
    modelUsed: 'SkillSetu Deterministic Engine',
    fallbackUsed: true,
  };
}
