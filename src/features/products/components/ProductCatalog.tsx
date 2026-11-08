import { getLocalization } from '../../i18n/useLanguage.ts'
import { AFFORDABLE_PRICE_LIMIT } from '../products.logic.ts'
import type { ProductCatalogController } from '../useProductCatalog.ts'
import { Icon } from '../../../shared/ui/Icon.tsx'
import { ProductCard } from './ProductCard.tsx'
export interface ProductCatalogProps {
  catalog: ProductCatalogController
  onAdd?: (id: number) => void
}

export function ProductCatalog({ catalog, onAdd }: ProductCatalogProps) {
  const { t, money, number, catalogText } = getLocalization(catalog.language)
  return (
    <section className="shop wrap" id="shop" aria-labelledby="shop-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow" data-i18n="shopEyebrow">
            {t('shopEyebrow')}
          </span>
          <h2 id="shop-title" data-i18n="shopTitle">
            {t('shopTitle')}
          </h2>
        </div>
        <p data-i18n="shopDescription">{t('shopDescription')}</p>
      </div>
      <div className="toolbar">
        <div className="controls">
          <label className="search" htmlFor="product-search">
            <span className="sr-only" data-i18n="search">
              {t('search')}
            </span>
            <span className="search-icon" aria-hidden="true">
              <Icon name="search" />
            </span>
            <input
              id="product-search"
              value={catalog.query}
              onChange={(event) => catalog.setQuery(event.currentTarget.value)}
              type="search"
              data-i18n-placeholder="searchPlaceholder"
              placeholder={t('searchPlaceholder')}
              data-i18n-aria="search"
              aria-label={t('search')}
            />
          </label>
          <div className="control-field">
            <label htmlFor="category" data-i18n="category">
              {t('category')}
            </label>
            <select
              id="category"
              value={catalog.category}
              onChange={(event) =>
                catalog.setCategory(event.currentTarget.value)
              }
            >
              <option value="" data-i18n="allCategories">
                {t('allCategories')}
              </option>
              {catalog.categories.map((category) => (
                <option key={category} value={category}>
                  {t(category)}
                </option>
              ))}
            </select>
          </div>
          <div className="control-field">
            <label htmlFor="sort" data-i18n="sort">
              {t('sort')}
            </label>
            <select
              id="sort"
              value={catalog.sort}
              onChange={(event) => catalog.setSort(event.currentTarget.value)}
              data-i18n-aria="sort"
              aria-label={t('sort')}
            >
              <option value="featured" data-i18n="featured">
                {t('featured')}
              </option>
              <option value="low" data-i18n="low">
                {t('low')}
              </option>
              <option value="high" data-i18n="high">
                {t('high')}
              </option>
            </select>
          </div>
        </div>
      </div>
      {catalog.status === 'loading' && (
        <p role="status">{catalogText.loading}</p>
      )}
      {(catalog.status === 'error' || catalog.status === 'empty') && (
        <div>
          <p role={catalog.status === 'error' ? 'alert' : 'status'}>
            {catalog.status === 'error' ? catalogText.error : catalogText.empty}
          </p>
          <button type="button" className="primary" onClick={catalog.retry}>
            {catalogText.retry}
          </button>
        </div>
      )}
      <p id="results" aria-live="polite">
        {t('results', { count: number(catalog.visibleProducts.length) })}
        {catalog.affordableOnly
          ? ' · ' + t('underPrice', { price: money(AFFORDABLE_PRICE_LIMIT) })
          : ''}
      </p>
      <div
        id="products"
        className="product-grid"
        aria-busy={catalog.status === 'loading'}
      >
        {catalog.visibleProducts.length ? (
          catalog.visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))
        ) : catalog.status === 'loading' &&
          catalog.catalog.length === 0 ? null : (
          <p className="empty">
            {catalog.catalog.length ? t('noResults') : catalogText.noProducts}
          </p>
        )}
      </div>
    </section>
  )
}
