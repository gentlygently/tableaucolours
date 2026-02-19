import { test, expect } from '../../fixtures/base'
import { createTpsFile } from '../../fixtures/tps-builder.js'

test.describe('TPS Palette List', () => {
  test(
    'should make first palette current by default',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 3)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      expect(await tpsEditor.getCurrentPaletteIndex()).toBe(0)
    },
  )

  test(
    'should select and deselect palette with checkbox',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 3)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await test.step('select palette', async () => {
        await tpsEditor.togglePaletteCheckbox(0)
        const items = await tpsEditor.getPaletteItems()
        const checkbox = items[0].getByTestId('TpsPaletteListItem Checkbox')
        await expect(checkbox).toBeChecked()
      })

      await test.step('deselect palette', async () => {
        await tpsEditor.togglePaletteCheckbox(0)
        const items = await tpsEditor.getPaletteItems()
        const checkbox = items[0].getByTestId('TpsPaletteListItem Checkbox')
        await expect(checkbox).not.toBeChecked()
      })
    },
  )

  test(
    'should open palette editor on double-click',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 3)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await tpsEditor.doubleClickPalette(0)
      await expect(
        page.getByTestId('ColourPaletteEditor Component'),
      ).toBeVisible()
    },
  )

  test(
    'should clone a palette and open editor with copy name',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, [
        { name: 'Sunset Warm' },
        { name: 'Ocean Blue' },
      ])
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await tpsEditor.clickClonePalette(0)
      await expect(
        page.getByTestId('ColourPaletteEditor Component'),
      ).toBeVisible()

      const nameInput = page.locator('input#name')
      await expect(nameInput).toHaveValue(
        `${tpsFile.palettes[0].name} (Copy)`,
      )
    },
  )

  test(
    'should delete a palette with confirmation',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 4)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await tpsEditor.togglePaletteCheckbox(0)
      page.once('dialog', (dialog) => dialog.accept())
      await tpsEditor.deleteSelectedButton.click()

      const newCount = await tpsEditor.getPaletteCount()
      expect(newCount).toBe(tpsFile.palettes.length - 1)
    },
  )

  test(
    'should select all palettes',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 3)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await tpsEditor.clickSelectAll()

      const items = await tpsEditor.getPaletteItems()
      for (const item of items) {
        const checkbox = item.getByTestId('TpsPaletteListItem Checkbox')
        await expect(checkbox).toBeChecked()
      }
    },
  )

  test(
    'should clear all palette selections',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 3)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await tpsEditor.clickSelectAll()
      await tpsEditor.clickClearSelection()

      const items = await tpsEditor.getPaletteItems()
      for (const item of items) {
        const checkbox = item.getByTestId('TpsPaletteListItem Checkbox')
        await expect(checkbox).not.toBeChecked()
      }
    },
  )

  test(
    'should update palette count when selecting palettes',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 3)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await tpsEditor.togglePaletteCheckbox(0)
      await tpsEditor.togglePaletteCheckbox(1)

      await expect(tpsEditor.paletteCount).toContainText('2 selected')
    },
  )
})
