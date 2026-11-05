# YANINDA React development rules

Work exclusively inside `D:/core istanbul/project -2/shopboard-react`. Never commit or push without explicit approval.

## Permanent protected-directory access restriction

The entire directory `D:/core istanbul/procit-1` and all of its subdirectories, including the original Day 3 project at `D:/core istanbul/procit-1/shopboard`, are protected. Without the user's explicit approval for the specific access, never access, read, search, scan, execute, modify, delete, or move anything inside the protected directory or its subdirectories. Do not perform comparisons, tests, or Git operations involving the protected directory. This prohibition includes indirect access through scripts, tools, tests, symlinks, or searches covering parent directories. Previous read-only access or general migration instructions do not authorize future access. If access becomes necessary, explain why and what access is needed, request approval, and wait for explicit permission before proceeding. Do not access the protected directory to verify this restriction. This permanent rule applies across all task phases.

## Current task authorization

Migration Phases 1–5 are completed. The project is now working through the teacher's React Task 4 requirements, one explicitly approved task at a time. Implement only the scope the user has explicitly approved; completion of one task does not authorize the next. Preserve the completed functionality, silent API fallback, CSS/assets, documentation, and existing .git directory unless a specific change is explicitly approved. Installing packages, downloading resources, deleting files, performing repository cleanup, committing, or pushing each requires the user's explicit approval before proceeding. Never send, store, or log registration credentials.

## Coding rules

- Inspect existing modules and reuse functions. Maintain one catalog, cart store, language store, and notification owner. Avoid duplicate logic and competing state.
- Use `src/features/` with separate types, pure logic, persistence, and API responsibilities. Keep shared helpers in `shared/`. Use named exports, explicit type imports, and no circular dependencies.
- Keep strict, noEmit, and noUnusedLocals enabled. Never introduce any, type assertions (including as const), non-null assertions, error suppression, or weaker compiler settings. Validate unknown values by narrowing.
- Preserve product fields, IDs, values, translations, category values, image paths, and assets. Preserve Turkish case folding, Arabic normalization, filtering before sorting a copy, default order, and strictly under-$50 selection.
- Preserve cart key `shopboard-catalog-cart-v2` and string-ID-to-number quantity format; validate quantities, ignore unknown IDs, cap at 99, return copies, and tolerate blocked/corrupt storage. Keep language key `shopboard-language` and USD formatting.
- Keep localStorage access in persistence files and DOM access out of pure modules. Never mutate input collections.
- Reuse the existing API client, endpoint, timeout, full response validation, and stable-ID checks. Preserve local-first rendering with a complete valid API refresh. Do not invent backend endpoints.
- Preserve exact design, CSS cascade, branding, fonts, translations, image fallbacks, notification behavior, navigation, cart focus/confirmation, and demo checkout/sign-up. Future UI uses semantic HTML, labeled inputs, mobile-first min-width queries, logical properties, no !important, reduced motion, and RTL/LTR support.
- Tests must tolerate valid whitespace and line wrapping. Retain regression assertions. Verify the exact reported URL before claiming browser fixes.
- Explain changes and run typecheck, tests, lint, and build. Do not install packages without authorization.

## Original references

`docs/original/AGENTS.md` preserves the original rules verbatim. Its vanilla file structure and local-only API description are historical: current source already supports `/api/products`. This root file governs React paths and phase scope. Original DESIGN.md, README.md, and LOCALIZATION.md remain verbatim references in that folder.
