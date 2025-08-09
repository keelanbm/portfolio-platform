import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getProjectsWithMetadata } from '@/lib/query-optimizations'
import { withCache, generateCacheKey, CACHE_CONFIGS, CACHE_TAGS } from '@/lib/cache'

// Map homepage categories to database tags
const CATEGORY_TAG_MAPPING: Record<string, string[]> = {
  'Web Design': ['web app', 'website', 'landing page', 'dashboard'],
  'UI/UX': ['ui design', 'ux design', 'interface', 'user experience'],
  'Mobile': ['mobile app', 'mobile', 'ios', 'android'],
  'Branding': ['branding', 'logo design', 'brand identity', 'visual identity'],
  'Typography': ['typography', 'font design', 'lettering', 'hand lettering'],
  'Animation': ['animation', 'motion', 'micro interactions'],
  'Illustration': ['illustration', 'artwork', 'digital art'],
  '3D': ['3d', '3d design', '3d modeling'],
  'Photography': ['photography', 'photo', 'visual'],
  'Dashboard': ['dashboard', 'analytics', 'data visualization'],
  'Landing Page': ['landing page', 'website', 'marketing']
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = performance.now()
  
  try {
    // Make auth optional for discover page
    let userId: string | null = null
    try {
      const authResult = await auth()
      userId = authResult.userId
    } catch {
      // User is not authenticated, which is fine for discover page
      console.log('User not authenticated for discover page')
    }
    
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sortBy = searchParams.get('sort') || 'recent'
    const tag = searchParams.get('tag')
    const tags = searchParams.get('tags')
    const offset = (page - 1) * limit

    // Build where clause
    const where: {
      isPublic: boolean
      tags?: { hasSome: string[] } | { has: string }
    } = {
      isPublic: true,
    }

    // Handle multiple tags (from new frontend) or single tag (legacy)
    if (tags) {
      const tagArray = tags.split(',').filter(t => t.trim() !== '')
      if (tagArray.length > 0) {
        // Expand homepage categories to database tags
        const expandedTags: string[] = []
        for (const tag of tagArray) {
          if (CATEGORY_TAG_MAPPING[tag]) {
            expandedTags.push(...CATEGORY_TAG_MAPPING[tag])
          } else {
            expandedTags.push(tag)
          }
        }
        
        where.tags = {
          hasSome: expandedTags,
        }
      }
    } else if (tag && tag !== 'all') {
      // Expand single tag if it's a homepage category
      const expandedTags = CATEGORY_TAG_MAPPING[tag] || [tag]
      where.tags = {
        hasSome: expandedTags,
      }
    }

    // Build order by clause
    const orderBy: {
      createdAt?: 'asc' | 'desc'
      likeCount?: 'asc' | 'desc'
    } = {}
    switch (sortBy) {
      case 'recent':
        orderBy.createdAt = 'desc'
        break
      case 'popular':
      case 'likes':
        orderBy.likeCount = 'desc'
        break
      case 'comments':
        // Use like count as proxy for popularity until comment count is available
        orderBy.likeCount = 'desc'
        break
      default:
        // Default to popular for homepage (like count desc, then recent)
        orderBy.likeCount = 'desc'
    }

    // Generate cache key for this query
    const cacheKey = generateCacheKey(`${CACHE_TAGS.DISCOVER}:${CACHE_TAGS.PROJECTS}`, {
      page,
      limit,
      sortBy,
      tags: tags || '',
      tag: tag || '',
      userId: userId || 'anonymous',
    })

    // Get projects with caching
    const cachedResult = await withCache(
      cacheKey,
      async () => {
        const [formattedProjects, total] = await Promise.all([
          getProjectsWithMetadata({
            where,
            orderBy,
            take: limit,
            skip: offset,
            userId,
          }),
          prisma.project.count({ where }),
        ])
        
        return { projects: formattedProjects, total }
      },
      // Use shorter cache for authenticated users, longer for anonymous
      userId ? CACHE_CONFIGS.SHORT : CACHE_CONFIGS.MEDIUM
    )

    const { projects: formattedProjects, total } = cachedResult

    // Log performance
    const duration = performance.now() - startTime
    if (duration > 1000) {
      console.warn(`⚠️  Discover API took ${duration.toFixed(2)}ms`)
    }

    return NextResponse.json({
      projects: formattedProjects,
      hasMore: offset + limit < total,
      total,
      page,
      limit,
    })
  } catch (error) {
    const duration = performance.now() - startTime
    console.error('Error fetching discover feed:', error, `(${duration.toFixed(2)}ms)`)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 