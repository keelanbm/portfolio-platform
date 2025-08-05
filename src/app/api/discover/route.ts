import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getProjectsWithMetadata } from '@/lib/query-optimizations'

export async function GET(request: NextRequest) {
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
        where.tags = {
          hasSome: tagArray,
        }
      }
    } else if (tag && tag !== 'all') {
      where.tags = {
        has: tag,
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
        orderBy.likeCount = 'desc'
        break
      case 'likes':
        orderBy.likeCount = 'desc'
        break
      case 'comments':
        // Will use actual comment count when comments system is implemented
        orderBy.createdAt = 'desc'
        break
      default:
        orderBy.createdAt = 'desc'
    }

    // Get projects with optimized query
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

    return NextResponse.json({
      projects: formattedProjects,
      hasMore: offset + limit < total,
      total,
      page,
      limit,
    })
  } catch (error) {
    console.error('Error fetching discover feed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 