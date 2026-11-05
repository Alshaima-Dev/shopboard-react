import { useTranslation } from '../../i18n/useLanguage.ts'
import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../products.types.ts'

export interface ProductImageProps {
  product: Product
  children?: ReactNode
  className?: string
}

export function ProductImage({
  product,
  children,
  className = 'product-image',
}: ProductImageProps) {
  const { t, textFor } = useTranslation()
  const [failures, setFailures] = useState(0)
  const base = import.meta.env?.BASE_URL || '/'
  const copy = textFor(product)
  const unavailable = t('imageUnavailable', { name: copy.name })
  const fallback = !product.image || failures > 0
  return (
    <div className={className + ' product-photo'}>
      <img
        className="product-photo-img"
        src={base + (fallback ? 'images/products/fallback.svg' : product.image)}
        alt={failures ? unavailable : copy.alt}
        loading="lazy"
        decoding="async"
        width={1024}
        height={1024}
        hidden={failures >= (product.image ? 2 : 1)}
        onError={() => setFailures((count) => count + 1)}
      />
      {failures > 0 && <span className="photo-unavailable">{unavailable}</span>}
      {children}
    </div>
  )
}
