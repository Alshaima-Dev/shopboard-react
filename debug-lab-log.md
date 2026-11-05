# Debug Lab evidence log

## Scope and evidence

Inspected on 2026-11-06: [ShopBoard Debug Lab](https://shopboard-api.vercel.app/debug-lab), HTTP 200, and its public [JavaScript bundle](https://shopboard-api.vercel.app/debug-lab/assets/index-CbYUo1e8.js), HTTP 200. The bundle contains readable component source markers and JSX source line metadata. Its `.map` URL returned HTTP 403.

**No browser or React DevTools observations were performed.** The following five findings are source-confirmed defects, with expected symptoms to verify manually. Fixes below are recommendations for the lab, not changes applied to that remote application. The teacher's requirement for five genuinely observed browser bugs remains incomplete until those steps are performed. This log does not substitute expected symptoms for observations.

## 1. Category list children have no keys

- Component: `src/components/CategoryChips.tsx`, JSX source line 9.
- Evidence: the mapped span's generated JSX key argument is undefined.
- Cause: mapped siblings lack stable category keys.
- Expected symptom, not observed: React reports a missing-key warning in the Console.
- How found: inspected the category mapping and generated JSX key argument in the public bundle.
- Proposed fix: give each span its category string as its key.
- Manual verification: open the Console, reproduce the warning, apply the fix in an authorized lab workspace, and confirm the warning disappears.

## 2. Numeric conditional rendering leaks a zero

- Components: `src/components/StockNote.tsx`, JSX source line 6; also `src/components/CartPanel.tsx`, item-list source line 20.
- Evidence: stock and cart length are used directly as the left operands of conditional JSX expressions.
- Cause: zero is a renderable React child, so a false numeric condition displays zero instead of hiding the element.
- Expected symptom, not observed: stray zero text for an out-of-stock product or an empty cart.
- How found: inspected the stock label and cart list conditional expressions.
- Proposed fix: compare the numbers explicitly with zero before conditionally rendering.
- Manual verification: inspect an out-of-stock product and an empty cart before and after the change; confirm no stray zero remains.

## 3. Saved state follows the list position after sorting

- Components: `src/components/ProductList.tsx`, JSX source line 18; `src/components/ProductCard.tsx`.
- Evidence: product cards use the mapping index as the JSX key, while each card owns its saved state with a state hook.
- Cause: React retains card state by position when sorting changes which product occupies that position.
- Expected symptom, not observed: a saved heart appears on a different product after sorting.
- How found: connected the list's index key with the card's local saved state.
- Proposed fix: key cards with their stable product IDs.
- Manual verification: save one product, change sorting, and verify the saved state stays with that product.

## 4. Sorting destroys the featured order

- Component: `src/components/ProductList.tsx`.
- Evidence: the ascending-price branch sorts the input products array directly; the default branch returns that same array.
- Cause: in-place sorting mutates the parent's data, so the original featured order is no longer available.
- Expected symptom, not observed: switching from price sorting back to featured fails to restore the initial order.
- How found: inspected how the displayed collection is derived for both sort modes.
- Proposed fix: sort a copy and preserve the original collection for featured order.
- Manual verification: record initial IDs, select ascending price, return to featured, and compare IDs with the initial order.

## 5. Increasing cart quantity reuses the same state reference

- Components: `src/components/CartRow.tsx` and `src/App.tsx`.
- Evidence: the row mutates the item quantity, then the parent's change callback passes the existing cart array to its state setter.
- Cause: React can skip rendering because the next array is identical by reference to the current state.
- Expected symptom, not observed: pressing increase does not immediately update the quantity or totals.
- How found: traced the row's increase handler into the parent's cart change callback.
- Proposed fix: let the cart state owner use a functional update that maps to a new array and copies the changed item.
- Manual verification: increase a quantity and check the row, badge, and totals update immediately and remain consistent across repeated changes.

## Remaining work

Perform and record the five actual observations, Console/Components-tab evidence where relevant, and verified before/after results in an authorized lab workspace. No remote code was executed locally, no debug-lab source files were installed, and no fixes to the lab are claimed here. The YANINDA application already uses stable product keys, copied sorting, and its existing cart store; these lab findings do not justify duplicating those algorithms.
