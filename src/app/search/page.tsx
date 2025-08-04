import { Suspense } from 'react'
import { SearchResults } from '@/components/search/search-results'
import { SearchResultsSkeleton } from '@/components/search/search-results-skeleton'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q || ''

  return (
    <div className="w-full px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-text-primary">
          {query ? `Search results for "${query}"` : 'Search'}
        </h1>
        {query && (
          <p className="text-text-secondary text-lg">
            Find projects and creators related to your search
          </p>
        )}
      </div>

      {query ? (
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      ) : (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-background-tertiary flex items-center justify-center">
              <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-text-primary">Start searching</h2>
            <p className="text-text-secondary mb-6">
              Use the search bar above to find projects, creators, and inspiration
            </p>
            <div className="space-y-2">
              <p className="text-sm text-text-muted">Try searching for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
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
      )}
    </div>
  )
} 