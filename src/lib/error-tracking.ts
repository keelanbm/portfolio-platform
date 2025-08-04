// Comprehensive error tracking and monitoring system

interface ErrorContext {
  userId?: string
  userAgent?: string
  url?: string
  timestamp?: string
  additional?: Record<string, unknown>
}

interface ErrorLog {
  id: string
  message: string
  stack?: string
  context: ErrorContext
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'api' | 'database' | 'auth' | 'ui' | 'external' | 'unknown'
  resolved: boolean
  createdAt: string
}

class ErrorTracker {
  private errors: ErrorLog[] = []
  private maxErrors = 1000 // Keep last 1000 errors in memory

  /**
   * Log an error with context and categorization
   */
  logError(
    error: Error | string,
    context: ErrorContext = {},
    severity: ErrorLog['severity'] = 'medium',
    category: ErrorLog['category'] = 'unknown'
  ): string {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const errorLog: ErrorLog = {
      id: errorId,
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
      },
      severity,
      category,
      resolved: false,
      createdAt: new Date().toISOString(),
    }

    // Add to in-memory store
    this.errors.unshift(errorLog)
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors)
    }

    // Log to console with appropriate level
    this.logToConsole(errorLog)

    // Store in localStorage for persistence (client-side only)
    if (typeof window !== 'undefined') {
      this.persistError(errorLog)
    }

    return errorId
  }

  /**
   * Log to console with appropriate formatting
   */
  private logToConsole(errorLog: ErrorLog) {
    const logMethod = this.getConsoleMethod(errorLog.severity)
    const prefix = `[${errorLog.category.toUpperCase()}] ${errorLog.severity.toUpperCase()}`
    
    logMethod(`${prefix}: ${errorLog.message}`)
    
    if (errorLog.stack) {
      console.log('Stack trace:', errorLog.stack)
    }
    
    if (Object.keys(errorLog.context).length > 0) {
      console.log('Context:', errorLog.context)
    }
  }

  /**
   * Get appropriate console method based on severity
   */
  private getConsoleMethod(severity: ErrorLog['severity']) {
    switch (severity) {
      case 'critical':
      case 'high':
        return console.error
      case 'medium':
        return console.warn
      case 'low':
      default:
        return console.log
    }
  }

  /**
   * Persist error to localStorage (client-side only)
   */
  private persistError(errorLog: ErrorLog) {
    try {
      const existingErrors = JSON.parse(localStorage.getItem('error_logs') || '[]')
      existingErrors.unshift(errorLog)
      
      // Keep last 100 errors in localStorage
      const trimmedErrors = existingErrors.slice(0, 100)
      localStorage.setItem('error_logs', JSON.stringify(trimmedErrors))
    } catch (e) {
      console.warn('Failed to persist error to localStorage:', e)
    }
  }

  /**
   * Get recent errors with optional filtering
   */
  getRecentErrors(options: {
    limit?: number
    severity?: ErrorLog['severity'][]
    category?: ErrorLog['category'][]
    resolved?: boolean
  } = {}): ErrorLog[] {
    const { limit = 50, severity, category, resolved } = options
    
    let filteredErrors = this.errors

    if (severity && severity.length > 0) {
      filteredErrors = filteredErrors.filter(err => severity.includes(err.severity))
    }

    if (category && category.length > 0) {
      filteredErrors = filteredErrors.filter(err => category.includes(err.category))
    }

    if (resolved !== undefined) {
      filteredErrors = filteredErrors.filter(err => err.resolved === resolved)
    }

    return filteredErrors.slice(0, limit)
  }

  /**
   * Mark an error as resolved
   */
  resolveError(errorId: string): boolean {
    const errorIndex = this.errors.findIndex(err => err.id === errorId)
    if (errorIndex !== -1) {
      this.errors[errorIndex].resolved = true
      return true
    }
    return false
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number
    unresolved: number
    bySeverity: Record<ErrorLog['severity'], number>
    byCategory: Record<ErrorLog['category'], number>
    recentErrors: number // Last 24 hours
  } {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const stats = {
      total: this.errors.length,
      unresolved: this.errors.filter(err => !err.resolved).length,
      bySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      } as Record<ErrorLog['severity'], number>,
      byCategory: {
        api: 0,
        database: 0,
        auth: 0,
        ui: 0,
        external: 0,
        unknown: 0,
      } as Record<ErrorLog['category'], number>,
      recentErrors: 0,
    }

    this.errors.forEach(error => {
      stats.bySeverity[error.severity]++
      stats.byCategory[error.category]++
      
      if (new Date(error.createdAt) > twentyFourHoursAgo) {
        stats.recentErrors++
      }
    })

    return stats
  }
}

