'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Component that redirects new users to onboarding if they haven't completed it
 * Should be placed in the main layout or specific pages where onboarding redirect is needed
 */
export function OnboardingRedirect() {
  const { user, isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    // Don't redirect if already on onboarding pages
    const onboardingPaths = ['/welcome', '/login', '/signup', '/sign-in', '/sign-up']
    if (onboardingPaths.some(path => pathname.startsWith(path))) return

    // Check if onboarding is completed
    const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true'
    const onboardingDismissed = localStorage.getItem('onboardingDismissed') === 'true'

    // If user just signed up (has no onboarding data and hasn't dismissed)
    if (!onboardingCompleted && !onboardingDismissed) {
      // Check if this is a very new user (created in last 24 hours)
      // We can't check exact creation time from Clerk easily, so we use localStorage absence as a proxy
      const hasVisitedBefore = localStorage.getItem('hasVisited') === 'true'
      
      if (!hasVisitedBefore) {
        // Mark that they've visited to prevent redirect loops
        localStorage.setItem('hasVisited', 'true')
        
        // Small delay to ensure page is loaded
        setTimeout(() => {
          router.push('/welcome')
        }, 500)
      }
    }
  }, [isLoaded, isSignedIn, user, router, pathname])

  // This component doesn't render anything
  return null
}

/**
 * Hook to check onboarding status
 */
export function useOnboardingStatus() {
  const { isSignedIn, isLoaded } = useUser()
  
  if (!isLoaded || !isSignedIn) {
    return {
      isOnboardingCompleted: true, // Don't show onboarding prompts for non-users
      isOnboardingDismissed: false,
      shouldShowOnboarding: false,
      isLoaded: false
    }
  }

  const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true'
  const onboardingDismissed = localStorage.getItem('onboardingDismissed') === 'true'
  const shouldShowOnboarding = !onboardingCompleted && !onboardingDismissed

  return {
    isOnboardingCompleted: onboardingCompleted,
    isOnboardingDismissed: onboardingDismissed,
    shouldShowOnboarding,
    isLoaded: true
  }
}