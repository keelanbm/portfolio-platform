import { User, Project, ProjectSlide, Like, Save, SubscriptionTier } from '@prisma/client'

// User types
export type UserProfile = Pick<User, 'id' | 'username' | 'displayName' | 'bio' | 'avatarUrl' | 'websiteUrl' | 'location' | 'subscriptionTier' | 'createdAt'>

export type UserWithProjects = User & {
  projects: Project[]
  _count: {
    projects: number
    followers: number
    following: number
  }
}

// Project types
export type ProjectWithSlides = Project & {
  slides: ProjectSlide[]
  user: UserProfile
  _count: {
    likes: number
    saves: number
  }
}

export type ProjectWithDetails = Project & {
  slides: ProjectSlide[]
  user: UserProfile
  likes: Like[]
  saves: Save[]
  _count: {
    likes: number
    saves: number
  }
}

// Feed types
export type FeedProject = Project & {
  user: UserProfile
  slides: ProjectSlide[]
  _count: {
    likes: number
    saves: number
  }
}

// Form types
export interface CreateProjectData {
  title: string
  description?: string
  tags: string[]
  coverImageUrl: string
  slides: File[]
}

export interface UpdateProjectData {
  title?: string
  description?: string
  tags?: string[]
  coverImageUrl?: string
  isPublic?: boolean
}

export interface UpdateProfileData {
  displayName?: string
  bio?: string
  websiteUrl?: string
  location?: string
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Web3 types
export interface NftMintData {
  projectId: string
  minterWallet: string
  transactionHash: string
  mintPrice?: number
}

// Subscription types
export interface SubscriptionPlan {
  id: string
  name: SubscriptionTier
  price: number
  features: string[]
  limits: {
    slidesPerProject: number
    projectsPerMonth: number
  }
}

// Default tags
export const DEFAULT_TAGS = [
  'Web Design', 'Mobile App', 'Logo Design', 'Branding', 
  'UI/UX', 'Illustration', 'Typography', 'Photography',
  'Print Design', 'Packaging', 'Landing Page', 'Dashboard',
  'E-commerce', 'SaaS', 'Fintech', 'Healthcare', 'Education'
] as const

export type DefaultTag = typeof DEFAULT_TAGS[number] 