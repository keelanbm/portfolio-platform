/**
 * Performance monitoring and optimization utilities
 */

interface PerformanceMetric {
  operation: string
  duration: number
  timestamp: number
  metadata?: Record<string, unknown>
}

// In-memory store for performance metrics (could be replaced with external service)
const performanceMetrics: PerformanceMetric[] = []
const MAX_METRICS = 1000 // Keep last 1000 metrics

/**
 * Record a performance metric
 */
export function recordPerformance(
  operation: string,
  duration: number,
  metadata?: Record<string, unknown>
) {
  const metric: PerformanceMetric = {
    operation,
    duration,
    timestamp: Date.now(),
    metadata,
  }

  performanceMetrics.push(metric)

  // Keep only the last MAX_METRICS entries
  if (performanceMetrics.length > MAX_METRICS) {
    performanceMetrics.splice(0, performanceMetrics.length - MAX_METRICS)
  }

  // Log slow operations in development
  if (process.env.NODE_ENV === 'development' && duration > 1000) {
    console.warn(`⚠️  Slow operation detected: ${operation} took ${duration}ms`, metadata)
  }
}

/**
 * Performance timer wrapper
 */
export async function withPerformanceTracking<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<T> {
  const start = performance.now()
  
  try {
    const result = await fn()
    const duration = performance.now() - start
    recordPerformance(operation, duration, { ...metadata, success: true })
    return result
  } catch (error) {
    const duration = performance.now() - start
    recordPerformance(operation, duration, { 
      ...metadata, 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
    throw error
  }
}

/**
 * Get performance statistics
 */
export function getPerformanceStats(operation?: string, hours = 1) {
  const cutoff = Date.now() - (hours * 60 * 60 * 1000)
  const relevantMetrics = performanceMetrics.filter(
    metric => 
      metric.timestamp > cutoff && 
      (!operation || metric.operation === operation)
  )

  if (relevantMetrics.length === 0) {
    return null
  }

  const durations = relevantMetrics.map(m => m.duration)
  const sorted = [...durations].sort((a, b) => a - b)
  
  return {
    operation: operation || 'all',
    count: relevantMetrics.length,
    avg: durations.reduce((sum, d) => sum + d, 0) / durations.length,
    min: Math.min(...durations),
    max: Math.max(...durations),
    p50: sorted[Math.floor(sorted.length * 0.5)] || 0,
    p95: sorted[Math.floor(sorted.length * 0.95)] || 0,
    p99: sorted[Math.floor(sorted.length * 0.99)] || 0,
    errors: relevantMetrics.filter(m => m.metadata?.success === false).length,
    timeRange: `${hours}h`,
  }
}

/**
 * Get all operations performance overview
 */
export function getPerformanceOverview(hours = 1) {
  const cutoff = Date.now() - (hours * 60 * 60 * 1000)
  const relevantMetrics = performanceMetrics.filter(metric => metric.timestamp > cutoff)
  
  const operationGroups = relevantMetrics.reduce((acc, metric) => {
    if (!acc[metric.operation]) {
      acc[metric.operation] = []
    }
    acc[metric.operation].push(metric)
    return acc
  }, {} as Record<string, PerformanceMetric[]>)

  return Object.keys(operationGroups).map(operation => {
    const stats = getPerformanceStats(operation, hours)
    return stats
  }).filter(Boolean)
}

/**
 * Database query performance wrapper
 */
export function withQueryPerformance<T>(
  queryName: string,
  queryParams?: Record<string, unknown>
) {
  return (fn: () => Promise<T>) => {
    return withPerformanceTracking(
      `db_query:${queryName}`,
      fn,
      { queryParams }
    )
  }
}

/**
 * API endpoint performance wrapper
 */
export function withApiPerformance<T>(
  endpoint: string,
  method = 'GET',
  metadata?: Record<string, unknown>
) {
  return (fn: () => Promise<T>) => {
    return withPerformanceTracking(
      `api:${method}:${endpoint}`,
      fn,
      metadata
    )
  }
}

/**
 * Cache performance tracking
 */
export function recordCacheHit(operation: string, hit: boolean, duration?: number) {
  recordPerformance(
    `cache:${operation}`,
    duration || 0,
    { 
      hit,
      type: hit ? 'hit' : 'miss'
    }
  )
}

/**
 * Export metrics for external monitoring
 */
export function exportMetrics(format: 'json' | 'prometheus' = 'json') {
  if (format === 'json') {
    return {
      timestamp: Date.now(),
      metrics: performanceMetrics.slice(-100), // Last 100 metrics
      overview: getPerformanceOverview(),
    }
  }

  // Basic Prometheus format
  const overview = getPerformanceOverview()
  return overview
    .map(stat => 
      [
        `# HELP ${stat?.operation}_duration_ms Duration in milliseconds`,
        `# TYPE ${stat?.operation}_duration_ms histogram`,
        `${stat?.operation}_avg_duration_ms ${stat?.avg || 0}`,
        `${stat?.operation}_p95_duration_ms ${stat?.p95 || 0}`,
        `${stat?.operation}_p99_duration_ms ${stat?.p99 || 0}`,
        `${stat?.operation}_total_count ${stat?.count || 0}`,
        `${stat?.operation}_error_count ${stat?.errors || 0}`,
      ].join('\n')
    )
    .join('\n\n')
}

/**
 * Performance warnings thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  API_ENDPOINT: 2000, // 2 seconds
  DATABASE_QUERY: 1000, // 1 second
  CACHE_OPERATION: 100, // 100ms
  FILE_UPLOAD: 5000, // 5 seconds
}

/**
 * Check if operation exceeds performance threshold
 */
export function checkPerformanceThreshold(
  operation: string,
  duration: number
): { warning: boolean; message?: string } {
  const threshold = PERFORMANCE_THRESHOLDS.API_ENDPOINT // Default threshold
  
  if (duration > threshold) {
    return {
      warning: true,
      message: `Operation ${operation} took ${duration}ms (threshold: ${threshold}ms)`
    }
  }

  return { warning: false }
}