import { useEffect, useReducer } from 'react'
import { products } from './products.data.ts'
import { getCategories, selectProducts } from './products.logic.ts'
import {
  createProductCatalogState,
  productCatalogReducer,
} from './products.state.ts'
import { subscribeToCatalogRefresh } from './products.refresh.ts'
import { useLanguage } from '../i18n/useLanguage.ts'

export function useProductCatalog() {
  const { language } = useLanguage()
  const [state, dispatch] = useReducer(
    productCatalogReducer,
    products,
    createProductCatalogState,
  )
  const [request, retry] = useReducer((value: number) => value + 1, 0)
  useEffect(
    () =>
      subscribeToCatalogRefresh(
        (catalog) => {
          dispatch({ type: 'catalog', catalog })
        },
        (status) => {
          dispatch({ type: 'status', status })
        },
      ),
    [request],
  )
  return {
    ...state,
    language,
    retry,
    categories: getCategories(state.catalog),
    visibleProducts: selectProducts(state.catalog, { ...state, language }),
    setQuery: (value: string) => dispatch({ type: 'query', value }),
    setCategory: (value: string) => dispatch({ type: 'category', value }),
    setSort: (value: string) => dispatch({ type: 'sort', value }),
    selectMode: (affordableOnly: boolean) =>
      dispatch({ type: 'mode', affordableOnly }),
  }
}

export type ProductCatalogController = ReturnType<typeof useProductCatalog>
