import Link from "next/link"
import { siteConfig } from "@/shared/lib/config/site"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-border bg-background border-t">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="mb-4 text-lg font-semibold">{siteConfig.appName}</h3>
            <p className="text-muted-foreground text-sm">
              {siteConfig.description || "A production-ready Next.js boilerplate"}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground text-sm hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground text-sm hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground text-sm hover:text-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Blog</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog/news" className="text-muted-foreground text-sm hover:text-foreground">
                  News
                </Link>
              </li>
              <li>
                <Link href="/blog/faq" className="text-muted-foreground text-sm hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog/articles" className="text-muted-foreground text-sm hover:text-foreground">
                  Useful Articles
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border mt-8 border-t pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} {siteConfig.appName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
