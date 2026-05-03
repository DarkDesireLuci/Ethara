import bcrypt from 'bcrypt';
import prisma from './prisma.js';

export async function seedDatabase(): Promise<void> {
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
  console.log('📝 Test Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Email:    test@example.com');
  console.log('Password: test123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📝 Demo Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Email:    demo@example.com');
  console.log('Password: demo123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}
