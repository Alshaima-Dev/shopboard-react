import { lazy } from 'react'
import type { ComponentType } from 'react'

export type PageLoader = () => Promise<{ default: ComponentType }>

// React.lazy caches rejected promises. A retry must replace that identity too.
export function createRetryablePage(load: PageLoader) {
  let component = lazy(load)
  return {
    get component() {
      return component
    },
    retry() {
      component = lazy(load)
    },
  }
}

export type RetryablePage = ReturnType<typeof createRetryablePage>
