import { getPosts } from '@/features/payload/lib/queries'
import { PostCard } from '@/features/blog/components/post-card'
import { Pagination } from '@/features/blog/components/pagination'
import { BlogTabs } from '@/features/blog/components/blog-tabs'
import { BlogSearch } from '@/features/blog/components/blog-search'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search - Blog',
  description: 'Search blog posts',
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page } = await searchParams
  const query = q || ''
  const currentPage = parseInt(page || '1', 10)
  const limit = 9

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Search</h1>
          <p className="text-muted-foreground">
            Search for articles, news, and FAQs
          </p>
        </div>

        <BlogSearch />

        <BlogTabs />

        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Enter a search query to find articles
            </p>
          </div>
        </div>
      </div>
    )
  }

  const posts = await getPosts({ page: currentPage, limit, search: query })

  if (!posts) {
    notFound()
  }

  const totalPages = Math.ceil(posts.totalDocs / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground">
          Found {posts.totalDocs} result{posts.totalDocs !== 1 ? 's' : ''} for &quot;{query}&quot;
        </p>
      </div>

      <BlogSearch />

      <BlogTabs />

      <div className="max-w-5xl mx-auto">
        {posts.docs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-2">
              No results found for &quot;{query}&quot;
            </p>
            <p className="text-muted-foreground text-sm">
              Try different keywords or browse our categories
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
