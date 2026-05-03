import { seedDatabase } from './utils/seed.js';
import prisma from './utils/prisma.js';

async function main() {
  try {
    await seedDatabase();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
