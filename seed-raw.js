const { Client } = require('pg')

async function seedDatabase() {
  const client = new Client({
    connectionString: 'postgresql://postgres.epfgirkjjycugnpsvoag:L9sPBW3WraFicBUKeWCc@aws-0-us-east-1.pooler.supabase.com:6543/postgres'
  })
  
  try {
    await client.connect()
    console.log('🌱 Starting database seeding...')
    
    // Create a test user (upsert behavior)
    await client.query(`
      INSERT INTO users (id, email, username, "displayName", bio, "avatarUrl", "subscriptionTier", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        username = EXCLUDED.username,
        "displayName" = EXCLUDED."displayName",
        bio = EXCLUDED.bio,
        "avatarUrl" = EXCLUDED."avatarUrl",
        "updatedAt" = NOW()
    `, [
      'user_30dCgOmdAquPteG1APQTnb7aU9R',
      'test@example.com',
      'testuser',
      'Test User',
      'A creative designer showcasing amazing projects',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      'FREE'
    ])
    
    console.log('✅ Test user created/updated')
    
    // Create test projects
    await client.query(`
      INSERT INTO projects (id, "userId", title, description, "coverImageUrl", tags, "isPublic", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        "coverImageUrl" = EXCLUDED."coverImageUrl",
        tags = EXCLUDED.tags,
        "updatedAt" = NOW()
    `, [
      'proj_1',
      'user_30dCgOmdAquPteG1APQTnb7aU9R',
      'Modern Web Design',
      'A clean and modern web design project showcasing minimalist principles',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      ['web design', 'minimalist', 'modern'],
      true
    ])
    
    await client.query(`
      INSERT INTO projects (id, "userId", title, description, "coverImageUrl", tags, "isPublic", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        "coverImageUrl" = EXCLUDED."coverImageUrl",
        tags = EXCLUDED.tags,
        "updatedAt" = NOW()
    `, [
      'proj_2',
      'user_30dCgOmdAquPteG1APQTnb7aU9R',
      'Mobile App UI Kit',
      'Complete UI kit for mobile applications with 50+ components',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
      ['mobile', 'ui kit', 'components'],
      true
    ])
    
    console.log('✅ Test projects created/updated')
    
    // Create project slides
    await client.query(`
      INSERT INTO project_slides (id, "projectId", "imageUrl", "slideOrder", "createdAt")
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (id) DO UPDATE SET
        "imageUrl" = EXCLUDED."imageUrl",
        "slideOrder" = EXCLUDED."slideOrder"
    `, [
      'slide_1',
      'proj_1', 
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      1
    ])
    
    await client.query(`
      INSERT INTO project_slides (id, "projectId", "imageUrl", "slideOrder", "createdAt")
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (id) DO UPDATE SET
        "imageUrl" = EXCLUDED."imageUrl",
        "slideOrder" = EXCLUDED."slideOrder"
    `, [
      'slide_2',
      'proj_2',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
      1
    ])
    
    console.log('✅ Project slides created/updated')
    
    // Check final state
    const userCount = await client.query('SELECT COUNT(*) FROM users')
    const projectCount = await client.query('SELECT COUNT(*) FROM projects')
    const slideCount = await client.query('SELECT COUNT(*) FROM project_slides')
    
    console.log(`📊 Final state: ${userCount.rows[0].count} users, ${projectCount.rows[0].count} projects, ${slideCount.rows[0].count} slides`)
    console.log('🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    console.error(error)
  } finally {
    await client.end()
  }
}

seedDatabase()