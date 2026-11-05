# YANINDA React foundations

The reusable foundations and visual-shell phases are implemented. The original stylesheet now styles semantic React storefront components and all 12 local product cards. Catalog controls are connected through one React product-state hook. API refresh is now connected after mount; multilingual support, cart operations, and notifications are connected; sign-up submission remains deferred.

## Structure

- src/features/products/: original types, 12-product catalog, pure selection logic, and validated API adapter.
- src/features/cart/: original types, calculations, and persistence.
- src/features/i18n/: original dictionaries, formatters, locale settings, and language persistence.
- src/shared/api/client.ts: existing fetch client and timeout/error handling.
- src/shared/storage.types.ts: existing storage contract and compatible import paths.
- src/styles/storefront.css: original stylesheet, unchanged and imported by main.tsx.
- public/images/ and public/yaninda.svg: original assets and provenance. The YANINDA favicon is active.
- docs/original/: verbatim AGENTS.md, DESIGN.md, README.md, and LOCALIZATION.md. Paths describe the original project; its local-only documentation predates API integration.
- docs/foundations-manifest.json: source/destination paths and SHA-256 hashes for all 34 unchanged copied files.
- tests/: adapted foundation regressions and preservation/boundary checks.

## Preserved contracts

The client uses https://shopboard-api-nu.vercel.app/api/products with a five-second timeout, runtime validation, unique IDs, and a complete stable-ID match against the local catalog. The UI renders local data immediately and accepts only a complete valid refresh after mount. Automated tests inject responses; a separate live HTTP check returned 12 products with an allow-origin wildcard for the React origin.

Keep cart key shopboard-catalog-cart-v2 and language key shopboard-language. Storage is origin-specific; different development ports do not automatically share it. Keep USD values/formatting and demo-only sign-up and checkout.

## Checks

Use existing dependencies; no packages were installed. Node 24+ supports the TypeScript imports used by the Node test runner; this phase was executed with Node 26.

- npm run typecheck: checks application and Vite configuration without emitting JavaScript.
- npm test: Node foundation regression tests.
- npm run lint: existing Oxlint configuration.
- npm run build: existing TypeScript/Vite React production build.

Use npm.cmd on PowerShell if script policy blocks npm. No formatter is configured in this target, so no format-check command is claimed.

Cart, localization, and API tests preserve the original assertions with feature import paths. Approved dictionary-copy assertions are retained. Rendered React tests now verify semantic landmarks, section order, labels, unique IDs, form constraints, all product cards, and original brand SVG geometry. Foundation boundary tests continue to cover every preserved reusable module.

Strict TypeScript is enabled in both configurations. The starter's unused imports and unsafe root assertion were cleaned up for checks without changing visible content or styling. The original CSS cascade and all copied foundation source files remain byte-identical. Unused Vite starter styles and assets have been removed; the application imports src/styles/storefront.css.

The UI supports English, Arabic, and Turkish. Search, category, price sorting, under-$50 navigation, and language selection are enabled. Add/bag controls open and update the persisted cart; sign-up submission remains inactive. Existing section anchors work. Image fallback rendering uses React state; cart quantities are restored by the existing cart store. API refresh is connected after mount. The cart dialog and notifications are now functional.

See DESIGN.md and docs/visual-shell-report.md. Next steps require approval: interaction/state integration and multilingual behavior. Browser screenshots, keyboard/focus, responsive/RTL, API-origin/CORS, and real-device checks remain unverified; rendered markup tests do not establish pixel parity.

## Catalog controls phase

StorefrontPage calls useProductCatalog once and passes its controller to the catalog and mode actions to the header. The reducer owns the local catalog and query/category/sort/affordable state; existing selectProducts derives results, and getCategories derives options. The hook now subscribes to the API refresh after mount; no browser storage is accessed by this state owner. Both catalog navigation links reset query/category/sort, even when reselecting the active mode; ordinary edits preserve affordable mode. Result counts, mode suffix, active navigation, original empty message, and default catalog order are preserved.

Interaction regressions exercise component callbacks with the production reducer and inspect resulting rendered markup. They do not simulate a mounted browser or verify keyboard, focus, anchor scrolling, or visual parity. See docs/catalog-controls-report.md.

## API refresh phase

useProductCatalog subscribes to products.refresh.ts after mount. One shared in-flight request reuses fetchCompleteProducts and the existing client, validation, and five-second timeout. Cleanup deactivates a subscriber so late responses cannot update unmounted state; StrictMode effect replay shares the request. The request may finish after all subscribers leave, bounded by the existing timeout, and its response is ignored. A later mount can request fresh data after settlement. Only the catalog field is replaced; control state is retained. No loading/error UI is added. See docs/api-refresh-report.md.

## Multilingual phase

App now wraps the storefront in one LanguageProvider. It restores the existing language store and writes changes through its validation/persistence methods. useLanguage exposes the preference/action; useTranslation and getLocalization adapt existing pure translations, product text, and USD/number formatting. Catalog selection reads the current language without resetting its reducer. The language effect updates only document lang/dir/title/description. CSS, assets, and the existing storage/translation modules are unchanged. See docs/multilingual-report.md for checks and browser verification limits.

## Cart and notifications phase

StorefrontPage owns one useCart hook and one useToast hook. The existing cart store remains the quantity source of truth; React revisions trigger fresh snapshots instead of maintaining a second mutable cart. Count and subtotal use existing pure functions; details/prices derive from the shared API-backed catalog. ProductImage supports the original cart-visual wrapper so cards and cart share fallbacks. Native dialog effects, confirmation focus, item removal focus recovery, and a single translated 2600ms toast controller restore the original behavior. Sign-up submission stays disabled. See docs/cart-notifications-report.md.
