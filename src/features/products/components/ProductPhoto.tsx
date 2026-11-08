import { useTranslation } from '../../i18n/useLanguage.ts'
import { useState } from 'react'
import type { Product } from '../products.types.ts'

export interface ProductPhotoProps {
  product: Product
}

export function ProductPhoto({ product }: ProductPhotoProps) {
  const { t, textFor } = useTranslation()
  const [failures, setFailures] = useState(0)
  const base = import.meta.env?.BASE_URL || '/'
  const copy = textFor(product)
  const unavailable = t('imageUnavailable', { name: copy.name })
  const fallback = !product.image || failures > 0
  return (
    <>
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
    </>
  )
}
