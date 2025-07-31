'use client'

import { redirect } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Shield, Palette } from 'lucide-react'

export default function SettingsPage() {
  const { isSignedIn, user, isLoaded } = useUser()
  
  if (!isLoaded) {
    return (
      <div className="container mx-auto max-w-4xl px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-background-secondary rounded mb-2"></div>
          <div className="h-4 bg-background-secondary rounded mb-8"></div>
          <div className="space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-background-secondary rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  if (!isSignedIn || !user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto max-w-4xl px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
        <p className="text-text-secondary">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-8">
        {/* Profile Settings */}
        <Card className="portfolio-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-accent-primary" />
              <CardTitle className="text-text-primary">Profile Settings</CardTitle>
            </div>
            <CardDescription className="text-text-secondary">
              Update your profile information and display preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-text-primary">First Name</Label>
                <Input 
                  id="firstName" 
                  defaultValue={user.firstName || ''} 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-text-primary">Last Name</Label>
                <Input 
                  id="lastName" 
                  defaultValue={user.lastName || ''} 
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bio" className="text-text-primary">Bio</Label>
              <Input 
                id="bio" 
                placeholder="Tell us about yourself..." 
                className="mt-1"
              />
            </div>
            <Button className="btn-primary">Save Profile</Button>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="portfolio-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-accent-secondary" />
              <CardTitle className="text-text-primary">Email Settings</CardTitle>
            </div>
            <CardDescription className="text-text-secondary">
              Manage your email preferences and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-text-primary">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue={user.primaryEmailAddress?.emailAddress || ''} 
                className="mt-1"
                disabled
              />
              <p className="text-sm text-text-muted mt-1">Email address is managed by your authentication provider</p>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-text-primary">New Follower Notifications</Label>
                  <p className="text-sm text-text-secondary">Get notified when someone follows you</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-text-primary">Like Notifications</Label>
                  <p className="text-sm text-text-secondary">Get notified when someone likes your work</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="portfolio-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-accent-success" />
              <CardTitle className="text-text-primary">Privacy Settings</CardTitle>
            </div>
            <CardDescription className="text-text-secondary">
              Control your privacy and data settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-text-primary">Public Profile</Label>
                  <p className="text-sm text-text-secondary">Allow others to view your profile and projects</p>
                </div>
                <Button variant="outline" size="sm">Public</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-text-primary">Show Email</Label>
                  <p className="text-sm text-text-secondary">Display your email address on your profile</p>
                </div>
                <Button variant="outline" size="sm">Private</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="portfolio-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-accent-warning" />
              <CardTitle className="text-text-primary">Theme Settings</CardTitle>
            </div>
            <CardDescription className="text-text-secondary">
              Customize your viewing experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-text-primary">Theme</Label>
                <p className="text-sm text-text-secondary">Choose your preferred theme</p>
              </div>
              <Button variant="outline" size="sm">Dark</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="portfolio-card border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-500">Danger Zone</CardTitle>
            <CardDescription className="text-text-secondary">
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-red-500">Delete Account</Label>
                <p className="text-sm text-text-secondary">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" size="sm">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 