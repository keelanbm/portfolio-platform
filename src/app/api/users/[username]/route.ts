import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params
    const { userId } = await auth()

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            projects: true,
            followers: true,
            following: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if current user is following this user
    let isFollowing = false
    if (userId) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: user.id,
          },
        },
      })
      isFollowing = !!follow
    }

    // Get user's projects
    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
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
        _count: {
          select: {
            likes: true,
            slides: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 12, // Limit to 12 projects for profile page
    })

    // Format the response
    const formattedUser = {
      id: user.id,
      username: user.username,
      name: user.displayName || user.username,
      bio: user.bio,
      avatar: user.avatarUrl,
      website: user.websiteUrl,
      location: user.location,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      projectsCount: user._count.projects,
      isFollowing,
      isOwnProfile: userId === user.id,
    }

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
    }))

    return NextResponse.json({
      user: formattedUser,
      projects: formattedProjects,
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 