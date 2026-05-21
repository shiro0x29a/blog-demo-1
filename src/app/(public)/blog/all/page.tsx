import { getPosts } from '@/features/payload/lib/queries'
import { BlogTabs } from '@/features/blog/components/blog-tabs'
import { BlogSearch } from '@/features/blog/components/blog-search'
import { BlogPostsClient } from '@/features/blog/components/blog-posts-client'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Posts - Blog',
  description: 'Browse all blog posts',
}

interface AllPageProps {
  searchParams: Promise<{ page?: string; q?: string }>
}

export default async function AllPage({ searchParams }: AllPageProps) {
  const { page, q } = await searchParams
  const currentPage = parseInt(page || '1', 10)
  const limit = 10
  const query = q || ''

  // Получаем все посты для тегов и фильтрации
  const allPosts = await getPosts({ page: 1, limit: 1000, search: query || undefined })
  
  // Получаем посты для текущей страницы (для пагинации без фильтров)
  const paginatedPosts = await getPosts({ page: currentPage, limit, search: query || undefined })

  if (!allPosts || !paginatedPosts) {
    notFound()
  }

  const totalPages = Math.ceil(paginatedPosts.totalDocs / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">
          {query ? 'Search Results' : 'All Posts'}
        </h1>
        <p className="text-muted-foreground">
          {query 
            ? `Found ${paginatedPosts.totalDocs} result${paginatedPosts.totalDocs !== 1 ? 's' : ''} for "${query}"`
            : 'Browse all blog posts'
          }
        </p>
      </div>

      <BlogSearch />

      <BlogTabs />

      <BlogPostsClient
        allPosts={allPosts.docs}
        paginatedPosts={paginatedPosts.docs}
        currentPage={paginatedPosts.page ?? 1}
        totalPages={totalPages}
        hasNextPage={paginatedPosts.hasNextPage}
        hasPrevPage={paginatedPosts.hasPrevPage}
      />
    </div>
  )
}
