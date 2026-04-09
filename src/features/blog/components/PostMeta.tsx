import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, Tag, FolderOpen } from 'lucide-react'
import type { Post } from '@/shared/lib/payload/types'

interface PostMetaProps {
  post: Post
}

export function PostMeta({ post }: PostMetaProps) {
  return (
    <header className="mb-8">
      {post.coverImage && (
        <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.coverImage.large || post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="w-4 h-4" />
          {post.author.avatar && (
            <Image
              src={post.author.avatar.thumbnail || post.author.avatar.url}
              alt={post.author.name}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span>{post.author.name}</span>
        </div>

        {post.publishedAt && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <FolderOpen className="w-3 h-3" />
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag, index) => (
            <Link
              key={index}
              href={`/blog/tag/${encodeURIComponent(tag)}`}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </Link>
          ))}
        </div>
      )}

      {post.excerpt && (
        <p className="text-lg text-muted-foreground italic border-l-4 border-primary/50 pl-4">
          {post.excerpt}
        </p>
      )}

      <hr className="mt-8 border-border" />
    </header>
  )
}
