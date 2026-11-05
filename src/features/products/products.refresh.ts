import { products } from './products.data.ts'
import { fetchCompleteProducts } from './products.api.ts'
import type { ProductsApiOptions, ProductsApiResult } from './products.api.ts'
import type { Product } from './products.types.ts'
import type { CatalogStatus } from './products.state.ts'

// Share only the in-flight request. StrictMode's effect replay subscribes to the
// same request; a later mount can refresh again after it has settled.
export function createCatalogRefresh(options: ProductsApiOptions = {}) {
  let pending:
    Promise<{ result: ProductsApiResult; empty: boolean }> | undefined

  return function subscribe(
    onCatalog: (catalog: Product[]) => void,
    onStatus?: (status: CatalogStatus) => void,
  ): () => void {
    let active = true
    onStatus?.('loading')
    if (!pending) {
      let empty = false
      const fetcher = options.fetcher ?? globalThis.fetch
      pending = fetchCompleteProducts(products, {
        ...options,
        fetcher: async (url, init) => {
          const response = await fetcher(url, init)
          // Observe only an empty JSON array. Full validation and stable-ID
          // acceptance still belong exclusively to the existing API adapter.
          if (response.ok) {
            try {
              const body: unknown = await response.clone().json()
              empty = Array.isArray(body) && body.length === 0
            } catch {
              // The adapter classifies JSON and timeout failures.
            }
          }
          return response
        },
      })
        .then((result) => ({ result, empty }))
        .finally(() => {
          pending = undefined
        })
    }
    void pending
      .then(({ result, empty }) => {
        if (!active) return
        if (result.ok) onCatalog(result.products)
        onStatus?.(result.ok ? 'ready' : empty ? 'empty' : 'error')
      })
      .catch(() => {
        if (active) onStatus?.('error')
      })
    return () => {
      active = false
    }
  }
}

export const subscribeToCatalogRefresh = createCatalogRefresh()
