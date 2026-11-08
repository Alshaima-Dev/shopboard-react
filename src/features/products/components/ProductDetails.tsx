import { Link } from 'react-router'
import { useTranslation, useLanguage } from '../../i18n/useLanguage.ts'
import { routeMessages } from '../../i18n/routes.messages.ts'
import type { ProductDetailsState } from '../product-details.request.ts'
import { ProductImage } from './ProductImage.tsx'

export interface ProductDetailsProps {
  state: ProductDetailsState
  onRetry: () => void
  onAdd: (id: number) => void
}

export function ProductDetails({ state, onRetry, onAdd }: ProductDetailsProps) {
  const { language } = useLanguage()
  const { t, textFor, money } = useTranslation()
  const text = routeMessages[language]
  if (state.status !== 'ready')
    return (
      <section className="wrap route-page state-page">
        <h1>{text.detailsTitle}</h1>
        <p role={state.status === 'error' ? 'alert' : 'status'}>
          {state.status === 'loading'
            ? text.loading
            : state.status === 'missing'
              ? text.missing
              : text.error}
        </p>
        {state.status !== 'loading' && <p>{text.detailsHelp}</p>}
        <div className="boundary-actions">
          <Link className="primary" to="/">
            {text.back}
          </Link>
          {state.status === 'error' && (
            <button className="secondary" type="button" onClick={onRetry}>
              {text.retry}
            </button>
          )}
        </div>
      </section>
    )
  const copy = textFor(state.product)
  return (
    <section className="wrap route-page">
      <Link className="text-link" to="/shop">
        {text.shop}
      </Link>
      <div className="product-details">
        <ProductImage product={state.product} />
        <div>
          <h1>{copy.name}</h1>
          <p>{t(state.product.category)}</p>
          <p>{copy.description}</p>
          <bdi>{money(state.product.price)}</bdi>
          <button
            className="primary"
            type="button"
            onClick={() => onAdd(state.product.id)}
          >
            {t('add', { name: copy.name })}
          </button>
        </div>
      </div>
    </section>
  )
}
