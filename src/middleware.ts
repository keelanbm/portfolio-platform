import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/feed(.*)',
  '/discover(.*)',
  '/profile(.*)',
  '/api/feed(.*)',
  '/api/discover(.*)',
  '/api/follows(.*)',
  '/api/projects(.*)',
  '/api/users(.*)',
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth.protect()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!static|.*\\..*|_next|favicon.ico).*)',
    '/',
  ],
} 