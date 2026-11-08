# YANINDA — ShopBoard React

A multilingual fashion storefront built with React, strict TypeScript, and Vite. Browse the collection, combine search/category/price controls, switch English/Arabic/Turkish, and keep a shopping bag across refreshes. Sign-up and checkout are demonstrations: no accounts, payments, or orders are created.

## Run locally

Use Node.js **24 or newer** (verified here with Node 26) and npm. From this project:

```sh
npm ci
npm run dev -- --port 5175 --strictPort
```

Open the exact Local URL printed by Vite, normally `http://localhost:5175`. Another port can be serving a different project. On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm`.

`npm ci` installs the locked dependencies and the `prepare` script configures Husky when a Git checkout is available. The pre-commit hook runs `npm run lint:staged`; it checks staged code with Oxlint (zero warnings) and Prettier, without automatically formatting it. No test commit is needed to use the normal check commands.

## Behavior and API states

- The 12 local products render immediately. A mount effect requests the existing `/api/products` endpoint; its base URL and five-second timeout are centralized in `src/shared/api/client.ts`.
- Only complete, validated responses with the original stable IDs replace the catalog. The existing API adapter remains unchanged.
- Loading is announced while the current collection stays usable. HTTP, offline, timeout, malformed, duplicate-ID, and incomplete responses show a translated failure message with **Try again**.
- A successful HTTP response containing an empty JSON array shows a distinct empty-API message and retry action. It retains the current catalog, matching the stable-ID/fallback contract; it does not erase saved cart details. A genuinely empty catalog has its own empty-collection message. A filter with no matching products uses the original no-match message.
- Failed refreshes retain the local or last valid collection. Retry preserves query, category, sorting, affordable mode, cart quantities, and language. StrictMode effect replay shares the in-flight request; cleaned-up subscribers ignore late results.
- Search matches active-language product names. Turkish case folding and Arabic diacritic/tatweel normalization use existing pure logic. Category and price sorting combine; navigation to Shop all or Under $50 resets query/category/sort. The affordable boundary is strictly `< 50`.
- The cart supports add, increment, decrement-to-removal, remove, clear confirmation/cancel, empty state, count/subtotal, and shipping messages at the original $100 threshold. Quantities cap at 99. New API prices/details update cart rendering without resetting quantities.
- Cart key: `shopboard-catalog-cart-v2` (product-ID strings to quantities). Language key: `shopboard-language`. Invalid or blocked storage is tolerated. Storage is origin-specific: changing a development port does not transfer saved values.
- Arabic uses RTL; English and Turkish use LTR. Prices stay USD; language changes formatting rather than numeric prices. Switching language retains filters, form nodes, and cart state; old-language search text can legitimately produce no results.
- Valid demo sign-up uses native constraints, resets the form, and shows a translated success toast. The handler does not read, transmit, persist, or log credentials. Checkout opens a separate validated demo flow; no order, payment, or delivery is created. One toast controller replaces/dismisses notices after 2600ms.

The refresh wrapper observes an empty response using a cloned response body. It does not duplicate product validation or make a second network request. New assignment-specific status translations live separately from the preserved original dictionaries.

## Routes and deployment

React Router 8 provides browser-history navigation. The persistent layout includes the original announcement, header, cart dialog, footer, and toast; Home keeps the original section order. Navigation, headings, feedback, and page copy support English, Arabic, and Turkish. Product names link to details. Every route page is dynamically imported and Suspense shows translated loading feedback inside the shared main region.

| URL             | Purpose                                                          |
| --------------- | ---------------------------------------------------------------- |
| `/`             | Original storefront and collection                               |
| `/shop`         | Searchable/filterable catalog                                    |
| `/about`        | Existing YANINDA philosophy                                      |
| `/shipping`     | Original free-shipping threshold and demo checkout limitations   |
| `/signup`       | Native validated demo sign-up                                    |
| `/products/:id` | API-backed product details, loading, missing, error and retry    |
| `/checkout`     | Validated demo form, editable shared bag, and local confirmation |
| Unmatched URL   | Accessible 404 page with a shop link                             |

**API compatibility:** on 2026-11-08 the configured backend served `/api/products`, but `/api/products/1` returned Vercel route-not-found. With user approval, `product-details.api.ts` fetches the existing API catalog through the original validator and resolves the requested ID. It does not substitute local data on details failure and is not a claim that a single-resource endpoint exists. Details requests use the existing timeout, abort on route cleanup, ignore stale responses, and merge accepted details into the layout catalog without resetting controls or cart quantities.

The shared layout retains catalog controls across page navigation, while CartProvider stays above all routes. Refresh restores saved cart quantities and language; catalog filters remain session state. Production hosting must serve `index.html` for application paths such as `/shop` and `/products/1` (SPA fallback). Vite dev/preview supplies this locally; no production deployment or host rewrite configuration is claimed. GitHub repository publication alone does not configure browser-history hosting.

## Loading, failures, and recovery

Every lazy route is wrapped by RoutePage inside the persistent layout's main region: ErrorBoundary surrounds a page-level Suspense boundary. Slow module imports show a translated status while the header, navigation, footer, and cart remain outside it. Suspense handles module loading only; API requests retain their existing explicit status owners and do not suspend unrelated pages or checkout. There is no app-wide loading gate or automatic retry loop.

Page render/import failures show translated recovery controls. Try again replaces the React.lazy identity and remounts only the failed route boundary; simply clearing the boundary would reuse React's cached rejection. Changing path also resets the boundary without an effect. Browser/module-cache failures or stale deployed chunks can still require the explicit Reload page action. Reload retains the normally persisted bag but loses transient filters/form values; it is not an in-place recovery promise. A deterministic code bug can fail again and needs a code fix.

The cart dialog has a separate ErrorBoundary and retry counter. A dialog render failure does not remove the current page or provider; its fallback links directly to checkout. No boundary retry recreates CartProvider or duplicates quantities. Failures inside the shared layout/providers themselves are outside these local boundaries. Error Boundaries handle rendering/lifecycle failures, not arbitrary event-handler or async exceptions; API rejections remain handled by the request modules.

| Condition                       | UI and recovery                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Page chunk pending              | Route-local translated status; shared shell remains present                                            |
| Page render/chunk failure       | Page fallback, explicit retry, alternate navigation, optional reload                                   |
| Catalog refreshing              | Current local/last-valid products remain usable; grid is marked busy; status stays outside that region |
| Catalog API failure             | Existing translated alert and retry; current catalog and controls retained                             |
| Empty catalog API response      | Distinct empty-response feedback and retry, with local fallback retained                               |
| Genuinely empty settled catalog | Empty-collection message; not shown prematurely while loading                                          |
| No filter matches               | Existing no-match message; editing/resetting controls restores results                                 |
| Product details pending/failure | Local status or error/retry; stale requests are aborted/ignored                                        |
| Missing product or invalid ID   | Missing-product message with a shop link, distinct from API failure                                    |
| Empty cart / checkout           | Existing empty-bag and checkout guards, without a registration/payment form                            |

Tests cover delayed streaming of the actual shared shell, rejected-lazy-loader recovery, translated fallback rendering, and delayed/empty/failed API outcomes while cart/checkout summaries remain usable. Server rendering does not exercise client Error Boundary catches: these tests are not claimed as mounted-browser recovery tests.

## Checkout architecture

The bag's checkout button closes the dialog and navigates to the lazy-loaded `/checkout` route. Empty bags show a shop link instead of a form. CheckoutSummary reuses CartItem and shared cart actions; quantities and prices remain derived from the current catalog, with the original free-shipping threshold and subtotal behavior. No shipping fee or real final payment total is invented.

React Hook Form owns field values, errors, and submission state. `features/checkout/checkout.schema.ts` defines one Zod schema and inferred types; `zodResolver` applies it. The form uses `noValidate` so browser constraints do not become a second validation system. Stable error codes translate at render time in English, Arabic, and Turkish, without resetting entered values when language changes. Errors use labeled fields, `aria-invalid`, `aria-describedby`, and alerts; RHF focuses the first invalid field. Native demo sign-up validation is unchanged.

Successful validation rechecks current cart quantities, resets form details, and shows a local demo confirmation. Only a historical count/subtotal snapshot remains for that confirmation. There is no checkout API request, order ID, payment collection, simulated payment delay, cart clearing, or app persistence of personal details. Use fictional data; browser autofill is controlled by the browser. Confirmation is not persisted across refreshes; existing cart and language persistence remain intact. Real orders, address verification, shipping charges, and payments require a backend and are outside this demo.

Owned Input and Button components in `src/shared/ui/shadcn/` are adapted from the official shadcn/ui new-york-v4 [Input](https://ui.shadcn.com/r/styles/new-york-v4/input.json) and [Button](https://ui.shadcn.com/r/styles/new-york-v4/button.json) registry sources. Named Props interfaces and React 19 native refs support RHF registration. Unused Slot, dark-mode, file-input, and button variants were omitted; the MIT notice is retained locally. Tailwind theme/utilities compile through the Vite plugin with **no Preflight**, and scanning is explicitly limited to the shadcn directory. Colors map to existing YANINDA variables; scoped checkout layout rules live in the override stylesheet. No shadcn CLI or global CSS reset was installed.

## Project structure

```text
src/
  App.tsx                         Application composition
  main.tsx                        Root and original stylesheet import
  features/
    products/                     Catalog types/data/logic/API/state/hook/components
    cart/                         Existing store/calculations and React dialog/actions
    i18n/                         Original messages/store, language provider/adapters
    signup/                       Demo submission handler
  pages/                          Lazy pages, shared layout and route configuration
  pages/storefront/               Original home sections
  shared/api/                     Central fetch configuration/client
  shared/ui/                      SVG components and notification controller
  styles/storefront.css           Original responsive visual system
  styles/storefront-overrides.css React fixes layered after the original CSS
  styles/components.css          shadcn utility/theme layer without Preflight
