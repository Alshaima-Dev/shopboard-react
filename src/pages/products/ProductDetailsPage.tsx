import { useEffect, useReducer, useState } from 'react'
import { useParams } from 'react-router'
import { useStorefrontContext } from '../layout/storefront.context.ts'
import { requestProductDetails } from '../../features/products/product-details.request.ts'
import type { ProductDetailsState } from '../../features/products/product-details.request.ts'
import { ProductDetails } from '../../features/products/components/ProductDetails.tsx'
import { useCart } from '../../features/cart/useCart.ts'

export function ProductDetailsPage() {
  const id = useParams().id ?? ''
  const { catalog } = useStorefrontContext()
  const { updateProduct } = catalog
  const cart = useCart(catalog.catalog)
  const [revision, retry] = useReducer((value: number) => value + 1, 0)
  const [response, setResponse] = useState<{
    id: string
    result: ProductDetailsState
  }>({ id, result: { status: 'loading' } })
  useEffect(
    () =>
      requestProductDetails(
        id,
        (result) => setResponse({ id, result }),
        updateProduct,
      ),
    [id, revision, updateProduct],
  )
  const state: ProductDetailsState =
    response.id === id ? response.result : { status: 'loading' }
  return <ProductDetails state={state} onRetry={retry} onAdd={cart.addItem} />
}
