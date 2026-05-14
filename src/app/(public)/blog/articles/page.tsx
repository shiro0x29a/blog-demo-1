import { getPosts, getCategoryBySlug } from '@/shared/lib/payload/queries'
import { PostCard } from '@/features/blog/components/PostCard'
import { Pagination } from '@/features/blog/components/Pagination'
import { BlogTabs } from '@/features/blog/components/BlogTabs'
import { BlogSearch } from '@/features/blog/components/BlogSearch'
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
  const limit = 9

  // Get the USEFUL ARTICLES category
  const articlesCategory = await getCategoryBySlug('articles')
  
  const posts = await getPosts({ page: currentPage, limit, category: articlesCategory?.id })

  if (!posts) {
    notFound()
  }

  const totalPages = Math.ceil(posts.totalDocs / limit)

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

      <div className="max-w-5xl mx-auto">
        {posts.docs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No posts found. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.docs.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={posts.page}
                  totalPages={totalPages}
                  hasNextPage={posts.hasNextPage}
                  hasPrevPage={posts.hasPrevPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
