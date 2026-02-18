import { expect } from '@playwright/test'
import { ImportModal } from './ImportModal.js'
import { ExportModal } from './ExportModal.js'
import { ImageExtractorModal } from './ImageExtractorModal.js'
import { ColourPaletteEditorTestIds } from '../../src/test-ids/ColourPaletteEditorTestIds.js'
import { ColourPaletteColourListTestIds } from '../../src/test-ids/ColourPaletteColourListTestIds.js'
import { ColourPaletteColourListItemTestIds } from '../../src/test-ids/ColourPaletteColourListItemTestIds.js'
import { ColourPaletteTypeSelectorTestIds } from '../../src/test-ids/ColourPaletteTypeSelectorTestIds.js'
import { ColourPickerTestIds } from '../../src/test-ids/ColourPickerTestIds.js'
import { ImageCanvasTestIds } from '../../src/test-ids/ImageCanvasTestIds.js'
import { ScalableImageTestIds } from '../../src/test-ids/ScalableImageTestIds.js'
import { ImageZoomTestIds } from '../../src/test-ids/ImageZoomTestIds.js'

export class ColourPaletteEditor {
  constructor(page) {
    this.page = page
    this.importModal = new ImportModal(page)
    this.exportModal = new ExportModal(page)
    this.imageExtractorModal = new ImageExtractorModal(page)
  }

  get component() {
    return this.page.getByTestId(ColourPaletteEditorTestIds.Self)
  }

  getPaletteNameInput() {
    return this.page.locator('input#name')
  }

  async setPaletteName(name) {
    const input = this.getPaletteNameInput()
    await input.clear()
    await input.fill(name)
  }

  async getPaletteName() {
    return this.getPaletteNameInput().inputValue()
  }

  async getColourItems() {
    return this.page.getByTestId(ColourPaletteColourListItemTestIds.Self).all()
  }

  async getColourCount() {
    return this.page.getByTestId(ColourPaletteColourListItemTestIds.Self).count()
  }

  async getColours() {
    const items = await this.getColourItems()
    const colours = []
    for (const item of items) {
      const swatch = item.getByTestId(ColourPaletteColourListItemTestIds.Swatch)
      const backgroundColor = await swatch.evaluate(
        (el) => el.ownerDocument.defaultView.getComputedStyle(el).backgroundColor,
      )
      const rgbMatch = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(backgroundColor)
      if (!rgbMatch) {
        throw new Error(`Could not parse background colour: "${backgroundColor}"`)
      }
      const hex =
        '#' +
        [rgbMatch[1], rgbMatch[2], rgbMatch[3]]
          .map((x) => {
            const h = parseInt(x, 10).toString(16)
            return h.length === 1 ? '0' + h : h
          })
          .join('')
          .toUpperCase()
      colours.push(hex)
    }
    return colours
  }

  async setColour(index, hex) {
    const items = await this.getColourItems()
    if (!items[index]) {
      throw new Error(`Colour index ${index} out of bounds (${items.length} items)`)
    }
    const swatch = items[index].getByTestId(ColourPaletteColourListItemTestIds.Swatch)
    await swatch.dblclick()

    const colourPicker = items[index].getByTestId(ColourPickerTestIds.Self)
    await colourPicker.waitFor({ state: 'visible' })

    // Target the hex input inside @ckpack/vue-color's Sketch picker
    const hexInput = colourPicker.locator('input').first()
    await hexInput.clear()
    await hexInput.fill(hex.replace('#', ''))

    // Click Done to apply and close the picker
    await colourPicker.locator('.colourpicker-done').click()
    await colourPicker.waitFor({ state: 'hidden' })
  }

  async setColours(hexColors) {
    const initialCount = await this.getColourCount()

    if (initialCount > 0) {
      // "Delete all colours" actually resets to 1 white colour (store defaults to ['#FFFFFF'])
      this.page.once('dialog', (dialog) => dialog.accept())
      await this.page.locator('button[title="Delete all colours"]').click()
      await expect(
        this.page.getByTestId(ColourPaletteColourListItemTestIds.Self),
      ).toHaveCount(1)
    }

    // Set the first colour (which already exists after discard)
    if (hexColors.length > 0) {
      await this.setColour(0, hexColors[0])
    }

    // Click body to ensure keyboard shortcuts work
    await this.page.locator('body').click()

    // Add remaining colours via keyboard
    for (let i = 1; i < hexColors.length; i++) {
      await this.page.keyboard.press('+')
      await this.page
        .getByTestId(ColourPaletteColourListItemTestIds.Self)
        .nth(i)
        .waitFor({ state: 'visible', timeout: 5000 })
      await this.setColour(i, hexColors[i])
    }
  }

  async getSelectedColourIndex() {
    const items = await this.getColourItems()
    let selectedIndex = -1
    let selectedCount = 0
    for (let index = 0; index < items.length; index++) {
      const classList = await items[index].getAttribute('class')
      if (classList?.includes('colour--selected')) {
        selectedIndex = index
        selectedCount++
      }
    }
    if (selectedCount > 1) {
      throw new Error(`Expected at most one selected colour, but found ${selectedCount}`)
    }
    return selectedIndex
  }

  async clickColour(index) {
    const items = await this.getColourItems()
    if (!items[index]) {
      throw new Error(`Colour index ${index} out of bounds (${items.length} items)`)
    }
    await items[index].click()
  }

