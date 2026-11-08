# Debug Lab evidence log

## Scope and evidence

Inspected on 2026-11-06: [ShopBoard Debug Lab](https://shopboard-api.vercel.app/debug-lab), HTTP 200, and its public [JavaScript bundle](https://shopboard-api.vercel.app/debug-lab/assets/index-CbYUo1e8.js), HTTP 200. The bundle contains readable component source markers and JSX source line metadata. Its `.map` URL returned HTTP 403.

The source inspection above is separate from the Chrome browser testing reported by the user below. The coding assistant did not perform that browser session. The user supplied reproduction steps and results, including DevTools Console evidence for the missing-key warning; no Components-tab inspection is claimed. The browser session date and Chrome version were not supplied.

| Finding                   | Browser status                                              |
| ------------------------- | ----------------------------------------------------------- |
| Category keys             | Reproduced; Console warning identified CategoryChips        |
| Stray zero                | Reproduced around sold-out products and the empty cart      |
| Saved heart after sorting | Not reproduced in the reported test                         |
| Featured order reset      | Reproduced after ascending-price sorting                    |
| Cart quantity increase    | Reported as reproduced; exact failure behavior not recorded |

**Repair status:** all fixes below are proposals. No applied repair or successful before/after retest is recorded. Reproducing a bug does not establish that its proposed fix was applied or verified.

Component paths below refer to the external Debug Lab application, not this YANINDA React project's component files. Source-based explanations and proposed fixes remain distinct from the user's actual browser observations.

## 1. Category list children have no keys

- Component: `src/components/CategoryChips.tsx`, JSX source line 9.
- Evidence: the mapped span's generated JSX key argument is undefined.
- Cause: mapped siblings lack stable category keys.
- Browser status: reproduced in Chrome, as reported by the user.
- Steps and observation: opened DevTools → Console and refreshed the page. React displayed: "Each child in a list should have a unique 'key' prop." The warning identified CategoryChips.
- How found: inspected the category mapping and generated JSX key argument in the public bundle.
- Proposed fix: give each span its category string as its key.
- Remaining verification: after an authorized fix, repeat the refresh and check that the warning disappears. No fix has been applied or retested.

## 2. Numeric conditional rendering leaks a zero

- Components: `src/components/StockNote.tsx`, JSX source line 6; also `src/components/CartPanel.tsx`, item-list source line 20.
- Evidence: stock and cart length are used directly as the left operands of conditional JSX expressions.
- Cause: zero is a renderable React child, so a false numeric condition displays zero instead of hiding the element.
- Browser status: reproduced in Chrome, as reported by the user.
- Steps and observation: inspected the page around sold-out products and the empty cart. An unwanted 0 was visible. The specific product names were not recorded.
- How found: inspected the stock label and cart list conditional expressions.
- Proposed fix: compare the numbers explicitly with zero before conditionally rendering.
- Remaining verification: after an authorized fix, inspect sold-out products and the empty cart and confirm no stray zero remains. No fix has been applied or retested.

## 3. Saved state follows the list position after sorting

- Components: `src/components/ProductList.tsx`, JSX source line 18; `src/components/ProductCard.tsx`.
- Evidence: product cards use the mapping index as the JSX key, while each card owns its saved state with a state hook.
- Source-based risk: index keys can retain card state by position when sorting changes which product occupies that position. This explanation has not been validated by a reproduced heart-state failure.
- Browser status: not reproduced in the user's Chrome test.
- Steps and observation: favorited Leather Tote Bag, then sorted by price in both directions. The heart remained with the same product. A moving-heart bug must not be claimed from this test.
- How found: connected the list's index key with the card's local saved state.
- Proposed fix: key cards with their stable product IDs.
- Remaining verification: investigate the discrepancy between the inspected source and observed behavior before classifying this as a reproduced bug. Stable-ID keys remain a proposed source improvement; no fix has been applied or retested.

## 4. Sorting destroys the featured order

- Component: `src/components/ProductList.tsx`.
- Evidence: the ascending-price branch sorts the input products array directly; the default branch returns that same array.
- Cause: in-place sorting mutates the parent's data, so the original featured order is no longer available.
- Browser status: reproduced in Chrome, as reported by the user.
- Steps and observation: changed sorting to Price: Low to High, then back to Featured. The original product order was not restored. The exact before/after product sequence was not recorded.
- How found: inspected how the displayed collection is derived for both sort modes.
- Proposed fix: sort a copy and preserve the original collection for featured order.
- Remaining verification: record the initial product order, apply an authorized fix, select ascending price, return to Featured, and compare with the initial order. No fix has been applied or retested.

## 5. Increasing cart quantity reuses the same state reference

- Components: `src/components/CartRow.tsx` and `src/App.tsx`.
- Evidence: the row mutates the item quantity, then the parent's change callback passes the existing cart array to its state setter.
- Source-based cause: React can skip rendering because the next array is identical by reference to the current state. The exact visible failure was not recorded well enough to verify this causal link in the browser.
- Browser status: reported as reproduced in Chrome, with incomplete observation detail.
- Steps and observation: added a product and attempted to increase its quantity. The interaction did not work correctly, but the exact failure behavior was not recorded. No specific claim about quantity text, totals, or delayed rendering is established by this observation.
- How found: traced the row's increase handler into the parent's cart change callback.
- Proposed fix: let the cart state owner use a functional update that maps to a new array and copies the changed item.
- Remaining verification: record the product, starting quantity, action, actual quantity, and visible result before any repair. After an authorized fix, check the row, badge, and totals across repeated changes. No fix has been applied or retested.

## Remaining work

Three bugs have specific user-reported reproductions; the cart issue has an incomplete failure description, and the saved-heart issue was not reproduced. The teacher's requirement for five observed bugs with verified fixes is therefore not complete. Capture the missing cart details and investigate the unreproduced heart finding, then separately document any authorized repairs and before/after retest results. No fixes were applied to the Debug Lab application and none were retested. The YANINDA application already uses stable product keys, copied sorting, and its existing cart store; these lab findings do not justify duplicating those algorithms.
