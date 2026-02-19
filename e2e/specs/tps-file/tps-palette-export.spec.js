import { test, expect } from '../../fixtures/base'
import { createTpsFile } from '../../fixtures/tps-builder.js'

test.describe('TPS Palette Export', () => {
  test(
    'should open export panel',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 2)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await tpsEditor.clickExport()
      await expect(tpsEditor.exportFileName).toBeVisible()
      await expect(tpsEditor.exportSaveButton).toBeVisible()
    },
  )

  test(
    'should disable export button when no filename entered',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 2)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await tpsEditor.clickExport()
      await expect(tpsEditor.exportSaveButton).toBeDisabled()
    },
  )

  test(
    'should disable export button when no palettes selected',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 2)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await tpsEditor.clickExport()
      await tpsEditor.exportFileName.fill('export-test')
      // No palettes selected — button should still be disabled
      await expect(tpsEditor.exportSaveButton).toBeDisabled()
    },
  )

  test(
    'should enable export button when filename entered and palettes selected',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 2)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await tpsEditor.togglePaletteCheckbox(0)
      await tpsEditor.clickExport()
      await tpsEditor.exportFileName.fill('export-test')

      await expect(tpsEditor.exportSaveButton).toBeEnabled()
    },
  )
})
