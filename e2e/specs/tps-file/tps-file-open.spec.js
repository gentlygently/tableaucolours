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

test.describe('TPS File Open', () => {
  test('should open a TPS file from the start menu', async ({
    startMenu,
    page,
  }) => {
    await startMenu.openTpsFile(tpsFilePath)
    await expect(page.getByTestId('TpsFileEditor Component')).toBeVisible()
  })

  test('should display the filename', async ({ startMenu, page }) => {
    await startMenu.openTpsFile(tpsFilePath)
    const fileName = page.getByTestId('TpsFileEditor FileName')
    await expect(fileName).toContainText('all-valid.tps')
  })

  test('should display all palettes from the file', async ({
    startMenu,
    page,
  }) => {
    await startMenu.openTpsFile(tpsFilePath)
    const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
    const tpsEditor = new TpsFileEditor(page)
    await expect(tpsEditor.component).toBeVisible()
    await expect(tpsEditor.paletteCount).toBeVisible()

    const count = await tpsEditor.getPaletteCount()
    expect(count).toBe(20)
  })

  test('should display palette count summary', async ({
    startMenu,
    page,
  }) => {
    await startMenu.openTpsFile(tpsFilePath)
    const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
    const tpsEditor = new TpsFileEditor(page)

    await expect(tpsEditor.paletteCount).toContainText('20 colour palettes')
  })

  test('should hide the start menu after opening a file', async ({
    startMenu,
  }) => {
    await startMenu.openTpsFile(tpsFilePath)
    await expect(startMenu.component).not.toBeVisible()
  })
})
