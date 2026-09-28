import { Router, Request, Response } from 'express';
import { sendMultiTurnChatMessage, MultiTurnChatPayload, SupportedChatModel } from '../services/geminiService';

export const chatRouter = Router();

chatRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { messages, systemInstruction, modelChoice, userRole, userName, organization } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required and cannot be empty.' });
      return;
    }

    let enrichedInstruction = systemInstruction;
    if (userRole === 'STUDENT') {
      const { db } = await import('../database/store');
      const studentProfile = db.studentProfiles.get('usr-student-1') || Array.from(db.studentProfiles.values())[0];
      if (studentProfile) {
        const studentSkills = studentProfile.skills
          .map(s => {
            const sk = db.getSkillById(s.skillId);
            return `${sk?.canonicalName || s.skillId} (${s.verified ? 'Verified' : 'Analysed'})`;
          })
          .join(', ');

        const candidateName = studentProfile.resumeData?.candidate?.name || userName || 'Student Candidate';
        const contextSuffix = `\n\nCURRENT STUDENT PROFILE CONTEXT:
- Student Name: ${candidateName}
- Target Role: ${studentProfile.targetRole}
- Verified & Analysed Skills: ${studentSkills || 'In progress'}
- Education: ${studentProfile.education || 'Undergraduate'}
- Resume Summary: ${studentProfile.resumeData?.summary || studentProfile.bio || 'Recently analysed'}
Reference this student profile context when answering questions about their skills, career alignment, or curriculum.`;

        enrichedInstruction = (systemInstruction || '') + contextSuffix;
      }
    }

    const payload: MultiTurnChatPayload = {
      messages,
      systemInstruction: enrichedInstruction,
      modelChoice: modelChoice as SupportedChatModel,
      userRole,
      userName,
      organization,
    };

    const result = await sendMultiTurnChatMessage(payload);

    res.json({
      reply: result.reply,
      answer: result.answer,
      provider: result.provider,
      modelUsed: result.modelUsed,
      fallbackUsed: result.fallbackUsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({ error: err.message || 'Chat generation failed.' });
  }
});
