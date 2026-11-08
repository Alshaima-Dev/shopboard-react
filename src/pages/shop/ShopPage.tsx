import { ProductCatalog } from '../../features/products/components/ProductCatalog.tsx'
import { useCart } from '../../features/cart/useCart.ts'
import { useStorefrontContext } from '../layout/storefront.context.ts'
import { routeMessages } from '../../features/i18n/routes.messages.ts'

export function ShopPage() {
  const { catalog } = useStorefrontContext()
  const cart = useCart(catalog.catalog)
  return (
    <>
      <h1 className="wrap route-title">
        {routeMessages[catalog.language].shop}
      </h1>
      <ProductCatalog catalog={catalog} onAdd={cart.addItem} />
    </>
  )
}
