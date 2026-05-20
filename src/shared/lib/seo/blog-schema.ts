import type { Post, Author, Category } from '@/features/payload/lib/types'

export function generateArticleSchema(
  post: Post,
  baseUrl: string
): Record<string, any> {
  const authorSchema = {
    '@type': 'Person',
    name: post.author.name,
    ...(post.author.website && { url: post.author.website }),
    ...(post.author.avatar && { image: post.author.avatar.url }),
  }

  const categorySchemas = post.categories?.map((category: Category) => ({
    '@type': 'Thing',
    name: category.name,
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    ...(post.coverImage && {
      image: {
        '@type': 'ImageObject',
        url: post.coverImage.url,
        width: post.coverImage.width,
        height: post.coverImage.height,
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
