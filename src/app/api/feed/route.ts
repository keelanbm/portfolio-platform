import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // Get users that the current user is following
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    })

    const followingIds = following.map(f => f.followingId)

    // If user is not following anyone, return empty array
    if (followingIds.length === 0) {
      return NextResponse.json({
        projects: [],
        hasMore: false,
        total: 0,
      })
    }

    // Get projects from followed users
    const projects = await prisma.project.findMany({
      where: {
        userId: { in: followingIds },
        isPublic: true,
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
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    // Get total count for pagination
    const total = await prisma.project.count({
      where: {
        userId: { in: followingIds },
        isPublic: true,
      },
    })

    // Check if current user has liked each project
    const projectIds = projects.map(p => p.id)
    const userLikes = await prisma.like.findMany({
      where: {
        userId: userId,
        projectId: { in: projectIds },
      },
    })

    const likedProjectIds = new Set(userLikes.map(like => like.projectId))

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
    console.error('Error fetching feed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 