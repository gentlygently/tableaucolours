import { test, expect } from '../../fixtures/base.js'

test.describe('Keyboard Shortcuts', () => {
  test.describe('Colour Grid Navigation', () => {
    test.describe('Standard Navigation', () => {
      test('should move selection down with ArrowDown', async ({ page, colourPaletteEditor }) => {
        await colourPaletteEditor.addColoursWithKeyboard(4)
        await colourPaletteEditor.selectColour(0)

        await page.keyboard.press('ArrowDown')

        expect(await colourPaletteEditor.getSelectedColourIndex()).toBe(1)
      })

      test('should move selection up with ArrowUp', async ({ page, colourPaletteEditor }) => {
        await colourPaletteEditor.addColoursWithKeyboard(4)
        await colourPaletteEditor.selectColour(2)

        await page.keyboard.press('ArrowUp')

        expect(await colourPaletteEditor.getSelectedColourIndex()).toBe(1)
      })

      test('should move selection right to next column with ArrowRight', async ({
        page,
        colourPaletteEditor,
      }) => {
        await colourPaletteEditor.addColoursWithKeyboard(5)
        await colourPaletteEditor.selectColour(0)

        await page.keyboard.press('ArrowRight')

        expect(await colourPaletteEditor.getSelectedColourIndex()).toBe(5)
      })

      test('should move selection left to previous column with ArrowLeft', async ({
        page,
        colourPaletteEditor,
      }) => {
        await colourPaletteEditor.addColoursWithKeyboard(9)
        await colourPaletteEditor.selectColour(7)

        await page.keyboard.press('ArrowLeft')

        expect(await colourPaletteEditor.getSelectedColourIndex()).toBe(2)
      })
    })

    test.describe('Boundary Cases (No-Op)', () => {
      test('should not change selection when at top and pressing ArrowUp', async ({
        page,
        colourPaletteEditor,
      }) => {
        await colourPaletteEditor.addColoursWithKeyboard(4)
        await colourPaletteEditor.selectColour(0)

        await page.keyboard.press('ArrowUp')

        expect(await colourPaletteEditor.getSelectedColourIndex()).toBe(0)
      })

      test('should not change selection when at first column and pressing ArrowLeft', async ({
        page,
        colourPaletteEditor,
      }) => {
        await colourPaletteEditor.addColoursWithKeyboard(4)
        await colourPaletteEditor.selectColour(0)

        await page.keyboard.press('ArrowLeft')

        expect(await colourPaletteEditor.getSelectedColourIndex()).toBe(0)
      })

      test('should not change selection when at bottom of column and pressing ArrowDown', async ({
        page,
        colourPaletteEditor,
      }) => {
        await colourPaletteEditor.addColoursWithKeyboard(4)
        await colourPaletteEditor.selectColour(4)

        await page.keyboard.press('ArrowDown')

        expect(await colourPaletteEditor.getSelectedColourIndex()).toBe(4)
      })

      test('should not change selection when pressing ArrowRight to empty slot', async ({
        page,
        colourPaletteEditor,
      }) => {
        await colourPaletteEditor.addColoursWithKeyboard(4)
        await colourPaletteEditor.selectColour(2)

        await page.keyboard.press('ArrowRight')

        expect(await colourPaletteEditor.getSelectedColourIndex()).toBe(2)
      })

      test('should not wrap to next column when at bottom of column', async ({
        page,
        colourPaletteEditor,
      }) => {
        await colourPaletteEditor.addColoursWithKeyboard(4)
        await colourPaletteEditor.selectColour(4)

        await page.keyboard.press('ArrowDown')

        expect(await colourPaletteEditor.getSelectedColourIndex()).toBe(4)
      })
    })
  })

  test.describe('Colour Reordering', () => {
    test('should move colour down with Shift+ArrowDown', async ({
      page,
      colourPaletteEditor,
    }) => {
      await test.step('setup colours', async () => {
        await colourPaletteEditor.setColours([
          '#FF0000',
          '#00FF00',
          '#0000FF',
          '#FFFF00',
          '#FF00FF',
          '#00FFFF',
        ])
      })

      await test.step('select and move', async () => {
        await colourPaletteEditor.selectColour(0)
        await page.keyboard.press('Shift+ArrowDown')
        const colours = await colourPaletteEditor.getColours()
        expect(colours).toEqual([
          '#00FF00',
          '#FF0000',
          '#0000FF',
          '#FFFF00',
          '#FF00FF',
          '#00FFFF',
        ])
        expect(await colourPaletteEditor.getSelectedColourIndex()).toBe(1)
      })
    })

    test('should move colour up with Shift+ArrowUp', async ({ page, colourPaletteEditor }) => {
      await test.step('setup colours', async () => {
        await colourPaletteEditor.setColours([
          '#FF0000',
          '#00FF00',
          '#0000FF',
          '#FFFF00',
          '#FF00FF',
          '#00FFFF',
        ])
      })

      await test.step('select and move', async () => {
        await colourPaletteEditor.selectColour(2)
        await page.keyboard.press('Shift+ArrowUp')
        const colours = await colourPaletteEditor.getColours()
        expect(colours).toEqual([
          '#FF0000',
          '#0000FF',
          '#00FF00',
          '#FFFF00',
          '#FF00FF',
          '#00FFFF',
        ])
        expect(await colourPaletteEditor.getSelectedColourIndex()).toBe(1)
      })
    })

    test('should move colour right with Shift+ArrowRight', async ({
      page,
      colourPaletteEditor,
    }) => {
      await test.step('setup colours', async () => {
        await colourPaletteEditor.setColours([
          '#FF0000',
          '#00FF00',
          '#0000FF',
          '#FFFF00',
          '#FF00FF',
          '#00FFFF',
        ])
      })

      await test.step('select and move', async () => {
        await colourPaletteEditor.selectColour(0)
        await page.keyboard.press('Shift+ArrowRight')
        const colours = await colourPaletteEditor.getColours()
        expect(colours).toEqual([
          '#00FF00',
          '#0000FF',
          '#FFFF00',
          '#FF00FF',
          '#00FFFF',
          '#FF0000',
        ])
        expect(await colourPaletteEditor.getSelectedColourIndex()).toBe(5)
      })
    })

    test('should move colour left with Shift+ArrowLeft', async ({
      page,
      colourPaletteEditor,
    }) => {
      await test.step('setup colours', async () => {
        await colourPaletteEditor.setColours([
          '#FF0000',
          '#00FF00',
          '#0000FF',
          '#FFFF00',
          '#FF00FF',
          '#00FFFF',
          '#808080',
        ])
      })

      await test.step('select and move', async () => {
        await colourPaletteEditor.selectColour(6)
        await page.keyboard.press('Shift+ArrowLeft')
        const colours = await colourPaletteEditor.getColours()
        expect(colours).toEqual([
          '#FF0000',
          '#808080',
          '#00FF00',
          '#0000FF',
          '#FFFF00',
          '#FF00FF',
          '#00FFFF',
        ])
        expect(await colourPaletteEditor.getSelectedColourIndex()).toBe(1)
      })
    })

    test('should not move when at boundary', async ({ page, colourPaletteEditor }) => {
      await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])
      await colourPaletteEditor.selectColour(0)

      await page.keyboard.press('Shift+ArrowUp')
      const colours = await colourPaletteEditor.getColours()
      expect(colours).toEqual(['#FF0000', '#00FF00', '#0000FF'])
      expect(await colourPaletteEditor.getSelectedColourIndex()).toBe(0)
    })
  })

  test.describe('Colour Deletion', () => {
    test('should delete selected colour with Delete key', async ({
      page,
      colourPaletteEditor,
    }) => {
      await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])
      await colourPaletteEditor.selectColour(1)

      await page.keyboard.press('Delete')

      const colours = await colourPaletteEditor.getColours()
      expect(colours).toEqual(['#FF0000', '#0000FF'])
    })

    test('should delete selected colour with Backspace key', async ({
      page,
      colourPaletteEditor,
    }) => {
      await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])
      await colourPaletteEditor.selectColour(1)

      await page.keyboard.press('Backspace')

      const colours = await colourPaletteEditor.getColours()
      expect(colours).toEqual(['#FF0000', '#0000FF'])
    })
  })

  test.describe('Type Selector Navigation', () => {
    test('should navigate type selector with ArrowDown', async ({
      page,
      colourPaletteEditor,
    }) => {
      const initialType = await colourPaletteEditor.getSelectedType()
      expect(initialType.trim()).toContain('Regular')

      await colourPaletteEditor.focusTypeSelector()
      await page.keyboard.press('ArrowDown')

      const newType = await colourPaletteEditor.getSelectedType()
      expect(newType.trim()).toContain('Sequential')
    })

    test('should navigate type selector with ArrowUp', async ({
      page,
      colourPaletteEditor,
    }) => {
      await colourPaletteEditor.setType('Sequential')
      await colourPaletteEditor.focusTypeSelector()
      await page.keyboard.press('ArrowUp')

      const newType = await colourPaletteEditor.getSelectedType()
      expect(newType.trim()).toContain('Regular')
    })

    test('should toggle type selector with Enter', async ({ page, colourPaletteEditor }) => {
      await colourPaletteEditor.focusTypeSelector()

      await page.keyboard.press('Enter')
      await expect(colourPaletteEditor.typeSelectorList).toBeVisible()

      await page.keyboard.press('Enter')
      await expect(colourPaletteEditor.typeSelectorList).not.toBeVisible()
    })
  })

  test.describe('Add Colour Shortcut', () => {
    test('should add new colour with + key', async ({ page, colourPaletteEditor }) => {
      const initialCount = await colourPaletteEditor.getColourCount()
      await page.locator('body').click()
      await page.keyboard.press('+')

      const newCount = await colourPaletteEditor.getColourCount()
      expect(newCount).toBe(initialCount + 1)
      const colours = await colourPaletteEditor.getColours()
      expect(colours[newCount - 1]).toBe('#FFFFFF')
    })

    test('should not add colour when at maximum (20)', async ({
      page,
      colourPaletteEditor,
    }) => {
      await colourPaletteEditor.addColoursWithKeyboard(19)
      const count = await colourPaletteEditor.getColourCount()
      expect(count).toBe(20)

      const coloursBeforeAdd = await colourPaletteEditor.getColours()
      await page.keyboard.press('+')

      expect(await colourPaletteEditor.getColourCount()).toBe(20)
      const coloursAfterAdd = await colourPaletteEditor.getColours()
      expect(coloursAfterAdd).toEqual(coloursBeforeAdd)
    })
  })
})
