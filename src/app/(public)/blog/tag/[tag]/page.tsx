import { getPosts } from '@/features/payload/lib/queries'
import { PostCard } from '@/features/blog/components/post-card'
import { Pagination } from '@/features/blog/components/pagination'
import { BlogTabs } from '@/features/blog/components/blog-tabs'
import { BlogSearch } from '@/features/blog/components/blog-search'
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
  const decodedTag = decodeURIComponent(tag)

  return {
    title: `Tag: ${decodedTag} - Blog`,
    description: `Articles tagged with ${decodedTag}`,
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag } = await params
  const { page } = await searchParams
  const currentPage = parseInt(page || '1', 10)
  const limit = 9
  const decodedTag = decodeURIComponent(tag)

  const posts = await getPosts({ page: currentPage, limit, tag: decodedTag })

  if (!posts) {
    notFound()
  }

  const totalPages = Math.ceil(posts.totalDocs / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-muted-foreground">Tag:</span> {decodedTag}
        </h1>
        <p className="text-muted-foreground">
          {posts.totalDocs} article{posts.totalDocs !== 1 ? 's' : ''} tagged with &quot;{decodedTag}&quot;
        </p>
      </div>

      <BlogSearch />

      <BlogTabs />

      <div className="max-w-5xl mx-auto">
        {posts.docs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-2">
              No posts found with this tag.
            </p>
            <p className="text-muted-foreground text-sm">
              Check back soon or browse our categories
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