public/                           Campaign, products, fallback SVG, favicon
tests/                            Node regressions and server-rendered React checks
.agents/skills/                   Official Vercel skills for Codex, pinned and verified
.husky/pre-commit                 Staged checks only
docs/                             Preservation manifest and archived original references
```

## Complete component tree and props

`?` marks an optional prop. Repeated SVG/image nodes are shown under their actual owners. Native elements and the built-in React context provider are not separate application components. `main.tsx` wraps App in React StrictMode and BrowserRouter. Router Link/NavLink components are summarized as navigation, not repeated in the application-component tree.

```text
App()
+-- LanguageProvider(children, store?)
    +-- CartProvider(children, notify, storage?)
        +-- AppRoutes(notice, onSignupSuccess)
            +-- StoreLayout(notice, onSignupSuccess)
                +-- AnnouncementBar()
                +-- StoreHeader(affordableOnly, selectMode, language?, setLanguage?, count?, onOpenCart?, catalogActive?)
                |   +-- BrandMark()
                |   +-- Icon(name, size?)
                +-- Outlet -> RoutePage(page) [one lazy page at a time]
                |   +-- ErrorBoundary(children, fallback)
                |       +-- BoundaryFallback(scope, onRetry) [on page failure]
                |       +-- Suspense -> matched page [normally]
                |   +-- StorefrontPage() [/]
                |   |   +-- Hero() -> BrandMark(), CampaignImage()
                |   |   +-- Benefits() -> Icon(name, size?) x 4
                |   |   +-- ProductCatalog(catalog, onAdd?)
                |   |   |   +-- Icon(name, size?)
                |   |   |   +-- ProductCard(product, onAdd?) x visible products
                |   |   |       +-- ProductImage(product, children?, className?)
                |   |   |           +-- ProductPhoto(product)
                |   |   |           +-- Icon(name, size?) in add-button children
                |   |   +-- SignupForm(onSuccess)
                |   |   +-- Philosophy() -> BrandMark()
                |   +-- ShopPage() [/shop] -> ProductCatalog(catalog, onAdd?)
                |   +-- AboutPage() [/about] -> Philosophy()
                |   +-- ShippingPage() [/shipping]
                |   +-- SignupPage() [/signup] -> SignupForm(onSuccess)
                |   +-- ProductDetailsPage() [/products/:id]
                |   |   +-- ProductDetails(state, onRetry, onAdd)
                |   |       +-- ProductImage(product, children?, className?) -> ProductPhoto(product)
                |   +-- CheckoutPage() [/checkout]
                |   |   +-- CheckoutForm(cart, catalog, onComplete)
                |   |   |   +-- Input(type?, className?, ...nativeInputProps) x 7
                |   |   |   +-- Button(variant?, className?, ...nativeButtonProps)
                |   |   +-- CheckoutSummary(cart) -> CartItem(product, quantity, changeQuantity, removeItem)
                |   |   +-- CheckoutSuccess(receipt, onRestart) [success replaces the form/summary]
                |   |       +-- Button(variant?, className?, ...nativeButtonProps)
                |   +-- NotFoundPage() [unmatched paths]
                +-- StoreFooter() -> BrandMark()
                +-- ErrorBoundary(children, fallback) [separate cart recovery]
                |   +-- BoundaryFallback(scope, onRetry) [on dialog failure]
                |   +-- CartDialog(cart)
                |   +-- Icon(name, size?)
                |   +-- CartItem(product, quantity, changeQuantity, removeItem) x cart items
                |   |   +-- ProductImage(product, children?, className?) -> ProductPhoto(product)
                |   |   +-- Icon(name, size?) x 2
                |   +-- CartSummary(cart)
                +-- Toast(notice)
