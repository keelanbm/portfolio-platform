'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { X, Sparkles, User, Palette, Upload, CheckCircle } from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  completed: boolean
  required: boolean
}

export function OnboardingProgress({ 
  className = "",
  compact = false,
  dismissible = true 
}: { 
  className?: string
  compact?: boolean
  dismissible?: boolean
}) {
  const { user, isSignedIn } = useUser()
  const [dismissed, setDismissed] = useState(false)
  const [steps, setSteps] = useState<OnboardingStep[]>([])

  useEffect(() => {
    if (!isSignedIn) return

    // Check completion status
    const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true'
    const dismissedPermanently = localStorage.getItem('onboardingDismissed') === 'true'
    
    if (onboardingCompleted || dismissedPermanently) {
      setDismissed(true)
      return
    }

    // Define onboarding steps
    const allSteps: OnboardingStep[] = [
      {
        id: 'profile',
        title: 'Complete Profile',
        description: 'Add your display name and bio',
        icon: User,
        completed: !!(user?.fullName || user?.firstName) && 
                  localStorage.getItem('onboardingData') !== null,
        required: true
      },
      {
        id: 'interests',
        title: 'Select Interests',
        description: 'Choose your design interests',
        icon: Palette,
        completed: (() => {
          const data = localStorage.getItem('onboardingData')
          if (!data) return false
          try {
            const parsed = JSON.parse(data)
            return parsed.profile?.interests?.length > 0
          } catch {
            return false
          }
        })(),
        required: false
      },
      {
        id: 'first-project',
        title: 'Upload First Project',
        description: 'Share your first design',
        icon: Upload,
        completed: false, // Would need to check via API
        required: false
      }
    ]

    setSteps(allSteps)
  }, [user, isSignedIn])

  const completedSteps = steps.filter(step => step.completed).length
  const totalSteps = steps.length
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0
  const isComplete = completedSteps === totalSteps

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('onboardingDismissed', 'true')
  }

  // Don't show if dismissed, not signed in, or all steps complete
  if (dismissed || !isSignedIn || isComplete) return null

  if (compact) {
    return (
      <Card className={`border-accent-primary/20 bg-accent-primary/5 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-accent-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">Complete your setup</h4>
                <p className="text-sm text-text-secondary">{completedSteps}/{totalSteps} steps done</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button asChild size="sm">
                <Link href="/welcome">Continue</Link>
              </Button>
              {dismissible && (
                <Button variant="ghost" size="sm" onClick={handleDismiss}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <Progress value={progress} className="mt-3" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border-accent-primary/20 bg-accent-primary/5 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-accent-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Welcome to HiFi Design!</CardTitle>
              <CardDescription>Complete your setup to get the most out of the platform</CardDescription>
            </div>
          </div>
          {dismissible && (
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-text-secondary">
            <span>{completedSteps} of {totalSteps} steps completed</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-background-tertiary/50">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-background-tertiary text-text-muted'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-text-primary">{step.title}</h4>
                    {step.required && !step.completed && (
                      <Badge variant="secondary" className="text-xs">Required</Badge>
                    )}
                    {step.completed && (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-700">Done</Badge>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex space-x-3">
          <Button asChild className="flex-1">
            <Link href="/welcome">
              Complete Setup
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleDismiss}>
            Maybe later
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}