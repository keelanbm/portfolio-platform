// Image Constraints for Dribbble-inspired Portfolio Platform

// File Types (MVP)
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp'
] as const

// File Size & Project Limits
export const CONSTRAINTS = {
  free: {
    maxFileSize: 5 * 1024 * 1024,    // 5MB per image
    maxTotalSize: 15 * 1024 * 1024,  // 15MB per project
    slidesPerProject: 3
  },
  pro: {
    maxFileSize: 10 * 1024 * 1024,   // 10MB per image
    maxTotalSize: 100 * 1024 * 1024, // 100MB per project
    slidesPerProject: 10
  }
} as const

// Image Dimensions
export const DIMENSIONS = {
  minWidth: 800,
  minHeight: 600,
  maxWidth: 3200,
  maxHeight: 2400,
  recommendedRatio: '4:3' // 1200x900 sweet spot
} as const

// Processing Pipeline
export const IMAGE_VARIANTS = {
  thumbnail: '400x300',    // Grid views
  medium: '800x600',       // Feed display
  large: '1200x900',       // Full view
  original: 'preserved'    // Download/NFT
} as const

// Default Tags
export const DEFAULT_TAGS = [
  'web design',
  'ui/ux',
  'mobile',
  'illustration',
  'branding',
  'typography',
  'animation',
  '3d',
  'photography',
  'icon design',
  'logo design',
  'app design',
  'website',
  'dashboard',
  'landing page',
  'minimalist',
  'modern',
  'creative',
  'clean',
  'professional'
] as const

// Phase 2: Add GIF support (15MB limit, auto-optimize to MP4)
// Phase 3: Consider video support (MP4/WebM, 50MB, 60s max) 