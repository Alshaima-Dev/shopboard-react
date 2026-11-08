import type { Product } from '../../products/products.types.ts'
import { ProductImage } from '../../products/components/ProductImage.tsx'
import { useTranslation } from '../../i18n/useLanguage.ts'
import { Icon } from '../../../shared/ui/Icon.tsx'

export interface CartItemProps {
  product: Product
  quantity: number
  changeQuantity: (id: number, step: number) => void
  removeItem: (id: number) => void
}

export function CartItem({
  product,
  quantity,
  changeQuantity,
  removeItem,
}: CartItemProps) {
  const { t, money, number, textFor } = useTranslation()
  const copy = textFor(product)
  return (
    <article className="cart-item">
      <ProductImage product={product} className="cart-visual" />
      <div>
        <h3>{copy.name}</h3>
        <p>{money(product.price)}</p>
        <div className="quantity">
          <button
            type="button"
            data-change={product.id}
            aria-label={t('decrease', { name: copy.name })}
            title={t('decrease', { name: copy.name })}
            onClick={() => changeQuantity(product.id, -1)}
          >
            <Icon name="minus" />
          </button>
          <span
            aria-label={t('quantity', {
              name: copy.name,
              count: number(quantity),
            })}
          >
            {number(quantity)}
          </span>
          <button
            type="button"
            data-change={product.id}
            aria-label={t('increase', { name: copy.name })}
            title={t('increase', { name: copy.name })}
            onClick={() => changeQuantity(product.id, 1)}
          >
            <Icon name="plus" />
          </button>
          <button
            type="button"
            className="remove"
            data-remove={product.id}
            aria-label={t('removeItem', { name: copy.name })}
            onClick={() => removeItem(product.id)}
          >
            {t('remove')}
          </button>
        </div>
      </div>
    </article>
  )
}
