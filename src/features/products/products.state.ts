import type { Product } from './products.types.ts'

export type CatalogStatus = 'loading' | 'ready' | 'error' | 'empty'

export interface ProductCatalogState {
  catalog: readonly Product[]
  query: string
  category: string
  sort: string
  affordableOnly: boolean
  status: CatalogStatus
}

export type ProductCatalogAction =
  | { type: 'status'; status: CatalogStatus }
  | { type: 'catalog'; catalog: readonly Product[] }
  | { type: 'query'; value: string }
  | { type: 'category'; value: string }
  | { type: 'sort'; value: string }
  | { type: 'mode'; affordableOnly: boolean }

export function createProductCatalogState(
  catalog: readonly Product[],
): ProductCatalogState {
  return {
    catalog,
    query: '',
    category: '',
    sort: 'featured',
    affordableOnly: false,
    status: 'loading',
  }
}

export function productCatalogReducer(
  state: ProductCatalogState,
  action: ProductCatalogAction,
): ProductCatalogState {
  switch (action.type) {
    case 'status':
      return { ...state, status: action.status }
    case 'catalog':
      return { ...state, catalog: action.catalog }
    case 'query':
      return { ...state, query: action.value }
    case 'category':
      return { ...state, category: action.value }
    case 'sort':
      return { ...state, sort: action.value }
    case 'mode':
      return {
        ...state,
        query: '',
        category: '',
        sort: 'featured',
        affordableOnly: action.affordableOnly,
      }
  }
}
