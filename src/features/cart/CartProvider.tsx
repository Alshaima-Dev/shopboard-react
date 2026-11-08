import { useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import type { MessageKey } from '../i18n/i18n.ts'
import { products } from '../products/products.data.ts'
import type { CartStorage } from './cart.types.ts'
import { createCartController } from './cart.controller.ts'
import { CartContext } from './cart.context.ts'

export interface CartProviderProps {
  children: ReactNode
  notify: (key: MessageKey) => void
  storage?: CartStorage | null
}

export function CartProvider({ children, notify, storage }: CartProviderProps) {
  const [controller] = useState(() =>
    createCartController(products, notify, storage),
  )
  const { subscribe, getSnapshot, ...actions } = controller
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return (
    <CartContext value={{ ...actions, ...snapshot }}>{children}</CartContext>
  )
}
