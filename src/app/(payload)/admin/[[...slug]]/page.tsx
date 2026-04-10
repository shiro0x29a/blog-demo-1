import { RootLayout } from '@payloadcms/next/layouts'
import { RootPage } from '@payloadcms/next/views'
import configPromise from '@payload-config'

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<Record<string, string>>
}) {
  const { slug } = await params
  const search = await searchParams
  const segments = slug || []

  return (
    <RootLayout config={configPromise}>
      <RootPage
        config={configPromise}
        params={{ segments }}
        searchParams={search}
      />
    </RootLayout>
  )
}
