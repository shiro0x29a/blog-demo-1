import { getPosts, getCategoryBySlug } from '@/shared/lib/payload/queries'
import { BlogTabs } from '@/features/blog/components/BlogTabs'
import { BlogSearch } from '@/features/blog/components/BlogSearch'
import { BlogPostsClient } from '@/features/blog/components/BlogPostsClient'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Articles - Blog',
  description: 'Read our in-depth articles and guides',
}

interface ArticlesPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { page } = await searchParams
  const currentPage = parseInt(page || '1', 10)
  const limit = 10

  // Get the USEFUL ARTICLES category
  const articlesCategory = await getCategoryBySlug('articles')
  
  // Получаем все посты для тегов и фильтрации
  const allPosts = await getPosts({ page: 1, limit: 1000, category: articlesCategory?.id })
  
  // Получаем посты для текущей страницы (для пагинации без фильтров)
  const paginatedPosts = await getPosts({ page: currentPage, limit, category: articlesCategory?.id })

  if (!allPosts || !paginatedPosts) {
    notFound()
  }

  const totalPages = Math.ceil(paginatedPosts.totalDocs / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Articles</h1>
        <p className="text-muted-foreground">
          Read our in-depth articles and guides
        </p>
      </div>

      <BlogSearch />

      <BlogTabs />

      <BlogPostsClient
        allPosts={allPosts.docs}
        paginatedPosts={paginatedPosts.docs}
        currentPage={paginatedPosts.page}
        totalPages={totalPages}
        hasNextPage={paginatedPosts.hasNextPage}
        hasPrevPage={paginatedPosts.hasPrevPage}
      />
    </div>
  )
}
