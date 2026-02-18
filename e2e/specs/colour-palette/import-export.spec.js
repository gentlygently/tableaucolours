import { test, expect } from '../../fixtures/base.js'

test.describe('Palette Export', () => {
  test('should open export modal', async ({ colourPaletteEditor }) => {
    await colourPaletteEditor.clickExport()
    await expect(colourPaletteEditor.exportModal.component).toBeVisible()
  })

  test('should display XML code with correct palette data', async ({ colourPaletteEditor }) => {
    await test.step('configure palette', async () => {
      await colourPaletteEditor.setPaletteName('Test Export Palette')
      await colourPaletteEditor.setType('Sequential')
      await colourPaletteEditor.setColour(0, '#FF0000')
      await colourPaletteEditor.clickAddColour()
      await colourPaletteEditor.setColour(1, '#00FF00')
      await colourPaletteEditor.clickAddColour()
      await colourPaletteEditor.setColour(2, '#0000FF')
    })

    await test.step('export and verify XML', async () => {
      await colourPaletteEditor.clickExport()
      await expect(colourPaletteEditor.exportModal.component).toBeVisible()
      const codeText = await colourPaletteEditor.exportModal.getCode()
      expect(codeText?.trim()).toBe(
        `<color-palette name="Test Export Palette" type="ordered-sequential">\n` +
          `    <color>#FF0000</color>\n` +
          `    <color>#00FF00</color>\n` +
          `    <color>#0000FF</color>\n` +
          `</color-palette>`,
      )
    })
  })

  test('should verify clipboard feedback when copying', async ({ colourPaletteEditor }) => {
    await test.step('open export modal', async () => {
      await colourPaletteEditor.clickExport()
      await expect(colourPaletteEditor.exportModal.component).toBeVisible()
    })

    await test.step('verify initial button state', async () => {
      await expect(colourPaletteEditor.exportModal.copyButton).toHaveText('Copy to clipboard')
    })

    await test.step('click copy and verify feedback', async () => {
      await colourPaletteEditor.exportModal.clickCopy()
      await expect(colourPaletteEditor.exportModal.copyButton).toContainText('Copied')
    })
  })

  ;[
    { selectedType: 'Regular', expectedXmlType: 'regular' },
    { selectedType: 'Sequential', expectedXmlType: 'ordered-sequential' },
    { selectedType: 'Diverging', expectedXmlType: 'ordered-diverging' },
  ].forEach(({ selectedType, expectedXmlType }) => {
    test(`should export ${selectedType} palette with correct type`, async ({
      colourPaletteEditor,
    }) => {
      await colourPaletteEditor.setType(selectedType)
      await colourPaletteEditor.clickExport()

      const xmlContent = await colourPaletteEditor.exportModal.getCode()
      expect(xmlContent).toContain(`type="${expectedXmlType}"`)
    })
  })
})

test.describe('Palette Import', () => {
  test('should open import modal', async ({ colourPaletteEditor }) => {
    await colourPaletteEditor.clickImport()
    await expect(colourPaletteEditor.importModal.component).toBeVisible()
  })

  test('should have import text area', async ({ colourPaletteEditor }) => {
    await colourPaletteEditor.clickImport()
    await expect(colourPaletteEditor.importModal.codeTextarea).toBeVisible()
  })

  test('should import valid XML palette with correct colours', async ({
    colourPaletteEditor,
  }) => {
    const validXML = `<color-palette name="Test Palette" type="regular">
  <color>#FF0000</color>
  <color>#00FF00</color>
  <color>#0000FF</color>
</color-palette>`

    await colourPaletteEditor.clickImport()
    await colourPaletteEditor.importModal.setCode(validXML)
    await expect(colourPaletteEditor.importModal.importButton).toBeEnabled()

    await colourPaletteEditor.importModal.clickImport()

    await expect(colourPaletteEditor.importModal.component).not.toBeVisible()
    const name = await colourPaletteEditor.getPaletteName()
    expect(name).toBe('Test Palette')
    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(['#FF0000', '#00FF00', '#0000FF'])
  })

  ;[
    { xmlType: 'regular', expectedType: 'Regular' },
    { xmlType: 'ordered-sequential', expectedType: 'Sequential' },
    { xmlType: 'ordered-diverging', expectedType: 'Diverging' },
  ].forEach(({ xmlType, expectedType }) => {
    test(`should import ${expectedType} palette type correctly`, async ({
      colourPaletteEditor,
    }) => {
      const xml = `<color-palette name="Test" type="${xmlType}">
  <color>#FF0000</color>
</color-palette>`

      await colourPaletteEditor.clickImport()
      await colourPaletteEditor.importModal.setCode(xml)
      await colourPaletteEditor.importModal.clickImport()

      const selectedType = await colourPaletteEditor.getSelectedType()
      expect(selectedType.trim()).toContain(expectedType)
    })
  })

  test('should show validation error for invalid XML', async ({ colourPaletteEditor }) => {
    await colourPaletteEditor.clickImport()
    await colourPaletteEditor.importModal.setCode('invalid xml content')

    await expect(colourPaletteEditor.importModal.importButton).toBeDisabled()
    await expect(colourPaletteEditor.importModal.validationMessage).toBeVisible()
  })

  test('should cancel import', async ({ colourPaletteEditor }) => {
    await colourPaletteEditor.clickImport()
    await expect(colourPaletteEditor.importModal.component).toBeVisible()

    await colourPaletteEditor.importModal.clickCancel()

    await expect(colourPaletteEditor.importModal.component).not.toBeVisible()
  })
})
