import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

// POST /api/events – log a client or server event
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const body = await request.json()

    const {
      type,
      projectId,
      commentId,
      tag,
      metadata,
    }: {
      type: string
      projectId?: string
      commentId?: string
      tag?: string
      metadata?: unknown
    } = body

    if (!type || typeof type !== 'string') {
      return NextResponse.json(
        { error: 'Event type required' },
        { status: 400 }
      )
    }

    await prisma.event.create({
      data: {
        type,
        userId: userId ?? null,
        projectId: projectId ?? null,
        commentId: commentId ?? null,
        tag: tag ?? null,
        metadata: metadata || undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/events – lightweight admin/debug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') ?? undefined
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)

    const events = await prisma.event.findMany({
      where: { type },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ success: true, data: events })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

