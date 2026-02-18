import { test, expect } from '../../fixtures/base'

test.describe('Colour Palette Drag and Drop Reordering', () => {
  test('should reorder colours by dragging', async ({ colourPaletteEditor }) => {
    await test.step('set up colours', async () => {
      await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])
    })

    await test.step('drag first colour to third position', async () => {
      await colourPaletteEditor.dragColour(0, 2)
    })

    await test.step('verify reordered colours', async () => {
      const colours = await colourPaletteEditor.getColours()
      expect(colours).toEqual(['#00FF00', '#0000FF', '#FF0000'])
    })
  })

  test('should cancel reorder when dropped outside list', async ({
    colourPaletteEditor,
    page,
  }) => {
    await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])
    const originalColours = await colourPaletteEditor.getColours()

    const items = await colourPaletteEditor.getColourItems()
    const sourceBox = await items[0].boundingBox()
    const listBox = await colourPaletteEditor.colourList.boundingBox()

    if (sourceBox && listBox) {
      await page.mouse.move(
        sourceBox.x + sourceBox.width / 2,
        sourceBox.y + sourceBox.height / 2,
      )
      await page.mouse.down()
      // Move far outside the list area
      await page.mouse.move(
        listBox.x + listBox.width + 200,
        listBox.y + listBox.height + 200,
      )
      await page.mouse.up()
    }

    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(originalColours)
  })

  test('should reorder with four colours', async ({ colourPaletteEditor }) => {
    await colourPaletteEditor.setColours([
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FFFF00',
    ])

    await colourPaletteEditor.dragColour(0, 2)

    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(['#00FF00', '#0000FF', '#FF0000', '#FFFF00'])
  })

  test('should do nothing when colour is dropped on itself', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])
    const originalColours = await colourPaletteEditor.getColours()

    await colourPaletteEditor.dragColour(1, 1)

    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(originalColours)
  })

  test('should move colour to end when dragged to last position', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])

    await colourPaletteEditor.dragColour(0, 2)

    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(['#00FF00', '#0000FF', '#FF0000'])
  })

  test('should support multiple consecutive reorders', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.setColours([
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FFFF00',
    ])

    await test.step('first reorder: move first to third', async () => {
      await colourPaletteEditor.dragColour(0, 2)
      const colours = await colourPaletteEditor.getColours()
      expect(colours).toEqual(['#00FF00', '#0000FF', '#FF0000', '#FFFF00'])
    })

    await test.step('second reorder: move last to first', async () => {
      await colourPaletteEditor.dragColour(3, 0)
      const colours = await colourPaletteEditor.getColours()
      expect(colours).toEqual(['#FFFF00', '#00FF00', '#0000FF', '#FF0000'])
    })
  })

  test('should move colour from middle to start', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])

    await colourPaletteEditor.dragColour(1, 0)

    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(['#00FF00', '#FF0000', '#0000FF'])
  })

  test('should move last colour to middle', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])

    await colourPaletteEditor.dragColour(2, 1)

    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(['#FF0000', '#0000FF', '#00FF00'])
  })
})
