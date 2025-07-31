'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserButton, SignInButton, useUser } from '@clerk/nextjs'
import { Plus } from 'lucide-react'

export function Header() {
  const { isSignedIn } = useUser()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600" />
          <span className="text-xl font-bold">PortfolioHub</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/discover" className="text-sm font-medium transition-colors hover:text-primary">
            Discover
          </Link>
          <Link href="/search" className="text-sm font-medium transition-colors hover:text-primary">
            Search
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <>
              <Button asChild size="sm">
                <Link href="/upload">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload
                </Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <SignInButton mode="modal">
                <Button variant="ghost">Sign in</Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button>Get started</Button>
              </SignInButton>
            </div>
          )}
        </div>
      </div>
    </header>
  )
} 