import type { createCartStore } from './cart.state.ts'
import type { MessageKey } from '../i18n/i18n.ts'

export function createCartActions(
  store: ReturnType<typeof createCartStore>,
  refresh: () => void,
  notify: (key: MessageKey) => void,
) {
  return {
    addItem(id: number) {
      store.addItem(id)
      refresh()
      notify('added')
    },
    changeQuantity(id: number, step: number) {
      store.changeQuantity(id, step)
      refresh()
    },
    removeItem(id: number) {
      store.removeItem(id)
      refresh()
      notify('removed')
    },
    clearCart() {
      store.clearCart()
      refresh()
      notify('cleared')
    },
    checkout() {
      notify('checkoutMessage')
    },
  }
}
