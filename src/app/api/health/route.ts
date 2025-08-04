import { NextResponse } from 'next/server'
import { performHealthCheck, errorTracker, PerformanceMonitor } from '@/lib/error-tracking'
import { getFeatureStatus } from '@/lib/features'

export async function GET() {
  try {
    // Start performance monitoring
    const endTimer = PerformanceMonitor.startTimer('health_check_duration')
    
    // Perform comprehensive health check
    const health = await performHealthCheck()
    
    // Add additional details
    const healthCheck = {
      ...health,
      timestamp: new Date().toISOString(),
      details: {
        features: getFeatureStatus(),
        version: process.env.NODE_ENV || 'unknown',
        errorStats: errorTracker.getErrorStats(),
      },
    }

    // Record performance
    const duration = endTimer()
    PerformanceMonitor.recordMetric('health_check_success', 1)

    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503

    return NextResponse.json(healthCheck, { status: statusCode })
  } catch (error) {
    // Log critical error in health check itself
    errorTracker.logError(
      error as Error,
      { endpoint: '/api/health' },
      'critical',
      'api'
    )

    PerformanceMonitor.recordMetric('health_check_error', 1)

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      details: {
        message: (error as Error).message,
      },
    }, { status: 503 })
  }
}