const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || ''

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

async function payloadFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const { params, ...restOptions } = options

    // Build URL - if running in same Next.js app, use relative path
    const baseUrl = PAYLOAD_API || ''
    const url = new URL(`${baseUrl}${endpoint}`, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    const response = await fetch(url.toString(), {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...restOptions.headers,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export { payloadFetch }
