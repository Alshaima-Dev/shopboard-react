# YANINDA React design

Follow [the original design](docs/original/DESIGN.md). Original src/style.css maps to src/styles/storefront.css, which must remain byte-identical. Preserve markup classes, nesting, section order, asset paths, and SVG geometry.

The UI supports English, Arabic (RTL), and Turkish with functional localized search, category, price sorting, and under-$50 navigation. API refresh is connected without loading or error UI. Language switching restores the existing preference and preserves control state. The cart dialog and notifications now reuse original classes, product imagery, and translation keys. Sign-up submission remains deferred. The original stylesheet and assets are unchanged. Browser visual parity remains to be checked.
