import { getPosts } from '@/features/payload/lib/queries'
import { NextResponse } from 'next/server'

export async function GET() {
  const postsData = await getPosts({ limit: 20 })

  const posts = postsData?.docs || []

  const rssXML = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog RSS Feed</title>
    <link>${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/blog</link>
    <description>Latest blog posts</description>
    <language>en-us</language>
    <ttl>60</ttl>
    <atom:link href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/blog/rss.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/blog/${post.slug}</link>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : ''}</pubDate>
      <guid isPermaLink="true">${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/blog/${post.slug}</guid>
      ${post.categories?.map((category) => `<category>${category.name}</category>`).join('') || ''}
    </item>
        `
      )
      .join('')}
  </channel>
</rss>`

  return new NextResponse(rssXML, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
