import test from 'node:test'
import assert from 'node:assert/strict'
import { products } from '../src/features/products/products.data.ts'
import { createCartController } from '../src/features/cart/cart.controller.ts'

test('cart subscribers share cached immutable snapshots and unsubscribe independently', () => {
  const controller = createCartController(products, () => {}, null)
  const initial = controller.getSnapshot()
  assert.equal(controller.getSnapshot(), initial)
  const first = []
  const second = []
  const stopFirst = controller.subscribe(() =>
    first.push(controller.getSnapshot()),
  )
  const stopSecond = controller.subscribe(() =>
    second.push(controller.getSnapshot()),
  )
  controller.addItem(1)
  assert.equal(first[0], second[0])
  assert.notEqual(first[0], initial)
  assert.deepEqual(initial.quantities, {})
  assert.deepEqual(first[0].quantities, { 1: 1 })
  assert.throws(() => {
    first[0].quantities[1] = 999
  }, TypeError)
  stopFirst()
  controller.changeQuantity(1, 1)
  assert.equal(first.length, 1)
  assert.equal(second.length, 2)
  assert.deepEqual(first[0].quantities, { 1: 1 })
  assert.deepEqual(second[1].quantities, { 1: 2 })
  stopSecond()
  controller.removeItem(1)
  assert.equal(second.length, 2)
})

test('route consumer replacement retains the cart and restores the existing storage format on reload', () => {
  const saved = new Map([['shopboard-catalog-cart-v2', '{"2":2}']])
  let reads = 0
  const storage = {
    getItem(key) {
      reads++
      return saved.get(key) ?? null
    },
    setItem(key, value) {
      saved.set(key, value)
    },
  }
  const controller = createCartController(products, () => {}, storage)
  const stop = controller.subscribe(() => {})
  controller.addItem(1)
  stop()
  const snapshot = controller.getSnapshot()
  const stopNext = controller.subscribe(() => {})
  assert.equal(controller.getSnapshot(), snapshot)
  assert.equal(reads, 1)
  assert.equal(saved.get('shopboard-catalog-cart-v2'), '{"1":1,"2":2}')
  const restored = createCartController(products, () => {}, storage)
  assert.deepEqual(restored.getSnapshot().quantities, { 1: 1, 2: 2 })
  stopNext()
})

test('shared dialog actions preserve clear cancellation, empty reset, quantity limits and demo checkout', () => {
  const notices = []
  const controller = createCartController(
    products,
    (key) => notices.push(key),
    null,
  )
  controller.addItem(1)
  controller.changeQuantity(1, 200)
  assert.equal(controller.getSnapshot().quantities[1], 99)
  controller.open()
  controller.requestClear()
  controller.cancelClear()
  assert.equal(controller.getSnapshot().confirmClear, false)
  controller.requestClear()
  controller.changeQuantity(1, -99)
  controller.addItem(2)
  assert.equal(controller.getSnapshot().confirmClear, false)
  controller.requestClear()
  controller.close()
  controller.open()
  assert.equal(controller.getSnapshot().confirmClear, false)
  const before = controller.getSnapshot()
  controller.checkout()
  assert.equal(controller.getSnapshot(), before)
  controller.requestClear()
  controller.confirmClearCart()
  assert.deepEqual(controller.getSnapshot().quantities, {})
  assert.equal(controller.getSnapshot().confirmClear, false)
  assert.equal(controller.getSnapshot().isOpen, true)
  assert.deepEqual(notices, ['added', 'added', 'checkoutMessage', 'cleared'])
})

test('the shared controller tolerates blocked and corrupt persistence', () => {
  for (const storage of [
    {
      getItem() {
        throw Error('blocked')
      },
      setItem() {
        throw Error('blocked')
      },
    },
    {
      getItem() {
        return '{bad JSON'
      },
      setItem() {},
    },
  ]) {
    const controller = createCartController(products, () => {}, storage)
    assert.deepEqual(controller.getSnapshot().quantities, {})
    controller.addItem(1)
    assert.deepEqual(controller.getSnapshot().quantities, { 1: 1 })
  }
})
