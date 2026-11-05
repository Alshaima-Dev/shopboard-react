# Phase 3 — multilingual support

## Changes

- Added `features/i18n/LanguageProvider.tsx` and `language.context.ts`: one React language owner initialized from the existing language store. User changes pass through its validation and persistence method before updating React state. No storage implementation was duplicated.
- Added `features/i18n/useLanguage.ts`: language hook and reusable translation/formatting adapters, delegating to existing pure functions.
- Added `features/i18n/language.document.ts`: document language, RTL/LTR, title, and description update helper, invoked by the provider effect.
- Updated App to wrap the storefront once, without keying/remounting it on language changes.
- Updated StorefrontPage and StoreHeader to connect the controlled language menu. Native menu names, brand LTR spans, and header-actions LTR positioning remain intact.
- Updated useProductCatalog to derive search results using the selected language without changing query, category, sort, affordable mode, or catalog state. The API refresh effect stays independent of language changes.
- Updated AnnouncementBar, Hero, Benefits, Philosophy, StoreFooter, SignupForm, ProductCatalog, ProductCard, ProductImage, and CampaignImage to use the existing translations and formatting functions, including names/descriptions, buttons, labels, accessibility text, placeholders, counts, shipping offer, footer, campaign alt text, and fallback messages.
- Updated visual-shell tests, AGENTS.md, README.md, and DESIGN.md.

Original i18n.ts, i18n.state.ts, product types/data/logic, API modules, all CSS, images, and original-project files remain unchanged. No dependencies were installed. No commit, push, deployment, cart operations, or sign-up submission behavior was added.

## Behavior

The existing shopboard-language key is restored and updated. Invalid/blocked storage retains the original safe defaults and in-memory behavior. Arabic applies rtl; English and Turkish apply ltr. Prices stay USD with locale-specific formatting. Search preserves its input on language changes, so an old-language query may produce no results until edited, matching the original behavior. Stable category values remain untranslated internally. Product IDs, values, active navigation, other control state, and form DOM identity are preserved; no language-dependent key remounts the page.

## Verification

- Lint: passed with no warnings.
- Strict typecheck: passed.
- Tests: 31 passed, 0 failed.
- Production build: passed, 43 modules transformed. CSS output remains index-B6Hqu9I_.css.
- Preservation checks: all 34 original foundation/document/asset hashes pass.
- The exact React origin localhost:5175 serves the new provider and its existing-store/document-effect connections.

Added tests render every bound page section in all three languages, verify product text/alt/add labels and control accessibility, native language selection, unchanged brand/header direction attributes, persistence/validation through the control callback, retained catalog controls, and document RTL/LTR/title/description via a document-shaped test double. Existing tests retain multilingual search coverage including Turkish case folding and Arabic diacritic normalization, translation completeness, corrupt/blocked storage, currency, API fallback, and catalog controls.

These are source, reducer/callback, server-rendered component, and document-helper tests. They do not mount a live browser. Real-browser language changes and reload restoration, mobile header positioning, RTL screenshots, focus/form-value preservation, image-error events across language changes, and browser metadata inspection remain unverified. No screenshot parity claim is made. Cart and sign-up remain inactive pending Phase 4 approval.
