import Link from 'next/link'
import { FolderOpen, FileText } from 'lucide-react'
import type { Category } from '@/features/payload/lib/types'

interface SidebarProps {
  categories: Category[] | null
  recentPosts?: null
}

export function Sidebar({ categories, recentPosts }: SidebarProps) {
  return (
    <div className="space-y-6">
      {/* Sidebar content removed - using tabs for navigation */}
    </div>
  )
}