```

| Component          | Source file                                            |
| ------------------ | ------------------------------------------------------ |
| RoutePage          | `src/pages/layout/RoutePage.tsx`                       |
| ErrorBoundary      | `src/shared/ui/ErrorBoundary.tsx`                      |
| BoundaryFallback   | `src/shared/ui/BoundaryFallback.tsx`                   |
| CheckoutPage       | `src/pages/checkout/CheckoutPage.tsx`                  |
| CheckoutForm       | `src/features/checkout/components/CheckoutForm.tsx`    |
| CheckoutSummary    | `src/features/checkout/components/CheckoutSummary.tsx` |
| CheckoutSuccess    | `src/features/checkout/components/CheckoutSuccess.tsx` |
| Input              | `src/shared/ui/shadcn/Input.tsx`                       |
| Button             | `src/shared/ui/shadcn/Button.tsx`                      |
| AppRoutes          | `src/pages/AppRoutes.tsx`                              |
| StoreLayout        | `src/pages/layout/StoreLayout.tsx`                     |
| ShopPage           | `src/pages/shop/ShopPage.tsx`                          |
| AboutPage          | `src/pages/about/AboutPage.tsx`                        |
| ShippingPage       | `src/pages/shipping/ShippingPage.tsx`                  |
| SignupPage         | `src/pages/signup/SignupPage.tsx`                      |
| ProductDetailsPage | `src/pages/products/ProductDetailsPage.tsx`            |
| ProductDetails     | `src/features/products/components/ProductDetails.tsx`  |
| NotFoundPage       | `src/pages/not-found/NotFoundPage.tsx`                 |
| CartProvider       | `src/features/cart/CartProvider.tsx`                   |
| ProductPhoto       | `src/features/products/components/ProductPhoto.tsx`    |
| App                | `src/App.tsx`                                          |
| LanguageProvider   | `src/features/i18n/LanguageProvider.tsx`               |
| StorefrontPage     | `src/pages/storefront/StorefrontPage.tsx`              |
| AnnouncementBar    | `src/pages/storefront/components/AnnouncementBar.tsx`  |
| StoreHeader        | `src/pages/storefront/components/StoreHeader.tsx`      |
| Hero               | `src/pages/storefront/components/Hero.tsx`             |
| CampaignImage      | `src/pages/storefront/components/CampaignImage.tsx`    |
| Benefits           | `src/pages/storefront/components/Benefits.tsx`         |
| ProductCatalog     | `src/features/products/components/ProductCatalog.tsx`  |
| ProductCard        | `src/features/products/components/ProductCard.tsx`     |
| ProductImage       | `src/features/products/components/ProductImage.tsx`    |
| SignupForm         | `src/pages/storefront/components/SignupForm.tsx`       |
| Philosophy         | `src/pages/storefront/components/Philosophy.tsx`       |
| StoreFooter        | `src/pages/storefront/components/StoreFooter.tsx`      |
| CartDialog         | `src/features/cart/components/CartDialog.tsx`          |
| CartItem           | `src/features/cart/components/CartItem.tsx`            |
| CartSummary        | `src/features/cart/components/CartSummary.tsx`         |
| Toast              | `src/shared/ui/Toast.tsx`                              |
| Icon               | `src/shared/ui/Icon.tsx`                               |
| BrandMark          | `src/shared/ui/BrandMark.tsx`                          |

The catalog prop is `ProductCatalogController`: catalog/control state, request status, language, derived categories/results, setters, mode action, and retry. CartProvider accepts children, a stable notification callback, and optional injected storage. It stays mounted above route content and owns the existing cart store and dialog state; route consumers call `useCart(catalog)` without creating another store. StoreLayout owns one catalog/control reducer locally and exposes it through typed Outlet context. It supplies that same current catalog to the global cart dialog and route pages. StoreLayout receives the current toast notice and sign-up success callback from App; pages obtain the callback from Outlet context. The cart prop is `CartController`: quantities, derived items/count/total, dialog/confirmation state, and cart/dialog actions. Other prop types are declared in the named component Props interfaces. Components without props need no empty interface.

## State ownership

| State                                                           | Single owner                                           | Derived or side-effect behavior                                                                        |
| --------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Catalog, query, category, sort, affordable mode, request status | `useProductCatalog` once in StoreLayout                | Existing `selectProducts` and `getCategories`; retry revision triggers the refresh effect              |
| In-flight request                                               | `createCatalogRefresh` subscription controller         | Shares only a pending promise; does not own another displayed catalog                                  |
| Cart quantities                                                 | Existing store/controller created once in CartProvider | `useSyncExternalStore` reads cached immutable snapshots; `useCart(catalog)` derives items/count/total  |
| Dialog open/clear confirmation                                  | CartProvider controller with `cartDialogReducer`       | Native dialog synchronization and focus refs live in CartDialog                                        |
| Language                                                        | LanguageProvider adapting existing language store      | One preference/action; effect updates document lang/dir/title/description                              |
| Toast key/timer                                                 | `useToast` once in App                                 | Controller owns one timer; Toast translates the key on render                                          |
| Image error stage                                               | ProductPhoto and CampaignImage individually            | Source-keyed ProductPhoto resets only image failure state; shared fallback also serves cart thumbnails |
| Page/cart recovery attempts                                     | RoutePage and StoreLayout respectively                 | Explicit retry remounts only the failed region; no additional request state                            |
| Checkout fields and errors                                      | React Hook Form inside CheckoutForm                    | One Zod resolver; no app storage or API submission                                                     |
| Demo confirmation summary                                       | CheckoutPage                                           | Historical count/subtotal only; cart remains unchanged                                                 |
| Sign-up field values                                            | Native uncontrolled form                               | Validation/reset only; credentials never enter application state                                       |

Product/cart lists use product IDs, category options use stable category values, and SVG paths use their path data as keys. No array-index keys are used.

## Checks

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run format` writes formatting and should be used only with an approved scope. Original assets/archive documentation and official skill copies are excluded by `.prettierignore`. `docs/foundations-manifest.json` and its tests verify local copies against recorded hashes; they never read the protected directory.

