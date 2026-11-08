import { Link, NavLink } from 'react-router'
import { getLocalization } from '../../../features/i18n/useLanguage.ts'
import { BrandMark } from '../../../shared/ui/BrandMark.tsx'
import { Icon } from '../../../shared/ui/Icon.tsx'
import type { Language } from '../../../features/products/products.types.ts'
import { AFFORDABLE_PRICE_LIMIT } from '../../../features/products/products.logic.ts'
import type { ProductCatalogController } from '../../../features/products/useProductCatalog.ts'

export interface StoreHeaderProps extends Pick<
  ProductCatalogController,
  'affordableOnly' | 'selectMode'
> {
  language?: Language
  setLanguage?: (value: unknown) => void
  count?: number
  onOpenCart?: () => void
  catalogActive?: boolean
}

export function StoreHeader({
  affordableOnly,
  selectMode,
  language = 'en',
  setLanguage = () => {},
  count = 0,
  onOpenCart,
  catalogActive = true,
}: StoreHeaderProps) {
  const { t, money, number } = getLocalization(language)
  return (
    <header className="wrap header">
      <Link
        className="wordmark"
        to="/"
        data-i18n-aria="home"
        aria-label={t('home')}
      >
        <span className="brand-mark" data-brand-mark="" aria-hidden="true">
          <BrandMark />
        </span>
        <span className="brand-name" lang="en" dir="ltr">
          YANINDA
        </span>
      </Link>
      <nav data-i18n-aria="navigation" aria-label={t('navigation')}>
        <Link
          to="/shop"
          id="shop-all"
          className={catalogActive && !affordableOnly ? 'active' : undefined}
          aria-current={catalogActive && !affordableOnly ? 'true' : undefined}
          onClick={() => selectMode(false)}
          data-i18n="shopAll"
        >
          {t('shopAll')}
        </Link>
        <Link
          to="/shop"
          id="affordable-products"
          className={catalogActive && affordableOnly ? 'active' : undefined}
          aria-current={catalogActive && affordableOnly ? 'true' : undefined}
          onClick={() => selectMode(true)}
        >
          {t('underPrice', { price: money(AFFORDABLE_PRICE_LIMIT) })}
        </Link>
        <NavLink to="/about" data-i18n="philosophy">
          {t('philosophy')}
        </NavLink>
      </nav>
      <div className="header-actions" dir="ltr">
        <div className="language-picker">
          <label htmlFor="language" className="sr-only" data-i18n="language">
            {t('language')}
          </label>
          <select
            id="language"
            dir="auto"
            value={language}
            onChange={(event) => setLanguage(event.currentTarget.value)}
          >
            <option value="ar" lang="ar" dir="rtl">
              العربية
            </option>
            <option value="en" lang="en">
              English
            </option>
            <option value="tr" lang="tr">
              Türkçe
            </option>
          </select>
        </div>
        <button
          id="open-cart"
          className="bag"
          type="button"
          onClick={onOpenCart}
          aria-label={t('openBag', { count: number(count) })}
        >
          <span className="bag-icon" aria-hidden="true">
            <Icon name="Bags" />
          </span>
          <span className="bag-label" data-i18n="bag">
            {t('bag')}
          </span>
          <span id="count">{number(count)}</span>
        </button>
      </div>
    </header>
  )
}
