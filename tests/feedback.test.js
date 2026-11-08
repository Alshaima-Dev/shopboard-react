import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement, Suspense } from 'react'
import { renderToReadableStream, renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Routes, Route } from 'react-router'
import { createServer } from 'vite'
import { createRetryablePage } from '../src/pages/layout/lazy-page.ts'
import { products } from '../src/features/products/products.data.ts'
import { createCatalogRefresh } from '../src/features/products/products.refresh.ts'
import { createCartController } from '../src/features/cart/cart.controller.ts'
import { createDemoCheckoutReceipt } from '../src/features/checkout/checkout.logic.ts'
import { feedbackMessages } from '../src/features/i18n/feedback.messages.ts'
import { requestProductDetails } from '../src/features/products/product-details.request.ts'

Object.defineProperty(globalThis, 'localStorage', {
  value: undefined,
  configurable: true,
})
const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
})
let StoreLayout,
  RoutePage,
  CartProvider,
  LanguageProvider,
  createLanguageStore,
  BoundaryFallback,
  ErrorBoundary
try {
  ;({ StoreLayout } = await server.ssrLoadModule(
    '/src/pages/layout/StoreLayout.tsx',
  ))
  ;({ RoutePage } = await server.ssrLoadModule(
    '/src/pages/layout/RoutePage.tsx',
  ))
  ;({ CartProvider } = await server.ssrLoadModule(
    '/src/features/cart/CartProvider.tsx',
  ))
  ;({ LanguageProvider } = await server.ssrLoadModule(
    '/src/features/i18n/LanguageProvider.tsx',
  ))
  ;({ createLanguageStore } = await server.ssrLoadModule(
    '/src/features/i18n/i18n.state.ts',
  ))
  ;({ BoundaryFallback } = await server.ssrLoadModule(
    '/src/shared/ui/BoundaryFallback.tsx',
  ))
  ;({ ErrorBoundary } = await server.ssrLoadModule(
    '/src/shared/ui/ErrorBoundary.tsx',
  ))
} finally {
  await server.close()
}

test('a delayed route streams its loading surface while the actual layout and populated cart remain available', async () => {
  let finish
  let calls = 0
  const page = createRetryablePage(() => {
    calls++
    return new Promise((resolve) => {
      finish = resolve
    })
  })
  const storage = { getItem: () => '{"1":1}', setItem() {} }
  const stream = await renderToReadableStream(
    createElement(
      MemoryRouter,
      { initialEntries: ['/delayed'] },
      createElement(
        LanguageProvider,
        null,
        createElement(
          CartProvider,
          { storage, notify() {} },
          createElement(
            Routes,
            null,
            createElement(
              Route,
              {
                element: createElement(StoreLayout, {
                  notice: null,
                  onSignupSuccess() {},
                }),
              },
              createElement(Route, {
                path: 'delayed',
                element: createElement(RoutePage, { page }),
              }),
            ),
          ),
        ),
      ),
    ),
  )
  const reader = stream.getReader()
  let shell = ''
  while (!shell.includes('</dialog>')) {
    const chunk = await reader.read()
    assert.equal(chunk.done, false)
    shell += new TextDecoder().decode(chunk.value)
  }
  assert.match(shell, /role="status"/)
  assert.match(shell, /id="open-cart"/)
  assert.match(shell, /id="checkout"/)
  assert.match(shell, /<footer/)
  assert.doesNotMatch(shell, /Delayed content ready/)
  finish({ default: () => createElement('h1', null, 'Delayed content ready') })
  await stream.allReady
  let rest = ''
  for (;;) {
    const chunk = await reader.read()
    if (chunk.done) break
    rest += new TextDecoder().decode(chunk.value)
  }
  assert.match(rest, /Delayed content ready/)
  assert.equal(calls, 1)
})

test('retry replaces a rejected React.lazy identity and actually invokes its loader again', async () => {
  let calls = 0
  const errors = []
  const page = createRetryablePage(async () => {
    if (++calls === 1) throw Error('chunk unavailable')
    return { default: () => createElement('h1', null, 'Recovered page') }
  })
  async function render() {
    const stream = await renderToReadableStream(
      createElement(
        Suspense,
        { fallback: createElement('p', null, 'Loading') },
        createElement(page.component),
      ),
      {
        onError: (error) => {
          errors.push(error.message)
        },
      },
    )
    await stream.allReady
    return new Response(stream).text()
  }
  const failedIdentity = page.component
  await render()
  await render()
  assert.equal(
    calls,
    1,
    'React keeps the rejected result until explicit recovery',
  )
  assert.deepEqual(errors, ['chunk unavailable', 'chunk unavailable'])
  page.retry()
  assert.notEqual(page.component, failedIdentity)
  assert.match(await render(), /Recovered page/)
  assert.equal(calls, 2)
})

