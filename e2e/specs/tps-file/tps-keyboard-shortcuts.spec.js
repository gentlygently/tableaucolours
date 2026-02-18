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
  tpsEditor: async ({ startMenu, page }, use) => {
    const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
    await startMenu.openTpsFile(tpsFilePath)
    const tpsEditor = new TpsFileEditor(page)
    await expect(tpsEditor.component).toBeVisible()
    await use(tpsEditor)
  },
})

tpsTest.describe('TPS Keyboard Shortcuts', () => {
  tpsTest(
    'should navigate down with ArrowDown',
    async ({ tpsEditor, page }) => {
      // Wait for first palette to be marked as current
      await expect(
        page.getByTestId('TpsPaletteListItem Component').first(),
      ).toHaveClass(/palette--current/)

      await page.locator('header').click()
      await page.keyboard.press('ArrowDown')

      const itemsAfter = await tpsEditor.getPaletteItems()
      await expect(itemsAfter[1]).toHaveClass(/palette--current/)
      await expect(itemsAfter[0]).not.toHaveClass(/palette--current/)
    },
  )

  tpsTest(
    'should navigate up with ArrowUp',
    async ({ tpsEditor, page }) => {
      await expect(
        page.getByTestId('TpsPaletteListItem Component').first(),
      ).toHaveClass(/palette--current/)

      await page.locator('header').click()
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('ArrowDown')

      await expect(
        page.getByTestId('TpsPaletteListItem Component').nth(2),
      ).toHaveClass(/palette--current/)

      await page.keyboard.press('ArrowUp')

      const itemsAfter = await tpsEditor.getPaletteItems()
      await expect(itemsAfter[1]).toHaveClass(/palette--current/)
    },
  )

  tpsTest(
    'should not navigate above first palette',
    async ({ tpsEditor, page }) => {
      await expect(
        page.getByTestId('TpsPaletteListItem Component').first(),
      ).toHaveClass(/palette--current/)

      await page.locator('header').click()
      await page.keyboard.press('ArrowUp')

      const itemsAfter = await tpsEditor.getPaletteItems()
      await expect(itemsAfter[0]).toHaveClass(/palette--current/)
    },
  )

  tpsTest(
    'should add palette with + key',
    async ({ tpsEditor, page }) => {
      await page.locator('header').click()
      await page.keyboard.press('+')

      // Adding opens the palette editor
      await expect(
        page.getByTestId('ColourPaletteEditor Component'),
      ).toBeVisible()
    },
  )

  tpsTest(
    'should open palette editor with Enter key',
    async ({ tpsEditor, page }) => {
      await page.locator('header').click()
      await page.keyboard.press('Enter')

      await expect(
        page.getByTestId('ColourPaletteEditor Component'),
      ).toBeVisible()
    },
  )

  tpsTest(
    'should delete current palette with Delete key',
    async ({ tpsEditor, page }) => {
      const initialCount = await tpsEditor.getPaletteCount()
      await page.locator('header').click()

      page.once('dialog', (dialog) => dialog.accept())
      await page.keyboard.press('Delete')

      const newCount = await tpsEditor.getPaletteCount()
      expect(newCount).toBe(initialCount - 1)
    },
  )

  tpsTest(
    'should move palette down with Shift+ArrowDown',
    async ({ tpsEditor, page }) => {
      await expect(
        page.getByTestId('TpsPaletteListItem Component').first(),
      ).toHaveClass(/palette--current/)

      await page.locator('header').click()

      const itemsBefore = await tpsEditor.getPaletteItems()
      const firstName = await itemsBefore[0].locator('.name').textContent()

      await page.keyboard.press('Shift+ArrowDown')

      // The first palette should have moved to index 1
      const itemsAfter = await tpsEditor.getPaletteItems()
      const secondNameAfter = await itemsAfter[1].locator('.name').textContent()
      expect(secondNameAfter?.trim()).toBe(firstName?.trim())
      await expect(itemsAfter[1]).toHaveClass(/palette--current/)
    },
  )

  tpsTest(
    'should move palette up with Shift+ArrowUp',
    async ({ tpsEditor, page }) => {
      await expect(
        page.getByTestId('TpsPaletteListItem Component').first(),
      ).toHaveClass(/palette--current/)

      await page.locator('header').click()

      // Navigate to second palette first
      await page.keyboard.press('ArrowDown')
      await expect(
        page.getByTestId('TpsPaletteListItem Component').nth(1),
      ).toHaveClass(/palette--current/)

      const items = await tpsEditor.getPaletteItems()
      const secondName = await items[1].locator('.name').textContent()

      await page.keyboard.press('Shift+ArrowUp')

      // The second palette should have moved to index 0
      const itemsAfter = await tpsEditor.getPaletteItems()
      const firstNameAfter = await itemsAfter[0].locator('.name').textContent()
      expect(firstNameAfter?.trim()).toBe(secondName?.trim())
      await expect(itemsAfter[0]).toHaveClass(/palette--current/)
    },
  )
})
