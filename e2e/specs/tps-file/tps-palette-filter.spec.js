import { test, expect } from '../../fixtures/base'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const tpsFilePath = join(
  __dirname,
  '..',
  '..',
  'fixtures',
  'test-files',
  'all-valid.tps',
)

// Helper fixture that opens TPS file and navigates to editor
const tpsTest = test.extend({
  tpsEditor: async ({ page }, use) => {
    const { StartMenu } = await import('../../pages/StartMenu.js')
    const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
    const startMenu = new StartMenu(page)
    await startMenu.goto()
    await startMenu.openTpsFile(tpsFilePath)
    const tpsEditor = new TpsFileEditor(page)
    await expect(tpsEditor.component).toBeVisible()
    await use(tpsEditor)
  },
})

tpsTest.describe('TPS Palette Filter', () => {
  tpsTest(
    'should open and close filter panel',
    async ({ tpsEditor }) => {
      await tpsEditor.clickFilter()
      await expect(tpsEditor.filterNameInput).toBeVisible()

      await tpsEditor.clickFilter()
      await expect(tpsEditor.filterNameInput).not.toBeVisible()
    },
  )

  tpsTest(
    'should filter palettes by name',
    async ({ tpsEditor }) => {
      await tpsEditor.clickFilter()
      await tpsEditor.filterNameInput.fill('Pablo')

      const count = await tpsEditor.getPaletteCount()
      expect(count).toBe(1)

      await expect(tpsEditor.paletteCount).toContainText('showing 1')
    },
  )

  tpsTest(
    'should show all palettes when filter is cleared',
    async ({ tpsEditor }) => {
      await tpsEditor.clickFilter()
      await tpsEditor.filterNameInput.fill('Pablo')
      expect(await tpsEditor.getPaletteCount()).toBe(1)

      await tpsEditor.filterNameInput.clear()
      expect(await tpsEditor.getPaletteCount()).toBe(20)
    },
  )

  tpsTest(
    'should filter by selected palettes only',
    async ({ tpsEditor }) => {
      // Select first two palettes
      await tpsEditor.togglePaletteCheckbox(0)
      await tpsEditor.togglePaletteCheckbox(1)

      // Open filter and check "Only selected"
      await tpsEditor.clickFilter()
      await tpsEditor.page.getByText('Only selected').click()

      const count = await tpsEditor.getPaletteCount()
      expect(count).toBe(2)
    },
  )

  tpsTest(
    'should filter by modified palettes only',
    async ({ tpsEditor, page }) => {
      // Modify a palette by double-clicking to edit, changing name, then saving
      await tpsEditor.doubleClickPalette(0)
      await expect(
        page.getByTestId('ColourPaletteEditor Component'),
      ).toBeVisible()
      const nameInput = page.locator('input#name')
      await nameInput.clear()
      await nameInput.fill('Modified Palette')
      // In TPS mode, "Done" saves the palette changes
      await page.locator('button.button:has-text("Done")').click()

      await expect(tpsEditor.component).toBeVisible()

      // Open filter and check "Only modified"
      await tpsEditor.clickFilter()
      await page.getByText('Only modified').click()

      const count = await tpsEditor.getPaletteCount()
      expect(count).toBe(1)
    },
  )

  tpsTest(
    'should combine name and selected filters',
    async ({ tpsEditor }) => {
      // Select first palette (Pablo Honey)
      await tpsEditor.togglePaletteCheckbox(0)

      // Open filter, filter by name and selected
      await tpsEditor.clickFilter()
      await tpsEditor.filterNameInput.fill('Pablo')
      await tpsEditor.page.getByText('Only selected').click()

      const count = await tpsEditor.getPaletteCount()
      expect(count).toBe(1)
    },
  )
})
