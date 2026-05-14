import configPromise from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config: configPromise })

export async function getPosts(params?: {
  page?: number
  limit?: number
  category?: string
  tag?: string
  search?: string
  sort?: string
}) {
  const page = params?.page && !isNaN(params.page) ? params.page : 1
  const limit = params?.limit || 10

  const where: Record<string, any> = {
    status: {
      equals: 'published',
    },
  }

  if (params?.category) {
    where.categories = {
      in: [params.category],
    }
  }

  if (params?.tag) {
    // Сначала найдем тег по имени
    const tags = await payload.find({
      collection: 'tags',
      where: {
        name: {
          equals: params.tag,
        },
      },
      limit: 1,
    })
    
    if (tags.docs.length > 0) {
      where.tags = {
        in: [tags.docs[0].id],
      }
    }
  }

  if (params?.search) {
    where.or = [
      {
        title: {
          contains: params.search,
        },
      },
      {
        excerpt: {
          contains: params.search,
        },
      },
    ]
  }

  const sort = params?.sort || '-publishedAt'

  console.log('[getPosts] params:', { page, limit, category: params?.category, search: params?.search, where })

  const posts = await payload.find({
    collection: 'posts',
    page,
    limit,
    depth: 2,
    sort,
    where,
  })

  console.log('[getPosts] result:', { totalDocs: posts.totalDocs, docsCount: posts.docs.length })

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
  console.log('[getCategoryBySlug] slug:', slug)
  const categories = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  console.log('[getCategoryBySlug] totalDocs:', categories.totalDocs)
  console.log('[getCategoryBySlug] docs:', JSON.stringify(categories.docs, null, 2))
  console.log('[getCategoryBySlug] result:', categories.docs[0]?.id || null)
  return categories.docs[0] || null
}

export async function getAuthors() {
  const authors = await payload.find({
    collection: 'authors',
    limit: 100,
  })

  return authors.docs
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
