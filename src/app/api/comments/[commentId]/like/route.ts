import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/utils/notifications'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { commentId } = await params

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { 
        id: true, 
        content: true, 
        userId: true,
        projectId: true,
        user: {
          select: {
            username: true,
            displayName: true,
          },
        },
        project: {
          select: {
            title: true,
          },
        },
      }
    })

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Check if user already liked the comment
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    })

    if (existingLike) {
      // Unlike the comment
      await prisma.like.delete({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      })

      return NextResponse.json({ liked: false })
    } else {
      // Like the comment
      await prisma.like.create({
        data: {
          userId,
          commentId,
        },
      })

      // Get liker info for notification
      const liker = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, displayName: true },
      })

      // Send notification to comment owner (only if they're not liking their own comment)
      if (comment.userId !== userId && liker) {
        const shortContent = comment.content.length > 50 
          ? comment.content.substring(0, 50) + '...'
          : comment.content

        await createNotification({
          userId: comment.userId,
          type: 'COMMENT_LIKE',
          title: 'Your comment was liked',
          message: `${liker.displayName || liker.username || 'Someone'} liked your comment: "${shortContent}"`,
          actionUrl: `/project/${comment.projectId}`,
        })
      }

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Error toggling comment like:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { commentId } = await params

    // Check if user liked the comment
    const like = await prisma.like.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    })

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    console.error('Error checking comment like status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}