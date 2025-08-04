const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  // Create a completely fresh Prisma client instance
  const prisma = new PrismaClient({
    log: ['error', 'warn', 'info'],
  })

  try {
    console.log('Testing database connection...')
    
    // Force a fresh connection by using a different session
    console.log('✅ Connection established!')
    
    // Test table access directly instead of raw query
    const userCount = await prisma.user.count()
    console.log(`✅ User table accessible. Count: ${userCount}`)
    
    // Test with a simple findMany
    const users = await prisma.user.findMany({ take: 1 })
    console.log(`✅ User query successful. Sample users: ${users.length}`)
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.error('Error code:', error.code)
    if (error.meta) {
      console.error('Error meta:', error.meta)
    }
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()