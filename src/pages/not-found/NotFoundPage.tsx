import { Link } from 'react-router'
import { useLanguage } from '../../features/i18n/useLanguage.ts'
import { routeMessages } from '../../features/i18n/routes.messages.ts'

export function NotFoundPage() {
  const { language } = useLanguage()
  const text = routeMessages[language]
  return (
    <section className="wrap route-page">
      <h1>{text.notFound}</h1>
      <p>{text.notFoundDescription}</p>
      <Link className="primary" to="/shop">
        {text.back}
      </Link>
    </section>
  )
}
