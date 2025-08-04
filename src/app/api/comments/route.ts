import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { notifyCommentReply, createNotification } from '@/utils/notifications'
import { getCommentsWithMetadata } from '@/lib/query-optimizations'

// GET /api/comments - Get comments for a project or user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const userId = searchParams.get('userId')
    const parentId = searchParams.get('parentId') // For getting replies
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get current user for like status
    let currentUserId: string | null = null
    try {
      const authResult = await auth()
      currentUserId = authResult.userId
    } catch (error) {
      // User not authenticated, continue without user-specific data
    }

    // Use optimized query for project comments
    if (projectId && !parentId) {
      const comments = await getCommentsWithMetadata({
        projectId,
        userId: currentUserId,
        limit,
        offset,
      })

      return NextResponse.json({
        success: true,
        data: comments,
      })
    }

    // Fallback to original logic for other query types
    if (!projectId && !userId) {
      return NextResponse.json(
        { error: 'Either projectId or userId is required' },
        { status: 400 }
      )
    }

    const where: {
      projectId?: string
      userId?: string
      parentId?: string | null
    } = {}
    if (projectId) where.projectId = projectId
    if (userId) where.userId = userId
    if (parentId) {
      where.parentId = parentId
    } else {
      where.parentId = null // Only top-level comments
    }

    const comments = await prisma.comment.findMany({
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
        ...(currentUserId ? {
          likes: {
            where: { userId: currentUserId },
            select: { id: true },
            take: 1,
          },
        } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    return NextResponse.json({
      success: true,
      data: comments,
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, projectId, parentId, tags } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    // Validate that projectId or parentId is provided
    if (!projectId && !parentId) {
      return NextResponse.json(
        { error: 'Either projectId or parentId is required' },
        { status: 400 }
      )
    }

    // If this is a reply, validate the parent comment exists and get parent user info
    let parentComment = null
    if (parentId) {
      parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { 
          id: true, 
          projectId: true,
          userId: true,
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
            }
          }
        },
      })

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        )
      }

      // Use the projectId from the parent comment
      if (!projectId) {
        body.projectId = parentComment.projectId
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId,
        projectId: body.projectId,
        parentId: parentId || null,
        tags: tags || [],
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
            userId: true,
          },
        },
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
    })

    // Handle notifications
    const commenterName = comment.user.displayName || comment.user.username || 'Someone'
    
    if (parentId && parentComment) {
      // This is a reply - notify the original commenter (not the reply author themselves)
      if (parentComment.userId !== userId) {
        await createNotification({
          userId: parentComment.userId,
          type: 'COMMENT_REPLY',
          title: 'New reply to your comment',
          message: `${commenterName} replied to your comment on "${comment.project.title}"`,
          actionUrl: `/project/${comment.project.id}`,
        })
      }
    } else {
      // This is a new comment on a project - notify the project owner (not the commenter themselves)
      if (comment.project.userId !== userId) {
        await notifyCommentReply({
          projectOwnerId: comment.project.userId,
          commenterName,
          projectTitle: comment.project.title,
          projectId: comment.project.id,
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: comment,
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
} 