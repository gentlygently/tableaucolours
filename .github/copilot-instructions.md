# Copilot Coding Agent Instructions

Trust these instructions. Only search the codebase if the information here is incomplete or appears incorrect.

## What This Repository Is

**Gently, gently** — a Vue 3 single-page application for creating and editing Tableau colour palettes and Preferences.tps files. Users can build palettes from scratch or from images, import/export palette XML, and open/edit/export full `.tps` files. Deployed as a static site to GitHub Pages.

## Tech Stack

| Concern          | Technology                                                              |
| ---------------- | ----------------------------------------------------------------------- |
| Framework        | Vue 3 (Composition API)                                                 |
| State management | Pinia (composition-style stores)                                        |
| Build tool       | Vite 7                                                                  |
| Styling          | LESS (`src/variables.less` for shared vars)                             |
| Unit tests       | Vitest + @vue/test-utils + @testing-library/jest-dom                    |
| E2E tests        | Playwright (Chromium-only in CI)                                        |
| Linting          | ESLint flat config (`eslint.config.js`) — Vue + StandardJS rules        |
| Formatting       | Prettier (`.prettierrc.js`); enforced on commit via husky + lint-staged |
| Node.js (CI)     | 20                                                                      |

## Build & Validation Commands

**Always run `npm install` before any other command.** ESLint is not globally installed; without it, `npm run lint` fails with `eslint: command not found`.

```bash
npm install               # install dependencies — always do this first
npm run lint              # ESLint — must pass with zero errors
npm run test              # Vitest unit tests (34 files, ~289 tests, ~5–6 s)
npm run build             # Vite production build → dist/
```

### Running E2E Tests Locally

E2E tests need a production preview server. The `webServer` config in `playwright.config.js` handles this automatically, but Playwright browsers must be installed first:

```bash
npx playwright install --with-deps chromium
npx playwright test --project=chromium   # run Chromium only (matches CI)
npx playwright test                      # run all browsers (chromium, firefox, webkit)
```

### CI Pipeline (`.github/workflows/ci.yml`)

Runs on every PR and push to `master` in this exact order:

1. `npm ci`
2. `npm run lint`
3. `npm run test`
4. `npm run build`
5. `npx playwright install --with-deps chromium`
6. `npx playwright test --project=chromium`

A PR will be rejected if any of these steps fail. Always validate locally with lint → test → build before pushing.

## Project Layout

```
src/
  main.js                        # App entry point (creates Pinia + mounts App)
  App.vue                        # Root component / view router
  PaletteTypes.js                # Enum-style class for palette types (regular/sequential/diverging)
  eventbus.js                    # Global mitt event bus
  variables.less                 # Shared LESS variables (colours, spacing, etc.)
  components/{Name}/
    {Name}.vue                   # Component
    {Name}.test.js               # Vitest unit tests
    {Name}TestIds.js             # data-testid constants (used in both tests and component)
  stores/
    palette.js / palette.test.js      # Active palette being edited
    tpsfile.js / tpsfile.test.js      # Loaded .tps file state
    image.js / image.test.js          # Image loaded for colour extraction
  utils/
    TpsParser.js / TpsParser.test.js  # Parses .tps XML → palette objects
    TpsWriter.js / TpsWriter.test.js  # Serialises palettes back to .tps XML
  testing/
    test-setup.js                # Vitest global setup (enableAutoUnmount, vi.resetAllMocks, canvas mock)
    test-utils.js                # Helpers: mountWithPinia(), createColours(), userEvent
e2e/
  specs/                         # Playwright specs (colour-palette/, tps-file/, smoke, etc.)
  pages/                         # Page-object models (TpsFileEditor.js, ColourPaletteEditor.js, …)
  fixtures/                      # base.js fixture, test .tps file, sample image
__mocks__/
  colorthief.js                  # Vitest manual mock for the colorthief npm package
.github/workflows/
  ci.yml                         # CI: lint → test → build → e2e
  release.yml                    # Manual deploy to GitHub Pages
```

### Path Alias

`@/` resolves to `src/`. Use it for all imports within `src/`.

## Key Conventions

- **Component structure**: Every component in `src/components/` has exactly three co-located files: `.vue`, `.test.js`, and `TestIds.js`. When adding a component, create all three. Import `TestIds` constants instead of hard-coding string test IDs.
- **Stores**: Use Pinia composition-style (`defineStore('name', () => { ... })`). Call `createTestPinia()` from `test-utils.js` in `beforeEach` to isolate store state between tests.
- **Mounting in tests**: Use `mountWithPinia()` from `src/testing/test-utils.js` instead of bare `mount()`. It injects Pinia and stubs `<teleport>`.
- **Colour values**: Always stored and compared as uppercase hex strings (e.g. `#FF0000`).
- **No router**: Navigation between the start menu, palette editor, and TPS editor is event-driven via the `eventBus` (mitt), not Vue Router.
- **Formatting**: Prettier config uses single quotes, no semis, 100-char print width, trailing commas (ES5). The pre-commit hook auto-fixes staged files; running `npm run format` manually also works.
- **Lint rule**: `@vue/eslint-config-standard` enforces StandardJS style. The most common lint failure is missing spaces around operators or extra/missing blank lines.
