import configPromise from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config: configPromise })

export async function getPosts(params?: {
  page?: number
  limit?: number
  category?: string
  tag?: string
  featured?: boolean
  sort?: string
}) {
  const page = params?.page || 1
  const limit = params?.limit || 10
  
  const where: Record<string, any> = {
    status: {
      equals: 'published',
    },
  }

  if (params?.category) {
    where.categories = {
      equals: params.category,
    }
  }

  if (params?.tag) {
    where.tags = {
      contains: params.tag,
    }
  }

  if (params?.featured !== undefined) {
    where.featured = {
      equals: params.featured,
    }
  }

  const sort = params?.sort || '-publishedAt'

  const posts = await payload.find({
    collection: 'posts',
    page,
    limit,
    depth: 2,
    sort,
    where,
  })

  return posts
}

export async function getPostBySlug(slug: string) {
  const posts = await payload.find({
    collection: 'posts',
    depth: 3,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return posts.docs[0] || null
}

export async function getCategories() {
  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'name',
  })

  return categories.docs
}

export async function getCategoryBySlug(slug: string) {
  const categories = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return categories.docs[0] || null
}

export async function getAuthors() {
  const authors = await payload.find({
    collection: 'authors',
    limit: 100,
  })

  return authors.docs
}

export async function getFeaturedPosts(limit: number = 3) {
  const posts = await payload.find({
    collection: 'posts',
    limit,
    depth: 2,
    sort: '-publishedAt',
    where: {
      featured: {
        equals: true,
      },
      status: {
        equals: 'published',
      },
    },
  })

  return posts.docs
}

export async function getRecentPosts(limit: number = 5) {
  const posts = await payload.find({
    collection: 'posts',
    limit,
    depth: 1,
    sort: '-publishedAt',
    where: {
      status: {
        equals: 'published',
      },
    },
  })

  return posts.docs
}
