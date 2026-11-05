import { AnnouncementBar } from './components/AnnouncementBar.tsx'
import { StoreHeader } from './components/StoreHeader.tsx'
import { Hero } from './components/Hero.tsx'
import { Benefits } from './components/Benefits.tsx'
import { SignupForm } from './components/SignupForm.tsx'
import { Philosophy } from './components/Philosophy.tsx'
import { StoreFooter } from './components/StoreFooter.tsx'
import { ProductCatalog } from '../../features/products/components/ProductCatalog.tsx'
import { useProductCatalog } from '../../features/products/useProductCatalog.ts'
import { useLanguage } from '../../features/i18n/useLanguage.ts'
import { useCart } from '../../features/cart/useCart.ts'
import { CartDialog } from '../../features/cart/components/CartDialog.tsx'
import { useToast } from '../../shared/ui/useToast.ts'
import { Toast } from '../../shared/ui/Toast.tsx'
export function StorefrontPage() {
  const catalog = useProductCatalog()
  const { language, setLanguage } = useLanguage()
  const toast = useToast()
  const cart = useCart(catalog.catalog, toast.notify)
  return (
    <div id="app">
      <AnnouncementBar />
      <StoreHeader
        language={language}
        setLanguage={setLanguage}
        affordableOnly={catalog.affordableOnly}
        selectMode={catalog.selectMode}
        count={cart.count}
        onOpenCart={cart.open}
      />
      <main>
        <Hero />
        <Benefits />
        <ProductCatalog catalog={catalog} onAdd={cart.addItem} />
        <SignupForm onSuccess={() => toast.notify('signupSuccess')} />
        <Philosophy />
      </main>
      <StoreFooter />
      <CartDialog cart={cart} />
      <Toast notice={toast.notice} />
    </div>
  )
}
