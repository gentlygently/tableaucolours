import { test, expect } from '../fixtures/base'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const tpsFilePath = join(
  __dirname,
  '..',
  'fixtures',
  'test-files',
  'all-valid.tps',
)

test.describe('Help', () => {
  test('should not show help button on start menu', async ({
    startMenu,
    page,
  }) => {
    await expect(page.getByTestId('AppHelp Button')).not.toBeVisible()
  })

  test('should show help button in palette editor', async ({
    colourPaletteEditor,
    page,
  }) => {
    await expect(page.getByTestId('AppHelp Button')).toBeVisible()
  })

  test('should open and close help modal in palette editor', async ({
    colourPaletteEditor,
    page,
  }) => {
    await page.getByTestId('AppHelp Button').click()
    await expect(page.getByTestId('AppHelp Content')).toBeVisible()

    // Close modal by pressing Escape
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('AppHelp Content')).not.toBeVisible()
  })

  test('should show palette help content when in palette editor', async ({
    colourPaletteEditor,
    page,
  }) => {
    await page.getByTestId('AppHelp Button').click()
    const content = page.getByTestId('AppHelp Content')
    await expect(content).toBeVisible()
    await expect(content).toContainText('Adding colours')
    await expect(content).toContainText('Importing a palette')
  })

  test('should show TPS help content when in TPS editor', async ({
    startMenu,
    page,
  }) => {
    await startMenu.openTpsFile(tpsFilePath)
    await expect(page.getByTestId('TpsFileEditor Component')).toBeVisible()

    await page.getByTestId('AppHelp Button').click()
    const content = page.getByTestId('AppHelp Content')
    await expect(content).toBeVisible()
    await expect(content).toContainText('Adding a palette')
    await expect(content).toContainText('Filtering palettes')
  })
})
