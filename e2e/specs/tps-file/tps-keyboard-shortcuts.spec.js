import { test, expect } from '../../fixtures/base'

test.describe('TPS Keyboard Shortcuts', () => {
  test('should navigate down with ArrowDown', async ({ tpsFileEditor, page }) => {
    expect(await tpsFileEditor.getCurrentPaletteIndex()).toBe(0)

    await page.locator('header').click()
    await page.keyboard.press('ArrowDown')
    expect(await tpsFileEditor.getCurrentPaletteIndex()).toBe(1)
  })

  test('should navigate up with ArrowUp', async ({ tpsFileEditor, page }) => {
    await page.locator('header').click()
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    expect(await tpsFileEditor.getCurrentPaletteIndex()).toBe(2)

    await page.keyboard.press('ArrowUp')
    expect(await tpsFileEditor.getCurrentPaletteIndex()).toBe(1)
  })

  test('should not navigate above first palette', async ({ tpsFileEditor, page }) => {
    await page.locator('header').click()
    await page.keyboard.press('ArrowUp')
    expect(await tpsFileEditor.getCurrentPaletteIndex()).toBe(0)
  })

  test('should add palette with + key', async ({ tpsFileEditor, page }) => {
    await page.locator('header').click()
    await page.keyboard.press('+')
    await expect(page.getByTestId('ColourPaletteEditor Component')).toBeVisible()
  })

  test('should open palette editor with Enter key', async ({ tpsFileEditor, page }) => {
    await page.locator('header').click()
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('ColourPaletteEditor Component')).toBeVisible()
  })

  test('should delete current palette with Delete key', async ({ tpsFileEditor, page }) => {
    const initialCount = await tpsFileEditor.getPaletteCount()
    await page.locator('header').click()

    page.once('dialog', (dialog) => dialog.accept())
    await page.keyboard.press('Delete')

    const newCount = await tpsFileEditor.getPaletteCount()
    expect(newCount).toBe(initialCount - 1)
  })

  test('should move palette down with Shift+ArrowDown', async ({ tpsFileEditor, page }) => {
    const itemsBefore = await tpsFileEditor.getPaletteItems()
    const firstName = await itemsBefore[0].locator('.name').textContent()

    expect(await tpsFileEditor.getCurrentPaletteIndex()).toBe(0)
    await page.locator('header').click()
    await page.keyboard.press('Shift+ArrowDown')

    // First palette should have moved to index 1
    const itemsAfter = await tpsFileEditor.getPaletteItems()
    const secondNameAfter = await itemsAfter[1].locator('.name').textContent()
    expect(secondNameAfter?.trim()).toBe(firstName?.trim())
    expect(await tpsFileEditor.getCurrentPaletteIndex()).toBe(1)
  })

  test('should move palette up with Shift+ArrowUp', async ({ tpsFileEditor, page }) => {
    await page.locator('header').click()

    // Navigate to second palette
    await page.keyboard.press('ArrowDown')
    expect(await tpsFileEditor.getCurrentPaletteIndex()).toBe(1)

    const items = await tpsFileEditor.getPaletteItems()
    const secondName = await items[1].locator('.name').textContent()

    await page.keyboard.press('Shift+ArrowUp')

    // Second palette should have moved to index 0
    const itemsAfter = await tpsFileEditor.getPaletteItems()
    const firstNameAfter = await itemsAfter[0].locator('.name').textContent()
    expect(firstNameAfter?.trim()).toBe(secondName?.trim())
    expect(await tpsFileEditor.getCurrentPaletteIndex()).toBe(0)
  })
})
