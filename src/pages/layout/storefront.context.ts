import { useOutletContext } from 'react-router'
import type { ProductCatalogController } from '../../features/products/useProductCatalog.ts'

export interface StorefrontContextValue {
  catalog: ProductCatalogController
  onSignupSuccess: () => void
}

export function useStorefrontContext() {
  return useOutletContext<StorefrontContextValue>()
}
