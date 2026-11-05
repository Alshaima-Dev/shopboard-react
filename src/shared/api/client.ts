export const API_BASE_URL = 'https://shopboard-api-nu.vercel.app'
export const DEFAULT_API_TIMEOUT_MS = 5_000

export interface ApiFetcher {
  (input: string, init: RequestInit): Promise<Response>
}

export interface FetchJsonOptions {
  fetcher?: ApiFetcher
  timeoutMs?: number
}

export class ApiHttpError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`Request failed with status ${status}`)
    this.name = 'ApiHttpError'
    this.status = status
  }
}

export class ApiJsonError extends Error {
  constructor() {
    super('Response did not contain valid JSON')
    this.name = 'ApiJsonError'
  }
}

export class ApiTimeoutError extends Error {
  constructor() {
    super('Request timed out')
    this.name = 'ApiTimeoutError'
  }
}

export async function fetchJson(
  endpoint: string,
  {
    fetcher = globalThis.fetch,
    timeoutMs = DEFAULT_API_TIMEOUT_MS,
  }: FetchJsonOptions = {},
): Promise<unknown> {
  const controller = new AbortController()
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const url = new URL(endpoint, API_BASE_URL).href
    const response = await fetcher(url, { signal: controller.signal })
    if (!response.ok) throw new ApiHttpError(response.status)

    try {
      return await response.json()
    } catch {
      throw new ApiJsonError()
    }
  } catch (error: unknown) {
    if (controller.signal.aborted) throw new ApiTimeoutError()
    throw error
  } finally {
    globalThis.clearTimeout(timeout)
  }
}
