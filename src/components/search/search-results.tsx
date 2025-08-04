'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Image as ImageIcon, Filter, Calendar, User, Heart } from 'lucide-react'
import Link from 'next/link'

interface SearchResult {
  id: string
  type: 'project' | 'user'
  title: string
  description?: string
  image?: string
  tags?: string[]
  username?: string
  userAvatar?: string
  createdAt?: string
  likes?: number
  followers?: number
}

interface SearchResultsProps {
  query: string
}

export function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&sort=${sortBy}`)
        // const data = await response.json()
        
        // Mock data for now
        const mockResults: SearchResult[] = [
          {
            id: '1',
            type: 'project',
            title: 'Modern Web Design',
            description: 'A clean and modern web design project showcasing minimalist principles and user-centered design.',
            image: 'https://picsum.photos/800/600?random=1',
            tags: ['web design', 'minimalist', 'modern'],
            username: 'johndoe',
            userAvatar: 'https://picsum.photos/100/100?random=10',
            createdAt: '2024-01-15',
            likes: 42
          },
          {
            id: '2',
            type: 'user',
            title: 'John Doe',
            username: 'johndoe',
            userAvatar: 'https://picsum.photos/100/100?random=10',
            description: 'UI/UX Designer passionate about creating beautiful digital experiences',
            followers: 1247
          },
          {
            id: '3',
            type: 'project',
            title: 'Mobile App UI Kit',
            description: 'Complete UI kit for mobile applications with 50+ components and dark/light themes.',
            image: 'https://picsum.photos/800/600?random=2',
            tags: ['mobile', 'ui kit', 'components'],
            username: 'janedoe',
            userAvatar: 'https://picsum.photos/100/100?random=11',
            createdAt: '2024-01-14',
            likes: 128
          },
          {
            id: '4',
            type: 'user',
            title: 'Jane Doe',
            username: 'janedoe',
            userAvatar: 'https://picsum.photos/100/100?random=11',
            description: 'Product Designer focused on creating intuitive user experiences',
            followers: 892
          }
        ]
        
        setResults(mockResults)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (query.trim()) {
      fetchResults()
    }
  }, [query, sortBy])

  const projectResults = results.filter(result => result.type === 'project')
  const userResults = results.filter(result => result.type === 'user')

  const sortOptions = [
    { value: 'recent', label: 'Most Recent', icon: Calendar },
    { value: 'popular', label: 'Most Popular', icon: Heart },
    { value: 'relevance', label: 'Most Relevant', icon: Search }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-background-tertiary rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-background-tertiary rounded w-3/4" />
                  <div className="h-3 bg-background-tertiary rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <Search className="h-16 w-16 text-text-muted mx-auto mb-6" />
        <h3 className="text-xl font-semibold mb-3 text-text-primary">No results found</h3>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          Try adjusting your search terms or browse our discover page for inspiration
        </p>
        <div className="space-y-4">
          <Button asChild className="btn-primary">
            <Link href="/discover">Browse Discover</Link>
          </Button>
          <div className="text-sm text-text-muted">
            <p>Try searching for:</p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {['web design', 'mobile app', 'ui/ux', 'branding'].map((term) => (
                <a
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-3 py-1 text-sm bg-background-tertiary text-text-primary hover:bg-accent-primary hover:text-white rounded-full transition-colors"
                >
                  {term}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-text-muted" />
          <span className="text-sm font-medium text-text-secondary">Sort by:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => {
            const Icon = option.icon
            return (
              <Button
                key={option.value}
                variant={sortBy === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(option.value)}
                className="text-sm"
              >
                <Icon className="h-3 w-3 mr-1" />
                {option.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Results Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-background-secondary border-border-primary">
          <TabsTrigger value="all" className="text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-background-tertiary">
            All ({results.length})
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-background-tertiary">
            Projects ({projectResults.length})
          </TabsTrigger>
          <TabsTrigger value="users" className="text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-background-tertiary">
            Users ({userResults.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6 mt-6">
          {results.map((result) => (
            <SearchResultCard key={result.id} result={result} />
          ))}
        </TabsContent>

        <TabsContent value="projects" className="space-y-6 mt-6">
          {projectResults.map((result) => (
            <SearchResultCard key={result.id} result={result} />
          ))}
        </TabsContent>

        <TabsContent value="users" className="space-y-6 mt-6">
          {userResults.map((result) => (
            <SearchResultCard key={result.id} result={result} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SearchResultCard({ result }: { result: SearchResult }) {
  if (result.type === 'project') {
    return (
      <Card className="hover:shadow-lg transition-all duration-200 group bg-background-secondary border-border-primary">
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-background-tertiary rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {result.image ? (
                <img 
                  src={result.image} 
                  alt={result.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-text-muted" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    <Link href={`/project/${result.id}`} className="hover:text-accent-primary transition-colors">
                      {result.title}
                    </Link>
                  </h3>
                  {result.description && (
                    <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                      {result.description}
                    </p>
                  )}
                </div>
                {result.likes && (
                  <div className="flex items-center space-x-1 text-sm text-text-muted ml-4">
                    <Heart className="h-4 w-4" />
                    <span>{result.likes}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={result.userAvatar} />
                    <AvatarFallback className="text-xs">
                      {result.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-text-muted" />
                    <span className="text-sm text-text-secondary">
                      by {result.username}
                    </span>
                  </div>
                </div>
                {result.tags && result.tags.length > 0 && (
                  <div className="flex space-x-2">
                    {result.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // User result
  return (
    <Card className="hover:shadow-lg transition-all duration-200 group bg-background-secondary border-border-primary">
      <CardContent className="p-6">
        <div className="flex items-center space-x-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={result.userAvatar} />
            <AvatarFallback className="text-lg">
              {result.title?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold mb-1">
                  <Link href={`/profile/${result.username}`} className="hover:text-accent-primary transition-colors">
                    {result.title}
                  </Link>
                </h3>
                <p className="text-sm text-text-muted mb-2">@{result.username}</p>
                {result.description && (
                  <p className="text-text-secondary text-sm line-clamp-2">
                    {result.description}
                  </p>
                )}
              </div>
              {result.followers && (
                <div className="flex items-center space-x-1 text-sm text-text-muted ml-4">
                  <User className="h-4 w-4" />
                  <span>{result.followers} followers</span>
                </div>
              )}
            </div>
            <Button asChild variant="outline" size="sm" className="btn-secondary">
              <Link href={`/profile/${result.username}`}>View Profile</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 