import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { authRouter } from './backend/api/auth';
import { studentRouter } from './backend/api/student';
import { instituteRouter } from './backend/api/institute';
import { employerRouter } from './backend/api/employer';
import { adminRouter } from './backend/api/admin';
import { marketRouter } from './backend/api/market';
import { chatRouter } from './backend/api/chat';
import { simulationRouter } from './backend/api/simulation';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON and URL-encoded body parsers with generous limits for resume PDF/text uploads
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));

  // Mount REST API endpoints
  app.use('/api/auth', authRouter);
  app.use('/api/student', studentRouter);
  app.use('/api/institute', instituteRouter);
  app.use('/api/employer', employerRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/market', marketRouter);
  app.use('/api/chat', chatRouter);
  app.use('/api/simulation', simulationRouter);
  app.use('/simulation', simulationRouter);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'SkillSetu Skill Intelligence Platform',
      version: '1.0.0-sih26134',
      timestamp: new Date().toISOString(),
    });
  });

  // AI Health endpoint
  app.get('/api/ai/health', (req, res) => {
    res.json({
      gemini: process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' ? 'configured' : 'missing',
      groq: process.env.GROQ_API_KEY ? 'configured' : 'missing',
      openrouter: process.env.OPENROUTER_API_KEY ? 'configured' : 'missing',
      fallbackEnabled: true
    });
  });

  // Vite development middleware or static production build
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KaushalSetu server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
