import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { exportMetrics, getPerformanceOverview } from '@/lib/performance'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    // This endpoint should be protected - only for admins
    // In a real app, you'd check if user is admin
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') as 'json' | 'prometheus' || 'json'
    const hours = parseInt(searchParams.get('hours') || '1')

    if (format === 'prometheus') {
      const prometheusMetrics = exportMetrics('prometheus')
      return new Response(String(prometheusMetrics), {
        headers: {
          'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
        },
      })
    }

    const metrics = exportMetrics('json') as { timestamp: number; metrics: unknown[]; overview: unknown[] }
    const overview = getPerformanceOverview(hours)

    return NextResponse.json({
      timestamp: metrics.timestamp,
      metrics: metrics.metrics,
      overview,
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
    })
  } catch (error) {
    console.error('Error fetching performance metrics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}