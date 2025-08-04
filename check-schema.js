const { Client } = require('pg')

async function checkSchema() {
  const client = new Client({
    connectionString: 'postgresql://postgres.epfgirkjjycugnpsvoag:L9sPBW3WraFicBUKeWCc@aws-0-us-east-1.pooler.supabase.com:6543/postgres'
  })
  
  try {
    await client.connect()
    console.log('Checking database schema...')
    
    // Check users table structure
    const usersColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `)
    console.log('👤 Users table columns:', usersColumns.rows)
    
    // Check projects table structure  
    const projectsColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      ORDER BY ordinal_position
    `)
    console.log('📁 Projects table columns:', projectsColumns.rows)
    
    // Check if there's any existing data
    const userCount = await client.query('SELECT COUNT(*) FROM users')
    const projectCount = await client.query('SELECT COUNT(*) FROM projects')
    
    console.log(`📊 Current data: ${userCount.rows[0].count} users, ${projectCount.rows[0].count} projects`)
    
  } catch (error) {
    console.error('❌ Schema check failed:', error.message)
  } finally {
    await client.end()
  }
}

checkSchema()