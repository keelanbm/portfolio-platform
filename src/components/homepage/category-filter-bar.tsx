'use client'
import React, { memo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CategoryFilterBarProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  loading?: boolean
  className?: string
}

const HOMEPAGE_CATEGORIES = [
  'Most Popular',
  'Web Design', 
  'UI/UX',
  'Mobile',
  'Branding',
  'Typography',
  'Animation',
  'Illustration',
  '3D',
  'Photography',
  'Dashboard',
  'Landing Page'
] as const

const CategoryFilterBarComponent = ({ 
  selectedTags, 
  onTagsChange, 
  loading = false,
  className = '' 
}: CategoryFilterBarProps) => {
  const handleCategoryClick = (category: string) => {
    if (category === 'Most Popular') {
      // Clear all filters for "Most Popular"
      onTagsChange([])
      return
    }

    // Toggle category selection
    const isSelected = selectedTags.includes(category)
    if (isSelected) {
      onTagsChange(selectedTags.filter(tag => tag !== category))
    } else {
      // For single selection, replace current selection
      onTagsChange([category])
    }
  }

  const isPopularSelected = selectedTags.length === 0

  return (
    <div className={`sticky top-16 z-40 bg-background-primary/95 backdrop-blur supports-[backdrop-filter]:bg-background-primary/80 border-b border-border-primary ${className}`}>
      <div className="px-8 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Horizontal Scrolling Categories */}
          <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
            <div className="flex items-center space-x-3 min-w-max">
              {HOMEPAGE_CATEGORIES.map((category) => {
                const isSelected = category === 'Most Popular' 
                  ? isPopularSelected 
                  : selectedTags.includes(category)
                
                return (
                  <Button
                    key={category}
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleCategoryClick(category)}
                    disabled={loading}
                    className={`
                      whitespace-nowrap text-sm font-medium px-4 py-2 rounded-full transition-all duration-200
                      ${isSelected 
                        ? 'bg-accent-primary text-white shadow-sm' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                      }
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {loading && isSelected ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                        <span>{category}</span>
                      </div>
                    ) : (
                      category
                    )}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Active Filter Indicator */}
          {selectedTags.length > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-primary">
              <span className="text-sm text-text-secondary">Filtered by:</span>
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-background-tertiary transition-colors"
                  onClick={() => handleCategoryClick(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTagsChange([])}
                className="text-xs text-text-muted hover:text-text-primary ml-2"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Memoize the component for performance
export const CategoryFilterBar = memo(CategoryFilterBarComponent)