  async selectColour(index) {
    await this.clickColour(index)
    const colourItem = this.page
      .getByTestId(ColourPaletteColourListItemTestIds.Self)
      .nth(index)
    await expect(colourItem).toHaveClass(/selected/)
  }

  async clickAddColour() {
    await this.page.locator('button[title="Add colour (+)"]').click()
  }

  async clickRemoveColour(index) {
    const items = await this.getColourItems()
    if (!items[index]) {
      throw new Error(`Colour index ${index} out of bounds (${items.length} items)`)
    }
    await items[index].hover()
    await items[index].getByTestId(ColourPaletteColourListItemTestIds.Remove).click()
  }

  async addColoursWithKeyboard(count) {
    // Ensure focus is on body for keyboard shortcuts
    await this.page.locator('body').click()
    const initialCount = await this.getColourCount()
    for (let i = 0; i < count; i++) {
      await this.page.keyboard.press('+')
    }
    const expectedCount = Math.min(initialCount + count, 20)
    if (expectedCount > initialCount) {
      await this.page
        .getByTestId(ColourPaletteColourListItemTestIds.Self)
        .nth(expectedCount - 1)
        .waitFor({ state: 'attached', timeout: 5000 })
    }
  }

  async clickImport() {
    await this.page.locator('button[title="Import XML"]').click()
  }

  async clickExport() {
    await this.page.locator('button[title="Get XML"]').click()
  }

  async clickDiscardPalette() {
    await this.page.locator('button[title="Delete all colours"]').click()
  }

  async clickReverseColours() {
    await this.page.locator('button[title="Reverse colours (R)"]').click()
  }

  async clickBack() {
    await this.page.locator('button:has-text("Back")').click()
  }

  // Type selector
  get typeSelector() {
    return this.page.getByTestId(ColourPaletteTypeSelectorTestIds.Self)
  }

  get typeSelectorList() {
    return this.page.getByTestId(ColourPaletteTypeSelectorTestIds.List)
  }

  async setType(type) {
    await this.typeSelector.click()
    await this.typeSelectorList.getByText(type).click()
  }

  async getSelectedType() {
    const selectedElement = this.typeSelector.getByTestId(
      ColourPaletteTypeSelectorTestIds.Selected,
    )
    const label = selectedElement.locator('label')
    return label.textContent()
  }

  async focusTypeSelector() {
    const selectedElement = this.typeSelector.getByTestId(
      ColourPaletteTypeSelectorTestIds.Selected,
    )
    const selectDiv = selectedElement.locator('..')
    await selectDiv.focus()
  }

  // Colour grid
  get colourList() {
    return this.page.getByTestId(ColourPaletteColourListTestIds.Self)
  }

  // Image-related
  get fileInput() {
    return this.page.locator('input[type="file"]')
  }

  get imageCanvas() {
    return this.page.getByTestId(ImageCanvasTestIds.Self)
  }

  get imageCanvasElement() {
    return this.page.getByTestId(ScalableImageTestIds.Canvas)
  }

  get extractButton() {
    return this.page.locator('button[title="Extract colours from image (magic!)"]')
  }

  get imageZoomComponent() {
    return this.page.getByTestId(ImageZoomTestIds.Self)
  }

  get imageZoomSlider() {
    return this.page.getByTestId(ImageZoomTestIds.Slider)
  }

  get imageZoomInButton() {
    return this.page.getByTestId(ImageZoomTestIds.ZoomIn)
  }

  get imageZoomOutButton() {
    return this.page.getByTestId(ImageZoomTestIds.ZoomOut)
  }

  get imageZoomPercentage() {
    return this.page.getByTestId(ImageZoomTestIds.Percentage)
  }

  get imageCanvasHint() {
    return this.page.getByTestId(ImageCanvasTestIds.Hint)
  }

  get imageDropTarget() {
    return this.page.getByTestId(ImageCanvasTestIds.DropTarget)
  }

  get openImageButton() {
    return this.page.locator('button[title="Open image..."]')
  }

  async getZoomPercentage() {
    const text = await this.imageZoomPercentage.textContent()
    return parseInt(text?.replace('%', '') ?? '100', 10)
  }

  async getImageDimensions() {
    const box = await this.imageCanvasElement.boundingBox()
    if (!box) throw new Error('Image canvas element not found or not visible')
    return { width: box.width, height: box.height }
  }

  async getHintText() {
    return this.imageCanvasHint.textContent()
  }

  async uploadImage(imagePath) {
    const fileChooserPromise = this.page.waitForEvent('filechooser')
    await this.openImageButton.click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(imagePath)
  }

  async clickOpenImageButton() {
    const fileChooserPromise = this.page.waitForEvent('filechooser', { timeout: 5000 })
    await this.openImageButton.click()
    return await fileChooserPromise
  }

  async dragColour(fromIndex, toIndex) {
    const items = await this.getColourItems()
    if (!items[fromIndex]) {
      throw new Error(`Source index ${fromIndex} out of bounds (${items.length} items)`)
    }
    if (!items[toIndex]) {
      throw new Error(`Target index ${toIndex} out of bounds (${items.length} items)`)
    }
    await items[fromIndex].dragTo(items[toIndex])
  }
}
