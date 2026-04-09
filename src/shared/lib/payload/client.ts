const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000'

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

async function payloadFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const { params, ...restOptions } = options

    const url = new URL(`${PAYLOAD_API}${endpoint}`)

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
