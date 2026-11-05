import { useTranslation } from '../../i18n/useLanguage.ts'
import type { Product } from '../products.types.ts'
import { Icon } from '../../../shared/ui/Icon.tsx'
import { ProductImage } from './ProductImage.tsx'

export interface ProductCardProps {
  product: Product
  onAdd?: (id: number) => void
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const { t, money, textFor } = useTranslation()
  const copy = textFor(product)
  const addLabel = t('add', { name: copy.name })
  return (
    <article className="product">
      <ProductImage product={product}>
        <button
          className="add"
          type="button"
          data-add={product.id}
          aria-label={addLabel}
          title={addLabel}
          onClick={() => onAdd?.(product.id)}
        >
          <Icon name="plus" />
        </button>
      </ProductImage>
      <div className="product-title">
        <h3>{copy.name}</h3>
        <bdi className="product-price">{money(product.price)}</bdi>
      </div>
      <p className="product-category">{t(product.category)}</p>
      <p className="product-description">{copy.description}</p>
    </article>
  )
}
