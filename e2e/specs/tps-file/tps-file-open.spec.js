import { test, expect } from '../../fixtures/base'
import { createTpsFile } from '../../fixtures/tps-builder.js'

test.describe('TPS File Open', () => {
  test('should open a TPS file from the start menu', async ({
    startMenu,
    page,
  }, testInfo) => {
    const tpsFile = createTpsFile(testInfo, 1)
    await startMenu.openTpsFile(tpsFile.path)
    await expect(page.getByTestId('TpsFileEditor Component')).toBeVisible()
  })

  test('should display the filename', async ({ startMenu, page }, testInfo) => {
    const tpsFile = createTpsFile(testInfo, 1)
    await startMenu.openTpsFile(tpsFile.path)
    const fileName = page.getByTestId('TpsFileEditor FileName')
    await expect(fileName).toContainText('test.tps')
  })

  test('should display all palettes from the file', async ({
    startMenu,
    page,
  }, testInfo) => {
    const tpsFile = createTpsFile(testInfo, 5)
    await startMenu.openTpsFile(tpsFile.path)
    const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
    const tpsEditor = new TpsFileEditor(page)
    await expect(tpsEditor.component).toBeVisible()
    await expect(tpsEditor.paletteCount).toBeVisible()

    const count = await tpsEditor.getPaletteCount()
    expect(count).toBe(tpsFile.palettes.length)
  })

  test('should display palette count summary', async ({
    startMenu,
    page,
  }, testInfo) => {
    const tpsFile = createTpsFile(testInfo, 5)
    await startMenu.openTpsFile(tpsFile.path)
    const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
    const tpsEditor = new TpsFileEditor(page)

    await expect(tpsEditor.paletteCount).toContainText(
      `${tpsFile.palettes.length} colour palettes`,
    )
  })

  test('should hide the start menu after opening a file', async ({
    startMenu,
  }, testInfo) => {
    const tpsFile = createTpsFile(testInfo, 1)
    await startMenu.openTpsFile(tpsFile.path)
    await expect(startMenu.component).not.toBeVisible()
  })
})
