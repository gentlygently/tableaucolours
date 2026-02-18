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

// Helper fixture that opens TPS file
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

tpsTest.describe('TPS Palette Export', () => {
  tpsTest(
    'should open export panel',
    async ({ tpsEditor }) => {
      await tpsEditor.clickExport()
      await expect(tpsEditor.exportFileName).toBeVisible()
      await expect(tpsEditor.exportSaveButton).toBeVisible()
    },
  )

  tpsTest(
    'should disable export button when no filename entered',
    async ({ tpsEditor }) => {
      await tpsEditor.clickExport()
      await expect(tpsEditor.exportSaveButton).toBeDisabled()
    },
  )

  tpsTest(
    'should disable export button when no palettes selected',
    async ({ tpsEditor }) => {
      await tpsEditor.clickExport()
      await tpsEditor.exportFileName.fill('export-test')
      // No palettes selected — button should still be disabled
      await expect(tpsEditor.exportSaveButton).toBeDisabled()
    },
  )

  tpsTest(
    'should enable export button when filename entered and palettes selected',
    async ({ tpsEditor }) => {
      // Select some palettes
      await tpsEditor.togglePaletteCheckbox(0)

      await tpsEditor.clickExport()
      await tpsEditor.exportFileName.fill('export-test')

      await expect(tpsEditor.exportSaveButton).toBeEnabled()
    },
  )
})
