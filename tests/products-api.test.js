import test from 'node:test'
import assert from 'node:assert/strict'
import { products } from '../src/features/products/products.data.ts'
import {
  fetchCompleteProducts,
  PRODUCTS_API_ENDPOINT,
} from '../src/features/products/products.api.ts'
import { API_BASE_URL } from '../src/shared/api/client.ts'

const responseWith = (body, status = 200) =>
  new Response(JSON.stringify(body), { status })

test('complete valid API data keeps the stable local product IDs', async () => {
  const result = await fetchCompleteProducts(products, {
    fetcher: async (url) => {
      const requestUrl = new URL(url)
      assert.equal(requestUrl.origin, API_BASE_URL)
      assert.equal(requestUrl.pathname, '/api/products')
      assert.equal(PRODUCTS_API_ENDPOINT, requestUrl.pathname)
      return responseWith(products)
    },
  })

  assert.equal(result.ok, true)
  if (result.ok) assert.deepEqual(result.products, products)
})

test('incomplete or invalid API data is rejected for the local fallback', async () => {
  const incomplete = await fetchCompleteProducts(products, {
    fetcher: async () => responseWith([products[0]]),
  })
  assert.deepEqual(incomplete, { ok: false, error: 'invalid-response' })

  const invalid = await fetchCompleteProducts(products, {
    fetcher: async () => responseWith([{ id: 1 }]),
  })
  assert.deepEqual(invalid, { ok: false, error: 'invalid-response' })
})

test('HTTP, network, JSON, and timeout failures return typed API outcomes', async () => {
  const http = await fetchCompleteProducts(products, {
    fetcher: async () => responseWith([], 503),
  })
  assert.deepEqual(http, { ok: false, error: 'http', status: 503 })

  const network = await fetchCompleteProducts(products, {
    fetcher: async () => {
      throw new Error('offline')
    },
  })
  assert.deepEqual(network, { ok: false, error: 'network' })

  const invalidJson = await fetchCompleteProducts(products, {
    fetcher: async () => new Response('not JSON'),
  })
  assert.deepEqual(invalidJson, { ok: false, error: 'invalid-response' })

  const timeout = await fetchCompleteProducts(products, {
    timeoutMs: 1,
    fetcher: (_, init) =>
      new Promise((_, reject) => {
        init.signal?.addEventListener('abort', () => reject(Error('aborted')))
      }),
  })
  assert.deepEqual(timeout, { ok: false, error: 'timeout' })
})
