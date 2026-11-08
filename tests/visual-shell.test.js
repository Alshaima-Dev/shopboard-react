import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createElement } from 'react'
import {
  renderToStaticMarkup as renderMarkup,
  renderToReadableStream,
} from 'react-dom/server'
import { MemoryRouter, Routes, Route } from 'react-router'
import { createServer } from 'vite'
import { products } from '../src/features/products/products.data.ts'
import {
  getCategories,
  selectProducts,
} from '../src/features/products/products.logic.ts'
import {
  createProductCatalogState,
  productCatalogReducer,
} from '../src/features/products/products.state.ts'
import {
  messages,
  translate,
  languages,
  getProductText,
  formatPrice,
} from '../src/features/i18n/i18n.ts'
import { applyDocumentLanguage } from '../src/features/i18n/language.document.ts'

function renderToStaticMarkup(node) {
  return renderMarkup(createElement(MemoryRouter, null, node))
}

Object.defineProperty(globalThis, 'localStorage', {
  value: undefined,
  configurable: true,
})

// Vite transforms the actual TSX with the installed React plugin, without a listener.
const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
})
let html
let ProductCatalog
let StoreHeader
let LanguageProvider
let StorefrontPage
let createLanguageStore
let CartDialog
let Toast
let CartProvider
let useCart
let ProductImage
let StoreLayout
try {
  const { App } = await server.ssrLoadModule('/src/App.tsx')
  ;({ ProductCatalog } = await server.ssrLoadModule(
    '/src/features/products/components/ProductCatalog.tsx',
  ))
  ;({ StoreHeader } = await server.ssrLoadModule(
    '/src/pages/storefront/components/StoreHeader.tsx',
  ))
  ;({ LanguageProvider } = await server.ssrLoadModule(
    '/src/features/i18n/LanguageProvider.tsx',
  ))
  ;({ StorefrontPage } = await server.ssrLoadModule(
    '/src/pages/storefront/StorefrontPage.tsx',
  ))
  ;({ createLanguageStore } = await server.ssrLoadModule(
    '/src/features/i18n/i18n.state.ts',
  ))
  ;({ CartDialog } = await server.ssrLoadModule(
    '/src/features/cart/components/CartDialog.tsx',
  ))
  ;({ Toast } = await server.ssrLoadModule('/src/shared/ui/Toast.tsx'))
  ;({ CartProvider } = await server.ssrLoadModule(
    '/src/features/cart/CartProvider.tsx',
  ))
  ;({ useCart } = await server.ssrLoadModule('/src/features/cart/useCart.ts'))
  ;({ ProductImage } = await server.ssrLoadModule(
    '/src/features/products/components/ProductImage.tsx',
  ))
  ;({ StoreLayout } = await server.ssrLoadModule(
    '/src/pages/layout/StoreLayout.tsx',
  ))
  const stream = await renderToReadableStream(
    createElement(MemoryRouter, null, createElement(App)),
  )
  await stream.allReady
  await new Response(stream).text()
  html = renderToStaticMarkup(createElement(App))
} finally {
  await server.close()
}

test('rendered shell preserves landmarks, section order, labels, and unique IDs', () => {
  for (const tag of ['header', 'nav', 'main', 'footer', 'h1']) {
    assert.equal(
      [...html.matchAll(new RegExp(`<${tag}\\b`, 'g'))].length,
      tag === 'nav' ? 2 : 1,
    )
  }
  const sections = [
    'announcement wrap',
    'wrap header',
    'hero wrap',
    'benefits wrap',
    'shop wrap',
    'signup wrap',
    'philosophy wrap',
    '<footer',
  ]
  let previous = -1
  for (const section of sections) {
    const index = html.indexOf(section)
    assert.ok(index > previous, section)
    previous = index
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
  assert.equal(new Set(ids).size, ids.length)
  for (const control of html.matchAll(/<(?:input|select)\b[^>]*>/g)) {
    const id = control[0].match(/\bid="([^"]+)"/)?.[1]
    assert.ok(id)
    assert.match(html, new RegExp(`<label\\b[^>]*for="${id}"[^>]*>\\s*\\S`))
  }
  assert.match(html, /type="password"[^>]*minlength="8"/i)
  assert.match(html, /<form\b[^>]*aria-describedby="signup-note"/)
})

