import { useContext } from 'react'
import type { Product } from '../products/products.types.ts'
import { calculateCartCount, calculateCartTotal } from './cart.logic.ts'
import { CartContext } from './cart.context.ts'

export function useCart(catalog: readonly Product[]) {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('useCart must be used within CartProvider')
  const { quantities } = cart
  const items = catalog.filter((product) => quantities[product.id])
  return {
    ...cart,
    items,
    count: calculateCartCount(quantities),
    total: calculateCartTotal(catalog, quantities),
    confirmClear: cart.confirmClear && items.length > 0,
  }
}

export type CartController = ReturnType<typeof useCart>
