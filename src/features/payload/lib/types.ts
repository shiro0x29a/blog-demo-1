export interface Author {
  id: number
  name: string
  email: string
  bio?: any
  avatar?: number | Media | null
  website?: string | null
  socialLinks?: Array<{
    platform: 'twitter' | 'linkedin' | 'github' | 'instagram'
    url: string
  }> | null
  updatedAt: string
  createdAt: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  updatedAt: string
  createdAt: string
}

export interface Tag {
  id: number
  name: string
  updatedAt: string
  createdAt: string
}

export interface Media {
  id: number
  title: string
  alt: string
  caption?: string | null
  url?: string | null
  thumbnailURL?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  sizes?: {
    thumbnail?: {
      url?: string | null
      width?: number | null
      height?: number | null
      mimeType?: string | null
      filesize?: number | null
      filename?: string | null
    }
    medium?: {
      url?: string | null
      width?: number | null
      height?: number | null
      mimeType?: string | null
      filesize?: number | null
      filename?: string | null
    }
    large?: {
      url?: string | null
      width?: number | null
      height?: number | null
      mimeType?: string | null
      filesize?: number | null
      filename?: string | null
    }
  }
  updatedAt: string
  createdAt: string
}

export interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  content: any
  coverImage?: number | Media | null
  status: 'draft' | 'published'
  publishedAt?: string | null
  author: number | Author
  categories?: (number | Category)[] | null
  tags?: (number | Tag)[] | null
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
