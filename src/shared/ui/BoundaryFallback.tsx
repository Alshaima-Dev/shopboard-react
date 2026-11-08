import { useCallback } from 'react'
import { Link, useLocation } from 'react-router'
import { useLanguage, useTranslation } from '../../features/i18n/useLanguage.ts'
import { feedbackMessages } from '../../features/i18n/feedback.messages.ts'
import { routeMessages } from '../../features/i18n/routes.messages.ts'

export interface BoundaryFallbackProps {
  scope: 'page' | 'cart'
  onRetry: () => void
}

export function BoundaryFallback({ scope, onRetry }: BoundaryFallbackProps) {
  const { language } = useLanguage()
  const { t } = useTranslation()
  const text = feedbackMessages[language]
  const { pathname } = useLocation()
  const returnHome = scope === 'page' && pathname === '/shop'
  const focusHeading = useCallback(
    (heading: HTMLHeadingElement | null) => heading?.focus(),
    [],
  )
  return (
    <section className="wrap route-page boundary-fallback" role="alert">
      {scope === 'page' ? (
        <h1 tabIndex={-1} ref={focusHeading}>
          {text.pageTitle}
        </h1>
      ) : (
        <h2 tabIndex={-1} ref={focusHeading}>
          {text.cartTitle}
        </h2>
      )}
      <p>{scope === 'page' ? text.pageError : text.cartError}</p>
      <div className="boundary-actions">
        <button type="button" className="primary" onClick={onRetry}>
          {text.retry}
        </button>
        {scope === 'page' && (
          <button
            type="button"
            className="clear-cart"
            onClick={() => window.location.reload()}
          >
            {text.reload}
          </button>
        )}
        <Link to={scope === 'cart' ? '/checkout' : returnHome ? '/' : '/shop'}>
          {scope === 'cart'
            ? t('checkout')
            : returnHome
              ? routeMessages[language].home
              : text.back}
        </Link>
      </div>
    </section>
  )
}