test('CartProvider supplies one cart to sibling consumers while product details stay derived', () => {
  let reads = 0
  const storage = {
    getItem() {
      reads++
      return '{"1":2}'
    },
    setItem() {},
  }
  const captured = []
  function CartProbe({ catalog }) {
    const cart = useCart(catalog)
    captured.push(cart)
    return createElement('span', null, cart.count)
  }
  const updated = products.map((product) => ({
    ...product,
    price: product.price + 10,
  }))
  renderToStaticMarkup(
    createElement(
      CartProvider,
      { storage, notify() {} },
      createElement(CartProbe, { catalog: products }),
      createElement(CartProbe, { catalog: updated }),
    ),
  )
  assert.equal(reads, 1)
  assert.equal(captured[0].quantities, captured[1].quantities)
  assert.equal(captured[0].addItem, captured[1].addItem)
  assert.equal(captured[0].count, 2)
  assert.equal(captured[1].total - captured[0].total, 20)
  assert.equal(captured[1].items[0].price, updated[0].price)
  assert.throws(
    () => renderToStaticMarkup(createElement(CartProbe, { catalog: products })),
    /within CartProvider/,
  )
})

test('a changed image source remounts only its failure state and preserves the add-button child', () => {
  const child = createElement('button', { type: 'button' }, 'Add')
  const original = ProductImage({ product: products[0], children: child })
  const product = { ...products[0], image: 'images/products/replacement.jpg' }
  const replacement = ProductImage({ product, children: child })
  const sameSource = ProductImage({
    product: { ...products[0], price: 1 },
    children: child,
  })
  assert.equal(original.type, replacement.type)
  assert.equal(
    original.props.children[0].type,
    replacement.props.children[0].type,
  )
  assert.notEqual(
    original.props.children[0].key,
    replacement.props.children[0].key,
  )
  assert.equal(original.props.children[0].key, sameSource.props.children[0].key)
  assert.equal(original.props.children[1], replacement.props.children[1])
  assert.match(
    renderToStaticMarkup(replacement),
    /src="\/images\/products\/replacement.jpg"/,
  )
  assert.doesNotMatch(renderToStaticMarkup(replacement), /hidden=""/)
})

test('all local product cards, original images and accessible add buttons render', () => {
  assert.equal([...html.matchAll(/<article class="product">/g)].length, 12)
  for (const product of products) {
    assert.ok(html.includes(product.translations.en.name), product.name)
    assert.ok(html.includes(product.image), product.image)
    assert.match(
      html,
      new RegExp(`data-add="${product.id}"[^>]*aria-label="[^"]+"`),
    )
    assert.doesNotMatch(
      html.match(new RegExp(`<button[^>]*data-add="${product.id}"[^>]*>`))[0],
      /aria-disabled|disabled=/,
    )
  }
  assert.match(html, /images\/brand\/yaninda-campaign\.jpg/)
  assert.match(html, /12 thoughtfully chosen products/)
})

test('demo sign-up retains native constraints and catalog starts with loading feedback and local products', () => {
  const form = html.match(
    /<form\b(?=[^>]*id="signup-form")[^>]*>[\s\S]*?<\/form>/,
  )?.[0]
  assert.ok(form)
  assert.doesNotMatch(form, /\bnovalidate\b|\baction=/i)
  const email = form.match(/<input\b(?=[^>]*id="signup-email")[^>]*>/)?.[0]
  const password = form.match(
    /<input\b(?=[^>]*id="signup-password")[^>]*>/,
  )?.[0]
  assert.ok(email)
  assert.ok(password)
  assert.match(email, /\btype="email"/)
  assert.match(email, /\brequired=""/)
  assert.match(password, /\btype="password"/)
  assert.match(password, /\bminlength="8"/i)
  assert.match(password, /\brequired=""/)
  assert.match(password, /aria-describedby="signup-password-hint"/)
  const submit = form.match(/<button\b[^>]*type="submit"[^>]*>/)?.[0]
  assert.ok(submit)
  assert.doesNotMatch(submit, /\bdisabled\b/)
  assert.match(html, /Refreshing the collection/)
  assert.doesNotMatch(html, /role="alert"|Try again/)
})

