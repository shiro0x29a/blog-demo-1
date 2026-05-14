export interface Author {
  id: string
  name: string
  email: string
  bio?: any
  avatar?: Media
  website?: string
  socialLinks?: Array<{
    platform: 'twitter' | 'linkedin' | 'github' | 'instagram'
    url: string
  }>
  updatedAt: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  updatedAt: string
  createdAt: string
}

export interface Tag {
  id: string
  name: string
  updatedAt: string
  createdAt: string
}

export interface Media {
  id: string
  title: string
  alt: string
  caption?: string
  url: string
  thumbnail?: string
  medium?: string
  large?: string
  width?: number
  height?: number
  mimeType?: string
  updatedAt: string
  createdAt: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: any
  coverImage?: Media
  status: 'draft' | 'published'
  publishedAt?: string
  author: Author
  categories?: Category[]
  tags?: Tag[]
  updatedAt: string
  createdAt: string
}

export interface PaginatedResponse<T> {
  docs: T[]
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  nextPage: number | null
  page: number
  pagingCounter: number
  prevPage: number | null
  totalDocs: number
  totalPages: number
}

export interface PayloadGlobals {
  header?: {
    navItems: Array<{
      label: string
      url: string
      openInNewTab: boolean
    }>
  }
  footer?: {
    copyrightText: string
    navItems?: Array<{
      label: string
      url: string
      openInNewTab: boolean
    }>
    socialLinks?: Array<{
      platform: string
      url: string
    }>
  }
}
