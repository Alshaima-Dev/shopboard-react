# Phase 2 — API refresh and local fallback

## Files changed

- Added `src/features/products/products.refresh.ts`: shared in-flight request using existing `fetchCompleteProducts`. Subscribers receive only validated success results. Cleanup deactivates the subscriber; late responses are ignored. StrictMode setup/cleanup/setup shares the same request. A later mount can refresh after settlement.
- Updated `src/features/products/useProductCatalog.ts`: subscribe in a mount effect, with cleanup; dispatch catalog-only updates.
- Updated `src/features/products/products.state.ts`: catalog replacement action preserves query, category, sorting, and affordable/navigation mode.
- Added `tests/catalog-refresh.test.js`: five focused lifecycle/fallback regressions.
- Updated AGENTS.md, README.md, and DESIGN.md for current scope and behavior.

The initial reducer state remains the 12 local products. The API adapter, validation, centralized URL, and five-second timeout were reused unchanged. There is no loading screen, error message, retry loop, or alternate catalog owner. No cart, language, or sign-up integration was added. CSS, images, data, and component structure are unchanged. No packages were installed, and no original-project files were written, committed, or pushed.

## Lifecycle behavior

Only an active subscription can dispatch a response. A request already in progress is shared, including StrictMode effect replay. Cleanup does not cancel the shared request because a new subscriber may reuse it; the existing timeout bounds its lifetime. Once all subscribers leave, any eventual response is ignored. Request settlement clears the in-flight entry, allowing a later mount to refresh again. No settled-result cache is retained.

## Validation

- Lint: passed without warnings.
- Strict application/tooling typecheck: passed.
- Tests: 28 passed, 0 failed. Existing foundation hashes continue to match all 34 copied files.
- Production build: passed.

New cases cover immediate local initialization, changed-price valid replacement, preservation of filters entered while the request is pending, invalid/incomplete/empty catalogs, duplicate IDs, mismatched IDs, offline/HTTP/JSON errors, timeout aborts, StrictMode request sharing, stale subscriber cleanup, unmount-before-response, and later refresh after settlement.

The exact React origin `http://localhost:5175` serves the updated hook with the refresh effect. A read-only API GET with `Origin: http://localhost:5175` returned HTTP 200, 12 products, and `Access-Control-Allow-Origin: *`. The sandbox initially blocked external connectivity; the live check succeeded with approved network access. The header permits the existing non-credentialed cross-origin fetch.

Browser Network-panel verification, mounted React StrictMode testing, and browser interaction during a live refresh were not performed. Tests exercise the production subscription lifecycle and reducer directly; server-rendered tests verify local initial rendering and existing component output. HTTP/CORS inspection does not prove that a particular browser request completed. No visual screenshot comparison was performed.

Further functionality requires Phase 3 approval.
