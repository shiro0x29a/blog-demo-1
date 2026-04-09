import { RootLayout } from '@payloadcms/next/layouts'
import { RootPage } from '@payloadcms/next/views'
import configPromise from '@payload-config'

export default async function AdminPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const segments = slug || []

  return (
    <RootLayout config={configPromise}>
      <RootPage
        config={configPromise}
        params={{
          segments,
        }}
      />
    </RootLayout>
  )
}
