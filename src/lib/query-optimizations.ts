// Database query optimization utilities

import { prisma } from './prisma'

/**
 * Optimized project query for discover/feed pages with proper indexing hints
 */
export async function getProjectsWithMetadata({
  where,
  orderBy,
  take,
  skip,
  userId,
}: {
  where: Record<string, unknown>
  orderBy: Record<string, unknown>
  take: number
  skip: number
  userId?: string | null
}) {
  // Single optimized query that fetches projects with all necessary data
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
        select: {
          imageUrl: true,
          slideOrder: true,
        },
        orderBy: { slideOrder: 'asc' },
        take: 5, // Limit slides to reduce data transfer
      },
      _count: {
        select: {
          likes: true,
          comments: true, // Now available
        },
      },
      // Conditionally include user interactions if authenticated
      ...(userId ? {
        likes: {
          where: { userId },
          select: { id: true },
          take: 1,
        },
      } : {}),
    },
    orderBy,
    take,
    skip,
  })

  // Get user follows in one query if authenticated
  let followedUserIds = new Set<string>()
  if (userId && projects.length > 0) {
    const userIds = projects.map(p => p.user.id)
    const follows = await prisma.follow.findMany({
      where: {
        followerId: userId,
        followingId: { in: userIds },
      },
      select: { followingId: true },
    })
    followedUserIds = new Set(follows.map(f => f.followingId))
  }

  return projects.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    coverImage: project.coverImageUrl,
    images: project.slides.map(slide => slide.imageUrl),
    tags: project.tags,
    likes: project._count.likes,
    comments: project._count.comments,
    createdAt: project.createdAt.toISOString(),
    user: {
      id: project.user.id,
      username: project.user.username,
      name: project.user.displayName || project.user.username,
      avatar: project.user.avatarUrl,
      isFollowing: followedUserIds.has(project.user.id),
    },
    isLiked: userId && project ? ((project as unknown as { likes?: unknown[] }).likes?.length ?? 0) > 0 : false,
  }))
}

/**
 * Optimized comment query with nested replies and like status
 */
export async function getCommentsWithMetadata({
  projectId,
  userId,
  limit = 20,
  offset = 0,
}: {
  projectId: string
  userId?: string | null
  limit?: number
  offset?: number
}) {
  // Get comments with replies in one query
  const comments = await prisma.comment.findMany({
    where: {
      projectId,
      parentId: null, // Only top-level comments
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      project: {
        select: {
          id: true,
          title: true,
        },
      },
      replies: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
          ...(userId ? {
            likes: {
              where: { userId },
              select: { id: true },
              take: 1,
            },
          } : {}),
        },
        orderBy: { createdAt: 'asc' },
      },
      _count: {
        select: {
          replies: true,
          likes: true,
        },
      },
      // Include user's like status if authenticated
      ...(userId ? {
        likes: {
          where: { userId },
          select: { id: true },
          take: 1,
        },
      } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  })

  return comments.map(comment => ({
    ...comment,
    isLiked: userId && comment ? ((comment as unknown as { likes?: unknown[] }).likes?.length ?? 0) > 0 : false,
    replies: comment.replies.map(reply => ({
      ...reply,
      isLiked: userId && reply ? ((reply as unknown as { likes?: unknown[] }).likes?.length ?? 0) > 0 : false,
    })),
  }))
}

/**
 * Batch notification creation for better performance
 */
export async function createNotificationsBatch(notifications: Array<{
  userId: string
  type: string
  title: string
  message: string
  actionUrl?: string
}>) {
  if (notifications.length === 0) return

  try {
    await prisma.notification.createMany({
      data: notifications,
      skipDuplicates: true,
    })
  } catch (error) {
    console.error('Error creating notifications batch:', error)
    // Fallback to individual creation if batch fails
    for (const notification of notifications) {
      try {
        await prisma.notification.create({ data: notification })
      } catch (individualError) {
        console.error('Error creating individual notification:', individualError)
      }
    }
  }
}

/**
 * Get user stats efficiently
 */
export async function getUserStats(userId: string) {
  const [projectCount, followerCount, followingCount, likeCount] = await Promise.all([
    prisma.project.count({ where: { userId, isPublic: true } }),
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } }),
    prisma.like.count({ 
      where: { 
        userId,
        project: { userId } // Only count likes on user's own projects
      } 
    }),
  ])

  return {
    projects: projectCount,
    followers: followerCount,
    following: followingCount,
    likes: likeCount,
  }
}

/**
 * Search with optimized full-text search when available
 */
export async function searchProjects({
  query,
  tags,
  userId,
  limit = 12,
  offset = 0,
}: {
  query?: string
  tags?: string[]
  userId?: string | null
  limit?: number
  offset?: number
}) {
  const where: Record<string, unknown> = {
    isPublic: true,
  }

  // Add text search
  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ]
  }

  // Add tag filtering
  if (tags && tags.length > 0) {
    where.tags = {
      hasSome: tags,
    }
  }

  return getProjectsWithMetadata({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    userId,
  })
}