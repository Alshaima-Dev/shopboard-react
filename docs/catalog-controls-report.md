# Catalog state and controls — Phase 1

## Changes

- Added `src/features/products/products.state.ts`: typed initial catalog/control state and immutable reducer. Navigation resets query, category, and sort while selecting the requested affordable mode. No product-selection logic is duplicated here.
- Added `src/features/products/useProductCatalog.ts`: one React reducer instance, initialized from existing local products. Existing `selectProducts` derives visible products and `getCategories` derives category options. English remains the fixed language for this phase.
- Updated `StorefrontPage.tsx`: owns the hook once and connects header/catalog through props.
- Updated `StoreHeader.tsx`: both catalog links navigate to #shop and reset filters; active class and aria-current follow mode. Language and bag controls remain inactive.
- Updated `ProductCatalog.tsx`: controlled query/category/sort, enabled controls, derived product cards, live result count, original affordable suffix, and original empty-state message. Sorting defaults to featured order.
- Updated `tests/visual-shell.test.js`: added four focused regression cases using real component event callbacks, production reducer transitions, and rendered output.
- Updated AGENTS.md, DESIGN.md, and README.md to reflect authorized scope and current functionality.

Original pure logic, product types/data, translations, CSS, images, and API modules were not changed. No files in the original project were written. No packages were installed; no commit, push, or deployment was performed.

## Verification

- Lint: passed without warnings.
- Strict typecheck: passed.
- Tests: 23 passed, 0 failed. Existing preservation assertions still pass for all 34 copied files.
- Production build: passed, 35 modules transformed. CSS output hash remains `index-B6Hqu9I_.css`, matching the prior visual-shell build.
- Exact URL `http://localhost:5175`: HTTP 200; root loads main.tsx. Served catalog contains all three onChange handlers; served hook calls useReducer and selectProducts.

Added cases cover combined search/category/sorting, ascending/descending/default order, input immutability, result counts, reset rules including repeated active-mode clicks, retained affordable mode during normal edits, active aria-current, empty results and recovery, and strict exclusion of $50/$50.01 with inclusion of $49.99.

Tests invoke component callbacks with the production reducer and rerender resulting props. They do not mount the hook in an interactive browser. Browser event dispatch, HMR behavior, keyboard/focus, anchor scrolling, mobile responsiveness, and screenshot parity remain unverified. HTTP inspection establishes that the requested URL serves current code, not that browser interactions were exercised.

API loading, language switching, cart operations, sign-up submission, and notifications remain disconnected as requested. Further work requires approval for Phase 2.
