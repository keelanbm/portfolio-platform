require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')

async function applyNotificationsMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()
    console.log('Connected to database')
    
    // Check if notifications table already exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'notifications'
      );
    `)
    
    if (!tableCheck.rows[0].exists) {
      // Create notifications table
      await client.query(`
        CREATE TABLE "notifications" (
          "id" TEXT PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "message" TEXT NOT NULL,
          "actionUrl" TEXT,
          "isRead" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          
          -- Relations
          CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
      `)
      console.log('✅ Created notifications table')
      
      // Create indexes for better performance
      await client.query(`CREATE INDEX "notifications_userId_idx" ON "notifications"("userId")`)
      await client.query(`CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead")`)
      await client.query(`CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt")`)
      console.log('✅ Created indexes for notifications table')
      
    } else {
      console.log('⚠️ notifications table already exists')
    }
    
    console.log('🎉 Notifications migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.error('Full error:', error)
  } finally {
    await client.end()
  }
}

applyNotificationsMigration()