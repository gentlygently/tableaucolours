import { test, expect } from '../../fixtures/base'
import { createTpsFile } from '../../fixtures/tps-builder.js'

test.describe('TPS Keyboard Shortcuts', () => {
  test(
    'should navigate down with ArrowDown',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 4)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      expect(await tpsEditor.getCurrentPaletteIndex()).toBe(0)

      await page.locator('header').click()
      await page.keyboard.press('ArrowDown')
      expect(await tpsEditor.getCurrentPaletteIndex()).toBe(1)
    },
  )

  test(
    'should navigate up with ArrowUp',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 4)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await page.locator('header').click()
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('ArrowDown')
      expect(await tpsEditor.getCurrentPaletteIndex()).toBe(2)

      await page.keyboard.press('ArrowUp')
      expect(await tpsEditor.getCurrentPaletteIndex()).toBe(1)
    },
  )

  test(
    'should not navigate above first palette',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 4)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await page.locator('header').click()
      await page.keyboard.press('ArrowUp')
      expect(await tpsEditor.getCurrentPaletteIndex()).toBe(0)
    },
  )

  test(
    'should add palette with + key',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 3)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await page.locator('header').click()
      await page.keyboard.press('+')

      await expect(
        page.getByTestId('ColourPaletteEditor Component'),
      ).toBeVisible()
    },
  )

  test(
    'should open palette editor with Enter key',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 3)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await page.locator('header').click()
      await page.keyboard.press('Enter')

      await expect(
        page.getByTestId('ColourPaletteEditor Component'),
      ).toBeVisible()
    },
  )

  test(
    'should delete current palette with Delete key',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, 4)
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      const initialCount = await tpsEditor.getPaletteCount()
      await page.locator('header').click()

      page.once('dialog', (dialog) => dialog.accept())
      await page.keyboard.press('Delete')

      const newCount = await tpsEditor.getPaletteCount()
      expect(newCount).toBe(initialCount - 1)
    },
  )

  test(
    'should move palette down with Shift+ArrowDown',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, [
        { name: 'First' },
        { name: 'Second' },
        { name: 'Third' },
      ])
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      expect(await tpsEditor.getCurrentPaletteIndex()).toBe(0)
      await page.locator('header').click()

      await page.keyboard.press('Shift+ArrowDown')

      // First palette should have moved to index 1
      const itemsAfter = await tpsEditor.getPaletteItems()
      const secondNameAfter = await itemsAfter[1].locator('.name').textContent()
      expect(secondNameAfter?.trim()).toBe(tpsFile.palettes[0].name)
      expect(await tpsEditor.getCurrentPaletteIndex()).toBe(1)
    },
  )

  test(
    'should move palette up with Shift+ArrowUp',
    async ({ startMenu, page }, testInfo) => {
      const tpsFile = createTpsFile(testInfo, [
        { name: 'First' },
        { name: 'Second' },
        { name: 'Third' },
      ])
      await startMenu.openTpsFile(tpsFile.path)
      const { TpsFileEditor } = await import('../../pages/TpsFileEditor.js')
      const tpsEditor = new TpsFileEditor(page)
      await expect(tpsEditor.component).toBeVisible()

      await page.locator('header').click()

      // Navigate to second palette
      await page.keyboard.press('ArrowDown')
      expect(await tpsEditor.getCurrentPaletteIndex()).toBe(1)

      const items = await tpsEditor.getPaletteItems()
      const secondName = await items[1].locator('.name').textContent()

      await page.keyboard.press('Shift+ArrowUp')

      // Second palette should have moved to index 0
      const itemsAfter = await tpsEditor.getPaletteItems()
      const firstNameAfter = await itemsAfter[0].locator('.name').textContent()
      expect(firstNameAfter?.trim()).toBe(secondName?.trim())
      expect(await tpsEditor.getCurrentPaletteIndex()).toBe(0)
    },
  )
})
