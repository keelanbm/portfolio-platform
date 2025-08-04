import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { userId } = await auth()
    const { username } = await params

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        projects: {
          where: { isPublic: true },
          include: {
            slides: {
              orderBy: { slideOrder: 'asc' },
            },
            _count: {
              select: {
                likes: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            followers: true,
            following: true,
            projects: {
              where: { isPublic: true },
            },
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

    // Format response
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
      projects: user.projects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        coverImage: project.coverImageUrl,
        images: project.slides.map(slide => slide.imageUrl),
        tags: project.tags,
        likes: project._count.likes,
        createdAt: project.createdAt.toISOString(),
      })),
    }

    return NextResponse.json(formattedUser)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { username } = await params
    const { action } = await request.json() // 'follow' or 'unfollow'

    // Get the user to follow/unfollow
    const userToFollow = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    })

    if (!userToFollow) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (userToFollow.id === userId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    if (action === 'follow') {
      // Check if already following
      const existingFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: userToFollow.id,
          },
        },
      })

      if (existingFollow) {
        return NextResponse.json(
          { error: 'Already following this user' },
          { status: 409 }
        )
      }

      // Create follow relationship
      await prisma.follow.create({
        data: {
          followerId: userId,
          followingId: userToFollow.id,
        },
      })

      return NextResponse.json({ following: true })
    } else if (action === 'unfollow') {
      // Delete follow relationship
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: userToFollow.id,
          },
        },
      })

      return NextResponse.json({ following: false })
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error following/unfollowing user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 