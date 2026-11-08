import { fetchProducts } from './products.api.ts'
import type { ProductsApiOptions } from './products.api.ts'
import type { Product } from './products.types.ts'

export type ProductDetailsResult =
  | { status: 'ready'; product: Product }
  | { status: 'missing' }
  | { status: 'error' }

// The configured backend has no /api/products/:id route (verified HTTP 404).
// Resolve the ID from its validated API catalog; never substitute local data.
export async function fetchProductById(
  id: string,
  options: ProductsApiOptions = {},
): Promise<ProductDetailsResult> {
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id)))
    return { status: 'missing' }
  const result = await fetchProducts(options)
  if (!result.ok) return { status: 'error' }
  const product = result.products.find((product) => product.id === Number(id))
  return product ? { status: 'ready', product } : { status: 'missing' }
}
