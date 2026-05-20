'use client'

import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export function BlogSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const router = useRouter()

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Добавляем query параметр к текущему пути
      const currentPath = pathname.startsWith('/blog/search') ? '/blog/all' : pathname
      router.push(`${currentPath}?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleClear = () => {
    setQuery('')
    // Возвращаемся на текущую страницу без query параметра
    const currentPath = pathname.startsWith('/blog/search') ? '/blog/all' : pathname
    router.push(currentPath)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
      <div className="relative">
        <button
          type="submit"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full pl-10 pr-10 py-3 rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  )
}
