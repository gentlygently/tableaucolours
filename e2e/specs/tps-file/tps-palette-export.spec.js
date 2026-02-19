import { test, expect } from '../../fixtures/base'

test.describe('TPS Palette Export', () => {
  test('should open export panel', async ({ tpsFileEditor }) => {
    await tpsFileEditor.clickExport()
    await expect(tpsFileEditor.exportFileName).toBeVisible()
    await expect(tpsFileEditor.exportSaveButton).toBeVisible()
  })

  test('should disable export button when no filename entered', async ({
    tpsFileEditor,
  }) => {
    await tpsFileEditor.clickExport()
    await expect(tpsFileEditor.exportSaveButton).toBeDisabled()
  })

  test('should disable export button when no palettes selected', async ({
    tpsFileEditor,
  }) => {
    await tpsFileEditor.clickExport()
    await tpsFileEditor.exportFileName.fill('export-test')
    // No palettes selected — button should still be disabled
    await expect(tpsFileEditor.exportSaveButton).toBeDisabled()
  })

  test('should enable export button when filename entered and palettes selected', async ({
    tpsFileEditor,
  }) => {
    await tpsFileEditor.togglePaletteCheckbox(0)
    await tpsFileEditor.clickExport()
    await tpsFileEditor.exportFileName.fill('export-test')
    await expect(tpsFileEditor.exportSaveButton).toBeEnabled()
  })
})
