import test from 'node:test'
import assert from 'node:assert/strict'
import { products } from '../src/features/products/products.data.ts'
import { createCartStore } from '../src/features/cart/cart.state.ts'
import {
  calculateCartCount,
  calculateCartTotal,
} from '../src/features/cart/cart.logic.ts'
import { createCartActions } from '../src/features/cart/cart.actions.ts'
import {
  createToastController,
  TOAST_DURATION_MS,
} from '../src/shared/ui/toast.controller.ts'
import {
  cartDialogReducer,
  initialCartDialogState,
} from '../src/features/cart/cart.dialog.state.ts'

test('cart actions reuse persistence, limit quantities, remove at zero, and notify only original actions', () => {
  const saved = new Map([['shopboard-catalog-cart-v2', '{"1":2}']])
  const storage = {
    getItem: (key) => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value),
  }
  const store = createCartStore(products, storage)
  const notices = []
  let renders = 0
  const actions = createCartActions(
    store,
    () => {
      renders++
    },
    (key) => notices.push(key),
  )
  actions.addItem(1)
  actions.changeQuantity(1, 200)
  assert.equal(store.getCart()[1], 99)
  actions.changeQuantity(1, -99)
  assert.deepEqual(store.getCart(), {})
  actions.addItem(2)
  assert.equal(calculateCartCount(store.getCart()), 1)
  assert.equal(calculateCartTotal(products, store.getCart()), 49)
  actions.removeItem(2)
  actions.addItem(3)
  const before = saved.get('shopboard-catalog-cart-v2')
  actions.checkout()
  assert.equal(
    saved.get('shopboard-catalog-cart-v2'),
    before,
    'demo checkout must not clear or mutate saved cart',
  )
  actions.clearCart()
  assert.deepEqual(createCartStore(products, storage).getCart(), {})
  assert.deepEqual(notices, [
    'added',
    'added',
    'removed',
    'added',
    'checkoutMessage',
    'cleared',
  ])
  assert.equal(renders, 7)
})

test('catalog price/detail updates recalculate totals without changing stored quantities', () => {
  const store = createCartStore(products, null)
  store.addItem(1)
  store.addItem(1)
  const before = store.getCart()
  assert.equal(calculateCartTotal(products, before), 178)
  const refreshed = products.map((product) => ({
    ...product,
    price: product.price + 10,
    name: 'Updated ' + product.name,
  }))
  assert.equal(calculateCartTotal(refreshed, store.getCart()), 198)
  assert.deepEqual(store.getCart(), before)
})

test('clear confirmation can be requested and cancelled; close, reopen and empty reset it', () => {
  const store = createCartStore(products, null)
  store.addItem(1)
  let dialog = cartDialogReducer(initialCartDialogState, 'open')
  dialog = cartDialogReducer(dialog, 'requestClear')
  assert.deepEqual(dialog, { isOpen: true, confirmClear: true })
  assert.deepEqual(
    store.getCart(),
    { 1: 1 },
    'request alone never clears quantities',
  )
  dialog = cartDialogReducer(dialog, 'cancelClear')
  assert.deepEqual(dialog, { isOpen: true, confirmClear: false })
  assert.deepEqual(store.getCart(), { 1: 1 })
  dialog = cartDialogReducer(dialog, 'requestClear')
  dialog = cartDialogReducer(dialog, 'close')
  assert.deepEqual(dialog, initialCartDialogState)
  dialog = cartDialogReducer(dialog, 'open')
  assert.equal(dialog.confirmClear, false)
  dialog = cartDialogReducer(dialog, 'requestClear')
  dialog = cartDialogReducer(dialog, 'empty')
  assert.deepEqual(dialog, { isOpen: true, confirmClear: false })
  const actions = createCartActions(
    store,
    () => {},
    () => {},
  )
  actions.clearCart()
  dialog = cartDialogReducer(dialog, 'cancelClear')
  assert.deepEqual(store.getCart(), {})
  assert.equal(
    dialog.isOpen,
    true,
    'confirmed clear keeps the empty dialog open',
  )
})

test('toast replacement restarts 2600ms dismissal and cleanup cancels pending timers', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] })
  const notices = []
  const toast = createToastController((key) => notices.push(key))
  assert.equal(TOAST_DURATION_MS, 2600)
  toast.notify('added')
  context.mock.timers.tick(2500)
  assert.deepEqual(notices, ['added'])
  toast.notify('removed')
  context.mock.timers.tick(100)
  assert.deepEqual(notices, ['added', 'removed'])
  context.mock.timers.tick(2500)
  assert.deepEqual(notices, ['added', 'removed', null])
  toast.notify('cleared')
  toast.dispose()
  context.mock.timers.tick(2600)
  assert.deepEqual(notices, ['added', 'removed', null, 'cleared'])
})
