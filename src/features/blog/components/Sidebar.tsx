import Link from 'next/link'
import { FolderOpen, FileText } from 'lucide-react'
import type { Category } from '@/shared/lib/payload/types'

interface SidebarProps {
  categories: Category[] | null
  recentPosts?: null
}

export function Sidebar({ categories, recentPosts }: SidebarProps) {
  return (
    <div className="space-y-6">
      {categories && categories.length > 0 && (
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Categories
          </h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/blog/category/${category.slug}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <FolderOpen className="w-4 h-4 flex-shrink-0" />
                  <span className="group-hover:underline">{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Quick Links
        </h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-primary transition-colors hover:underline"
            >
              All Posts
            </Link>
          </li>
          <li>
            <Link
              href="/blog?featured=true"
              className="text-muted-foreground hover:text-primary transition-colors hover:underline"
            >
              Featured Posts
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
