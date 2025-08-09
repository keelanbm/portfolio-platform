import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getMentionSuggestions } from '@/lib/mentions'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '5')

    if (!query || query.length < 1) {
      return NextResponse.json({ suggestions: [] })
    }

    const suggestions = await getMentionSuggestions(
      query,
      Math.min(limit, 20), // Cap at 20 suggestions
      [userId] // Exclude current user from suggestions
    )

    return NextResponse.json({
      suggestions: suggestions.map(user => ({
        id: user.id,
        username: user.username,
        name: user.displayName || user.username,
        avatar: user.avatarUrl,
      })),
    })
  } catch (error) {
    console.error('Error fetching mention suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    )
  }
}