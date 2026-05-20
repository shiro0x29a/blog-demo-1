'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/shared/lib/utils'

interface TagFiltersProps {
  allTags: string[]
  onTagsChange: (tags: string[]) => void
}

export function TagFilters({ allTags, onTagsChange }: TagFiltersProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    onTagsChange(selectedTags)
  }, [selectedTags, onTagsChange])

  const handleTagClick = (tag: string) => {
    if (tag === 'All') {
      setSelectedTags([])
      return
    }

    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag)
      } else {
        return [...prev, tag]
      }
    })
  }

  const isActive = (tag: string) => {
    if (tag === 'All') {
      return selectedTags.length === 0
    }
    return selectedTags.includes(tag)
  }

  if (allTags.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => handleTagClick('All')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-full transition-colors',
            isActive('All')
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-full transition-colors',
              isActive(tag)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
