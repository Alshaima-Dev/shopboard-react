import { products } from './products.data.ts'
import { fetchCompleteProducts } from './products.api.ts'
import type { ProductsApiOptions, ProductsApiResult } from './products.api.ts'
import type { Product } from './products.types.ts'

// Share only the in-flight request. StrictMode's effect replay subscribes to the
// same request; a later mount can refresh again after it has settled.
export function createCatalogRefresh(options: ProductsApiOptions = {}) {
  let pending: Promise<ProductsApiResult> | undefined

  return function subscribe(onCatalog: (catalog: Product[]) => void): () => void {
    let active = true
    if (!pending) {
      pending = fetchCompleteProducts(products, options).finally(() => {
        pending = undefined
      })
    }
    void pending.then(result => {
      if (active && result.ok) onCatalog(result.products)
    }).catch(() => {
      // Preserve the local catalog and original silent failure behavior.
    })
    return () => { active = false }
  }
}

export const subscribeToCatalogRefresh = createCatalogRefresh()
