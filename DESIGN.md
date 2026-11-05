# YANINDA design

## Actual reference and attribution

The React storefront follows the existing YANINDA design direction documented in the local archival [design document](docs/original/DESIGN.md). That document credits the project owner's ideas and feedback for the website layout. It explicitly states that no external website layout was copied. No external design-reference URL has been established, so none is claimed here.

A user-supplied fashion composition informed the campaign artwork only, not the website layout. The source reference itself is not present here. The active campaign is `public/images/brand/yaninda-campaign.jpg`: AI-assisted artwork, not verified inventory photography. Product JPEGs are AI-generated illustrations; the two image-folder README files retain their existing provenance.

## Reused and borrowed elements

The React migration reuses the YANINDA palette, original CSS cascade, local images, exact inline SVG path geometry, wordmark text, semantic section structure, and established responsive behavior. These are carried over from this project's previous implementation, not borrowed from an identified third-party website. Google Fonts supplies the typefaces. The original responsive Grid/Flexbox patterns, pill buttons, and card shapes are implemented directly in CSS, with no UI kit or icon-package dependency.

## Palette

| Color          | Value     | Role                                          |
| -------------- | --------- | --------------------------------------------- |
| Burgundy       | `#6B2C2C` | Primary actions, accents, announcement/footer |
| Cream          | `#F8F1E7` | Page/card surfaces and inverse text           |
| Warm beige     | `#D8C3A5` | Borders and secondary tones                   |
| Coffee brown   | `#8B6B4A` | Decorative details                            |
| Dark chocolate | `#3E2723` | Body text and dark accents                    |

`src/styles/storefront.css` contains the source variables and later refinements. `color-mix()` derives soft surfaces and borders; there is no invented complete spacing scale.

## Typography and assets

- DM Sans: primary body text.
- Cormorant Garamond: wordmark, hero, philosophy, and sign-up headings.
- Manrope: other section headings.
- Noto Sans Arabic: Arabic text/headings, with fallback fonts.

Fonts load through the existing Google Fonts CSS import. Offline rendering uses the defined fallbacks and can have different metrics. The ribbon uses `BrandMark.tsx`; outline controls use `Icon.tsx`. The name stays editable YANINDA text isolated LTR in every language. `public/yaninda.svg` is the active favicon.

Campaign and product images use contain sizing. The square campaign stays fully visible. ProductImage shares localized image fallback behavior between cards and cart thumbnails.

## Layout and accessibility

Section order is announcement, header/navigation, hero, four benefits, product catalog/controls, demo sign-up, philosophy, footer, then the modal cart and notification region. The shared container has a 1440px maximum width and responsive gutters. The desktop hero uses 0.95/1.05 columns; mobile stacks its content.

The grid has one product column below 400px, two from 400px, and three from 901px. Header/hero/control layout changes from 701px; wider gutters occur from 1101px. Cards use the existing 21px corners, image corners are 12px, controls generally use 8px, and add buttons are 44px circles. Spacing and overrides remain in their original order.

Visible labels, native form constraints, focus-visible styles, reduced-motion handling, native dialog behavior, translated accessible text, and live result/toast/status messages are retained. Arabic sets document RTL, mirrors directional arrows, and uses logical layout properties; the header retains its physical language-selector position through existing LTR header/action containers.

## Improvements and deliberate assignment changes

- React components replace manual DOM construction while retaining original classes, assets, section order, and behavior.
- Product filtering, sorting, cart calculations, persistence, and localization reuse their existing modules with clear React state ownership.
- The sort label now uses the same existing translation key as its accessible label.
- Loading, API failure, empty-response, and retry feedback are translated additions required by the React assignment. The current/fallback collection stays usable, and retry does not clear controls or cart quantities. This is an intentional departure from the earlier silent failure presentation.
- Sign-up validation/reset and the original translated success toast are connected; no credentials are submitted or saved. Checkout remains a demo.

## Verification limits

The stylesheet itself has not been edited by the current assignment work. Automated rendered-output tests cannot establish pixel parity or native mobile select behavior. Arabic mobile sort truncation has not been reproduced in a real browser, so no speculative CSS fix was made. Desktop/mobile screenshots, actual font loading, keyboard focus, native dropdown width, RTL presentation, and real-device checks remain manual work.
