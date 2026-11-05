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
- Valid demo sign-up uses native constraints, resets the form, and shows a translated success toast. The handler does not read, transmit, persist, or log credentials. Checkout only shows its demo message. One toast controller replaces/dismisses notices after 2600ms.

The refresh wrapper observes an empty response using a cloned response body. It does not duplicate product validation or make a second network request. New assignment-specific status translations live separately from the preserved original dictionaries.

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
  pages/storefront/               Page and section components
  shared/api/                     Central fetch configuration/client
  shared/ui/                      SVG components and notification controller
  styles/storefront.css           Original responsive visual system
public/                           Campaign, products, fallback SVG, favicon
tests/                            Node regressions and server-rendered React checks
.agents/skills/                   Official Vercel skills for Codex, pinned and verified
.husky/pre-commit                 Staged checks only
docs/                             Preservation manifest and archived original references
```

## Complete component tree and props

`?` marks an optional prop. Repeated SVG/image nodes are shown under their actual owners. Native elements and the built-in React context provider are not separate application components. `main.tsx` wraps App in React StrictMode.

```text
App()
└── LanguageProvider(children, store?)
    └── StorefrontPage()
        ├── AnnouncementBar()
        ├── StoreHeader(affordableOnly, selectMode, language?, setLanguage?, count?, onOpenCart?)
        │   ├── BrandMark()
        │   └── Icon(name, size?)
        ├── Hero()
        │   ├── BrandMark()
        │   └── CampaignImage()
        ├── Benefits()
        │   └── Icon(name, size?) × 4
        ├── ProductCatalog(catalog, onAdd?)
        │   ├── Icon(name, size?)
        │   └── ProductCard(product, onAdd?) × visible products
        │       └── ProductImage(product, children?, className?)
        │           └── Icon(name, size?) inside the add-button children
        ├── SignupForm(onSuccess)
        ├── Philosophy()
        │   └── BrandMark()
        ├── StoreFooter()
        │   └── BrandMark()
        ├── CartDialog(cart)
        │   ├── Icon(name, size?)
        │   ├── CartItem(product, quantity, changeQuantity, removeItem) × cart items
        │   │   ├── ProductImage(product, children?, className?)
        │   │   └── Icon(name, size?) × 2
        │   └── CartSummary(cart)
        └── Toast(notice)
```

| Component        | Source file                                           |
| ---------------- | ----------------------------------------------------- |
| App              | `src/App.tsx`                                         |
| LanguageProvider | `src/features/i18n/LanguageProvider.tsx`              |
| StorefrontPage   | `src/pages/storefront/StorefrontPage.tsx`             |
| AnnouncementBar  | `src/pages/storefront/components/AnnouncementBar.tsx` |
| StoreHeader      | `src/pages/storefront/components/StoreHeader.tsx`     |
| Hero             | `src/pages/storefront/components/Hero.tsx`            |
| CampaignImage    | `src/pages/storefront/components/CampaignImage.tsx`   |
| Benefits         | `src/pages/storefront/components/Benefits.tsx`        |
| ProductCatalog   | `src/features/products/components/ProductCatalog.tsx` |
| ProductCard      | `src/features/products/components/ProductCard.tsx`    |
| ProductImage     | `src/features/products/components/ProductImage.tsx`   |
| SignupForm       | `src/pages/storefront/components/SignupForm.tsx`      |
| Philosophy       | `src/pages/storefront/components/Philosophy.tsx`      |
| StoreFooter      | `src/pages/storefront/components/StoreFooter.tsx`     |
| CartDialog       | `src/features/cart/components/CartDialog.tsx`         |
| CartItem         | `src/features/cart/components/CartItem.tsx`           |
| CartSummary      | `src/features/cart/components/CartSummary.tsx`        |
| Toast            | `src/shared/ui/Toast.tsx`                             |
| Icon             | `src/shared/ui/Icon.tsx`                              |
| BrandMark        | `src/shared/ui/BrandMark.tsx`                         |

The catalog prop is `ProductCatalogController`: catalog/control state, request status, language, derived categories/results, setters, mode action, and retry. The cart prop is `CartController`: quantities, derived items/count/total, dialog/confirmation state, and cart/dialog actions. Other prop types are declared in the named component Props interfaces. Components without props need no empty interface.

## State ownership

| State                                                           | Single owner                                      | Derived or side-effect behavior                                                           |
| --------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Catalog, query, category, sort, affordable mode, request status | `useProductCatalog` once in StorefrontPage        | Existing `selectProducts` and `getCategories`; retry revision triggers the refresh effect |
| In-flight request                                               | `createCatalogRefresh` subscription controller    | Shares only a pending promise; does not own another displayed catalog                     |
| Cart quantities                                                 | Existing store created once in `useCart`          | React revision reads a fresh snapshot; existing functions calculate count/total           |
| Dialog open/clear confirmation                                  | `useCart` with `cartDialogReducer`                | Native dialog synchronization and focus refs live in CartDialog                           |
| Language                                                        | LanguageProvider adapting existing language store | One preference/action; effect updates document lang/dir/title/description                 |
| Toast key/timer                                                 | `useToast` once in StorefrontPage                 | Controller owns one timer; Toast translates the key on render                             |
| Image error stage                                               | ProductImage and CampaignImage individually       | Shared product fallback also serves cart thumbnails                                       |
| Sign-up field values                                            | Native uncontrolled form                          | Validation/reset only; credentials never enter application state                          |

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

See [DESIGN.md](DESIGN.md) for the real local design provenance and [debug-lab-log.md](debug-lab-log.md) for source-supported Debug Lab findings and the unperformed manual steps. The preserved references in `docs/original/` document the earlier Vanilla application; this README describes the current React application.

## Pending manual review

The project has no imported Vite logo, counter, or starter stylesheet. `docs/original/` and `docs/foundations-manifest.json` remain for local preservation checks. The image-folder README files document current provenance and replacement guidance. `yaninda-selected-original.png` is retained source artwork; the runtime uses `yaninda-campaign.jpg`.

- Compare this tree with React DevTools and check the browser Console for warnings.
- Exercise API loading/failure/retry/empty responses in the browser; confirm requests originate from the exact React URL.
- Verify cart reload persistence, modal tab/focus recovery, Escape/backdrop closure, notifications, native form validation, and language changes during use.
- Reproduce the Arabic mobile sort truncation on the affected browser/width. No CSS fix is claimed without reproduction; test 320/375/390px plus 701px desktop transition, both Arabic price orders, and native option menus.
- Confirm the five Debug Lab behaviors in the real app. Source inspection is recorded separately from browser observation.
