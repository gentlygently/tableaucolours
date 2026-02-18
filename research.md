# Research Report: tableaucolours-e2e-tests & tableaucolours-react

## 1. Project Overview

### 1.1 What Is This Application?

**"Gently, gently"** is a web-based Tableau colour palette editor. It provides two main capabilities:

1. **Colour Palette Editor** — Create and edit individual Tableau colour palettes with features including:
   - Manual colour picking via a colour picker widget
   - Automatic colour extraction from uploaded images (using ColorThief + LCH colour space sorting via culori)
   - Import/export of palette XML (`<color-palette>` elements)
   - Three palette types: Regular, Sequential (ordered-sequential), and Diverging (ordered-diverging)
   - Maximum of 20 colours per palette
   - Drag-and-drop reordering, keyboard shortcuts, and colour reversal

2. **TPS File Editor** — Open and manage Tableau `Preferences.tps` files:
   - Parse XML `.tps` files containing `<workbook><preferences><color-palette>` structures
   - Add, clone, edit, remove, and reorder palettes within a file
   - Filter palettes by name, type, selection state, and change state
   - Select subsets of palettes for export to new `.tps` files
   - Save changes using the File System Access API (with download fallback)

The application is live at [gentlygently.github.io](https://gentlygently.github.io/).

### 1.2 The Two Repositories

| Aspect | `tableaucolours-e2e-tests` (this repo) | `tableaucolours-react` |
|--------|----------------------------------------|----------------------|
| **Framework** | Vue 3 (Composition API) | React 19 (Hooks + Functional Components) |
| **Language** | JavaScript (ES modules) | TypeScript (strict mode) |
| **State Management** | Pinia (3 stores) | Redux Toolkit 2.x (createSlice) |
| **Build Tool** | Vite | Vite |
| **Styling** | LESS (scoped) | LESS (CSS modules) |
| **Package Manager** | npm | Yarn |
| **Unit Tests** | None | Vitest + React Testing Library |
| **E2E Tests** | None | Playwright (Chromium, Firefox, WebKit) |
| **Scope** | Full application (palette editor + TPS file editor) | Partial port (palette editor only, no TPS file editor) |
| **Node.js** | 20.x (CI) | 22.x (CI) |

The React project is explicitly described as "a partial React/TypeScript port" of the Vue app. It currently only implements the colour palette editor section — the Start Menu and TPS File Editor sections are not yet ported.

---

## 2. Deep Dive: tableaucolours-e2e-tests (Vue App)

### 2.1 Architecture

**Entry point:** `src/main.js` → Creates Vue app with Pinia, mounts to `#app`.

**Root component:** `App.vue` — A conditional rendering hub:
- Shows `StartMenu` when neither the palette editor nor TPS file editor is open
- Shows `ColourPaletteEditor` when `paletteStore.isOpen`
- Shows `TpsFileEditor` when `tpsStore.isOpen`
- Uses Vue `<Transition>` components for overlay animations

**State stores (Pinia):**

1. **`palette.js`** — Colour palette state:
   - `name`, `type`, `colours[]`, `isOpen`, `hasChanges`
   - Colour objects: `{ id, hex, isSelected }`
   - Auto-incrementing IDs (`nextColourId`)
   - Max 20 colours enforced
   - Watchers on `name` and `type` with `{ flush: 'sync' }` to ensure `hasChanges` is set synchronously before `open()` resets it — a subtle but important detail

2. **`tpsfile.js`** — TPS file state:
   - `file`, `palettes[]`, `hasChanges`, filtering infrastructure
   - Complex filter system with classes: `NameFilter`, `TypeFilter`, `SelectedFilter`, `HasChangesFilter`
   - `filteredPalettes` computed property chains filters
   - Palette objects: `{ id, name, type, colours[], isCurrent, isSelected, hasChanges, moved }`
   - The `moved` counter is a clever pattern — it's a watchable number that increments on move, triggering scroll-into-view reactivity without tracking the actual position

3. **`image.js`** — Image state:
   - `image`, `scale`, `zoomRange`
   - Simple zoom clamping logic

### 2.2 Component Hierarchy

```
App.vue
├── AppHelp.vue → ColourPaletteHelp.vue, TpsFileHelp.vue
├── StartMenu.vue → TpsFileOpen.vue
├── ColourPaletteEditor.vue
│   ├── ColourPaletteColourList.vue (VueDraggable)
│   │   └── ColourPaletteColourListItem.vue → ColourPicker.vue
│   ├── ColourPaletteTypeSelector.vue → ColourPaletteTypeSelectorItem.vue
│   ├── PalettePreview.vue
│   ├── ImageColourPicker.vue
│   │   ├── ImageZoom.vue
│   │   ├── ImageFileOpen.vue
│   │   └── ImageCanvas.vue → ScalableImage.vue → ImageColourSwatch.vue
│   ├── ModalPanel.vue (Teleported to #modals)
│   │   ├── ColourPaletteGetCode.vue (export)
│   │   ├── ColourPaletteImport.vue (import)
│   │   └── ColourPaletteExtractColours.vue (image extraction)
│   └── (Cancel/Done/Back buttons depending on context)
└── TpsFileEditor.vue
    ├── TpsPaletteList.vue (VueDraggable)
    │   └── TpsPaletteListItem.vue → PalettePreview.vue
    ├── TpsPaletteFilter.vue
    └── TpsPaletteExport.vue
```

### 2.3 Key Utilities

**`TpsParser.js`** — XML parsing for TPS files and individual palettes:
- Uses browser's `DOMParser`
- Validates XML structure: `<workbook>` → `<preferences>` → `<color-palette>`
- Validates colour format with regex: `/^#[0-9a-f]{3}(?:[0-9a-f]{3})?(?:[0-9a-f]{5})?$/i`
- Has commented-out palette type validation (permissive — accepts unknown types)
- Returns structured result objects with `isValid`, `validationMessage`, `palette`/`palettes`

**`TpsWriter.js`** — XML generation:
- Uses `DOMParser` + `XMLSerializer` for TPS file updates
- Removes existing `<color-palette>` elements, appends new ones
- Uses `he` library for HTML entity encoding in palette names
- Generates `<color-palette name="..." type="..."><color>...</color></color-palette>`

### 2.4 Notable Patterns and Intricacies

1. **Keyboard shortcuts** are registered at the `window` level with `keyup`/`keydown` listeners in multiple components, with `event.target.tagName` checks to avoid intercepting input field typing.

2. **The `flush: 'sync'` watcher pattern** in `palette.js` is critical: When `open()` calls `replacePalette()` which sets `name` and `type`, the watchers must fire synchronously so `hasChanges` gets set _before_ `open()` sets it to `false`.

3. **Drag-and-drop** uses `vue-draggable-plus` with a computed setter pattern — the setter is a no-op because the actual move is handled in the `@update` event handler.

4. **Modal management** uses the native `<dialog>` element via a custom `ModalPanel.vue` component that uses `showModal()` and `Teleport` to `#modals`.

5. **Colour extraction** uses ColorThief for palette extraction, then sorts colours using the LCH colour space (via `culori/fn`) with a sophisticated algorithm that separates greys from chromatic colours and sorts by hue bins, luminance bins, then chroma.

6. **Image zoom** has a non-linear slider mapping: 1-50 maps to `[range.min, 1.0]` and 50-100 maps to `[1.0, range.max]`, giving finer control near 100%.

7. **Event bus** (`mitt`) is used only for one thing: triggering the file input click from the ImageCanvas hint message. This is a cross-component communication that doesn't fit the parent-child prop/event pattern.

8. **The colour grid** is laid out as a 4-column × 5-row CSS grid, with items flowing column-first (column calculated as `Math.floor(index / 5) + 1`). Arrow key navigation respects this layout — ArrowDown/Up moves within a column, ArrowLeft/Right moves across columns.

### 2.5 CI/CD Pipeline

- **CI Workflow** (`ci.yml`): On push to master and PRs — lint, build, then on master creates a versioned zip archive and GitHub Release using `softprops/action-gh-release@v2`.
- **Release Workflow** (`release.yml`): Manual dispatch — downloads a specific version's release artifact, deploys to `gentlygently.github.io` via `peaceiris/actions-gh-pages@v4` with a `DEPLOY_TOKEN`.
- **Versioning**: `MAJOR.MINOR` from git tags + `BUILD` from GitHub run number.
- **Legacy deploy**: `deploy.sh` for local deployment to a sibling `gentlygently.github.io` repo.

### 2.6 Example TPS Files

The `examples/` directory contains 8 test files covering:
- `all-valid.tps` — A comprehensive file with 21 palettes across all three types (Radiohead album-themed!)
- `all-valid-additional-preferences.tps` — Valid file with extra preference elements
- `no-palettes.tps` — Valid structure but no palettes
- `no-preferences.tps` — Missing `<preferences>` element
- `no-workbook.tps` — Missing `<workbook>` root element
- `not-xml.tps` — Invalid XML content
- `too-many-colours.tps` — Palette exceeding colour limits
- `unknown-type.tps` — Palette with unrecognized type attribute

---

## 3. Deep Dive: tableaucolours-react (React/TypeScript Port)

### 3.1 Architecture Differences from Vue

The React port translates Vue patterns to React/Redux idioms:

| Vue Pattern | React Equivalent |
|-------------|-----------------|
| Pinia stores with `ref()` + `computed()` | Redux Toolkit `createSlice` with Immer |
| `defineProps` + `defineEmits` | TypeScript interfaces for props, callbacks |
| Scoped `<style lang="less">` | LESS CSS modules (`*.module.less`) |
| `v-model` two-way binding | Controlled components with `onChange` |
| `vue-draggable-plus` | Custom `DragDropContext` with native HTML5 drag events |
| `<Teleport>` for modals | React portals via `createPortal` to `#modals` |
| `mitt` event bus | Redux `EventBus.ts` (still using mitt) |
| Composition API (`setup()`) | React hooks (`useState`, `useSelector`, `useDispatch`) |

### 3.2 State Management

The Redux store has two slices:
1. **`colourPaletteSlice.ts`** — Mirrors `palette.js` with actions like `colourAdded`, `colourRemoved`, `colourMoved`, `paletteReplaced`, etc.
2. **`imageSlice.ts`** — Mirrors `image.js`

Key differences:
- TypeScript interfaces define `Colour`, `ColourPalette`, `ColourPaletteState`
- `createSelector` from Redux Toolkit for derived state (e.g., `selectCanPickColour`)
- `isOpen` defaults to `true` (no Start Menu yet), with a TODO comment about TPS support
- Type validation in `replacePalette` and `paletteTypeChanged` with fallback to default type

### 3.3 Testing Infrastructure

The React project has **two testing layers**:

#### Unit Tests (Vitest)
- Co-located with source files: `Component.test.tsx` alongside `Component.tsx`
- Uses React Testing Library (`@testing-library/react`) for component testing
- Custom `test-utils.tsx` with Redux store provider wrapper
- `jsdom` test environment
- `vitest-canvas-mock` for canvas-dependent tests (ImageColourPickerImage)
- `vitest-mock-extended` for creating typed mocks
- `__mocks__/colorthief.ts` for mocking the ColorThief library

#### E2E Tests (Playwright) — Detailed analysis below

### 3.4 Test ID Convention

Every React component has a companion `*TestIds.ts` file with an enum:
```typescript
enum ColourPaletteEditorTestIds {
  Self = 'ColourPaletteEditor Component',
  TpsBack = 'ColourPaletteEditor Back',
  // ...
}
```

These are used as `data-testid` attributes in components, creating a formal contract between component rendering and test selectors. This is a significant architectural decision that:
- Makes selectors refactoring-safe (rename a CSS class, tests still work)
- Creates a discoverable, greppable inventory of testable elements
- Separates test concerns from visual styling
- Is consistent across all 15 components with test ID files

---

## 4. E2E Testing: Style, Approach, and Depth

### 4.1 Testing Framework & Configuration

**Playwright** with the following configuration (`playwright.config.ts`):

```typescript
{
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  timeout: 10000,  // 10s per test

  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true,
  },

  projects: [chromium, firefox, webkit],

  webServer: {
    command: 'yarn build && yarn preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
}
```

Key design decisions:
- **Tests run against the production build** (`yarn build && yarn preview`), not the dev server — catching production-only issues
- **Cross-browser by default** — 3 browser projects (chromium, firefox, webkit)
- **CI-specific settings**: 2 retries, 1 worker (sequential for stability), no `test.only` allowed
- **Tracing on first retry** — captures network, DOM snapshots for debugging failures
- **Screenshots only on failure** — keeps artifact size manageable
- **Short timeout (10s)** — forces tests to be fast and focused
- **Clipboard permissions** granted for Chromium only (browser API availability)

### 4.2 Test Architecture: Fixtures + Page Object Model

#### Custom Fixture (`e2e/fixtures/base.ts`)

```typescript
export const test = base.extend<ColourPaletteFixtures>({
  colourPaletteEditor: async ({ page }, use) => {
    const colourPaletteEditor = new ColourPaletteEditor(page)
    await colourPaletteEditor.goto()
    await use(colourPaletteEditor)
  },
})
```

This pattern:
- Provides a `colourPaletteEditor` fixture to every test automatically
- Navigates to the app before each test (setup)
- No teardown needed (Playwright handles page lifecycle)
- Type-safe through `ColourPaletteFixtures` interface

#### Page Object Model (`e2e/pages/ColourPaletteEditor.ts`)

The main page object is ~337 lines and provides a rich API:

**Composition pattern** — The `ColourPaletteEditor` composes three modal page objects:
```typescript
class ColourPaletteEditor {
  readonly importModal: ImportModal
  readonly exportModal: ExportModal
  readonly imageExtractorModal: ImageExtractorModal
  // ...
}
```

**Method categories:**

1. **Navigation**: `goto()`
2. **Palette metadata**: `setPaletteName()`, `getPaletteName()`, `setType()`, `getSelectedType()`
3. **Colour management**: `getColourItems()`, `getColourCount()`, `getColours()`, `setColour()`, `clickAddColour()`, `clickRemoveColour()`, `clickColour()`, `selectColour()`, `setColours()`
4. **Selection tracking**: `getSelectedColourIndex()` — with validation that exactly one colour is selected
5. **Keyboard operations**: `addColoursWithKeyboard()`, `focusTypeSelector()`
6. **Image operations**: `uploadImage()`, `clickOpenImageButton()`, `getZoomPercentage()`, `getImageDimensions()`, `getHintText()`
7. **Drag-and-drop**: `dragColour()`
8. **Modal triggers**: `clickImport()`, `clickExport()`, `clickDiscardPalette()`
9. **Getter properties**: `typeSelector`, `typeSelectorList`, `fileInput`, `imageCanvas`, `imageCanvasImage`, etc.

**Notable implementation details:**

- `getColours()` reads actual computed CSS `backgroundColor` values and converts `rgb(r, g, b)` → `#RRGGBB`, verifying what the user actually sees rather than what the state contains
- `setColours()` is a complex multi-step operation: handles dialog confirmation for "delete all", waits for DOM mutations, and adds colours one-by-one with waits between each
- `getSelectedColourIndex()` validates invariants — throws if more than one colour is selected
- `setColour()` involves double-clicking the swatch, waiting for the colour picker modal, clearing the hex input, filling with the new value, and pressing Enter
- `uploadImage()` uses Playwright's `waitForEvent('filechooser')` before clicking the button — correct async event handling pattern

**Modal page objects** are small and focused:
- `ImportModal`: textarea fill, import/cancel buttons, validation message
- `ExportModal`: code container, copy button, close via Escape
- `ImageExtractorModal`: number input, extract/cancel buttons, radio buttons for add/replace

### 4.3 Test Suite Breakdown

The e2e suite contains **8 spec files** covering distinct feature areas:

#### 1. `smoke.spec.ts` (2 tests)
**Purpose:** Verify the app loads successfully.
- Checks page title ("Colours")
- Checks palette name input visibility
- Uses `page.waitForLoadState('networkidle')` — waits for all network activity to settle

#### 2. `palette-editing.spec.ts` (4 tests)
**Purpose:** Core CRUD operations on palette colours.
- Verifies placeholder text on name input
- Tests palette name editing and persistence
- Validates initial state (one white `#FFFFFF` colour)
- Tests adding a new colour (count increases by 1)
- Tests removing a colour (with multi-step: add, set colours, remove, verify remaining)
- Uses `test.step()` for logical grouping within tests

#### 3. `import-export.spec.ts` (11 tests)
**Purpose:** XML import/export round-trip functionality.

Export tests:
- Modal opens on click
- Full XML content verification with exact string matching (name, type, colours)
- Clipboard copy feedback (button text changes to "Copied")
- Parameterized test for all 3 palette types: `[{selectedType, expectedXmlType}].forEach(...)` — verifies the XML `type` attribute matches
- Modal closes (via Escape key)

Import tests:
- Modal opens on click
- Textarea is visible
- Full import round-trip: paste valid XML → click Import → verify name, colours match exactly
- Parameterized test for all 3 palette type imports
- Validation error for invalid XML (button disabled, message visible)
- Cancel closes modal

**Pattern insight:** The parameterized tests use `.forEach()` on an array of test data, not Playwright's built-in parameterization — a pragmatic choice that keeps related tests together.

#### 4. `palette-types.spec.ts` (4 tests)
**Purpose:** Palette type selector UI.
- Default type is "Regular"
- All three types visible in dropdown
- Click-to-switch for Sequential and Diverging
- Clean verification of `getSelectedType()` return value

#### 5. `keyboard-shortcuts.spec.ts` (19 tests)
**Purpose:** Comprehensive keyboard interaction testing. This is the most thorough spec file.

**Color Grid Navigation (7 tests):**
- Standard: ArrowDown, ArrowUp, ArrowRight (column jump by 5), ArrowLeft (column jump by -5)
- Boundary: No-op at top-left (Up, Left), no-op at last item (Down, Right)
- Partial grid: No-op when target position is an empty slot (e.g., column 2 doesn't have enough items)

**Color Reordering (10 tests):**
- Standard: Shift+ArrowDown, Shift+ArrowUp, Shift+ArrowRight, Shift+ArrowLeft
- Each test verifies both the new colour order AND that selection follows the moved colour
- Boundary: Same 5 no-op cases as navigation but with Shift held

**Color Deletion (2 tests):**
- Delete key removes selected colour
- Backspace key removes selected colour

**Type Selector Navigation (3 tests):**
- ArrowDown cycles type forward
- ArrowUp cycles type backward
- Enter toggles dropdown open/closed

**Add Color Shortcut (2 tests):**
- `+` key adds a white colour
- `+` at maximum (20 colours) is a no-op — both count and colours array verified

**Testing depth insight:** The keyboard tests are particularly thorough in testing boundary conditions. The grid layout (4 columns × 5 rows, column-first ordering) makes navigation non-trivial, and every edge case is covered: top-left corner, bottom-right corner, middle positions with empty adjacent slots.

#### 6. `discard-palette.spec.ts` (4 tests)
**Purpose:** Delete-all-colours confirmation flow.
- Confirmation dialog appears with `type === 'confirm'` and message containing "delete"
- Dismissing dialog keeps colours unchanged
- Accepting dialog removes all colours
- Discard button is disabled after all colours removed

**Pattern insight:** Uses `page.waitForEvent('dialog')` with `void colourPaletteEditor.clickDiscardPalette()` (void to avoid awaiting the click which blocks on dialog). Uses `page.once('dialog', ...)` for auto-handling.

#### 7. `drag-drop-reorder.spec.ts` (8 tests)
**Purpose:** Colour drag-and-drop reordering.
- Basic drag: first to third position
- Drop outside list: colours unchanged (cancel)
- Four colours: drag first to third
- Self-drop: no-op
- Dragging disabled when colour picker is open (`draggable="false"`)
- Move to end position
- Multiple consecutive reorders (two sequential drags)
- Middle to start, last to middle

**Testing depth insight:** Tests cover 8 scenarios including edge cases like self-drop and disabled dragging. Each test sets up colours with distinct hex values and verifies the exact post-drag order.

#### 8. `image-features.spec.ts` (14 tests)
**Purpose:** Image upload, colour extraction, zoom, canvas hints, and drag-and-drop of image files.

**Image File Operations (3 tests):**
- File chooser opens on button click
- Image loads and displays (canvas visible, dimensions > 0)
- Extract button enabled after image load (disabled before)

**Image Colour Extraction (4 tests):**
- Extraction modal opens
- Replace mode: initial 3 colours replaced with 5 extracted
- Add mode: 1 initial colour + 5 extracted = 6 colours
- Cancel closes modal without changes

**Image Zoom (5 tests):**
- Zoom slider visible after image load
- Shift+Wheel zoom in (percentage increases, dimensions increase)
- Shift+Wheel zoom out (percentage decreases, dimensions decrease)
- Zoom in button
- Zoom out button
- Slider drag to value "75"

**Canvas Hints (3 tests):**
- Initial hint: "Open, paste or drop an image to get started"
- After image load without colour selected: "Select a colour in the palette..."
- Hint hidden when colour is selected and image loaded

**Drag and Drop (5 tests):**
- Dragenter shows drop target overlay
- Dragleave hides overlay
- Drop loads image (constructs File from base64 buffer, dispatches DragEvent)
- Second drop replaces existing image
- Non-image file dropped is ignored (extract button remains disabled)

**Testing depth insight:** The image drag-and-drop tests are the most technically complex — they construct `DataTransfer` objects, create `File` instances from `fs.readFileSync()` + base64 encoding, and dispatch synthetic `DragEvent`s. This tests browser-native behaviour that can't be simulated through Playwright's higher-level API.

### 4.4 Testing Patterns Summary

| Pattern | Usage |
|---------|-------|
| **Page Object Model** | Central `ColourPaletteEditor` with composed modal objects |
| **Custom Playwright Fixtures** | Auto-setup via `base.extend()` |
| **test.step()** | Logical grouping within multi-step tests |
| **data-testid selectors** | Primary selector strategy (15 TestId files) |
| **title selectors** | Used for action buttons (`button[title="..."]`) |
| **Parameterized tests** | `[...].forEach()` for type variations |
| **Dialog handling** | `page.waitForEvent('dialog')` + `dialog.accept()/dismiss()` |
| **File upload** | `page.waitForEvent('filechooser')` + `fileChooser.setFiles()` |
| **Drag-and-drop** | Both Playwright's `dragTo()` and manual `page.mouse` API |
| **Synthetic events** | `el.dispatchEvent(new DragEvent/WheelEvent())` via `page.evaluate()` |
| **CSS verification** | `getComputedStyle().backgroundColor` → hex conversion |
| **State assertions** | Verify both UI state and data invariants |

### 4.5 What's NOT Tested (E2E)

The React port's e2e tests do NOT cover:
- TPS file editor (not yet ported)
- Start menu / initial landing page
- Colour picker interaction (double-click → pick → verify swatch colour change)
- Image click-to-pick-colour workflow
- Paste image from clipboard
- Browser-specific clipboard API
- Responsive/resize behaviour
- Accessibility (a11y) testing
- Visual regression / screenshot comparison
- Error states (malformed images, network failures)
- Performance / load time assertions
- Colour reversal (R key shortcut)

---

## 5. Cross-Cutting Observations

### 5.1 Component Naming Alignment

Both projects use nearly identical component naming, making the port relationship clear:

| Vue Component | React Component |
|---------------|-----------------|
| `ColourPaletteEditor.vue` | `ColourPaletteEditor.tsx` |
| `ColourPaletteColourList.vue` | `ColourPaletteColourList.tsx` |
| `ColourPaletteColourListItem.vue` | `ColourPaletteColourListItem.tsx` |
| `ColourPaletteTypeSelector.vue` | `ColourPaletteTypeSelector.tsx` |
| `ColourPaletteGetCode.vue` | `ColourPaletteGetCode.tsx` |
| `ColourPaletteImport.vue` | `ColourPaletteImport.tsx` |
| `ColourPaletteExtractColours.vue` | `ImageColourExtractor.tsx` |
| `ImageColourPicker.vue` | `ImageColourPicker.tsx` |
| `ImageCanvas.vue` | `ImageColourPickerImageCanvas.tsx` |
| `ScalableImage.vue` | `ImageColourPickerImage.tsx` |
| `ImageZoom.vue` | `ImageZoom.tsx` |
| `ModalPanel.vue` | `ModalDialog.tsx` |

### 5.2 TPS File Format

The Tableau `.tps` (Tableau Preferences) file format is:
```xml
<?xml version='1.0'?>
<workbook>
  <preferences>
    <color-palette name="Palette Name" type="regular|ordered-sequential|ordered-diverging">
      <color>#RRGGBB</color>
      <!-- more colours -->
    </color-palette>
    <!-- more palettes -->
  </preferences>
</workbook>
```

The parser validates:
- Valid XML
- Root element is `<workbook>`
- Contains `<preferences>` child
- Each `<color-palette>` has valid `name` and `type` attributes
- Colours match `#` + 3, 6, or 8 hex digits (supports shorthand and alpha)

### 5.3 Colour Science

The colour extraction workflow (both Vue and React) uses:
1. **ColorThief** — Quantizes image colours using a modified median-cut algorithm
2. **culori** (LCH colour space) — Sorts extracted colours perceptually:
   - Greys (chroma < 4.1) sorted to end
   - Chromatic colours sorted by hue bins (20° increments), then luminance bins (15 increments), then chroma

### 5.4 Feature Parity Gaps

The React port is missing several Vue features:
- Entire TPS File Editor (StartMenu, TpsFileEditor, TpsPaletteList, TpsPaletteFilter, TpsPaletteExport, TpsFileOpen, TpsFileErrors, TpsPaletteListItem)
- AppHelp system (ColourPaletteHelp, TpsFileHelp)
- The `isOpen: true` default in Redux vs `isOpen: false` in Pinia (React always shows editor)
- File save via File System Access API
- Download fallback for save
- Header with app branding

### 5.5 Quality and Tooling

Both projects share:
- Prettier for formatting
- ESLint with framework-specific plugins
- Husky + lint-staged for pre-commit hooks
- LESS for styling with shared variable patterns
- Vite for building

The React project additionally has:
- TypeScript strict mode
- Vitest for unit testing (no unit tests in Vue project)
- Playwright for E2E testing (no E2E tests in Vue project)
- `data-testid` infrastructure for stable test selectors

---

## 6. Key Findings and Recommendations for E2E Test Development

### 6.1 E2E Test Style Characteristics

The React project's E2E tests exhibit these qualities:
1. **Feature-organized** — One spec file per feature area, not per component
2. **User-centric** — Tests simulate real user workflows (click, type, drag, verify visible output)
3. **Boundary-aware** — Explicit tests for edge cases (max colours, empty palette, self-drop)
4. **State-verified** — Tests check both visual output AND data invariants (colour order, selection state)
5. **Cross-browser** — All tests run on 3 browsers
6. **Fast-focused** — 10s timeout keeps tests lean
7. **Production-realistic** — Runs against production build, not dev server

### 6.2 Test Data Strategy

- Distinct hex colours (`#FF0000`, `#00FF00`, `#0000FF`) make assertion failures immediately readable
- Test image (`sample.png`) is a real PNG file in `e2e/fixtures/test-images/`
- XML test data is inline in test files (not external fixtures) for readability
- Dialog message assertions use `toContain()` not exact match (resilient to wording changes)

### 6.3 Architectural Strengths

1. The **TestIds enum pattern** creates a single source of truth for selectors shared between component code and page objects
2. The **composed page object** pattern (ColourPaletteEditor → ImportModal, ExportModal, ImageExtractorModal) mirrors the UI hierarchy naturally
3. The **fixture-based setup** ensures consistent starting state without boilerplate
4. Using **`test.step()`** for multi-phase tests provides clear failure diagnostics without splitting into overly granular test functions
