import { getPosts, getCategories, getCategoryBySlug } from '@/shared/lib/payload/queries'
import { PostCard } from '@/features/blog/components/PostCard'
import { Sidebar } from '@/features/blog/components/Sidebar'
import { Pagination } from '@/features/blog/components/Pagination'
import { BlogTabs } from '@/features/blog/components/BlogTabs'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News - Blog',
  description: 'Read our latest news articles and updates',
}

interface NewsPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { page } = await searchParams
  const currentPage = parseInt(page || '1', 10)
  const limit = 9

  // Get the NEWS category
  const newsCategory = await getCategoryBySlug('news')
  
  const [posts, categories] = await Promise.all([
    getPosts({ page: currentPage, limit, category: newsCategory?.id }),
    getCategories(),
  ])

  if (!posts) {
    notFound()
  }

  const totalPages = Math.ceil(posts.totalDocs / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">News</h1>
        <p className="text-muted-foreground">
          Read our latest news articles and updates
        </p>
      </div>

      <BlogTabs />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
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

        <aside className="lg:col-span-1">
          <Sidebar
            categories={categories}
            recentPosts={null}
          />
        </aside>
      </div>
    </div>
  )
}