test('brand symbols retain favicon geometry and editable LTR YANINDA text', () => {
  const favicon = fs.readFileSync(
    new URL('../public/yaninda.svg', import.meta.url),
    'utf8',
  )
  const logos = html.match(/<a\b[^>]*class="wordmark"[^>]*>[\s\S]*?<\/a>/g)
  assert.equal(logos.length, 2)
  for (const logo of logos) {
    assert.match(logo, /class="brand-name" lang="en" dir="ltr">YANINDA/)
    assert.doesNotMatch(logo, /<img\b/)
    const paths = [...logo.matchAll(/<path\b[^>]*d="([^"]+)"/g)]
    assert.equal(paths.length, 4)
    for (const match of paths) assert.ok(favicon.includes(`d="${match[1]}"`))
  }
})

// Exercise component event callbacks against the production reducer, then render
// their resulting props. Browser event dispatch/focus still needs manual QA.
function controls(initialCatalog = products) {
  let state = createProductCatalogState(initialCatalog)
  const dispatch = (action) => {
    state = productCatalogReducer(state, action)
  }
  function controller() {
    return {
      ...state,
      language: 'en',
      categories: getCategories(state.catalog),
      visibleProducts: selectProducts(state.catalog, {
        ...state,
        language: 'en',
      }),
      setQuery: (value) => dispatch({ type: 'query', value }),
      setCategory: (value) => dispatch({ type: 'category', value }),
      setSort: (value) => dispatch({ type: 'sort', value }),
      selectMode: (affordableOnly) =>
        dispatch({ type: 'mode', affordableOnly }),
    }
  }
  function find(node, id) {
    if (!node || typeof node !== 'object') return undefined
    if (Array.isArray(node)) {
      for (const child of node) {
        const found = find(child, id)
        if (found) return found
      }
      return undefined
    }
    if (node.props?.id === id) return node
    return find(node.props?.children, id)
  }
  return {
    controller,
    state: () => state,
    visible: () => controller().visibleProducts,
    change(id, value) {
      const input = find(ProductCatalog({ catalog: controller() }), id)
      assert.ok(input, id)
      assert.equal(input.props.disabled, undefined)
      assert.equal(input.props.readOnly, undefined)
      input.props.onChange({ currentTarget: { value } })
    },
    navigate(id) {
      const link = find(StoreHeader(controller()), id)
      assert.equal(link.props.to, '/shop')
      link.props.onClick()
    },
    render: () =>
      renderToStaticMarkup(
        createElement(ProductCatalog, { catalog: controller() }),
      ),
    header: () =>
      renderToStaticMarkup(createElement(StoreHeader, controller())),
  }
}

test('controlled search, category and sorting combine and render updated counts', () => {
  const original = JSON.stringify(products)
  const ui = controls()
  ui.change('category', 'Bags')
  ui.change('sort', 'high')
  assert.deepEqual(
    ui.visible().map((product) => product.price),
    [120, 89, 49, 39],
  )
  assert.match(ui.render(), /4 thoughtfully chosen products/)
  ui.change('product-search', '  BAG  ')
  assert.deepEqual(
    ui.visible().map((product) => product.price),
    [120, 89, 39],
  )
  assert.match(ui.render(), /value="  BAG  "/)
  assert.match(ui.render(), /3 thoughtfully chosen products/)
  ui.change('sort', 'low')
  assert.deepEqual(
    ui.visible().map((product) => product.price),
    [39, 89, 120],
  )
  ui.change('sort', 'featured')
  assert.deepEqual(
    ui.visible().map((product) => product.id),
    [1, 3, 10],
  )
  assert.equal(JSON.stringify(products), original)
})

test('navigation resets controls even on reselect, while ordinary changes retain affordable mode', () => {
  const ui = controls()
  ui.change('product-search', 'sneakers')
  ui.change('category', 'Shoes')
  ui.change('sort', 'high')
  ui.navigate('affordable-products')
  assert.equal(ui.state().query, '')
  assert.equal(ui.state().category, '')
  assert.equal(ui.state().sort, 'featured')
  assert.equal(ui.state().affordableOnly, true)
  assert.ok(ui.visible().every((product) => product.price < 50))
  assert.match(ui.render(), /Under \$50/)
  assert.match(
    ui.header(),
    /id="affordable-products"[^>]*class="active"[^>]*aria-current="true"/,
  )
  ui.change('category', 'Bags')
  ui.change('sort', 'high')
  assert.deepEqual(
    ui.visible().map((product) => product.price),
    [49, 39],
  )
  ui.navigate('affordable-products')
  assert.equal(ui.state().category, '')
  assert.equal(ui.state().sort, 'featured')
  ui.navigate('shop-all')
  assert.deepEqual(ui.state(), createProductCatalogState(products))
  assert.deepEqual(ui.visible(), products)
  assert.match(
    ui.header(),
    /id="shop-all"[^>]*class="active"[^>]*aria-current="true"/,
  )
  assert.doesNotMatch(ui.render(), /Under \$50/)
})

