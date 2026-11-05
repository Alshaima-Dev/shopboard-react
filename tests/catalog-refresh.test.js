import test from 'node:test'
import assert from 'node:assert/strict'
import { setImmediate } from 'node:timers/promises'
import { products } from '../src/features/products/products.data.ts'
import { createCatalogRefresh } from '../src/features/products/products.refresh.ts'
import { createProductCatalogState, productCatalogReducer } from '../src/features/products/products.state.ts'
import { selectProducts } from '../src/features/products/products.logic.ts'
import { DEFAULT_API_TIMEOUT_MS } from '../src/shared/api/client.ts'

const response = body => new Response(JSON.stringify(body))
const updated = products.map(product => ({ ...product, price: product.price + 1 }))

test('local catalog is immediate and valid API replacement preserves current controls', async () => {
  let finish
  const subscribe = createCatalogRefresh({ fetcher: () => new Promise(resolve => { finish = resolve }) })
  let state = createProductCatalogState(products)
  const stop = subscribe(catalog => { state = productCatalogReducer(state, { type: 'catalog', catalog }) })
  assert.equal(state.catalog, products)
  for (const action of [
    { type: 'mode', affordableOnly: true },
    { type: 'category', value: 'Bags' },
    { type: 'query', value: 'bag' },
    { type: 'sort', value: 'high' },
  ]) state = productCatalogReducer(state, action)
  const before = state
  finish(response(updated))
  await setImmediate()
  assert.deepEqual(state.catalog, updated)
  assert.deepEqual({ ...state, catalog: products }, before)
  assert.deepEqual(selectProducts(state.catalog, state).map(product => product.price), [40])
  stop()
})

test('StrictMode setup/cleanup/setup shares a request and ignores the stale subscriber', async () => {
  let finish
  let calls = 0
  const subscribe = createCatalogRefresh({ fetcher: () => {
    calls++
    return new Promise(resolve => { finish = resolve })
  } })
  const stale = []
  const current = []
  const stopFirst = subscribe(catalog => stale.push(catalog))
  stopFirst()
  const stopSecond = subscribe(catalog => current.push(catalog))
  assert.equal(calls, 1)
  finish(response(updated))
  await setImmediate()
  assert.equal(stale.length, 0)
  assert.deepEqual(current, [updated])
  stopSecond()
  const stopThird = subscribe(catalog => current.push(catalog))
  assert.equal(calls, 2)
  stopThird()
  finish(response(products))
  await setImmediate()
  assert.equal(current.length, 1, 'unmounted subscriber must not receive a late response')
})

test('invalid, incomplete, duplicate and mismatched IDs silently retain local products', async () => {
  const duplicate = products.map((product, index) => index === 1 ? products[0] : product)
  const differentIds = products.map((product, index) => index === 0 ? { ...product, id: 999 } : product)
  for (const body of [[{ id: 1 }], products.slice(1), duplicate, differentIds, []]) {
    let state = createProductCatalogState(products)
    const stop = createCatalogRefresh({ fetcher: async () => response(body) })(catalog => {
      state = productCatalogReducer(state, { type: 'catalog', catalog })
    })
    await setImmediate()
    assert.equal(state.catalog, products)
    stop()
  }
})

test('offline, HTTP and invalid JSON failures silently retain the catalog', async () => {
  for (const fetcher of [
    async () => { throw new Error('offline') },
    async () => new Response('', { status: 503 }),
    async () => new Response('invalid json'),
  ]) {
    let state = createProductCatalogState(products)
    const stop = createCatalogRefresh({ fetcher })(catalog => {
      state = productCatalogReducer(state, { type: 'catalog', catalog })
    })
    await setImmediate()
    assert.equal(state.catalog, products)
    stop()
  }
})

test('timeout aborts the request and retains local data; production default is five seconds', async () => {
  assert.equal(DEFAULT_API_TIMEOUT_MS, 5000)
  let signal
  let replacements = 0
  const stop = createCatalogRefresh({ timeoutMs: 1, fetcher: (_, init) => {
    signal = init.signal
    return new Promise((_, reject) => {
      signal.addEventListener('abort', () => reject(new Error('aborted')))
    })
  } })(() => { replacements++ })
  await new Promise(resolve => setTimeout(resolve, 20))
  assert.equal(signal.aborted, true)
  assert.equal(replacements, 0)
  stop()
})
