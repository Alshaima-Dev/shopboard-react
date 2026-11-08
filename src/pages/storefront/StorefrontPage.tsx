import { Hero } from './components/Hero.tsx'
import { Benefits } from './components/Benefits.tsx'
import { SignupForm } from './components/SignupForm.tsx'
import { Philosophy } from './components/Philosophy.tsx'
import { ProductCatalog } from '../../features/products/components/ProductCatalog.tsx'
import { useCart } from '../../features/cart/useCart.ts'
import { useStorefrontContext } from '../layout/storefront.context.ts'

export function StorefrontPage() {
  const { catalog, onSignupSuccess } = useStorefrontContext()
  const cart = useCart(catalog.catalog)
  return (
    <>
      <Hero />
      <Benefits />
      <ProductCatalog catalog={catalog} onAdd={cart.addItem} />
      <SignupForm onSuccess={onSignupSuccess} />
      <Philosophy />
    </>
  )
}
