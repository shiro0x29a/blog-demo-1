import { getPostBySlug, getCategories } from '@/features/payload/lib/queries'
import { PostContent } from '@/features/blog/components/post-content'
import { PostMeta } from '@/features/blog/components/post-meta'
import { Sidebar } from '@/features/blog/components/sidebar'
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
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col items-center">
        <div className="w-full">
          <PostMeta post={post} />
          <PostContent content={post.content} />
        </div>

        <aside className="w-full mt-12">
          <Sidebar categories={categories} />
        </aside>
      </div>
    </article>
  )
}
