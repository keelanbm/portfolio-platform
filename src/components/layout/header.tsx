'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserButton, SignInButton, useUser } from '@clerk/nextjs'
import { Search, Menu, User, Clock, TrendingUp } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { NotificationsDropdown } from './notifications-dropdown'
import { isFeatureEnabled } from '@/lib/features'

export function Header() {
  const { isSignedIn, user } = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Popular search suggestions
  const popularSearches = [
    'web design', 'mobile app', 'ui/ux', 'branding', 
    'illustration', 'typography', 'dashboard', 'landing page'
  ]

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Save search to recent searches
  const saveSearch = (query: string) => {
    if (!query.trim()) return
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // Handle search submission
  const handleSearch = (e: React.FormEvent, query?: string) => {
    e.preventDefault()
    const searchTerm = query || searchQuery.trim()
    if (searchTerm) {
      saveSearch(searchTerm)
      setShowSuggestions(false)
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    handleSearch({ preventDefault: () => {} } as React.FormEvent, suggestion)
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="border-b border-border-primary bg-background-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-background-secondary/60 sticky top-0 z-50">
      <div className="w-full px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary" />
            <span className="text-xl font-bold text-text-primary">PortfolioHub</span>
          </Link>
        </div>

        {/* Enhanced Search Bar - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-md mx-auto relative" ref={searchRef}>
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects, creators..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(e.target.value.length > 0)
                }}
                onFocus={() => setShowSuggestions(true)}
                className="pl-10 pr-4 w-full bg-background-tertiary border-border-primary text-text-primary placeholder:text-text-muted"
              />
            </div>
          </form>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (
            <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-background-secondary border-border-primary shadow-lg">
              <CardContent className="p-0">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="p-3 border-b border-border-primary">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-text-muted" />
                      <span className="text-sm font-medium text-text-secondary">Recent searches</span>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(search)}
                          className="w-full text-left px-2 py-1.5 text-sm text-text-primary hover:bg-background-tertiary rounded-md transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-text-muted" />
                    <span className="text-sm font-medium text-text-secondary">Popular searches</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {popularSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleSuggestionClick(search)}
                        className="px-2 py-1 text-xs bg-background-tertiary text-text-primary hover:bg-accent-primary hover:text-white rounded-full transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Navigation - Desktop */}
        <div className="hidden lg:flex items-center space-x-6">
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

          {/* Saved - Authenticated only */}
          {isSignedIn && (
            <Link href="/saved" className="text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium" data-tour="saved">
              Saved
            </Link>
          )}

          {/* Collections - Authenticated only */}
          {isSignedIn && (
            <Link href="/collections" className="text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium">
              Collections
            </Link>
          )}
        </div>

        {/* Auth Section */}
        <div className="flex-shrink-0 flex items-center space-x-4">
          {isSignedIn ? (
            <>
              {/* Notifications - Feature flagged */}
              {isFeatureEnabled('notifications') && <NotificationsDropdown />}
              
              {/* Combined Profile Button & Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 h-9 px-3 rounded-full hover:bg-background-tertiary">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
                      <AvatarFallback className="text-xs">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-text-primary">
                      {user?.firstName || user?.username}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-3 p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
                      <AvatarFallback>
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.firstName && user?.lastName && (
                        <p className="font-medium text-text-primary">{user.firstName} {user.lastName}</p>
                      )}
                      {user?.primaryEmailAddress && (
                        <p className="w-[200px] truncate text-sm text-text-secondary">
                          {user.primaryEmailAddress.emailAddress}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user?.username || user?.id}`} className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="p-3">
                    <UserButton 
                      afterSignOutUrl="/" 
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-8 h-8",
                          userButtonPopoverCard: "bg-background-secondary border-border-primary",
                          userButtonPopoverActionButton: "text-text-primary hover:bg-background-tertiary",
                          userButtonPopoverActionButtonText: "text-text-primary",
                          userButtonPopoverFooter: "hidden",
                        }
                      }}
                    />
                  </div>
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
        <div className="lg:hidden flex-shrink-0">
          <Button variant="ghost" size="sm">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden border-t border-border-primary">
        <div className="w-full px-6 py-3">
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