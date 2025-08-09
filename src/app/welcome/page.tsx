'use client'

import { useState, useEffect } from 'react'
import { useUser, RedirectToSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Palette, 
  Upload, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Users,
  Heart,
  MessageSquare,
} from 'lucide-react'
import { showToast } from '@/lib/toast'

// Predefined interest tags for onboarding
const INTEREST_TAGS = [
  'Web Design', 'UI/UX', 'Mobile', 'Branding', 'Typography', 'Animation',
  'Illustration', '3D', 'Photography', 'Dashboard', 'Landing Page',
  'Logo Design', 'Print Design', 'Product Design', 'Graphic Design'
]

interface OnboardingState {
  step: number
  profile: {
    displayName: string
    bio: string
    website: string
    location: string
    interests: string[]
  }
  goals: {
    purpose: 'showcase' | 'network' | 'feedback' | 'inspiration' | ''
    experience: 'beginner' | 'intermediate' | 'expert' | ''
  }
  completed: boolean
}

const TOTAL_STEPS = 4

export default function WelcomePage() {
  const { isSignedIn, user, isLoaded } = useUser()
  const router = useRouter()
  
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    step: 1,
    profile: {
      displayName: '',
      bio: '',
      website: '',
      location: '',
      interests: []
    },
    goals: {
      purpose: '',
      experience: ''
    },
    completed: false
  })

  const [loading, setLoading] = useState(false)

  // Initialize with user data
  useEffect(() => {
    if (isSignedIn && user) {
      setOnboardingState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          displayName: user.fullName || user.firstName || '',
        }
      }))
    }
  }, [isSignedIn, user])

  // Check if user has already completed onboarding
  useEffect(() => {
    if (typeof window !== 'undefined' && isSignedIn) {
      const completed = localStorage.getItem('onboardingCompleted')
      if (completed === 'true') {
        router.push('/dashboard')
      }
    }
  }, [isSignedIn, router])

  const updateState = (updates: Partial<OnboardingState>) => {
    setOnboardingState(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (onboardingState.step < TOTAL_STEPS) {
      updateState({ step: onboardingState.step + 1 })
    }
  }

  const prevStep = () => {
    if (onboardingState.step > 1) {
      updateState({ step: onboardingState.step - 1 })
    }
  }

  const toggleInterest = (interest: string) => {
    const interests = onboardingState.profile.interests.includes(interest)
      ? onboardingState.profile.interests.filter(i => i !== interest)
      : [...onboardingState.profile.interests, interest]
    
    updateState({
      profile: { ...onboardingState.profile, interests }
    })
  }

  const completeOnboarding = async () => {
    setLoading(true)
    try {
      // Save onboarding data to localStorage and potentially API
      localStorage.setItem('onboardingCompleted', 'true')
      localStorage.setItem('onboardingData', JSON.stringify(onboardingState))
      
      // In a real implementation, you'd also save to your user profile API
      showToast.success('🎉 Welcome aboard!', 'Your profile is all set up. Let\'s start creating!')
      
      // Redirect to dashboard or create project page
      router.push('/create')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      showToast.error('Setup Error', 'There was an issue setting up your profile. You can complete this later in settings.')
    } finally {
      setLoading(false)
    }
  }

  const skipOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true')
    router.push('/dashboard')
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />
  }

  const progress = (onboardingState.step / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header with Progress */}
      <div className="border-b border-border-primary bg-background-secondary/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-accent-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">Welcome to HiFi Design!</h1>
                <p className="text-sm text-text-secondary">Let&apos;s get you set up in just a few steps</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={skipOnboarding}>
              Skip for now
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-text-secondary">
              <span>Step {onboardingState.step} of {TOTAL_STEPS}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            {/* Step 1: Profile Setup */}
            {onboardingState.step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <User className="h-12 w-12 mx-auto mb-4 text-accent-primary" />
                  <CardTitle className="text-2xl mb-2">Let&apos;s set up your profile</CardTitle>
                  <CardDescription className="text-base">
                    This information helps other designers discover and connect with you
                  </CardDescription>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-center mb-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback className="text-xl">
                        {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name *</Label>
                    <Input
                      id="displayName"
                      value={onboardingState.profile.displayName}
                      onChange={(e) => updateState({
                        profile: { ...onboardingState.profile, displayName: e.target.value }
                      })}
                      placeholder="How should we display your name?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={onboardingState.profile.bio}
                      onChange={(e) => updateState({
                        profile: { ...onboardingState.profile, bio: e.target.value }
                      })}
                      placeholder="Tell us a bit about yourself and your design work..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website/Portfolio</Label>
                      <Input
                        id="website"
                        value={onboardingState.profile.website}
                        onChange={(e) => updateState({
                          profile: { ...onboardingState.profile, website: e.target.value }
                        })}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={onboardingState.profile.location}
                        onChange={(e) => updateState({
                          profile: { ...onboardingState.profile, location: e.target.value }
                        })}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={nextStep}
                    disabled={!onboardingState.profile.displayName.trim()}
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Interests */}
            {onboardingState.step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Palette className="h-12 w-12 mx-auto mb-4 text-accent-secondary" />
                  <CardTitle className="text-2xl mb-2">What are you interested in?</CardTitle>
                  <CardDescription className="text-base">
                    Select your design interests to personalize your experience
                  </CardDescription>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {INTEREST_TAGS.map((interest) => (
                    <Badge
                      key={interest}
                      variant={onboardingState.profile.interests.includes(interest) ? "default" : "secondary"}
                      className={`cursor-pointer py-2 px-3 text-center justify-center transition-all hover:scale-105 ${
                        onboardingState.profile.interests.includes(interest)
                          ? 'bg-accent-primary text-white'
                          : 'hover:bg-accent-primary/10'
                      }`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={nextStep}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Goals */}
            {onboardingState.step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-accent-primary" />
                  <CardTitle className="text-2xl mb-2">What brings you here?</CardTitle>
                  <CardDescription className="text-base">
                    Understanding your goals helps us customize your experience
                  </CardDescription>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">What&apos;s your main purpose?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { value: 'showcase', label: 'Showcase my work', icon: Upload },
                        { value: 'network', label: 'Network with designers', icon: Users },
                        { value: 'feedback', label: 'Get feedback', icon: MessageSquare },
                        { value: 'inspiration', label: 'Find inspiration', icon: Heart },
                      ].map(({ value, label, icon: Icon }) => (
                        <div
                          key={value}
                          className={`p-4 border rounded-lg cursor-pointer transition-all hover:scale-105 ${
                            onboardingState.goals.purpose === value
                              ? 'border-accent-primary bg-accent-primary/5'
                              : 'border-border-primary hover:border-accent-primary/50'
                          }`}
                          onClick={() => updateState({
                            goals: { ...onboardingState.goals, purpose: value as OnboardingState['goals']['purpose'] }
                          })}
                        >
                          <Icon className="h-6 w-6 mb-2 text-accent-primary" />
                          <p className="font-medium text-text-primary">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">What&apos;s your design experience?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { value: 'beginner', label: 'Just starting out' },
                        { value: 'intermediate', label: 'Some experience' },
                        { value: 'expert', label: 'Professional designer' },
                      ].map(({ value, label }) => (
                        <div
                          key={value}
                          className={`p-3 border rounded-lg cursor-pointer text-center transition-all hover:scale-105 ${
                            onboardingState.goals.experience === value
                              ? 'border-accent-primary bg-accent-primary/5'
                              : 'border-border-primary hover:border-accent-primary/50'
                          }`}
                          onClick={() => updateState({
                            goals: { ...onboardingState.goals, experience: value as OnboardingState['goals']['experience'] }
                          })}
                        >
                          <p className="font-medium text-text-primary">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={nextStep}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Welcome & Features */}
            {onboardingState.step === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <CardTitle className="text-2xl mb-2">You&apos;re all set! 🎉</CardTitle>
                  <CardDescription className="text-base">
                    Here&apos;s what you can do on HiFi Design
                  </CardDescription>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: Upload,
                      title: 'Upload Projects',
                      description: 'Share your design work with the community'
                    },
                    {
                      icon: Heart,
                      title: 'Like & Save',
                      description: 'Show appreciation and bookmark favorites'
                    },
                    {
                      icon: MessageSquare,
                      title: 'Comment & Discuss',
                      description: 'Get feedback and join conversations'
                    },
                    {
                      icon: Users,
                      title: 'Follow Creators',
                      description: 'Stay updated with your favorite designers'
                    }
                  ].map(({ icon: Icon, title, description }) => (
                    <div key={title} className="p-4 border border-border-primary rounded-lg">
                      <Icon className="h-8 w-8 mb-3 text-accent-primary" />
                      <h3 className="font-semibold text-text-primary mb-1">{title}</h3>
                      <p className="text-sm text-text-secondary">{description}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={completeOnboarding} disabled={loading} size="lg">
                    {loading ? 'Setting up...' : 'Start Creating!'} 
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}