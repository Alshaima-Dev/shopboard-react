import { ProductCatalog } from '../../features/products/components/ProductCatalog.tsx'
import { useCart } from '../../features/cart/useCart.ts'
import { useStorefrontContext } from '../layout/storefront.context.ts'
export function ShopPage() {
  const { catalog } = useStorefrontContext()
  const cart = useCart(catalog.catalog)
  return (
    <ProductCatalog catalog={catalog} onAdd={cart.addItem} headingLevel="h1" />
  )
}
