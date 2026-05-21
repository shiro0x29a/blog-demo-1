import type { Post, Author, Category } from '@/features/payload/lib/types'

export function generateArticleSchema(
  post: Post,
  baseUrl: string
): Record<string, any> {
  const author = typeof post.author === 'object' ? post.author : null
  const authorAvatar = author && typeof author.avatar === 'object' ? author.avatar : null
  const coverImage = typeof post.coverImage === 'object' ? post.coverImage : null

  const authorSchema = {
    '@type': 'Person',
    name: author?.name || '',
    ...(author?.website && { url: author.website }),
    ...(authorAvatar?.url && { image: authorAvatar.url }),
  }

  const categorySchemas = post.categories
    ?.filter((category): category is Category => typeof category === 'object')
    .map((category) => ({
      '@type': 'Thing',
      name: category.name,
    }))

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    ...(coverImage?.url && {
      image: {
        '@type': 'ImageObject',
        url: coverImage.url,
        width: coverImage.width,
        height: coverImage.height,
      },
    }),
    author: authorSchema,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    publisher: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_APP_NAME || 'Blog',
      ...(process.env.NEXT_PUBLIC_LOGO_URL && {
        logo: {
          '@type': 'ImageObject',
          url: process.env.NEXT_PUBLIC_LOGO_URL,
        },
      }),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
    ...(categorySchemas && {
      articleSection: categorySchemas.map((c: any) => c.name),
    }),
    ...(post.tags && {
      keywords: post.tags.join(', '),
    }),
  }
}

export function generateBlogSchema(
  totalPosts: number,
  baseUrl: string
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog',
    description: 'Read our latest articles, tutorials, and guides',
    url: `${baseUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_APP_NAME || 'Blog',
    },
    numberOfItems: totalPosts,
  }
}