test('boundary failure state selects a translated recovery surface without exposing error details', () => {
  for (const language of ['en', 'ar', 'tr']) {
    const store = createLanguageStore({ getItem: () => language, setItem() {} })
    for (const scope of ['page', 'cart']) {
      const children = createElement('p', null, 'Healthy content')
      const fallback = createElement(BoundaryFallback, { scope, onRetry() {} })
      const boundary = new ErrorBoundary({ children, fallback })
      assert.equal(boundary.render(), children)
      // Unit-level failure rendering; server rendering does not exercise client catches.
      boundary.state = ErrorBoundary.getDerivedStateFromError(
        Error('private error detail'),
      )
      const html = renderToStaticMarkup(
        createElement(
          MemoryRouter,
          { initialEntries: ['/shop'] },
          createElement(LanguageProvider, { store }, boundary.render()),
        ),
      )
      assert.ok(
        html.includes(
          feedbackMessages[language][
            scope === 'page' ? 'pageTitle' : 'cartTitle'
          ],
        ),
      )
      assert.ok(html.includes(feedbackMessages[language].retry))
      assert.match(html, /role="alert"/)
      assert.ok(
        html.includes(scope === 'cart' ? 'href="/checkout"' : 'href="/"'),
      )
      assert.doesNotMatch(html, /private error detail/)
    }
  }
})

test('delayed, empty and failed catalog refreshes do not block cart operations or checkout summaries', async () => {
  for (const [response, expected] of [
    [new Response(JSON.stringify([])), 'empty'],
    [new Response('', { status: 503 }), 'error'],
    [new Response(JSON.stringify(products)), 'ready'],
  ]) {
    let finish
    let settled
    const done = new Promise((resolve) => {
      settled = resolve
    })
    const statuses = []
    let catalog = products
    const stop = createCatalogRefresh({
      fetcher: () =>
        new Promise((resolve) => {
          finish = resolve
        }),
    })(
      (next) => {
        catalog = next
      },
      (status) => {
        statuses.push(status)
        if (status !== 'loading') settled()
      },
    )
    const cart = createCartController(products, () => {}, null)
    cart.addItem(1)
    cart.changeQuantity(1, 1)
    const quantities = cart.getQuantities()
    assert.deepEqual(createDemoCheckoutReceipt(catalog, quantities), {
      count: 2,
      subtotal: 178,
    })
    assert.deepEqual(statuses, ['loading'])
    finish(response)
    await done
    assert.deepEqual(statuses, ['loading', expected])
    assert.equal(cart.getQuantities(), quantities)
    assert.deepEqual(createDemoCheckoutReceipt(catalog, quantities), {
      count: 2,
      subtotal: 178,
    })
    stop()
  }
})

test('delayed details settle into distinct ready, missing and API-failure states', async () => {
  for (const [response, expected] of [
    [new Response(JSON.stringify(products[0])), 'ready'],
    [new Response('{"error":"Product not found"}', { status: 404 }), 'missing'],
    [new Response('', { status: 503 }), 'error'],
  ]) {
    let finish, settled
    const states = []
    const accepted = []
    const done = new Promise((resolve) => {
      settled = resolve
    })
    const stop = requestProductDetails(
      '1',
      (state) => {
        states.push(state.status)
        if (state.status !== 'loading') settled()
      },
      (product) => accepted.push(product),
      {
        fetcher: () =>
          new Promise((resolve) => {
            finish = resolve
          }),
      },
    )
    assert.deepEqual(states, ['loading'])
    finish(response)
    await done
    assert.deepEqual(states, ['loading', expected])
    assert.equal(accepted.length, expected === 'ready' ? 1 : 0)
    stop()
  }
})

test('page recovery always offers a primary home link and keeps retry on every route', () => {
  for (const language of ['en', 'ar', 'tr']) {
    const store = createLanguageStore({ getItem: () => language, setItem() {} })
    for (const path of ['/shop', '/about', '/products/99']) {
      const html = renderToStaticMarkup(
        createElement(
          MemoryRouter,
          { initialEntries: [path] },
          createElement(
            LanguageProvider,
            { store },
            createElement(BoundaryFallback, { scope: 'page', onRetry() {} }),
          ),
        ),
      )
      assert.match(html, /class="primary"[^>]*href="\/"/)
      assert.ok(html.includes(feedbackMessages[language].back))
      assert.ok(html.includes(feedbackMessages[language].retry))
      assert.match(html, /role="alert"/)
    }
  }
})
