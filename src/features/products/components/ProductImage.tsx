import type { ReactNode } from 'react'
import type { Product } from '../products.types.ts'
import { ProductPhoto } from './ProductPhoto.tsx'

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
  return (
    <div className={className + ' product-photo'}>
      <ProductPhoto key={product.image} product={product} />
      {children}
    </div>
  )
}
