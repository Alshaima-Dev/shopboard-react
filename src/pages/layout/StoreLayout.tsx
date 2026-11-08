import { useEffect, useRef, useReducer } from 'react'
import { Outlet, useLocation } from 'react-router'
import { useProductCatalog } from '../../features/products/useProductCatalog.ts'
import { useCart } from '../../features/cart/useCart.ts'
import { useLanguage } from '../../features/i18n/useLanguage.ts'
import { routeMessages } from '../../features/i18n/routes.messages.ts'
import type { MessageKey } from '../../features/i18n/i18n.ts'
import { AnnouncementBar } from '../storefront/components/AnnouncementBar.tsx'
import { StoreHeader } from '../storefront/components/StoreHeader.tsx'
import { StoreFooter } from '../storefront/components/StoreFooter.tsx'
import { CartDialog } from '../../features/cart/components/CartDialog.tsx'
import { Toast } from '../../shared/ui/Toast.tsx'
import { ErrorBoundary } from '../../shared/ui/ErrorBoundary.tsx'
import { BoundaryFallback } from '../../shared/ui/BoundaryFallback.tsx'

export interface StoreLayoutProps {
  notice: MessageKey | null
  onSignupSuccess: () => void
}

export function StoreLayout({ notice, onSignupSuccess }: StoreLayoutProps) {
  const catalog = useProductCatalog()
  const cart = useCart(catalog.catalog)
  const { language, setLanguage } = useLanguage()
  const { pathname } = useLocation()
  const main = useRef<HTMLElement>(null)
  const previousPath = useRef(pathname)
  const [cartAttempt, retryCart] = useReducer((value: number) => value + 1, 0)
  function recoverCart() {
    document.getElementById('open-cart')?.focus()
    retryCart()
  }
  useEffect(() => {
    // Transfer focus on navigation, never on the initial page load.
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    main.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return (
    <div id="app">
      <a className="skip-link" href="#main-content">
        {routeMessages[language].skip}
      </a>
      <AnnouncementBar />
      <StoreHeader
        language={language}
        setLanguage={setLanguage}
        catalogActive={pathname === '/' || pathname === '/shop'}
        affordableOnly={catalog.affordableOnly}
        selectMode={catalog.selectMode}
        count={cart.count}
        onOpenCart={cart.open}
      />
      <main id="main-content" ref={main} tabIndex={-1}>
        <Outlet context={{ catalog, onSignupSuccess }} />
      </main>
      <StoreFooter />
      <ErrorBoundary
        key={cartAttempt}
        fallback={<BoundaryFallback scope="cart" onRetry={recoverCart} />}
      >
        <CartDialog cart={cart} />
      </ErrorBoundary>
      <Toast notice={notice} />
    </div>
  )
}
