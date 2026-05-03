import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import morgan from 'morgan';
import { seedDatabase } from './utils/seed.js';

const app = express();
const PORT = parseInt(process.env['PORT'] || '3000', 10);

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
async function start(): Promise<void> {
  try {
    await seedDatabase();
  } catch (err) {
    console.error('⚠️  Database seeding failed (continuing startup):', err);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Ethara backend running on http://localhost:${PORT}`);
  });
}

start();

export default app;
