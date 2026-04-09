import { getPosts, getCategories } from '@/shared/lib/payload/queries'
import { PostCard } from '@/features/blog/components/PostCard'
import { Sidebar } from '@/features/blog/components/Sidebar'
import { Pagination } from '@/features/blog/components/Pagination'
import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'

interface TagPageProps {
  params: Promise<{ tag: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata(
  { params }: TagPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { tag } = await params

  return {
    title: `Tag: ${tag} - Blog`,
    description: `Articles tagged with ${tag}`,
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag } = await params
  const { page } = await searchParams
  const currentPage = parseInt(page || '1', 10)
  const limit = 9

  const [postsData, categories] = await Promise.all([
    getPosts({ page: currentPage, limit, tag }),
    getCategories(),
  ])

  if (!postsData) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-muted-foreground">Tag:</span> {tag}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {postsData.docs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No posts found with this tag. Check back soon!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {postsData.docs.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {postsData.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={postsData.page}
                    totalPages={postsData.totalPages}
                    hasNextPage={postsData.hasNextPage}
                    hasPrevPage={postsData.hasPrevPage}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <aside className="lg:col-span-1">
          <Sidebar categories={categories} />
        </aside>
      </div>
    </div>
  )
}