test('unmatched combined controls render the original empty state and recover on reset', () => {
  const ui = controls()
  ui.change('category', 'Bags')
  ui.change('product-search', 'sneakers')
  assert.equal(ui.visible().length, 0)
  assert.match(ui.render(), /0 thoughtfully chosen products/)
  assert.match(ui.render(), /class="empty">No matches just yet/)
  ui.navigate('shop-all')
  assert.equal(ui.visible().length, 12)
  ui.change('category', 'Bags')
  ui.navigate('shop-all')
  assert.equal(ui.state().category, '')
})

test('under-$50 controls exclude exactly $50 and $50.01 and include $49.99', () => {
  const prices = [49.99, 50, 50.01]
  const catalog = products
    .slice(0, 3)
    .map((product, index) => ({ ...product, price: prices[index] }))
  const ui = controls(catalog)
  ui.navigate('affordable-products')
  ui.change('category', 'Bags')
  ui.change('sort', 'high')
  assert.deepEqual(
    ui.visible().map((product) => product.price),
    [49.99],
  )
  ui.navigate('shop-all')
  assert.deepEqual(
    ui.visible().map((product) => product.price),
    prices,
  )
})

test('catalog renders translated loading/error/empty feedback and keeps retry connected', () => {
  const expected = {
    en: [
      'Refreshing the collection',
      'couldn’t refresh the collection',
      'There are no new pieces',
      'Try again',
      'There are no pieces to show right now.',
    ],
    ar: [
      'جارٍ تحديث التشكيلة',
      'تعذّر تحديث التشكيلة',
      'لا تتوفر قطع جديدة',
      'حاول مرة أخرى',
      'لا تتوفر قطع للعرض حاليًا.',
    ],
    tr: [
      'Koleksiyon yenileniyor',
      'Koleksiyon yenilenemedi',
      'Şu anda gösterilecek yeni ürün yok',
      'Tekrar dene',
      'Şu anda gösterilecek ürün yok.',
    ],
  }
  for (const language of ['en', 'ar', 'tr']) {
    const store = createLanguageStore({ getItem: () => language, setItem() {} })
    let retries = 0
    const base = {
      ...controls().controller(),
      language,
      retry: () => {
        retries++
      },
    }
    const render = (catalog) =>
      renderToStaticMarkup(
        createElement(
          LanguageProvider,
          { store },
          createElement(ProductCatalog, { catalog }),
        ),
      )
    assert.ok(
      render({ ...base, status: 'loading' }).includes(
        escapeText(expected[language][0]),
      ),
    )
    assert.ok(
      render({ ...base, status: 'error' }).includes(
        escapeText(expected[language][1]),
      ),
    )
    assert.ok(
      render({ ...base, status: 'empty' }).includes(
        escapeText(expected[language][2]),
      ),
    )
    const empty = render({
      ...base,
      status: 'ready',
      catalog: [],
      visibleProducts: [],
    })
    assert.ok(empty.includes(escapeText(expected[language][4])))
    const pendingEmpty = render({
      ...base,
      status: 'loading',
      catalog: [],
      visibleProducts: [],
    })
    assert.match(pendingEmpty, /aria-busy="true"/)
    assert.ok(pendingEmpty.includes(escapeText(expected[language][0])))
    assert.ok(!pendingEmpty.includes(escapeText(expected[language][4])))
    const noMatch = render({ ...base, status: 'ready', visibleProducts: [] })
    assert.ok(noMatch.includes(escapeText(messages[language].noResults)))
    assert.ok(!noMatch.includes(escapeText(expected[language][4])))
    const tree = ProductCatalog({ catalog: { ...base, status: 'error' } })
    function clickRetry(node) {
      if (!node || typeof node !== 'object') return
      if (Array.isArray(node)) {
        node.forEach(clickRetry)
        return
      }
      if (node.type === 'button' && node.props.onClick === base.retry)
        node.props.onClick()
      clickRetry(node.props?.children)
    }
    clickRetry(tree)
    assert.equal(retries, 1)
    assert.ok(
      render({ ...base, status: 'error' }).includes(
        escapeText(expected[language][3]),
      ),
    )
  }
})

