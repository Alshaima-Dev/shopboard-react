import { useReducer, useState } from 'react'
import type { Product } from '../products/products.types.ts'
import type { MessageKey } from '../i18n/i18n.ts'
import { createCartStore } from './cart.state.ts'
import { calculateCartCount, calculateCartTotal } from './cart.logic.ts'
import { createCartActions } from './cart.actions.ts'
import {
  cartDialogReducer,
  initialCartDialogState,
} from './cart.dialog.state.ts'

export function useCart(
  catalog: readonly Product[],
  notify: (key: MessageKey) => void,
) {
  const [store] = useState(() => createCartStore(catalog))
  const [, rerender] = useReducer((revision: number) => revision + 1, 0)
  const [dialog, dispatchDialog] = useReducer(
    cartDialogReducer,
    initialCartDialogState,
  )
  function refresh() {
    rerender()
    if (calculateCartCount(store.getCart()) === 0) dispatchDialog('empty')
  }
  const quantities = store.getCart()
  const items = catalog.filter((product) => quantities[product.id])
  const actions = createCartActions(store, refresh, notify)
  return {
    ...actions,
    quantities,
    items,
    count: calculateCartCount(quantities),
    total: calculateCartTotal(catalog, quantities),
    isOpen: dialog.isOpen,
    confirmClear: dialog.confirmClear && items.length > 0,
    open() {
      dispatchDialog('open')
    },
    close() {
      dispatchDialog('close')
    },
    requestClear() {
      dispatchDialog('requestClear')
    },
    cancelClear() {
      dispatchDialog('cancelClear')
    },
    confirmClearCart() {
      actions.clearCart()
      dispatchDialog('cancelClear')
    },
  }
}

export type CartController = ReturnType<typeof useCart>
