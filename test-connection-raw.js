const { Client } = require('pg')

async function testConnection() {
  const client = new Client({
    connectionString: 'postgresql://postgres.epfgirkjjycugnpsvoag:L9sPBW3WraFicBUKeWCc@aws-0-us-east-1.pooler.supabase.com:6543/postgres'
  })
  
  try {
    console.log('Testing database connection with raw pg client...')
    await client.connect()
    console.log('✅ Database connection successful!')
    
    // Check if tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `)
    console.log('📋 Existing tables:', result.rows.map(row => row.table_name))
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  } finally {
    await client.end()
  }
}

testConnection()