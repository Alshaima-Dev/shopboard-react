import { createContext } from 'react'
import type { createCartController } from './cart.controller.ts'

type Controller = ReturnType<typeof createCartController>

export interface CartContextValue
  extends
    Omit<Controller, 'getSnapshot' | 'subscribe'>,
    ReturnType<Controller['getSnapshot']> {}

export const CartContext = createContext<CartContextValue | null>(null)
