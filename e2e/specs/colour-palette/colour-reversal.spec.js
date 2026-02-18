import { test, expect } from '../../fixtures/base'

test.describe('Colour Reversal', () => {
  test('should reverse colour order with the R key', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])

    await colourPaletteEditor.page.locator('body').click()
    await colourPaletteEditor.page.keyboard.press('r')

    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(['#0000FF', '#00FF00', '#FF0000'])
  })

  test('should reverse colour order with the reverse button', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])

    await colourPaletteEditor.clickReverseColours()

    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(['#0000FF', '#00FF00', '#FF0000'])
  })

  test('should reverse back to original order when reversed twice', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])

    await colourPaletteEditor.clickReverseColours()
    await colourPaletteEditor.clickReverseColours()

    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(['#FF0000', '#00FF00', '#0000FF'])
  })

  test('should not change order when only one colour exists', async ({
    colourPaletteEditor,
  }) => {
    const initialColours = await colourPaletteEditor.getColours()
    expect(initialColours).toHaveLength(1)

    await colourPaletteEditor.clickReverseColours()

    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(initialColours)
  })
})
