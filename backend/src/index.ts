import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import prisma from './utils/prisma.js';

const app = express();
const PORT = parseInt(process.env['PORT'] || '3000', 10);

import { apiLimiter } from './middleware/rateLimiter.js';
import morgan from 'morgan';

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

async function seedDatabase(): Promise<void> {
  console.log('🌱 Seeding database...');

  // Create test user
  const passwordHash = await bcrypt.hash('test123', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash,
      roleDefault: 'Admin',
    },
  });
  console.log('✅ Created test user:', testUser.email);

  // Create demo user
  const demoPasswordHash = await bcrypt.hash('demo123', 12);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@example.com',
      passwordHash: demoPasswordHash,
      roleDefault: 'Member',
    },
  });
  console.log('✅ Created demo user:', demoUser.email);

  // Create sample project (find existing or create new)
  let project = await prisma.project.findFirst({
    where: { name: 'Sample Project', createdBy: testUser.id },
  });

  if (!project) {
    project = await prisma.project.create({
      data: {
        name: 'Sample Project',
        description: 'This is a sample project to get you started',
        createdBy: testUser.id,
        members: {
          create: [
            { userId: testUser.id, role: 'Admin' },
            { userId: demoUser.id, role: 'Member' },
          ],
        },
      },
    });
  }
  console.log('✅ Created sample project:', project.name);

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Setup development environment',
        description: 'Install all necessary tools and dependencies',
        status: 'Done',
        priority: 'High',
        projectId: project.id,
        createdBy: testUser.id,
        assignedTo: testUser.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Design database schema',
        description: 'Create the initial database schema for the application',
        status: 'Done',
        priority: 'High',
        projectId: project.id,
        createdBy: testUser.id,
        assignedTo: testUser.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implement authentication',
        description: 'Add user registration and login functionality',
        status: 'In Progress',
        priority: 'High',
        projectId: project.id,
        createdBy: testUser.id,
        assignedTo: demoUser.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Create project dashboard',
        description: 'Build the main dashboard with project overview',
        status: 'In Progress',
        priority: 'Medium',
        projectId: project.id,
        createdBy: testUser.id,
        assignedTo: testUser.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Add task management',
        description: 'Implement kanban board for task tracking',
        status: 'To Do',
        priority: 'Medium',
        projectId: project.id,
        createdBy: testUser.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Write documentation',
        description: 'Create user guide and API documentation',
        status: 'To Do',
        priority: 'Low',
        projectId: project.id,
        createdBy: testUser.id,
        assignedTo: demoUser.id,
      },
    }),
  ]);
  console.log(`✅ Created ${tasks.length} sample tasks`);

  console.log('\n🎉 Database seeded successfully!\n');
}

async function start(): Promise<void> {
  try {
    await seedDatabase();
  } catch (err) {
    console.error('⚠️  Seeding failed (app will still start):', err);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Ethara backend running on http://localhost:${PORT}`);
  });
}

start();

export default app;
