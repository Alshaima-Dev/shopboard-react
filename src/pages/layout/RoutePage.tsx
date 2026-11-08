import { Suspense, useReducer } from 'react'
import { useLocation } from 'react-router'
import type { RetryablePage } from './lazy-page.ts'
import { ErrorBoundary } from '../../shared/ui/ErrorBoundary.tsx'
import { BoundaryFallback } from '../../shared/ui/BoundaryFallback.tsx'
import { useLanguage } from '../../features/i18n/useLanguage.ts'
import { routeMessages } from '../../features/i18n/routes.messages.ts'

export interface RoutePageProps {
  page: RetryablePage
}

export function RoutePage({ page }: RoutePageProps) {
  const { pathname } = useLocation()
  const { language } = useLanguage()
  const [attempt, retry] = useReducer((value: number) => value + 1, 0)
  const Page = page.component
  function retryPage() {
    document.getElementById('main-content')?.focus({ preventScroll: true })
    page.retry()
    retry()
  }
  return (
    <ErrorBoundary
      key={`${pathname}:${attempt}`}
      fallback={<BoundaryFallback scope="page" onRetry={retryPage} />}
    >
      <Suspense
        fallback={
          <p className="wrap route-loading" role="status" aria-live="polite">
            {routeMessages[language].loading}
          </p>
        }
      >
        <Page />
      </Suspense>
    </ErrorBoundary>
  )
}
