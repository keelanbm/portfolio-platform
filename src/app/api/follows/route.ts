import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { followingId } = await request.json()

    if (!followingId) {
      return NextResponse.json(
        { error: 'Following ID is required' },
        { status: 400 }
      )
    }

    if (userId === followingId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // Check if user exists
    const userToFollow = await prisma.user.findUnique({
      where: { id: followingId },
    })

    if (!userToFollow) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: followingId,
      },
    })

    return NextResponse.json({
      success: true,
      follow,
    })
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Already following this user' },
        { status: 409 }
      )
    }

    console.error('Error following user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const followingId = searchParams.get('followingId')

    if (!followingId) {
      return NextResponse.json(
        { error: 'Following ID is required' },
        { status: 400 }
      )
    }

    // Delete follow relationship
    const deletedFollow = await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followingId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      deletedFollow,
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Follow relationship not found' },
        { status: 404 }
      )
    }

    console.error('Error unfollowing user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 