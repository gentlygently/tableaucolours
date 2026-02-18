import { test, expect } from '../../fixtures/base'

test.describe('Discard Palette', () => {
  test('should show confirmation dialog when clicking discard', async ({
    colourPaletteEditor,
    page,
  }) => {
    await colourPaletteEditor.setColours(['#FF0000'])

    const dialogPromise = page.waitForEvent('dialog')
    // Don't await the click — it blocks until dialog is handled
    void colourPaletteEditor.clickDiscardPalette()
    const dialog = await dialogPromise

    expect(dialog.type()).toBe('confirm')
    expect(dialog.message()).toContain('delete')
    await dialog.dismiss()
  })

  test('should keep colours when dismissing confirmation dialog', async ({
    colourPaletteEditor,
    page,
  }) => {
    await colourPaletteEditor.setColours(['#FF0000', '#00FF00'])

    page.once('dialog', (dialog) => dialog.dismiss())
    await colourPaletteEditor.clickDiscardPalette()

    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(['#FF0000', '#00FF00'])
  })

  test('should reset to one default colour when accepting confirmation dialog', async ({
    colourPaletteEditor,
    page,
  }) => {
    await colourPaletteEditor.setColours(['#FF0000', '#00FF00'])

    page.once('dialog', (dialog) => dialog.accept())
    await colourPaletteEditor.clickDiscardPalette()

    // Vue app resets to 1 default white colour (store defaults to ['#FFFFFF'])
    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(['#FFFFFF'])
  })

  test('should not reset palette name when accepting confirmation dialog', async ({
    colourPaletteEditor,
    page,
  }) => {
    await colourPaletteEditor.setPaletteName('My Palette')
    expect(await colourPaletteEditor.getPaletteName()).toBe('My Palette')

    page.once('dialog', (dialog) => dialog.accept())
    await colourPaletteEditor.clickDiscardPalette()

    // Discard only resets colours, not the palette name
    expect(await colourPaletteEditor.getPaletteName()).toBe('My Palette')
  })
})
