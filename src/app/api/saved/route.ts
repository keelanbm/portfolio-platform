import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Get saved projects with project and user details
    const saves = await prisma.save.findMany({
      where: {
        userId
      },
      include: {
        project: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
              }
            },
            slides: {
              orderBy: {
                slideOrder: 'asc'
              },
              take: 1 // Just get the first slide for cover image
            },
            _count: {
              select: {
                likes: true,
                comments: true,
                saves: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    })

    // Get total count for pagination
    const totalCount = await prisma.save.count({
      where: {
        userId
      }
    })

    // Format the response
    const projects = saves.map(save => ({
      id: save.project.id,
      title: save.project.title,
      description: save.project.description,
      coverImage: save.project.coverImageUrl,
      images: save.project.slides.map(slide => slide.imageUrl),
      tags: save.project.tags,
      likes: save.project._count.likes,
      comments: save.project._count.comments,
      saves: save.project._count.saves,
      views: save.project.viewCount,
      createdAt: save.project.createdAt.toISOString(),
      savedAt: save.createdAt.toISOString(),
      backgroundColor: save.project.backgroundColor,
      gradientColors: save.project.gradientColors,
      backgroundStyle: save.project.backgroundStyle,
      user: {
        id: save.project.user.id,
        username: save.project.user.username,
        name: save.project.user.displayName || save.project.user.username,
        avatar: save.project.user.avatarUrl || ''
      }
    }))

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: offset + projects.length < totalCount
      }
    })
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Get saved projects error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved projects' },
      { status: 500 }
    )
  }
}