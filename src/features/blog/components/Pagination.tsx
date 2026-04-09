'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: PaginationProps) {
  const router = useRouter()

  const getPageUrl = (page: number) => {
    return `?page=${page}`
  }

  const renderPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return (
          <span
            key={`ellipsis-${index}`}
            className="px-3 py-2 text-muted-foreground"
          >
            ...
          </span>
        )
      }

      return (
        <Link
          key={page}
          href={getPageUrl(page as number)}
          className={`px-3 py-2 rounded-md transition-colors ${
            page === currentPage
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'hover:bg-muted'
          }`}
        >
          {page}
        </Link>
      )
    })
  }

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {hasPrevPage ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="sr-only">Previous page</span>
          Previous
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-1 px-3 py-2 rounded-md opacity-50 cursor-not-allowed"
          aria-label="Previous page (disabled)"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
      )}

      <div className="flex items-center gap-1">{renderPageNumbers()}</div>

      {hasNextPage ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          aria-label="Next page"
        >
          Next
          <ChevronRight className="w-4 h-4" />
          <span className="sr-only">Next page</span>
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-1 px-3 py-2 rounded-md opacity-50 cursor-not-allowed"
          aria-label="Next page (disabled)"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </nav>
  )
}
