'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/lib/utils'

const tabs = [
  { label: 'ALL', href: '/blog/all' },
  { label: 'NEWS', href: '/blog/news' },
  { label: 'FAQ', href: '/blog/faq' },
  { label: 'USEFUL ARTICLES', href: '/blog/articles' },
]

export function BlogTabs() {
  const pathname = usePathname()

  return (
    <div className="mb-8">
      <div className="flex justify-center">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'px-4 py-3 text-sm font-medium transition-colors border-b-[3px]',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
              )}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
