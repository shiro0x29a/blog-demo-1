import { payloadFetch } from './client'
import type { Post, Category, Author, Media, PaginatedResponse, PayloadGlobals } from './types'

export async function getPosts(params?: {
  page?: number
  limit?: number
  category?: string
  tag?: string
  featured?: boolean
  sort?: string
}): Promise<PaginatedResponse<Post> | null> {
  const queryParams: Record<string, string | number | boolean> = {
    page: params?.page || 1,
    limit: params?.limit || 10,
    depth: 2,
  }

  if (params?.category) {
    queryParams['where[categories][equals]'] = params.category
  }

  if (params?.tag) {
    queryParams['where[tags][contains]'] = params.tag
  }

  if (params?.featured !== undefined) {
    queryParams['where[featured][equals]'] = params.featured
  }

  if (params?.sort) {
    queryParams['sort'] = params.sort
  } else {
    queryParams['sort'] = '-publishedAt'
  }

  queryParams['where[status][equals]'] = 'published'

  const { data } = await payloadFetch<PaginatedResponse<Post>>('/api/posts', {
    params: queryParams,
  })

  return data
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data } = await payloadFetch<PaginatedResponse<Post>>('/api/posts', {
    params: {
      'where[slug][equals]': slug,
      depth: 3,
    },
  })

  return data?.docs[0] || null
}

export async function getCategories(): Promise<Category[] | null> {
  const { data } = await payloadFetch<PaginatedResponse<Category>>('/api/categories', {
    params: {
      limit: 100,
      sort: 'name',
    },
  })

  return data?.docs || null
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await payloadFetch<PaginatedResponse<Category>>('/api/categories', {
    params: {
      'where[slug][equals]': slug,
    },
  })

  return data?.docs[0] || null
}

export async function getAuthors(): Promise<Author[] | null> {
  const { data } = await payloadFetch<PaginatedResponse<Author>>('/api/authors', {
    params: {
      limit: 100,
    },
  })

  return data?.docs || null
}

export async function getGlobals(): Promise<PayloadGlobals | null> {
  const [headerResult, footerResult] = await Promise.all([
    payloadFetch<any>('/api/globals/header'),
    payloadFetch<any>('/api/globals/footer'),
  ])

  return {
    header: headerResult.data || undefined,
    footer: footerResult.data || undefined,
  }
}

export async function getFeaturedPosts(limit: number = 3): Promise<Post[] | null> {
  const { data } = await payloadFetch<PaginatedResponse<Post>>('/api/posts', {
    params: {
      'where[featured][equals]': true,
      'where[status][equals]': 'published',
      limit,
      sort: '-publishedAt',
      depth: 2,
    },
  })

  return data?.docs || null
}

export async function getRecentPosts(limit: number = 5): Promise<Post[] | null> {
  const { data } = await payloadFetch<PaginatedResponse<Post>>('/api/posts', {
    params: {
      'where[status][equals]': 'published',
      limit,
      sort: '-publishedAt',
      depth: 1,
    },
  })

  return data?.docs || null
}