function escapeText(value) {
  return renderToStaticMarkup(createElement('span', null, value)).replace(
    /^<span>|<\/span>$/g,
    '',
  )
}

test('every bound section and accessibility attribute renders in English, Arabic and Turkish', () => {
  for (const language of ['en', 'ar', 'tr']) {
    const store = createLanguageStore({ getItem: () => language, setItem() {} })
    const output = renderToStaticMarkup(
      createElement(
        LanguageProvider,
        { store },
        createElement(
          CartProvider,
          { notify() {} },
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
                index: true,
                element: createElement(StorefrontPage),
              }),
            ),
          ),
        ),
      ),
    )
    const bindings = [...output.matchAll(/data-i18n="([^"]+)"[^>]*>([^<]*)</g)]
    assert.ok(bindings.length > 30)
    for (const [, key, text] of bindings)
      assert.equal(text, escapeText(translate(language, key)), key)
    for (const product of products) {
      const copy = getProductText(product, language)
      assert.ok(output.includes(escapeText(copy.name)))
      assert.ok(output.includes(escapeText(copy.description)))
      assert.ok(output.includes(`alt="${escapeText(copy.alt)}"`))
      assert.ok(
        output.includes(
          `aria-label="${escapeText(translate(language, 'add', { name: copy.name }))}"`,
        ),
      )
    }
    assert.ok(
      output.includes(
        `placeholder="${escapeText(messages[language].searchPlaceholder)}"`,
      ),
    )
    assert.ok(
      output.includes(
        `aria-label="${escapeText(messages[language].navigation)}"`,
      ),
    )
    assert.ok(
      output.includes(`aria-label="${escapeText(messages[language].sort)}"`),
    )
    const sortLabel = output.match(
      /<label\b[^>]*\bfor="sort"[^>]*>([\s\S]*?)<\/label>/,
    )?.[1]
    assert.equal(
      sortLabel?.trim(),
      escapeText(messages[language].sort),
      `Visible sort label in ${language}`,
    )
    assert.match(output, /class="header-actions" dir="ltr"/)
    assert.match(output, /class="brand-name" lang="en" dir="ltr">YANINDA/)
    assert.match(output, new RegExp(`value="${language}"[^>]*selected=""`))
    const submitButton = output.match(/<button\b[^>]*type="submit"[^>]*>/)?.[0]
    assert.ok(submitButton)
    assert.doesNotMatch(submitButton, /\bdisabled\b/)
  }
})

test('language control uses existing validation and persistence without resetting catalog controls', () => {
  const saved = new Map([['shopboard-catalog-cart-v2', '{"1":2}']])
  const storage = {
    getItem: (key) => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value),
  }
  const store = createLanguageStore(storage)
  const state = {
    ...createProductCatalogState(products),
    query: 'bag',
    category: 'Bags',
    sort: 'high',
    affordableOnly: true,
  }
  const before = JSON.stringify(state)
  for (const language of ['ar', 'tr', 'en', 'invalid']) {
    const tree = StoreHeader({
      ...state,
      language: store.getLanguage(),
      selectMode() {},
      setLanguage: (value) => store.setLanguage(value),
    })
    function find(node) {
      if (!node || typeof node !== 'object') return undefined
      if (Array.isArray(node)) return node.map(find).find(Boolean)
      if (node.props?.id === 'language') return node
      return find(node.props?.children)
    }
    const picker = find(tree)
    assert.equal(picker.props.disabled, undefined)
    picker.props.onChange({ currentTarget: { value: language } })
    const expected = language === 'invalid' ? 'en' : language
    assert.equal(store.getLanguage(), expected)
    assert.equal(createLanguageStore(storage).getLanguage(), expected)
    assert.equal(saved.get('shopboard-language'), expected)
    assert.equal(saved.get('shopboard-catalog-cart-v2'), '{"1":2}')
    assert.equal(JSON.stringify(state), before)
    const shown = selectProducts(state.catalog, {
      ...state,
      language: expected,
    })
    if (expected !== 'en')
      assert.equal(
        shown.length,
        0,
        'search text is preserved rather than translated/reset',
      )
  }
})

