import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildApiUrl,
  getApiScenario,
  fetchJson,
  API_BASE_URL,
  DEFAULT_API_TIMEOUT_MS,
} from '../src/shared/api/client.ts'
import { products } from '../src/features/products/products.data.ts'
import { fetchCompleteProducts } from '../src/features/products/products.api.ts'
import { fetchProductById } from '../src/features/products/product-details.api.ts'
import { createCatalogRefresh } from '../src/features/products/products.refresh.ts'
import { requestProductDetails } from '../src/features/products/product-details.request.ts'

const prefixes = {
  normal: '',
  delay: '/delay/3000',
  fail: '/fail/500',
  empty: '/empty',
}
const response = (body) => new Response(JSON.stringify(body))

test('scenario URL construction retains the only API origin and prefixes both endpoint forms', () => {
  assert.equal(API_BASE_URL, 'https://shopboard-api-nu.vercel.app')
  assert.equal(DEFAULT_API_TIMEOUT_MS, 5000)
  assert.equal(getApiScenario(undefined), 'normal')
  assert.equal(getApiScenario('unsupported'), 'normal')
  for (const [scenario, prefix] of Object.entries(prefixes)) {
    assert.equal(getApiScenario(scenario), scenario)
    for (const endpoint of [
      '/api/products',
      'api/products',
      '/api/products/',
      '/api/products/1',
    ]) {
      assert.equal(
        buildApiUrl(endpoint, scenario),
        API_BASE_URL + prefix + '/' + endpoint.replace(/^\/+/, ''),
      )
    }
  }
})

test('collection and single-product calls pass explicit scenario options through the shared client', async () => {
  for (const [scenario, prefix] of Object.entries(prefixes)) {
    const catalog = await fetchCompleteProducts(products, {
      scenario,
      fetcher: async (url, init) => {
        assert.equal(url, API_BASE_URL + prefix + '/api/products')
        assert.ok(init.signal)
        return response(products)
      },
    })
    assert.deepEqual(catalog, { ok: true, products })
    const detail = await fetchProductById('1', {
      scenario,
      fetcher: async (url) => {
        assert.equal(url, API_BASE_URL + prefix + '/api/products/1')
        return response(products[0])
      },
    })
    assert.deepEqual(detail, { status: 'ready', product: products[0] })
  }
})

test('catalog scenario failures and empty arrays retain fallback products with distinct statuses', async () => {
  for (const [scenario, body, status, expected] of [
    ['empty', [], 200, 'empty'],
    ['fail', {}, 500, 'error'],
  ]) {
    let current = products
    const states = []
    let stop
    await new Promise((resolve) => {
      stop = createCatalogRefresh({
        scenario,
        fetcher: async (url) => {
          assert.equal(url, API_BASE_URL + prefixes[scenario] + '/api/products')
          return new Response(JSON.stringify(body), { status })
        },
      })(
        (catalog) => {
          current = catalog
        },
        (state) => {
          states.push(state)
          if (state !== 'loading') resolve()
        },
      )
    })
    assert.deepEqual(states, ['loading', expected])
    assert.equal(current, products)
    stop()
  }
})

test('the shared transport retains typed HTTP errors on scenario paths', async () => {
  await assert.rejects(
    fetchJson('/api/products', {
      scenario: 'fail',
      fetcher: async () => new Response('', { status: 500 }),
    }),
    { name: 'ApiHttpError', status: 500 },
  )
})

test('detail request lifecycle forwards scenario options and accepts the exact returned product', async () => {
  let stop
  let accepted
  const states = []
  await new Promise((resolve) => {
    stop = requestProductDetails(
      '2',
      (state) => {
        states.push(state.status)
        if (state.status !== 'loading') resolve()
      },
      (product) => {
        accepted = product
      },
      {
        scenario: 'delay',
        fetcher: async (url) => {
          assert.equal(url, API_BASE_URL + '/delay/3000/api/products/2')
          return response(products[1])
        },
      },
    )
  })
  assert.deepEqual(states, ['loading', 'ready'])
  assert.deepEqual(accepted, products[1])
  stop()
})
