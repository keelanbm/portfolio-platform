'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, ArrowRight, ArrowLeft, Lightbulb } from 'lucide-react'

interface TourStep {
  id: string
  target: string // CSS selector
  title: string
  content: string
  position: 'top' | 'bottom' | 'left' | 'right'
  action?: {
    text: string
    handler: () => void
  }
}

interface FeatureTourProps {
  tourId: string
  steps: TourStep[]
  onComplete?: () => void
  autoStart?: boolean
}

export function FeatureTour({ 
  tourId, 
  steps, 
  onComplete, 
  autoStart = false 
}: FeatureTourProps) {
  const { isSignedIn } = useUser()
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [, setTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  // Check if tour has been completed
  useEffect(() => {
    if (!isSignedIn) return

    const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]')
    const isCompleted = completedTours.includes(tourId)

    if (!isCompleted && autoStart) {
      // Small delay to ensure DOM is ready
      setTimeout(() => startTour(), 1000)
    }
  }, [tourId, autoStart, isSignedIn])

  // Update tooltip position when step changes
  useEffect(() => {
    if (!isActive || !steps[currentStep]) return

    const step = steps[currentStep]
    const element = document.querySelector(step.target) as HTMLElement

    if (element) {
      setTargetElement(element)
      updateTooltipPosition(element, step.position)
      
      // Highlight the target element
      element.style.position = 'relative'
      element.style.zIndex = '1000'
      element.classList.add('feature-tour-highlight')
    }

    return () => {
      // Clean up highlighting
      if (element) {
        element.style.position = ''
        element.style.zIndex = ''
        element.classList.remove('feature-tour-highlight')
      }
    }
  }, [isActive, currentStep, steps])

  const updateTooltipPosition = (element: HTMLElement, position: string) => {
    const rect = element.getBoundingClientRect()
    const tooltipWidth = 320
    const tooltipHeight = 200
    const offset = 16

    let top = 0
    let left = 0

    switch (position) {
      case 'top':
        top = rect.top - tooltipHeight - offset + window.scrollY
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2) + window.scrollX
        break
      case 'bottom':
        top = rect.bottom + offset + window.scrollY
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2) + window.scrollX
        break
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2) + window.scrollY
        left = rect.left - tooltipWidth - offset + window.scrollX
        break
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2) + window.scrollY
        left = rect.right + offset + window.scrollX
        break
    }

    // Keep tooltip within viewport bounds
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    if (left < 0) left = offset
    if (left + tooltipWidth > viewportWidth) left = viewportWidth - tooltipWidth - offset
    if (top < 0) top = offset
    if (top + tooltipHeight > viewportHeight + window.scrollY) {
      top = viewportHeight + window.scrollY - tooltipHeight - offset
    }

    setTooltipPosition({ top, left })
  }

  const startTour = () => {
    setIsActive(true)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTour()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeTour = () => {
    setIsActive(false)
    
    // Mark tour as completed
    const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]')
    if (!completedTours.includes(tourId)) {
      completedTours.push(tourId)
      localStorage.setItem('completedTours', JSON.stringify(completedTours))
    }

    onComplete?.()
  }

  const skipTour = () => {
    completeTour()
  }

  if (!isActive || !steps[currentStep]) return null

  const step = steps[currentStep]

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 pointer-events-none" />
      
      {/* Tooltip */}
      <Card 
        className="fixed z-50 w-80 shadow-xl border-accent-primary/20"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <Lightbulb className="h-3 w-3 text-accent-primary" />
              </div>
              <span className="text-xs font-medium text-accent-primary">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={skipTour}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <h3 className="font-semibold text-text-primary mb-2">{step.title}</h3>
          <p className="text-sm text-text-secondary mb-4">{step.content}</p>

          {step.action && (
            <div className="mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={step.action.handler}
                className="w-full"
              >
                {step.action.text}
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep 
                      ? 'bg-accent-primary' 
                      : index < currentStep 
                        ? 'bg-accent-primary/50'
                        : 'bg-background-tertiary'
                  }`}
                />
              ))}
            </div>

            <Button size="sm" onClick={nextStep}>
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add CSS for highlighting */}
      <style jsx global>{`
        .feature-tour-highlight {
          outline: 2px solid var(--accent-primary) !important;
          outline-offset: 2px;
          border-radius: 6px;
        }
      `}</style>
    </>
  )
}

// Predefined tour configurations
export const HOMEPAGE_TOUR: TourStep[] = [
  {
    id: 'search',
    target: '[data-tour="search"]',
    title: 'Search & Discover',
    content: 'Use the search bar to find projects, designers, and inspiration. Try searching for "web design" or "mobile app".',
    position: 'bottom'
  },
  {
    id: 'categories',
    target: '[data-tour="categories"]',
    title: 'Browse by Category',
    content: 'Filter projects by design categories like UI/UX, Branding, or Animation to find exactly what you\'re looking for.',
    position: 'bottom'
  },
  {
    id: 'project-card',
    target: '[data-tour="project-card"]:first-child',
    title: 'Project Interactions',
    content: 'Hover over projects to see interaction buttons. You can like, save, and view project details.',
    position: 'right'
  }
]

export const DASHBOARD_TOUR: TourStep[] = [
  {
    id: 'create-project',
    target: '[data-tour="create-project"]',
    title: 'Create Your First Project',
    content: 'Ready to share your work? Click here to upload your first design project to the community.',
    position: 'bottom',
    action: {
      text: 'Start Creating',
      handler: () => window.location.href = '/create'
    }
  },
  {
    id: 'notifications',
    target: '[data-tour="notifications"]',
    title: 'Stay Updated',
    content: 'Check your notifications for likes, comments, and follows from the community.',
    position: 'bottom'
  },
  {
    id: 'saved-projects',
    target: '[data-tour="saved"]',
    title: 'Your Saved Projects',
    content: 'Access all the projects you\'ve bookmarked for future reference and inspiration.',
    position: 'bottom'
  }
]