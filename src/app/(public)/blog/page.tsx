import { getPosts, getCategories } from '@/features/payload/lib/queries'
import { PostCard } from '@/features/blog/components/post-card'
import { Sidebar } from '@/features/blog/components/sidebar'
import { Pagination } from '@/features/blog/components/pagination'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read our latest articles, tutorials, and guides',
}

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page } = await searchParams
  const currentPage = parseInt(page || '1', 10)
  const limit = 9

  const [posts, categories] = await Promise.all([
    getPosts({ page: currentPage, limit }),
    getCategories(),
  ])

  if (!posts) {
    notFound()
  }

  const totalPages = Math.ceil(posts.totalDocs / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground">
          Read our latest articles, tutorials, and guides
        </p>
      </div>

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
                    currentPage={posts.page ?? 1}
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
