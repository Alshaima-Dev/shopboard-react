import { Link } from 'react-router'
import { useLanguage } from '../../features/i18n/useLanguage.ts'
import { routeMessages } from '../../features/i18n/routes.messages.ts'

export function NotFoundPage() {
  const { language } = useLanguage()
  const text = routeMessages[language]
  return (
    <section className="wrap route-page state-page">
      <span className="eyebrow" aria-hidden="true">
        404 / YANINDA
      </span>
      <h1>{text.notFound}</h1>
      <p>{text.notFoundDescription}</p>
      <Link className="primary" to="/">
        {text.back}
      </Link>
    </section>
  )
}
