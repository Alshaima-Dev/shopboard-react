import { useCallback } from 'react'
import { Link } from 'react-router'
import { useLanguage, useTranslation } from '../../features/i18n/useLanguage.ts'
import { feedbackMessages } from '../../features/i18n/feedback.messages.ts'

export interface BoundaryFallbackProps {
  scope: 'page' | 'cart'
  onRetry: () => void
}

export function BoundaryFallback({ scope, onRetry }: BoundaryFallbackProps) {
  const { language } = useLanguage()
  const { t } = useTranslation()
  const text = feedbackMessages[language]
  const focusHeading = useCallback(
    (heading: HTMLHeadingElement | null) => heading?.focus(),
    [],
  )
  return (
    <section
      className="wrap route-page state-page boundary-fallback"
      role="alert"
    >
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
        <Link className="primary" to="/">
          {text.back}
        </Link>
        <button type="button" className="secondary" onClick={onRetry}>
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
        {scope === 'cart' && (
          <Link className="secondary" to="/checkout">
            {t('checkout')}
          </Link>
        )}
      </div>
    </section>
  )
}
