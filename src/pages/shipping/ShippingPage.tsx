import { useLanguage } from '../../features/i18n/useLanguage.ts'
import { routeMessages } from '../../features/i18n/routes.messages.ts'

export function ShippingPage() {
  const { language } = useLanguage()
  const text = routeMessages[language]
  return (
    <section className="wrap route-page">
      <h1>{text.shipping}</h1>
      <p>{text.shippingDescription}</p>
      <p>{text.shippingDemo}</p>
    </section>
  )
}
