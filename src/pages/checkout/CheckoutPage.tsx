import { useState } from 'react'
import { Link } from 'react-router'
import { useStorefrontContext } from '../layout/storefront.context.ts'
import { useCart } from '../../features/cart/useCart.ts'
import { useLanguage } from '../../features/i18n/useLanguage.ts'
import { routeMessages } from '../../features/i18n/routes.messages.ts'
import { checkoutMessages } from '../../features/i18n/checkout.messages.ts'
import { CheckoutForm } from '../../features/checkout/components/CheckoutForm.tsx'
import { CheckoutSummary } from '../../features/checkout/components/CheckoutSummary.tsx'
import { CheckoutSuccess } from '../../features/checkout/components/CheckoutSuccess.tsx'
import type { DemoCheckoutReceipt } from '../../features/checkout/checkout.logic.ts'

export function CheckoutPage() {
  const { catalog } = useStorefrontContext()
  const cart = useCart(catalog.catalog)
  const { language } = useLanguage()
  const text = checkoutMessages[language]
  const [receipt, setReceipt] = useState<DemoCheckoutReceipt | null>(null)
  if (receipt)
    return (
      <CheckoutSuccess receipt={receipt} onRestart={() => setReceipt(null)} />
    )
  if (!cart.items.length)
    return (
      <section className="wrap route-page state-page">
        <h1>{text.title}</h1>
        <p role="status">{text.empty}</p>
        <Link className="primary" to="/">
          {routeMessages[language].back}
        </Link>
      </section>
    )
  return (
    <section className="wrap route-page checkout">
      <h1>{text.title}</h1>
      <p id="checkout-demo-note">{text.demo}</p>
      <div className="checkout-grid">
        <CheckoutForm
          cart={cart}
          catalog={catalog.catalog}
          onComplete={setReceipt}
        />
        <CheckoutSummary cart={cart} />
      </div>
    </section>
  )
}
