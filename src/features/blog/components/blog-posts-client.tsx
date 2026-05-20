'use client'

import { useState, useMemo } from 'react'
import { PostCard } from '@/features/blog/components/post-card'
import { Pagination } from '@/features/blog/components/pagination'
import { TagFilters } from '@/features/blog/components/tag-filters'
import type { Post } from '@/features/payload/lib/types'

interface BlogPostsClientProps {
  allPosts: Post[]
  paginatedPosts: Post[]
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function BlogPostsClient({ 
  allPosts,
  paginatedPosts,
  currentPage, 
  totalPages, 
  hasNextPage, 
  hasPrevPage 
}: BlogPostsClientProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Собираем все уникальные теги из ВСЕХ постов категории
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>()
    allPosts.forEach((post) => {
      post.tags?.forEach((tag) => {
        if (tag && typeof tag === 'object' && 'name' in tag) {
          tagsSet.add(tag.name)
        }
      })
    })
    return Array.from(tagsSet).sort()
  }, [allPosts])

  // Фильтруем посты по выбранным тегам из ВСЕХ постов
  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) {
      return paginatedPosts
    }
    return allPosts.filter((post) => {
      if (!post.tags || post.tags.length === 0) return false
      const postTagNames = post.tags.map(tag => 
        typeof tag === 'object' && 'name' in tag ? tag.name : ''
      ).filter(Boolean)
      return selectedTags.every((tag) => postTagNames.includes(tag))
    })
  }, [allPosts, paginatedPosts, selectedTags])

  return (
    <>
      <TagFilters allTags={allTags} onTagsChange={setSelectedTags} />

      <div className="max-w-5xl mx-auto">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No posts found. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 && selectedTags.length === 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  hasNextPage={hasNextPage}
                  hasPrevPage={hasPrevPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
