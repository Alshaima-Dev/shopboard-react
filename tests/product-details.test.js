import test from 'node:test'
import assert from 'node:assert/strict'
import { products } from '../src/features/products/products.data.ts'
import { fetchProductById } from '../src/features/products/product-details.api.ts'
import { requestProductDetails } from '../src/features/products/product-details.request.ts'
import {
  productCatalogReducer,
  createProductCatalogState,
} from '../src/features/products/products.state.ts'
import { API_BASE_URL } from '../src/shared/api/client.ts'

const response = (body) => new Response(JSON.stringify(body))

test('details makes one genuine single-product request and reuses product validation', async () => {
  let calls = 0
  const result = await fetchProductById('1', {
    fetcher: async (url) => {
      calls++
      assert.equal(url, API_BASE_URL + '/api/products/1')
      return response(products[0])
    },
  })
  assert.equal(calls, 1)
  assert.deepEqual(result, { status: 'ready', product: products[0] })
  for (const body of [
    [products[0]],
    {},
    { ...products[0], id: 2 },
    { ...products[0], translations: {} },
  ]) {
    assert.deepEqual(
      await fetchProductById('1', { fetcher: async () => response(body) }),
      { status: 'error' },
    )
  }
})

test('missing products and invalid route IDs do not substitute local products', async () => {
  assert.deepEqual(
    await fetchProductById('1', {
      fetcher: async () =>
        new Response('{"error":"Product not found"}', { status: 404 }),
    }),
    { status: 'missing' },
  )
  assert.deepEqual(
    await fetchProductById('999', {
      fetcher: async () => new Response('', { status: 404 }),
    }),
    { status: 'missing' },
  )
  for (const id of ['', '0', '-1', '1.5', 'abc', '1e2', '9007199254740992']) {
    assert.deepEqual(
      await fetchProductById(id, {
        fetcher() {
          assert.fail('Invalid ID must not fetch')
        },
      }),
      { status: 'missing' },
    )
  }
})

test('details HTTP, offline, malformed JSON and timeout failures remain observable', async () => {
  for (const fetcher of [
    async () => new Response('', { status: 503 }),
    async () => {
      throw Error('offline')
    },
    async () => new Response('bad JSON'),
    (_, init) =>
      new Promise((_, reject) =>
        init.signal.addEventListener('abort', () => reject(Error('aborted'))),
      ),
  ]) {
    assert.deepEqual(await fetchProductById('1', { fetcher, timeoutMs: 1 }), {
      status: 'error',
    })
  }
})

test('leaving a details route aborts its request and ignores a stale response', async () => {
  let finish
  let signal
  const states = []
  const accepted = []
  const stop = requestProductDetails(
    '1',
    (state) => states.push(state.status),
    (product) => accepted.push(product),
    {
      fetcher: (_, init) => {
        signal = init.signal
        return new Promise((resolve) => {
          finish = resolve
        })
      },
    },
  )
  stop()
  assert.equal(signal.aborted, true)
  finish(response(products[0]))
  await new Promise((resolve) => setImmediate(resolve))
  assert.deepEqual(states, ['loading'])
  assert.deepEqual(accepted, [])
})

test('details retry recovers and merging updated prices preserves catalog controls', async () => {
  const updated = { ...products[0], price: 99 }
  let calls = 0
  let catalog = {
    ...createProductCatalogState(products),
    query: 'bag',
    category: 'Bags',
    sort: 'high',
    affordableOnly: true,
  }
  const states = []
  const options = {
    fetcher: async () =>
      ++calls === 1 ? new Response('', { status: 500 }) : response(updated),
  }
  async function run() {
    let stop
    await new Promise((resolve) => {
      stop = requestProductDetails(
        '1',
        (state) => {
          states.push(state.status)
          if (state.status !== 'loading') resolve()
        },
        (product) => {
          catalog = productCatalogReducer(catalog, { type: 'product', product })
        },
        options,
      )
    })
    stop()
  }
  await run()
  await run()
  assert.deepEqual(states, ['loading', 'error', 'loading', 'ready'])
  assert.equal(catalog.catalog[0].price, 99)
  assert.equal(products[0].price, 89)
  assert.deepEqual(
    [catalog.query, catalog.category, catalog.sort, catalog.affordableOnly],
    ['bag', 'Bags', 'high', true],
  )
})
