import { test, expect } from '../../fixtures/base'
import { createTpsFile } from '../../fixtures/tps-builder.js'

test.describe('TPS Palette Filter', () => {
  test(
    'should open and close filter panel',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 2)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await tpsEditor.clickFilter()
      await expect(tpsEditor.filterNameInput).toBeVisible()

      await tpsEditor.clickFilter()
      await expect(tpsEditor.filterNameInput).not.toBeVisible()
    },
  )

  test(
    'should filter palettes by name',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, [
        { name: 'Sunset Warm' },
        { name: 'Ocean Blue' },
        { name: 'Forest Green' },
      ])
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await tpsEditor.clickFilter()
      await tpsEditor.filterNameInput.fill('Ocean')

      const count = await tpsEditor.getPaletteCount()
      expect(count).toBe(1)

      await expect(tpsEditor.paletteCount).toContainText('showing 1')
    },
  )

  test(
    'should show all palettes when filter is cleared',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, [
        { name: 'Sunset Warm' },
        { name: 'Ocean Blue' },
        { name: 'Forest Green' },
      ])
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await tpsEditor.clickFilter()
      await tpsEditor.filterNameInput.fill('Ocean')
      expect(await tpsEditor.getPaletteCount()).toBe(1)

      await tpsEditor.filterNameInput.clear()
      expect(await tpsEditor.getPaletteCount()).toBe(tpsFile.palettes.length)
    },
  )

  test(
    'should filter by selected palettes only',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 4)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      // Select first two palettes
      await tpsEditor.togglePaletteCheckbox(0)
      await tpsEditor.togglePaletteCheckbox(1)

      // Open filter and check "Only selected"
      await tpsEditor.clickFilter()
      await page.getByText('Only selected').click()

      const count = await tpsEditor.getPaletteCount()
      expect(count).toBe(2)
    },
  )

  test(
    'should filter by modified palettes only',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 3)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

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

  test(
    'should combine name and selected filters',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, [
        { name: 'Sunset Warm' },
        { name: 'Ocean Blue' },
        { name: 'Forest Green' },
      ])
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      // Select first palette
      await tpsEditor.togglePaletteCheckbox(0)

      // Open filter, filter by name and selected
      await tpsEditor.clickFilter()
      await tpsEditor.filterNameInput.fill(tpsFile.palettes[0].name)
      await page.getByText('Only selected').click()

      const count = await tpsEditor.getPaletteCount()
      expect(count).toBe(1)
    },
  )
})
