import { getPosts, getCategoryBySlug } from '@/features/payload/lib/queries'
import { PostCard } from '@/features/blog/components/post-card'
import { Pagination } from '@/features/blog/components/pagination'
import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata(
  { params }: CategoryPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} - Blog`,
    description: category.description || `Articles in the ${category.name} category`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  console.log('[CategoryPage] slug:', slug)
  
  const { page } = await searchParams
  const currentPage = parseInt(page || '1', 10)
  const limit = 9

  const category = await getCategoryBySlug(slug)
  console.log('[CategoryPage] category:', category)

  if (!category) {
    notFound()
  }

  console.log('[CategoryPage] calling getPosts with category.id:', category.id)
  
  const posts = await getPosts({ page: currentPage, limit, category: category.id })
  
  console.log('[CategoryPage] posts result:', { totalDocs: posts.totalDocs, docsCount: posts.docs.length })

  if (!posts) {
    notFound()
  }

  const totalPages = Math.ceil(posts.totalDocs / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground">{category.description}</p>
        )}
      </div>

      <div className="max-w-5xl mx-auto">
        {posts.docs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No posts found in this category. Check back soon!
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
