'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Image as ImageIcon } from 'lucide-react'
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
}

interface SearchResultsProps {
  query: string
}

export function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        // const data = await response.json()
        
        // Mock data for now
        const mockResults: SearchResult[] = [
          {
            id: '1',
            type: 'project',
            title: 'Modern Web Design',
            description: 'A clean and modern web design project showcasing minimalist principles',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
            tags: ['web design', 'minimalist', 'modern'],
            username: 'johndoe',
            userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            createdAt: '2024-01-15'
          },
          {
            id: '2',
            type: 'user',
            title: 'John Doe',
            username: 'johndoe',
            userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            description: 'UI/UX Designer passionate about creating beautiful digital experiences'
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
  }, [query])

  const projectResults = results.filter(result => result.type === 'project')
  const userResults = results.filter(result => result.type === 'user')

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
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
      <div className="text-center py-12">
        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No results found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search terms or browse our discover page for inspiration
        </p>
        <Button asChild className="mt-4">
          <Link href="/discover">Browse Discover</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All ({results.length})
          </TabsTrigger>
          <TabsTrigger value="projects">
            Projects ({projectResults.length})
          </TabsTrigger>
          <TabsTrigger value="users">
            Users ({userResults.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {results.map((result) => (
            <SearchResultCard key={result.id} result={result} />
          ))}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          {projectResults.map((result) => (
            <SearchResultCard key={result.id} result={result} />
          ))}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
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
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
              {result.image ? (
                <img 
                  src={result.image} 
                  alt={result.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold truncate">
                  <Link href={`/project/${result.id}`} className="hover:underline">
                    {result.title}
                  </Link>
                </h3>
              </div>
              {result.description && (
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {result.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={result.userAvatar} />
                    <AvatarFallback>
                      {result.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    by {result.username}
                  </span>
                </div>
                {result.tags && result.tags.length > 0 && (
                  <div className="flex space-x-1">
                    {result.tags.slice(0, 2).map((tag) => (
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

  if (result.type === 'user') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={result.userAvatar} />
              <AvatarFallback className="text-lg">
                {result.title?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold">
                  <Link href={`/profile/${result.username}`} className="hover:underline">
                    {result.title}
                  </Link>
                </h3>
                <Badge variant="outline">@{result.username}</Badge>
              </div>
              {result.description && (
                <p className="text-muted-foreground text-sm mb-3">
                  {result.description}
                </p>
              )}
              <Button size="sm" variant="outline">
                Follow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
} 