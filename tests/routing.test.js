import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToReadableStream, renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { createServer } from 'vite'
import { products } from '../src/features/products/products.data.ts'
import { routeMessages } from '../src/features/i18n/routes.messages.ts'

Object.defineProperty(globalThis, 'localStorage', {
  value: undefined,
  configurable: true,
})

const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
})
let App, ProductDetails, LanguageProvider, createLanguageStore, CheckoutSuccess
const pages = new Map()
try {
  ;({ App } = await server.ssrLoadModule('/src/App.tsx'))
  ;({ ProductDetails } = await server.ssrLoadModule(
    '/src/features/products/components/ProductDetails.tsx',
  ))
  ;({ LanguageProvider } = await server.ssrLoadModule(
    '/src/features/i18n/LanguageProvider.tsx',
  ))
  ;({ createLanguageStore } = await server.ssrLoadModule(
    '/src/features/i18n/i18n.state.ts',
  ))
  ;({ CheckoutSuccess } = await server.ssrLoadModule(
    '/src/features/checkout/components/CheckoutSuccess.tsx',
  ))
  for (const path of [
    '/',
    '/shop',
    '/about',
    '/shipping',
    '/signup',
    '/products/1',
    '/checkout',
    '/unknown-page',
  ]) {
    const stream = await renderToReadableStream(
      createElement(
        MemoryRouter,
        { initialEntries: [path] },
        createElement(App),
      ),
    )
    await stream.allReady
    pages.set(path, await new Response(stream).text())
  }
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key) =>
        key === 'shopboard-catalog-cart-v2' ? '{"1":2}' : null,
      setItem() {
        assert.fail('Rendering must not save checkout information')
      },
    },
    configurable: true,
  })
  const stream = await renderToReadableStream(
    createElement(
      MemoryRouter,
      { initialEntries: ['/checkout'] },
      createElement(App),
    ),
  )
  await stream.allReady
  pages.set('/checkout-filled', await new Response(stream).text())
} finally {
  Object.defineProperty(globalThis, 'localStorage', {
    value: undefined,
    configurable: true,
  })
  await server.close()
}

test('five meaningful pages, product details and 404 resolve under one shared layout', () => {
  for (const [path, html] of pages) {
    for (const tag of ['header', 'footer', 'main', 'h1'])
      assert.equal(
        [...html.matchAll(new RegExp(`<${tag}\\b`, 'g'))].length,
        1,
        path + ': ' + tag,
      )
    assert.match(html, /href="#main-content"/)
    assert.match(html, /id="cart"/)
    for (const target of ['/', '/shop', '/about', '/shipping', '/signup'])
      assert.ok(html.includes(`href="${target}"`), path + ': ' + target)
  }
  assert.match(pages.get('/'), /class="hero wrap"/)
  assert.match(pages.get('/shop'), /href="\/products\/1"/)
  assert.match(pages.get('/about'), /id="philosophy"/)
  assert.ok(pages.get('/shipping').includes(routeMessages.en.shippingDemo))
  assert.match(pages.get('/signup'), /id="signup-form"/)
  assert.ok(pages.get('/products/1').includes(routeMessages.en.loading))
  assert.ok(pages.get('/unknown-page').includes(routeMessages.en.notFound))
  assert.doesNotMatch(pages.get('/about'), /id="shop-all"[^>]*aria-current/)
})

test('checkout route guards an empty cart and renders the real RHF/shadcn form with saved items', () => {
  const empty = pages.get('/checkout')
  assert.match(empty, /role="status"/)
  assert.doesNotMatch(empty, /class="checkout-form"/)
  const html = pages.get('/checkout-filled')
  assert.match(html, /class="checkout-form"[^>]*novalidate=""/i)
  assert.match(html, /aria-busy="false"/)
  assert.equal([...html.matchAll(/data-slot="input"/g)].length, 7)
  assert.match(html, /data-slot="button"/)
  for (const field of [
    'fullName',
    'email',
    'phone',
    'address',
    'city',
    'postalCode',
    'country',
    'demo',
  ]) {
    assert.ok(html.includes(`id="checkout-${field}"`))
    assert.ok(html.includes(`for="checkout-${field}"`))
  }
  assert.match(html, /aria-describedby="checkout-demo-note checkout-form-note"/)
  assert.match(html, /name="demoAcknowledged"/)
  assert.match(html, /Leather Tote Bag/)
  assert.match(html, /178/)
  assert.doesNotMatch(html, /type="password"/)
})

test('demo success is translated, shows only a summary and never claims a real order', () => {
  for (const language of ['en', 'ar', 'tr']) {
    const store = createLanguageStore({ getItem: () => language, setItem() {} })
    const html = renderToStaticMarkup(
      createElement(
        MemoryRouter,
        null,
        createElement(
          LanguageProvider,
          { store },
          createElement(CheckoutSuccess, {
            receipt: { count: 2, subtotal: 178 },
            onRestart() {},
          }),
        ),
      ),
    )
    assert.match(html, /id="checkout-success-title" tabindex="-1"/)
    assert.match(html, /role="status"/)
    assert.match(html, /href="\/shop"/)
    assert.doesNotMatch(html, /<input/)
  }
})

test('product details loading, missing, error/retry and ready content translate in every language', () => {
  for (const language of ['en', 'ar', 'tr']) {
    const store = createLanguageStore({ getItem: () => language, setItem() {} })
    function render(state) {
      return renderToStaticMarkup(
        createElement(
          MemoryRouter,
          null,
          createElement(
            LanguageProvider,
            { store },
            createElement(ProductDetails, { state, onRetry() {}, onAdd() {} }),
          ),
        ),
      )
    }
    for (const status of ['loading', 'missing', 'error']) {
      const html = render({ status })
      assert.ok(html.includes(routeMessages[language][status]))
      if (status === 'error') {
        assert.match(html, /role="alert"/)
        assert.ok(html.includes(routeMessages[language].retry))
      }
    }
    const html = render({ status: 'ready', product: products[0] })
    assert.ok(html.includes(products[0].translations[language].name))
    assert.match(html, /type="button"/)
  }
  const keys = Object.keys(routeMessages.en)
  for (const language of ['ar', 'tr']) {
    assert.deepEqual(Object.keys(routeMessages[language]), keys)
    for (const key of keys) assert.ok(routeMessages[language][key].trim())
  }
})
