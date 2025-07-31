import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'all' // 'all', 'projects', 'users'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        projects: [],
        users: [],
        total: 0,
        hasMore: false,
      })
    }

    const searchQuery = query.trim()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let projects: any[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let users: any[] = []
    let totalProjects = 0
    let totalUsers = 0

    // Search projects
    if (type === 'all' || type === 'projects') {
      const projectsResult = await prisma.project.findMany({
        where: {
          AND: [
            { isPublic: true },
            {
              OR: [
                { title: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
                { tags: { has: searchQuery } },
              ],
            },
          ],
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
          slides: {
            orderBy: { slideOrder: 'asc' },
            take: 1, // Just get the first slide for cover image
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
        orderBy: {
          likeCount: 'desc',
        },
        take: limit,
        skip: offset,
      })

      totalProjects = await prisma.project.count({
        where: {
          AND: [
            { isPublic: true },
            {
              OR: [
                { title: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
                { tags: { has: searchQuery } },
              ],
            },
          ],
        },
      })

      projects = projectsResult
    }

    // Search users
    if (type === 'all' || type === 'users') {
      const usersResult = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: searchQuery, mode: 'insensitive' } },
            { displayName: { contains: searchQuery, mode: 'insensitive' } },
            { bio: { contains: searchQuery, mode: 'insensitive' } },
          ],
        },
        include: {
          _count: {
            select: {
              projects: true,
              followers: true,
              following: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      })

      totalUsers = await prisma.user.count({
        where: {
          OR: [
            { username: { contains: searchQuery, mode: 'insensitive' } },
            { displayName: { contains: searchQuery, mode: 'insensitive' } },
            { bio: { contains: searchQuery, mode: 'insensitive' } },
          ],
        },
      })

      users = usersResult
    }

    // Check if current user has liked projects and is following users
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userLikes: any[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userFollows: any[] = []

    if (userId) {
      const projectIds = projects.map(p => p.id)
      const userIds = users.map(u => u.id)

      if (projectIds.length > 0) {
        userLikes = await prisma.like.findMany({
          where: {
            userId: userId,
            projectId: { in: projectIds },
          },
        })
      }

      if (userIds.length > 0) {
        userFollows = await prisma.follow.findMany({
          where: {
            followerId: userId,
            followingId: { in: userIds },
          },
        })
      }
    }

    // const likedProjectIds = new Set(userLikes.map(like => like.projectId))
    const followedUserIds = new Set(userFollows.map(follow => follow.followingId))

    // Format projects
    const formattedProjects = projects.map(project => ({
      id: project.id,
      type: 'project' as const,
      title: project.title,
      description: project.description,
      image: project.coverImageUrl,
      tags: project.tags,
      username: project.user.username,
      userAvatar: project.user.avatarUrl,
      createdAt: project.createdAt.toISOString(),
      likes: project._count.likes,
      comments: 0, // TODO: Add comments system
    }))

    // Format users
    const formattedUsers = users.map(user => ({
      id: user.id,
      type: 'user' as const,
      title: user.displayName || user.username,
      username: user.username,
      userAvatar: user.avatarUrl,
      description: user.bio,
      followersCount: user._count.followers,
      projectsCount: user._count.projects,
      isFollowing: followedUserIds.has(user.id),
    }))

    // Combine results based on type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let results: any[] = []
    let total = 0

    if (type === 'all') {
      results = [...formattedProjects, ...formattedUsers]
      total = totalProjects + totalUsers
    } else if (type === 'projects') {
      results = formattedProjects
      total = totalProjects
    } else if (type === 'users') {
      results = formattedUsers
      total = totalUsers
    }

    return NextResponse.json({
      projects: type === 'all' || type === 'projects' ? formattedProjects : [],
      users: type === 'all' || type === 'users' ? formattedUsers : [],
      results,
      total,
      hasMore: offset + limit < total,
      page,
      limit,
    })
  } catch (error) {
    console.error('Error searching:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 