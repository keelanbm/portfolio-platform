// Mock data for homepage project showcase
// Using high-quality placeholder images that demonstrate various design categories

export interface HomepageProject {
  id: string
  title: string
  description: string
  coverImage: string
  images: string[]
  tags: string[]
  likes: number
  comments: number
  views: number
  createdAt: string
  isLiked?: boolean
  user: {
    id: string
    username: string
    name: string
    avatar: string
    isFollowing?: boolean
  }
}

export const HOMEPAGE_PROJECTS: HomepageProject[] = [
  {
    id: '1',
    title: 'Modern Banking Dashboard',
    description: 'A sleek and intuitive banking dashboard design focused on user experience and data visualization.',
    coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&crop=center'],
    tags: ['dashboard', 'ui/ux', 'fintech', 'web design'],
    likes: 245,
    comments: 18,
    views: 1200,
    createdAt: '2024-01-15T10:30:00Z',
    user: {
      id: 'user1',
      username: 'alexdesigner',
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '2',
    title: 'E-commerce Mobile App',
    description: 'A minimalist mobile shopping experience with focus on product discovery and seamless checkout.',
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=center'],
    tags: ['mobile', 'e-commerce', 'ui/ux', 'app design'],
    likes: 189,
    comments: 24,
    views: 890,
    createdAt: '2024-01-14T14:20:00Z',
    user: {
      id: 'user2',
      username: 'sarahux',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b976?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '3',
    title: 'Brand Identity System',
    description: 'Complete visual identity for a sustainable fashion brand including logo, typography, and color palette.',
    coverImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop&crop=center'],
    tags: ['branding', 'logo design', 'typography', 'visual identity'],
    likes: 312,
    comments: 31,
    views: 1650,
    createdAt: '2024-01-13T09:15:00Z',
    user: {
      id: 'user3',
      username: 'mikebrand',
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '4',
    title: 'SaaS Landing Page',
    description: 'High-converting landing page design for a project management SaaS with clear value proposition.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center'],
    tags: ['landing page', 'web design', 'saas', 'conversion'],
    likes: 156,
    comments: 12,
    views: 780,
    createdAt: '2024-01-12T16:45:00Z',
    user: {
      id: 'user4',
      username: 'emilydesigns',
      name: 'Emily Watson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '5',
    title: '3D Product Visualization',
    description: 'Photorealistic 3D rendering of consumer electronics with dynamic lighting and materials.',
    coverImage: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&h=600&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&h=600&fit=crop&crop=center'],
    tags: ['3d', 'product design', 'visualization', 'render'],
    likes: 428,
    comments: 45,
    views: 2100,
    createdAt: '2024-01-11T11:30:00Z',
    user: {
      id: 'user5',
      username: 'david3d',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '6',
    title: 'Minimalist Portfolio',
    description: 'Clean and elegant portfolio website showcasing photography with focus on visual storytelling.',
    coverImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop&crop=center'],
    tags: ['portfolio', 'minimalist', 'photography', 'website'],
    likes: 203,
    comments: 19,
    views: 950,
    createdAt: '2024-01-10T13:20:00Z',
    user: {
      id: 'user6',
      username: 'lisaporter',
      name: 'Lisa Porter',
      avatar: 'https://images.unsplash.com/photo-1502378735452-bc7d86632805?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '7',
    title: 'Food Delivery App UI',
    description: 'Appetizing mobile app interface for food delivery with intuitive navigation and quick ordering.',
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center'],
    tags: ['mobile', 'food', 'app design', 'ui/ux'],
    likes: 178,
    comments: 23,
    views: 840,
    createdAt: '2024-01-09T17:10:00Z',
    user: {
      id: 'user7',
      username: 'tomdesign',  
      name: 'Tom Anderson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '8',
    title: 'Typography Poster Series',
    description: 'Experimental typography posters exploring the relationship between text and visual hierarchy.',
    coverImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop&crop=center'],
    tags: ['typography', 'poster', 'experimental', 'print design'],
    likes: 267,
    comments: 28,
    views: 1320,
    createdAt: '2024-01-08T12:00:00Z',
    user: {
      id: 'user8',
      username: 'jennytype',
      name: 'Jenny Liu',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '9',
    title: 'Cryptocurrency Dashboard',
    description: 'Real-time crypto trading dashboard with advanced charting and portfolio management features.',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop&crop=center'],
    tags: ['dashboard', 'cryptocurrency', 'fintech', 'data visualization'],
    likes: 195,
    comments: 16,
    views: 1080,
    createdAt: '2024-01-07T15:30:00Z',
    user: {
      id: 'user9',
      username: 'ryanfintech',
      name: 'Ryan Scott',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '10',
    title: 'Sustainable Architecture',
    description: 'Architectural visualization of eco-friendly residential building with green technology integration.',
    coverImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop&crop=center'],
    tags: ['architecture', '3d', 'sustainability', 'visualization'],
    likes: 134,
    comments: 11,
    views: 670,
    createdAt: '2024-01-06T10:45:00Z',
    user: {
      id: 'user10',
      username: 'mariaarch',
      name: 'Maria González',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '11',
    title: 'Gaming UI Interface',
    description: 'Futuristic game interface design with HUD elements and interactive components for RPG game.',
    coverImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=600&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=600&fit=crop&crop=center'],
    tags: ['gaming', 'ui design', 'interface', 'futuristic'],
    likes: 298,
    comments: 34,
    views: 1540,
    createdAt: '2024-01-05T14:15:00Z',
    user: {
      id: 'user11',
      username: 'chrisgaming',
      name: 'Chris Park',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '12',
    title: 'Medical App Design',
    description: 'Healthcare application for patient monitoring with intuitive data visualization and alerts.',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&crop=center',
    images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&crop=center'],
    tags: ['healthcare', 'mobile', 'medical', 'app design'],
    likes: 167,
    comments: 21,
    views: 890,
    createdAt: '2024-01-04T09:30:00Z',
    user: {
      id: 'user12',
      username: 'annahealth',
      name: 'Anna Thompson',
      avatar: 'https://images.unsplash.com/photo-1594736797933-d0a9ba05bb70?w=100&h=100&fit=crop&crop=face'
    }
  }
]