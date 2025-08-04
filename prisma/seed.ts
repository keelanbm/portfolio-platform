import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
})

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { id: 'user_30dCgOmdAquPteG1APQTnb7aU9R' },
    update: {},
    create: {
      id: 'user_30dCgOmdAquPteG1APQTnb7aU9R',
      email: 'test@example.com',
      username: 'testuser',
      displayName: 'Test User',
      bio: 'A creative designer showcasing amazing projects',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      subscriptionTier: 'FREE',
    },
  })

  // Create a test project
  const project = await prisma.project.upsert({
    where: { id: 'proj_1' },
    update: {},
    create: {
      id: 'proj_1',
      userId: user.id,
      title: 'Modern Web Design',
      description: 'A clean and modern web design project showcasing minimalist principles',
      coverImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      tags: ['web design', 'minimalist', 'modern'],
      isPublic: true,
    },
  })

  // Create project slides
  await prisma.projectSlide.upsert({
    where: { id: 'slide_1' },
    update: {},
    create: {
      id: 'slide_1',
      projectId: project.id,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      slideOrder: 1,
    },
  })

  // Create another test project
  const project2 = await prisma.project.upsert({
    where: { id: 'proj_2' },
    update: {},
    create: {
      id: 'proj_2',
      userId: user.id,
      title: 'Mobile App UI Kit',
      description: 'Complete UI kit for mobile applications with 50+ components',
      coverImageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
      tags: ['mobile', 'ui kit', 'components'],
      isPublic: true,
    },
  })

  await prisma.projectSlide.upsert({
    where: { id: 'slide_2' },
    update: {},
    create: {
      id: 'slide_2',
      projectId: project2.id,
      imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
      slideOrder: 1,
    },
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 