import { ColourPaletteExtractColoursTestIds } from '../../src/test-ids/ColourPaletteExtractColoursTestIds.js'

export class ImageExtractorModal {
  constructor(page) {
    this.page = page
  }

  get component() {
    return this.page.getByTestId(ColourPaletteExtractColoursTestIds.Self)
  }

  get numberInput() {
    return this.page.getByTestId(ColourPaletteExtractColoursTestIds.NumberInput)
  }

  get extractButton() {
    return this.component.locator('button.extractcolours-button--extract')
  }

  get cancelButton() {
    return this.component.locator('button.extractcolours-button--cancel')
  }

  get replaceRadio() {
    return this.component.locator('#replaceColours')
  }

  get addRadio() {
    return this.component.locator('#addColours')
  }

  async setNumberOfColours(count) {
    await this.numberInput.fill(String(count))
  }

  async clickExtract() {
    await this.extractButton.click()
  }

  async clickCancel() {
    await this.cancelButton.click()
  }
}
