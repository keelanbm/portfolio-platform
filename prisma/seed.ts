import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create 5 realistic design users
  const users = [
    {
      id: 'user_sarah_ui',
      email: 'sarah@designstudio.co',
      username: 'sarahdesigns',
      displayName: 'Sarah Chen',
      bio: 'UI/UX Designer at Google. Passionate about creating intuitive digital experiences. Previously at Apple & Airbnb.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=200&h=200&fit=crop&crop=face',
      location: 'San Francisco, CA',
      websiteUrl: 'https://sarahchen.design',
    },
    {
      id: 'user_alex_mobile',
      email: 'alex@creativeco.io',
      username: 'alexcreative',
      displayName: 'Alex Rodriguez',
      bio: 'Mobile-first designer & developer. Creating beautiful apps that users love. Available for freelance work.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      location: 'New York, NY',
      websiteUrl: 'https://alexrodriguez.dev',
    },
    {
      id: 'user_emily_brand',
      email: 'emily@pixelstudio.com',
      username: 'emilybrand',
      displayName: 'Emily Davis',
      bio: 'Brand & Visual Designer specializing in startups. Helping companies tell their story through design.',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      location: 'London, UK',
      websiteUrl: 'https://emilydavis.co.uk',
    },
    {
      id: 'user_mike_product',
      email: 'mike@designsystem.io',
      username: 'mikeproduct',
      displayName: 'Mike Thompson',
      bio: 'Product Designer at Stripe. Building design systems and leading product teams. Mentor at ADPList.',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      location: 'Austin, TX',
      websiteUrl: 'https://mikethompson.design',
    },
    {
      id: 'user_lisa_web',
      email: 'lisa@webstudio.design',
      username: 'lisaweb',
      displayName: 'Lisa Wang',
      bio: 'Web Designer & Frontend Developer. Creating responsive websites that perform. Love working with React & Next.js.',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
      location: 'Seattle, WA',
      websiteUrl: 'https://lisawang.dev',
    },
  ]

  // Create users
  for (const userData of users) {
    await prisma.user.upsert({
      where: { id: userData.id },
      update: {},
      create: userData,
    })
    console.log(`✅ Created user: ${userData.displayName}`)
  }

  // Create 30 diverse design projects
  const projects = [
    // Sarah's projects (UI/UX Designer)
    {
      id: 'proj_banking_app',
      userId: 'user_sarah_ui',
      title: 'Neo Banking Mobile App',
      description: 'Complete mobile banking experience with modern UI patterns, biometric authentication, and seamless money transfers. Designed for Gen Z users.',
      coverImageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
      tags: ['mobile app', 'fintech', 'ui design', 'banking'],
      questions: ['How intuitive is the money transfer flow?', 'Does the onboarding feel too long?'],
      likeCount: 127,
      viewCount: 2340,
    },
    {
      id: 'proj_dashboard_analytics',
      userId: 'user_sarah_ui',
      title: 'SaaS Analytics Dashboard',
      description: 'Enterprise analytics dashboard with complex data visualization, real-time updates, and customizable widgets for marketing teams.',
      coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      tags: ['dashboard', 'saas', 'data visualization', 'enterprise'],
      questions: ['Are the charts easy to understand?', 'Is the navigation intuitive?'],
      likeCount: 89,
      viewCount: 1567,
    },
    {
      id: 'proj_healthcare_portal',
      userId: 'user_sarah_ui',
      title: 'Patient Portal Redesign',
      description: 'Healthcare patient portal focusing on accessibility, appointment scheduling, and medical record management for all age groups.',
      coverImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
      tags: ['healthcare', 'accessibility', 'web app', 'patient care'],
      questions: ['Is the interface accessible for elderly users?'],
      likeCount: 156,
      viewCount: 2890,
    },
    {
      id: 'proj_ecommerce_checkout',
      userId: 'user_sarah_ui',
      title: 'E-commerce Checkout Flow',
      description: 'Streamlined checkout experience reducing cart abandonment by 40%. One-click payments, guest checkout, and mobile optimization.',
      coverImageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      tags: ['ecommerce', 'checkout', 'conversion', 'mobile'],
      questions: ['How can we reduce checkout steps further?'],
      likeCount: 203,
      viewCount: 3421,
    },
    {
      id: 'proj_travel_booking',
      userId: 'user_sarah_ui',
      title: 'Travel Booking Platform',
      description: 'Modern travel booking interface with smart search, price comparison, and personalized recommendations. Focus on visual storytelling.',
      coverImageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
      tags: ['travel', 'booking', 'search', 'recommendations'],
      questions: ['Does the search feel fast enough?'],
      likeCount: 134,
      viewCount: 2156,
    },
    {
      id: 'proj_social_media_app',
      userId: 'user_sarah_ui',
      title: 'Social Media for Creators',
      description: 'Creator-focused social platform with monetization tools, analytics dashboard, and audience management features.',
      coverImageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
      tags: ['social media', 'creators', 'monetization', 'mobile'],
      questions: ['Are the creator tools discoverable?'],
      likeCount: 178,
      viewCount: 2967,
    },

    // Alex's projects (Mobile Designer)
    {
      id: 'proj_fitness_tracker',
      userId: 'user_alex_mobile',
      title: 'AI Fitness Tracker App',
      description: 'Personal trainer in your pocket with AI-powered workout recommendations, progress tracking, and social challenges.',
      coverImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      tags: ['fitness', 'ai', 'mobile app', 'health'],
      questions: ['Is the workout tracking intuitive?'],
      likeCount: 92,
      viewCount: 1678,
    },
    {
      id: 'proj_recipe_app',
      userId: 'user_alex_mobile',
      title: 'Smart Recipe App',
      description: 'Recipe discovery app with ingredient scanning, meal planning, grocery lists, and step-by-step cooking guidance.',
      coverImageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      tags: ['food', 'recipes', 'mobile', 'ai'],
      questions: ['How useful is the ingredient scanner?'],
      likeCount: 145,
      viewCount: 2234,
    },
    {
      id: 'proj_crypto_wallet',
      userId: 'user_alex_mobile',
      title: 'Crypto Wallet Interface',
      description: 'Secure and user-friendly crypto wallet with portfolio tracking, DeFi integration, and educational resources for beginners.',
      coverImageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
      tags: ['crypto', 'wallet', 'defi', 'finance'],
      questions: ['Is the security messaging clear?'],
      likeCount: 187,
      viewCount: 3156,
    },
    {
      id: 'proj_meditation_app',
      userId: 'user_alex_mobile',
      title: 'Mindfulness Meditation App',
      description: 'Calming meditation app with guided sessions, sleep stories, breathing exercises, and progress tracking.',
      coverImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      tags: ['meditation', 'wellness', 'mobile', 'mindfulness'],
      questions: ['Does the app feel calming and peaceful?'],
      likeCount: 223,
      viewCount: 3876,
    },
    {
      id: 'proj_language_learning',
      userId: 'user_alex_mobile',
      title: 'Language Learning Game',
      description: 'Gamified language learning with bite-sized lessons, streak tracking, and social competitions. Made learning addictive.',
      coverImageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
      tags: ['education', 'gamification', 'mobile', 'language'],
      questions: ['Are the lessons engaging enough?'],
      likeCount: 167,
      viewCount: 2645,
    },
    {
      id: 'proj_weather_widget',
      userId: 'user_alex_mobile',
      title: 'Weather App Redesign',
      description: 'Beautiful weather app with hyperlocal forecasts, animated backgrounds, and widgets for iOS 17. Focus on visual design.',
      coverImageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop',
      tags: ['weather', 'mobile', 'widgets', 'ios'],
      questions: ['Do the animations feel smooth?'],
      likeCount: 134,
      viewCount: 2098,
    },

    // Emily's projects (Brand Designer)
    {
      id: 'proj_startup_brand',
      userId: 'user_emily_brand',
      title: 'FinTech Startup Branding',
      description: 'Complete brand identity for a Y Combinator startup: logo, typography, color system, and brand guidelines. Modern and trustworthy.',
      coverImageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      tags: ['branding', 'fintech', 'logo design', 'startup'],
      questions: ['Does the brand feel trustworthy?'],
      likeCount: 198,
      viewCount: 3287,
    },
    {
      id: 'proj_coffee_packaging',
      userId: 'user_emily_brand',
      title: 'Artisan Coffee Packaging',
      description: 'Premium coffee packaging design for local roastery. Hand-illustrated elements, sustainable materials, and shelf appeal.',
      coverImageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop',
      tags: ['packaging', 'coffee', 'illustration', 'sustainability'],
      questions: ['Does it stand out on shelves?'],
      likeCount: 156,
      viewCount: 2456,
    },
    {
      id: 'proj_tech_conference',
      userId: 'user_emily_brand',
      title: 'Tech Conference Visual Identity',
      description: 'Visual identity for annual design conference: logo, signage, badges, swag, and digital assets. Bold and energetic.',
      coverImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      tags: ['event design', 'conference', 'visual identity', 'tech'],
      questions: ['Is the energy level appropriate?'],
      likeCount: 143,
      viewCount: 2134,
    },
    {
      id: 'proj_restaurant_brand',
      userId: 'user_emily_brand',
      title: 'Farm-to-Table Restaurant Brand',
      description: 'Organic restaurant branding with hand-lettered logo, earthy color palette, menu design, and interior signage.',
      coverImageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      tags: ['restaurant', 'organic', 'hand lettering', 'menu design'],
      questions: ['Does it feel authentic and organic?'],
      likeCount: 189,
      viewCount: 2987,
    },
    {
      id: 'proj_book_covers',
      userId: 'user_emily_brand',
      title: 'Sci-Fi Book Cover Series',
      description: 'Book cover series for indie sci-fi author. Consistent visual language across 5 books with striking typography and imagery.',
      coverImageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
      tags: ['book design', 'sci-fi', 'typography', 'series'],
      questions: ['Do they work as a cohesive series?'],
      likeCount: 127,
      viewCount: 1876,
    },
    {
      id: 'proj_nonprofit_campaign',
      userId: 'user_emily_brand',
      title: 'Environmental Campaign Design',
      description: 'Awareness campaign for ocean cleanup nonprofit. Impactful posters, social media assets, and donation page design.',
      coverImageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop',
      tags: ['nonprofit', 'campaign', 'environmental', 'social impact'],
      questions: ['Is the message compelling enough?'],
      likeCount: 234,
      viewCount: 4123,
    },

    // Mike's projects (Product Designer)
    {
      id: 'proj_design_system',
      userId: 'user_mike_product',
      title: 'Enterprise Design System',
      description: 'Comprehensive design system with 200+ components, design tokens, documentation, and Figma library for Fortune 500 company.',
      coverImageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
      tags: ['design system', 'enterprise', 'components', 'documentation'],
      questions: ['Are the components flexible enough?'],
      likeCount: 289,
      viewCount: 4567,
    },
    {
      id: 'proj_payment_flow',
      userId: 'user_mike_product',
      title: 'B2B Payment Platform',
      description: 'Complex B2B payment processing platform with multi-currency support, approval workflows, and detailed reporting.',
      coverImageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
      tags: ['b2b', 'payments', 'enterprise', 'workflow'],
      questions: ['Is the approval process clear?'],
      likeCount: 167,
      viewCount: 2789,
    },
    {
      id: 'proj_team_collaboration',
      userId: 'user_mike_product',
      title: 'Team Collaboration Tool',
      description: 'Slack competitor focused on async communication, project management integration, and AI-powered summaries.',
      coverImageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop',
      tags: ['collaboration', 'productivity', 'ai', 'communication'],
      questions: ['Does the AI feel helpful or intrusive?'],
      likeCount: 198,
      viewCount: 3234,
    },
    {
      id: 'proj_developer_tools',
      userId: 'user_mike_product',
      title: 'API Development Platform',
      description: 'Developer-first API platform with visual API builder, testing tools, documentation generation, and monitoring dashboard.',
      coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
      tags: ['developer tools', 'api', 'documentation', 'monitoring'],
      questions: ['Is it intuitive for non-technical users?'],
      likeCount: 145,
      viewCount: 2567,
    },
    {
      id: 'proj_inventory_system',
      userId: 'user_mike_product',
      title: 'Warehouse Management System',
      description: 'Enterprise inventory management with barcode scanning, predictive analytics, and mobile-first design for warehouse workers.',
      coverImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
      tags: ['enterprise', 'inventory', 'mobile first', 'warehouse'],
      questions: ['Is it usable with gloves on?'],
      likeCount: 123,
      viewCount: 1987,
    },
    {
      id: 'proj_customer_support',
      userId: 'user_mike_product',
      title: 'Customer Support Platform',
      description: 'Omnichannel customer support with AI ticket routing, knowledge base integration, and agent productivity tools.',
      coverImageUrl: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&h=600&fit=crop',
      tags: ['customer support', 'ai', 'omnichannel', 'productivity'],
      questions: ['Does the AI routing work accurately?'],
      likeCount: 178,
      viewCount: 2876,
    },

    // Lisa's projects (Web Designer)
    {
      id: 'proj_portfolio_website',
      userId: 'user_lisa_web',
      title: 'Photographer Portfolio',
      description: 'Minimalist photography portfolio with full-screen galleries, smooth animations, and client proofing system. Built with Next.js.',
      coverImageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=600&fit=crop',
      tags: ['portfolio', 'photography', 'minimalist', 'nextjs'],
      questions: ['Do the images load fast enough?'],
      likeCount: 167,
      viewCount: 2456,
    },
    {
      id: 'proj_saas_landing',
      userId: 'user_lisa_web',
      title: 'SaaS Product Landing Page',
      description: 'High-converting landing page for productivity SaaS with interactive demos, social proof, and A/B tested CTAs.',
      coverImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      tags: ['landing page', 'saas', 'conversion', 'interactive'],
      questions: ['Is the value proposition clear?'],
      likeCount: 234,
      viewCount: 3789,
    },
    {
      id: 'proj_ecommerce_store',
      userId: 'user_lisa_web',
      title: 'Fashion E-commerce Store',
      description: 'Modern fashion e-commerce with advanced filtering, wishlist, virtual try-on, and social shopping features.',
      coverImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      tags: ['ecommerce', 'fashion', 'shopping', 'ar'],
      questions: ['Is the product discovery smooth?'],
      likeCount: 189,
      viewCount: 3234,
    },
    {
      id: 'proj_news_platform',
      userId: 'user_lisa_web',
      title: 'Digital News Platform',
      description: 'Modern news website with personalized feeds, comment system, newsletter integration, and dark mode. Focus on readability.',
      coverImageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
      tags: ['news', 'media', 'readability', 'personalization'],
      questions: ['Is the reading experience comfortable?'],
      likeCount: 145,
      viewCount: 2567,
    },
    {
      id: 'proj_booking_platform',
      userId: 'user_lisa_web',
      title: 'Event Venue Booking',
      description: 'Wedding venue booking platform with virtual tours, availability calendar, quote requests, and vendor marketplace.',
      coverImageUrl: 'https://images.unsplash.com/photo-1519167758481-83f29c8e4217?w=800&h=600&fit=crop',
      tags: ['booking', 'events', 'venues', 'marketplace'],
      questions: ['Is the booking flow intuitive?'],
      likeCount: 167,
      viewCount: 2789,
    },
    {
      id: 'proj_learning_platform',
      userId: 'user_lisa_web',
      title: 'Online Learning Platform',
      description: 'Interactive coding bootcamp platform with live coding, peer reviews, project submissions, and career tracking.',
      coverImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
      tags: ['education', 'coding', 'interactive', 'career'],
      questions: ['Is the code editor user-friendly?'],
      likeCount: 198,
      viewCount: 3456,
    },
  ]

  // Create projects and their slides
  for (const projectData of projects) {
    const project = await prisma.project.upsert({
      where: { id: projectData.id },
      update: {},
      create: projectData,
    })

    // Create 2-4 slides per project
    const slideCount = Math.floor(Math.random() * 3) + 2 // 2-4 slides
    for (let i = 1; i <= slideCount; i++) {
      await prisma.projectSlide.upsert({
        where: { id: `${projectData.id}_slide_${i}` },
        update: {},
        create: {
          id: `${projectData.id}_slide_${i}`,
          projectId: project.id,
          imageUrl: projectData.coverImageUrl,
          slideOrder: i,
        },
      })
    }

    // Update slide count
    await prisma.project.update({
      where: { id: project.id },
      data: { slideCount },
    })

    console.log(`✅ Created project: ${projectData.title}`)
  }

  // Create some follow relationships
  const follows = [
    { followerId: 'user_alex_mobile', followingId: 'user_sarah_ui' },
    { followerId: 'user_emily_brand', followingId: 'user_sarah_ui' },
    { followerId: 'user_mike_product', followingId: 'user_sarah_ui' },
    { followerId: 'user_lisa_web', followingId: 'user_alex_mobile' },
    { followerId: 'user_sarah_ui', followingId: 'user_emily_brand' },
    { followerId: 'user_alex_mobile', followingId: 'user_mike_product' },
    { followerId: 'user_emily_brand', followingId: 'user_lisa_web' },
    { followerId: 'user_mike_product', followingId: 'user_lisa_web' },
  ]

  for (const follow of follows) {
    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: follow.followerId,
          followingId: follow.followingId,
        },
      },
      update: {},
      create: follow,
    })
  }

  // Create some likes
  const projectIds = projects.map(p => p.id)
  const userIds = users.map(u => u.id)

  for (let i = 0; i < 50; i++) {
    const randomProject = projectIds[Math.floor(Math.random() * projectIds.length)]
    const randomUser = userIds[Math.floor(Math.random() * userIds.length)]
    
    try {
      await prisma.like.upsert({
        where: {
          userId_projectId: {
            userId: randomUser,
            projectId: randomProject,
          },
        },
        update: {},
        create: {
          userId: randomUser,
          projectId: randomProject,
          voteType: 'LIKE',
        },
      })
    } catch (error) {
      // Skip if already exists
    }
  }

  // Create some comments
  const comments = [
    {
      projectId: 'proj_banking_app',
      userId: 'user_alex_mobile',
      content: 'Love the clean interface! The color choices really convey trust and professionalism.',
    },
    {
      projectId: 'proj_design_system',
      userId: 'user_sarah_ui',
      content: 'This is incredibly comprehensive. How long did it take to document all these components?',
    },
    {
      projectId: 'proj_startup_brand',
      userId: 'user_mike_product',
      content: 'The logo works perfectly at both large and small sizes. Great scalability!',
    },
    {
      projectId: 'proj_fitness_tracker',
      userId: 'user_emily_brand',
      content: 'The gamification elements are well balanced - motivating without being overwhelming.',
    },
    {
      projectId: 'proj_portfolio_website',
      userId: 'user_sarah_ui',
      content: 'The loading animations are so smooth! What did you use for the image optimization?',
    },
  ]

  for (const comment of comments) {
    await prisma.comment.create({
      data: comment,
    })
  }

  console.log('🎉 Database seeding completed successfully!')
  console.log(`✅ Created ${users.length} users`)
  console.log(`✅ Created ${projects.length} projects`)
  console.log(`✅ Created ${follows.length} follow relationships`)
  console.log(`✅ Created 50 likes`)
  console.log(`✅ Created ${comments.length} comments`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 