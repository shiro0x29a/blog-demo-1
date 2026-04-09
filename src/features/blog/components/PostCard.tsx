import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/shared/lib/payload/types'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group relative bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
      {post.coverImage && (
        <Link href={`/blog/${post.slug}`} className="block relative aspect-video">
          <Image
            src={post.coverImage.large || post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.categories?.slice(0, 2).map((category) => (
            <Link
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>

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
            {post.author.avatar && (
              <Image
                src={post.author.avatar.thumbnail || post.author.avatar.url}
                alt={post.author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span>{post.author.name}</span>
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
