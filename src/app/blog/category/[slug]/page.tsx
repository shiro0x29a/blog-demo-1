import { getPosts, getCategoryBySlug, getCategories } from '@/shared/lib/payload/queries'
import { PostCard } from '@/features/blog/components/PostCard'
import { Sidebar } from '@/features/blog/components/Sidebar'
import { Pagination } from '@/features/blog/components/Pagination'
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
  const { page } = await searchParams
  const currentPage = parseInt(page || '1', 10)
  const limit = 9

  const [category, postsData, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getPosts({ page: currentPage, limit, category: slug }),
    getCategories(),
  ])

  if (!category) {
    notFound()
  }

  if (!postsData) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground">{category.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {postsData.docs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No posts found in this category. Check back soon!
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
