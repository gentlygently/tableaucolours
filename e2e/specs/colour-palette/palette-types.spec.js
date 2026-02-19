import { test, expect } from '../../fixtures/base.js'

test.describe('Palette Types', () => {
  test('should default to regular type', async ({ colourPaletteEditor }) => {
    const selectedType = await colourPaletteEditor.getSelectedType()
    expect(selectedType.trim()).toContain('Regular')
  })

  test('should display all three palette types when clicked', async ({ colourPaletteEditor }) => {
    await colourPaletteEditor.typeSelector.click()
    const list = colourPaletteEditor.typeSelectorList
    await expect(list).toBeVisible()
    await expect(list.getByText('Regular')).toBeVisible()
    await expect(list.getByText('Sequential')).toBeVisible()
    await expect(list.getByText('Diverging')).toBeVisible()
  })

  test('should switch to sequential type', async ({ colourPaletteEditor }) => {
    await colourPaletteEditor.setType('Sequential')
    const selectedType = await colourPaletteEditor.getSelectedType()
    expect(selectedType.trim()).toContain('Sequential')
  })

  test('should switch to diverging type', async ({ colourPaletteEditor }) => {
    await colourPaletteEditor.setType('Diverging')
    const selectedType = await colourPaletteEditor.getSelectedType()
    expect(selectedType.trim()).toContain('Diverging')
  })
})
