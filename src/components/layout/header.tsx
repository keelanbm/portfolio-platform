'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserButton, SignInButton, useUser } from '@clerk/nextjs'
import { Plus, Search, Menu } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function Header() {
  const { isSignedIn, user } = useUser()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="border-b border-border-primary bg-background-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-background-secondary/60 sticky top-0 z-50">
      <div className="w-full px-6 flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary" />
            <span className="text-xl font-bold text-text-primary">PortfolioHub</span>
          </Link>
        </div>

        {/* Permanent Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-auto px-8">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects, creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full bg-background-tertiary border-border-primary text-text-primary placeholder:text-text-muted"
              />
            </div>
          </form>
        </div>

        {/* Main Navigation - Desktop */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Discover - Always visible */}
          <Link href="/discover" className="text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium">
            Discover
          </Link>

          {/* Feed - Authenticated only */}
          {isSignedIn && (
            <Link href="/feed" className="text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium">
              Feed
            </Link>
          )}

          {/* Profile - Authenticated only */}
          {isSignedIn && (
            <Link href={`/profile/${user?.username || user?.id}`} className="text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium">
              Profile
            </Link>
          )}
        </div>

        {/* Auth Section */}
        <div className="flex-shrink-0 flex items-center space-x-4">
          {isSignedIn ? (
            <>
              {/* Create Button */}
              <Button asChild size="sm" className="btn-primary">
                <Link href="/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Link>
              </Button>

              {/* User Menu - Simplified */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                    <UserButton />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.firstName && user?.lastName && (
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                      )}
                      {user?.primaryEmailAddress && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.primaryEmailAddress.emailAddress}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserButton afterSignOutUrl="/" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-text-secondary hover:text-text-primary hover:bg-background-tertiary">
                  Sign in
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button className="btn-primary">
                  Get started
                </Button>
              </SignInButton>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex-shrink-0">
          <Button variant="ghost" size="sm">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden border-t border-border-primary">
        <div className="w-full px-6 py-2">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                type="text"
                placeholder="Search projects, creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full bg-background-tertiary border-border-primary text-text-primary placeholder:text-text-muted"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  )
} 