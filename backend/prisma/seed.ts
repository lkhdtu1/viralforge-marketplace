import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '../src/services/auth.service';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await hashPassword('Admin123!');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@viralforge.com' },
    update: {},
    create: {
      email: 'admin@viralforge.com',
      passwordHash: adminPassword,
      displayName: 'Admin User',
      role: UserRole.ADMIN,
      emailVerified: true,
      isActive: true,
      isVerified: true,
    },
  });

  // Create brand user
  const brandPassword = await hashPassword('Brand123!');
  const brand = await prisma.user.upsert({
    where: { email: 'brand@viralforge.com' },
    update: {},
    create: {
      email: 'brand@viralforge.com',
      passwordHash: brandPassword,
      displayName: 'Test Brand',
      firstName: 'Test',
      lastName: 'Brand',
      role: UserRole.BRAND,
      emailVerified: true,
      isActive: true,
      bio: 'A test brand for development',
      website: 'https://example.com',
    },
  });

  // Create creator user
  const creatorPassword = await hashPassword('Creator123!');
  const creator = await prisma.user.upsert({
    where: { email: 'creator@viralforge.com' },
    update: {},
    create: {
      email: 'creator@viralforge.com',
      passwordHash: creatorPassword,
      displayName: 'Test Creator',
      firstName: 'Test',
      lastName: 'Creator',
      role: UserRole.CREATOR,
      emailVerified: true,
      isActive: true,
      bio: 'A test creator for development',
      socialLinks: {
        instagram: 'https://instagram.com/testcreator',
        tiktok: 'https://tiktok.com/@testcreator',
      },
    },
  });

  // Create sample campaign
  const campaign = await prisma.campaign.create({
    data: {
      brandId: brand.id,
      title: 'Summer Product Launch',
      description: 'Looking for creators to promote our new summer product line',
      budget: 10000.00,
      currency: 'USD',
      status: 'ACTIVE',
      requirements: 'Must have 10k+ followers, engagement rate >3%',
      targetAudience: {
        ageRange: [18, 35],
        interests: ['fashion', 'lifestyle'],
      },
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  // Create sample listing
  const listing = await prisma.listing.create({
    data: {
      creatorId: creator.id,
      campaignId: campaign.id,
      title: 'Instagram Post + Story Package',
      description: 'High-quality Instagram post with story promotion',
      price: 500.00,
      currency: 'USD',
      deliverables: '1 Instagram post, 2 Instagram stories, 1 reel',
      platform: ['instagram'],
      reach: 50000,
      engagement: 4.5,
      status: 'ACTIVE',
      featured: true,
    },
  });

  console.log('✅ Seeding completed!');
  console.log('\n📝 Test Accounts:');
  console.log('Admin: admin@viralforge.com / Admin123!');
  console.log('Brand: brand@viralforge.com / Brand123!');
  console.log('Creator: creator@viralforge.com / Creator123!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

