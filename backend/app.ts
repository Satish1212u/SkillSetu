import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { authRouter } from './api/auth';
import { studentRouter } from './api/student';
import { instituteRouter } from './api/institute';
import { employerRouter } from './api/employer';
import { adminRouter } from './api/admin';
import { marketRouter } from './api/market';
import { chatRouter } from './api/chat';
import { simulationRouter } from './api/simulation';

export const app = express();

// Enable CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// JSON and URL-encoded body parsers
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Health check endpoints
app.get(['/api/health', '/health'], (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    app: 'SkillSetu Skill Intelligence Platform',
    version: '1.0.0-sih26134',
    timestamp: new Date().toISOString(),
  });
});

app.get(['/api/ai/health', '/ai/health'], (req: Request, res: Response) => {
  res.json({
    gemini: process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' ? 'configured' : 'missing',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    groq: process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'MY_GROQ_API_KEY' ? 'configured' : 'missing',
    groqModel: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    openrouter: process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'MY_OPENROUTER_API_KEY' ? 'configured' : 'missing',
    openrouterModel: process.env.OPENROUTER_MODEL || 'openrouter/free',
    fallbackEnabled: true,
    activeChain: [
      { priority: 1, provider: 'Gemini', model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' },
      { priority: 2, provider: 'Groq', model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b' },
      { priority: 3, provider: 'OpenRouter', model: process.env.OPENROUTER_MODEL || 'openrouter/free' },
      { priority: 4, provider: 'Deterministic', model: 'SkillSetu Engine' },
    ],
  });
});

// 1. Primary Canonical REST API Endpoints (/api/...)
app.use('/api/auth', authRouter);
app.use('/api/student', studentRouter);
app.use('/api/institute', instituteRouter);
app.use('/api/employer', employerRouter);
app.use('/api/admin', adminRouter);
app.use('/api/market', marketRouter);
app.use('/api/chat', chatRouter);
app.use('/api/simulation', simulationRouter);

// 2. Direct route aliases mapped to real handlers (fallback for prefix-stripped proxies or legacy callers)
app.use('/auth', authRouter);
app.use('/student', studentRouter);
app.use('/institute', instituteRouter);
app.use('/employer', employerRouter);
app.use('/admin', adminRouter);
app.use('/market', marketRouter);
app.use('/chat', chatRouter);
app.use('/simulation', simulationRouter);

// Specific top-level aliases mapped to existing real backend routes
app.all(['/copilot', '/api/copilot'], (req: Request, res: Response, next: NextFunction) => {
  req.url = '/copilot';
  studentRouter(req, res, next);
});

app.all(['/dashboard', '/api/dashboard'], (req: Request, res: Response, next: NextFunction) => {
  req.url = '/dashboard';
  studentRouter(req, res, next);
});

app.all(['/login', '/api/login'], (req: Request, res: Response, next: NextFunction) => {
  req.url = '/login';
  authRouter(req, res, next);
});

app.all(['/match', '/api/match'], (req: Request, res: Response, next: NextFunction) => {
  req.url = '/jobs/match';
  studentRouter(req, res, next);
});

app.all(['/profile', '/api/profile'], (req: Request, res: Response, next: NextFunction) => {
  req.url = '/profile';
  studentRouter(req, res, next);
});

app.all(['/roadmap', '/api/roadmap'], (req: Request, res: Response, next: NextFunction) => {
  req.url = '/roadmap';
  studentRouter(req, res, next);
});

app.all(['/assessments', '/api/assessments'], (req: Request, res: Response, next: NextFunction) => {
  req.url = '/assessments';
  studentRouter(req, res, next);
});
