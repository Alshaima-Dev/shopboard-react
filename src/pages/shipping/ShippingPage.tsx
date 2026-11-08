import { Link } from 'react-router'
import { useLanguage } from '../../features/i18n/useLanguage.ts'
import { routeMessages } from '../../features/i18n/routes.messages.ts'
export function ShippingPage() {
  const { language } = useLanguage()
  const text = routeMessages[language]
  return (
    <section
      className="wrap route-page shipping-page"
      aria-labelledby="shipping-title"
    >
      <div className="page-intro">
        <span className="eyebrow">{text.shippingEyebrow}</span>
        <h1 id="shipping-title">{text.shipping}</h1>
      </div>
      <div className="shipping-grid">
        <section className="information-card">
          <span className="information-number" aria-hidden="true">
            01
          </span>
          <h2>{text.shippingThreshold}</h2>
          <p>{text.shippingDescription}</p>
        </section>
        <section className="information-card">
          <span className="information-number" aria-hidden="true">
            02
          </span>
          <h2>{text.shippingCurrency}</h2>
          <p>{text.shippingCurrencyDescription}</p>
        </section>
      </div>
      <aside
        className="availability-note"
        aria-labelledby="shipping-availability"
      >
        <h2 id="shipping-availability">{text.shippingAvailability}</h2>
        <p>{text.shippingDemo}</p>
        <Link className="text-link" to="/shop">
          {text.shop}
        </Link>
      </aside>
    </section>
  )
}
