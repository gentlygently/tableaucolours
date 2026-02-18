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

// Helper fixture that opens the TPS file before each test
const tpsTest = test.extend({
  openTpsFile: async ({ startMenu, page }, use) => {
    const { StartMenu } = await import('../../pages/StartMenu.js')
    const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
    const startMenuPO = new StartMenu(page)
    await startMenuPO.openTpsFile(tpsFilePath)
    const tpsEditor = new TpsFileEditor(page)
    await expect(tpsEditor.component).toBeVisible()
    await use(tpsEditor)
  },
})

tpsTest.describe('TPS Palette List', () => {
  tpsTest(
    'should make first palette current by default',
    async ({ openTpsFile: tpsEditor }) => {
      const items = await tpsEditor.getPaletteItems()
      await expect(items[0]).toHaveClass(/palette--current/)
    },
  )

  tpsTest(
    'should select and deselect palette with checkbox',
    async ({ openTpsFile: tpsEditor }) => {
      await tpsTest.step('select palette', async () => {
        await tpsEditor.togglePaletteCheckbox(0)
        const items = await tpsEditor.getPaletteItems()
        const checkbox = items[0].getByTestId('TpsPaletteListItem Checkbox')
        await expect(checkbox).toBeChecked()
      })

      await tpsTest.step('deselect palette', async () => {
        await tpsEditor.togglePaletteCheckbox(0)
        const items = await tpsEditor.getPaletteItems()
        const checkbox = items[0].getByTestId('TpsPaletteListItem Checkbox')
        await expect(checkbox).not.toBeChecked()
      })
    },
  )

  tpsTest(
    'should open palette editor on double-click',
    async ({ openTpsFile: tpsEditor, page }) => {
      await tpsEditor.doubleClickPalette(0)
      await expect(
        page.getByTestId('ColourPaletteEditor Component'),
      ).toBeVisible()
    },
  )

  tpsTest(
    'should clone a palette and open editor with copy name',
    async ({ openTpsFile: tpsEditor, page }) => {
      // Cloning opens the palette editor with the cloned palette
      await tpsEditor.clickClonePalette(0)
      await expect(
        page.getByTestId('ColourPaletteEditor Component'),
      ).toBeVisible()

      // Name should have "(Copy)" suffix
      const nameInput = page.locator('input#name')
      await expect(nameInput).toHaveValue('Pablo Honey (Copy)')
    },
  )

  tpsTest(
    'should delete a palette with confirmation',
    async ({ openTpsFile: tpsEditor, page }) => {
      const initialCount = await tpsEditor.getPaletteCount()

      // Select palette first, then delete
      await tpsEditor.togglePaletteCheckbox(0)
      page.once('dialog', (dialog) => dialog.accept())
      await tpsEditor.deleteSelectedButton.click()

      const newCount = await tpsEditor.getPaletteCount()
      expect(newCount).toBe(initialCount - 1)
    },
  )

  tpsTest(
    'should select all palettes',
    async ({ openTpsFile: tpsEditor }) => {
      await tpsEditor.clickSelectAll()

      const items = await tpsEditor.getPaletteItems()
      for (const item of items) {
        const checkbox = item.getByTestId('TpsPaletteListItem Checkbox')
        await expect(checkbox).toBeChecked()
      }
    },
  )

  tpsTest(
    'should clear all palette selections',
    async ({ openTpsFile: tpsEditor }) => {
      await tpsEditor.clickSelectAll()
      await tpsEditor.clickClearSelection()

      const items = await tpsEditor.getPaletteItems()
      for (const item of items) {
        const checkbox = item.getByTestId('TpsPaletteListItem Checkbox')
        await expect(checkbox).not.toBeChecked()
      }
    },
  )

  tpsTest(
    'should update palette count when selecting palettes',
    async ({ openTpsFile: tpsEditor }) => {
      await tpsEditor.togglePaletteCheckbox(0)
      await tpsEditor.togglePaletteCheckbox(1)

      await expect(tpsEditor.paletteCount).toContainText('2 selected')
    },
  )
})
