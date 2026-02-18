import { test, expect } from '../fixtures/base.js'
import { ColourPaletteEditorTestIds } from '../../src/test-ids/ColourPaletteEditorTestIds.js'
import { TpsFileEditorTestIds } from '../../src/test-ids/TpsFileEditorTestIds.js'
import { AppHelpTestIds } from '../../src/test-ids/AppHelpTestIds.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

test.describe('Start Menu', () => {
  test('should navigate to palette editor when clicking Create a template', async ({
    page,
    startMenu,
  }) => {
    await startMenu.clickCreateTemplate()
    await expect(page.getByTestId(ColourPaletteEditorTestIds.Self)).toBeVisible()
    await expect(startMenu.component).not.toBeVisible()
  })

  test('should navigate to TPS file editor when opening a file', async ({
    page,
    startMenu,
  }) => {
    const tpsFilePath = join(__dirname, '..', 'fixtures', 'test-files', 'all-valid.tps')
    await startMenu.openTpsFile(tpsFilePath)
    await expect(page.getByTestId(TpsFileEditorTestIds.Self)).toBeVisible()
    await expect(startMenu.component).not.toBeVisible()
  })

  test('should not show help button on start menu', async ({ page, startMenu }) => {
    await expect(page.getByTestId(AppHelpTestIds.Button)).not.toBeVisible()
  })

  test('should show help button after navigating to palette editor', async ({
    page,
    startMenu,
  }) => {
    await startMenu.clickCreateTemplate()
    await expect(page.getByTestId(AppHelpTestIds.Button)).toBeVisible()
  })
})
