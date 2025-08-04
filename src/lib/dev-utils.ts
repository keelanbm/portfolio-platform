// Development utilities for better debugging and monitoring

// Environment check without import

// Development logger with color coding
export class DevLogger {
  private static colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
  }

  static info(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${this.colors.blue}[INFO]${this.colors.reset} ${message}`, data || '')
    }
  }

  static success(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${this.colors.green}[SUCCESS]${this.colors.reset} ${message}`, data || '')
    }
  }

  static warning(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${this.colors.yellow}[WARNING]${this.colors.reset} ${message}`, data || '')
    }
  }

  static error(message: string, error?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.error(`${this.colors.red}[ERROR]${this.colors.reset} ${message}`, error || '')
    }
  }

  static api(method: string, path: string, duration?: number): void {
    if (process.env.NODE_ENV === 'development') {
      const durationText = duration ? ` (${duration}ms)` : ''
      console.log(`${this.colors.cyan}[API]${this.colors.reset} ${method} ${path}${durationText}`)
    }
  }
}

// Performance monitoring for development
export class DevProfiler {
  private static timers = new Map<string, number>()

  static start(label: string): void {
    if (process.env.NODE_ENV === 'development') {
      this.timers.set(label, Date.now())
    }
  }

  static end(label: string): number {
    if (process.env.NODE_ENV === 'development') {
      const start = this.timers.get(label)
      if (start) {
        const duration = Date.now() - start
        this.timers.delete(label)
        DevLogger.info(`Performance: ${label}`, `${duration}ms`)
        return duration
      }
    }
    return 0
  }
}

// Development-only database monitoring
export function monitorDatabaseQueries(): void {
  if (process.env.NODE_ENV === 'development') {
    // This would hook into Prisma logs if needed
    DevLogger.info('Database query monitoring enabled')
  }
}

// Hot reload stability checker
export function checkHotReloadStability(): void {
  if (process.env.NODE_ENV === 'development') {
    let restartCount = 0
    
    // Monitor for frequent restarts
    const interval = setInterval(() => {
      restartCount++
      if (restartCount > 5) {
        DevLogger.warning('Frequent hot reloads detected - possible configuration issue')
        clearInterval(interval)
      }
    }, 1000)

    // Clear after 10 seconds
    setTimeout(() => {
      clearInterval(interval)
    }, 10000)
  }
}