Tests cover pure logic, persistence, request lifecycle/status/retry, translated rendered output, component callbacks, native sign-up constraints, and toast timers. They do **not** replace a mounted browser, React DevTools, a real browser Console, or real-device checks. The component tree is source-checked; a Components-tab comparison remains pending.

## Codex skills and design

The official `vercel-react-best-practices` and `vercel-composition-patterns` skills are installed once under `.agents/skills/`, the Codex project-local location. There are no `.claude/skills` duplicates. Their full inventory and commit are in `.agents/skills/UPSTREAM.json`; preserve upstream bytes and license metadata.

See [DESIGN.md](DESIGN.md) for the real local design provenance and [debug-lab-log.md](debug-lab-log.md) for Debug Lab source findings, user-reported Chrome observations, and remaining verification. No Debug Lab repairs have been applied or retested. The preserved references in `docs/original/` document the earlier Vanilla application; this README describes the current React application.

## Pending manual review

The project has no imported Vite logo, counter, or starter stylesheet. `docs/original/` and `docs/foundations-manifest.json` remain for local preservation checks. The image-folder README files document current provenance and replacement guidance. `yaninda-selected-original.png` is retained source artwork; the runtime uses `yaninda-campaign.jpg`.

- Verify checkout field-error announcements and focus, duplicate-submit prevention, language changes with entered values, browser autofill, mobile RTL layout, and cart persistence after demo success.
- Block a page chunk, restore connectivity, and retry; test a transient render failure, navigation away from failure, and cart-dialog recovery. Confirm cart/checkout remain usable while API and chunks are delayed. Test stale-deployment reload separately and expect transient form state to reset.
- Compare this tree with React DevTools and check the browser Console for warnings.
- Exercise API loading/failure/retry/empty responses in the browser; confirm requests originate from the exact React URL.
- Verify cart reload persistence, modal tab/focus recovery, Escape/backdrop closure, notifications, native form validation, and language changes during use.
- Verify the RTL mobile control fix for the user-confirmed Arabic sort truncation: category and sort use full-width rows below 701px. Test 320/375/390px plus the 701px desktop transition, all sort options, and native option menus. LTR layout retains the existing columns.
- Complete the Debug Lab evidence: record the exact cart failure and investigate the saved-heart issue that was not reproduced. Keep proposed fixes separate from applied repairs and before/after retests; none have been performed.
