'use client'

import { ReactNode } from 'react'
import Masonry from 'react-masonry-css'

interface MasonryGridProps {
  children: ReactNode
  className?: string
  columnClassName?: string
}

export function MasonryGrid({ 
  children, 
  className = '', 
  columnClassName = '' 
}: MasonryGridProps) {
  // Responsive breakpoints for columns - Larger cards with fewer columns
  const breakpointColumnsObj = {
    default: 3,      // 3 columns on large screens
    1536: 4,         // 4 columns on 2xl screens
    1280: 3,         // 3 columns on xl screens
    1024: 3,         // 3 columns on lg screens
    768: 2,          // 2 columns on md screens
    640: 1,          // 1 column on sm screens
  }

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className={`masonry-grid ${className}`}
      columnClassName={`masonry-grid-column ${columnClassName}`}
    >
      {children}
    </Masonry>
  )
}

// Masonry Grid Item wrapper for consistent styling
export function MasonryGridItem({ 
  children, 
  className = '' 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={`masonry-grid-item ${className}`}>
      {children}
    </div>
  )
}