test('document updates select correct RTL/LTR and localized title/description', () => {
  let description
  const target = {
    documentElement: {},
    title: '',
    querySelector: (selector) => {
      assert.equal(selector, 'meta[name="description"]')
      return {
        setAttribute: (name, value) => {
          assert.equal(name, 'content')
          description = value
        },
      }
    },
  }
  for (const language of ['ar', 'tr', 'en']) {
    applyDocumentLanguage(target, language)
    assert.equal(target.documentElement.lang, language)
    assert.equal(target.documentElement.dir, languages[language].dir)
    assert.equal(target.title, messages[language].title)
    assert.equal(description, messages[language].meta)
  }
})

test('cart dialog renders original item, confirmation, empty, shipping and checkout markup in every language', () => {
  for (const language of ['en', 'ar', 'tr']) {
    const store = createLanguageStore({ getItem: () => language, setItem() {} })
    function render(cart) {
      return renderToStaticMarkup(
        createElement(
          LanguageProvider,
          { store },
          createElement(CartDialog, { cart }),
        ),
      )
    }
    const base = {
      isOpen: false,
      items: [products[1]],
      quantities: { 2: 1 },
      total: 49,
      count: 1,
      confirmClear: false,
      close() {},
      changeQuantity() {},
      removeItem() {},
      checkout() {},
      requestClear() {},
      cancelClear() {},
      confirmClearCart() {},
    }
    const filled = render(base)
    assert.match(filled, /<dialog id="cart" aria-labelledby="cart-title"/)
    assert.match(filled, /class="cart-visual product-photo"/)
    assert.ok(
      filled.includes(escapeText(getProductText(products[1], language).name)),
    )
    assert.ok(filled.includes(escapeText(messages[language].checkout)))
    assert.ok(filled.includes(escapeText(messages[language].demoNote)))
    assert.doesNotMatch(filled, /id="confirm-clear"/)
    const confirmed = render({ ...base, confirmClear: true })
    assert.match(confirmed, /role="group" aria-labelledby="clear-question"/)
    assert.ok(confirmed.includes(escapeText(messages[language].clearQuestion)))
    assert.match(confirmed, /id="confirm-clear"/)
    assert.match(confirmed, /id="cancel-clear"/)
    const free = render({ ...base, total: 100 })
    assert.ok(free.includes(escapeText(messages[language].freeShipping)))
    const notFree = render({ ...base, total: 99.99 })
    assert.ok(
      notFree.includes(
        escapeText(
          translate(language, 'awayShipping', {
            price: formatPrice(100 - 99.99, language),
          }),
        ),
      ),
    )
    assert.ok(
      filled.includes(
        escapeText(
          translate(language, 'awayShipping', {
            price: formatPrice(51, language),
          }),
        ),
      ),
    )
    const empty = render({
      ...base,
      items: [],
      quantities: {},
      total: 0,
      count: 0,
      confirmClear: false,
    })
    assert.ok(empty.includes(escapeText(messages[language].emptyCart)))
    assert.match(empty, /id="keep-shopping"/)
    assert.doesNotMatch(empty, /id="checkout"|id="clear-cart"/)
  }
})

test('visible notification translates on language changes while retaining its message key', () => {
  for (const language of ['en', 'ar', 'tr']) {
    const store = createLanguageStore({ getItem: () => language, setItem() {} })
    for (const notice of [
      'added',
      'removed',
      'cleared',
      'checkoutMessage',
      'signupSuccess',
    ]) {
      const output = renderToStaticMarkup(
        createElement(
          LanguageProvider,
          { store },
          createElement(Toast, { notice }),
        ),
      )
      assert.match(
        output,
        /class="toast visible" role="status" aria-live="polite"/,
      )
      assert.ok(output.includes(escapeText(messages[language][notice])))
    }
  }
  assert.doesNotMatch(
    renderToStaticMarkup(createElement(Toast, { notice: null })),
    /toast visible/,
  )
})
