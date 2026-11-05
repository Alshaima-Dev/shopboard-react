# YANINDA Design

## My design direction

YANINDA is a fashion and lifestyle boutique for clothing, bags, shoes, and accessories. The design uses warm backgrounds, burgundy details, elegant headings, and clear product cards to give the store a calm, premium feeling.

The website layout is my own direction, developed through my ideas and feedback. I did not copy another website or use another website as a layout reference.

A user-provided fashion composition image was used as a visual reference for the campaign artwork only. It was not a reference for the website layout. The current campaign image is AI-assisted artwork, not a verified photograph of real inventory. It is stored at `public/images/brand/yaninda-campaign.jpg`.

## Colors

The main colors are defined in `src/style.css`.

| Color | Value | Use |
| --- | --- | --- |
| Burgundy | `#6B2C2C` | Main buttons, headings, announcement bar, and footer |
| Cream | `#F8F1E7` | Main background, cards, and text on dark surfaces |
| Warm beige | `#D8C3A5` | Borders, soft surfaces, and secondary footer text |
| Coffee brown | `#8B6B4A` | Small decorative details |
| Dark chocolate | `#3E2723` | Body text and dark details |

Some softer backgrounds and borders mix these colors using CSS `color-mix()`.

## Typography and logo

- **DM Sans** is the main body font.
- **Cormorant Garamond** is used for the YANINDA wordmark, hero heading, promotional heading, and sign-up heading.
- **Manrope** is used for some other section headings.
- **Noto Sans Arabic** supports Arabic text and headings. Fallback fonts are also defined.

The fonts are loaded through Google Fonts in `src/style.css`. The logo combines an inline SVG symbol with editable YANINDA text. The symbol is drawn by `src/shared/ui/icons.ts`; the brand name remains HTML text in `index.html`.

## Layout and spacing

The static page structure is in `index.html`. TypeScript handles translations, icons, products, the cart, and interactions.

The page contains an announcement bar, header and navigation, hero, four feature highlights, product controls and cards, demo sign-up form, final promotional section, and footer.

The announcement bar, header, hero, and other main sections use the shared `.wrap` container. It has a maximum width of 1440px and responsive horizontal spacing. Its width subtracts 36px, 64px, or 112px from the available width at different screen sizes.

On larger screens, the hero places text beside the square campaign image. Its columns use proportions of 0.95 and 1.05. The text is vertically centered, and the image uses `object-fit: contain` so important objects remain visible. On mobile, the text and image stack.

Spacing is defined per component. Common gaps include 8px, 12px, 16px, 24px, and 28px. The stylesheet does not define one complete spacing scale.

The footer uses a centered vertical layout: symbol, brand name, tagline, divider, and copyright. It shares the announcement bar's burgundy background.

## Buttons, controls, and product cards

Main action buttons are burgundy with cream text and rounded pill shapes. Product add buttons are circular and measure 44 by 44px. Controls generally use 8px corners, product images use 12px corners, and product cards use 21px corners.

Product cards have cream backgrounds, subtle shadows, square image areas, names, prices, categories, and descriptions. Product images use `object-fit: contain`. The cart reuses the product image component and its fallback handling instead of using a separate implementation.

Keyboard focus has a visible outline. Hover and press states provide feedback. Motion is limited, and reduced-motion media queries reduce effects. The demo sign-up form uses visible labels and native email, required-field, and password-length validation.

Relevant files are `src/style.css`, `src/modules/products/products.ui.ts`, `src/modules/cart/cart.ui.ts`, and `src/modules/signup/signup.ui.ts`.

## Responsive design and languages

The CSS starts with the mobile layout and uses `min-width` media queries.

- Below 400px, the product grid has one column.
- From 400px, it has two columns.
- From 901px, it has three columns.
- From 701px, the header uses one main row, the hero uses two columns, and the product controls use a wider row.
- On smaller screens, navigation moves below the brand and actions, and announcement messages can stack.

English and Turkish use left-to-right text. Arabic uses right-to-left text and Arabic typography. `src/modules/i18n/i18n.ui.ts` updates the document's language and direction. CSS logical properties support both directions, and directional arrows are mirrored for Arabic. The header keeps the language selector and bag controls in a consistent visual position.

Translations are stored in `src/modules/i18n/i18n.ts`. Product translations are stored in `src/modules/products/products.data.ts`. Switching language updates the interface without changing the product IDs, prices, currency, or cart contents.

## Improvements made during development

- The store changed from the earlier home-focused ShopBoard presentation to the YANINDA fashion and lifestyle identity.
- The current palette, serif brand typography, editable wordmark, and SVG symbol made the branding more consistent.
- The hero received more balanced proportions and spacing. The outdated caption below its image was removed, and the full campaign image remains visible.
- The announcement bar was aligned with the main content container and given compact padding and subtle rounded corners.
- Product cards gained consistent local images, image sizing, add controls, and fallback handling.
- The footer changed from content spread across three positions to a centered vertical composition with a divider.
- English, Arabic, and Turkish support added translated text, RTL handling, and a stable language selector position.
- The demo sign-up form added labeled fields and native validation in the existing palette.
- Moving static markup into `index.html` made the page structure directly readable while preserving dynamic TypeScript behavior.

Git history records the earlier store in `1fe7e75`, the YANINDA branding work in `aa2a1d4`, further styling and module work in `6e27671`, and the sign-up and semantic HTML work in `afa357b`.

This document describes the current code and the development history. It does not claim an external website reference, a formal spacing system, or design measurements that were never established.
