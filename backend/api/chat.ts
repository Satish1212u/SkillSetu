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

    const payload: MultiTurnChatPayload = {
      messages,
      systemInstruction,
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
