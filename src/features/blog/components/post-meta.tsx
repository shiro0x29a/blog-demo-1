import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, Tag, ChevronRight } from 'lucide-react'
import type { Post } from '@/features/payload/lib/types'

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

      <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

      {/* Row 1: Author, Date, Tags */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Author */}
        <div className="flex items-center gap-2 text-muted-foreground">
          {!post.author.avatar && <User className="w-4 h-4" />}
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

        {/* Date */}
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

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${encodeURIComponent(tag.name)}`}
                className="text-sm px-2.5 py-1 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Row 2: Category Breadcrumbs */}
      {post.categories && post.categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 mb-6">
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          {post.categories.map((category, index) => (
            <span key={category.id} className="flex items-center gap-1">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link
                href={`/blog/category/${category.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {category.name}
              </Link>
            </span>
          ))}
        </div>
      )}

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-lg text-muted-foreground italic border-l-4 border-primary/50 pl-4 mb-6">
          {post.excerpt}
        </p>
      )}

      <hr className="border-border" />
    </header>
  )
}
