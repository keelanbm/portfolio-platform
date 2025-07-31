import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sortBy = searchParams.get('sort') || 'recent'
    const tag = searchParams.get('tag')
    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {
      isPublic: true,
    }

    if (tag && tag !== 'all') {
      where.tags = {
        has: tag,
      }
    }

    // Build order by clause
    let orderBy: any = {}
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
        // TODO: Add comment count when comments system is implemented
        orderBy.createdAt = 'desc'
        break
      default:
        orderBy.createdAt = 'desc'
    }

    // Get projects
    const projects = await prisma.project.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        slides: {
          orderBy: { slideOrder: 'asc' },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy,
      take: limit,
      skip: offset,
    })

    // Get total count for pagination
    const total = await prisma.project.count({ where })

    // Check if current user has liked each project and is following each user
    const projectIds = projects.map(p => p.id)
    const userIds = projects.map(p => p.user.id)

    let userLikes: any[] = []
    let userFollows: any[] = []

    if (userId) {
      [userLikes, userFollows] = await Promise.all([
        prisma.like.findMany({
          where: {
            userId: userId,
            projectId: { in: projectIds },
          },
        }),
        prisma.follow.findMany({
          where: {
            followerId: userId,
            followingId: { in: userIds },
          },
        }),
      ])
    }

    const likedProjectIds = new Set(userLikes.map(like => like.projectId))
    const followedUserIds = new Set(userFollows.map(follow => follow.followingId))

    // Format the response
    const formattedProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      coverImage: project.coverImageUrl,
      images: project.slides.map(slide => slide.imageUrl),
      tags: project.tags,
      likes: project._count.likes,
      comments: 0, // TODO: Add comments system
      createdAt: project.createdAt.toISOString(),
      user: {
        id: project.user.id,
        username: project.user.username,
        name: project.user.displayName || project.user.username,
        avatar: project.user.avatarUrl,
        isFollowing: followedUserIds.has(project.user.id),
      },
      isLiked: likedProjectIds.has(project.id),
    }))

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