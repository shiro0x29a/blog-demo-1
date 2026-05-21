import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/features/payload/lib/types'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const coverImage = typeof post.coverImage === 'object' ? post.coverImage : null
  const author = typeof post.author === 'object' ? post.author : null
  const authorAvatar = author && typeof author.avatar === 'object' ? author.avatar : null

  return (
    <article className="group relative bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
      {coverImage && (
        <Link href={`/blog/${post.slug}`} className="block relative aspect-video">
          <Image
            src={coverImage.sizes?.large?.url || coverImage.url || ''}
            alt={coverImage.alt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}

      <div className="p-6">
        <Link href={`/blog/${post.slug}`} className="block">
          <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
        </Link>

        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {authorAvatar && (
              <Image
                src={authorAvatar.sizes?.thumbnail?.url || authorAvatar.url || ''}
                alt={author?.name || ''}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span>{author?.name}</span>
          </div>

          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          )}
        </div>
      </div>
    </article>
  )
}
