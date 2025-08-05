'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Image as ImageIcon, Filter, Calendar, User, Heart, ChevronDown, X } from 'lucide-react'
import Link from 'next/link'
import { showToast } from '@/lib/toast'
import { DEFAULT_TAGS } from '@/lib/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

interface SearchResponse {
  projects: SearchResult[]
  users: SearchResult[]
  results: SearchResult[]
  total: number
  hasMore: boolean
  page: number
  limit: number
}

export function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [total, setTotal] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        // Build query parameters
        const params = new URLSearchParams()
        params.append('q', query)
        params.append('type', activeTab)
        params.append('sort', sortBy)
        if (selectedTags.length > 0) {
          params.append('tags', selectedTags.join(','))
        }
        if (dateFilter !== 'all') {
          params.append('dateFilter', dateFilter)
        }

        const response = await fetch(`/api/search?${params.toString()}`)
        if (response.ok) {
          const data: SearchResponse = await response.json()
          setResults(data.results || [])
          setTotal(data.total || 0)
        } else {
          showToast.error('Search failed', 'Unable to search at this time. Please try again.')
          setResults([])
          setTotal(0)
        }
      } catch {
        showToast.error('Search error', 'An error occurred while searching. Please try again.')
        setResults([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }

    if (query.trim()) {
      fetchResults()
    } else {
      setResults([])
      setTotal(0)
      setLoading(false)
    }
  }, [query, sortBy, activeTab, selectedTags, dateFilter])

  const projectResults = results.filter(result => result.type === 'project')
  const userResults = results.filter(result => result.type === 'user')

  const sortOptions = [
    { value: 'recent', label: 'Most Recent', icon: Calendar },
    { value: 'popular', label: 'Most Popular', icon: Heart },
    { value: 'relevance', label: 'Most Relevant', icon: Search }
  ]

  const dateFilterOptions = [
    { value: 'all', label: 'All time' },
    { value: '1d', label: 'Last 24 hours' },
    { value: '1w', label: 'Last week' },
    { value: '1m', label: 'Last month' },
    { value: '3m', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ]

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const clearAllFilters = () => {
    setSelectedTags([])
    setDateFilter('all')
    setSortBy('recent')
  }

  const hasActiveFilters = selectedTags.length > 0 || dateFilter !== 'all' || sortBy !== 'recent'

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
      {/* Advanced Search Filters */}
      <div className="space-y-6">
        {/* Filter Toggle and Clear */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>
          
          {/* Sort Options */}
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

        {/* Expandable Filter Panel */}
        {showFilters && (
          <Card className="p-6 space-y-6 bg-background-secondary border-border-primary">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Date Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-primary">Date Range</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateFilterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tag Filter */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-medium text-text-primary">Tags</label>
                <div className="space-y-3">
                  {/* Selected Tags */}
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <Badge key={tag} variant="default" className="flex items-center gap-1">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Available Tags */}
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_TAGS.filter(tag => !selectedTags.includes(tag)).slice(0, 12).map((tag) => (
                      <Button
                        key={tag}
                        variant="outline"
                        size="sm"
                        onClick={() => addTag(tag)}
                        className="text-xs h-8"
                      >
                        + {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Summary */}
            {hasActiveFilters && (
              <div className="pt-4 border-t border-border-primary">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">
                    {selectedTags.length} tags selected, 
                    {dateFilter !== 'all' ? ` ${dateFilterOptions.find(d => d.value === dateFilter)?.label?.toLowerCase()}` : ' all time'}
                  </span>
                  <span className="text-text-primary font-medium">
                    {total} results found
                  </span>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Results Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-background-secondary border-border-primary">
          <TabsTrigger value="all" className="text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-background-tertiary">
            All ({total > 0 ? total : results.length})
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
            <div className="relative w-24 h-24 bg-background-tertiary rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {result.image ? (
                <Image 
                  src={result.image} 
                  alt={result.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="96px"
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