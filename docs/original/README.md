# YANINDA — ShopBoard

A multilingual fashion and lifestyle storefront built as a frontend learning project. The website uses the YANINDA brand; the project folder and npm package are named `shopboard`.

## Features

- A local catalog of 12 products with images, descriptions, categories, prices, and image fallbacks.
- Case-insensitive search in the selected language, category filtering, and price sorting. These controls work together.
- Default product order and an under-$50 navigation filter.
- A shopping cart with add, increase, decrease, remove, clear confirmation, item count, and subtotal. Quantities are limited to 99 per product.
- Cart persistence and saved language selection using browser localStorage.
- English, Arabic, and Turkish, with Arabic RTL support and locale-aware USD formatting.
- Responsive layouts, visible keyboard focus, inline SVG icons, and reduced-motion handling.
- A semantic demo sign-up form with labels, required fields, email validation, and a minimum password length of eight characters.
- A demo checkout message. No purchase is submitted.

## Technologies

- Vite and vanilla TypeScript ES Modules.
- Semantic HTML and CSS, including Grid, Flexbox, logical properties, and responsive media queries.
- TypeScript 6.0.3 with strict type checking.
- ESLint with typescript-eslint, Prettier, Husky, and lint-staged.
- Node.js's built-in test runner and assertion library.

The application does not use a frontend framework or a backend service.

## Installation and development

Use Node.js 24 or newer and npm. The project has been checked with Node.js 26.13.0. Git is needed for the Husky pre-commit hook.

Open a terminal in the `shopboard` directory containing `package.json`, then run:

```sh
npm ci
npm run dev
```

Open `http://localhost:5173/`. The product section is at `http://localhost:5173/#shop`, and the sign-up section is at `http://localhost:5173/#signup`.

Vite refreshes the page as source files change. `vite.config.js` fixes the development port at 5173 with `strictPort: true`. If that port is occupied, identify the existing server instead of assuming another port serves the same page.

On Windows PowerShell, if script execution policy blocks `npm`, use `npm.cmd` for the same commands. No execution-policy change is needed.

## Available npm scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server with HMR. |
| `npm run build` | Create the production output in `dist/`. |
| `npm run preview` | Serve the existing production build locally. Run the build first and open the URL printed in the terminal. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm run lint` | Check application TypeScript, JavaScript tests, and tooling configuration with ESLint. |
| `npm run format` | Apply Prettier formatting to the configured source, tests, HTML, and configuration files. This modifies files. |
| `npm run format:check` | Check formatting without changing files. |
| `npm run prepare` | Configure Husky hooks for the local repository. npm also runs this lifecycle script during installation. |

## Project structure

```text
shopboard/
  index.html                 Static semantic page structure and form
  src/
    main.ts                  Application initialization and feature connections
    style.css                Shared styling and responsive layouts
    modules/
      products/              Catalog, product types, pure logic, and rendering
      cart/                  Cart types, state, persistence, calculations, and UI
      i18n/                  Translations, formatting, language state, and UI
      signup/                Demo form event handling
    shared/
      storage.types.ts       Shared storage interface
      ui/                    DOM helpers, icons, formatting adapters, and toast
  public/
    images/                  Local campaign and product images
    yaninda.svg              SVG favicon
  tests/                     Node.js regression tests
  .husky/pre-commit          Runs lint-staged before a commit
  eslint.config.js           ESLint configuration
  lint-staged.config.js      Staged-file checks
  .prettierrc.json           Formatting configuration
  .prettierignore            Formatting exclusions
  tsconfig.json              TypeScript configuration
  vite.config.js             Development server configuration
```

Static markup stays in `index.html`. UI modules handle DOM updates and events. Pure logic stays separate from the DOM and browser storage. State modules own persistence. `main.ts` connects the features without duplicating their logic.

## Tests and code quality

Run the full checks from the project directory:

```sh
npm run lint
npm run format:check
npm run typecheck
node --test tests/*.test.js
npm run build
```

There is no `npm test` script; run the Node test command directly. The tests cover module boundaries, imports, branding, translations, localized product controls, price boundaries, cart calculations and persistence, and static semantic HTML requirements.

Husky runs lint-staged before commits. It checks matching staged files with ESLint and `prettier --check`. CSS, JSON, and HTML receive formatting checks where configured. The hook reports problems rather than automatically fixing files. It does not replace the full typecheck, test, and build commands above.

Dependencies, build output, assets, and documentation are excluded from the configured formatting scope. Console exercises outside this project are not included.

## Demo limitations

- **Sign-up is a frontend demo only.** It creates no account and performs no authentication. A valid submission clears the form and shows a translated message. Email and password values are not sent or saved by the application. The submit button is enabled only after its demo handler is attached.
- Checkout does not process payments, create orders, or contact a service. Shipping messages are part of the demonstration, not a delivery promise.
- Products come from a local TypeScript file. There is no live inventory, product API, database, or account system.
- Prices remain in USD. Changing language changes formatting, not currency or numeric values.
- Cart and language preferences are local to the browser and origin. They do not sync between devices. Blocked or corrupt storage is tolerated, but persistence may be unavailable.
- The cart uses `shopboard-catalog-cart-v2`, and language selection uses `shopboard-language`. Keep these keys and the saved formats compatible when making changes.
- The product images are AI-generated illustrations. The campaign artwork is AI-assisted. They are not verified photographs of real inventory; their available provenance is described in the image-folder README files.
- Google Fonts requires network access. CSS fallback fonts are defined.
- Automated tests do not replace manual browser, keyboard, and real-device checks.

## Project documentation

- [AGENTS.md](AGENTS.md): architecture, development rules, and behavior to preserve.
- [DESIGN.md](DESIGN.md): the original website design direction, current visual system, and the separate campaign artwork reference.
- [LOCALIZATION.md](LOCALIZATION.md): language behavior and translation locations.
- [debugging-log.md](debugging-log.md): verified test-code problems and their fixes.

The website layout was developed through the project owner's ideas and feedback. A supplied fashion composition image was a reference for campaign artwork only, not another website's layout.
