import { Suspense } from 'react'
import { SearchResults } from '@/components/search/search-results'
import { SearchResultsSkeleton } from '@/components/search/search-results-skeleton'

interface SearchPageProps {
  searchParams: { q?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {query ? `Search results for "${query}"` : 'Search'}
        </h1>
        {query && (
          <p className="text-muted-foreground">
            Find projects and creators related to your search
          </p>
        )}
      </div>

      {query ? (
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-2">Start searching</h2>
            <p className="text-muted-foreground">
              Use the search bar above to find projects, creators, and inspiration
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 