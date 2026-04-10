import { getPostBySlug, getCategories } from '@/shared/lib/payload/queries'
import { PostContent } from '@/features/blog/components/PostContent'
import { PostMeta } from '@/features/blog/components/PostMeta'
import { Sidebar } from '@/features/blog/components/Sidebar'
import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: post.coverImage
        ? [
            {
              url: post.coverImage.url,
              width: 1200,
              height: 630,
              alt: post.coverImage.alt || post.title,
            },
          ]
        : previousImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage.url] : undefined,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const [post, categories] = await Promise.all([
    getPostBySlug(slug),
    getCategories(),
  ])

  if (!post || post.status !== 'published') {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PostMeta post={post} />
          <PostContent content={post.content} />
        </div>

        <aside className="lg:col-span-1">
          <Sidebar categories={categories} />
        </aside>
      </div>
    </article>
  )
}