// Global error tracker instance
export const errorTracker = new ErrorTracker()

/**
 * API Error Handler wrapper for consistent error handling
 */
export function withErrorHandling<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>,
  context: Partial<ErrorContext> = {}
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args)
    } catch (error) {
      const errorId = errorTracker.logError(
        error as Error,
        context,
        'high',
        'api'
      )
      
      // Re-throw with error ID for API responses
      const enhancedError = error as Error & { errorId?: string }
      enhancedError.errorId = errorId
      throw enhancedError
    }
  }
}

/**
 * Database error handler with specific categorization
 */
export function logDatabaseError(error: Error, context: ErrorContext = {}) {
  return errorTracker.logError(error, context, 'high', 'database')
}

/**
 * Authentication error handler
 */
export function logAuthError(error: Error, context: ErrorContext = {}) {
  return errorTracker.logError(error, context, 'medium', 'auth')
}

/**
 * UI error handler for client-side errors
 */
export function logUIError(error: Error, context: ErrorContext = {}) {
  return errorTracker.logError(error, context, 'low', 'ui')
}

/**
 * Critical error handler for system-breaking issues
 */
export function logCriticalError(error: Error, context: ErrorContext = {}) {
  return errorTracker.logError(error, context, 'critical', 'unknown')
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map()

  static startTimer(key: string): () => number {
    const startTime = performance.now()
    
    return () => {
      const duration = performance.now() - startTime
      this.recordMetric(key, duration)
      return duration
    }
  }

  static recordMetric(key: string, value: number) {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, [])
    }
    
    const values = this.metrics.get(key)!
    values.push(value)
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift()
    }
  }

  static getMetrics(key: string) {
    const values = this.metrics.get(key) || []
    if (values.length === 0) return null

    const sorted = [...values].sort()
    return {
      count: values.length,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    }
  }

  static getAllMetrics() {
    const result: Record<string, unknown> = {}
    for (const [key] of this.metrics) {
      result[key] = this.getMetrics(key)
    }
    return result
  }
}

/**
 * Health check utilities
 */
export async function performHealthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy'
  checks: Record<string, boolean>
  errors: ErrorLog[]
  performance: Record<string, unknown>
}> {
  const checks: Record<string, boolean> = {}
  
  // Check database connectivity
  try {
    const { prisma } = await import('./prisma')
    await prisma.$queryRaw`SELECT 1`
    checks.database = true
  } catch (error) {
    checks.database = false
    logDatabaseError(error as Error, { additional: { check: 'health_check' } })
  }

  // Check environment variables
  checks.environment = !!(
    process.env.DATABASE_URL &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  )

  // Get recent critical errors
  const recentErrors = errorTracker.getRecentErrors({
    limit: 10,
    severity: ['critical', 'high'],
    resolved: false,
  })

  // Determine overall status
  const allChecksPass = Object.values(checks).every(Boolean)
  const hasCriticalErrors = recentErrors.some(err => err.severity === 'critical')
  
  let status: 'healthy' | 'degraded' | 'unhealthy'
  if (!allChecksPass || hasCriticalErrors) {
    status = 'unhealthy'
  } else if (recentErrors.length > 0) {
    status = 'degraded'
  } else {
    status = 'healthy'
  }

  return {
    status,
    checks,
    errors: recentErrors,
    performance: PerformanceMonitor.getAllMetrics(),
  }
}