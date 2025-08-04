require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')

async function applyQuestionsMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()
    console.log('Connected to database')
    
    // Check if questions column already exists
    const columnCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'projects' AND column_name = 'questions'
    `)
    
    if (columnCheck.rows.length === 0) {
      // Add questions column to projects table
      await client.query(`ALTER TABLE "projects" ADD COLUMN "questions" TEXT[] DEFAULT '{}'`)
      console.log('✅ Added questions column to projects table')
    } else {
      console.log('⚠️ questions column already exists in projects table')
    }
    
    console.log('🎉 Questions migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.error('Full error:', error)
  } finally {
    await client.end()
  }
}

applyQuestionsMigration()