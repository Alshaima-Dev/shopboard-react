# Phase 4 — functional cart and notifications

## Implementation

The original cart UI, store, calculations, and toast behavior were inspected before edits. One `useCart` instance in StorefrontPage owns one existing cart store. It reads validated persisted quantities once, executes existing store operations, and triggers React renders after operations. There is no duplicate quantity algorithm or second writable quantity map. Count and subtotal use existing pure calculations. Product details and prices derive from the shared current catalog, so API updates preserve quantities and update the cart.

The native dialog uses the original classes, item layout, shared image fallback, subtotal, $100 shipping threshold, empty content, translated confirmation, and demo checkout. Opening resets clear confirmation. Confirmation cancel, close, emptying via quantity/removal, and reopen reset it. Focus requests target the confirmation button, clear button, keep-shopping button, or the existing quantity/remove button with a first-item fallback after removal. Native showModal/close provides modal focus management; Escape and outside-rectangle clicks close the dialog. React owns handlers rather than manually registered global listeners.

One toast controller publishes message keys, replaces its previous timer, dismisses after 2600ms, and cancels pending timers on unmount. Rendering translates the current key, so language changes update a visible notification without restarting its timer. Checkout only publishes the original demo message and leaves quantities intact.

## Files

Added:

- src/features/cart/cart.actions.ts
- src/features/cart/cart.dialog.state.ts
- src/features/cart/useCart.ts
- src/features/cart/components/CartDialog.tsx
- src/features/cart/components/CartItem.tsx
- src/features/cart/components/CartSummary.tsx
- src/shared/ui/toast.controller.ts
- src/shared/ui/useToast.ts
- src/shared/ui/Toast.tsx
- tests/cart-actions.test.js

Updated:

- StorefrontPage.tsx: one cart/toast owner and feature callbacks.
- StoreHeader.tsx: live count, translated bag label, open action.
- ProductCatalog.tsx and ProductCard.tsx: add callback; inactive markers removed.
- ProductImage.tsx: reusable wrapper class for cards and cart thumbnails.
- tests/visual-shell.test.js: enabled add controls, cart/confirmation/shipping markup, multilingual notifications.
- AGENTS.md, README.md, DESIGN.md: current phase and behavior.

The existing cart store, logic, types, persistence keys/formats, catalog logic/data, translations, API modules, CSS, and assets remain unchanged. No packages were installed, and no original-project writes, commit, push, or deployment occurred. Sign-up submission remains disabled.

## Checks

- Lint: passed without warnings.
- Strict application/tooling typecheck: passed.
- Tests: 37 passed, 0 failed.
- Production build: passed, 54 modules transformed.
- All 34 foundation/document/asset hashes still pass.
- CSS output remains index-B6Hqu9I_.css.
- The exact React URL localhost:5175 serves StorefrontPage with useCart/useToast and cart callback connections.

Tests cover quantity operations and the cap, decrement-to-removal, storage restoration, notification keys, no cart mutation on demo checkout, API price changes without quantity reset, dialog confirmation state transitions, translated item/empty/confirmation/checkout content, below/at-$100 shipping content, toast replacement/dismissal/cleanup, and all three languages. Existing tests retain corrupt/blocked storage and other foundation coverage.

## Verification limits

No real-browser interaction or screenshot comparison was performed. Native modal tab containment, opener focus restoration, Escape/backdrop closure, confirmation/removal focus recovery, browser reload persistence, visible timer behavior, RTL layout, and real-device responsiveness remain unverified. Tests exercise production stores/actions/state, mocked timers, and server-rendered markup rather than mounting an interactive browser. HTTP inspection confirms current code is served, not that browser interactions were executed.

Stop here pending Phase 5 approval.
