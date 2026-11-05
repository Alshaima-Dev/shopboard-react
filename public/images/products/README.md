# Product image sources

## Provenance and use

The twelve product JPEGs are AI-generated illustrative images created for the ShopBoard demo with the built-in OpenAI image generation tool. They are not photographs of verified inventory, were not downloaded from a stock-photo site, and used no third-party reference photos. They depict unbranded products without logos or watermarks.

The final images are 1024 x 1024 JPEGs, resized with high-quality bicubic interpolation and saved at JPEG quality 90. The fallback SVG was authored for this project. Product names, IDs, categories, and prices are separate catalog data; these illustrations do not establish real product availability.

## Replacing an image

Replace the matching JPEG here using the same filename, or add a local image and update its `image` path in `src/features/products/products.data.ts`. Paths are relative to `public/`, for example `images/products/leather-tote-bag.jpg`. Update `imageAlt` and the translated alt text for English, Arabic, and Turkish to describe the replacement. Keep square framing with space around the product.

`src/features/products/components/ProductImage.tsx` shares localized image rendering and fallback behavior between product cards and cart thumbnails. Keep `fallback.svg` available.

Use only images you created or have permission to use. Record the creator/source, applicable license or permission, and any AI assistance here when replacing an image.
