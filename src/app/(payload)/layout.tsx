import type React from "react"

export default function PayloadRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Payload CMS renders its own <html> and <body> tags
  // This layout prevents the root layout from wrapping admin routes
  return <>{children}</>
}

export const dynamic = 'force-dynamic'
