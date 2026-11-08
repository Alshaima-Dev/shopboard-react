import type { Product } from '../products/products.types.ts'
import type { MessageKey } from '../i18n/i18n.ts'
import { createCartStore } from './cart.state.ts'
import type { Cart, CartStorage } from './cart.types.ts'
import { calculateCartCount } from './cart.logic.ts'
import { createCartActions } from './cart.actions.ts'
import {
  cartDialogReducer,
  initialCartDialogState,
} from './cart.dialog.state.ts'

export function createCartController(
  catalog: readonly Product[],
  notify: (key: MessageKey) => void,
  storage?: CartStorage | null,
) {
  const store = createCartStore(catalog, storage)
  let dialog = initialCartDialogState
  let snapshot = Object.freeze({
    quantities: Object.freeze(store.getCart()),
    ...dialog,
  })
  const listeners = new Set<() => void>()

  function publish(quantities: Readonly<Cart> = snapshot.quantities) {
    snapshot = Object.freeze({ quantities, ...dialog })
    for (const listener of listeners) listener()
  }
  const actions = createCartActions(
    store,
    () => {
      const quantities = Object.freeze(store.getCart())
      if (calculateCartCount(quantities) === 0)
        dialog = cartDialogReducer(dialog, 'empty')
      publish(quantities)
    },
    notify,
  )

  return {
    ...actions,
    getSnapshot: () => snapshot,
    getQuantities: () => snapshot.quantities,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    open() {
      dialog = cartDialogReducer(dialog, 'open')
      publish()
    },
    close() {
      dialog = cartDialogReducer(dialog, 'close')
      publish()
    },
    requestClear() {
      dialog = cartDialogReducer(dialog, 'requestClear')
      publish()
    },
    cancelClear() {
      dialog = cartDialogReducer(dialog, 'cancelClear')
      publish()
    },
    confirmClearCart() {
      actions.clearCart()
    },
  }
}
