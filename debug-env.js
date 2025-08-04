// Debug environment variables
console.log('=== Environment Variables Debug ===')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('NEXT_PUBLIC_ENABLE_NOTIFICATIONS:', process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS)
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
console.log('CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? 'Set' : 'Not set')

// Check all env vars starting with NEXT_PUBLIC_
console.log('\n=== All NEXT_PUBLIC_ variables ===')
Object.keys(process.env)
  .filter(key => key.startsWith('NEXT_PUBLIC_'))
  .forEach(key => {
    console.log(`${key}:`, process.env[key])
  })