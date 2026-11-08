import { fetchProductById } from './product-details.api.ts'
import type { ProductDetailsResult } from './product-details.api.ts'
import type { ProductsApiOptions } from './products.api.ts'
import type { Product } from './products.types.ts'

export type ProductDetailsState = ProductDetailsResult | { status: 'loading' }

export function requestProductDetails(
  id: string,
  publish: (state: ProductDetailsState) => void,
  onProduct: (product: Product) => void,
  options: ProductsApiOptions = {},
) {
  const controller = new AbortController()
  let active = true
  publish({ status: 'loading' })
  const fetcher = options.fetcher ?? globalThis.fetch
  void fetchProductById(id, {
    ...options,
    fetcher: (input, init) =>
      fetcher(input, {
        ...init,
        signal: init.signal
          ? AbortSignal.any([init.signal, controller.signal])
          : controller.signal,
      }),
  })
    .then((result) => {
      if (!active) return
      if (result.status === 'ready') onProduct(result.product)
      publish(result)
    })
    .catch(() => {
      if (active) publish({ status: 'error' })
    })
  return () => {
    active = false
    controller.abort()
  }
}
