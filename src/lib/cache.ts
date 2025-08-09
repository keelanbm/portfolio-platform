/**
 * Enhanced caching system for query optimization
 * Supports both in-memory and Redis caching
 */

// In-memory cache for development and fallback
const memoryCache = new Map<string, { data: unknown; timestamp: number; ttl: number }>()

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  useMemoryFallback?: boolean
}

const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000 // 10 minutes

/**
 * Generate cache key with consistent format
 */
export function generateCacheKey(prefix: string, params: Record<string, unknown>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      if (params[key] !== undefined && params[key] !== null) {
        result[key] = params[key]
      }
      return result
    }, {} as Record<string, unknown>)
  
  const paramString = new URLSearchParams(
    Object.entries(sortedParams).map(([k, v]) => [k, String(v)])
  ).toString()
  
  return `${prefix}:${paramString}`
}

/**
 * Get cached data
 */
export async function getCached<T>(
  key: string, 
  options: CacheOptions = {}
): Promise<T | null> {
  const { useMemoryFallback = true } = options

  try {
    // Try Redis first (if available in production)
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const response = await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(key)}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          },
        }
      )
      
      if (response.ok) {
        const result = await response.json()
        if (result.result) {
          return JSON.parse(result.result)
        }
      }
    }
  } catch (error) {
    console.warn('Redis cache miss, falling back to memory cache:', error)
  }

  // Fallback to memory cache
  if (useMemoryFallback) {
    const cached = memoryCache.get(key)
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data as T
    } else if (cached) {
      // Remove expired entry
      memoryCache.delete(key)
    }
  }

  return null
}

/**
 * Set cached data
 */
export async function setCached<T>(
  key: string, 
  data: T, 
  options: CacheOptions = {}
): Promise<void> {
  const { ttl = DEFAULT_TTL, useMemoryFallback = true } = options

  try {
    // Try Redis first (if available in production)
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/setex/${encodeURIComponent(key)}/${Math.floor(ttl / 1000)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          },
          body: JSON.stringify(data),
        }
      )
      return
    }
  } catch (error) {
    console.warn('Redis cache set failed, falling back to memory cache:', error)
  }

  // Fallback to memory cache
  if (useMemoryFallback) {
    memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }
}

/**
 * Invalidate cached data by pattern
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  try {
    // Redis pattern invalidation (if available)
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      // Note: Upstash Redis may not support KEYS command for security
      // In production, implement cache tagging or manual invalidation
    }
  } catch (error) {
    console.warn('Redis pattern invalidation failed:', error)
  }

  // Memory cache pattern invalidation
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern)) {
      memoryCache.delete(key)
    }
  }
}

/**
 * Cache wrapper for functions
 */
export async function withCache<T>(
  cacheKey: string,
  fn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  // Try to get cached result
  const cached = await getCached<T>(cacheKey, options)
  if (cached !== null) {
    return cached
  }

  // Execute function and cache result
  const result = await fn()
  await setCached(cacheKey, result, options)
  return result
}

/**
 * Cache cleanup for memory cache
 */
function cleanupMemoryCache() {
  const now = Date.now()
  for (const [key, value] of memoryCache.entries()) {
    if (now - value.timestamp > value.ttl) {
      memoryCache.delete(key)
    }
  }
}

// Periodic cleanup for memory cache
if (typeof window === 'undefined') { // Server-side only
  setInterval(cleanupMemoryCache, CLEANUP_INTERVAL)
}

/**
 * Predefined cache configurations
 */
export const CACHE_CONFIGS = {
  // Short-lived cache for frequently changing data
  SHORT: { ttl: 1 * 60 * 1000 }, // 1 minute
  
  // Medium cache for semi-static data
  MEDIUM: { ttl: 5 * 60 * 1000 }, // 5 minutes
  
  // Long cache for static data
  LONG: { ttl: 30 * 60 * 1000 }, // 30 minutes
  
  // Very long cache for rarely changing data
  VERY_LONG: { ttl: 60 * 60 * 1000 }, // 1 hour
}

/**
 * Cache tags for organized invalidation
 */
export const CACHE_TAGS = {
  PROJECTS: 'projects',
  USERS: 'users',
  DISCOVER: 'discover',
  FEED: 'feed',
  SEARCH: 'search',
  COMMENTS: 'comments',
  NOTIFICATIONS: 'notifications',
}

/**
 * Helper to invalidate related caches when data changes
 */
export async function invalidateRelatedCaches(tags: string[]): Promise<void> {
  const promises = tags.map(tag => invalidateCachePattern(tag))
  await Promise.allSettled(promises)
}