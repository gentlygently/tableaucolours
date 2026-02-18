import { test, expect } from '../../fixtures/base.js'

test.describe('Palette Editing', () => {
  test('should show placeholder text in name input', async ({ colourPaletteEditor }) => {
    const nameInput = colourPaletteEditor.getPaletteNameInput()
    await expect(nameInput).toHaveAttribute('placeholder', 'Enter a palette name')
    await expect(nameInput).toHaveValue('')
  })

  test('should allow editing the palette name', async ({ colourPaletteEditor }) => {
    await colourPaletteEditor.setPaletteName('My Palette')
    expect(await colourPaletteEditor.getPaletteName()).toBe('My Palette')
  })

  test('should start with one default colour', async ({ colourPaletteEditor }) => {
    expect(await colourPaletteEditor.getColourCount()).toBe(1)
  })

  test('should add a colour when clicking the add button', async ({ colourPaletteEditor }) => {
    await colourPaletteEditor.clickAddColour()
    expect(await colourPaletteEditor.getColourCount()).toBe(2)
  })

  test('should add a colour when pressing +', async ({ page, colourPaletteEditor }) => {
    await page.locator('body').click()
    await page.keyboard.press('+')
    expect(await colourPaletteEditor.getColourCount()).toBe(2)
  })

  test('should remove a colour', async ({ colourPaletteEditor }) => {
    expect(await colourPaletteEditor.getColourCount()).toBe(1)
    await colourPaletteEditor.clickRemoveColour(0)
    expect(await colourPaletteEditor.getColourCount()).toBe(0)
  })

  test('should select a colour when clicking it', async ({ colourPaletteEditor }) => {
    await colourPaletteEditor.addColoursWithKeyboard(2)
    await colourPaletteEditor.selectColour(1)
    expect(await colourPaletteEditor.getSelectedColourIndex()).toBe(1)
  })

  test('should limit palette to 20 colours', async ({ colourPaletteEditor }) => {
    await colourPaletteEditor.addColoursWithKeyboard(19)
    expect(await colourPaletteEditor.getColourCount()).toBe(20)

    // The add button should be disabled now
    await expect(
      colourPaletteEditor.page.locator('button[title="Add colour (+)"]'),
    ).toBeDisabled()
  })

  test('should set colour via colour picker', async ({ colourPaletteEditor }) => {
    await colourPaletteEditor.clickAddColour()
    await colourPaletteEditor.setColour(0, '#FF0000')
    const colours = await colourPaletteEditor.getColours()
    expect(colours[0]).toBe('#FF0000')
  })

  test('should navigate back to start menu', async ({ page, colourPaletteEditor }) => {
    await colourPaletteEditor.clickBack()
    await expect(colourPaletteEditor.component).not.toBeVisible()
  })
})
